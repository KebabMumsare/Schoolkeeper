<template>
<NavBar site="admintools" :currentUser="currentUser" />
<main>
  <h2>Funktioner</h2>
  <div class="classroom-grid">
    <router-link 
      to="/schedulecreator" 
      class="classroom-item"
      :style="{ backgroundColor: getRandomColor(0) }"
    >
      <h3>Go to Schedule Creator</h3>
      <p>Click here to create a schedule.</p>
    </router-link>
    <div 
      class="classroom-item" 
      v-for="index in 2" 
      :key="index + 1" 
      :style="{ backgroundColor: getRandomColor(index + 1) }"
    >
      <h3>Placeholder {{ index + 1 }}</h3>
      <p>Details for Placeholder {{ index + 1 }}</p>
    </div>
  </div>
</main>
</template>

<style scoped>
.classroom-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

.classroom-item {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  text-decoration: none;
  color: inherit;
}

.classroom-item:hover {
  background-color: #f0f0f0;
}

h2{
    text-align: center
}
</style>

<script>
import NavBar from '@/components/Nav-Bar.vue';
import { useStorage } from '@vueuse/core';

export default {
    components: {
        NavBar
    },
    data() {
        return {
            currentUser: useStorage('currentUser', {id: '', name: '', access: '', class: ''}),
        }
    },
    methods: {
        getRandomColor(index) {
            // Get a random color from the colors array
            const randomIndex = Math.floor(Math.random() * this.colors.length);
            // Ensure the color is not the same as the previous one
            if (index > 0 && this.colors[randomIndex] === this.colors[index - 1]) {
                return this.colors[(randomIndex + 1) % this.colors.length]; // Get the next color
            }
            return this.colors[randomIndex];
        }
    }
}
</script>
