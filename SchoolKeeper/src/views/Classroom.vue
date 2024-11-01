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
    margin-top: 5rem; /* Adjust based on your NavBar height */
}

.box-container {
    display: flex;
    width: 95vw;
    height: calc(100vh - 7rem); /* Adjust based on your NavBar height and desired margins */
    gap: 1rem;
}

.box {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    overflow-y: auto;
}

.left-column {
    display: flex;
    flex-direction: column;
    width: 25%;
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
}

.chat-input {
    display: flex;
    margin-top: 10px;
}

.chat-input input {
    flex-grow: 1;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-right: 8px;
}

.chat-input button {
    padding: 8px 16px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
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
    padding: 0.5rem;
    margin-bottom: 0.5rem;
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

.create-assignment {
    flex: 2;
    background-color: #f0f0f0;
    align-self: flex-start;
}

.modal {
    position: fixed !important;
    z-index: 1000 !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    height: 100% !important;
    background-color: rgba(0,0,0,0.4) !important;
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
</style>
<template>
    <div class="classroom-view">
        <NavBar site="files" :currentUser="currentUser" />
        <main>
            <div class="box-container">
                <div class="left-column">
                    <div class="box info-box">
                        <h2>{{ classroom.name }}</h2>
                        <p><strong>Subject:</strong> {{ classroom.subject }}</p>
                        <p><strong>Class:</strong> {{ classroom.class }}</p>
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
                            <input 
                                v-model="newMessage" 
                                @keyup.enter="sendMessage" 
                                placeholder="Type a message..."
                            />
                            <button @click="sendMessage">Send</button>
                        </div>
                    </div>
                </div>
                <div class="right-column">
                    <div class="box assignments-box">
                        <h2>Assignments</h2>
                        <div class="assignments-list">
                            <div v-for="assignment in assignments" :key="assignment._id" class="assignment-item">
                                <router-link :to="{ name: 'assignment', params: { id: classroom._id, assignmentId: assignment._id } }">
                                    <h3>{{ assignment.title }}</h3>
                                </router-link>
                                <p>Due: {{ new Date(assignment.due_date).toLocaleDateString() }}</p>
                            </div>
                        </div>
                        <button 
                            v-if="currentUser.access === 'Admin' || currentUser.access === 'Lärare'" 
                            @click="openModal" 
                            class="create-button">
                            Create New Assignment
                        </button>
                    </div>
                </div>
            </div>
        </main>

        
        <!-- Modal for creating assignments -->
        <div v-if="showModal" class="modal">
            <div class="modal-content create-assignment">
                <h3>Create New Assignment</h3>
                <form @submit.prevent="createAssignment">
                    <input v-model="newAssignment.title" placeholder="Assignment Title" required>
                    <textarea v-model="newAssignment.message" placeholder="Assignment Description" required></textarea>
                    <input v-model="newAssignment.due_date" type="date" required>
                    <div class="modal-buttons">
                        <button type="submit" class="create-button">Create Assignment</button>
                        <button @click="showModal = false" class="cancel-button">Cancel</button>
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
            currentUser: useStorage('currentUser', { name: '', access: '', class: '' }),
            classroom: { name: 'Loading...', subject: '', class: '' },
            messages: [],
            newMessage: '',
            assignments: [],
            newAssignment: {
                title: '',
                message: '',
                due_date: ''
            },
            showModal: false
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
        }
    },
    mounted() {
        this.fetchClassroom();
        this.fetchAssignments();
    },
}
</script>
