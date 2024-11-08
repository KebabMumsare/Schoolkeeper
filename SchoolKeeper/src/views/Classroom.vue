<style scoped>
.classroom-view {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

main {
    flex-grow: 1;
    display: flex;
    padding: 1rem;
    margin-top: 5rem;
    /* Adjust based on your NavBar height */
}

.box-container {
    display: flex;
    width: 95vw;
    height: calc(100vh - 10rem);
    /* Adjust based on your NavBar height and desired margins */
    gap: 1rem;
}

.box {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
}

.left-column {
    display: flex;
    flex-direction: column;
    width: 20%;
    gap: 1rem;
}

.info-box {
    background-color: #e6f2ff;
    flex: 0 0 auto;
}

.chat-box {
    background-color: #f0fff0;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.right-box {
    background-color: #fff0f5;
    flex: 1;
}

h2 {
    margin-top: 0;
    color: #333;
    font-size: 1.5rem;
    margin-bottom: 1rem;
}

p {
    margin: 0.5rem 0;
    color: #666;
    font-size: 1rem;
}

strong {
    color: #333;
}

.chat-messages {
    flex-grow: 1;
    overflow-y: auto;
    margin-bottom: 10px;
    font-size: 0.85rem;
}

.chat-messages p {
    margin: 0.3rem 0;
    color: #666;
    font-size: 0.85rem;
}

.chat-input {
    display: flex;
    margin-top: 10px;
    gap: 6px;
}

.chat-input input {
    flex-grow: 1;
    padding: 4px 6px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 0.85rem;
    height: 28px;
    width: 80%;
}

.chat-input button {
    padding: 4px 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
    height: 28px;
}

.chat-input button:hover {
    background-color: #45a049;
}

.assignments-list {
    margin-bottom: 1rem;
}

.assignment-item {
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 0.5rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.assignment-item:hover {
    background-color: #f0f0f0;
}

.create-button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 0.5rem;
    border-radius: 4px;
    cursor: pointer;
}

.create-button:hover {
    background-color: #45a049;
}

.right-column {
    flex: 1;
    display: flex;
    gap: 1rem;
}

.assignments-box {
    flex: 3;
    background-color: #fff0f5;
}
.assignments-box::-webkit-scrollbar {
  display: none;
}

.create-assignment {
    flex: 2;
    background-color: #f0f0f0;
    align-self: flex-start;
}

.create-assignment {
    background-color: #f0f0f0;
    border-radius: 4px;
    padding: 1rem;
}

.create-assignment h3 {
    margin-top: 0;
}

.create-assignment form {
    display: flex;
    flex-direction: column;
}

.create-assignment input,
.create-assignment textarea {
    margin-bottom: 0.5rem;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.create-assignment textarea {
    height: 100px;
    resize: vertical;
}
.modal {
    position: fixed !important;
    z-index: 1000 !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    height: 100% !important;
    background-color: rgba(0, 0, 0, 0.4) !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
}

.modal-content {
    position: fixed !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    background-color: #fefefe !important;
    padding: 20px !important;
    border: 1px solid #888 !important;
    width: 80% !important;
    max-width: 500px !important;
    max-height: 80vh !important;
    border-radius: 5px !important;
    overflow-y: auto !important;
}

.modal-buttons {
    margin-top: auto;
}

.cancel-button {
    background-color: #f44336;
    color: white;
    border: none;
    padding: 0.5rem;
    border-radius: 4px;
    cursor: pointer;
}

.cancel-button:hover {
    background-color: #d32f2f;
}

/* Adjust the create-button style to be used in both places */
.create-button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 0.5rem;
    border-radius: 4px;
    cursor: pointer;
}

.create-button:hover {
    background-color: #45a049;
}

/* Styles for the create assignment form within the modal */
.create-assignment {
    background-color: #f0f0f0;
    border-radius: 4px;
    padding: 1rem;
}

.create-assignment h3 {
    margin-top: 0;
    margin-bottom: 1rem;
}

.create-assignment form {
    display: flex;
    flex-direction: column;
}

.create-assignment input,
.create-assignment textarea {
    margin-bottom: 0.5rem;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.create-assignment textarea {
    height: 100px;
    resize: vertical;
}

.v-expansion-panel-title--active {
    background-color: #e8f5e9 !important;  /* Light green background when active */
    font-weight: bold;
    font-size: 1.2rem;
}

.v-expansion-panel-title {
    transition: background-color 0.2s ease;
    padding: 8px 16px !important;
}

.v-expansion-panel-title:hover {
    background-color: #f5f5f5;
}

.v-expansion-panel-text {
    padding: 8px 16px 16px !important;
    font-size: 0.9rem !important;
}

/* Optional: If you want to adjust the icon position */
.v-expansion-panel-title__icon {
    margin-right: 8px !important;
}

/* Make the expansion panels more compact */
.v-expansion-panels {
    width: 100% !important;
}

.v-expansion-panel {
    box-shadow: none !important;
    border: 1px solid #ddd !important;
    margin-bottom: 0.5rem !important;
    overflow: hidden !important;
    transition: none !important;
}

.v-expansion-panel-text__wrapper {
    padding: 0 !important;
    transition: none !important;
}

.v-expansion-panel-text {
    padding: 8px 16px 16px !important;
    font-size: 0.9rem !important;
}

.assignment-title-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.due-date {
    font-size: 0.9rem;
    color: #666;
    margin-right: 24px; /* Add space for the expansion icon */
}

.message-container {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 0.5rem 0 !important;
    margin: 0 !important;
}

.message-container p {
    flex: 1;
}

.side-box {
    width: 25%;
    max-height: 100%;
    background-color: #f5f5f5;
    padding: 0.75rem;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-size: 0.85rem;
}

.side-box h3 {
    font-size: 1rem;
    margin-bottom: 0.5rem;
}

.file-upload {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.file-input {
    position: relative;
    padding: 2rem;
    border: 2px dashed #ccc;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
    text-align: center;
    background-color: #fff;
}

.file-input::before {
    content: 'Drop files here or click to upload';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #666;
    pointer-events: none;
}

.file-input:hover {
    border-color: #4CAF50;
    background-color: #f8f9fa;
}

/* Hide the default file input appearance */
.file-input input[type="file"] {
    opacity: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
}

.selected-files {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    padding: 0.4rem;
    border-radius: 4px;
    border: 1px solid #ddd;
    font-size: 0.85rem;
}

.remove-file {
    background: none;
    border: none;
    color: #f44336;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 0 0.5rem;
}

.remove-file:hover {
    color: #d32f2f;
}

.submit-button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 0.5rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    font-size: 0.85rem;
}

.submit-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

.submit-button:not(:disabled):hover {
    background-color: #45a049;
}

.v-expansion-panel--inactive .v-expansion-panel-text__wrapper {
    max-height: 0 !important;
    min-height: 0 !important;
    padding: 0 !important;
}
</style>
<template>
    <div class="classroom-view">
        <NavBar site="files" :currentUser="currentUser" />
        <main>
            <div class="box-container">
                <div class="left-column">
                    <div class="box info-box">
                        <h2>{{ classroom.name }}</h2>
                        <p><strong>Uppgift:</strong> {{ classroom.subject }}</p>
                        <p><strong>Klass:</strong> {{ classroom.class }}</p>
                    </div>
                    <div class="box chat-box">
                        <h2>Chat</h2>
                        <div class="chat-messages">
                            <p v-for="(message, index) in messages" :key="index">
                                <strong>{{ message.user_id }}:</strong>
                                <br> {{ message.message }}
                            </p>
                        </div>
                        <div class="chat-input">
                            <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Skriv ett meddelande..." />
                            <button @click="sendMessage">Skicka</button>
                        </div>
                    </div>
                </div>
                <div class="right-column">
                    <div class="box assignments-box">
                        <h2>Uppgifter</h2>
                        <div class="assignments-list">
                            <!-- class="assignment-item" -->
                            <v-expansion-panels v-for="assignment in assignments" :key="assignment._id" >
                                <v-expansion-panel>
                                    <v-expansion-panel-title :class="{ 'v-expansion-panel-title--active': $attrs.modelValue }">
                                        <div class="assignment-title-container">
                                            <span>{{ assignment.title }}</span>
                                            <span class="due-date">Due: {{ new Date(assignment.due_date).toLocaleDateString() }}</span>
                                        </div>
                                    </v-expansion-panel-title>
                                    <v-expansion-panel-text>
                                        <div class="message-container">
                                            <p>{{ assignment.message }}</p>
                                            <div class="side-box">
                                                <h3>Lämmna in Uppgift</h3>
                                                <div class="file-upload">
                                                    <div class="file-input">
                                                        <input 
                                                            type="file" 
                                                            ref="fileInput" 
                                                            @change="handleFileChange" 
                                                            multiple
                                                        >
                                                    </div>
                                                    <div class="selected-files" v-if="selectedFiles.length">
                                                        <div v-for="(file, index) in selectedFiles" :key="index" class="file-item">
                                                            <span>{{ file.name }}</span>
                                                            <button @click="removeFile(index)" class="remove-file">×</button>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        @click="() => submitFiles(assignment._id)" 
                                                        class="submit-button"
                                                        :disabled="!selectedFiles.length"
                                                    >
                                                        Lämmna in
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </v-expansion-panel-text>
                                </v-expansion-panel>
                            </v-expansion-panels>
                        </div>
                        <button v-if="currentUser.access === 'Admin' || currentUser.access === 'Lärare'"
                            @click="openModal" class="create-button">
                            Skappa ny Uppgift
                        </button>
                    </div>
                </div>
            </div>
        </main>


        <!-- Modal for creating assignments -->
        <div v-if="showModal" class="modal">
            <div class="modal-content create-assignment">
                <h3>Skappa ny Uppgift</h3>
                <form @submit.prevent="createAssignment">
                    <input v-model="newAssignment.title" placeholder="Assignment Title" required>
                    <textarea v-model="newAssignment.message" placeholder="Assignment Description" required></textarea>
                    <input v-model="newAssignment.due_date" type="date" required>
                    <div class="modal-buttons">
                        <button type="submit" class="create-button">Skappa ny Uppgift</button>
                        <button @click="showModal = false" class="cancel-button">Avbryt</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <Footer />
</template>
<script>
import NavBar from '@/components/Nav-Bar.vue';
import { useStorage } from "@vueuse/core";
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
    name: 'Classroom',
    components: {
        NavBar
    },
    data() {
        return {
            currentUser: useStorage('currentUser', { id: '', name: '', access: '', class: '' }),
            classroom: { name: 'Loading...', subject: '', class: '' },
            messages: [],
            newMessage: '',
            assignments: [],
            newAssignment: {
                title: '',
                message: '',
                due_date: ''
            },
            showModal: false,
            selectedFiles: [],
        }
    },
    setup() {
        const router = useRouter();
        return { router };
    },
    methods: {
        async fetchClassroom() {
            try {
                const response = await axios.get(`http://localhost:1010/api/classrooms/${this.$route.params.id}`);
                this.classroom = response.data;
                this.fetchChat(); // Fetch chat messages after classroom data is loaded
            } catch (error) {
                console.error('Error fetching classroom:', error);
            }
        },
        async fetchChat() {
            try {
                const response = await axios.get(`http://localhost:1010/api/chats/${this.classroom._id}`);
                this.messages = response.data;
            } catch (error) {
                console.error('Error fetching chat:', error);
            }
        },
        async sendMessage() {
            if (this.newMessage.trim()) {
                try {
                    const payload = {
                        message: this.newMessage,
                        classroom_id: this.$route.params.id,
                        user_id: this.currentUser.name,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    };
                    console.log('Sending message payload:', payload);
                    const response = await axios.post('http://localhost:1010/api/chats', payload);
                    console.log('Server response:', response.data);
                    this.messages.push(response.data);
                    this.newMessage = '';
                } catch (error) {
                    console.error('Error sending message:', error.response ? error.response.data : error.message);
                }
            }
        },
        async fetchAssignments() {
            try {
                const response = await axios.get(`http://localhost:1010/api/assignments/${this.$route.params.id}`);
                this.assignments = response.data;
            } catch (error) {
                console.error('Error fetching assignments:', error);
            }
        },
        async createAssignment() {
            if (this.newAssignment.title && this.newAssignment.message && this.newAssignment.due_date) {
                try {
                    const payload = {
                        ...this.newAssignment,
                        classroom_id: this.$route.params.id,
                        created_at: new Date().toISOString(),
                    };
                    const response = await axios.post('http://localhost:1010/api/assignments', payload);
                    this.assignments.push(response.data);
                    this.newAssignment = { title: '', message: '', due_date: '' };
                    this.showModal = false;

                    // Navigate to the newly created assignment under the classroom
                    this.router.push({ name: 'assignment', params: { id: this.$route.params.id, assignmentId: response.data._id } });
                } catch (error) {
                    console.error('Error creating assignment:', error);
                }
            }
        },
        openModal() {
            this.showModal = true;
            console.log('Modal should be open:', this.showModal);
        },
        navigateToAssignment(assignmentId) {
            console.log(`Navigating to assignment: ${assignmentId}`);
            this.router.push(`/classroom/${this.$route.params.id}/assignment/${assignmentId}`);
        },
        handleFileChange(event) {
            const newFiles = Array.from(event.target.files);
            this.selectedFiles = [...this.selectedFiles, ...newFiles];
        },
        removeFile(index) {
            this.selectedFiles.splice(index, 1);
        },
        async submitFiles(assignmentId) {
            if (!this.selectedFiles.length) return;

            const formData = new FormData();
            this.selectedFiles.forEach(file => {
                formData.append('files', file);
            });

            try {
                console.log(this.currentUser)
                const response = await axios.post(
                    `http://localhost:1010/files/submit/${assignmentId}/${this.currentUser.id}`, 
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                
                // Clear files after successful upload
                this.selectedFiles = [];
                this.$refs.fileInput.value = '';
                
                // Show success message
                alert('Files submitted successfully!');
            } catch (error) {
                console.error('Error submitting files:', error);
                alert('Error submitting files. Please try again.');
            }
        },
    },
    mounted() {
        this.fetchClassroom();
        this.fetchAssignments();
    },
}
</script>
