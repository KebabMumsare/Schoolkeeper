<template>
    <NavBar site="personal" :currentUser="currentUser" />
    <main class="content">
        <h2>{{ user.name }}</h2>
        <table>
          <tbody>
            <tr v-if="user.age">
              <td>Age:</td>
              <td>{{ user.age }}</td>
            </tr>
            <tr v-if="user.email">
              <td>Email:</td>
              <td>{{ user.email }}</td>
            </tr>
            <tr v-if="user.phoneNumber">
              <td>Number:</td>
              <td>{{ user.phoneNumber }}</td>
            </tr>
            <tr v-if="user.class">
              <td>Class:</td>
              <td>{{ user.class }}</td>
            </tr>
          </tbody>
        </table>
        <div class="button-container">
            <button @click="toggleDetails" class="more-button">{{ showDetails ? 'Mindre...' : 'Mer...' }}</button>
            <button @click="goToStudyPlan" class="study-plan-button">Individual Study Plan</button>
        </div>
        
        <div v-if="showDetails" class="details-dropdown">
          <h3>Additional Details</h3>
          <table>
            <tbody>
              <tr v-if="user.studentdokument">
                <td>Studentdokument:</td>
                <td>{{ user.studentdokument }}</td>
              </tr>
              <tr v-if="user.birthday">
                <td>Birthday:</td>
                <td>{{ user.birthday }}</td>
              </tr>
              <tr v-if="user.emergencyContact">
                <td>Emergency Contact:</td>
                <td>{{ user.emergencyContact }}</td>
              </tr>
              <!-- Lägg till mer om de behövs-->
            </tbody>
          </table>
        </div>
    </main>
    <Footer />
</template>

<style scoped>
h1 {
    size: 1000px;
    color: black;
}
main {
    border: solid black 0px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    background-color: #f8f9fa;
    padding: 1rem;
}
.button-container {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}
.more-button, .study-plan-button {
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
.study-plan-button {
    background-color: #28a745;
}
.details-dropdown {
    margin-top: 1rem;
    padding: 1rem;
    background-color: #e9ecef;
    border-radius: 5px;
    transition: all 0.3s ease;
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
                });
        },
        toggleDetails() {
            this.showDetails = !this.showDetails;
        },
        goToStudyPlan() {
            this.router.push('/individual-study-plan');
        }
    },
    mounted() {
        this.fetchUser(); // Fetch user data when the component is mounted
    }
}
</script>
