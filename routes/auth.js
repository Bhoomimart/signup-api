const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register User..
router.post('/register', async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({ name, email, phone, otp });
        await user.save();

        console.log(`OTP for ${phone}: ${otp}`);
        res.json({ message: 'User created. Verify with OTP.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Verify OTP..
router.post('/verify-otp', async (req, res) => {
    try {
        const { phone, otp } = req.body;
        const user = await User.findOne({ phone });

        if (!user) return res.status(400).json({ error: 'User not found' });
        if (user.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });

        user.isVerified = true;
        user.otp = null;
        await user.save();

        res.json({ message: 'OTP verified successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update User
router.put('/user/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete User
router.delete('/user/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
