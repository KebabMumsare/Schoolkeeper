<template>
    <NavBar site="notice" :currentUser="currentUser" />
    <div class="notice-container-wrapper">
        <div class="notice-container">
            <div v-for="(item, index) in notice" :key="index" class="notice-card" @click="openNotice(item)">
                <div class="notice-card-header">
                    <h3 class="notice-title">{{ item.title }}</h3>
                    <span class="notice-date">{{ new Date(item.created_at).toLocaleString() }}</span>
                </div>
                <p class="notice-preview">{{ item.message.substring(0, 100) }}...</p>
            </div>
        </div>
        <button v-if="currentUser.access === 'Admin' || currentUser.access === 'Lärare'" @click="openModal" class="create-button">Skapa Ny Notis</button>

        <div v-if="showModal" class="modal">
            <div class="modal-content create-notice">
                <h3>Skapa Ny Notis</h3>
                <form @submit.prevent="createNotice">
                    <input v-model="newNotice.title" placeholder="Notis Titel" required>
                    <textarea v-model="newNotice.message" placeholder="Notis Meddelande" required></textarea>
                    <div class="modal-buttons">
                        <button type="submit" class="create-button">Skapa Notis</button>
                        <button @click="closeModal" class="cancel-button">Avbryt</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div class="notice-details-wrapper" v-if="selectedNotice">
        <div class="notice-details" @click="closeNotice">
            <div class="notice-details-content" @click.stop>
                <div class="notice-details-header">
                    <h2>{{ selectedNotice.title }}</h2>
                    <button class="close-button" @click="closeNotice">&times;</button>
                </div>
                <div class="notice-details-body">
                    <p>{{ selectedNotice.message }}</p>
                    <p>Skickad: {{ new Date(selectedNotice.created_at).toLocaleString() }}</p>
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
    padding: 2rem;
    padding-top: 100px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background-color: #f0f2f5;
    box-sizing: border-box;
}

.notice-container {
    width: 350px;
    overflow-y: auto;
    max-height: 75vh;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    margin-left: 2rem;
    margin-bottom: 2rem;
    position: relative;
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
    scroll-behavior: smooth;
}

.notice-container::after {
    content: none;
}

.notice-card {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    width: 100%;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    cursor: pointer;
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.5s forwards;
    animation-delay: calc(var(--index, 0) * 0.1s);
}

.notice-card:hover {
    transform: translateY(-3px) scale(1.01);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    background-color: #f9f9f9;
}

.notice-card:active {
    transform: translateY(-1px) scale(0.99);
    transition: all 0.1s;
}

.notice-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
}

.notice-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 4px;
    line-height: 1.3;
}

.notice-date {
    font-size: 0.8rem;
    color: #666;
}

.notice-preview {
    font-size: 0.95rem;
    color: #555;
    line-height: 1.5;
    margin-top: 8px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.create-button {
    margin-left: 3rem;
    margin-top: 0.5rem;
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 1rem;
    transition: background-color 0.3s;
    position: relative;
    z-index: 6;
}

.create-button:hover {
    background-color: #0056b3;
}

.modal, .notice-details {
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
    padding: 20px;
    box-sizing: border-box;
}

.modal-content, .notice-details-content {
    max-height: 80vh;
    overflow-y: auto;
}

.modal-content {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    width: 90%;
    max-width: 500px;
    padding: 2rem;
    animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
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
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    width: 80%;
    max-width: 600px;
    padding: 2rem;
}

.notice-details-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.notice-details-header h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #333;
}

.close-button {
    background-color: transparent;
    color: #333;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    transition: color 0.3s;
}

.close-button:hover {
    color: #007bff;
}

.notice-details-body {
    font-size: 1rem;
    color: #555;
}

:deep(footer) {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 10;
}

:deep(.navbar) {
    z-index: 100;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
}

/* Customize scrollbar for WebKit browsers */
.notice-container::-webkit-scrollbar {
    width: 6px;
}
.notice-container::-webkit-scrollbar-track {
    background: transparent;
}
.notice-container::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
}

/* Staggered animation for cards */
@keyframes fadeInUp {
    to {
        opacity: 1;
        transform: translateY(0);
    }
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
                this.notice = response.data.sort((a, b) => {
                    const dateA = new Date(a.created_at);
                    const dateB = new Date(b.created_at);

                    // Check for invalid dates
                    if (isNaN(dateA) && isNaN(dateB)) return 0; 
                    if (isNaN(dateA)) return 1; 
                    if (isNaN(dateB)) return -1; 

                    return dateB - dateA;
                });
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
        this.fetchNotice().then(() => {
            // Set staggered animation delays after notices are loaded
            setTimeout(() => {
                const cards = document.querySelectorAll('.notice-card');
                cards.forEach((card, index) => {
                    card.style.setProperty('--index', index);
                });
            }, 100);
        });
    }
};
</script>
