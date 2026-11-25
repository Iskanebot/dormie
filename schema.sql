-- Planned Postgres schema from the Dormie spec.
-- The running app stores data in the browser (localStorage) until a database is connected.

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  target_hours NUMERIC DEFAULT 7.5,
  target_bedtime TIME DEFAULT '23:30',
  target_wake TIME DEFAULT '07:00',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE sleep_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  sleep_start TIMESTAMP WITH TIME ZONE NOT NULL,
  sleep_end TIMESTAMP WITH TIME ZONE NOT NULL,
  morning_mood TEXT NOT NULL,
  sleep_score INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  pet_name TEXT NOT NULL,
  pet_type TEXT NOT NULL,
  pet_status TEXT DEFAULT 'RADIANT',
  coins INT DEFAULT 50,
  streak INT DEFAULT 0,
  recovery INT DEFAULT 0
);

CREATE TABLE shop_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  kind TEXT NOT NULL,
  price INT NOT NULL
);

CREATE TABLE inventory (
  user_id UUID REFERENCES users(id),
  item_id TEXT REFERENCES shop_items(id),
  equipped BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (user_id, item_id)
);
