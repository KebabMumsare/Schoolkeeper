<template>
    <main>
      <div class="form-container">
        <h2>User Information</h2>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="name">Name:</label>
            <input
              type="text"
              id="name"
              v-model="name"
              placeholder="Enter your name"
              required
            />
          </div>
  
          <div class="form-group">
            <label for="email">Email:</label>
            <input
              type="email"
              id="email"
              v-model="email"
              placeholder="Enter your email"
              required
            />
          </div>
  
          <div class="form-group">
            <label for="phone">Phone Number:</label>
            <input
              type="tel"
              id="phone"
              v-model="phone"
              placeholder="Enter your phone number"
              required
            />
          </div>
  
          <div class="form-group">
            <button type="submit">Submit</button>
          </div>
        </form>
  
        <div class="user-info">
          <h3>Entered Information:</h3>
          <p><strong>Name:</strong> {{ name }}</p>
          <p><strong>Email:</strong> {{ email }}</p>
          <p><strong>Phone:</strong> {{ phone }}</p>
        </div>
      </div>
    </main>
  </template>
  
  <script>
  export default {
    data() {
      return {
        name: '',
        email: '',
        phone: '',
      };
    },
    methods: {
      submitForm() {
        // Simple validation or action on submit
        alert(`Form submitted!\nName: ${this.name}\nEmail: ${this.email}\nPhone: ${this.phone}`);
      },
    },
  };
  </script>
  
  <style scoped>
  main {
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, #f0f4f8, #d9e6f2);
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
  
  .form-container {
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
  
  .form-group input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    transition: border-color 0.3s ease;
  }
  
  .form-group input:focus {
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
  
  .user-info {
    margin-top: 20px;
    text-align: center;
  }
  
  .user-info h3 {
    font-size: 20px;
    margin-bottom: 10px;
  }
  
  .user-info p {
    font-size: 16px;
    margin: 5px 0;
  }
  </style>
    