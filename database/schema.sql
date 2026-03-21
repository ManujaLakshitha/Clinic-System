--database/shema.sql
-- Visits table
CREATE TABLE IF NOT EXISTS visits (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Drugs table
CREATE TABLE IF NOT EXISTS drugs (
    id SERIAL PRIMARY KEY,
    visit_id INT REFERENCES visits(id) ON DELETE CASCADE,
    name TEXT NOT NULL
);

-- Lab tests table
CREATE TABLE IF NOT EXISTS lab_tests (
    id SERIAL PRIMARY KEY,
    visit_id INT REFERENCES visits(id) ON DELETE CASCADE,
    test_name TEXT NOT NULL
);

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    visit_id INT REFERENCES visits(id) ON DELETE CASCADE,
    content TEXT
);

-- Bills table
CREATE TABLE IF NOT EXISTS bills (
    id SERIAL PRIMARY KEY,
    visit_id INT REFERENCES visits(id) ON DELETE CASCADE,
    total NUMERIC
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);