CREATE TABLE apartments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    apartment_number VARCHAR(50) NOT NULL UNIQUE,
    block VARCHAR(50),
    owner_id INT,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);