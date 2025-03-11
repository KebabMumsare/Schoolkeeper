<template>
    <NavBar site="personal" :currentUser="currentUser" />
    <main class="personal-content">
        <div class="profile-header">
            <div class="profile-avatar">
                <span>{{ getInitials(user.name) }}</span>
            </div>
            <h2 class="profile-name">{{ user.name }}</h2>
            <div class="profile-role">{{ user.access || 'Student' }}</div>
        </div>
        
        <div class="profile-card">
            <div class="card-section">
                <h3 class="section-title">Personlig Information</h3>
                <div class="info-grid">
                    <div class="info-item" v-if="user.class">
                        <div class="info-label">Klass</div>
                        <div class="info-value">{{ user.class }}</div>
                    </div>
                    <div class="info-item" v-if="user.age">
                        <div class="info-label">Ålder</div>
                        <div class="info-value">{{ user.age }}</div>
                    </div>
                    <div class="info-item" v-if="user.email">
                        <div class="info-label">Email</div>
                        <div class="info-value">{{ user.email }}</div>
                    </div>
                    <div class="info-item" v-if="user.phoneNumber">
                        <div class="info-label">Telefonnummer</div>
                        <div class="info-value">{{ user.phoneNumber }}</div>
                    </div>
                </div>
            </div>
            
            <div class="card-actions">
                <button @click="toggleDetails" class="action-button more-button">
                    <span class="button-icon">{{ showDetails ? '▲' : '▼' }}</span>
                    {{ showDetails ? 'Mindre information' : 'Mer information' }}
                </button>
                <button @click="goToStudyPlan" class="action-button study-plan-button">
                    <span class="button-icon">📚</span>
                    Individuell Studieplan
                </button>
            </div>
            
            <div v-if="showDetails" class="details-section">
                <h3 class="section-title">Ytterligare Information</h3>
                <div class="info-grid">
                    <div class="info-item" v-if="user.studentdokument">
                        <div class="info-label">Studentdokument</div>
                        <div class="info-value">{{ user.studentdokument }}</div>
                    </div>
                    <div class="info-item" v-if="user.birthday">
                        <div class="info-label">Födelsedag</div>
                        <div class="info-value">{{ user.birthday }}</div>
                    </div>
                    <div class="info-item" v-if="user.emergencyContact">
                        <div class="info-label">Nödkontakt</div>
                        <div class="info-value">{{ user.emergencyContact }}</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="quick-stats">
            <div class="stat-card">
                <div class="stat-icon">📊</div>
                <div class="stat-value">92%</div>
                <div class="stat-label">Närvaro</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">📝</div>
                <div class="stat-value">5</div>
                <div class="stat-label">Kommande prov</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">📅</div>
                <div class="stat-value">12</div>
                <div class="stat-label">Lektioner denna vecka</div>
            </div>
        </div>
    </main>
    <Footer />
</template>

<style scoped>
.personal-content {
    max-width: calc(100vw - 40px);
    width: 900px;
    margin: 80px auto 30px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.profile-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 10px;
    text-align: center;
}

.profile-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: #4fc0e5;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    font-weight: 600;
    margin-bottom: 15px;
    box-shadow: 0 4px 10px rgba(79, 192, 229, 0.3);
}

.profile-name {
    font-size: 2rem;
    font-weight: 600;
    color: #216e87;
    margin: 0 0 5px;
}

.profile-role {
    font-size: 1.1rem;
    color: #666;
    margin-bottom: 10px;
}

.profile-card {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    padding: 0;
}

.card-section {
    padding: 25px;
    border-bottom: 1px solid #f0f0f0;
}

.section-title {
    font-size: 1.3rem;
    color: #216e87;
    margin: 0 0 20px;
    position: relative;
    padding-bottom: 10px;
}

.section-title::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    width: 50px;
    background-color: #4fc0e5;
    border-radius: 2px;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
}

.info-item {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.info-label {
    font-size: 0.9rem;
    color: #777;
    font-weight: 500;
}

.info-value {
    font-size: 1.1rem;
    color: #333;
    font-weight: 500;
}

.card-actions {
    display: flex;
    gap: 15px;
    padding: 15px 25px;
    background-color: #f9f9f9;
}

.action-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border: none;
    border-radius: 6px;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.more-button {
    background-color: #f0f0f0;
    color: #555;
}

.more-button:hover {
    background-color: #e0e0e0;
}

.study-plan-button {
    background-color: #4fc0e5;
    color: white;
    margin-left: auto;
}

.study-plan-button:hover {
    background-color: #3da1b5;
}

.button-icon {
    font-size: 1rem;
}

.details-section {
    padding: 25px;
    background-color: #f9f9f9;
    border-top: 1px solid #eee;
    animation: fadeIn 0.3s ease;
}

.quick-stats {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    margin-top: 10px;
}

.stat-card {
    background-color: white;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    transition: transform 0.2s ease;
}

.stat-card:hover {
    transform: translateY(-5px);
}

.stat-icon {
    font-size: 2rem;
    margin-bottom: 10px;
}

.stat-value {
    font-size: 1.8rem;
    font-weight: 600;
    color: #216e87;
    margin-bottom: 5px;
}

.stat-label {
    font-size: 0.95rem;
    color: #666;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
    .personal-content {
        margin-top: 70px;
        padding: 0 10px;
    }
    
    .info-grid {
        grid-template-columns: 1fr;
    }
    
    .quick-stats {
        grid-template-columns: 1fr;
    }
    
    .card-actions {
        flex-direction: column;
    }
    
    .study-plan-button {
        margin-left: 0;
    }
}
</style>

<script>
import NavBar from "@/components/Nav-Bar.vue";
import axios from "axios";
import { useStorage } from "@vueuse/core";
import Footer from "@/components/Footer.vue";
import { useRouter } from 'vue-router';

export default {
    name: 'Personal',
    components: {
        NavBar,
        Footer,
    },
    setup() {
        const router = useRouter();
        return { router };
    },
    data() {
        return {
            currentUser: useStorage('currentUser', { name: '', access: '', class: '' }),
            user: {},
            error: null,
            showDetails: false,
        }
    },
    methods: {
        fetchUser() {
            const userId = this.currentUser.name; // Assuming the user ID is passed via the route

            axios.get(`http://localhost:1010/api/user/${userId}`)
                .then(response => {
                    this.user = response.data; // Store user data in component
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                    this.error = 'Failed to load user data'; // Optional error handling
                    
                    // Fallback to currentUser data if API fails
                    this.user = { ...this.currentUser };
                });
        },
        toggleDetails() {
            this.showDetails = !this.showDetails;
        },
        goToStudyPlan() {
            this.router.push('/individual-study-plan');
        },
        getInitials(name) {
            if (!name) return '?';
            return name.split(' ')
                .map(part => part.charAt(0))
                .join('')
                .toUpperCase()
                .substring(0, 2);
        }
    },
    mounted() {
        this.fetchUser(); // Fetch user data when the component is mounted
    }
}
</script>
