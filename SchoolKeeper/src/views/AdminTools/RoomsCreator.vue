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

.room-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.room-item {
    background-color: white;
    padding: 1rem;
    border-radius: 4px;
    border: 1px solid #ddd;
    cursor: pointer;
    transition: background-color 0.2s;
}

.room-item:hover {
    background-color: #f0f0f0;
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

/* Reuse the same button, modal, and other styles from GroupCreator */
.button-wrapper {
    padding: 1rem;
    border-top: 1px solid #ddd;
}

.create-button, .back-button, .add-equipment-button {
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
.back-button {
    width: 20%;
}
.create-button:hover, .back-button:hover, .add-equipment-button:hover {
    background-color: #216e87;
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

.room-details-box,
.equipment-box {
    flex: 1;
    background-color: #f5f5f5;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.equipment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #4fc0e5;
}

.equipment-item {
    background-color: white;
    padding: 0.75rem;
    margin-bottom: 0.5rem;
    border-radius: 4px;
    border: 1px solid #ddd;
}
</style>
<template>
    <div class="wraper">
        <!-- Left Sidebar -->
        <div class="components">
            <div class="components-header">
                <button @click="goBack" class="back-button">
                    Back
                </button>
                <h2>Rooms</h2>
            </div>

            <!-- Search and List in Sidebar -->
            <div class="sidebar-content">
                <input 
                    type="text" 
                    v-model="searchQuery" 
                    placeholder="Search Rooms..." 
                    class="search-bar"
                />
                <div class="room-list">
                    <div 
                        v-for="room in filteredRooms" 
                        :key="room.name"
                        class="room-item"
                        @click="selectRoom(room)"
                    >
                        <div class="room-info">
                            <strong>Name:</strong> {{ room.name }} <br />
                            <strong>Type:</strong> {{ room.type }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="button-wrapper">
                <button @click="openModal" class="create-button">Create New Room</button>
            </div>
        </div>

        <!-- Main Content Area -->
        <div class="main-container">
            <div class="main-header">
                <h2>Room Details</h2>
            </div>
            <div class="main-content">
                <div class="info-container">
                    <div class="room-details-box">
                        <h3>Room Information</h3>
                        <div class="details-content">
                            <p><strong>Name:</strong> {{ selectedRoom?.name || 'No room selected' }}</p>
                            <p><strong>Capacity:</strong> {{ selectedRoom?.capacity || 'N/A' }}</p>
                        </div>
                    </div>
                    <div class="equipment-box">
                        <div class="equipment-header">
                            <h3>Room Equipment</h3>
                            <button v-if="selectedRoom" @click="openAddEquipmentModal" class="add-equipment-button">
                                Add Equipment
                            </button>
                        </div>
                        <div class="equipment-list">
                            <div v-if="selectedRoomEquipment?.length" class="equipment-items">
                                <div v-for="item in selectedRoomEquipment" :key="item.id" class="equipment-item">
                                    {{ item.name }}
                                </div>
                            </div>
                            <p v-else class="no-equipment">No equipment in this room</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Create Room Modal -->
    <div v-if="showModal" class="modal">
        <div class="modal-content">
            <h3>Create Room</h3>
            <form @submit.prevent="createRoom">
                <input v-model="newRoom.name" placeholder="Room Name" required />
                <input 
                    type="number" 
                    v-model="newRoom.capacity" 
                    placeholder="Capacity" 
                    required 
                />
                <div class="modal-buttons">
                    <button type="submit" class="create-button">Create Room</button>
                    <button @click="closeModal" class="cancel-button">Cancel</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { useStorage } from "@vueuse/core";

export default {
    name: 'RoomsCreator',
    data() {
        return {
            currentUser: useStorage('currentUser', { name: '', access: '', class: '' }),
            showModal: false,
            rooms: [],
            searchQuery: '',
            newRoom: {
                name: '',
                capacity: null
            },
            selectedRoom: null,
            selectedRoomEquipment: []
        };
    },
    computed: {
        filteredRooms() {
            return this.rooms.filter(room => 
                room.name.toLowerCase().includes(this.searchQuery.toLowerCase())
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
            this.newRoom = { name: '', type: '', capacity: null };
        },
        selectRoom(room) {
            this.selectedRoom = room;
            // TODO: Fetch room equipment when API is ready
            this.selectedRoomEquipment = [];
        },
        createRoom() {
            // TODO: Implement room creation when API is ready
            this.closeModal();
        },
        async fetchRooms() {
            const response = await axios.get('http://localhost:1010/api/rooms');
            this.rooms = response.data;
            console.log(this.rooms);
        },
        async createRoom() {
            const response = await axios.post('http://localhost:1010/api/rooms', this.newRoom);
            this.rooms.push(response.data);
            this.closeModal();
            this.fetchRooms();
        }
    },
    mounted() {
        this.fetchRooms();
    }
};
</script>


