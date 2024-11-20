<template>
<NavBar site="admintools" :currentUser="currentUser" />
<main>
  <h2>Funktioner</h2>
  <div class="admintools-grid">
    <router-link 
      to="/schedulecreator" 
      class="admintools-item"
      :style="{ backgroundColor: getRandomColor(-1) }"
    >
      <h3>Gå till Schema Skapare</h3>
      <p>Klicka här för att skappa Schema.</p>
    </router-link>

    <router-link 
      to="/addnewuser" 
      class="admintools-item"
      :style="{ backgroundColor: getRandomColor(-1) }"
    >
      <h3>Gå till Skapa Användare</h3>
      <p>Klicka här för att skappa Användare.</p>
    </router-link>


    <div 
      class="admintools-item" 
      v-for="index in 2" 
      :key="index + 1" 
      :style="{ backgroundColor: getRandomColor(index) }"
    >
      <h3>Placeholder {{ index + 1 }}</h3>
      <p>Details for Placeholder {{ index + 1 }}</p>
    </div>
  </div>
</main>
</template>

<style scoped>
.admintools-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

.admintools-item {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  text-decoration: none;
  color: inherit;
}

.admintools-item:hover {
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
            colors: ['#baddff', '#f8fa98', '#92fca6'], 
        }
    },
    methods: {
        getRandomColor(index) {
            const randomIndex = Math.floor(Math.random() * this.colors.length);
            if (index === -1) {
                return this.colors[randomIndex];
            }
            if (index > 0 && this.colors[randomIndex] === this.colors[index - 1]) {
                return this.colors[(randomIndex + 1) % this.colors.length]; 
            }
            return this.colors[randomIndex];
        }
    }
}
</script>
