<template>
    <div class="wraper">
        <!-- Left Sidebar -->
        <div class="components">
            <div class="components-header">
                <button @click="goBack" class="back-button">
                    Tillbaka
                </button>
                <h2>Grupper</h2>
            </div>

            <!-- Search and List in Sidebar -->
            <div class="sidebar-content">
                <input 
                    type="text" 
                    v-model="searchQuery" 
                    placeholder="Sök grupper..." 
                    class="search-bar" 
                />
                <div class="group-list">
                    <div 
                        v-for="group in filteredGroups"  
                        :key="group.name"
                        class="group-item"
                        @click="selectGroup(group)"
                    >
                        <div class="group-info">
                            <strong>Namn:</strong> {{ group.name }} <br />
                            <strong>Typ:</strong> {{ group.type }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="button-wrapper">
                <button @click="openModal" class="create-button">Skapa ny grupp</button>
            </div>
        </div>

        <!-- Main Content Area -->
        <div class="main-container">
            <div class="main-header">
                <h2>Gruppdetaljer</h2>
            </div>
            <div class="main-content">
                <div class="info-container">
                    <div class="group-details-box">
                        <h3>Gruppinformation</h3>
                        <div class="details-content">
                            <p><strong>Namn:</strong> {{ selectedGroup?.name || 'Ingen grupp vald' }}</p>
                            <p><strong>Typ:</strong> {{ selectedGroup?.type || 'Ej tillgänglig' }}</p>
                            <p><strong>Lärare:</strong> {{ selectedGroup?.teacher || 'Ej tillgänglig' }}</p>
                            <p><strong>Skapad:</strong> {{ selectedGroup?.createdAt || 'Ej tillgänglig' }}</p>
                        </div>
                    </div>
                    <div class="members-box">
                        <div class="members-header">
                            <h3>Gruppmedlemmar</h3>
                            <button v-if="selectedGroup" @click="openAddMemberModal" class="add-member-button">
                                Lägg till medlem
                            </button>
                        </div>
                        <div class="members-list">
                            <div v-if="selectedGroupMembers?.length" class="member-items">
                                <div v-for="member in selectedGroupMembers" :key="member.id" class="member-item">
                                    {{ member.name }}
                                </div>
                            </div>
                            <p v-else class="no-members">Inga medlemmar i denna grupp</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal">
        <div class="modal-content">
            <h3>Skapa grupp</h3>
            <form @submit.prevent="createGroup">
                <input v-model="newGroup.name" placeholder="Gruppnamn" required />
                <select v-model="newGroup.type" required>
                    <option value="">Välj grupptyp</option>
                    <option value="class">Klass</option>
                    <option value="specialization">Specialisering</option>
                    <option value="individual">Individuell</option>
                    <option value="extra">Extra</option>
                </select>
                <div class="modal-buttons">
                    <button type="submit" class="create-button">Skapa grupp</button>
                    <button @click="closeModal" class="cancel-button">Avbryt</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Add Member Modal -->
    <div v-if="showAddMemberModal" class="modal">
        <div class="modal-content">
            <h3>Lägg till medlem i grupp</h3>
            <div class="search-container">
                <input 
                    v-model="memberSearchQuery" 
                    placeholder="Sök användare..." 
                    class="search-bar" 
                />
            </div>
            <div class="available-users">
                <div v-if="filteredAvailableUsers.length" class="user-list">
                    <div 
                        v-for="user in filteredAvailableUsers" 
                        :key="user._id" 
                        class="user-item"
                        @click="addMemberToGroup(selectedGroup._id, user._id)"
                    >
                        {{ user.name }}
                    </div>
                </div>
                <p v-else class="no-users">Inga användare hittades</p>
            </div>
            <div class="modal-buttons">
                <button @click="closeAddMemberModal" class="cancel-button">Stäng</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.wraper {
    display: flex;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}

/* Left Sidebar Styles */
.components {
    width: 20vw;
    background-color: #f5f5f5;
    position: relative;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #ddd;
}

.components-header {
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    background-color: #216e87;
    border-bottom: 1px solid #ddd;
}

.components-header h2 {
    margin: 0;
    color: white;
}

.sidebar-content {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
}

.search-bar {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-bottom: 1rem;
    font-size: 0.9rem;
}

.group-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.group-item {
    background-color: white;
    padding: 1rem;
    border-radius: 4px;
    border: 1px solid #ddd;
    cursor: pointer;
    transition: background-color 0.2s;
}

.group-item:hover {
    background-color: #f0f0f0;
}

.group-info {
    line-height: 1.5;
}

/* Main Content Area Styles */
.main-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: #fff;
}

.main-header {
    padding: 1rem;
    background-color: #4fc0e5;
    color: white;
}

.main-header h2 {
    margin: 0;
}

.main-content {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
}

/* Button Styles */
.button-wrapper {
    padding: 1rem;
    border-top: 1px solid #ddd;
}

.create-button {
    background-color: #4fc0e5;
    padding: 0.5rem;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    color: #fff;
    width: 100%;
    transition: background-color 0.2s;
}

.create-button:hover {
    background-color: #216e87;
}

.back-button {
    padding: 0.5rem 1rem;
    background-color: #4fc0e5;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s;
}

.back-button:hover {
    background-color: #1d5d73;
}

