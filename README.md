# Medora Medical Appointment Booking

A responsive, glassmorphism-style medical directory and appointment booking website built with vanilla HTML/CSS/JavaScript, Express, and PostgreSQL. The directory supports live search, specialty filtering, and Uzbek, Russian, and English interface languages.

## Project structure

```text
medical-appointment-booking/
├── database/
│   ├── schema.sql       # PostgreSQL tables, constraints, and indexes
│   └── seed.sql         # Optional demo doctors, photos, and upcoming slots
├── public/
│   └── index.html       # Self-contained responsive UI, styles, translations, filters, and booking
├── .env.example
├── .gitignore
├── package.json
└── server.js            # Express API and PostgreSQL transactions
```

## Requirements

- Node.js 18 or newer
- PostgreSQL 12 or newer

## Setup

1. Create a PostgreSQL database, for example `medical_appointments`.
2. Run the schema and (optionally) demo seed scripts:

   ```sh
   psql -d medical_appointments -f database/schema.sql
   psql -d medical_appointments -f database/seed.sql
   ```

3. Copy `.env.example` to `.env` and set `DATABASE_URL` to your PostgreSQL connection string. The schema adds `photo_url` and `is_active` doctor fields and can also be reapplied to an existing database to add those columns.
4. Install and start the app:

   ```sh
   npm install
   npm start
   ```

5. Open `http://localhost:3000`.

Open `public/index.html` directly in a browser to use the self-contained interface without a backend. It includes built-in demo doctors; booked demo slot IDs are remembered in browser storage, while patient details are not transmitted or persisted. The Express API and PostgreSQL schema remain available as a separate backend starter and are not called by this single-file page.

## API

### `GET /api/doctors`

Returns active doctors and their future, unbooked slots, including a profile photo URL:

```json
{
  "doctors": [
    {
      "id": "1",
      "full_name": "Dr. Maya Chen",
      "specialty": "Cardiology",
      "experience_years": 12,
      "price_per_visit": "120.00",
      "photo_url": "https://images.unsplash.com/...",
      "available_slots": [
        { "id": "1", "date": "2026-10-09", "time": "09:00" }
      ]
    }
  ]
}
```

### `POST /api/appointments`

Request body:

```json
{
  "schedule_id": 1,
  "full_name": "Alex Morgan",
  "phone": "+1 555 000 0000"
}
```

The API reserves a slot and creates an appointment in one transaction. The schedule row is locked while booking, preventing simultaneous requests from booking the same time. It returns `201` on success, `400` for invalid input, and `409` when the slot was taken or the phone belongs to a non-patient account. The frontend displays doctor cards, searches by name or specialty, filters specialties, and switches all interface labels between Uzbek, Russian, and English without reloading.

## Patient records

The public form does not ask for a password, so the schema permits a null `password_hash` for patient records created through booking. A real deployment should add a secure patient sign-in/claim-account flow, authentication, authorization, CSRF/rate-limit protections, and appropriate health-data privacy controls before accepting real patient information.
