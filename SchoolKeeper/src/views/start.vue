<template>
    <NavBar site="start" :currentUser="currentUser" />
    <main class="Schedule">
        <div class="Container">
            <h3>Schema</h3>
        </div>
        
        <!-- Teacher's Lectures Section (only visible to teachers) -->
        <div v-if="isTeacher" class="teacher-lectures">
            <h4>Mina Lektioner</h4>
            <div class="teacher-lectures-container">
                <div v-if="teacherLectures.length > 0" class="teacher-lectures-list">
                    <div v-for="(lecture, index) in teacherLectures" :key="index" class="teacher-lecture-item"
                         @click="openAttendanceModal(lecture)">
                        <div class="teacher-lecture-day">{{ getDayName(lecture.day) }}</div>
                        <div class="teacher-lecture-time">{{ lecture.time }}</div>
                        <div class="teacher-lecture-name">{{ lecture.lecture }}</div>
                        <div class="teacher-lecture-group">{{ lecture.group }}</div>
                        <div class="teacher-lecture-actions">
                            <span class="attendance-icon">📋</span>
                        </div>
                    </div>
                </div>
                <div v-else class="no-lectures">
                    Du har inga lektioner tilldelade.
                </div>
            </div>
        </div>
        
        <!-- Regular schedule layout (only visible to non-teachers) -->
        <div v-if="!isTeacher" class="schedule-layout">
            <div class="today-schedule">
                <h4>Dagens schema ({{ resolveDay(currentDayIndex) }})</h4>
                <div class="schedule-timeline">
                    <div v-for="(lecture, index) in todaySchedule" :key="index" class="lecture-item">
                        <div class="lecture-time">{{ lecture.time }}</div>
                        <div class="lecture-name" 
                             :class="{ 'current-lecture': isCurrentLecture(lecture) }" 
                             @click="hasAttendancePermission ? openAttendanceModal(lecture) : null"
                             :style="{ cursor: hasAttendancePermission ? 'pointer' : 'default' }">
                            {{ lecture.lecture }}
                            <span v-if="hasAttendancePermission" class="attendance-icon">📋</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="weekly-schedule">
                <div class="schedule-container">
                    <div class="column" v-for="(day, i) in schema" :key="i">
                        <div class="day-header" :class="{ 'current-day': isCurrentDay(i) }">
                            {{ resolveDay(i) }}
                        </div>
                        <div class="time-slot" v-for="lecture in day" :key="lecture.id"
                             :class="{ 'current-lecture': isCurrentDay(i) && isCurrentLecture(lecture) }"
                             @click="hasAttendancePermission ? openAttendanceModal(lecture) : null"
                             :style="{ cursor: hasAttendancePermission ? 'pointer' : 'default' }">
                            {{ lecture.time }} <br> 
                            <span>
                                 {{ lecture.lecture }}
                                 <span v-if="hasAttendancePermission" class="attendance-icon small">📋</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Test controls (only visible to non-teachers) -->
        <div v-if="!isTeacher" class="test-controls">
            <label for="test-day">Dag:</label>
            <select id="test-day" v-model="testDay" @change="updateSchedules">
                <option value="">Idag</option>
                <option v-for="(day, index) in ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag']" :key="index" :value="index">
                    {{ day }}
                </option>
            </select>
        </div>
        
        <!-- Attendance Modal -->
        <div v-if="showAttendanceModal" class="attendance-modal">
            <div class="attendance-modal-content">
                <div class="attendance-modal-header">
                    <h3>Närvaro för {{ selectedLecture.lecture }}</h3>
                    <button @click="closeAttendanceModal" class="close-button">&times;</button>
                </div>
                <div class="attendance-modal-body">
                    <p><strong>Tid:</strong> {{ selectedLecture.time }}</p>
                    <div class="attendance-list">
                        <div v-for="(student, index) in students" :key="index" class="student-attendance-item">
                            <span class="student-name">{{ student.name }}</span>
                            <div class="attendance-options">
                                <select v-model="student.attendanceStatus">
                                    <option value="" disabled>Välj status</option>
                                    <option value="present">Närvarande</option>
                                    <option value="absent">Frånvarande</option>
                                    <option value="registered-absence">Anmäld frånvaro</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="attendance-modal-footer">
                    <button @click="saveAttendance" class="save-button">Spara närvaro</button>
                    <button @click="closeAttendanceModal" class="cancel-button">Avbryt</button>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
