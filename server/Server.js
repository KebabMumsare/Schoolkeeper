const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files to 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Custom file name
  },
});
const upload = multer({ storage: storage });

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Atlas connection string
const mongoURI = "mongodb+srv://SchoolKeeper:Damdam@cluster0.htzr1.mongodb.net/SchoolKeeper?retryWrites=true&w=majority&appName=Cluster0";

// Mongoose connection setup
mongoose
  .connect(mongoURI, { autoSelectFamily: false })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err));

// User Schema
const userSchema = mongoose.Schema({
  name: {
    type: "string",
  },
  password: {
    type: "string",
  },
  class: {
    type: "string",
  },
});
const UserModel = mongoose.model("User", userSchema);
// Schedual Schema
const schedualSchema = mongoose.Schema({
  day: {
    type: "string",
  },
  lecture: {
    type: "string",
  },
  time: {
    type: "string",
  },
});
const SchedualModel = mongoose.model("Schema", schedualSchema);

const ClassroomSchema = mongoose.Schema({
  name: {
    type: "string",
  },
  class: {
    type: "string",
  },
  subject: {
    type: "string",
  },
});
const ClassroomModel = mongoose.model("Classroom", ClassroomSchema);
// Prov Schema
const ProvSchema = mongoose.Schema({
  prov: {
    type: "string",
  },
  class: {
    type: "string",
  },
  date: {
    type: "string",
  },
  subject: {
    type: "string",
  },
});
const ProvModel = mongoose.model("Test", ProvSchema);
app.post("/api/login", async (req, res) => {
  const user = await UserModel.findOne({ name: req.body.name });

  if (!user) {
    return res.sendStatus(401);
  }

  if (user.password === req.body.password) {
    return res.json(user);
  }

  return res.sendStatus(401);
});
// User API
app.get("/api/user/:name", async (req, res) => {
  try {
    // Find user by ID (this can be adjusted to find by email or another field)
    const user = await UserModel.findOne({ name: req.params.name });

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
app.get("/api/classes", async (req, res) => {
  try {
    // Find all users and select only the 'class' field
    const users = await UserModel.find({}, "class");

    if (!users || users.length === 0) {
      return res.sendStatus(404); // If no users found, return 404
    }

    // Extract unique classes
    const uniqueClasses = [...new Set(users.map((user) => user.class))];

    // Filter out any null or undefined classes, but keep empty strings
    const validClasses = uniqueClasses.filter(
      (className) => className !== null && className !== undefined
    );

    res.json(validClasses);
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.sendStatus(500); // Handle server error
  }
});
// Schedual API
app.get("/api/schema/:day", async (req, res) => {
  try {
    // Find user by ID (this can be adjusted to find by email or another field)
    const user = await SchedualModel.find({ day: req.params.day });

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
// Classroom API
app.get("/api/classrooms/", async (req, res) => {
  try {
    const classrooms = await ClassroomModel.find({});

    if (!classrooms || classrooms.length === 0) {
      return res.sendStatus(404); // If no users found, return 404
    }
    res.json(classrooms);
  } catch (error) {
    console.error(error);
    res.sendStatus(500); // Handle server error
  }
});
app.post("/api/classrooms/", async (req, res) => {
  try {
    const newClassroom = new ClassroomModel(req.body);
    await newClassroom.save();
    res.json(newClassroom);
  } catch (error) {
    console.error(error);
    res.sendStatus(500); // Handle server error
  }
});
app.delete("/api/classrooms/:id", async (req, res) => {
  try {
    console.log("id:", req.params.id);
    await ClassroomModel.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.sendStatus(500); // Handle server error
  }
});
// Prov API
app.get("/api/tests/", async (req, res) => {
  try {
    console.log("Attempting to fetch tests...");
    const tests = await ProvModel.find({});
    console.log("Retrieved tests:", tests);

    if (!tests || tests.length === 0) {
      console.log("No tests found");
      return res.status(404).json({ message: "No tests found" });
    }

    res.json(tests);
  } catch (error) {
    console.error("Error fetching tests:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// Submit API
app.post(
  "/photos/upload",
  upload.array("photos", 12),
  function (req, res, next) {
    // req.files is array of `photos` files
    // req.body will contain the text fields, if there were any
    return res.sendStatus(204);
  }
);

const PORT = process.env.PORT || 1010;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
