<template>
    <NavBar site="start" :currentUser="currentUser" />
    <main class="Schedule">
        <div class="Container">
            <h3>Schedule</h3>
        </div>
        <div class="schedule-layout">
            <div class="today-schedule">
                <h4>Today's Schedule ({{ resolveDay(currentDayIndex) }})</h4>
                <div class="schedule-timeline">
                    <div v-for="(lecture, index) in todaySchedule" :key="index" class="lecture-item">
                        <div class="lecture-time">{{ lecture.time }}</div>
                        <div class="lecture-name" :class="{ 'current-lecture': isCurrentLecture(lecture) }">
                            {{ lecture.lecture }}
                        </div>
                    </div>
                </div>
            </div>
            <!--Flytta namn och klassrumm till längst upp till vänster (feedback av gymasie arebte grupp)-->
            <div class="weekly-schedule">
                <!-- behövs inte men Jesper kan klaga om jag tar bort de så de chillar här
                <div class="name">
                    <p>Namn: {{ currentUser.name }}</p>
                </div>
                <div class="section">
                    <p>Class: {{ currentUser.class }}</p>
                </div>-->
                <div class="schedule-container">
                    <div class="column" v-for="(day, i) in schema" :key="i">
                        <div class="day-header" :class="{ 'current-day': isCurrentDay(i) }">
                            {{ resolveDay(i) }}
                        </div>
                        <div class="time-slot" v-for="lecture in day" :key="lecture.id"
                             :class="{ 'current-lecture': isCurrentDay(i) && isCurrentLecture(lecture) }">
                            {{ lecture.time }} <br> {{ lecture.lecture }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="additional-info">
                <!-- Lägg till inkommande prov här skulel vara en banger ide (Feedback av Gymasie arebte grupp) -->
                <!-- Man kan också ha så att lektionerna blir andra färg om man har prov i de ämnet-->
                <h4>Additional Information</h4>
                <p>This space can be used for announcements, upcoming events, or any other relevant information.</p>
            </div>
        </div>
        <div class="test-controls">
            <label for="test-day">Test Day:</label>
            <select id="test-day" v-model="testDay" @change="updateSchedules">
                <option value="">Use actual day</option>
                <option v-for="(day, index) in ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']" :key="index" :value="index">
                    {{ day }}
                </option>
            </select>
        </div>
        <button v-if="currentUser.access === 'Admin'" type="submit">Edit</button>
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
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.schedule-container {
    display: flex;
    justify-content: space-between;
    margin-top: 0.3rem;
    border-radius: 8px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
    background-color: #ffffff;
    padding: 0.3rem;
    gap: 8px;
    min-height: 350px;
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
    background-color: #6597c9; /* Gold color for the current day */
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
    padding-left: 60px;
}

.lecture-item {
    display: flex;
    margin-bottom: 1rem;
    position: relative;
}

.lecture-time {
    position: absolute;
    left: -60px;
    width: 50px;
    text-align: right;
    font-weight: bold;
}

.lecture-name {
    flex-grow: 1;
    padding: 0.5rem;
    background-color: #f0f0f0;
    border-radius: 4px;
}

.current-lecture {
    background-color: #e6f7ff;
    border: 2px solid #1890ff;
}

.current-time-indicator {
    position: absolute;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #ff4d4f;
    pointer-events: none;
}

.current-lecture {
    background-color: #e6f7ff !important;
    border: 2px solid #1890ff !important;
    font-weight: bold;
}

.time-slot.current-lecture {
    background-color: #e6f7ff !important;
    border: 2px solid #1890ff !important;
    font-weight: bold;
}
</style>

<script>
import NavBar from "@/components/Nav-Bar.vue";
import axios from "axios";
import { useStorage } from "@vueuse/core";  // Named import

export default {
    name: 'Start',
    components: {
        NavBar,
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
        fetchSchema(i) {
            let day = ""; // We're only focusing on Monday for now

            switch (i) {
                case 0:
                    day = "monday";
                    break;
                case 1:
                    day = "tuesday";
                    break;
                case 2:
                    day = "wednesday";
                    break;
                case 3:
                    day = "thursday";
                    break;
                case 4:
                    day = "friday";
                    break;
            }

            axios.get(`http://localhost:1010/api/schema/${day}`)
                .then(response => {
                    this.schema[i] = response.data; // Store Monday data in the first array element
                    console.log('loaded Monday data:', response.data);
                })
                .catch(error => {
                    console.error('Error fetching Monday data:', error);
                    this.error = 'Failed to load Monday data';
                });
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
            const dayName = days[dayIndex + 1]; // +1 because our days array starts with Sunday
            
            try {
                const response = await axios.get(`http://localhost:1010/api/schema/${dayName}`);
                this.todaySchedule = response.data;
                this.updateCurrentTimePosition();
            } catch (error) {
                console.error('Error fetching today\'s schedule:', error);
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
    },
    mounted() {
        for (let i = 0; i < 5; i++) {
            this.fetchSchema(i);
        }
        
        // Update date and time immediately and then every second
        this.updateDateTime();
        setInterval(this.updateDateTime, 1000);
        this.fetchTodaySchedule();
        setInterval(() => {
            this.updateCurrentTimePosition();
            // Force re-render of the component to update current lecture
            this.$forceUpdate();
        }, 60000); // Update every minute
    },
    watch: {
        testDay() {
            this.updateSchedules();
        }
    }
};
</script>
