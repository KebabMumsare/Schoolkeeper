<style scoped>
.classroom-view {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

main {
    flex-grow: 1;
    display: flex;
    padding: 1rem;
    margin-top: 5rem; /* Adjust based on your NavBar height */
}

.box-container {
    display: flex;
    width: 90vw;
    height: calc(100vh - 7rem); /* Adjust based on your NavBar height and desired margins */
    gap: 1rem;
}

.box {
    flex: 1;
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 2rem; /* Increased padding */
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    overflow-y: auto; /* Allow scrolling if content exceeds box height */
    min-width: 30vw; /* Set a minimum width for each box */
}

.left-box {
    background-color: #e6f2ff;
}

.middle-box {
    background-color: #fff0f5;
}

.right-box {
    background-color: #f0fff0;
}

h2 {
    margin-top: 0;
    color: #333;
    font-size: 1.8rem; /* Increased font size */
    margin-bottom: 1.5rem; /* Increased margin */
}

p {
    margin: 0.8rem 0; /* Increased margin */
    color: #666;
    font-size: 1.2rem; /* Increased font size */
}

strong {
    color: #333;
}
</style>
<template>
    <div class="classroom-view">
        <NavBar site="classroom" :currentUser="currentUser" />
        <main>
            <div class="box-container">
                <div class="box left-box">
                    <h2>{{ classroom.name }}</h2>
                    <p><strong>Subject:</strong> {{ classroom.subject }}</p>
                    <p><strong>Class:</strong> {{ classroom.class }}</p>
                </div>
                <div class="box middle-box">
                    <h2>Assignments</h2>
                    <!-- Add assignment content here -->
                </div>
                <div class="box right-box">
                    <h2>Chat</h2>
                    <!-- Add chat content here -->
                </div>
            </div>
        </main>
    </div>
</template>
<script>
import NavBar from '@/components/Nav-Bar.vue';
import { useStorage } from "@vueuse/core";
import axios from 'axios';

export default {
    name: 'Classroom',
    components: {
        NavBar
    },
    data() {
        return {
            currentUser: useStorage('currentUser', { name: '', access: '', class: '' }),
            classroom: { name: 'Loading...', subject: '', class: '' }
        }
    },
    methods: {
        async fetchClassroom() {
            try {
                const response = await axios.get(`http://localhost:1010/api/classrooms/${this.$route.params.id}`);
                this.classroom = response.data;
            } catch (error) {
                console.error('Error fetching classroom:', error);
            }
        }
    },
    mounted() {
        this.fetchClassroom();
    },
}
</script>