/* Modal Styles */
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
    padding: 2rem;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.modal-content h3 {
    color: #216e87;
    margin-top: 0;
}

.modal-content input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-bottom: 1rem;
    font-size: 1rem;
}

.modal-content select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-bottom: 1rem;
    font-size: 1rem;
}

.modal-buttons {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
}

.cancel-button {
    background-color: #f0f0f0;
    color: #216e87;
    border: none;
    padding: 0.5rem 2rem;
    border-radius: 0.5rem;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
}

.cancel-button:hover {
    background-color: #e0e0e0;
}

.info-container {
    display: flex;
    gap: 2rem;
    height: 100%;
}

.group-details-box,
.members-box {
    flex: 1;
    background-color: #f5f5f5;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.group-details-box h3 {
    color: #216e87;
    margin-top: 0;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #4fc0e5;
}

.details-content p {
    margin: 0.5rem 0;
    line-height: 1.6;
}

.members-list {
    height: calc(100% - 3rem);
    overflow-y: auto;
}

.member-item {
    background-color: white;
    padding: 0.75rem;
    margin-bottom: 0.5rem;
    border-radius: 4px;
    border: 1px solid #ddd;
}

.no-members {
    color: #666;
    text-align: center;
    margin-top: 2rem;
}

.members-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #4fc0e5;
}

.members-header h3 {
    color: #216e87;
    margin: 0;
}

.add-member-button {
    background-color: #4fc0e5;
    color: white;
    border: none;
    padding: 0.4rem 0.8rem;
    border-radius: 4px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background-color 0.2s;
}

.add-member-button:hover {
    background-color: #216e87;
}

.available-users {
    max-height: 300px;
    overflow-y: auto;
    margin: 1rem 0;
}

.user-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.user-item {
    background-color: white;
    padding: 0.75rem;
    border-radius: 4px;
    border: 1px solid #ddd;
    cursor: pointer;
    transition: background-color 0.2s;
}

.user-item:hover {
    background-color: #f0f0f0;
}

.no-users {
    color: #666;
    text-align: center;
    padding: 1rem;
}

.search-container {
    margin-bottom: 1rem;
}
</style>

<script>
import axios from 'axios';
import { useStorage } from "@vueuse/core";

export default {
    name: 'group-creator',
    data() {
        return {
            currentUser: useStorage('currentUser', { name: '', access: '', class: '' }),
            showModal: false,
            showAddMemberModal: false,
            groups: [],
            searchQuery: '',
            memberSearchQuery: '',
            newGroup: {
                name: '',
                type: ''
            },
            selectedGroup: null,
            selectedGroupMembers: [],
            availableUsers: []
        };
    },

    computed: {
        filteredGroups() {
            return this.groups.filter(group => 
                group.name.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        },
        filteredAvailableUsers() {
            return this.availableUsers.filter(user => 
                user.name.toLowerCase().includes(this.memberSearchQuery.toLowerCase())
            );
        }
    },
    methods: {
        goBack() {
            this.$router.push('/admintools');
        },
        openModal() {
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
            this.newGroup = { name: '', type: '' };
        },
        openAddMemberModal() {
            this.showAddMemberModal = true;
            this.fetchAvailableUsers();
        },
        closeAddMemberModal() {
            this.showAddMemberModal = false;
            this.memberSearchQuery = '';
        },
        async selectGroup(group) {
            this.selectedGroup = group;
            this.selectedGroup.teacher = (await axios.get(`http://localhost:1010/api/users/${group.teacher}`)).data.name;
            this.fetchGroupMembers(group._id);
        },

        async fetchAvailableUsers() {
            try {
                const response = await axios.get('http://localhost:1010/api/users');
                // Filter out users that are already in the group and only include students
                const memberIds = this.selectedGroupMembers.map(member => member._id);
                this.availableUsers = response.data.filter(user => 
                    !memberIds.includes(user._id) && 
                    user.access === 'Elev'  // Only include students
                );
            } catch (error) {
                console.error('Error fetching available users:', error);
            }
        },
        async fetchGroupMembers(groupId) {
            try {
                const response = await axios.get(`http://localhost:1010/api/users/group/${groupId}`);
                this.selectedGroupMembers = response.data;
                console.log(this.selectedGroupMembers);
            } catch (error) {
                console.error('Error fetching group members:', error);
            }
        },
        async createGroup() {
            if (this.newGroup.name) {
                try {
                    const payload = {
                        name: this.newGroup.name,
                        type: this.newGroup.type
                    };
                    const response = await axios.post('http://localhost:1010/api/groups', payload);
                    this.groups.push(response.data);
                    this.closeModal();
                } catch (error) {
                    console.error('Error creating group:', error);
                }
            }
        },
        async fetchGroups() {
            try {
                const response = await axios.get('http://localhost:1010/api/allGroups');
                this.groups = response.data;
                console.log(this.groups);
            } catch (error) {
                console.error("Error fetching groups:", error);
            }
        },
        async addMemberToGroup(groupId, memberId) {
            try {
                const response = await axios.post(`http://localhost:1010/api/groups/${groupId}/${memberId}`);
                console.log(response.data);
            } catch (error) {
                console.error('Error adding member to group:', error);
            }
        }
    },
    mounted() {
        this.fetchGroups();
    }
};
</script>