<template>
    <NavBar site="start" :currentUser="currentUser" />
    <main class="Schedule">
        <div class="Container">
            <h3>Schema</h3>
        </div>
        <div class="schedule-layout">
            <div class="today-schedule">
                <h4>Dagens schema ({{ resolveDay(currentDayIndex) }})</h4>
                <div class="schedule-timeline">
                    <div v-for="(lecture, index) in todaySchedule" :key="index" class="lecture-item">
                        <div class="lecture-time">{{ lecture.time }}</div>
                        <div class="lecture-name" :class="{ 'current-lecture': isCurrentLecture(lecture) }">
                            {{ lecture.lecture }}
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
                             :class="{ 'current-lecture': isCurrentDay(i) && isCurrentLecture(lecture) }">
                            {{ lecture.time }} <br> 
                            <span>
                                {{ lecture.lecture }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="additional-info">
                <!-- Lägg till inkommande prov här skulel vara en banger ide (Feedback av Gymasie arebte grupp) -->
                <!-- Man kan också ha så att lektionerna blir andra färg om man har prov i de ämnet-->
                <h4>Ytterligare information</h4>
                
                <div class="test-list">
                    <h5 class="upcoming-tests">
                        Kommande prov
                        <span class="bullet-point"></span>
                    </h5>
                    <ul v-if="testSchedule.length > 0">
                        <li v-for="test in testSchedule" :key="test._id" class="test-item">
                            <span class="test-subject">{{ test.subject }}</span>
                            <span class="test-date">{{ test.date }}</span>
                            <span class="test-name">{{ test.prov }}</span>
                        </li>
                    </ul>
                    
                    <p v-else>Inga kommande prov</p>
                </div>
            
            
            </div>
        </div>
        <div class="test-controls">
            <label for="test-day">Dag:</label>
            <select id="test-day" v-model="testDay" @change="updateSchedules">
                <option value="">Idag</option>
                <option v-for="(day, index) in ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag']" :key="index" :value="index">
                    {{ day }}
                </option>
            </select>
        </div>
    </main>
    <Footer />
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
        };
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
        
    },
    watch: {
        testDay() {
            this.updateSchedules();
        }
    }
};
</script>