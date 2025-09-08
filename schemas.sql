-- =================================================================
--    COMPLETE POSTGRESQL SCHEMA FOR SOCIETY MANAGEMENT APP
--    Version: 2.1 (Complete with Polls)
--    Authored by: Gemini & Ujjawal
--    Notes: Uses VARCHAR with CHECK constraints instead of ENUMs.
-- =================================================================

-- -----------------------------------------------------
-- Table: users
-- Stores all users: admins, residents, security, and staff.
-- -----------------------------------------------------
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    apartment_id INT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT check_user_role CHECK (role IN ('admin', 'resident', 'security', 'staff'))
);

-- -----------------------------------------------------
-- Table: apartments
-- Stores information about each apartment unit.
-- -----------------------------------------------------
CREATE TABLE apartments (
    id SERIAL PRIMARY KEY,
    apartment_number VARCHAR(50) NOT NULL UNIQUE,
    block VARCHAR(50),
    owner_id INT REFERENCES users(id) ON DELETE SET NULL
);

-- Add a foreign key from users to apartments after both tables exist.
ALTER TABLE users ADD CONSTRAINT fk_apartment_id FOREIGN KEY (apartment_id) REFERENCES apartments(id) ON DELETE SET NULL;


-- -----------------------------------------------------
-- Table: notices
-- For official announcements from the administration.
-- -----------------------------------------------------
CREATE TABLE notices (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_by INT REFERENCES users(id) ON DELETE SET NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------
-- Table: help_desk
-- Tracks service requests and complaints from residents.
-- -----------------------------------------------------
CREATE TABLE help_desk (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    raised_by INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_to INT REFERENCES users(id) ON DELETE SET NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT check_help_desk_status CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed'))
);

-- -----------------------------------------------------
-- Table: payments
-- Records of maintenance fees and other payments.
-- -----------------------------------------------------
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date DATE NOT NULL,
    transaction_id VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    CONSTRAINT check_payment_status CHECK (status IN ('pending', 'successful', 'failed'))
);

-- -----------------------------------------------------
-- Table: visitors
-- Log for pre-approved guests and deliveries.
-- -----------------------------------------------------
CREATE TABLE visitors (
    id SERIAL PRIMARY KEY,
    visitor_name VARCHAR(255) NOT NULL,
    visitor_phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'expected',
    approved_by_resident INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    entry_time TIMESTAMPTZ NULL,
    exit_time TIMESTAMPTZ NULL,
    checked_in_by_security INT REFERENCES users(id) ON DELETE SET NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT check_visitor_status CHECK (status IN ('expected', 'arrived', 'departed', 'denied'))
);

-- -----------------------------------------------------
-- Table: amenities
-- List of bookable society facilities.
-- -----------------------------------------------------
CREATE TABLE amenities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    booking_rules TEXT,
    is_bookable BOOLEAN DEFAULT true
);

-- -----------------------------------------------------
-- Table: bookings
-- Reservations for amenities made by residents.
-- -----------------------------------------------------
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    amenity_id INT NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
    booked_by_user INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) DEFAULT 'confirmed',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT check_booking_status CHECK (status IN ('confirmed', 'cancelled'))
);

-- -----------------------------------------------------
-- Table: forum_posts
-- Main posts in the community forum.
-- -----------------------------------------------------
CREATE TABLE forum_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------
-- Table: forum_comments
-- Comments on forum posts.
-- -----------------------------------------------------
CREATE TABLE forum_comments (
    id SERIAL PRIMARY KEY,
    post_id INT NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
    comment_text TEXT NOT NULL,
    author_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------
-- Table: vehicles
-- Vehicles registered by residents.
-- -----------------------------------------------------
CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    owner_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vehicle_number VARCHAR(100) NOT NULL UNIQUE,
    vehicle_type VARCHAR(20) NOT NULL,
    model VARCHAR(255),
    CONSTRAINT check_vehicle_type CHECK (vehicle_type IN ('two_wheeler', 'four_wheeler'))
);

-- -----------------------------------------------------
-- Table: alerts
-- Log for SOS/Panic alerts.
-- -----------------------------------------------------
CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    raised_by INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    alert_type VARCHAR(20) DEFAULT 'security',
    status VARCHAR(20) DEFAULT 'active',
    acknowledged_by INT REFERENCES users(id) ON DELETE SET NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT check_alert_type CHECK (alert_type IN ('medical', 'security', 'fire', 'other')),
    CONSTRAINT check_alert_status CHECK (status IN ('active', 'acknowledged', 'resolved'))
);

-- -----------------------------------------------------
-- Table: polls
-- For admin-created polls to gather resident opinions.
-- -----------------------------------------------------
CREATE TABLE polls (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    created_by INT NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------
-- Table: poll_options
-- Stores the possible answers for a given poll.
-- -----------------------------------------------------
CREATE TABLE poll_options (
    id SERIAL PRIMARY KEY,
    poll_id INT NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    option_text VARCHAR(255) NOT NULL
);

-- -----------------------------------------------------
-- Table: poll_votes
-- Records which user voted for which option in a poll.
-- -----------------------------------------------------
CREATE TABLE poll_votes (
    id SERIAL PRIMARY KEY,
    poll_id INT NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    option_id INT NOT NULL REFERENCES poll_options(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Ensures a user can only vote once per poll
    CONSTRAINT user_vote_unique UNIQUE (poll_id, user_id)
);