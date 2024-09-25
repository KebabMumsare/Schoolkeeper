<script>
import axios from 'axios';

export default {
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
    <div>
        <form @submit.prevent="uploadFiles">
            <input type="file" multiple @change="onFileChange" />
            <button type="submit">Upload</button>
        </form>
    </div>
</template>
<style scoped>

</style>