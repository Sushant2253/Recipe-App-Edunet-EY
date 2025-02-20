const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user exists by email
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ 
                success: false,
                message: 'An account with this email already exists. Please login instead.' 
            });
        }

        // Check if username is taken
        user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ 
                success: false,
                message: 'Username is already taken. Please choose another.' 
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: 'Registration successful! Please login.'
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error during registration' 
        });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for:', email); // Debug log

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found'); // Debug log
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        console.log('Password valid:', validPassword); // Debug log

        if (!validPassword) {
            console.log('Invalid password'); // Debug log
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create and assign token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        // Send response with user data and token
        const response = {
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            },
            token
        };
        console.log('Login successful:', response); // Debug log
        res.json(response);
    } catch (error) {
        console.error('Login error:', error); // Debug log
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;