<template>
    <NavBar site="notice" :currentUser="currentUser" />
    <div class="notice-container-wrapper">
    <div class="notice-container">
        <div v-for="(item, index) in notice" :key="index" class="notice-item" @click="openNotice(item)">
            <h3>{{ item.title }}</h3>
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
            </div>
        </div>
    </div>
</div>
</template>

<style scoped>
.notice-container-wrapper {
    width: 100vw;
    height: 100vh;
    padding-left: 1rem;
    padding-top: 1.5rem;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
}

.notice-container {
    height: 80vh;
    overflow-y: auto;
    border: 1px solid #ccc;
    padding: 1rem;
    border-radius: 10px;
    margin-top: 5rem;
    background-color: #f8f9fa;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.notice-item {
    height: 2rem;
    width: 20rem;
    margin-bottom: 10px;
    padding: 10px;
    background-color: #b6c9f2;
    border-radius: 5px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.notice-item:hover {
    background-color: #95b3e6;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
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

</style>

<script>
import NavBar from '@/components/Nav-Bar.vue';
import axios from 'axios';
import { useStorage } from "@vueuse/core";

export default {
    name: 'notice',
    components: {
        NavBar,
    },
    data() {
        return {
            currentUser: useStorage('currentUser', { name: '', access: '', class: '' }),
            notice: [],
            selectedNotice: null,
        };
    },
    methods: {
        async fetchNotice() {
            try {
                // Fetch all notices from the backend API
                const response = await axios.get('http://localhost:1010/api/notice/');
                const allNotices = response.data;

                // Filter notices based on certain conditions
                this.notice = allNotices.filter(notice => {
                    // Example condition: Display only notices meant for the user's class or a specific access level
                    if (notice.targetClass && notice.targetClass === this.currentUser.class) {
                        return true; // Matches the user's class
                    }
                    if (notice.targetAccess && notice.targetAccess.includes(this.currentUser.access)) {
                        return true; // Matches the user's access level
                    }

                    // Add more conditions as needed
                    return false;
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
        }
    },
    mounted() {
        this.fetchNotice();
    }
};
</script>
