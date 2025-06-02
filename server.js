const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes);

app.get('/api', (req, res) => {
    res.json({ message: 'CORS-enabled API!' });
});


mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(process.env.PORT || 3000, () => {
            console.log('Server running on port 3000');
        });
    })
    .catch(err => console.error('MongoDB connection error:', err));
