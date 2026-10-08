require('dotenv').config();

const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const port = Number(process.env.PORT) || 3000;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required. Copy .env.example to .env and configure PostgreSQL.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false
});

app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Return doctors and their currently available appointment slots.
app.get('/api/doctors', async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        d.id,
        u.full_name,
        d.specialty,
        d.experience_years,
        d.price_per_visit,
        d.photo_url,
        COALESCE(
          json_agg(
            json_build_object(
              'id', s.id,
              'date', to_char(s.available_date, 'YYYY-MM-DD'),
              'time', to_char(s.available_time, 'HH24:MI')
            )
            ORDER BY s.available_date, s.available_time
          ) FILTER (WHERE s.id IS NOT NULL),
          '[]'::json
        ) AS available_slots
      FROM doctors d
      JOIN users u ON u.id = d.user_id
      LEFT JOIN schedules s
        ON s.doctor_id = d.id
        AND s.is_booked = FALSE
        AND (s.available_date + s.available_time) > NOW()
      WHERE d.is_active = TRUE
      GROUP BY d.id, u.full_name
      ORDER BY u.full_name
    `);

    res.json({ doctors: rows });
  } catch (error) {
    next(error);
  }
});

// Book a slot in a transaction so concurrent requests cannot reserve it twice.
app.post('/api/appointments', async (req, res, next) => {
  const { schedule_id: scheduleId, full_name: fullName, phone } = req.body || {};
  const normalizedName = typeof fullName === 'string' ? fullName.trim() : '';
  const normalizedPhone = typeof phone === 'string' ? phone.trim() : '';
  const parsedScheduleId = Number(scheduleId);

  if (!Number.isSafeInteger(parsedScheduleId) || parsedScheduleId < 1) {
    return res.status(400).json({ error: 'Select a valid appointment time.' });
  }
  if (normalizedName.length < 2 || normalizedName.length > 120) {
    return res.status(400).json({ error: 'Enter a name between 2 and 120 characters.' });
  }
  if (!/^[+0-9().\-\s]{7,32}$/.test(normalizedPhone)) {
    return res.status(400).json({ error: 'Enter a valid phone number.' });
  }

  let client;
  try {
    client = await pool.connect();
    await client.query('BEGIN');

    const { rows: schedules } = await client.query(
      `SELECT s.id, s.doctor_id
       FROM schedules s
       JOIN doctors d ON d.id = s.doctor_id AND d.is_active = TRUE
       WHERE s.id = $1
         AND s.is_booked = FALSE
         AND (s.available_date + s.available_time) > NOW()
       FOR UPDATE OF s`,
      [parsedScheduleId]
    );

    if (schedules.length === 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'That appointment time is no longer available. Please choose another.' });
    }

    const { rows: patients } = await client.query(
      `INSERT INTO users (full_name, phone, role)
       VALUES ($1, $2, 'patient')
       ON CONFLICT (phone) DO UPDATE
         SET full_name = CASE
           WHEN users.role = 'patient' THEN EXCLUDED.full_name
           ELSE users.full_name
         END
       WHERE users.role = 'patient'
       RETURNING id`,
      [normalizedName, normalizedPhone]
    );

    if (patients.length === 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'This phone number is associated with a non-patient account.' });
    }

    const doctorId = schedules[0].doctor_id;
    await client.query(
      'UPDATE schedules SET is_booked = TRUE WHERE id = $1',
      [parsedScheduleId]
    );
    const { rows: appointments } = await client.query(
      `INSERT INTO appointments (patient_id, doctor_id, schedule_id)
       VALUES ($1, $2, $3)
       RETURNING id, created_at`,
      [patients[0].id, doctorId, parsedScheduleId]
    );

    await client.query('COMMIT');
    res.status(201).json({
      message: 'Your appointment is confirmed.',
      appointment: appointments[0]
    });
  } catch (error) {
    if (client) {
      await client.query('ROLLBACK').catch((rollbackError) => {
        console.error('Appointment rollback failed:', rollbackError);
      });
    }
    next(error);
  } finally {
    if (client) client.release();
  }
});

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found.' });
});

// Centralized errors keep database details out of client responses.
app.use((error, req, res, next) => {
  console.error(error);
  if (res.headersSent) return next(error);
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Request body must contain valid JSON.' });
  }
  if (error.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Request body is too large.' });
  }
  res.status(500).json({ error: 'An unexpected server error occurred. Please try again.' });
});

const server = app.listen(port, () => {
  console.log(`Medical appointment app listening at http://localhost:${port}`);
});

async function shutdown() {
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
