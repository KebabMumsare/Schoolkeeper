<template>
  <div class="nav-wrap">
    <div class="nav-container">
      <div class="logo-placeholder">
        <img src="/public/pictures/placeholder.png" alt="Logo" class="logo-image">
      </div>

      <nav class="nav-center">
        <ul class="nav-list" ref="navList">
          <div class="sliding-indicator" ref="indicator"></div>
          <li class="nav-item" @mouseenter="moveIndicator($event)" @mouseleave="resetIndicator">
            <a v-if="site !== 'personal'" href="/personal" class="nav-link">
              <img src="https://cdn-icons-png.flaticon.com/128/1077/1077114.png" alt="" class="nav-icon">
            </a>
            <a v-if="site === 'personal'" href="/personal" class="nav-link nav-link-active" ref="activeLink">
              <img src="https://cdn-icons-png.flaticon.com/128/1077/1077114.png" alt="" class="nav-icon-selected">
            </a>
          </li>
          <li class="nav-item" @mouseenter="moveIndicator($event)" @mouseleave="resetIndicator">
            <a v-if="site !== 'start'" href="/start" class="nav-link">
              <img src="https://cdn-icons-png.flaticon.com/512/55/55281.png" alt="" class="nav-icon">
            </a>
            <a v-if="site === 'start'" href="/start" class="nav-link nav-link-active" ref="activeLink">
              <img src="https://cdn-icons-png.flaticon.com/512/55/55281.png" alt="" class="nav-icon-selected">
            </a>
          </li>
          <li class="nav-item" @mouseenter="moveIndicator($event)" @mouseleave="resetIndicator">
            <a v-if="site !== 'notice'" href="/notice" class="nav-link">
              <img src="https://www.iconpacks.net/icons/1/free-bell-icon-860-thumb.png" alt="" class="nav-icon">
            </a>
            <a v-if="site === 'notice'" href="/notice" class="nav-link nav-link-active" ref="activeLink">
              <img src="https://www.iconpacks.net/icons/1/free-bell-icon-860-thumb.png" alt="" class="nav-icon-selected">
            </a>
          </li>
          <li class="nav-item" @mouseenter="moveIndicator($event)" @mouseleave="resetIndicator">
            <a v-if="site !== 'files'" href="/classrooms" class="nav-link">
              <img src="https://banner2.cleanpng.com/20180411/zxq/avf25i5q7.webp" alt="" class="nav-icon">
            </a>
            <a v-if="site === 'files'" href="/classrooms" class="nav-link nav-link-active" ref="activeLink">
              <img src="https://banner2.cleanpng.com/20180411/zxq/avf25i5q7.webp" alt="" class="nav-icon-selected">
            </a>
          </li>
          <li class="nav-item" v-if="this.currentUser.access === 'Admin'" @mouseenter="moveIndicator($event)" @mouseleave="resetIndicator">
            <a v-if="site !== 'admintools'" href="/admintools" class="nav-link">
              <img src="/public/pictures/placeholder.png" alt="" class="nav-icon">
            </a>
            <a v-if="site === 'admintools'" href="/admintools" class="nav-link nav-link-active" ref="activeLink">
              <img src="/public/pictures/placeholder.png" alt="" class="nav-icon-selected">
            </a>
          </li>
        </ul>
      </nav>
      
      <div v-if="currentUser" class="user-info" :class="{ 'user-info-expanded': isProfileExpanded }" @click="toggleProfileInfo">
        <div class="user-info-wrapper">
          <p class="user-name">{{ currentUser.name }} | {{ currentUser.class }}</p>
          <a id="logout-button" href="/" @click.stop="logout">Logga ut</a>
        </div>
        <div class="additional-info" :class="{ 'additional-info-expanded': isProfileExpanded }">
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
  margin: 0;
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
  padding-top: 0;
  margin-top: 0;
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
  padding: 0 58px 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  top: 0;
  margin-top: 0;
  overflow: visible;
  height: auto;
}

.nav-list {
  display: flex;
  justify-content: center;
  list-style-type: none;
  margin: 0;
  padding: 0;
  gap: 32px;
  padding-top: 10px;
  position: relative;
}

.sliding-indicator {
  position: absolute;
  bottom: -8px;
  height: 3px;
  width: 20px;
  background-color: #4361ee;
  border-radius: 10px;
  transition: left 0.3s ease-in-out;
  opacity: 1;
  z-index: 3;
  pointer-events: none;
}

.nav-item {
  position: relative;
  height: 2.5rem;
  display: flex;
  align-items: center;
  padding-top: 0;
  margin-top: 0;
  transition: transform 0.3s ease-in-out;
}

.nav-item:hover ~ .nav-item {
  --hovered: 1;
}

.nav-link {
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  height: 100%;
  width: 54px;
  padding: 10px 0 0 0;
  border-radius: 12px;
  transition: all 0.3s ease-in-out;
  position: relative;
  background-color: transparent;
  z-index: 2;
}

