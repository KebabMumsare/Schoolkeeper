<template>
  <NavBar site="user-creator" :currentUser="currentUser" />
  <div class="user-creator-container">

    <div class="user-list-container">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Search Users..." 
        class="search-bar" 
      />
      <div class="user-list">
        <div 
          class="user-item" 
          v-for="user in filteredUsers" 
          :key="user.id"
        >
          <div class="user-info">
            <strong>Name:</strong> {{ user.name }} <br />
            <strong>Email:</strong> {{ user.email }} <br />
            <strong>Access Level:</strong> {{ user.access }} <br />
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal">
      <div class="modal-content create-user">
        <h3>Create New User</h3>
        <form @submit.prevent="createUser">
          <input v-model="newUser.name" placeholder="User Name" required />
          <input v-model="newUser.email" placeholder="User Email" type="email" required />
          <select v-model="newUser.access" required>
            <option value="" disabled>Select Access Level</option>
            <option value="Admin">Admin</option>
            <option value="Teacher">Teacher</option>
            <option value="Student">Student</option>
          </select>
          <div class="modal-buttons">
            <button type="submit" class="create-button">Create User</button>
            <button @click="closeModal" class="cancel-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
    <div class="button-container">
      <button @click="openModal" class="create-button">Create New User</button>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
.user-creator-container {
    padding-top: 5rem;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.button-container {
  margin-top: 1rem; /* Add some space above the button */
}

.create-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.create-button:hover {
  background-color: #0056b3;
  cursor: pointer;
}

.user-list-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px; /* Adjust as needed */
  margin-top: 2rem;
}

.search-bar {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 1rem;
}

.user-list {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 1rem;
  background-color: #f8f9fa;
  max-height: 300px; /* Limit height for scrolling */
  overflow-y: auto;
}

.user-item {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.user-item:last-child {
  border-bottom: none; /* Remove border for last item */
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  width: 80%;
  max-width: 600px;
  padding: 2rem;
}

.modal-content input,
.modal-content select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 1rem;
  box-sizing: border-box;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.cancel-button {
  background-color: #f0f0f0;
  color: #007bff;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.cancel-button:hover {
  background-color: #e0e0e0;
}
</style>

<script>
import NavBar from '@/components/Nav-Bar.vue';
import Footer from '@/components/Footer.vue';
import axios from 'axios';
import { useStorage } from "@vueuse/core";

export default {
  name: 'user-creator',
  components: {
    NavBar,
    Footer,
  },
  data() {
    return {
      currentUser: useStorage('currentUser', { name: '', access: '', class: '' }),
      showModal: false,
      newUser: {
        name: '',
        email: '',
        access: ''
      },
      users: [], // Array to hold all users
      searchQuery: '' // For the search input
    };
  },
  computed: {
    filteredUsers() {
      // Filter users based on the search query
      return this.users.filter(user => 
        user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.newUser = { name: '', email: '', access: '' }; // Reset form
    },
    async createUser() {
      if (this.newUser.name && this.newUser.email && this.newUser.access) {
        try {
          const payload = {
            name: this.newUser.name,
            email: this.newUser.email,
            access: this.newUser.access,
          };
          const response = await axios.post('http://localhost:1010/api/users', payload);
          this.users.push(response.data); // Add the new user to the users array
          this.closeModal(); // Close the modal after creating the user
        } catch (error) {
          console.error('Error creating user:', error);
        }
      }
    },
    async fetchUsers() {
      try {
        const response = await axios.get('http://localhost:1010/api/users');
        this.users = response.data; // Fetch all users
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
  },
  mounted() {
    this.fetchUsers(); // Fetch users when the component is mounted
  }
};
</script>



