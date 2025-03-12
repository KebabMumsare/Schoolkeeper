<template>
<NavBar site="admintools" :currentUser="currentUser" />
<div class="admintools-container-wrapper">
  <main class="admin-dashboard">
    <div class="dashboard-header">
      <h1 class="section-title">Admin Verktyg</h1>
      <p class="subtitle">Välj en funktion nedan för att hantera skolans system</p>
    </div>
    
    <div class="admintools-grid">
      <router-link 
        to="/admintools/schedulecreator" 
        class="admintools-card"
      >
        <div class="card-icon">
          <i class="fas fa-calendar-alt"></i>
        </div>
        <div class="card-content">
          <h3 class="card-title">Hantera Schema</h3>
          <p class="card-description">Skapa och hantera scheman för klasser och lärare</p>
        </div>
        <div class="card-arrow">
          <span>→</span>
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
          <h3 class="card-title">Hantera Användare</h3>
          <p class="card-description">Lägg till nya elever, lärare och administratörer</p>
        </div>
        <div class="card-arrow">
          <span>→</span>
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
          <h3 class="card-title">Hantera Grupper</h3>
          <p class="card-description">Hantera klasser, grupper och organisera användare</p>
        </div>
        <div class="card-arrow">
          <span>→</span>
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
          <h3 class="card-title">Hantera Salar</h3>
          <p class="card-description">Lägg till och hantera rum och lokaler för lektioner</p>
        </div>
        <div class="card-arrow">
          <span>→</span>
        </div>
      </router-link>

      <router-link 
        to="/admintools/kurser" 
        class="admintools-card"
      >
        <div class="card-icon">
          <i class="fas fa-book"></i>
        </div>
        <div class="card-content">
        <h3 class="card-title">Hantera Kurser</h3>
        <p class="card-description">Skolverkets kurser</p>
        </div>
        <div class="card-arrow">
        <span>→</span>
        </div>
      </router-link>

    </div>
  </main>
</div>
<Footer />
</template>

<style scoped>
.admintools-container-wrapper {
  display: flex;
  width: 100vw;
  min-height: 85vh;
  padding: 1.5rem;
  padding-top: 60px;
  box-sizing: border-box;
  background-color: #f0f2f5;
  background-image: linear-gradient(135deg, #f5f7fa 0%, #e4efe9 100%);
  margin-top: -20px;
}

.admin-dashboard {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #333;
  font-size: 2rem;
  font-weight: 600;
  position: relative;
  display: inline-block;
  padding-bottom: 0.8rem;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
  border-radius: 2px;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
}

.admintools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.admintools-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.07);
  padding: 1.5rem;
  text-decoration: none;
  color: #333;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  height: 120px;
  animation: fadeIn 0.5s ease-out;
}

.admintools-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 8px;
  transition: height 0.3s ease;
}

.admintools-card:nth-child(1)::before {
  background: linear-gradient(90deg, #FF9966 0%, #FF5E62 100%);
}

.admintools-card:nth-child(2)::before {
  background: linear-gradient(90deg, #36D1DC 0%, #5B86E5 100%);
}

.admintools-card:nth-child(3)::before {
  background: linear-gradient(90deg, #11998e 0%, #38ef7d 100%);
}

.admintools-card:nth-child(4)::before {
  background: linear-gradient(90deg, #834d9b 0%, #d04ed6 100%);
}

.admintools-card:nth-child(5)::before {
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
}

.admintools-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
}

.admintools-card:hover::before {
  height: 12px;
}

.card-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-right: 1rem;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.admintools-card:nth-child(1) .card-icon {
  background-color: #fff0ee;
  color: #FF5E62;
}

.admintools-card:nth-child(2) .card-icon {
  background-color: #e6f7ff;
  color: #5B86E5;
}

.admintools-card:nth-child(3) .card-icon {
  background-color: #e6fff0;
  color: #11998e;
}

.admintools-card:nth-child(4) .card-icon {
  background-color: #f7e6ff;
  color: #834d9b;
}

.admintools-card:nth-child(5) .card-icon {
  background-color: #e8e6ff;
  color: #4776E6;
}

.card-content {
  flex: 1;
}

.card-title {
  margin: 0 0 8px 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  transition: all 0.3s ease;
}

.card-description {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
}

.card-arrow {
  color: #999;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  margin-left: 10px;
}

.admintools-card:hover .card-arrow {
  transform: translateX(5px);
  color: #333;
}

.back-section {
  display: none;
}

.back-button {
  display: none;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .admintools-container-wrapper {
    padding: 1rem;
    padding-top: 70px;
  }
  
  .admin-dashboard {
    padding: 1rem;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .admintools-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<script>
import NavBar from '@/components/Nav-Bar.vue';
import Footer from '@/components/Footer.vue';
import { useStorage } from '@vueuse/core';
import { useRouter } from 'vue-router';

export default {
    components: {
        NavBar,
        Footer
    },
    setup() {
        const router = useRouter();
        return { router };
    },
    data() {
        return {
            currentUser: useStorage('currentUser', {id: '', name: '', access: '', class: ''}),
        }
    }
}
</script>
