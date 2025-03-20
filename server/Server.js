const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const { createZip, deleteZip } = require("./FileHandling.js");
const axios = require("axios");

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
  groups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
  }],
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
// Group Schema
const GroupSchema = mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
});
const GroupModel = mongoose.model("Group", GroupSchema);
// Schedual Schema
const schedualSchema = mongoose.Schema({
  day: {
    type: "string",
    required: true
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  lecture: {
    type: "string",
    required: true
  },
  time: {
    type: "string",
    required: true
  },
  startMinutes: {
    type: "number",
    required: true
  },
  duration: {
    type: "number",
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
  }
});
const SchedualModel = mongoose.model("Schema", schedualSchema);
const schedualPresetSchema = mongoose.Schema({
  lecture: {
    type: "string",
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
  }
});
const SchedualPresetModel = mongoose.model("SchemaPreset", schedualPresetSchema);
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
// Attendance Schema
const AttendanceSchema = mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  lesson_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
  },
  date: {
    type: "string",
  },
  status: {
    type: "string",
  },
});
const AttendanceModel = mongoose.model("Attendance", AttendanceSchema);
// rooms
const RoomSchema = mongoose.Schema({
  name: {
    type: "string",
  },
  capacity: {
    type: "number",
  },
});
const RoomModel = mongoose.model("Room", RoomSchema);

// Login API
app.post("/api/login", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email })
      .populate("groups")
      .exec();

    if (!user) {
      return res.sendStatus(401);
    }

    if (user.password === req.body.password) {
      console.log('User found:', user);
      return res.json(user);
    }
    return res.sendStatus(401);
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: "Error during login", error: error.message });
  }
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
app.get("/api/users/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
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
app.get("/api/users/group/:groupId", async (req, res) => {
  try {
    const users = await UserModel.find({ groups: req.params.groupId });
    res.json(users);
  } catch (error) {

    console.error("Error fetching group:", error);
    res.sendStatus(500);
  }
});
app.post("/api/groups/:groupId/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    user.groups.push(req.params.groupId);
    await user.save();
    res.sendStatus(204);
  } catch (error) {
    console.error("Error adding user to group:", error);
    res.sendStatus(500);
  }
});
app.post("/api/users", async (req, res) => {
  try {
    const newUser = new UserModel(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
});
app.get("/api/teachers", async (req, res) => {
  try {
    const teachers = await UserModel.find({ access: "Lärare" });
    res.json(teachers);
  } catch (error) { 
    console.error("Error fetching teachers:", error);
    res.sendStatus(500);
  }
});
app.get("/api/teacher/:id", async (req, res) => {
  try {
    const teacher = await UserModel.findById(req.params.id);
    res.json(teacher);
  } catch (error) {
    console.error('Error fetching teacher:', error);
    res.status(500).json({ message: "Error fetching teacher", error: error.message });
  }
});
// Group API
app.get("/api/groups", async (req, res) => {
  try {
    const groups = await GroupModel.find({});

    if (!groups || groups.length === 0) {
      return res.sendStatus(404);
    }

    res.json(groups);
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.sendStatus(500);
  }
});
app.get("/api/allGroups", async (req, res) => {
  try {
    const groups = await GroupModel.find({});

    if (!groups || groups.length === 0) {
      return res.sendStatus(404);
    }

    res.json(groups);
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.sendStatus(500);
  }
});
app.post("/api/groups", async (req, res) => {
  try {
    const newGroup = new GroupModel(req.body);
    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ message: "Error creating group", error: error.message });
  }
});
app.get("/api/groups/students/:groupId", async (req, res) => {
  try {
    const students = await UserModel.find({ groups: req.params.groupId });
    res.json(students);
  } catch (error) {
    console.error("Error fetching group:", error);
    res.sendStatus(500);
  }
});
app.get("/api/groups/:id", async (req, res) => {
  try {
    const group = await GroupModel.findById(req.params.id);
    if (!group) {
      console.log('Group found:', group.name);
      return res.sendStatus(404);
    }
    res.json(group);
  } catch (error) {
    console.error("Error fetching group:", error);
    res.sendStatus(500);
  }
});
app.post("/api/groups/:id", async (req, res) => {
  try {
    const group = await GroupModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(group);
  } catch (error) {
    console.error("Error updating group:", error);
    res.status(500).json({ message: "Error updating group", error: error.message });
  }
});
app.delete("/api/groups/:id", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const groupId = req.params.id;
    
    // Delete the group
    await GroupModel.findByIdAndDelete(groupId).session(session);
    
    // Remove group from all users
    await UserModel.updateMany(
      { groups: groupId },
      { $pull: { groups: groupId } }
    ).session(session);
    
    // Delete related schedules
    await SchedualModel.deleteMany({ group: groupId }).session(session);
    
    // Delete related schedule presets
    await SchedualPresetModel.deleteMany({ group: groupId }).session(session);
    
    // Commit the transaction
    await session.commitTransaction();
    session.endSession();
    
    res.sendStatus(204);
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    session.endSession();
    
    console.error("Error deleting group:", error);
    res.sendStatus(500);
  }
});

