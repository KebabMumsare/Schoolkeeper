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
        class: '',
        subject: ''
      },
      isEditing: false,
      availableClasses: []
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
        class: this.currentClassroom.class,
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
      this.currentClassroom = { id: null, name: '', class: '', subject: '' };
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
          class: this.currentClassroom.class,
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
        class: '',
        subject: ''
      };
      this.isEditing = false;
    },

    async fetchClasses() {
      try {
        const response = await axios.get('http://localhost:1010/api/classes');
        this.availableClasses = response.data;
        console.log('Fetched classes:', this.availableClasses);
      } catch (error) {
        console.error('Error fetching classes:', error);
        this.availableClasses = []; // Set to empty array in case of error
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
    this.fetchClasses();
    this.loadClasses();
  }
};
</script>

<template>
  <NavBar site="files" :currentUser="currentUser" />
  <main class="content">
    <div id="classrooms" :class="{ 'full-width': currentUser.access === 'Elev' }">
      <h2>Klassrum</h2>
      <div class="classroom-grid">
        <div v-for="classroom in filteredClassrooms" :key="classroom.id" 
             class="classroom-item" 
             @click="enterClassroom(classroom)">
          <h3>{{ classroom.name }}</h3>
          <p>Klass: {{ classroom.class }}</p>
          <p>Ämne: {{ classroom.subject }}</p>
          <div v-if="currentUser.access === 'Admin' || currentUser.access === 'Lärare'" class="admin-buttons">
            <button @click.stop="openEditModal(classroom)" class="edit-button">Ändra</button>
            <button @click.stop="deleteClassroom(classroom._id)" class="delete-button">Ta bort</button>
          </div>
        </div>
      </div>
    </div>
    <div id="create-classroom" v-if="currentUser.access === 'Admin' || currentUser.access === 'Lärare'">
      <h2>Skapa Klassrum</h2>
      <form @submit.prevent="createClassroom">
        <input v-model="currentClassroom.name" placeholder="Klassrum namn" required>
        <select v-model="currentClassroom.class" required>
          <option value="" disabled>Välj klass</option>
          <option v-for="classOption in availableClasses" :key="classOption" :value="classOption">
            {{ classOption }}
          </option>
        </select>
        <select v-model="currentClassroom.subject" required>
          <option value="" disabled>Välj ämne</option>
          <option value="Math">Matte</option>
          <option value="Science">Vetenskap</option>
          <option value="History">Historia</option>
          <option value="Literature">Litteratur</option>
        </select>
        <button type="submit" class="create-button">Skapa Klassrum</button>
      </form>
    </div>
  </main>

  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <h2>Ändra Klassrum</h2>
      <input v-model="currentClassroom.name" placeholder="Klass Namn">
      <select v-model="currentClassroom.class">
        <option value="" disabled>Välj Klass</option>
        <option v-for="classOption in availableClasses" :key="classOption" :value="classOption">
          {{ classOption }}
        </option>
      </select>
      <select v-model="currentClassroom.subject">
        <option value="" disabled>Välj Klassrum</option>
        <option value="Math">Matte</option>
        <option value="Science">Vetenskap</option>
        <option value="History">Historia</option>
        <option value="Literature">Litteratur</option>
      </select>
      <div class="modal-buttons">
        <button @click="saveClassroom" class="save-button">Spara</button>
        <button @click="closeModal" class="cancel-button">Avbryt</button>
      </div>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
main {
  display: flex;
  border: solid rgb(212, 212, 212) 1px;
  width: 80vw;
  height: 70vh;
  background-color: #ebebeb;
  border-radius: 1rem;
  box-shadow: 1px 1px 20px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}



#classrooms {
  width: 70%;
  padding: 1rem;
  background-color: #e6f2ff;
  border-radius: 0.5rem;
  overflow-y: auto;
  margin-right: 1rem;
}

#classrooms.full-width {
  width: 100%;
  margin-right: 0;
}

#create-classroom {
  width: 30%;
  padding: 1rem;
  background-color: #f0f0f0;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
}

.classroom-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.classroom-item {
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 0.5rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.create-button, .edit-button, .delete-button {
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  margin-top: 0.5rem;
  font-size: 0.8rem;
}

.create-button {
  background-color: #4caf50;
}

.edit-button {
  background-color: #2196F3;
}

.delete-button {
  background-color: #f44336;
}

.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fefefe;
  padding: 20px;
  border: 1px solid #888;
  width: 300px;
  border-radius: 5px;
}

input, select {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.save-button, .cancel-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.save-button {
  background-color: #4CAF50;
  color: white;
}

.cancel-button {
  background-color: #f44336;
  color: white;
}

select {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
}

.enter-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  margin-top: 0.5rem;
  font-size: 0.8rem;
}

.enter-button:hover {
  background-color: #45a049;
}

.admin-buttons {
  margin-top: 10px;
}
</style>
