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
  },
};
</script>
<template>
  <NavBar site="files"/>
  <main>
    <div id="uppgift">
      <h2>Uppgift #1</h2>
      <br>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum.</p>
    </div>
    <hr>
    <div id="inlamning">
      <form @submit.prevent="uploadFiles">
        <div class="button-container">¨
          <button type="submit" class="button">Upload</button>
          <label for="file-upload" class="custom-file-upload">Välj filer</label>
          <input id="file-upload" type="file" multiple @change="onFileChange" />
        </div>
      </form>
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
#uppgift {
  width: 80%;
  background-color: aqua;
}
#inlamning {
  display: flex;
  align-items: flex-end;
  background-color: bisque;
  width: 20%;
  justify-content: center;
}

.button-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
}

#file-upload {
  display: none;
}

.custom-file-upload {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.custom-file-upload:hover {
  background-color: #45a049;
}

.button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button:hover {
  background-color: #45a049;
}
</style>