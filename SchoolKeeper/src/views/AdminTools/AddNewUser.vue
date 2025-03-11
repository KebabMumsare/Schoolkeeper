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
.wraper {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #f0f2f5;
  background-image: linear-gradient(135deg, #f5f7fa 0%, #e4efe9 100%);
}

/* Left Sidebar Styles */
.components {
  width: 350px;
  background-color: #fff;
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.07);
  z-index: 10;
  border-right: 1px solid #eee;
}

.components-header {
  padding: 1.2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  border-bottom: 1px solid #eee;
  background-color: #f9f9f9;
}

.components-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.4rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-content {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #36D1DC #f0f2f5;
}

.sidebar-content::-webkit-scrollbar {
  width: 6px;
}

.sidebar-content::-webkit-scrollbar-track {
  background: #f0f2f5;
}

.sidebar-content::-webkit-scrollbar-thumb {
  background: #36D1DC;
  border-radius: 3px;
}

.search-bar {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.search-bar:focus {
  border-color: #36D1DC;
  outline: none;
  box-shadow: 0 0 0 3px rgba(54, 209, 220, 0.2);
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.user-item {
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #eee;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  position: relative;
  overflow: hidden;
}

.user-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #36D1DC 0%, #5B86E5 100%);
  transition: height 0.3s ease;
}

.user-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  border-color: #36D1DC;
}

.user-item:hover::before {
  height: 6px;
}

/* Main Content Area Styles */
.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.main-header {
  padding: 1.2rem;
  background: linear-gradient(90deg, #36D1DC 0%, #5B86E5 100%);
  color: white;
}

.main-header h2 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
}

.main-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #36D1DC #f0f2f5;
}

.main-content::-webkit-scrollbar {
  width: 6px;
}

.main-content::-webkit-scrollbar-track {
  background: #f0f2f5;
}

.main-content::-webkit-scrollbar-thumb {
  background: #36D1DC;
  border-radius: 3px;
}

.info-container {
  display: flex;
  gap: 2rem;
  height: 100%;
}

.user-details-box {
  flex: 1;
  background-color: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.07);
}

.user-details-box h3 {
  color: #333;
  margin-top: 0;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #36D1DC;
  font-size: 1.3rem;
}

.details-content p {
  margin: 0.8rem 0;
  line-height: 1.6;
  color: #555;
}

/* Button Styles */
.button-wrapper {
  padding: 1.2rem;
  border-top: 1px solid #eee;
  background: linear-gradient(to top, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.8));
}

.create-button {
  background: linear-gradient(90deg, #36D1DC 0%, #5B86E5 100%);
  padding: 1rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  width: 100%;
  box-shadow: 0 4px 10px rgba(54, 209, 220, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}

.create-button:hover {
  box-shadow: 0 6px 15px rgba(54, 209, 220, 0.3);
  transform: translateY(-2px);
}

.create-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.1s ease;
}

.back-button {
  padding: 0.6rem 1rem;
  background: linear-gradient(90deg, #36D1DC 0%, #5B86E5 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 10px rgba(54, 209, 220, 0.2);
  display: flex;
  align-items: center;
  gap: 6px;
}

.back-button::before {
  content: '←';
  font-size: 1.1rem;
}

.back-button:hover {
  box-shadow: 0 6px 15px rgba(54, 209, 220, 0.3);
  transform: translateY(-2px);
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
  backdrop-filter: blur(3px);
}

.modal-content {
  background-color: #fff;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  max-height: 80vh;
  overflow-y: auto;
  animation: modalFadeIn 0.4s;
  scrollbar-width: thin;
  scrollbar-color: #36D1DC #f0f2f5;
}

@keyframes modalFadeIn {
  from { opacity: 0; transform: translateY(-40px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-content::-webkit-scrollbar {
  width: 6px;
}

.modal-content::-webkit-scrollbar-track {
  background: #f0f2f5;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #36D1DC;
  border-radius: 3px;
}

.modal-content h3 {
  color: #333;
  margin-top: 0;
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 0.8rem;
  font-size: 1.5rem;
}

.modal-content h3::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #36D1DC 0%, #5B86E5 100%);
  border-radius: 2px;
}

.form-group {
  margin-bottom: 1.2rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #eee;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #36D1DC;
  outline: none;
  box-shadow: 0 0 0 3px rgba(54, 209, 220, 0.2);
}

.form-group small {
  display: block;
  color: #777;
  font-size: 0.8rem;
  margin-top: 0.4rem;
}

.emergency-contact {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1.2rem;
  margin-bottom: 1.5rem;
  background-color: #f9f9f9;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.emergency-contact:hover {
  border-color: #36D1DC;
  box-shadow: 0 0 0 1px rgba(54, 209, 220, 0.2);
}

.emergency-contact h4 {
  margin-top: 0;
  margin-bottom: 1.2rem;
  color: #333;
  font-size: 1.1rem;
  position: relative;
  padding-bottom: 0.5rem;
}

.emergency-contact h4::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, #36D1DC 0%, #5B86E5 100%);
  border-radius: 2px;
}

.modal-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.cancel-button {
  background-color: #f5f5f5;
  color: #666;
  border: 1px solid #eee;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
}

.cancel-button:hover {
  background-color: #e5e5e5;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
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


