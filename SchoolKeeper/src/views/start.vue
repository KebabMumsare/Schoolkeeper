<template>
    <NavBar site="start"/>
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
            <div class="column">
                <div class="day-header">Måndag</div>
                <div class="time-slot">10:00-11:30 Svenska</div>
                <div class="time-slot">11:30-12:00 Engelska</div>
                <div class="time-slot">13:00-14:30 Svenska</div>
                <div class="time-slot">14:30-15:00 Engelska</div>
                <div class="time-slot">15:00-16:30 Svenska</div>
            </div>
            <div class="column">
                <div class="day-header">Tisdag</div>
                <div class="time-slot">10:00-11:30 Engelska</div>
                <div class="time-slot">11:30-12:00 Svenska</div>
                <div class="time-slot">13:00-14:30 Engelska</div>
                <div class="time-slot">14:30-15:00 Svenska</div>
                <div class="time-slot">15:00-16:30 Engelska</div>
            </div>
            <div class="column">
                <div class="day-header">Onsdag</div>
                <div class="time-slot">10:00-11:30 Mattematik</div>
                <div class="time-slot">11:30-12:00 Mattematik</div>
                <div class="time-slot">13:00-14:30 Mattematik</div>
                <div class="time-slot">14:30-15:00 Mattematik</div>
                <div class="time-slot">15:00-16:30 Svenska</div>
            </div>
            <div class="column">
                <div class="day-header">Torsdag</div>
                <div class="time-slot">10:00-11:30 Svenska</div>
                <div class="time-slot">11:30-12:00 Engelska</div>
                <div class="time-slot">13:00-14:30 Svenska</div>
                <div class="time-slot">14:30-15:00 Svenska</div>
                <div class="time-slot">15:00-16:30 Engelska</div>
            </div>
            <div class="column">
                <div class="day-header">Fredag</div>
                <div class="time-slot">10:00-11:30 Engelska</div>
                <div class="time-slot">11:30-12:00 Svenska</div>
                <div class="time-slot">13:00-14:30 Engelska</div>
                <div class="time-slot">14:30-15:00 Mattematik</div>
                <div class="time-slot">15:00-16:30 Mattematik</div>
            </div>
        </div>
        <button v-if="currentUser.access === 'Admin'" type="submit">Edit</button>
    </main>
</template>

<style scoped>
.schedule-container {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #ffffff;
    padding: 1rem;
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
    padding: 15px;
    border-bottom: 1px solid #dee2e6;
    margin-bottom: 10px;
}

.time-slot {
    padding: 15px;
    text-align: center;
    border-bottom: 1px solid #dee2e6;
    background-color: #f8f9fa;
    transition: background-color 0.2s ease;
}

.time-slot:hover {
    background-color: #e9ecef;
}

.Schedule {
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background-color: #f8f9fa;
    padding: 1.5rem;
}

.name, .section {
    margin-bottom: 1rem;
    font-size: 1.1rem;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #6184b8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s ease;
}
</style>

<script>
import NavBar from "@/components/Nav-Bar.vue";
import { useStorage } from "@vueuse/core";  // Named import

export default {
    name: 'Start',
    components: {
        NavBar,
    },
    data() {
        return {
            currentUser: useStorage('currentUser', { name: '', access: '', class: '' })
        };
    },
};
</script>
