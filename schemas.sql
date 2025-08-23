CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'resident', 'security') NOT NULL,
    apartment_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- apartments: Stores details about each apartment
CREATE TABLE apartments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    apartment_number VARCHAR(50) NOT NULL UNIQUE,
    block VARCHAR(50),
    owner_id INT,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- notices: Stores announcements by the admin
CREATE TABLE notices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- help_desk: Replaces 'complaints' for a broader scope of service requests
CREATE TABLE help_desk (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('plumbing', 'electrical', 'security', 'housekeeping', 'other') NOT NULL,
    status ENUM('pending', 'in_progress', 'resolved', 'closed') DEFAULT 'pending',
    raised_by INT NOT NULL,
    assigned_to INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (raised_by) REFERENCES users(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);

-- payments: Stores maintenance payment records
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date DATE NOT NULL,
    transaction_id VARCHAR(255) NOT NULL,
    status ENUM('pending', 'successful', 'failed') DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- visitors: To pre-approve and track visitors
CREATE TABLE visitors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    visitor_name VARCHAR(255) NOT NULL,
    visitor_phone VARCHAR(20),
    status ENUM('expected', 'arrived', 'departed', 'denied') DEFAULT 'expected',
    approved_by_resident INT NOT NULL,
    entry_time TIMESTAMP NULL,
    exit_time TIMESTAMP NULL,
    checked_in_by_security INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (approved_by_resident) REFERENCES users(id),
    FOREIGN KEY (checked_in_by_security) REFERENCES users(id)
);

-- amenities: A list of all bookable facilities
CREATE TABLE amenities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    booking_rules TEXT,
    is_bookable BOOLEAN DEFAULT true
);

-- bookings: To track amenity reservations by residents
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    amenity_id INT NOT NULL,
    booked_by_user INT NOT NULL,
    start_time DATETIME NOT NULL,  -- Changed from TIMESTAMP to DATETIME
    end_time DATETIME NOT NULL,    -- Changed from TIMESTAMP to DATETIME
    status ENUM('confirmed', 'cancelled') DEFAULT 'confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (amenity_id) REFERENCES amenities(id),
    FOREIGN KEY (booked_by_user) REFERENCES users(id)
);

-- forum_posts: For resident discussions
CREATE TABLE forum_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id)
);

-- forum_comments: For replies to forum posts
CREATE TABLE forum_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    comment_text TEXT NOT NULL,
    author_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES forum_posts(id),
    FOREIGN KEY (author_id) REFERENCES users(id)
);

-- polls: For admin-created polls
CREATE TABLE polls (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    created_by INT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- poll_options: The possible answers for a poll
CREATE TABLE poll_options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    poll_id INT NOT NULL,
    option_text VARCHAR(255) NOT NULL,
    FOREIGN KEY (poll_id) REFERENCES polls(id)
);

-- poll_votes: Records which user voted for which option
CREATE TABLE poll_votes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    poll_id INT NOT NULL,
    option_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(poll_id, user_id), -- Ensures a user can only vote once per poll
    FOREIGN KEY (poll_id) REFERENCES polls(id),
    FOREIGN KEY (option_id) REFERENCES poll_options(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- vehicles: For residents to register their vehicles
CREATE TABLE vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    vehicle_number VARCHAR(100) NOT NULL,
    vehicle_type ENUM('two_wheeler', 'four_wheeler') NOT NULL,
    model VARCHAR(255),
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- alerts: Logs SOS/Panic button alerts
CREATE TABLE alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    raised_by INT NOT NULL,
    alert_type ENUM('medical', 'security', 'fire', 'other') DEFAULT 'security',
    status ENUM('active', 'acknowledged', 'resolved') DEFAULT 'active',
    acknowledged_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (raised_by) REFERENCES users(id),
    FOREIGN KEY (acknowledged_by) REFERENCES users(id)
);