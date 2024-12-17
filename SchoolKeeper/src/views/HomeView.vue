<script>
import axios from 'axios';
import { useStorage } from '@vueuse/core';
import Footer from '@/components/Footer.vue';
const currentUser = useStorage('currentUser', {})

export default {
  data() {
    return {
      message: '',
      email: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
    async submitLogin() {
      const response = await axios.post('http://localhost:1010/api/login', {name: this.email, password: this.password})
      console.log(response.data)
      this.setCurrentUser(response.data)
      this.message = response.data.message;

      window.location.href = '/start';
    },
    setCurrentUser(user) {
      console.log('User:', JSON.stringify(user));
      console.log('User groups:', user.group);
      const classGroup = user.groups?.find(g => g.type === 'class');
      console.log('Found class group:', classGroup);
      currentUser.value = {
        id: user._id,
        name: user.name,
        access: user.access,
        class: classGroup?.name,
      }
    }
  },
  components: {
    Footer,
  },
};
</script>


<template>
  <main>
    <div class="login-container">
      <h2>Logga in</h2>
      <form @submit.prevent="submitLogin">
        
        <div class="form-group">
          <label for="email">Epost:</label>
          <input type="texts" v-model="email" required />
        </div>

        <div class="form-group">
          <label for="password">Lösenord:</label>
          <input type="password" v-model="password" required />
        </div>
        
        <div class="form-group">
          <button type="submit">Logga in</button>
        </div>
      </form>
      
      <div v-if="errorMessage" class="error">
        {{ errorMessage }}
      </div>
    </div>
  </main>
  <Footer />
</template>

<style scoped>
main {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

h2 {
  font-size: 24px;
  font-weight: bold;
  text-align: center; 
  margin-bottom: 20px;
  letter-spacing: 1px;
}

.login-container {
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input, .form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

.form-group input:focus, .form-group select:focus {
  border-color: #5cb85c;
  outline: none;
}

.form-group button {
  width: 100%;
  padding: 10px;
  background-color: #6184b8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.form-group button:hover {
  background-color: #4c73ae;
  transform: scale(102%);
}

.error {
  color: red;
  margin-top: 10px;
}
</style>