.Schedule {
    border-radius: 8px;
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
    background-color: #f8f9fa;
    padding: 0.75rem;
    max-width: 1200px;
    margin-top: 50px;
}

.schedule-layout {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}

.today-schedule {
    flex: 1;
    background-color: #ffffff;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.weekly-schedule {
    flex: 2;
}

.additional-info {
    flex: 1;
    background-color: #ffffff;
    border-radius: 1vh;
    padding: 1vh;
    box-shadow: 0 2vh 4vh rgba(0, 0, 0, 0.1);
}

.schedule-container {
    display: flex;
    justify-content: space-between;
    margin-top: 0.3vh;
    border-radius: 1vh;
    box-shadow: 0 3vh 6vh rgba(0, 0, 0, 0.1);
    background-color: #ffffff;
    padding: 0.3vh;
    gap: 1vh;
    min-height: 43vh;
}

.column {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
}

.day-header {
    background-color: #c7d3e0;
    color: #000000;
    font-weight: bold;
    text-align: center;
    padding: 6px;
    border-bottom: 1px solid #dee2e6;
    margin-bottom: 3px;
    font-size: 0.85rem;
    white-space: nowrap;
    border-radius: 4px 4px 0 0;
}

.day-header.current-day {
    background-color: #6597c9;
    color: #000000;
    font-weight: bold;
}

.time-slot {
    padding: 6px;
    text-align: center;
    border-bottom: 1px solid #dee2e6;
    background-color: #f8f9fa;
    transition: background-color 0.2s ease;
    font-size: 0.75rem;
    min-height: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    word-wrap: break-word;
    hyphens: auto;
}

.time-slot:last-child {
    border-bottom: none;
    border-radius: 0 0 4px 4px;
}

.time-slot:hover {
    background-color: #e9ecef;
}

.name,
.section {
    margin-bottom: 0.3rem;
    font-size: 0.85rem;
}

button {
    padding: 6px;
    font-size: 0.85rem;
}

.current-datetime {
    margin-bottom: 1rem;
    font-size: 0.9rem;
    color: #333;
}

.test-controls {
    margin-top: 1rem;
    font-size: 0.9rem;
}

.test-controls select {
    margin-left: 0.5rem;
}

.schedule-timeline {
    position: relative;
    margin-top: 1vh;
    display: flex;
    flex-direction: column;
}

.lecture-item {
    display: flex;
    align-items: center;
    margin-bottom: 1vh;
    position: relative;
    min-height: 5vh;
    padding: 1vh;
    box-shadow: 0 0.5vh 1vh rgba(0, 0, 0, 0.1);
}

.lecture-time {
    width: auto;
    text-align: left;
    font-weight: bold;
    padding-right: 1vh;
    margin-right: auto;
}

.lecture-name {
    flex-grow: 1;
    padding: 0.5vh;
    background-color: #f0f0f0;
    border-radius: 4px;
    word-break: break-word;
    overflow: hidden;
    text-align: center;
}

.current-time-indicator {
    position: absolute;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #ff4d4f;
    pointer-events: none;
}

.test-list {
    max-height: 300px; /* Adjust this value as needed */
    overflow-y: auto;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    padding: 10px;
    background-color: #f8f9fa;
}

.test-list h5 {
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 1rem;
}

.test-list ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.test-item {
    display: flex;
    flex-direction: column;
    padding: 10px;
    border-bottom: 1px solid #dee2e6;
}

.test-item:last-child {
    border-bottom: none;
}

.test-subject {
    font-weight: bold;
    color: #007bff;
}

