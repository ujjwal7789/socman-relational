CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'resident') NOT NULL,
    apartment_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);