.nav-link:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.nav-link::after {
  display: none;
}

.nav-link:hover::after {
  display: none;
}

.nav-link-active {
  background-color: transparent;
  box-shadow: none;
  transform: translateY(-5px);
}

.nav-link-active::after {
  display: none;
}

.nav-icon, .nav-icon-selected {
  width: 28px;
  height: 28px;
  transition: all 0.3s ease-in-out;
  border-radius: 0;
  object-fit: contain;
}

.nav-icon-selected {
  width: 36px;
  height: 36px;
  opacity: 1;
  filter: drop-shadow(0 4px 6px rgba(67, 97, 238, 0.3));
  transform: translateY(-2px);
}

.nav-link-active::before {
  content: '';
  position: absolute;
  bottom: -22px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 15px;
  background-color: white;
  border-radius: 0 0 15px 15px;
  z-index: 1;
  transition: all 0.3s ease-in-out;
}

.nav-icon:hover {
  transform: scale(1.15);
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 0px;
  font-size: 0.85rem;
  color: #333;
  background-color: white;
  border-radius: 0px 0px 0px 20px;
  padding: 8px 15px 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  min-width: 180px;
  position: relative;
  z-index: 110;
}

.user-info-expanded {
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

.user-info-expanded .user-name {
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

.additional-info-expanded {
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
  data() {
    return {
      indicatorPosition: { left: 0 },
      lastHoveredPosition: { left: 0 },
      hoverTimer: null,
      resetTimer: null,
      isHovering: false,
      resetDelay: 450,
      isProfileExpanded: false
    };
  },
  mounted() {
    window.addEventListener('load', this.initializeIndicator);
    this.$nextTick(() => {
      this.initializeIndicator();
    });
    
    // Close profile dropdown when clicking outside
    document.addEventListener('click', this.closeProfileDropdown);
  },
  updated() {
    this.initializeIndicator();
  },
  beforeUnmount() {
    // Clean up event listener
    document.removeEventListener('click', this.closeProfileDropdown);
  },
  methods: {
    logout(event) {
      event.preventDefault();
      localStorage.removeItem('currentUser'); 
      this.$router.replace('/');
    },
    toggleProfileInfo(event) {
      event.stopPropagation();
      this.isProfileExpanded = !this.isProfileExpanded;
    },
    closeProfileDropdown(event) {
      // Check if click is outside the user info area
      const userInfoElement = document.querySelector('.user-info');
      if (userInfoElement && !userInfoElement.contains(event.target)) {
        this.isProfileExpanded = false;
      }
    },
    initializeIndicator() {
      const activeLink = this.$refs.activeLink || document.querySelector('.nav-link-active');
      const indicator = this.$refs.indicator || document.querySelector('.sliding-indicator');
      const navList = this.$refs.navList || document.querySelector('.nav-list');
      
      if (activeLink && indicator && navList) {
        const navListRect = navList.getBoundingClientRect();
        const activeLinkRect = activeLink.getBoundingClientRect();
        
        const left = activeLinkRect.left - navListRect.left + (activeLinkRect.width - 20) / 2;
        
        indicator.style.left = `${left}px`;
        this.indicatorPosition.left = left;
      }
    },
    moveIndicator(event) {
      if (this.hoverTimer) {
        clearTimeout(this.hoverTimer);
      }
      if (this.resetTimer) {
        clearTimeout(this.resetTimer);
      }
      
      const targetElement = event.currentTarget;
      this.isHovering = true;
      
      this.hoverTimer = setTimeout(() => {
        const indicator = this.$refs.indicator || document.querySelector('.sliding-indicator');
        const navList = this.$refs.navList || document.querySelector('.nav-list');
        
        if (!indicator || !navList) return;
        
        const navListRect = navList.getBoundingClientRect();
        const linkRect = targetElement.getBoundingClientRect();
        
        const left = linkRect.left - navListRect.left + (linkRect.width - 20) / 2;
        
        this.lastHoveredPosition.left = left;
        
        indicator.style.left = `${left}px`;
      }, 100);
    },
    resetIndicator() {
      if (this.hoverTimer) {
        clearTimeout(this.hoverTimer);
        this.hoverTimer = null;
      }
      
      this.isHovering = false;
      
      setTimeout(() => {
        if (this.isHovering) return;
        
        const indicator = this.$refs.indicator || document.querySelector('.sliding-indicator');
        if (!indicator) return;
        
        if (this.lastHoveredPosition.left !== 0) {
          indicator.style.left = `${this.lastHoveredPosition.left}px`;
          
          if (this.resetTimer) {
            clearTimeout(this.resetTimer);
          }
          
          this.resetTimer = setTimeout(() => {
            if (!this.isHovering) {
              indicator.style.left = `${this.indicatorPosition.left}px`;
              this.lastHoveredPosition.left = 0;
            }
          }, this.resetDelay);
        } else {
          indicator.style.left = `${this.indicatorPosition.left}px`;
        }
      }, 50);
    }
  }
};
</script>
