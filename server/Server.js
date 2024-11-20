const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
import { createZip } from "./FileHandling.js";

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
  courses: [{
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    grade: {
      type: "string",
    }
  }]
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
// Notice Schema
const NoticeSchema = mongoose.Schema({
  title: {
    type: "string",
  },
  message: {
    type: "string",
  },
  created_at: {
    type: "string",
  },
});
const NoticeModel = mongoose.model("Notification", NoticeSchema);
// Chat Schema
const ChatSchema = mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  classroom_id: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});
const ChatModel = mongoose.model("Chat", ChatSchema);
// Assignment Schema
const AssignmentSchema = mongoose.Schema({
  created_at: {
    type: "string",
  },
  classroom_id: {
    type: "string",
  },
  message: {
    type: "string",
  },
  title: {
    type: "string",
  },
  due_date: {
    type: "string",
  }

});
const AssignmentModel = mongoose.model("Assignment", AssignmentSchema);
// Submission Schema
const SubmissionSchema = mongoose.Schema({
  classroom_id: {
    type: "string",
  },
  assignment_id: {
    type: "string",
  },
  student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
  },
  file_paths: [{
    type: String
  }],
  file_names: [{
    type: String
  }],
  grade: {
    type: "string",
  },
  submitted_at: {
    type: "string",
  },
});
const SubmissionModel = mongoose.model("Submission", SubmissionSchema);
// Course Schema
const CourseSchema = mongoose.Schema({
  name: {
    type: "string",
  },
  course_code: {
    type: "string",
  },
  points: {
    type: "number",
  },
});
const CourseModel = mongoose.model("Course", CourseSchema);

// Login API
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
app.get("/api/users/", async (req, res) => {
  try {
    // Find user by ID (this can be adjusted to find by email or another field)
    const users = await UserModel.find({})

    if (!users) {
      return res.sendStatus(404); // If user not found, return 404
    }

    // Respond with user data
    res.json(users);
  } catch (error) {
    console.error(error);
    res.sendStatus(500); // Handle server error
  }
});
// Class API
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
app.get("/api/classrooms/:id", async (req, res) => {
  try {
    const classroom = await ClassroomModel.findById(req.params.id);
    res.json(classroom);
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

// Notice API
app.get("/api/notices", async (req, res) => {
  try {
    const notice = await NoticeModel.find({});
    if (!notice || notice.length === 0) {
      return res.sendStatus(404);
    }
    res.json(notice);
  } catch (error) {
    console.error(error);
    res.sendStatus(500); // Handle server error
  }
});
app.post("/api/notice", async (req, res) => {
  try {
    const newNotice = new NoticeModel(req.body);
    const savedNotice = await newNotice.save();
    res.status(201).json(savedNotice);
  } catch (error) {
    console.error('Error creating notice:', error);
    res.status(500).json({ message: "Error creating notice", error: error.message });
  }
});

// Chat API
app.get("/api/chats/", async (req, res) => {
  try {
    const chat = await ChatModel.find({});
    if (!chat || chat.length === 0) {
      return res.sendStatus(404);
    }
    res.json(chat);
  } catch (error) {
    console.error(error);
    res.sendStatus(500); // Handle server error
  }
});
app.get("/api/chats/:classroomId", async (req, res) => {
  try {
    const chat = await ChatModel.find({ classroom_id: req.params.classroomId });
    if (!chat || chat.length === 0) {
      return res.status(404).json({ message: "No messages found for this classroom" });
    }
    res.json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
app.post("/api/chats", async (req, res) => {
  try {
    console.log('Received chat message:', req.body);
    const newChat = new ChatModel(req.body);
    const savedChat = await newChat.save();
    console.log('Saved chat message:', savedChat);
    res.status(201).json(savedChat);
  } catch (error) {
    console.error('Error saving chat message:', error);
    res.status(500).json({ message: "Error saving chat message", error: error.message });
  }
});

// Assignment API
app.get("/api/assignments/:classroomId", async (req, res) => {
  try {
    const assignments = await AssignmentModel.find({ classroom_id: req.params.classroomId });
    res.json(assignments);
  } catch (error) {
    console.error(error);
    res.sendStatus(500); // Handle server error
  }
});
app.get("/api/assignment/:assignmentId", async (req, res) => {
  try {
    const assignments = await AssignmentModel.find({ _id: req.params.assignmentId });
    res.json(assignments);
  } catch (error) {
    console.error(error);
    res.sendStatus(500); // Handle server error
  }
});
app.post("/api/assignments", async (req, res) => {
  try {
    const newAssignment = new AssignmentModel(req.body);
    await newAssignment.save();
    res.json(newAssignment);
  } catch (error) {
    console.error(error);
    res.sendStatus(500); // Handle server error
  }
});
// Submit API
app.post("/files/submit/:classroomId/:assignmentId/:studentId", upload.array("files", 12), async function (req, res, next) {
  const newSubmission = new SubmissionModel( {
    classroom_id: req.params.classroomId,
    assignment_id: req.params.assignmentId,
    student_id: req.params.studentId,
    file_paths: req.files.map(file => file.path),
    file_names: req.files.map(file => file.originalname),
  });
  await newSubmission.save();
  return res.sendStatus(204);
});
app.get("/api/submissions/:classroomId/:studentId", async (req, res) => {
  try {
    const submissions = await SubmissionModel.find({ classroom_id: req.params.classroomId, student_id: req.params.studentId });
    if (!submissions || submissions.length === 0) {
      return res.status(404).json({ message: "No submissions found for this classroom and student" });
    }
    console.log(submissions);
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ message: "Error fetching submissions", error: error.message });
  }
});
app.get("/api/submissions/:classroomId", async (req, res) => {
  try {
    const submissions = await SubmissionModel.find({ classroom_id: req.params.classroomId }).populate('student_id').lean();
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ message: "Error fetching submissions", error: error.message });
  }
});
// Course API
app.get("/api/courses", async (req, res) => {
  try {
    const courses = await CourseModel.find({});
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: "Error fetching courses", error: error.message });
  }
});
app.get("/api/courses/:userId", async (req, res) => {
  try {
    const course = await UserModel.findById(req.params.userId).populate("courses.course").select("courses");
    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: "Error fetching course", error: error.message });
  }
});

// Download API


const PORT = process.env.PORT || 1010;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
