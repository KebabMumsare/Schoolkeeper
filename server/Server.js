const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Atlas connection string
const mongoURI = "mongodb+srv://SchoolKeeper:Damdam@cluster0.htzr1.mongodb.net/SchoolKeeper?retryWrites=true&w=majority&appName=Cluster0";

// Mongoose connection setup
mongoose.connect(mongoURI)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.log('MongoDB connection error:', err));


const userSchema = mongoose.Schema({
  name: {
    type: 'string',
  },
  age: {
    type: 'number'
  },
  password: {
    type: 'string'
  }
});
const UserModel = mongoose.model('User', userSchema);

// Define a test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Mykyta luktar!' });
});

app.post('/api/login', async (req, res) => {
  const user = await UserModel.findOne({name: req.body.name});

  if (!user) {
    return res.sendStatus(401);
  }

  if (user.password === req.body.password) {
    return res.json({user: user});
  }

  return res.sendStatus(401);
})

const PORT = process.env.PORT || 1010;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});