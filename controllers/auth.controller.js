// controllers/auth.controller.js
const { User } = require('../models'); // We can now import any model from the index file
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Function to handle new user registration
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, apartment_id } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // 2. Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 12);

    // 3. Create the new user in the database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'resident', // Default to 'resident' if no role is provided
      apartment_id,
    });

    // 4. Send a success response (don't send the password back)
    res.status(201).json({
      message: 'User registered successfully!',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred during registration.', error: error.message });
  }
};

// Function to handle user login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user by their email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please check your email.' });
    }

    // 2. Compare the provided password with the stored hashed password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid credentials. Please check your password.' });
    }

    // 3. If credentials are correct, create a JSON Web Token (JWT)
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' } // The token will be valid for 24 hours
    );

    // 4. Send the token and user info back to the client
    res.status(200).json({
      message: 'Login successful!',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred during login.', error: error.message });
  }
};