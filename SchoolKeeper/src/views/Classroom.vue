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
    padding: 1rem;
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
    position: relative;
}

.assignments-box {
    flex: 2;
    background-color: #fff0f5;
    transition: flex 0.3s ease-out;
}

.assignments-box.with-submissions {
    flex: 1.5;
}

.details-box {
    flex: 1;
    background-color: #f5f5f5;
    min-width: 300px;
    max-width: 400px;
    animation: slideIn 0.3s ease-out;
    transform-origin: right;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.assignment-details {
    padding: 1rem 0;
}

.assignment-details .description {
    margin: 1rem 0;
    line-height: 1.5;
}

.submissions-list {
    margin-top: 1rem;
}

.submission-item {
    background-color: white;
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 0.5rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.student-name {
    font-weight: 500;
    display: block;
    margin-bottom: 0.25rem;
}

.submission-date {
    font-size: 0.85rem;
    color: #666;
    display: block;
    margin-bottom: 0.5rem;
}

.file-list {
    margin-top: 0.5rem;
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

/* Add these custom scrollbar styles for the chat messages */
.chat-messages::-webkit-scrollbar {
    width: 8px;
}

.chat-messages::-webkit-scrollbar-track {
    background: #ffffff00;
    border-radius: 4px;
}

.chat-messages::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
    background: #666;
}

/* For Firefox */
.chat-messages {
    scrollbar-width: thin;
    scrollbar-color: #888 #ffffff00;
}

.submitted-files {
    margin-top: 1rem;
}

.submitted-files h4 {
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    color: #666;
}

.file-actions {
    display: flex;
    gap: 0.5rem;
}

.download-file {
    background: none;
    border: none;
    color: #4CAF50;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 0 0.5rem;
}

.download-file:hover {
    color: #45a049;
}

/* Add these styles */
.file-display {
    margin: 1rem 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.selected-files, .submitted-files {
    background-color: #fff;
    border-radius: 4px;
    padding: 0.5rem;
}

.selected-files h4, .submitted-files h4 {
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    color: #666;
    border-bottom: 1px solid #eee;
    padding-bottom: 0.3rem;
}

.file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.3rem 0.5rem;
    background-color: #f8f9fa;
    border-radius: 4px;
    margin-bottom: 0.3rem;
}

.file-item:last-child {
    margin-bottom: 0;
}

.file-item span {
    font-size: 0.85rem;
    color: #333;
}

.file-info {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}

.file-name {
    font-weight: 500;
}

.submission-date {
    font-size: 0.8rem;
    color: #666;
}

.file-actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.download-file {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.2rem 0.5rem;
    font-size: 1.1rem;
    color: #4CAF50;
}

.download-file:hover {
    color: #45a049;
}

.remove-file {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.2rem 0.5rem;
    font-size: 1.1rem;
    color: #f44336;
}

.remove-file:hover {
    color: #d32f2f;
}

/* Add these new styles */
.details-box {
    flex: 1;
    background-color: #f5f5f5;
    min-width: 300px;
    max-width: 400px;
    animation: slideIn 0.3s ease-out;
    transform-origin: right;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

/* Optional: Add transition for when the box disappears */
.right-column {
    flex: 1;
    display: flex;
    gap: 1rem;
    position: relative;
}

/* Alternative using Vue transition */
.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(30px);
    opacity: 0;
}

.file-actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.download-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 0.4rem 0.8rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
    transition: background-color 0.2s ease;
}

.download-button:hover {
    background-color: #45a049;
}

.download-button i {
    font-size: 1rem;
}

.details-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.details-header h2 {
    margin: 0;  /* Remove default margin to ensure proper alignment */
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
                    <div class="box assignments-box" :class="{ 'with-submissions': selectedAssignment }">
                        <h2>Uppgifter</h2>
                        <div class="assignments-list">
                            <v-expansion-panels v-for="assignment in assignments" :key="assignment._id">
                                <v-expansion-panel @click="toggleAssignment(assignment)">
                                    <v-expansion-panel-title :class="{ 'v-expansion-panel-title--active': $attrs.modelValue }">
                                        <div class="assignment-title-container">
                                            <span>{{ assignment.title }}</span>
                                            <span class="due-date">Due: {{ new Date(assignment.due_date).toLocaleDateString() }}</span>
                                        </div>
                                    </v-expansion-panel-title>
                                    <v-expansion-panel-text>
                                        <div class="message-container">
                                            <p>{{ assignment.message }}</p>
                                            <div v-if="currentUser.access === 'Elev'" class="side-box">
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
                                                    <div class="file-display">
                                                        <div class="selected-files" v-if="selectedFiles.length">
                                                            <h4>Selected Files:</h4>
                                                            <div v-for="(file, index) in selectedFiles" :key="'selected-' + index" class="file-item">
                                                                <span>{{ file.name }}</span>
                                                                <button @click="removeFile(index)" class="remove-file">×</button>
                                                            </div>
                                                        </div>

                                                        <div class="submitted-files">
                                                            <h4>Inlämnade Filer:</h4>
                                                            <div v-if="Object.keys(submittedFiles).length > 0">
                                                                <div v-for="submission in submittedFiles[assignment._id] || []" :key="submission._id" class="file-item">
                                                                    <div class="file-info">
                                                                        <span class="file-name">{{ submission.file_names[0] }}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div v-else>
                                                                Inga inlämnade filer i denna uppgift
                                                            </div>
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
                            Skapa ny Uppgift
                        </button>
                    </div>
                    
                    <Transition name="slide-fade">
                        <div v-if="selectedAssignment && (currentUser.access === 'Lärare' || currentUser.access === 'Admin')" class="box details-box">
                            <div class="details-header">
                                <h2>Inlämningar</h2>
                                <div class="file-actions">
                                    <button class="download-button" @click="downloadAssignment">
                                        Ladda ner alla
                                    </button>
                                </div>
                            </div>
                            <div class="submissions-list">
                                <div v-if="allSubmissions.length > 0">
                                    <div v-for="submission in allSubmissions.filter(submission => submission.assignment_id === selectedAssignment._id)" 
                                         :key="submission._id" 
                                         class="submission-item">
                                        <span class="student-name">{{ getStudentName(submission.student_id) }}</span>
                                        <span class="submission-date">{{ new Date(submission.created_at).toLocaleDateString() }}</span>
                                        <div class="file-list">
                                            <div v-for="file in submission.file_names" :key="file" class="file-item">
                                                <span>{{ file }}</span>
                                                <div class="file-actions">
                                                    <button class="download-button">
                                                        Ladda ner
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p v-else>Inga inlämningar än</p>
                            </div>
                        </div>
                    </Transition>
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
            submittedFiles: {},
            allSubmissions: {},
            selectedAssignment: null,
            
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
        async fetchSubmissions() {
            try {
                const response = await axios.get(`http://localhost:1010/api/submissions/${this.$route.params.id}/${this.currentUser.id}`);
                console.log('Raw submissions response:', response.data);
                
                // Transform the data if needed
                const submissions = response.data;
                if (Array.isArray(submissions)) {
                    // Group submissions by assignment ID
                    this.submittedFiles = submissions.reduce((acc, submission) => {
                        if (!acc[submission.assignment_id]) {
                            acc[submission.assignment_id] = [];
                        }
                        acc[submission.assignment_id].push(submission);
                        return acc;
                    }, {});
                } else {
                    this.submittedFiles = submissions; // If data is already in the correct format
                }
                
                console.log('Submitted files after assignment:', this.submittedFiles);
            } catch (error) {
                console.error('Error fetching submissions:', error);
            }
        },
        async fetchAllSubmissions() {
            try {
                const response = await axios.get(`http://localhost:1010/api/submissions/${this.$route.params.id}`);
                this.allSubmissions = response.data;
                console.log('All submissions:', this.allSubmissions);
            } catch (error) {
                console.error('Error fetching all submissions:', error);
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
        async deleteSubmission(assignmentId, fileId) {
            if (!confirm('Are you sure you want to delete this submission?')) return;
            
            try {
                await axios.delete(`http://localhost:1010/files/submission/${fileId}`);
                await this.fetchSubmissions();
            } catch (error) {
                console.error('Error deleting submission:', error);
                alert('Error deleting submission');
            }
        },
        async submitFiles(assignmentId) {
            if (!this.selectedFiles.length) return;

            const formData = new FormData();
            this.selectedFiles.forEach(file => {
                formData.append('files', file);
            });

            try {
                await axios.post(
                    `http://localhost:1010/files/submit/${this.$route.params.id}/${assignmentId}/${this.currentUser.id}`, 
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                
                // Clear selected files
                this.selectedFiles = [];
                this.$refs.fileInput.value = '';
                
                // Fetch updated submitted files
                await this.fetchSubmissions();
            } catch (error) {
                console.error('Error submitting files:', error);
                alert('Error submitting files. Please try again.');
            }
        },
        async downloadFile(filePath, fileName) {
            try {
                const response = await axios.get(
                    `http://localhost:1010/api/download/${filePath}`,
                    { responseType: 'blob' }
                );
                
                // Create blob link to download
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Error downloading file:', error);
                alert('Error downloading file. Please try again.');
            }
        },
        async deleteSubmission(assignmentId, submissionId) {
            if (!confirm('Are you sure you want to delete this submission?')) return;
            
            try {
                await axios.delete(`http://localhost:1010/api/submissions/${submissionId}`);
                // Update the local state after successful deletion
                if (this.submittedFiles[assignmentId]) {
                    this.submittedFiles[assignmentId] = this.submittedFiles[assignmentId]
                        .filter(submission => submission._id !== submissionId);
                }
            } catch (error) {
                console.error('Error deleting submission:', error);
                alert('Error deleting submission. Please try again.');
            }
        },
        async downloadAssignment() {
            try {
                const response = await axios.get(`http://localhost:1010/api/download/${this.selectedAssignment._id}`,
                { responseType: 'blob' }
                );
                
                // Create blob link to download
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${this.selectedAssignment.message}.zip`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Error downloading assignment:', error);
            }
        },
        getSubmissionsForAssignment(assignmentId) {
            console.log('Submitted files:', this.allSubmissions[assignmentId]);
            return this.allSubmissions[assignmentId] || [];
        },
        toggleAssignment(assignment) {
            this.selectedAssignment = this.selectedAssignment?._id === assignment._id ? null : assignment;
        },
        getStudentName(studentId) {
            const submission = this.allSubmissions.find(submission => submission.student_id === studentId);

            return submission.student_id.name;
        },
        openModal() {
            this.showModal = true;
            console.log('Modal should be open:', this.showModal);
        },
        handleFileChange(event) {
            const newFiles = Array.from(event.target.files);
            this.selectedFiles = [...this.selectedFiles, ...newFiles];
        },
        removeFile(index) {
            this.selectedFiles.splice(index, 1);
        },
    },
    async mounted() {
        try {
            await this.fetchClassroom();
            await this.fetchAssignments();
            await this.fetchSubmissions();
            if (this.currentUser.access === 'Admin' || this.currentUser.access === 'Lärare') {
                await this.fetchAllSubmissions();
            }
        } catch (error) {
            console.error('Error initializing classroom data:', error);
        }
    },
}
</script>