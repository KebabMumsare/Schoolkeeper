<template>
    <NavBar site="notice" :currentUser="currentUser" />
    <div class="notice-container-wrapper">
        <div class="notice-section">
            <div class="notice-container">
                <div v-for="(item, index) in notice" :key="index" class="notice-card" @click="openNotice(item)">
                    <div class="notice-card-header">
                        <h3 class="notice-title">{{ item.title }}</h3>
                        <span class="notice-date">{{ new Date(item.created_at).toLocaleString() }}</span>
                    </div>
                    <p class="notice-preview">{{ item.message.substring(0, 100) }}...</p>
                </div>
            </div>
        </div>
        
        <!-- Permanent Create Notice Form -->
        <div v-if="currentUser.access === 'Admin' || currentUser.access === 'Lärare'" class="create-notice-section">
            <div class="create-notice-container">
                <h3 class="create-notice-title">Skapa Ny Notis</h3>
                <form @submit.prevent="createNotice">
                    <input v-model="newNotice.title" placeholder="Notis Titel" required>
                    <textarea v-model="newNotice.message" placeholder="Notis Meddelande" required></textarea>
                    <button type="submit" class="create-button">Skapa Notis</button>
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
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    background-color: #f0f2f5;
    box-sizing: border-box;
}

.notice-section {
    display: flex;
    flex-direction: column;
    flex: 1;
    max-width: 400px;
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

/* New styles for the permanent create notice form */
.create-notice-section {
    margin-left: 3rem;
    flex: 2;
    max-width: 700px;
    padding-top: 0; /* Remove top padding to align with notifications */
}

.create-notice-container {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 2.5rem;
    padding-top: 1.5rem; /* Reduce top padding */
    animation: fadeIn 0.5s ease-out;
    height: 75vh;
    display: flex;
    flex-direction: column;
    user-drag: none;
    -webkit-user-drag: none;
    margin-top: 1rem; /* Match the first notification's position */
}

.create-notice-title {
    margin-top: 0;
    margin-bottom: 1rem; /* Reduced from 1.5rem */
    color: #333;
    font-size: 1.4rem;
    text-align: center;
}

.create-notice-container input,
.create-notice-container textarea,
.create-notice-container button {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-bottom: 1.2rem;
    box-sizing: border-box;
    font-size: 1rem;
    transition: border-color 0.3s, box-shadow 0.3s;
    user-drag: none;
    -webkit-user-drag: none;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
}

.create-notice-container input:focus,
.create-notice-container textarea:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    outline: none;
}

.create-notice-container form {
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: space-between;
    height: 100%;
    padding-bottom: 20px;
}

.create-notice-container form > :last-child {
    margin-top: auto;
}

.create-notice-container textarea {
    height: 250px;
    flex-grow: 1;
    resize: none;
    line-height: 1.5;
    margin-bottom: 1rem;
}

.create-button {
    width: 100%;
    background-color: #007bff;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 5px;
    font-size: 1rem;
    transition: background-color 0.3s;
    cursor: pointer;
    font-weight: 500;
    margin-top: 1rem;
    margin-bottom: 0;
    position: relative;
    bottom: 0;
}

.create-button:hover {
    background-color: #0056b3;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
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
        async createNotice() {
            if (this.newNotice.title && this.newNotice.message) {
                try {
                    const payload = {
                        title: this.newNotice.title,
                        message: this.newNotice.message,
                        created_at: new Date().toISOString(), // Include created_at timestamp
                    };
                    const response = await axios.post('http://localhost:1010/api/notice', payload);
                    
                    // Add the new notice to the beginning of the notices array
                    this.notice.unshift(response.data);
                    
                    // Clear the input fields
                    this.newNotice = { title: '', message: '' };
                    
                    // Show success message or feedback
                    alert('Notis skapad!');
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
