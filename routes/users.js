const express = require('express');
const router = express.Router();
const User = require('../models/user'); 

// Create a new user (POST /api/users)
router.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user); // 201 Created
    } catch (err) {
        if (err.name === 'ValidationError') {
            res.status(400).json({ error: err.message }); // 400 Bad Request
        } else {
            res.status(500).json({ error: 'Server error' }); // 500 Internal Server Error
        }
    }
});

// Get all users (GET /api/users)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user by email ID or socket ID (GET /api/users/:identifier)
router.get('/users/:identifier', async (req, res) => {
    try {
        const identifier = req.params.identifier;

        const user = await User.findOne({
            $or: [
                { emailId: identifier },
                { socketId: identifier } 
            ]
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { password, ...userDataWithoutPassword } = user.toObject();
        res.json(userDataWithoutPassword);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router; // Export the router