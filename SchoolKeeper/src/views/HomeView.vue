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
      isLoading: false,
      emailError: '',
      passwordError: '',
      formSubmitted: false
    };
  },
  methods: {
    validateEmail() {
      this.emailError = '';
      if (!this.email) {
        this.emailError = 'Email is required';
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        this.emailError = 'Please enter a valid email address';
        return false;
      }
      return true;
    },
    
    validatePassword() {
      this.passwordError = '';
      if (!this.password) {
        this.passwordError = 'Password is required';
        return false;
      }
      return true;
    },
    
    async submitLogin() {
      this.formSubmitted = true;
      this.errorMessage = '';
      
      // Validate inputs
      const isEmailValid = this.validateEmail();
      const isPasswordValid = this.validatePassword();
      
      if (!isEmailValid || !isPasswordValid) {
        return;
      }
      
      try {
        this.isLoading = true;
        
        const response = await axios.post('http://localhost:1010/api/login', {
          email: this.email, 
          password: this.password
        });
        
        console.log('Login response:', response.data);
        this.setCurrentUser(response.data);
        this.message = response.data.message;

        window.location.href = '/start';
      } catch (error) {
        console.error('Login error:', error);
        
        if (error.response) {
          // Handle different error status codes
          if (error.response.status === 401) {
            this.errorMessage = 'Incorrect email or password. Please try again.';
          } else if (error.response.status === 404) {
            this.errorMessage = 'User not found. Please check your email.';
          } else if (error.response.status === 403) {
            this.errorMessage = 'Your account is locked. Please contact an administrator.';
          } else {
            this.errorMessage = 'Login failed. Please try again later.';
          }
        } else {
          this.errorMessage = 'Unable to connect to the server. Please check your internet connection.';
        }
      } finally {
        this.isLoading = false;
      }
    },
    async setCurrentUser(user) {
      console.log('Setting user:', JSON.stringify(user));
      console.log('User groups:', user.groups);
      // Find the class group (for backward compatibility)
      const classGroup = user.groups?.find(g => g.type === 'class');
      console.log('Found class group:', classGroup);

      currentUser.value = {
        id: user._id,
        name: user.name,
        access: user.access,
        class: classGroup?.name || '', // Keep class for backward compatibility
        groups: user.groups?.map(g => g._id) || [], // Add all group IDs
      }

      console.log('Updated currentUser:', currentUser.value);
    }
  },
  components: {
    Footer,
  },
};
</script>


<template>
  <main class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h2>Welcome to SchoolKeeper</h2>
        <p class="subtitle">Sign in to continue</p>
      </div>
      
      <form @submit.prevent="submitLogin" class="login-form">
        <div class="form-group" :class="{ 'has-error': emailError && formSubmitted }">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            placeholder="Enter your email" 
            required 
            autocomplete="email"
            @blur="validateEmail"
          />
          <div v-if="emailError && formSubmitted" class="field-error">{{ emailError }}</div>
        </div>

        <div class="form-group" :class="{ 'has-error': passwordError && formSubmitted }">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            placeholder="Enter your password" 
            required 
            autocomplete="current-password"
            @blur="validatePassword"
          />
          <div v-if="passwordError && formSubmitted" class="field-error">{{ passwordError }}</div>
        </div>
        
        <div class="form-group">
          <button type="submit" class="login-button" :disabled="isLoading">
            <span v-if="isLoading" class="spinner"></span>
            <span v-else>Sign In</span>
          </button>
        </div>
      </form>
      
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      
      <div class="login-footer">
        <p>Need help? Contact your administrator</p>
      </div>
    </div>
  </main>
  <Footer />
</template>

<style scoped>
.login-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4efe9 100%);
  position: relative;
  overflow: hidden;
}

.login-page::before {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
  border-radius: 50%;
  top: -150px;
  right: -150px;
  opacity: 0.4;
  filter: blur(30px);
  animation: float 8s ease-in-out infinite;
}

.login-page::after {
  content: '';
  position: absolute;
  width: 250px;
  height: 250px;
  background: linear-gradient(90deg, #FF9966 0%, #FF5E62 100%);
  border-radius: 50%;
  bottom: -125px;
  left: -125px;
  opacity: 0.4;
  filter: blur(30px);
  animation: float 10s ease-in-out infinite reverse;
}

@keyframes float {
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
  100% { transform: translateY(0) rotate(0deg); }
}

.login-container {
  max-width: 450px;
  width: 90%;
  margin: 0 auto;
  padding: 2.5rem;
  border-radius: 16px;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 10;
  animation: fadeIn 0.8s ease-out;
  border-top: 5px solid #4776E6;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
  margin-top: 0.5rem;
}

.login-form {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
  font-size: 1rem;
}

.form-group input {
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
}

.form-group input:focus {
  border-color: #4776E6;
  box-shadow: 0 0 0 3px rgba(71, 118, 230, 0.2);
  outline: none;
  background-color: #fff;
}

.form-group.has-error input {
  border-color: #f44336;
  background-color: rgba(244, 67, 54, 0.05);
}

.field-error {
  color: #f44336;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  animation: fadeIn 0.3s ease-out;
}

.login-button {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 10px rgba(71, 118, 230, 0.3);
}

.login-button:hover:not(:disabled) {
  background: linear-gradient(90deg, #3d6ae0 0%, #7e49d4 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(71, 118, 230, 0.4);
}

.login-button:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 5px rgba(71, 118, 230, 0.4);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  background-color: rgba(244, 67, 54, 0.1);
  color: #f44336;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  text-align: center;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.login-footer {
  text-align: center;
  margin-top: 2rem;
  color: #666;
  font-size: 0.9rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .login-container {
    padding: 2rem;
    width: 85%;
  }
  
  h2 {
    font-size: 1.8rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 1.5rem;
    width: 90%;
  }
  
  h2 {
    font-size: 1.6rem;
  }
  
  .form-group input {
    padding: 0.9rem;
  }
  
  .login-button {
    padding: 0.9rem;
  }
}
</style>

