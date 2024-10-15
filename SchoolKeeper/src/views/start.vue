<template>
    <NavBar site="start" />
    <main class="Schedule">
        <div class="Container">
            <h3>Schedule</h3>
        </div>
        <div class="name">
            <p>Namn: {{ currentUser.name }}</p>
        </div>
        <div class="section">
            <p>Class: {{ currentUser.class }}</p>
        </div>
        <div class="schedule-container">
            <div class="column" v-for="(day, i) in schema" :key="i">
                <div class="day-header">{{ resolveDay(i) }}</div>
                <div class="time-slot" v-for="lecture in day" :key="lecture.id">
                    {{ lecture.time }} {{ lecture.lecture }}
                </div>
            </div>
        </div>
        <button v-if="currentUser.access === 'Admin'" type="submit">Edit</button>
    </main>
</template>

<style scoped>
.schedule-container {
    display: flex;
    justify-content: space-between;
    margin-top: 0.5rem;
    border-radius: 8px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
    background-color: #ffffff;
    padding: 0.5rem;
}

.column {
    display: flex;
    flex-direction: column;
    width: 18%;
}

.day-header {
    background-color: #f1f3f5;
    color: #495057;
    font-weight: bold;
    text-align: center;
    padding: 10px;
    border-bottom: 1px solid #dee2e6;
    margin-bottom: 5px;
    font-size: 0.9rem;
}

.time-slot {
    padding: 8px;
    text-align: center;
    border-bottom: 1px solid #dee2e6;
    background-color: #f8f9fa;
    transition: background-color 0.2s ease;
    font-size: 0.85rem;
}

.time-slot:hover {
    background-color: #e9ecef;
}

.Schedule {
    border-radius: 8px;
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
    background-color: #f8f9fa;
    padding: 1rem;
}

.name,
.section {
    margin-bottom: 0.8rem;
    font-size: 1rem;
}

button {
    width: 100%;
    padding: 8px;
    background-color: #6184b8;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: transform 0.2s ease;
    font-size: 0.9rem;
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
            schema: [[], [], [], [], []]
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
    },
    mounted() {
        for (let i = 0; i < 5; i++){
            this.fetchSchema(i);
        }
    }
};
</script>
