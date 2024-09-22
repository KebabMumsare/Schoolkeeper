const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Atlas connection string
const mongoURI = "mongodb+srv://SchoolKeeper:Damdam@cluster0.htzr1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Mongoose connection setup
mongoose.connect(mongoURI)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.log('MongoDB connection error:', err));

// Define a test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

const PORT = process.env.PORT || 1010;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});