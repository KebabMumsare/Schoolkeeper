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
  min-height: 85vh;
  padding: 1.5rem;
  padding-top: 60px;
  box-sizing: border-box;
  background-color: #f0f2f5;
  background-image: linear-gradient(135deg, #f5f7fa 0%, #e4efe9 100%);
  margin-top: -20px;
}

/* Section titles */
.section-title {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.6rem;
  font-weight: 600;
  position: relative;
  display: inline-block;
  padding-bottom: 0.6rem;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
  border-radius: 2px;
}

/* Classrooms section styling */
#classrooms {
  flex: 2;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.07);
  padding: 2rem;
  margin-right: 1.5rem;
  max-height: 80vh;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
  border-top: 4px solid #4776E6;
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
  border-radius: 10px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.07);
  padding: 2rem;
  height: fit-content;
  max-width: 380px;
  border-top: 4px solid #8E54E9;
  position: sticky;
  top: 80px;
}

/* Classroom grid layout */
.classroom-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}

/* Classroom card styling */
.classroom-card {
  background-color: #fff;
  border-radius: 10px;
  border: none;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.07);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  overflow: hidden;
  position: relative;
  animation: fadeIn 0.5s ease-out;
  min-height: 200px;
  display: flex;
  flex-direction: column;
}

.classroom-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 8px;
  background: linear-gradient(90deg, #FF9966 0%, #FF5E62 100%);
  transition: height 0.3s ease;
}

.classroom-card:nth-child(2n)::before {
  background: linear-gradient(90deg, #36D1DC 0%, #5B86E5 100%);
}

.classroom-card:nth-child(3n)::before {
  background: linear-gradient(90deg, #11998e 0%, #38ef7d 100%);
}

.classroom-card:nth-child(4n)::before {
  background: linear-gradient(90deg, #834d9b 0%, #d04ed6 100%);
}

.classroom-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
}

.classroom-card:hover::before {
  height: 12px;
}

.classroom-card-content {
  padding: 1.7rem;
  padding-top: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.classroom-title {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #333;
  font-size: 1.4rem;
  font-weight: 600;
  position: relative;
  display: inline-block;
}

.classroom-detail {
  margin: 0.7rem 0;
  color: #666;
  font-size: 1rem;
  display: flex;
  align-items: center;
}

.classroom-detail::before {
  content: '•';
  margin-right: 0.5rem;
  color: #5B86E5;
  font-size: 1.2rem;
}

.classroom-detail:nth-child(3)::before {
  color: #FF5E62;
}

/* Admin buttons styling */
.admin-buttons {
  display: flex;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: linear-gradient(90deg, #f8f9fa 0%, #f0f2f5 100%);
  border-top: 1px solid #eee;
  margin-top: auto;
}

.create-button,
.edit-button,
.delete-button,
.save-button,
.cancel-button {
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.create-button {
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
  color: white;
  width: 100%;
  padding: 1.1rem;
  font-size: 1.1rem;
  margin-top: 1.5rem;
  box-shadow: 0 4px 10px rgba(142, 84, 233, 0.2);
}

.create-button:hover {
  background: linear-gradient(90deg, #3d6ae0 0%, #7e49d4 100%);
  box-shadow: 0 6px 15px rgba(142, 84, 233, 0.3);
}

.edit-button {
  background: linear-gradient(90deg, #36D1DC 0%, #5B86E5 100%);
  color: white;
  flex: 1;
  margin-right: 0.5rem;
  box-shadow: 0 2px 8px rgba(91, 134, 229, 0.2);
}

.edit-button:hover {
  background: linear-gradient(90deg, #28c7d2 0%, #4a75d9 100%);
  box-shadow: 0 4px 12px rgba(91, 134, 229, 0.25);
}

.delete-button {
  background: linear-gradient(90deg, #FF5E62 0%, #FF9966 100%);
  color: white;
  flex: 1;
  margin-left: 0.5rem;
  box-shadow: 0 2px 8px rgba(255, 94, 98, 0.2);
}

.delete-button:hover {
  background: linear-gradient(90deg, #ff4448 0%, #ff8a53 100%);
  box-shadow: 0 4px 12px rgba(255, 94, 98, 0.25);
}

/* Form styling */
.create-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1.8rem;
  position: relative;
}

input, select {
  width: 100%;
  padding: 1.1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1.05rem;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
}

input:focus, select:focus {
  border-color: #8E54E9;
  box-shadow: 0 0 0 3px rgba(142, 84, 233, 0.15);
  outline: none;
  background-color: #fff;
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
  backdrop-filter: blur(3px);
}

.modal-content {
  position: relative;
  background-color: #fff;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  animation: modalFadeIn 0.4s;
  overflow: hidden;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, #f5f7fa 0%, #e4efe9 100%);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
  position: relative;
  padding-bottom: 0.5rem;
}

.modal-header h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
  border-radius: 2px;
}

.modal-body {
  padding: 1.8rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.6rem;
  color: #999;
  cursor: pointer;
  transition: color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.close-button:hover {
  color: #333;
  background-color: rgba(0, 0, 0, 0.05);
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.8rem;
  gap: 0.9rem;
}

.save-button {
  background: linear-gradient(90deg, #11998e 0%, #38ef7d 100%);
  color: white;
  box-shadow: 0 3px 10px rgba(17, 153, 142, 0.2);
}

.save-button:hover {
  background: linear-gradient(90deg, #0d8a80 0%, #2ce572 100%);
  box-shadow: 0 5px 15px rgba(17, 153, 142, 0.3);
}

.cancel-button {
  background: linear-gradient(90deg, #FF5E62 0%, #FF9966 100%);
  color: white;
  box-shadow: 0 3px 10px rgba(255, 94, 98, 0.2);
}

.cancel-button:hover {
  background: linear-gradient(90deg, #ff4448 0%, #ff8a53 100%);
  box-shadow: 0 5px 15px rgba(255, 94, 98, 0.3);
}

/* Animation keyframes */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes modalFadeIn {
  from { opacity: 0; transform: translateY(-40px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Scrollbar styling */
#classrooms::-webkit-scrollbar {
  width: 8px;
}

#classrooms::-webkit-scrollbar-track {
  background: transparent;
}

#classrooms::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #4776E6, #8E54E9);
  border-radius: 10px;
}

#classrooms::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #3d6ae0, #7e49d4);
}

/* Fixed navbar and footer positioning */
:deep(.navbar) {
  z-index: 100;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
}

:deep(footer) {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 10;
}

/* Empty state styling */
.classroom-grid:empty::after {
  content: 'No classrooms available';
  display: block;
  width: 100%;
  text-align: center;
  padding: 3rem 1rem;
  color: #999;
  font-size: 1.1rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4efe9 100%);
  border-radius: 12px;
  margin-bottom: 1rem;
  border: 2px dashed #ddd;
}
</style>
