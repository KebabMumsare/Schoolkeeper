<template>
<NavBar site="admintools" :currentUser="currentUser" />
<main class="admin-dashboard">
  <div class="dashboard-header">
    <h1>Admin Verktyg</h1>
    <p class="subtitle">Välj en funktion nedan för att hantera skolans system</p>
  </div>
  
  <div class="admintools-grid">
    <router-link 
      to="/schedulecreator" 
      class="admintools-card"
    >
      <div class="card-icon">
        <i class="fas fa-calendar-alt"></i>
      </div>
      <div class="card-content">
        <h3>Schema Skapare</h3>
        <p>Skapa och hantera scheman för klasser och lärare</p>
      </div>
      <div class="card-arrow">
        <i class="fas fa-chevron-right"></i>
      </div>
    </router-link>

    <router-link 
      to="/admintools/addnewuser" 
      class="admintools-card"
    >
      <div class="card-icon">
        <i class="fas fa-user-plus"></i>
      </div>
      <div class="card-content">
        <h3>Skapa Användare</h3>
        <p>Lägg till nya elever, lärare och administratörer</p>
      </div>
      <div class="card-arrow">
        <i class="fas fa-chevron-right"></i>
      </div>
    </router-link>
    
    <router-link 
      to="/admintools/groupcreator" 
      class="admintools-card"
    >
      <div class="card-icon">
        <i class="fas fa-users"></i>
      </div>
      <div class="card-content">
        <h3>Skapa Grupper</h3>
        <p>Hantera klasser, grupper och organisera användare</p>
      </div>
      <div class="card-arrow">
        <i class="fas fa-chevron-right"></i>
      </div>
    </router-link>
    
    <router-link 
      to="/admintools/roomscreator" 
      class="admintools-card"
    >
      <div class="card-icon">
        <i class="fas fa-door-open"></i>
      </div>
      <div class="card-content">
        <h3>Skapa Salar</h3>
        <p>Lägg till och hantera rum och lokaler för lektioner</p>
      </div>
      <div class="card-arrow">
        <i class="fas fa-chevron-right"></i>
      </div>
    </router-link>
  </div>
</main>
</template>

<style scoped>
:root {
  --primary-color: #4361ee;
  --primary-light: #e6ebff;
  --secondary-color: #3f37c9;
  --accent-color: #4cc9f0;
  --text-dark: #2b2d42;
  --text-medium: #555b6e;
  --text-light: #8d99ae;
  --bg-light: #f8f9fa;
  --bg-white: #ffffff;
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --border-radius: 12px;
  --transition-speed: 0.3s;
}

.admin-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  padding-top: 100px;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 3rem;
}

.dashboard-header h1 {
  color: var(--text-dark);
  font-size: 2.4rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--text-medium);
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
}

.admintools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.admintools-card {
  background-color: var(--bg-white);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  padding: 1.5rem;
  text-decoration: none;
  color: var(--text-dark);
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  transition: all var(--transition-speed) ease;
  height: 120px;
  border-left: 5px solid var(--primary-color);
}

.admintools-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  background-color: var(--primary-light);
}

.admintools-card:before {
  content: none;
}

.card-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background-color: var(--primary-light);
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-right: 1rem;
  flex-shrink: 0;
}

.card-content {
  flex: 1;
}

.card-content h3 {
  margin: 0 0 5px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-dark);
}

.card-content p {
  margin: 0;
  color: var(--text-medium);
  font-size: 0.9rem;
  line-height: 1.5;
}

.card-arrow {
  color: var(--text-light);
  font-size: 1rem;
  transition: transform var(--transition-speed) ease;
}

.admintools-card:hover .card-arrow {
  transform: translateX(5px);
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .admin-dashboard {
    padding: 1rem;
    padding-top: 80px;
  }
  
  .admintools-grid {
    grid-template-columns: 1fr;
  }
  
  .dashboard-header h1 {
    font-size: 1.8rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
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
    }
}
</script>
