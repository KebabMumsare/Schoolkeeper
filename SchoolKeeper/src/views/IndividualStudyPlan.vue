<template>
  <div class="individual-study-plan">
    <NavBar site="individual-study-plan" :currentUser="currentUser" />
    <main class="content">
      <h1>Individual Study Plan</h1>
      <!-- Add content for the Individual Study Plan page -->
      
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
    };
  },
  methods: {
    goBack() {
      this.router.push('/personal');
    }
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
</style>
