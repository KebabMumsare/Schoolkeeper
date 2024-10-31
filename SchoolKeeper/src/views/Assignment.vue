<script>
import axios from 'axios';

export default {
    name: 'Assignment',
    data() {
        return {
            assignment: {}
        };
    },
    async mounted() {
        console.log('Assignment component mounted with ID:', this.$route.params.assignmentId);
        await this.fetchAssignment();
    },
    methods: {
        async fetchAssignment() {
            try {
                const response = await axios.get(`http://localhost:1010/api/assignment/${this.$route.params.assignmentId}`);
                this.assignment = response.data;
                console.log('Fetched assignment:', this.assignment);
            } catch (error) {
                console.error('Error fetching assignment:', error);
            }
        }
    }
}
</script>

<template>
    <div>
        <h1>{{ assignment.title }}</h1>
        <p><strong>Description:</strong> {{ assignment.message }}</p>
        <p><strong>Due Date:</strong> {{ new Date(assignment.due_date).toLocaleDateString() }}</p>
    </div>
</template>

<style scoped>
/* Add any styles you need for the assignment details */
</style>