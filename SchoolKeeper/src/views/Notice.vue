<template>
    <NavBar site="notice" :currentUser="currentUser" />
    <div class="notice-container-wrapper">
        <div class="notice-container">
            <div v-for="(item, index) in notice" :key="index" class="notice-item" @click="openNotice(item)">
                <div class="notice-title">{{ item.title }}</div>
                <div class="notice-date">{{ new Date(item.created_at).toLocaleString() }}</div>
            </div>
            <button v-if="currentUser.access === 'Admin' || currentUser.access === 'Lärare'" @click="openModal" class="create-button">Create New Notice</button>
        </div>
        <div v-if="showModal" class="modal">
            <div class="modal-content create-notice">
                <h3>Create New Notice</h3>
                <form @submit.prevent="createNotice">
                    <input v-model="newNotice.title" placeholder="Notice Title" required>
                    <textarea v-model="newNotice.message" placeholder="Notice Message" required></textarea>
                    <div class="modal-buttons">
                        <button type="submit" class="create-button">Create Notice</button>
                        <button @click="closeModal" class="cancel-button">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div class="notice-details-wrapper">
        <div v-if="selectedNotice" class="notice-details" @click="closeNotice">
            <div class="notice-details-content" @click.stop>
                <div class="notice-details-header">
                    <h2>{{ selectedNotice.title }}</h2>
                    <button class="close-button" @click="closeNotice">&times;</button>
                </div>
                <div class="notice-details-body">
                    <p>{{ selectedNotice.message }}</p>
                    <p>Sent on: {{ new Date(selectedNotice.created_at).toLocaleString() }}</p>
                </div>
            </div>
        </div>
    </div>
    <Footer />
</template>

<style scoped>
.notice-container-wrapper {
    width: 100vw;
    height: 100vh;
    padding-left: 1rem;
    padding-top: 1.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.notice-container {
    max-height: 60vh;
    width: 100vh;
    overflow-y: auto;
    border: 1px solid #ccc;
    padding: 1rem;
    border-radius: 10px;
    margin-bottom: 1rem;
    background-color: #f8f9fa;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
}

.notice-item {
    height: 10vh;
    width: 100%;
    margin-bottom: 10px;
    padding: 10px;
    background-color: #b6c9f2;
    border-radius: 5px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    font-size: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.3s ease;
}

.notice-item:hover {
    background-color: #95b3e6;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
}

.notice-title {
    flex: 1;
}

.notice-date {
    margin-left: 10px;
    font-size: 0.9rem;
    color: #333;
}

.notice-details {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.notice-details-content {
    background-color: #fff;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    width: 80%;
    max-width: 600px;
}

.notice-details-header {
    background-color: #007bff;
    color: white;
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.notice-details-header h2 {
    margin: 0;
}

.close-button {
    background-color: transparent;
    color: white;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    transition: background-color 0.3s ease;
}

.close-button:hover {
    background-color: rgba(255, 255, 255, 0.2);
}

.notice-details-body {
    padding: 20px;
}

.details-button {
    background-color: #ffffff;
    color: #007bff;
    border: none;
    padding: 8px 15px;
    border-radius: 5px;
    font-size: 0.9rem;
    transition: all 0.3s ease;
}

.details-button:hover {
    background-color: #f0f0f0;
}

.create-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 5px;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    margin-top: 1rem;
}

.create-button:hover {
    background-color: #007bff;
    cursor: pointer;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: #fff;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    width: 80%;
    max-width: 600px;
    padding: 2rem;
}

.modal-content input,
.modal-content textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 1rem;
    box-sizing: border-box;
}

.modal-content textarea {
    height: 100px;
    resize: vertical;
}

.modal-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
}

.cancel-button {
    background-color: #f0f0f0;
    color: #007bff;
    border: none;
    padding: 8px 15px;
    border-radius: 5px;
    font-size: 0.9rem;
    transition: all 0.3s ease;
}

.cancel-button:hover {
    background-color: #e0e0e0;
}

</style>

<script>
import NavBar from '@/components/Nav-Bar.vue';
import Footer from '@/components/Footer.vue';
import axios from 'axios';
import { useStorage } from "@vueuse/core";

export default {
    name: 'notice',
    components: {
        NavBar,
        Footer,
    },
    data() {
        return {
            currentUser: useStorage('currentUser', { name: '', access: '', class: '' }),
            notice: [],
            selectedNotice: null,
            showModal: false,
            newNotice: {
                title: '',
                message: ''
            }
        };
    },
    methods: {
        async fetchNotice() {
            try {
                const response = await axios.get('http://localhost:1010/api/notices');
                this.notice = response.data; // Fetch all notices
            } catch (error) {
                console.error("Error fetching notices:", error);
            }
        },
        openNotice(item) {
            this.selectedNotice = item;
        },
        closeNotice() {
            this.selectedNotice = null;
        },
        openModal() {
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
        },
        async createNotice() {
            if (this.newNotice.title && this.newNotice.message) {
                try {
                    const payload = {
                        title: this.newNotice.title,
                        message: this.newNotice.message,
                        created_at: new Date().toISOString(), // Include created_at timestamp
                    };
                    const response = await axios.post('http://localhost:1010/api/notice', payload);
                    this.notice.push(response.data); // Add the new notice to the notices array
                    this.newNotice = { title: '', message: '' }; // Clear the input fields
                    this.closeModal(); // Close the modal
                } catch (error) {
                    console.error('Error creating notice:', error);
                }
            }
        }
    },
    mounted() {
        this.fetchNotice();
    }
};
</script>