.test-date {
    font-size: 0.9rem;
    color: #6c757d;
}

.test-name {
    font-size: 0.9rem;
}

.upcoming-tests {
    display: flex;
    align-items: center;
}

.bullet-point {
    width: 10px;
    height: 10px;
    background-color: #ff0000;
    border-radius: 50%;
    margin-left: 8px;
}

/* Add these new styles for the attendance modal */
.attendance-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    overflow: hidden;
}

.attendance-modal-content {
    background-color: #fff;
    border-radius: 8px;
    width: 95%;
    max-width: 800px;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    margin: auto;
    position: relative;
    overflow: hidden;
}

.attendance-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background-color: #6597c9;
    color: white;
    border-radius: 8px 8px 0 0;
    position: sticky;
    top: 0;
    z-index: 10;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.attendance-modal-header h3 {
    margin: 0;
    font-size: 1.4rem;
    font-weight: 500;
}

.close-button {
    background: none;
    border: none;
    font-size: 28px;
    color: white;
    cursor: pointer;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.2s;
}

.close-button:hover {
    background-color: rgba(255, 255, 255, 0.2);
}

.attendance-modal-body {
    padding: 25px;
    overflow-y: auto;
    flex: 1;
}

.attendance-list {
    margin-top: 15px;
}

.student-attendance-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    border-bottom: 1px solid #eee;
}

.student-name {
    font-weight: bold;
    font-size: 1.1rem;
}

.attendance-options select {
    padding: 8px 12px;
    border-radius: 4px;
    border: 1px solid #ccc;
    font-size: 1rem;
    min-width: 180px;
}

.attendance-modal-footer {
    padding: 15px 20px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    border-top: 1px solid #eee;
}

.save-button {
    padding: 8px 16px;
    background-color: #4fc0e5;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.save-button:hover {
    background-color: #3da1b5;
}

.cancel-button {
    padding: 8px 16px;
    background-color: #f0f0f0;
    color: #333;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.cancel-button:hover {
    background-color: #e0e0e0;
}

.lecture-name, .time-slot {
    cursor: pointer;
}

.lecture-name:hover, .time-slot:hover {
    background-color: #e9ecef;
}

/* Add this to prevent body scrolling when modal is open */
body.modal-open {
    overflow: hidden;
}

/* Add these new styles for the attendance icon */
.attendance-icon {
    font-size: 0.9rem;
    margin-left: 5px;
    opacity: 0.7;
}

.attendance-icon.small {
    font-size: 0.8rem;
}

/* Optional: Add a hover effect to indicate clickable items for teachers/admins */
.lecture-name:hover .attendance-icon,
.time-slot:hover .attendance-icon {
    opacity: 1;
}

/* Styles for teacher's lectures section */
.teacher-lectures {
    margin-bottom: 20px;
    background-color: #ffffff;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 95%;
    margin-left: auto;
    margin-right: auto;
}

.teacher-lectures h4 {
    margin-top: 0;
    margin-bottom: 15px;
    color: #333;
    font-size: 1.2rem;
}

.teacher-lectures-container {
    max-height: 70vh;
    overflow-y: auto;
    border: 1px solid #eee;
    border-radius: 4px;
}

.teacher-lecture-item {
    display: grid;
    grid-template-columns: 120px 120px 1fr 120px 50px;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
    transition: background-color 0.2s;
    cursor: pointer;
    gap: 15px;
}

.teacher-lecture-item:hover {
    background-color: #f5f9ff;
}

