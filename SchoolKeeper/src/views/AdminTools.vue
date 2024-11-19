<template>
<NavBar site="admintools" :currentUser="currentUser" />
<main>
  <h2>Funktioner</h2>
  <div class="classroom-grid">
    <div class="classroom-item" v-for="index in 3" :key="index">
      <h3>Placeholder {{ index }}</h3>
      <p>Detaljer för placeholder {{ index }}</p>
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
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}
h2{
    text-align: center;
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
            currentUser: useStorage('currentUser', {id: '', name: '', access: '', class: ''})
        }
    }
}
</script>