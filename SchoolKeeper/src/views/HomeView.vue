<script>
import axios from 'axios';

export default {
  data() {
    return {
      message: ''
    };
  },
  mounted() {
    axios.get('http://83.250.70.53:3306/api/test')
    .then(response => {
      this.message = response.data.message;
    })
    .catch(error => {
      console.error('There was an error!', error);
    });
  }
};
</script>

<template>
  <main>
    <div class="login-container">
      <h2>Login</h2>
      <form @submit.prevent="submitLogin">
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" v-model="email" required />
        </div>
        
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" v-model="password" required />
        </div>
        
        <div class="form-group">
          <label for="role">Role:</label>
          <select v-model="role" required>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="parent">Parent</option>
          </select>
        </div>
        
        <div class="form-group">
          <button type="submit">Login</button>
        </div>
      </form>
      
      <div v-if="errorMessage" class="error">
        {{ errorMessage }}
      </div>
    </div>
  </main>
  <div>
    <h1>{{ message }}</h1>
  </div>
</template>


<style scoped>

main {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #f0f4f8, #d9e6f2);
  display: flex;
  justify-content: center;
  align-items: center;
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

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #5cb85c;
  outline: none;
}


.form-group button {
  width: 100%;
  padding: 10px;
  background-color: #5cb85c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.form-group button:hover {
  background-color: #4cae4c;
  transform: scale(102%);
}

.error {
  color: red;
  margin-top: 10px;
}
</style>

