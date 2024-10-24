<style scoped>
.classroom-view {
    position: relative;
    padding-top: 40px; /* Adjust this value based on your classroom name height */
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
        <NavBar site="classroom" :currentUser="currentUser" />
        <main>
            <!-- Classroom content goes here -->
            <!-- Vänstra sidan ska ha info om klassrummet, så som klass, ämne, lärare, etc. -->
            <!-- Mitten ska ha uppgifter för eleverna -->
            <!-- Högra sidan ska ha ett chatt flöde mellan lärare och elever -->
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
