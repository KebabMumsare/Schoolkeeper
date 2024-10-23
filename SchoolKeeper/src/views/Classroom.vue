<style>
</style>
<template>
    <h1>HEJ</h1>
    {{ classroom }}
</template>
<script>
import axios from 'axios';

export default {
    name: 'Classroom',
    data() {
        return {
            classroom: null
        }
    },
    
    methods: {
        fetchClassroom() {
            axios.get(`http://localhost:1010/api/classrooms/${this.$route.params.id}`).then(response => {
                this.classroom = response.data;
            });
        }
    },
    mounted() {
        this.fetchClassroom();
    },
}
</script>