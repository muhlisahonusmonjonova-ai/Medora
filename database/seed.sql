-- Optional demo directory and availability. Safe to run more than once.
WITH demo_doctors(full_name, phone, specialty, experience_years, price_per_visit, photo_url) AS (
    VALUES
        ('Dr. Maya Chen', '+1-555-0101', 'Cardiology', 12, 120.00, 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=700&q=80'),
        ('Dr. James Wilson', '+1-555-0102', 'Dermatology', 9, 95.00, 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=700&q=80'),
        ('Dr. Elena Petrova', '+1-555-0103', 'Neurology', 15, 140.00, 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=700&q=80'),
        ('Dr. Amir Rahman', '+1-555-0104', 'Pediatrics', 8, 85.00, 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=700&q=80'),
        ('Dr. Sofia Karimova', '+1-555-0105', 'Family medicine', 11, 90.00, 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=700&q=80'),
        ('Dr. Daniel Brooks', '+1-555-0106', 'Ophthalmology', 10, 110.00, 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=700&q=80')
),
inserted_users AS (
    INSERT INTO users (full_name, phone, role)
    SELECT full_name, phone, 'doctor' FROM demo_doctors
    ON CONFLICT (phone) DO UPDATE SET full_name = EXCLUDED.full_name
    WHERE users.role = 'doctor'
    RETURNING id, phone
)
INSERT INTO doctors (user_id, specialty, experience_years, price_per_visit, photo_url, is_active)
SELECT u.id, demo.specialty, demo.experience_years, demo.price_per_visit, demo.photo_url, TRUE
FROM demo_doctors demo
JOIN inserted_users u ON u.phone = demo.phone
ON CONFLICT (user_id) DO UPDATE SET
    specialty = EXCLUDED.specialty,
    experience_years = EXCLUDED.experience_years,
    price_per_visit = EXCLUDED.price_per_visit,
    photo_url = EXCLUDED.photo_url,
    is_active = TRUE;

INSERT INTO schedules (doctor_id, available_date, available_time)
SELECT d.id, day::DATE, slot::TIME
FROM doctors d
CROSS JOIN generate_series(CURRENT_DATE + 1, CURRENT_DATE + 7, INTERVAL '1 day') AS days(day)
CROSS JOIN (VALUES ('09:00'), ('10:30'), ('13:00'), ('14:30')) AS times(slot)
WHERE d.is_active = TRUE
ON CONFLICT (doctor_id, available_date, available_time) DO NOTHING;
