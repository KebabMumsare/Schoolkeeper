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
        </ul>
      </nav>
      
      <!-- Add user info -->
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

.logo-placeholder {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.nav-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
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

/* Remove styles related to secondary navbar */
.nav-wrap {
  height: 5rem; /* Adjust this value if needed */
}

.nav-container {
  height: 5rem;
}
</style>

<script>
export default {
  name: 'NavBar',
  props: {
    site: String,
    currentUser: Object,
  },
  methods: {
    logout() {
      localStorage.removeItem('authToken'); 
      this.$emit('logout'); 
      this.currentUser = null;
      this.$router.replace('/HomeView.vue');
    }
  }
};
</script>
