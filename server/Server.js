const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer  = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Custom file name
  },
});
const upload = multer({storage: storage})
  
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
    password: {
      type: 'string'
    },
  });
  const UserModel = mongoose.model('User', userSchema);
  const schedualSchema = mongoose.Schema({
    day: {
      type: 'string',
    },
    lecture: {
      type: 'string'
    },
    time: {
      type: 'string'
    },
  });
  const SchedualModel = mongoose.model('Schema', schedualSchema);
  
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
      return res.json(user);
    }
    
    return res.sendStatus(401);
  })

  app.get('/api/user/:name', async (req, res) => {
    try {
      // Find user by ID (this can be adjusted to find by email or another field)
      const user = await UserModel.findOne({name: req.params.name});
  
      if (!user) {
        return res.sendStatus(404); // If user not found, return 404
      }
  
      // Respond with user data
      res.json(user); 
    } catch (error) {
      console.error(error);
      res.sendStatus(500); // Handle server error
    }
  });

  app.get('/api/schema/:day', async (req, res) => {
    try {
      // Find user by ID (this can be adjusted to find by email or another field)
      const user = await SchedualModel.find({day: req.params.day});
  
      if (!user) {
        return res.sendStatus(404); // If user not found, return 404
      }
  
      // Respond with user data
      res.json(user); 
    } catch (error) {
      console.error(error);
      res.sendStatus(500); // Handle server error
    }
  });
  
  app.post('/photos/upload', upload.array('photos', 12), function (req, res, next) {
    // req.files is array of `photos` files
    // req.body will contain the text fields, if there were any
    return res.sendStatus(204);
  })
  
  const PORT = process.env.PORT || 1010;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });