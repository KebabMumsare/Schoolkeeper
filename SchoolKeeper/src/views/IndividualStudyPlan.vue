<template>
  <div class="individual-study-plan">
    <NavBar site="individual-study-plan" :currentUser="currentUser" />
    <main class="content">
      <h1>Individual Study Plan</h1>
      <div class="grades-grid">
        <div class="grid-header">
          <div><h4 class="classtitle">Ämne</h4></div>
          <div><h4 class="classtitle">Betyg</h4></div>
          <div><h4 class="classtitle">Poäng</h4></div> 
        </div>
        
        <div class="grid-item" v-for="(courses, index) in userCourses.courses" :key="index">
          <div class="lecture-name">{{ courses.course.course_code }}</div>
          <div class="lecture-grade">{{ courses.grade }}</div> 
          <div class="lecture-points">{{ courses.course.points }}</div>
        </div>
      </div>

      <div class="button-container">
        <button @click="goBack" class="back-button">Back to Personal Page</button>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script>
import NavBar from "@/components/Nav-Bar.vue";
import Footer from "@/components/Footer.vue";
import axios from "axios";
import { useStorage } from "@vueuse/core";
import { useRouter } from 'vue-router';

export default {
  name: 'IndividualStudyPlan',
  components: {
    NavBar,
    Footer,
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  data() {
    return {
      currentUser: useStorage('currentUser', { name: '', access: '', class: '' }),
      courses: [], 
      userCourses: [],
    };
  },
  methods: {
    goBack() {
      this.router.push('/personal');
    },
    async fetchCourses() {
      const response = await axios.get(`http://localhost:1010/api/courses`);
      this.courses = response.data;
    },
    async fetchUserCourses() {
      const response = await axios.get(`http://localhost:1010/api/courses/${this.currentUser.id}`);
      this.userCourses = response.data;
    }
  },
  mounted() {
    this.fetchUserCourses();
  }
}
</script>

<style scoped>
.individual-study-plan {
  /* Add any necessary styles */
}

.content {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  text-align: center; /* Center the content */
}

h1 {
  color: white;
  margin-bottom: 20px;
}

.grades-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr; /* Three columns for Subject, Grade, and Points */
  gap: 10px;
  margin: 20px 0; /* Space around the grid */
}

.grid-header {
  font-weight: bold;
  color: #333; /* Header color */
  display: contents; /* Use contents to keep the grid layout */
}

.grid-item {
  display: contents; /* Use contents to allow proper column alignment */
}

.lecture-name, .lecture-grade, .lecture-points {
  background-color: #f0f0f0; /* Light background for items */
  padding: 10px;
  border-radius: 5px;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.back-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.back-button:hover {
  background-color: #0056b3;
}

.classtitle {
  color: rgb(0, 0, 0); /* Title color for subjects and grades */
}
</style>
