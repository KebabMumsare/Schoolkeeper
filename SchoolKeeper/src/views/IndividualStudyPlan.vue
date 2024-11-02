<template>
  <div class="individual-study-plan">
    <NavBar site="individual-study-plan" :currentUser="currentUser" />
    <main class="content">
      <h1>Individual Study Plan</h1>
      
      <div class="grades-grid">
        <div class="grid-header">
          <div><h4 class="classtitle">Subject</h4></div>
          <div><h4 class="classtitle">Grade</h4></div>
          <div><h4 class="classtitle">Points</h4></div> 
        </div>
        
        <div class="grid-item" v-for="(lecture, index) in todaySchedule" :key="index">
          <div class="lecture-name">{{ lecture.lecture }}</div>
          <div class="lecture-grade">{{ lecture.grade }}</div> 
          <div class="lecture-points">{{ lecture.points }}</div>
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
      todaySchedule: [] // Ensure this is populated with lesson data
    };
  },
  methods: {
    goBack() {
      this.router.push('/personal');
    }
  },
  mounted() {
    // Example data, ändras om till riktita när Jesper gör dom i databassen
    this.todaySchedule = [
      { lecture: 'Math', grade: 'A', points: 100 },
      { lecture: 'Science', grade: 'B+', points: 50 },
      { lecture: 'History', grade: 'A-', points: 150 },
      { lecture: 'Literature', grade: 'B', points: 75 },
    ]; 
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
  color: white; /* Title color for subjects and grades */
}
</style>
