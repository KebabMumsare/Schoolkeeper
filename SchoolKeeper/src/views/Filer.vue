<script>
import axios from 'axios';
import NavBar from '@/components/Nav-Bar.vue';

export default {
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

      // Create a new FormData object
      let formData = new FormData();

      // Append each file to the formData object
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
  <NavBar />
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
        <input type="file" multiple @change="onFileChange" />
        <button type="submit">Upload</button>
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
  background-color: bisque;
  width: 20%;
}
</style>