<template>
  <div class="nav-wrap">
    <div class="nav-container">
      <!-- Logo placeholder -->
      <div class="logo-placeholder">
        <img src="/public/pictures/placeholder.png" alt="Logo" class="logo-image">
      </div>

      <nav class="nav-center">
        <ul class="nav-list">
          <li class="nav-item">
            <a v-if="site !== 'personal'" href="/personal" class="nav-link">
              <img src="https://cdn-icons-png.flaticon.com/128/1077/1077114.png" alt="" class="nav-icon">
            </a>
            <a v-if="site === 'personal'" href="/personal" class="nav-link nav-link-active">
              <img src="https://cdn-icons-png.flaticon.com/128/1077/1077114.png" alt="" class="nav-icon-selected">
            </a>
          </li>
          <li class="nav-item">
            <a v-if="site !== 'start'" href="/start" class="nav-link">
              <img src="https://cdn-icons-png.flaticon.com/512/55/55281.png" alt="" class="nav-icon">
            </a>
            <a v-if="site === 'start'" href="/start" class="nav-link nav-link-active">
              <img src="https://cdn-icons-png.flaticon.com/512/55/55281.png" alt="" class="nav-icon-selected">
            </a>
          </li>
          <li class="nav-item">
            <a v-if="site !== 'notice'" href="/notice" class="nav-link">
              <img src="https://www.iconpacks.net/icons/1/free-bell-icon-860-thumb.png" alt="" class="nav-icon">
            </a>
            <a v-if="site === 'notice'" href="/notice" class="nav-link nav-link-active">
              <img src="https://www.iconpacks.net/icons/1/free-bell-icon-860-thumb.png" alt="" class="nav-icon-selected">
            </a>
          </li>
          <li class="nav-item">
            <a v-if="site !== 'files'" href="/classrooms" class="nav-link">
              <img src="https://banner2.cleanpng.com/20180411/zxq/avf25i5q7.webp" alt="" class="nav-icon">
            </a>
            <a v-if="site === 'files'" href="/classrooms" class="nav-link nav-link-active">
              <img src="https://banner2.cleanpng.com/20180411/zxq/avf25i5q7.webp" alt="" class="nav-icon-selected">
            </a>
          </li>
          <li class="nav-item" v-if="this.currentUser.access === 'Admin'">
            <a v-if="site !== 'admintools'" href="/admintools" class="nav-link">
              <img src="/public/pictures/placeholder.png" alt="" class="nav-icon">
            </a>
            <a v-if="site === 'admintools'" href="/admintools" class="nav-link nav-link-active">
              <img src="/public/pictures/placeholder.png" alt="" class="nav-icon-selected">
            </a>
          </li>
        </ul>
      </nav>
      
      <div v-if="currentUser" class="user-info">
        <p>{{ currentUser.name }} | {{ currentUser.class }}</p>
        <a id="logout-button" href="/" @click.prevent="logout">Logga ut</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav-wrap {
  position: fixed;
  height: 1rem;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 0 0px;
}

.nav-container {
  background-color: rgba(255, 255, 255, 0.95);
  height: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 0 0 30px 30px;
  position: relative;
  backdrop-filter: blur(5px);
}

.logo-placeholder {
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 12px;
  margin-left: 0px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 5px;
}

.logo-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 6px;
}

.nav-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  border-radius: 0px 0px 30px 30px;
  padding: 5px 40px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.nav-list {
  display: flex;
  justify-content: center;
  list-style-type: none;
  margin: 0;
  padding: 0;
  gap: 15px;
}

.nav-item {
  position: relative;
  height: 2.2rem;
  display: flex;
  align-items: center;
}

.nav-link {
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  height: 100%;
  padding: 5px;
  border-radius: 10px;
  transition: all 0.2s ease-in-out;
}

.nav-link:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.nav-link-active {
  width: 2.8rem;
  height: 2.8rem;
  border-radius: 14px;
  background-color: #ffffff;
  position: relative;
  top: 8px;
}

.nav-link-active::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 12px;
  z-index: -1;
}

.nav-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.2s ease-in-out;
  border-radius: 6px;
  object-fit: contain;
}

.nav-icon-selected {
  width: 2.2rem;
  height: 2.2rem;
  position: absolute;
  border-radius: 10px;
  object-fit: contain;
}

.nav-icon:hover {
  transform: scale(1.15);
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 0px;
  font-size: 0.75rem;
  color: #333;
  background-color: white;
  border-radius: 0px 0px 0px 30px;
  padding: 5px 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.user-info p {
  margin: 0 0 3px 0;
  font-weight: 500;
}

#logout-button {
  color: #48aae6;
  text-decoration: none;
  font-size: 0.7rem;
  padding: 2px 5px;
  border-radius: 5px;
  transition: background-color 0.2s;
}

#logout-button:hover {
  background-color: rgba(72, 170, 230, 0.1);
}
</style>

<script>
import { useStorage } from '@vueuse/core';

export default {
  name: 'NavBar',
  props: {
    site: String,
    currentUser: Object,
  },
  methods: {
    logout() {
      localStorage.removeItem('currentUser'); 
      this.$router.replace('/');
    }
  }
};
</script>
