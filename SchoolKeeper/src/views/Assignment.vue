<script>
import NavBar from '@/components/Nav-Bar.vue';
import { useStorage } from "@vueuse/core";
import axios from 'axios';

export default {
    name: 'Assignment',
    components: {
        NavBar
    },
    data() {
        return {
            currentUser: useStorage('currentUser', { name: '', access: '', class: '' }),
            assignment: null,
            loading: true,
            error: null
        }
    },
    methods: {
        async fetchAssignment() {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.get(`http://localhost:1010/api/assignment/${this.$route.params.assignmentId}`);
                this.assignment = response.data;
                console.log('Fetched assignment:', this.assignment);
                console.log('Assignment type:', typeof this.assignment);
                console.log('Assignment properties:', Object.keys(this.assignment));
            } catch (error) {
                console.error('Error fetching assignment:', error);
                this.error = 'Failed to load assignment';
            } finally {
                this.loading = false;
            }
        },
    },
    watch: {
        assignment: {
            handler(newVal) {
                console.log('Assignment updated:', newVal);
            },
            deep: true
        }
    },
    mounted() {
        this.fetchAssignment();
    }
}
</script>

<template>
    <div class="assignment-view">   
        <NavBar site="files" :currentUser="currentUser" />
        <main>
            <div class="box-container">
                <div class="left-box">
                    <div v-if="loading" class="loading">
                        Loading assignment...
                    </div>
                    <div v-else-if="error" class="error">
                        {{ error }}
                    </div>
                    <template v-else-if="assignment">
                        <div class="debug-section">
                            <p>Raw assignment data:</p>
                            <pre>{{ JSON.stringify(assignment, null, 2) }}</pre>
                            <p>Individual properties:</p>
                            <ul>
                                <li>Title: {{ assignment.title }}</li>
                                <li>Due Date: {{ assignment.due_date }}</li>
                                <li>Message: {{ assignment.message }}</li>
                            </ul>
                        </div>

                        <div class="assignment-header">
                            <h1>{{ assignment.title }}</h1>
                            <p class="due-date">Due: {{ assignment.due_date }}</p>
                        </div>
                        <div class="assignment-content">
                            <p>{{ assignment.message }}</p>
                        </div>
                    </template>
                    <div v-else>
                        No assignment data available
                    </div>
                </div>
                <div class="right-box">
                    <h2>Assignment Details</h2>
                    <!-- Add additional assignment details here -->
                </div>
            </div>
        </main>
        <Footer />
    </div>
</template>

<style scoped>
.assignment-view {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

main {
    flex-grow: 1;
    display: flex;
    padding: 1rem;
    margin-top: 5rem;
}

.box-container {
    display: flex;
    width: 95vw;
    height: calc(100vh - 7rem);
    gap: 1rem;
}

.left-box {
    flex: 3;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
}

.right-box {
    flex: 1;
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    max-width: 300px;
}

.assignment-header {
    background-color: #e6f2ff;
    padding: 1.5rem;
    border-radius: 8px 8px 0 0;
}

.assignment-header h1 {
    margin: 0;
    color: #333;
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
}

.due-date {
    color: #666;
    font-size: 1rem;
    margin: 0;
}

.assignment-content {
    padding: 1.5rem;
    flex-grow: 1;
    overflow-y: auto;
}

.assignment-content p {
    line-height: 1.6;
    color: #444;
}

h2 {
    margin-top: 0;
    color: #333;
    font-size: 1.2rem;
}

.loading, .error {
    padding: 1.5rem;
    text-align: center;
}

.error {
    color: #dc3545;
}

.debug-info {
    padding: 1rem;
    background-color: #f0f0f0;
    font-family: monospace;
    white-space: pre-wrap;
    word-break: break-all;
}
</style>