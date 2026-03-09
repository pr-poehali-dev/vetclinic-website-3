
CREATE TABLE IF NOT EXISTS appointment_slots (
  id SERIAL PRIMARY KEY,
  slot_date DATE NOT NULL,
  slot_time TIME NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(slot_date, slot_time)
);

CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  pet VARCHAR(255),
  breed VARCHAR(255),
  symptoms TEXT,
  slot_id INTEGER REFERENCES appointment_slots(id),
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