.teacher-lecture-day, 
.teacher-lecture-time,
.teacher-lecture-name,
.teacher-lecture-group {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.teacher-lecture-day {
    font-weight: bold;
    font-size: 1.1rem;
}

.teacher-lecture-time {
    color: #555;
    font-size: 1.1rem;
}

.teacher-lecture-name {
    font-weight: 500;
    font-size: 1.1rem;
}

.teacher-lecture-group {
    color: #666;
    font-size: 1rem;
}

.teacher-lecture-actions {
    text-align: right;
}

.no-lectures {
    padding: 20px;
    text-align: center;
    color: #666;
}
</style>

<script>
import NavBar from "@/components/Nav-Bar.vue";
import axios from "axios";
import { useStorage } from "@vueuse/core";  // Named import
import Footer from "@/components/Footer.vue";
import draggable from 'vuedraggable';

export default {
    name: 'Start',
    components: {
        NavBar,
        Footer,
    },
    data() {
        return {
            currentUser: useStorage('currentUser', { name: '', access: '', class: '' }),
            schema: [[], [], [], [], []],
            currentDayIndex: 0,
            currentDate: '',
            currentTime: '',
            testDay: '',
            todaySchedule: [],
            currentTimePosition: 0,
            testSchedule: [], // Corrected spelling and initialized as an empty array
            courses: [],
            // New data properties for attendance modal
            showAttendanceModal: false,
            selectedLecture: {},
            students: [],
            teacherLectures: [], // New property to store teacher's lectures
        };
    },
    computed: {
        // Add a computed property to check if the user has permission to access attendance features
        hasAttendancePermission() {
            return this.currentUser && 
                  (this.currentUser.access === 'Admin' || 
                   this.currentUser.access === 'Lärare');
        },
        isTeacher() {
            return this.currentUser && 
                  (this.currentUser.access === 'Lärare');
        }
    },
    methods: {
        resolveDay(i) {
            switch (i) {
                case 0:
                    return "Måndag";
                case 1:
                    return "Tisdag";
                case 2:
                    return "Onsdag";
                case 3:
                    return "Torsdag";
                case 4:
                    return "Fredag";
            }
        },
        async fetchSchema(i) {
            let day = "";
            switch (i) {
                case 0: day = "monday"; break;
                case 1: day = "tuesday"; break;
                case 2: day = "wednesday"; break;
                case 3: day = "thursday"; break;
                case 4: day = "friday"; break;
            }

            try {
                // Check if user has groups
                if (!this.currentUser.groups || !this.currentUser.groups.length) {
                    console.log('No groups found for user:', this.currentUser);
                    return;
                }

                const schedules = [];
                console.log('Fetching schedules for groups:', this.currentUser.groups);

                // Fetch schedules for each group the user belongs to
                for (const group of this.currentUser.groups) {
                    try {
                        const response = await axios.get(
                            `http://localhost:1010/api/schema/${day}/${group}`
                        );
                        if (response.data && response.data.length > 0) {
                            schedules.push(...response.data);
                        }
                    } catch (groupError) {
                        console.error(`Error fetching schedule for group ${group}:`, groupError);
                    }
                }

                // Sort and update the schema
                if (schedules.length > 0) {
                    this.schema[i] = this.sortScheduleByTime(schedules.map(item => ({
                        ...item,
                        time: item.time.split(' - ')[0],
                    })));
                }
            } catch (error) {
                console.error(`Error fetching ${day} schedule:`, error);
                this.error = `Failed to load ${day} schedule`;
            }
        },
        updateDateTime() {
            const now = new Date();
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            this.currentDay = days[now.getDay()];
            this.currentDate = now.toLocaleDateString();
            this.currentTime = now.toLocaleTimeString();
        },
        isCurrentDay(dayIndex) {
            if (this.testDay !== '') {
                return dayIndex === parseInt(this.testDay);
            }
            const today = new Date().getDay();
            const adjustedToday = today === 0 ? 6 : today - 1;
            return dayIndex === adjustedToday;
        },
        async fetchTodaySchedule() {
            const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            const dayIndex = this.testDay !== '' ? parseInt(this.testDay) : new Date().getDay() - 1;
            this.currentDayIndex = dayIndex;
            const dayName = days[dayIndex + 1];
            
            try {
                if (!this.currentUser.groups || !this.currentUser.groups.length) {
                    console.log('No groups found for today schedule');
                    return;
                }

                const schedules = [];
                for (const groupId of this.currentUser.groups) {
                    const response = await axios.get(
                        `http://localhost:1010/api/schema/${dayName}/${groupId}`
                    );
                    if (response.data && response.data.length > 0) {
                        schedules.push(...response.data);
                    }
                }

                this.todaySchedule = this.sortScheduleByTime(schedules);
                this.updateCurrentTimePosition();
            } catch (error) {
                console.error('Error fetching today\'s schedule:', error);
            }
        },
        async fetchTestSchedule() {
            try {
                const response = await axios.get(`http://localhost:1010/api/tests/`);
                this.testSchedule = response.data; // Assign the fetched data to the array
            } catch (error) {
                console.error('Error fetching test schedule:', error);
            }
        },
        updateCurrentTimePosition() {
            const now = new Date();
            const startTime = new Date(now.setHours(8, 0, 0)); // Assuming school day starts at 8:00
            const currentTime = new Date();
            const timeDiff = (currentTime - startTime) / (1000 * 60); // Difference in minutes
            this.currentTimePosition = timeDiff * 2; // 2px per minute
        },
        isCurrentLecture(lecture) {
            const now = new Date();
            const [startHour, startMinute] = lecture.time.split(':').map(Number);
            const lectureStart = new Date(now.setHours(startHour, startMinute, 0));
            const lectureEnd = new Date(lectureStart.getTime() + 60 * 60 * 1000); // Assuming 1-hour lectures
            return now >= lectureStart && now < lectureEnd;
        },
        updateSchedules() {
            this.fetchTodaySchedule();
            // If you need to update the weekly schedule as well, call that method here
        },
        hasTest(subject) {
            return this.testSchedule.some(test => 
                test.subject.toLowerCase() === subject.toLowerCase()
            );
        },
        async fetchCourses() {
            const response = await axios.get(`http://localhost:1010/api/courses`);
            this.courses = response.data;
        },
        sortScheduleByTime(schedule) {
            return [...schedule].sort((a, b) => {
                const timeA = this.convertTimeToMinutes(a.time);
                const timeB = this.convertTimeToMinutes(b.time);
                return timeA - timeB;
            });
        },
        convertTimeToMinutes(timeStr) {
            const [hours, minutes] = timeStr.split(':').map(Number);
            return hours * 60 + minutes;
        },
        attendanceRoute() {
            this.$router.push('/attendance')
        },
        // New methods for attendance modal
        openAttendanceModal(lecture) {
            // Only allow teachers and admins to open the attendance modal
            if (!this.hasAttendancePermission) {
                return;
            }
            
            this.selectedLecture = lecture;
            this.fetchStudentsForLecture(lecture);
            this.showAttendanceModal = true;
            document.body.classList.add('modal-open');
        },
        
        closeAttendanceModal() {
            this.showAttendanceModal = false;
            this.selectedLecture = {};
            this.students = [];
            document.body.classList.remove('modal-open');
        },
        
        async fetchStudentsForLecture(lecture) {
            try {
                // Assuming you have an API endpoint to fetch students for a specific lecture
                // If not, you might need to adjust this to fetch students based on class/group
                const response = await axios.get(`http://localhost:1010/api/students/${lecture.group}`);
                
                // If you don't have a specific endpoint, you can use mock data for now
                if (!response.data || response.data.length === 0) {
                    // Mock data if no students are returned
                    this.students = [
                        { id: 1, name: 'Anna Andersson', attendanceStatus: '' },
                        { id: 2, name: 'Erik Eriksson', attendanceStatus: '' },
                        { id: 3, name: 'Maria Svensson', attendanceStatus: '' },
                        { id: 4, name: 'Johan Johansson', attendanceStatus: '' },
                        { id: 5, name: 'Lina Lindberg', attendanceStatus: '' },
                    ];
                } else {
                    // Map the response data to include attendanceStatus
                    this.students = response.data.map(student => ({
                        ...student,
                        attendanceStatus: ''
                    }));
                }
            } catch (error) {
                console.error('Error fetching students:', error);
                // Use mock data in case of error
                this.students = [
                    { id: 1, name: 'Anna Andersson', attendanceStatus: '' },
                    { id: 2, name: 'Erik Eriksson', attendanceStatus: '' },
                    { id: 3, name: 'Maria Svensson', attendanceStatus: '' },
                    { id: 4, name: 'Johan Johansson', attendanceStatus: '' },
                    { id: 5, name: 'Lina Lindberg', attendanceStatus: '' },
                ];
            }
        },
        
        async saveAttendance() {
            try {
                // Prepare the attendance data
                const attendanceData = {
                    lectureId: this.selectedLecture.id,
                    lectureName: this.selectedLecture.lecture,
                    date: new Date().toISOString(),
                    students: this.students.map(student => ({
                        studentId: student.id,
                        studentName: student.name,
                        status: student.attendanceStatus
                    }))
                };
                
                // Send the attendance data to your API
                await axios.post('http://localhost:1010/api/attendance', attendanceData);
                
                // Close the modal after saving
                this.closeAttendanceModal();
                
                // Optional: Show a success message
                alert('Närvaro har sparats!');
            } catch (error) {
                console.error('Error saving attendance:', error);
                alert('Ett fel uppstod när närvaron skulle sparas. Försök igen.');
            }
        },
        getDayName(day) {
            const days = {
                'monday': 'Måndag',
                'tuesday': 'Tisdag',
                'wednesday': 'Onsdag',
                'thursday': 'Torsdag',
                'friday': 'Fredag'
            };
            return days[day] || day;
        },
        async fetchTeacherLectures() {
            if (!this.isTeacher) return;
            
            try {
                // Assuming there's an API endpoint to fetch lectures by teacher ID
                const response = await axios.get(`http://localhost:1010/api/teacher-lectures/${this.currentUser.id}`);
                
                if (response.data && response.data.length > 0) {
                    // Sort lectures by day and time
                    this.teacherLectures = this.sortLecturesByDayAndTime(response.data);
                } else {
                    this.teacherLectures = [];
                }
            } catch (error) {
                console.error('Error fetching teacher lectures:', error);
                
                // Mock data for testing
                this.teacherLectures = [
                    { id: 1, day: 'monday', time: '08:30', lecture: 'Matematik', group: 'TE19A' },
                    { id: 2, day: 'monday', time: '10:15', lecture: 'Fysik', group: 'NA20B' },
                    { id: 3, day: 'tuesday', time: '13:00', lecture: 'Matematik', group: 'TE20A' },
                    { id: 4, day: 'wednesday', time: '08:30', lecture: 'Programmering', group: 'TE19A' },
                    { id: 5, day: 'friday', time: '14:45', lecture: 'Fysik', group: 'NA19C' },
                ];
            }
        },
        sortLecturesByDayAndTime(lectures) {
            const dayOrder = { 'monday': 0, 'tuesday': 1, 'wednesday': 2, 'thursday': 3, 'friday': 4 };
            
            return [...lectures].sort((a, b) => {
                // First sort by day
                if (dayOrder[a.day] !== dayOrder[b.day]) {
                    return dayOrder[a.day] - dayOrder[b.day];
                }
                
                // Then sort by time
                const timeA = this.convertTimeToMinutes(a.time);
                const timeB = this.convertTimeToMinutes(b.time);
                return timeA - timeB;
            });
        }
    },
    mounted() {
        for (let i = 0; i < 5; i++) {
            this.fetchSchema(i);
        }
        
        this.updateDateTime();
        this.fetchCourses();
        setInterval(this.updateDateTime, 1000);
        this.fetchTodaySchedule();
        this.fetchTestSchedule();
        setInterval(() => {
            this.updateCurrentTimePosition();
            this.$forceUpdate();
        }, 60000);
        
        // Add this to fetch teacher's lectures
        this.fetchTeacherLectures();
    },
    watch: {
        testDay() {
            this.updateSchedules();
        }
    }
};
</script>