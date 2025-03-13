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
                <button 
                    @click="toggleEditMode" 
                    class="edit-mode-button"
                    :class="{ 'active': editMode }"
                >
                    Redigera
                </button>
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

    <!-- Edit Group Modal -->
    <div v-if="showEditModal" class="modal">
        <div class="modal-content">
            <h3>Redigera grupp</h3>
            <form @submit.prevent="updateGroup">
                <input v-model="editingGroup.name" placeholder="Gruppnamn" required />
                <select v-model="editingGroup.type" required>
                    <option value="">Välj grupptyp</option>
                    <option value="class">Klass</option>
                    <option value="specialization">Specialisering</option>
                    <option value="individual">Individuell</option>
                    <option value="extra">Extra</option>
                </select>
                <div class="modal-buttons">
                    <button type="submit" class="update-button">Uppdatera</button>
                    <button @click="deleteGroup" class="delete-button">Ta bort grupp</button>
                    <button @click="closeEditModal" class="cancel-button">Avbryt</button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
.wraper {
    display: flex;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: #f0f2f5;
    background-image: linear-gradient(135deg, #f5f7fa 0%, #e4efe9 100%);
}

/* Left Sidebar Styles */
.components {
    width: 350px;
    background-color: #fff;
    position: relative;
    display: flex;
    flex-direction: column;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.07);
    z-index: 10;
    border-right: 1px solid #eee;
}

.components-header {
    padding: 1.2rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    border-bottom: 1px solid #eee;
    background-color: #f9f9f9;
}

.components-header h2 {
    margin: 0;
    color: #333;
    font-size: 1.4rem;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.sidebar-content {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #11998e #f0f2f5;
    padding-bottom: 6rem;
}

.sidebar-content::-webkit-scrollbar {
    width: 6px;
}

.sidebar-content::-webkit-scrollbar-track {
    background: #f0f2f5;
}

.sidebar-content::-webkit-scrollbar-thumb {
    background: #11998e;
    border-radius: 3px;
}

.search-bar {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #eee;
    border-radius: 8px;
    margin-bottom: 1rem;
    font-size: 0.95rem;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.search-bar:focus {
    border-color: #11998e;
    outline: none;
    box-shadow: 0 0 0 3px rgba(17, 153, 142, 0.2);
}

.group-list {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
}

.group-item {
    background-color: white;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid #eee;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
    position: relative;
    overflow: hidden;
}

.group-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #11998e 0%, #38ef7d 100%);
    transition: height 0.3s ease;
}

.group-item:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
    border-color: #11998e;
}

.group-item:hover::before {
    height: 6px;
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
    padding: 1.2rem;
    background: linear-gradient(90deg, #11998e 0%, #38ef7d 100%);
    color: white;
}

.main-header h2 {
    margin: 0;
    font-size: 1.4rem;
    font-weight: 600;
}

.main-content {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #11998e #f0f2f5;
}

.main-content::-webkit-scrollbar {
    width: 6px;
}

.main-content::-webkit-scrollbar-track {
    background: #f0f2f5;
}

.main-content::-webkit-scrollbar-thumb {
    background: #11998e;
    border-radius: 3px;
}

/* Button Styles */
.button-wrapper {
    padding: 1.2rem;
    border-top: 1px solid #eee;
    background: linear-gradient(to top, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.8));
    display: flex;
    gap: 1rem;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 10;
}

