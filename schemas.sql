-- This is the UPDATED schema.sql for PostgreSQL

-- First, create the ENUM types that PostgreSQL will use
CREATE TYPE user_role AS ENUM ('admin', 'resident', 'security', 'staff');
CREATE TYPE help_desk_status AS ENUM ('pending', 'in_progress', 'resolved', 'closed');
CREATE TYPE payment_status AS ENUM ('pending', 'successful', 'failed');
CREATE TYPE visitor_status AS ENUM ('expected', 'arrived', 'departed', 'denied');
CREATE TYPE booking_status AS ENUM ('confirmed', 'cancelled');
CREATE TYPE vehicle_type AS ENUM ('two_wheeler', 'four_wheeler');
CREATE TYPE alert_type AS ENUM ('medical', 'security', 'fire', 'other');
CREATE TYPE alert_status AS ENUM ('active', 'acknowledged', 'resolved');

-- Use SERIAL PRIMARY KEY instead of INT AUTO_INCREMENT
-- Use TIMESTAMPTZ for timezone-aware timestamps

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    apartment_id INT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE apartments (
    id SERIAL PRIMARY KEY,
    apartment_number VARCHAR(50) NOT NULL UNIQUE,
    block VARCHAR(50),
    owner_id INT REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE notices (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_by INT REFERENCES users(id) ON DELETE SET NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE help_desk (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- Using VARCHAR is often more flexible than ENUM for categories
    status help_desk_status DEFAULT 'pending',
    raised_by INT NOT NULL REFERENCES users(id),
    assigned_to INT REFERENCES users(id),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- (And so on for all other tables... just ensure you use SERIAL PRIMARY KEY and TIMESTAMPTZ)
-- The Sequelize models we wrote will handle the rest of the tables correctly even without a full schema file,
-- but the above are good examples. You can run the queries one by one in pgAdmin's Query Tool.