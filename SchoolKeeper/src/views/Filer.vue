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
        invitees: ''
      },
      isEditing: false
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
    createClassroom() {
      const newClassroomNumber = this.classrooms.length + 1;
      this.classrooms.push(`Classroom ${newClassroomNumber}`);
    },
    deleteClassroom(index) {
      this.classrooms.splice(index, 1);
      // Renumber remaining classrooms
      this.classrooms = this.classrooms.map((_, i) => `Classroom ${i + 1}`);
    },
    openCreateModal() {
      this.isEditing = false;
      this.currentClassroom = { id: null, name: '', invitees: '' };
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
        const newId = this.classrooms.length + 1;
        this.classrooms.push({
          id: newId,
          name: this.currentClassroom.name || `Classroom ${newId}`,
          invitees: this.currentClassroom.invitees
        });
      }
      this.closeModal();
    },
    deleteClassroom(id) {
      this.classrooms = this.classrooms.filter(c => c.id !== id);
    },
  },
};
</script>

<template>
  <NavBar site="files"/>
  <main>
    <div id="classrooms">
      <h2>Classrooms</h2>
      <button @click="openCreateModal" class="create-button">Create Classroom</button>
      <div class="classroom-grid">
        <div v-for="classroom in classrooms" :key="classroom.id" class="classroom-item">
          <h3>{{ classroom.name }}</h3>
          <p>Invitees: {{ classroom.invitees }}</p>
          <button @click="openEditModal(classroom)" class="edit-button">Edit</button>
          <button @click="deleteClassroom(classroom.id)" class="delete-button">Delete</button>
        </div>
      </div>
    </div>
    <div id="inlamning">
      <form @submit.prevent="uploadFiles">
        <div class="button-container">
          <button type="submit" class="button">Upload</button>
          <label for="file-upload" class="custom-file-upload">Välj filer</label>
          <input id="file-upload" type="file" multiple @change="onFileChange" />
        </div>
      </form>
    </div>

    <!-- Modal for creating/editing classrooms -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>{{ isEditing ? 'Edit' : 'Create' }} Classroom</h2>
        <input v-model="currentClassroom.name" placeholder="Classroom Name">
        <input v-model="currentClassroom.invitees" placeholder="Invitees (comma-separated)">
        <div class="modal-buttons">
          <button @click="saveClassroom" class="save-button">Save</button>
          <button @click="closeModal" class="cancel-button">Cancel</button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  border: solid rgb(212, 212, 212) 1px;
  width: 80vw;
  height: 70vh;
  background-color: #ebebeb;
  border-radius: 1rem;
  box-shadow: 1px 1px 20px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  display: flex;
}

#classrooms {
  width: 80%;
  padding: 1rem;
  background-color: #e6f2ff; /* Light blue background */
  border-radius: 0.5rem;
  overflow-y: auto; /* Add scrolling if content exceeds height */
}

#inlamning {
  display: flex;
  align-items: flex-end;
  width: 20%;
  justify-content: center;
  padding: 1rem;
}

.classroom-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.classroom-item {
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 0.5rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.create-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 1rem;
}

.delete-button {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  margin-top: 0.5rem;
  font-size: 0.8rem;
}

.create-button:hover, .delete-button:hover {
  opacity: 0.8;
}

.edit-button {
  background-color: #2196F3;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  margin-top: 0.5rem;
  font-size: 0.8rem;
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

.modal-content input {
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
</style>
