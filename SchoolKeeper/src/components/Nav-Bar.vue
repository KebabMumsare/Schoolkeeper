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
        <div class="user-info-wrapper">
          <p class="user-name">{{ currentUser.name }} | {{ currentUser.class }}</p>
          <a id="logout-button" href="/" @click.prevent="logout">Logga ut</a>
        </div>
        <div class="additional-info">
          <p><strong>ID:</strong> {{ currentUser.id || 'N/A' }}</p>
          <p><strong>Access:</strong> {{ currentUser.access }}</p>
          <p><strong>Last Login:</strong> Today</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav-wrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 0;
}

.nav-container {
  background-color: transparent;
  height: 4.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 0 0 20px 20px;
  position: relative;
  box-shadow: none;
}

.nav-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  backdrop-filter: blur(5px);
  z-index: -1;
}

.logo-placeholder {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 12px;
  margin-left: 20px;
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
  border-radius: 0px 0px 20px 20px;
  padding: 10px 58px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-list {
  display: flex;
  justify-content: center;
  list-style-type: none;
  margin: 0;
  padding: 0;
  gap: 32px;
}

.nav-item {
  position: relative;
  height: 2.5rem;
  display: flex;
  align-items: center;
}

.nav-link {
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  height: 100%;
  width: 54px;
  padding: 8px;
  border-radius: 12px;
  transition: all 0.2s ease-in-out;
  position: relative;
  background-color: transparent;
}

.nav-link:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.nav-link-active {
  background-color: transparent;
  box-shadow: none;
}

.nav-link-active::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  background-color: #4361ee;
  border-radius: 10px;
}

.nav-icon, .nav-icon-selected {
  width: 28px;
  height: 28px;
  transition: transform 0.2s ease-in-out;
  border-radius: 0;
  object-fit: contain;
}

.nav-icon-selected {
  opacity: 1;
}

.nav-icon:hover {
  transform: scale(1.15);
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 20px;
  font-size: 0.85rem;
  color: #333;
  background-color: white;
  border-radius: 12px 12px 0 20px;
  padding: 8px 15px 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  min-width: 180px;
  position: relative;
  z-index: 110;
}

.user-info:hover {
  min-width: 220px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 12px 12px 0 0;
}

.user-info-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.user-name {
  margin: 0 0 5px 0;
  font-weight: 500;
  white-space: nowrap;
  text-align: right;
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
}

.user-info:hover .user-name {
  font-weight: 600;
}

.additional-info {
  max-height: 0;
  opacity: 0;
  transition: all 0.3s ease;
  width: 100%;
  overflow: hidden;
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #f9f9f9;
  border-radius: 0 0 12px 20px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  z-index: 100;
  padding: 0 15px;
}

.user-info:hover .additional-info {
  max-height: 120px;
  opacity: 1;
  padding: 0px 15px 12px;
}

.additional-info p {
  margin: 8px 0;
  font-size: 0.8rem;
  font-weight: 400;
  color: #666;
  text-align: right;
}

#logout-button {
  color: #48aae6;
  text-decoration: none;
  font-size: 0.8rem;
  padding: 3px 8px;
  border-radius: 5px;
  transition: background-color 0.2s;
  display: inline-block;
  margin-top: 2px;
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
