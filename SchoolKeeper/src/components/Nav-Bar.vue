<template>
  <div class="nav-wrap">
    <div class="nav-container">
      <div class="nav-spacer"></div>
      <nav>
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
            <a v-if="site !== 'files'" href="/filer" class="nav-link">
              <img src="https://cdn-icons-png.flaticon.com/512/686/686112.png" alt="" class="nav-icon">
            </a>
            <a v-if="site === 'files'" href="/filer" class="nav-link nav-link-active">
              <img src="https://cdn-icons-png.flaticon.com/512/686/686112.png" alt="" class="nav-icon-selected">
            </a>
          </li>
        </ul>
      </nav>
      <!-- Add user info -->
      <div v-if="currentUser" class="user-info">
        <p>{{ currentUser.name }} | {{ currentUser.class }}</p>
      </div>
    </div>
    <div v-if="showSecondaryNav" class="secondary-nav">
      <ul class="secondary-nav-list">
        <li class="secondary-nav-item">
          <a href="#overview">Overview</a>
        </li>
        <li class="secondary-nav-item">
          <a href="#assignments">Assignments</a>
        </li>
        <li class="secondary-nav-item">
          <a href="#resources">Resources</a>
        </li>
        <li class="secondary-nav-item">
          <a href="#discussions">Discussions</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.nav-wrap {
  position: fixed;
  height: 7rem;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.nav-container {
  background-color: #f8f9fa;
  padding: 10px;
  margin-bottom: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-spacer {
  flex: 1;
}

nav {
  flex: 2;
  display: flex;
  justify-content: center;
}

.nav-list {
  display: flex;
  justify-content: center;
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  position: relative;
  margin: 0 15px;
  height: 4rem;
}

.nav-link {
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  height: 100%;
}

.nav-link-active {
  width: 5.5rem;
  height: 5.5rem;
  border: solid black 0px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  background-color: #f8f9fa;
}

.nav-icon {
  width: 30px;
  height: 30px;
  transition: transform 0.2s ease-in-out;
  margin: 2rem;
}

.nav-icon-selected {
  width: 5rem;
  height: 5rem;
  position: absolute;
}

.nav-icon:hover {
  transform: scale(1.3);
}

.user-info {
  flex: 1;
  text-align: right;
  margin-right: 15px;
  font-size: 0.9rem;
  color: #333;
}

.secondary-nav {
  background-color: #e9ecef;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.secondary-nav-list {
  display: flex;
  justify-content: center;
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.secondary-nav-item {
  margin: 0 15px;
}

.secondary-nav-item a {
  text-decoration: none;
  color: #333;
  font-size: 0.9rem;
  transition: color 0.2s ease-in-out;
}

.secondary-nav-item a:hover {
  color: #007bff;
}

/* Adjust the main nav-wrap to accommodate the secondary navbar */
.nav-wrap {
  height: auto;
  min-height: 7rem;
}

.nav-container {
  height: 5rem;
}
</style>

<script>
import { useRoute } from 'vue-router'

export default {
  name: 'NavBar',
  props: {
    site: String,
    currentUser: Object,
  },
  setup() {
    const route = useRoute()
    return { route }
  },
  computed: {
    showSecondaryNav() {
      return this.route.meta.showSecondaryNav
    }
  }
}
</script>
