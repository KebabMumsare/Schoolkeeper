<script>
import axios from 'axios';
import NavBar from '@/components/Nav-Bar.vue';

export default {
  name: 'filer',
  components: {
    NavBar,
  },
  data() {
    return {
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
  },
  mounted() {
    this.fetchClasses();
    this.loadClasses();
  }
};
</script>

<template>
  <NavBar site="files" />
  <main>
    <div id="classrooms">
      <h2>Classrooms</h2>
      <div class="classroom-grid">
        <div v-for="classroom in classrooms" :key="classroom.id" class="classroom-item">
          <h3>{{ classroom.name }}</h3>
          <p>Class: {{ classroom.class }}</p>
          <p>Subject: {{ classroom.subject }}</p>
          <p>ID: {{ classroom._id }}</p>
          <button @click="openEditModal(classroom)" class="edit-button">Edit</button>
          <button @click="deleteClassroom(classroom._id)" class="delete-button">Delete</button>
        </div>
      </div>
    </div>
    <div id="create-classroom">
      <h2>Create Classroom</h2>
      <form @submit.prevent="createClassroom">
        <input v-model="currentClassroom.name" placeholder="Classroom Name" required>
        <select v-model="currentClassroom.class" required>
          <option value="" disabled>Select Class</option>
          <option v-for="classOption in availableClasses" :key="classOption" :value="classOption">
            {{ classOption }}
          </option>
        </select>
        <select v-model="currentClassroom.subject" required>
          <option value="" disabled>Select Subject</option>
          <option value="Math">Math</option>
          <option value="Science">Science</option>
          <option value="History">History</option>
          <option value="Literature">Literature</option>
        </select>
        <button type="submit" class="create-button">Create Classroom</button>
      </form>
    </div>
  </main>

  <!-- Modal for editing classrooms -->
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <h2>Edit Classroom</h2>
      <input v-model="currentClassroom.name" placeholder="Classroom Name">
      <select v-model="currentClassroom.class">
        <option value="" disabled>Select Class</option>
        <option v-for="classOption in availableClasses" :key="classOption" :value="classOption">
          {{ classOption }}
        </option>
      </select>
      <select v-model="currentClassroom.subject">
        <option value="" disabled>Select Subject</option>
        <option value="Math">Math</option>
        <option value="Science">Science</option>
        <option value="History">History</option>
        <option value="Literature">Literature</option>
      </select>
      <div class="modal-buttons">
        <button @click="saveClassroom" class="save-button">Save</button>
        <button @click="closeModal" class="cancel-button">Cancel</button>
      </div>
    </div>
  </div>
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
</style>
