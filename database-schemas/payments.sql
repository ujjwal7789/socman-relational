CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date DATE NOT NULL,
    transaction_id VARCHAR(255) NOT NULL,
    status ENUM('pending', 'successful', 'failed') DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(id)
);