.create-button {
    background: linear-gradient(90deg, #11998e 0%, #38ef7d 100%);
    padding: 1rem;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    color: #fff;
    width: 100%;
    box-shadow: 0 4px 10px rgba(17, 153, 142, 0.2);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.create-button:hover {
    box-shadow: 0 6px 15px rgba(17, 153, 142, 0.3);
    transform: translateY(-2px);
}

.back-button {
    padding: 0.6rem 1rem;
    background: linear-gradient(90deg, #11998e 0%, #38ef7d 100%);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 4px 10px rgba(17, 153, 142, 0.2);
    display: flex;
    align-items: center;
    gap: 6px;
}

.back-button:hover {
    box-shadow: 0 6px 15px rgba(17, 153, 142, 0.3);
    transform: translateY(-2px);
}

.back-button::before {
    content: '←';
    font-size: 1.1rem;
}

.edit-mode-button {
    padding: 1rem;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    color: #fff;
    flex: 1;
    box-shadow: 0 4px 10px rgba(17, 153, 142, 0.2);
    transition: all 0.3s ease;
    background: linear-gradient(90deg, #2ecc71 0%, #27ae60 100%);
}

.edit-mode-button.active {
    background: linear-gradient(90deg, #e74c3c 0%, #c0392b 100%);
}

.edit-mode-button:hover {
    box-shadow: 0 6px 15px rgba(17, 153, 142, 0.3);
    transform: translateY(-2px);
}

.delete-button {
    background: linear-gradient(90deg, #e74c3c 0%, #c0392b 100%);
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    color: #fff;
    transition: all 0.3s ease;
}

.delete-button:hover {
    box-shadow: 0 6px 15px rgba(231, 76, 60, 0.3);
    transform: translateY(-2px);
}

.update-button {
    background: linear-gradient(90deg, #11998e 0%, #38ef7d 100%);
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    color: #fff;
    transition: all 0.3s ease;
}

.update-button:hover {
    box-shadow: 0 6px 15px rgba(17, 153, 142, 0.3);
    transform: translateY(-2px);
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
    backdrop-filter: blur(3px);
}

.modal-content {
    background-color: #fff;
    border-radius: 12px;
    padding: 2rem;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    animation: modalFadeIn 0.4s;
}

@keyframes modalFadeIn {
    from { opacity: 0; transform: translateY(-40px); }
    to { opacity: 1; transform: translateY(0); }
}

.modal-content h3 {
    color: #333;
    margin-top: 0;
    margin-bottom: 1.5rem;
    position: relative;
    padding-bottom: 0.8rem;
    font-size: 1.5rem;
}

.modal-content h3::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #11998e 0%, #38ef7d 100%);
    border-radius: 2px;
}

.modal-content input {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #eee;
    border-radius: 8px;
    margin-bottom: 1rem;
    font-size: 0.95rem;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.modal-content input:focus {
    border-color: #11998e;
    outline: none;
    box-shadow: 0 0 0 3px rgba(17, 153, 142, 0.2);
}

.modal-content select {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #eee;
    border-radius: 8px;
    margin-bottom: 1rem;
    font-size: 0.95rem;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    background-color: white;
    cursor: pointer;
}

.modal-content select:focus {
    border-color: #11998e;
    outline: none;
    box-shadow: 0 0 0 3px rgba(17, 153, 142, 0.2);
}

.modal-buttons {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1rem;
}

.cancel-button {
    background-color: #f5f5f5;
    color: #666;
    border: 1px solid #eee;
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.cancel-button:hover {
    background-color: #e5e5e5;
}

.info-container {
    display: flex;
    gap: 2rem;
    height: 100%;
}

.group-details-box,
.members-box {
    flex: 1;
    background-color: #fff;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.07);
}

.group-details-box h3 {
    color: #333;
    margin-top: 0;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #11998e;
    font-size: 1.3rem;
}

.details-content p {
    margin: 0.8rem 0;
    line-height: 1.6;
    color: #555;
}

.members-list {
    height: calc(100% - 3rem);
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #11998e #f0f2f5;
}

.members-list::-webkit-scrollbar {
    width: 6px;
}

.members-list::-webkit-scrollbar-track {
    background: #f0f2f5;
}

.members-list::-webkit-scrollbar-thumb {
    background: #11998e;
    border-radius: 3px;
}

.member-item {
    background-color: white;
    padding: 0.8rem 1rem;
    margin-bottom: 0.8rem;
    border-radius: 8px;
    border: 1px solid #eee;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;
    overflow: hidden;
}

.member-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(to bottom, #11998e, #38ef7d);
}

.member-item:hover {
    transform: translateX(5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.no-members {
    color: #888;
    text-align: center;
    margin-top: 2rem;
    font-style: italic;
}

.members-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #11998e;
}

.members-header h3 {
    color: #333;
    margin: 0;
    font-size: 1.3rem;
}

.add-member-button {
    background: linear-gradient(90deg, #11998e 0%, #38ef7d 100%);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 4px 10px rgba(17, 153, 142, 0.2);
}

.add-member-button:hover {
    box-shadow: 0 6px 15px rgba(17, 153, 142, 0.3);
    transform: translateY(-2px);
}

.available-users {
    max-height: 300px;
    overflow-y: auto;
    margin: 1rem 0;
    scrollbar-width: thin;
    scrollbar-color: #11998e #f0f2f5;
}

.available-users::-webkit-scrollbar {
    width: 6px;
}

.available-users::-webkit-scrollbar-track {
    background: #f0f2f5;
}

.available-users::-webkit-scrollbar-thumb {
    background: #11998e;
    border-radius: 3px;
}

.user-list {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
}

.user-item {
    background-color: white;
    padding: 0.8rem 1rem;
    border-radius: 8px;
    border: 1px solid #eee;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
    position: relative;
    overflow: hidden;
}

.user-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #11998e 0%, #38ef7d 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.user-item:hover {
    background-color: #f9f9f9;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.user-item:hover::before {
    opacity: 1;
}

.no-users {
    color: #888;
    text-align: center;
    padding: 1rem;
    font-style: italic;
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
            showEditModal: false,
            showAddMemberModal: false,
            editMode: false,
            groups: [],
            searchQuery: '',
            memberSearchQuery: '',
            newGroup: {
                name: '',
                type: ''
            },
            editingGroup: {
                _id: null,
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
        toggleEditMode() {
            this.editMode = !this.editMode;
            if (!this.editMode) {
                this.closeEditModal();
            }
        },
        async selectGroup(group) {
            if (this.editMode) {
                this.editingGroup = { ...group };
                this.showEditModal = true;
                return;
            }
            
            this.selectedGroup = group;
            try {
                if (group.teacher) {
                    const teacherResponse = await axios.get(`http://localhost:1010/api/users/${group.teacher}`);
                    this.selectedGroup.teacher = teacherResponse.data.name;
                } else {
                    this.selectedGroup.teacher = 'Ingen lärare tilldelad';
                }
            } catch (error) {
                console.error('Error fetching teacher:', error);
                this.selectedGroup.teacher = 'Kunde inte hämta lärare';
            }
            await this.fetchGroupMembers(group._id);
        },
        closeEditModal() {
            this.showEditModal = false;
            this.editingGroup = {
                _id: null,
                name: '',
                type: ''
            };
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
                await axios.post(`http://localhost:1010/api/groups/${groupId}/${memberId}`);
                // Refresh the member list after successful addition
                await this.fetchGroupMembers(groupId);
                // Refresh available users list
                await this.fetchAvailableUsers();
            } catch (error) {
                console.error('Error adding member to group:', error);
            }
        },
        async updateGroup() {
            try {
                await axios.post(`http://localhost:1010/api/groups/${this.editingGroup._id}`, {
                    name: this.editingGroup.name,
                    type: this.editingGroup.type
                });
                
                // Update the group in the local list
                const index = this.groups.findIndex(g => g._id === this.editingGroup._id);
                if (index !== -1) {
                    this.groups[index] = { ...this.groups[index], ...this.editingGroup };
                }
                
                this.closeEditModal();
                await this.fetchGroups(); // Refresh the groups list
            } catch (error) {
                console.error('Error updating group:', error);
            }
        },
        async deleteGroup() {
            if (confirm('Är du säker på att du vill ta bort denna grupp?')) {
                try {
                    await axios.delete(`http://localhost:1010/api/groups/${this.editingGroup._id}`);
                    this.groups = this.groups.filter(g => g._id !== this.editingGroup._id);
                    this.closeEditModal();
                    if (this.selectedGroup?._id === this.editingGroup._id) {
                        this.selectedGroup = null;
                        this.selectedGroupMembers = [];
                    }
                } catch (error) {
                    console.error('Error deleting group:', error);
                }
            }
        }
    },
    mounted() {
        this.fetchGroups();
    }
};
</script>