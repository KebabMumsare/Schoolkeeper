<style scoped>
.classroom-view {
    position: relative;
    padding-top: 40px; /* Adjust this value based on your classroom name height */
}

.classroom-header {
    position: fixed;
    top: 0;
    max-width: 20%;
    left: 0;
    right: 0;
    z-index: 1001; /* Ensure it's above the NavBar */
    margin: 1.5rem 1.5rem;
}

.classroom-name {
    margin: 0;
    font-size: 1.5rem;
    color: #333;
}

main {
    padding: 20px;
    margin-top: 60px; /* Adjust this value to account for the NavBar height */
}
</style>
<template>
    <div class="classroom-view">
        <div class="classroom-header">
            <h1 class="classroom-name">{{ classroom.name }}</h1>
        </div>
        <NavBar site="classroom" :currentUser="currentUser" />
        <main>
            <!-- Classroom content goes here -->
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
            classroom: { name: 'Loading...' }
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
