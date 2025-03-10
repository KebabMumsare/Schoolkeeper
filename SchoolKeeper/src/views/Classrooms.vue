<script>
import axios from 'axios';
import NavBar from '@/components/Nav-Bar.vue';
import { useStorage } from "@vueuse/core";
import { useRouter } from 'vue-router'
import Footer from '@/components/Footer.vue'

export default {
  name: 'filer',
  components: {
    NavBar,
    Footer,
  },
  data() {
    return {
      currentUser: useStorage('currentUser', { name: '', access: '', class: '' }),
      files: [],
      classrooms: [],
      showModal: false,
      currentClassroom: {
        id: null,
        name: '',
        groupId: '',
        subject: ''
      },
      isEditing: false,
      availableGroups: []
    };
  },
  computed: {
    filteredClassrooms() {
      if (this.currentUser.access === 'Elev') {
        return this.classrooms.filter(classroom => classroom.class === this.currentUser.class);
      }
      return this.classrooms;
    }
  },
  methods: {
    onFileChange(event) {
      this.files = event.target.files;
    },
    async uploadFiles() {
      if (this.files.length === 0) {
        alert("Please select files.");
        return;
      }

      let formData = new FormData();

      for (let i = 0; i < this.files.length; i++) {
        formData.append("photos", this.files[i]);
      }

      try {
        const response = await axios.post('http://localhost:1010/photos/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log("Upload successful", response.data);
      } catch (error) {
        console.error("Error uploading files", error);
      }
    },

    async createClassroom() {
      await axios.post('http://localhost:1010/api/classrooms/', {
        name: this.currentClassroom.name,
        groupId: this.currentClassroom.group,
        subject: this.currentClassroom.subject
      });
      this.loadClasses();
    },
    async deleteClassroom(index) {
      await axios.delete(`http://localhost:1010/api/classrooms/${index}`)
      this.loadClasses();
    },
    openCreateModal() {
      this.isEditing = false;
      this.currentClassroom = { id: null, name: '', groupId: '', subject: '' };
      this.showModal = true;
    },
    openEditModal(classroom) {
      this.isEditing = true;
      this.currentClassroom = { ...classroom };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    saveClassroom() {
      if (this.isEditing) {
        const index = this.classrooms.findIndex(c => c.id === this.currentClassroom.id);
        if (index !== -1) {
          this.classrooms[index] = { ...this.currentClassroom };
        }
      } else {
        const newId = this.classrooms.length > 0 ? Math.max(...this.classrooms.map(c => c.id)) + 1 : 1;
        this.classrooms.push({
          id: newId,
          name: this.currentClassroom.name,
          groupId: this.currentClassroom.groupId,
          subject: this.currentClassroom.subject
        });
      }
      this.showModal = false;
      this.resetCurrentClassroom();
      this.loadClasses();
    },
    resetCurrentClassroom() {
      this.currentClassroom = {
        id: null,
        name: '',
        groupId: '',
        subject: ''
      };
      this.isEditing = false;
    },

    async fetchGroups() {
      try {
        const response = await axios.get('http://localhost:1010/api/groups');
        this.availableGroups = response.data;
      } catch (error) {
        console.error('Error fetching groups:', error);
        this.availableGroups = [];
      }
    },
    async loadClasses() {
      try {
        const response = await axios.get('http://localhost:1010/api/classrooms');
        this.classrooms = response.data;
        console.log('Fetched classrooms:', this.classrooms);
      } catch (error) {
        console.error('Error fetching classrooms:', error);
        this.classrooms = []; // Set to empty array in case of error
      }
    },
    enterClassroom(classroom) {
      console.log(`Entering classroom: ${classroom.name}`);
      this.router.push(`/classroom/${classroom._id}`);
    },
  },
  setup() {
    const router = useRouter()
    return { router }
  },
  mounted() {
    this.fetchGroups();
    this.loadClasses();
  }
};
</script>

<template>
  <NavBar site="files" :currentUser="currentUser" />
  <div class="classrooms-container-wrapper">
    <div id="classrooms" :class="{ 'full-width': currentUser.access === 'Elev' }">
      <h2 class="section-title">Klassrum</h2>
      <div class="classroom-grid">
        <div v-for="classroom in filteredClassrooms" :key="classroom.id" 
             class="classroom-card" 
             @click="enterClassroom(classroom)">
          <div class="classroom-card-content">
            <h3 class="classroom-title">{{ classroom.name }}</h3>
            <p class="classroom-detail">Klass: {{ classroom.class }}</p>
            <p class="classroom-detail">Ämne: {{ classroom.subject }}</p>
          </div>
          <div v-if="currentUser.access === 'Admin' || currentUser.access === 'Lärare'" class="admin-buttons">
            <button @click.stop="openEditModal(classroom)" class="edit-button">Ändra</button>
            <button @click.stop="deleteClassroom(classroom._id)" class="delete-button">Ta bort</button>
          </div>
        </div>
      </div>
    </div>
    
    <div id="create-classroom" v-if="currentUser.access === 'Admin' || currentUser.access === 'Lärare'">
      <h2 class="section-title">Skapa Klassrum</h2>
      <form @submit.prevent="createClassroom" class="create-form">
        <div class="form-group">
          <input v-model="currentClassroom.name" placeholder="Klassrum namn" required>
        </div>
        <div class="form-group">
          <select v-model="currentClassroom.groupId" required>
            <option value="" disabled>Välj grupp</option>
            <option v-for="group in availableGroups" :key="group._id" :value="group._id">
              {{ group }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <select v-model="currentClassroom.subject" required>
            <option value="" disabled>Välj ämne</option>
            <option value="Math">Matte</option>
            <option value="Science">Vetenskap</option>
            <option value="History">Historia</option>
            <option value="Literature">Litteratur</option>
          </select>
        </div>
        <button type="submit" class="create-button">Skapa Klassrum</button>
      </form>
    </div>
  </div>

  <div v-if="showModal" class="modal">
    <div class="modal-overlay" @click="closeModal"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ isEditing ? 'Ändra Klassrum' : 'Skapa Klassrum' }}</h2>
        <button @click="closeModal" class="close-button">&times;</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <input v-model="currentClassroom.name" placeholder="Klass Namn">
        </div>
        <div class="form-group">
          <select v-model="currentClassroom.groupId">
            <option value="" disabled>Välj grupp</option>
            <option v-for="group in availableGroups" :key="group._id" :value="group._id">
              {{ group.name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <select v-model="currentClassroom.subject">
            <option value="" disabled>Välj Klassrum</option>
            <option value="Math">Matte</option>
            <option value="Science">Vetenskap</option>
            <option value="History">Historia</option>
            <option value="Literature">Litteratur</option>
          </select>
        </div>
        <div class="modal-buttons">
          <button @click="saveClassroom" class="save-button">Spara</button>
          <button @click="closeModal" class="cancel-button">Avbryt</button>
        </div>
      </div>
    </div>
  </div>
  
  <Footer />
</template>

<style scoped>
/* Container styling */
.classrooms-container-wrapper {
  display: flex;
  width: 100vw;
  min-height: 80vh;
  padding: 2rem;
  padding-top: 100px;
  box-sizing: border-box;
  background-color: #f0f2f5;
}

/* Section titles */
.section-title {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.6rem;
  font-weight: 600;
}

/* Classrooms section styling */
#classrooms {
  flex: 2;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-right: 2rem;
  max-height: 75vh;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

#classrooms.full-width {
  flex: 1;
  width: 100%;
  margin-right: 0;
}

/* Create classroom section styling */
#create-classroom {
  flex: 1;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  height: fit-content;
  max-width: 400px;
}

/* Classroom grid layout */
.classroom-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

/* Classroom card styling */
.classroom-card {
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #e6e6e6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  overflow: hidden;
  position: relative;
  animation: fadeIn 0.5s ease-out;
}

.classroom-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.classroom-card-content {
  padding: 1.5rem;
}

.classroom-title {
  margin-top: 0;
  margin-bottom: 0.75rem;
  color: #333;
  font-size: 1.3rem;
}

.classroom-detail {
  margin: 0.5rem 0;
  color: #666;
  font-size: 0.95rem;
}

/* Admin buttons styling */
.admin-buttons {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  background-color: #f9f9f9;
  border-top: 1px solid #eee;
}

.create-button,
.edit-button,
.delete-button,
.save-button,
.cancel-button {
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
}

.create-button {
  background-color: #007bff;
  color: white;
  width: 100%;
  padding: 0.8rem;
  font-size: 1rem;
  margin-top: 1rem;
}

.create-button:hover {
  background-color: #0056b3;
}

.edit-button {
  background-color: #2196F3;
  color: white;
  flex: 1;
  margin-right: 0.5rem;
}

.edit-button:hover {
  background-color: #0b7dda;
}

.delete-button {
  background-color: #f44336;
  color: white;
  flex: 1;
  margin-left: 0.5rem;
}

.delete-button:hover {
  background-color: #d32f2f;
}

/* Form styling */
.create-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1.2rem;
}

input, select {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

input:focus, select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  outline: none;
}

/* Modal styling */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: relative;
  background-color: #fff;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  z-index: 1001;
  animation: modalFadeIn 0.3s;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.modal-body {
  padding: 1.5rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #999;
  cursor: pointer;
  transition: color 0.3s;
}

.close-button:hover {
  color: #333;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
  gap: 0.75rem;
}

.save-button {
  background-color: #4CAF50;
  color: white;
}

.save-button:hover {
  background-color: #45a049;
}

.cancel-button {
  background-color: #f44336;
  color: white;
}

.cancel-button:hover {
  background-color: #d32f2f;
}

/* Animation keyframes */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes modalFadeIn {
  from { opacity: 0; transform: translateY(-30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Scrollbar styling */
#classrooms::-webkit-scrollbar {
  width: 6px;
}

#classrooms::-webkit-scrollbar-track {
  background: transparent;
}

#classrooms::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

/* Fixed navbar and footer positioning */
:deep(.navbar) {
  z-index: 100;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}

:deep(footer) {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 10;
}
</style>