// Schedual API
app.get("/api/schema/:day/:groupId", async (req, res) => {
  try {
    // Add logging to debug the incoming request
    console.log('Fetching schedule with params:', {
      day: req.params.day,
      groupId: req.params.groupId
    });

    const schedule = await SchedualModel.find({ 
      day: req.params.day.toLowerCase(),
      group: req.params.groupId
    }).populate('group').populate('room');  // Add this to populate group details
    
    console.log('Found schedule:', schedule);
    res.json(schedule);
  } catch (error) {
    console.error('Error in /api/schema/:day/:groupId:', error);
    res.status(500).json({ 
      message: "Error fetching schedule", 
      error: error.message,
      groupId: req.params.groupId,
      day: req.params.day 
    });
  }
});
app.get("/api/schema/teacher/:day/:teacher", async (req, res) => {
  try {
    const teacherLectures = await SchedualModel.find({ teacher: req.params.teacher, day: req.params.day }).populate('room');
    res.json(teacherLectures);
  } catch (error) { 
    console.error('Error fetching teacher lectures:', error);
    res.status(500).json({ message: "Error fetching teacher lectures", error: error.message });
  }
});

app.post("/api/schedulePreset", async (req, res) => {
  try {
    const schedual = new SchedualPresetModel(req.body);
    await schedual.save();
    res.status(201).json({ message: "Schedule preset created successfully" });
  } catch (error) {
    console.error('Error creating schedule preset:', error);
    res.status(500).json({ message: "Error creating schedule preset", error: error.message });
  }
});
app.get("/api/schedulePresets/:groupId", async (req, res) => {
  try {
    const presets = await SchedualPresetModel.find({ group: req.params.groupId });
    console.log(presets);
    res.json(presets);
  } catch (error) { 
    console.error('Error fetching schedule presets:', error);
    res.status(500).json({ message: "Error fetching schedule presets", error: error.message });
  }
});
app.delete("/api/schedulePresets/:id", async (req, res) => {
  try {
    await SchedualPresetModel.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (error) { 
    console.error('Error deleting schedule preset:', error);
    res.status(500).json({ message: "Error deleting schedule preset", error: error.message });
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
    const group = await GroupModel.findById(req.body.groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const newClassroom = new ClassroomModel({
      ...req.body,
      class: group.name // Using group name
    });
    await newClassroom.save();
    res.json(newClassroom);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating classroom", error: error.message });
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
    const tests = await ProvModel.find({});

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
app.get("/api/download/:assignmentId", async (req, res) => {
  try {
    const submissions = await SubmissionModel.find({ assignment_id: req.params.assignmentId });
    console.log(submissions);
    await createZip(submissions);
    res.download(__dirname + '/archive.zip');
    
    setTimeout(() => {
      deleteZip();
    }, 10000)

  } catch (error) {
    console.error('Error downloading submissions:', error);
    res.status(500).json({ message: "Error downloading submissions", error: error.message });
  }
});

// Add new Schedule API endpoints
app.post("/api/schedule", async (req, res) => {
  try {
    const { selectedGroupId, schedules } = req.body;
    
    const group = await GroupModel.findById(selectedGroupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Delete existing schedules for this group
    await SchedualModel.deleteMany({ group: group._id });
    
    // Create array of new schedule items
    const scheduleItems = Object.entries(schedules).flatMap(([day, items]) =>
      items.map(item => ({
        day: day.toLowerCase(),
        group: group._id,
        lecture: item.lecture,
        time: getTimeRange(item.startMinutes, item.duration),
        startMinutes: item.startMinutes,
        duration: item.duration,
        teacher: item.teacher,
        room: item.room
      }))
    );
    
    await SchedualModel.insertMany(scheduleItems);
    res.status(201).json({ message: "Schedule created successfully" });
  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({ message: "Error creating schedule", error: error.message });
  }
});

// Room API
app.get("/api/rooms", async (req, res) => {
  try {
    const rooms = await RoomModel.find({});
    res.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ message: "Error fetching rooms", error: error.message });
  }
});
app.post("/api/rooms", async (req, res) => {
  try {
    const newRoom = new RoomModel(req.body);
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ message: "Error creating room", error: error.message });
  }
});
app.get("/api/rooms/:id", async (req, res) => {
  try {
    const room = await RoomModel.findById(req.params.id);
    res.json(room);
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ message: "Error fetching room", error: error.message });
  }
});
// Helper function to format time range
function getTimeRange(startMinutes, duration) {
  const startHour = Math.floor(startMinutes / 60);
  const startMin = startMinutes % 60;
  const endMinutes = startMinutes + duration;
  const endHour = Math.floor(endMinutes / 60);
  const endMin = endMinutes % 60;

  return `${startHour.toString().padStart(2, '0')}:${startMin.toString().padStart(2, '0')} - ${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;
}

// Update Test/Prov endpoints to work with groups
app.post("/api/tests", async (req, res) => {
  try {
    const group = await GroupModel.findById(req.body.groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const newTest = new ProvModel({
      ...req.body,
      class: group.name // Using group name
    });
    await newTest.save();
    res.status(201).json(newTest);
  } catch (error) {
    console.error("Error creating test:", error);
    res.status(500).json({ message: "Error creating test", error: error.message });
  }
});

// Skolverket API endpoints
app.get("/api/skolverket/subjects", async (req, res) => {
  try {
    // Make the request to Skolverket API
    const response = await axios.get('https://api.skolverket.se/syllabus/v1/subjects', {
      headers: {
        'accept': 'application/json',
      }
    });

    // Send the data to the frontend
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Endpoint for fetching subject details from Skolverket
app.get("/api/skolverket/subjects/:code", async (req, res) => {
  try {
    const response = await axios.get(`https://api.skolverket.se/syllabus/v1/subjects/${req.params.code}`, {
      headers: {
        'accept': 'application/json',
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching subject details:', error);
    res.status(500).json({ error: 'Failed to fetch subject details' });
  }
});

const PORT = process.env.PORT || 1010;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
