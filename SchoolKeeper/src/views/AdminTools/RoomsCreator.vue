<style scoped>
.wraper {
    display: flex;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: #f0f2f5;
    background-image: linear-gradient(135deg, #f5f7fa 0%, #e4efe9 100%);
}

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
    scrollbar-color: #834d9b #f0f2f5;
}

.sidebar-content::-webkit-scrollbar {
    width: 6px;
}

.sidebar-content::-webkit-scrollbar-track {
    background: #f0f2f5;
}

.sidebar-content::-webkit-scrollbar-thumb {
    background: #834d9b;
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
    border-color: #834d9b;
    outline: none;
    box-shadow: 0 0 0 3px rgba(131, 77, 155, 0.2);
}

.room-list {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
}

.room-item {
    background-color: white;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid #eee;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
    position: relative;
    overflow: hidden;
}

.room-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #834d9b 0%, #d04ed6 100%);
    transition: height 0.3s ease;
}

.room-item:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
    border-color: #834d9b;
}

.room-item:hover::before {
    height: 6px;
}

.main-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: #fff;
}

.main-header {
    padding: 1.2rem;
    background: linear-gradient(90deg, #834d9b 0%, #d04ed6 100%);
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
    scrollbar-color: #834d9b #f0f2f5;
}

.main-content::-webkit-scrollbar {
    width: 6px;
}

.main-content::-webkit-scrollbar-track {
    background: #f0f2f5;
}

.main-content::-webkit-scrollbar-thumb {
    background: #834d9b;
    border-radius: 3px;
}

.button-wrapper {
    padding: 1.2rem;
    border-top: 1px solid #eee;
    background: linear-gradient(to top, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.8));
}

.create-button, .back-button, .add-equipment-button {
    background: linear-gradient(90deg, #834d9b 0%, #d04ed6 100%);
    padding: 1rem;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    color: #fff;
    width: 100%;
    box-shadow: 0 4px 10px rgba(131, 77, 155, 0.2);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.back-button {
    padding: 0.6rem 1rem;
    width: auto;
    display: flex;
    align-items: center;
    gap: 6px;
    border-radius: 6px;
    font-size: 0.9rem;
}

.back-button::before {
    content: '←';
    font-size: 1.1rem;
}

.create-button:hover, .back-button:hover, .add-equipment-button:hover {
    box-shadow: 0 6px 15px rgba(131, 77, 155, 0.3);
    transform: translateY(-2px);
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
    background: linear-gradient(90deg, #834d9b 0%, #d04ed6 100%);
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
    border-color: #834d9b;
    outline: none;
    box-shadow: 0 0 0 3px rgba(131, 77, 155, 0.2);
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

.room-details-box,
.equipment-box {
    flex: 1;
    background-color: #fff;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.07);
}

.equipment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #834d9b;
}

.equipment-header h3 {
    color: #333;
    margin: 0;
    font-size: 1.3rem;
}

.equipment-item {
    background-color: white;
    padding: 0.8rem 1rem;
    margin-bottom: 0.8rem;
    border-radius: 8px;
    border: 1px solid #eee;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;
    overflow: hidden;
}

.equipment-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(to bottom, #834d9b, #d04ed6);
}

.equipment-item:hover {
    transform: translateX(5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.no-equipment {
    color: #888;
    text-align: center;
    margin-top: 2rem;
    font-style: italic;
}

.room-details-box h3 {
    color: #333;
    margin-top: 0;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #834d9b;
    font-size: 1.3rem;
}

.details-content p {
    margin: 0.8rem 0;
    line-height: 1.6;
    color: #555;
}
</style>
<template>
    <div class="wraper">
        <div class="components">
            <div class="components-header">
                <button @click="goBack" class="back-button">
                    Tillbaka
                </button>
                <h2>Salar</h2>
            </div>

            <div class="sidebar-content">
                <input 
                    type="text" 
                    v-model="searchQuery" 
                    placeholder="Sök salar..." 
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
                            <strong>Namn:</strong> {{ room.name }} <br />
                            <strong>Kapacitet:</strong> {{ room.capacity }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="button-wrapper">
                <button @click="openModal" class="create-button">Skapa ny sal</button>
            </div>
        </div>

        <div class="main-container">
            <div class="main-header">
                <h2>Saldetaljer</h2>
            </div>
            <div class="main-content">
                <div class="info-container">
                    <div class="room-details-box">
                        <h3>Salinformation</h3>
                        <div class="details-content">
                            <p><strong>Namn:</strong> {{ selectedRoom?.name || 'Ingen sal vald' }}</p>
                            <p><strong>Kapacitet:</strong> {{ selectedRoom?.capacity || 'Ej tillgänglig' }}</p>
                        </div>
                    </div>
                    <div class="equipment-box">
                        <div class="equipment-header">
                            <h3>Utrustning</h3>
                            <button v-if="selectedRoom" @click="openAddEquipmentModal" class="add-equipment-button">
                                Lägg till utrustning
                            </button>
                        </div>
                        <div class="equipment-list">
                            <div v-if="selectedRoomEquipment?.length" class="equipment-items">
                                <div v-for="item in selectedRoomEquipment" :key="item.id" class="equipment-item">
                                    {{ item.name }}
                                </div>
                            </div>
                            <p v-else class="no-equipment">Ingen utrustning i denna sal</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-if="showModal" class="modal">
        <div class="modal-content">
            <h3>Skapa sal</h3>
            <form @submit.prevent="createRoom">
                <input v-model="newRoom.name" placeholder="Salnamn" required />
                <input 
                    type="number" 
                    v-model="newRoom.capacity" 
                    placeholder="Kapacitet" 
                    required 
                />
                <div class="modal-buttons">
                    <button type="submit" class="create-button">Skapa sal</button>
                    <button @click="closeModal" class="cancel-button">Avbryt</button>
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
            this.selectedRoomEquipment = [];
        },
        async fetchRooms() {
            const response = await axios.get('http://localhost:1010/api/rooms');
            this.rooms = response.data;
        },
        async createRoom() {
            const response = await axios.post('http://localhost:1010/api/rooms', this.newRoom);
            this.rooms.push(response.data);
            this.closeModal();
            this.fetchRooms();
        },
        openAddEquipmentModal() {
            alert('Funktionen för att lägga till utrustning är inte implementerad ännu.');
        }
    },
    mounted() {
        this.fetchRooms();
    }
};
</script>


