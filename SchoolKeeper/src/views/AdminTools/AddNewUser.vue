<template>
  <div class="wraper">
    <!-- Left Sidebar -->
    <div class="components">
      <div class="components-header">
        <button @click="goBack" class="back-button">
          Tillbaka
        </button>
        <h2>Användare</h2>
      </div>

      <!-- Search and List in Sidebar -->
      <div class="sidebar-content">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Sök användare..." 
          class="search-bar" 
        />
        <div class="user-list">
          <div 
            v-for="user in filteredUsers"  
            :key="user.id"
            class="user-item"
            @click="selectUser(user)"
          >
            <div class="user-info">
              <strong>Namn:</strong> {{ user.name }} <br />
              <strong>Behörighet:</strong> {{ user.access }}
            </div>
          </div>
        </div>
      </div>

      <div class="button-wrapper">
        <button @click="openModal" class="create-button">Skapa ny användare</button>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="main-container">
      <div class="main-header">
        <h2>Användardetaljer</h2>
      </div>
      <div class="main-content">
        <div class="info-container">
          <div class="user-details-box">
            <h3>Användarinformation</h3>
            <div class="details-content">
              <p><strong>Namn:</strong> {{ selectedUser?.name || 'Ingen användare vald' }}</p>
              <p><strong>Födelsedatum:</strong> {{ selectedUser?.birthday || 'Ej angivet' }}</p>
              <p><strong>E-post:</strong> {{ selectedUser?.email || 'Ej angivet' }}</p>
              <p><strong>Behörighetsnivå:</strong> {{ selectedUser?.access || 'Ej angivet' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Create User Modal -->
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <h3>Skapa användare</h3>
      <form @submit.prevent="createUser">
        <div class="form-group">
          <label for="name">Namn</label>
          <input id="name" v-model="newUser.name" placeholder="Namn" required />
        </div>
        
        <div class="form-group">
          <label for="email">E-post</label>
          <input id="email" type="email" v-model="newUser.email" placeholder="E-post" />
          <small>Lämna tomt för automatiskt genererad e-post</small>
        </div>

        <div class="form-group">
          <label for="password">Lösenord</label>
          <input id="password" type="password" v-model="newUser.password" placeholder="Lösenord" required />
        </div>

        <div class="form-group">
          <label for="birthday">Födelsedatum</label>
          <input id="birthday" type="date" v-model="newUser.birthday" placeholder="Födelsedatum" />
        </div>

        <div class="form-group">
          <label for="phone">Telefonnummer</label>
          <input id="phone" type="tel" v-model="newUser.phone" placeholder="Telefonnummer" />
        </div>

        <div class="form-group">
          <label for="access">Behörighet</label>
          <select id="access" v-model="newUser.access" required>
            <option value="" disabled>Välj behörighet</option>
            <option value="Admin">Administratör</option>
            <option value="Teacher">Lärare</option>
            <option value="Student">Elev</option>
            <option value="Parent">Förälder/Vårdnadshavare</option>
          </select>
        </div>

        <div class="form-group">
          <label for="courses">Kurser</label>
          <input id="courses" v-model="newUser.courses" placeholder="Ex: Matematik, Svenska, Engelska" />
          <small>Separera kurser med kommatecken</small>
        </div>

        <div class="emergency-contact">
          <h4>Kontakt vid nödfall</h4>
          <div class="form-group">
            <label for="emergencyName">Namn</label>
            <input id="emergencyName" v-model="newUser.emergencyContact.name" placeholder="Namn" />
          </div>
          <div class="form-group">
            <label for="emergencyPhone">Telefon</label>
            <input id="emergencyPhone" type="tel" v-model="newUser.emergencyContact.phone" placeholder="Telefonnummer" />
          </div>
          <div class="form-group">
            <label for="emergencyRelation">Relation</label>
            <input id="emergencyRelation" v-model="newUser.emergencyContact.relation" placeholder="Relation" />
          </div>
        </div>

        <div class="modal-buttons">
          <button type="submit" class="create-button">Skapa användare</button>
          <button @click="closeModal" class="cancel-button">Avbryt</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Global Transition Variables */
:root {
  --transition-smooth: all 0.3s ease-out;
  --shadow-hover: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.wraper {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

/* Left Sidebar Styles */
.components {
  width: 20vw;
  background-color: #f5f5f5;
  position: relative;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #ddd;
}

.components-header {
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: #216e87;
  border-bottom: 1px solid #ddd;
}

.components-header h2 {
  margin: 0;
  color: white;
}

.sidebar-content {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

.search-bar {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.user-item {
  background-color: white;
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.user-item:hover {
  background-color: #f0f0f0;
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
  border-color: #4fc0e5;
}

/* Main Content Area Styles */
.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.main-header {
  padding: 1rem;
  background-color: #4fc0e5;
  color: white;
}

.main-header h2 {
  margin: 0;
}

.main-content {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

.info-container {
  display: flex;
  gap: 2rem;
  height: 100%;
}

.user-details-box {
  flex: 1;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-details-box h3 {
  color: #216e87;
  margin-top: 0;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #4fc0e5;
}

.details-content p {
  margin: 0.5rem 0;
  line-height: 1.6;
}

/* Button Styles */
.button-wrapper {
  padding: 1rem;
  border-top: 1px solid #ddd;
}

.create-button {
  background-color: #4fc0e5;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  width: 100%;
  transition: var(--transition-smooth);
  position: relative;
  overflow: hidden;
}

.create-button:hover {
  background-color: #216e87;
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.create-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.1s ease;
}

.back-button {
  padding: 0.5rem 1rem;
  background-color: #4fc0e5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: var(--transition-smooth);
}

.back-button:hover {
  background-color: #1d5d73;
  transform: translateX(-2px);
  box-shadow: var(--shadow-hover);
}

.back-button:active {
  transform: translateX(0);
  box-shadow: none;
  transition: all 0.1s ease;
}

/* Modal Styles */
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
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  max-height: 80vh;
  overflow-y: auto;
}

.modal-content h3 {
  color: #216e87;
  margin-top: 0;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.3rem;
  font-weight: bold;
  color: #216e87;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  transition: var(--transition-smooth);
}

.form-group input:focus,
.form-group select:focus {
  border-color: #4fc0e5;
  box-shadow: 0 0 0 2px rgba(79, 192, 229, 0.2);
  outline: none;
}

.form-group small {
  display: block;
  color: #777;
  font-size: 0.8rem;
  margin-top: 0.2rem;
}

.emergency-contact {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: #f9f9f9;
  transition: var(--transition-smooth);
}

.emergency-contact:hover {
  border-color: #4fc0e5;
  box-shadow: 0 0 0 1px rgba(79, 192, 229, 0.2);
}

.emergency-contact h4 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #216e87;
}

.modal-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.cancel-button {
  background-color: #f0f0f0;
  color: #216e87;
  border: none;
  padding: 0.5rem 2rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.cancel-button:hover {
  background-color: #e0e0e0;
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.cancel-button:active {
  transform: translateY(0);
  box-shadow: none;
  transition: all 0.1s ease;
}
</style>

<script>
import axios from 'axios';
import { useStorage } from "@vueuse/core";

export default {
  name: 'user-creator',
  data() {
    return {
      currentUser: useStorage('currentUser', { name: '', access: '', class: '' }),
      showModal: false,
      users: [],
      searchQuery: '',
      newUser: {
        name: '',
        email: '',
        password: '',
        birthday: '',
        phone: '',
        access: '',
        courses: '',
        emergencyContact: {
          name: '',
          phone: '',
          relation: ''
        }
      },
      selectedUser: null
    };
  },
  computed: {
    filteredUsers() {
      return this.users.filter(user => 
        user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    createEmail(name) {
      const domain = 'skolan.se';
      return `${name.toLowerCase().replace(/\s+/g, '')}@${domain}`;
    },
    goBack() {
      this.$router.push('/admintools');
    },
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.newUser = { 
        name: '', 
        email: '', 
        password: '',
        birthday: '',
        phone: '',
        access: '',
        courses: '',
        emergencyContact: {
          name: '',
          phone: '',
          relation: ''
        }
      };
    },
    selectUser(user) {
      this.selectedUser = user;
    },
    async createUser() {
      if (this.newUser.name && this.newUser.access && this.newUser.password) {
        try {
          // Process courses into array if provided
          const coursesArray = this.newUser.courses 
            ? this.newUser.courses.split(',').map(course => course.trim()) 
            : [];
          
          const payload = {
            name: this.newUser.name,
            email: this.newUser.email || this.createEmail(this.newUser.name),
            password: this.newUser.password,
            birthday: this.newUser.birthday,
            phone: this.newUser.phone,
            access: this.newUser.access,
            courses: coursesArray,
            emergencyContact: this.newUser.emergencyContact
          };
          
          const response = await axios.post('http://localhost:1010/api/users', payload);
          this.users.push(response.data);
          this.closeModal();
        } catch (error) {
          console.error('Error creating user:', error);
        }
      }
    },
    async fetchUsers() {
      try {
        const response = await axios.get('http://localhost:1010/api/users');
        this.users = response.data;
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
  },
  mounted() {
    this.fetchUsers();
  }
};
</script>


