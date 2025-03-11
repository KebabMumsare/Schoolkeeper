<style>
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
    box-shadow: 4px 0 15px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    z-index: 10;
}

.create-button {
    background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
    padding: 0.8rem;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    color: #fff;
    width: 100%;
    box-shadow: 0 4px 10px rgba(71, 118, 230, 0.2);
    transition: all 0.3s ease;
}

.create-button:hover {
    box-shadow: 0 6px 15px rgba(71, 118, 230, 0.3);
    transform: translateY(-2px);
}

.schedule-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.days-header {
    display: flex;
    justify-content: space-around;
    background: linear-gradient(90deg, #216e87 0%, #4fc0e5 100%);
    padding: 0;
    flex-shrink: 0;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    z-index: 5;
}

.day {
    flex: 1;
    text-align: center;
    cursor: pointer;
    color: white;
    font-weight: 600;
    padding: 15px 0;
    margin: 0;
    transition: all 0.3s ease;
    font-size: 1.1rem;
}

.day:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.day.selected {
    background-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.schedule {
    flex: 1;
    background-color: white;
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
    min-width: 800px;
    scrollbar-width: thin;
    scrollbar-color: #4fc0e5 #f0f2f5;
    box-shadow: inset 0 4px 10px rgba(0, 0, 0, 0.05);
}

.schedule::-webkit-scrollbar {
    width: 8px;
}

.schedule::-webkit-scrollbar-track {
    background: #f0f2f5;
}

.schedule::-webkit-scrollbar-thumb {
    background: #4fc0e5;
    border-radius: 4px;
}

.schedule-content {
    position: relative;
    min-height: 1440px; /* 24 hours * 60px */
}

.schedule-grid {
    position: absolute;
    left: 70px;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 1;
}

.button-wrapper {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 20px;
    display: flex;
    justify-content: center;
    background: linear-gradient(to top, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.8));
    border-top: 1px solid #eee;
}

.draggable-items {
    padding: 1rem;
    flex: 1;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #4fc0e5 #f0f2f5;
}

.draggable-items::-webkit-scrollbar {
    width: 6px;
}

.draggable-items::-webkit-scrollbar-track {
    background: #f0f2f5;
}

.draggable-items::-webkit-scrollbar-thumb {
    background: #4fc0e5;
    border-radius: 3px;
}

.draggable-item {
    background-color: white;
    padding: 0.8rem;
    margin: 0.8rem 0;
    border-radius: 8px;
    cursor: move;
    border: 1px solid #eee;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    font-weight: 500;
    color: #333;
}

.draggable-item:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
    border-color: #4fc0e5;
}

.grid-lines {
    position: absolute;
    left: 70px;
    right: 0;
    top: 0;
    height: 100%;
    pointer-events: none;
}

.grid-line {
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    background-color: rgba(0, 0, 0, 0.05);
}

.time-markers {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 70px;
    pointer-events: none;
    z-index: 2;
}

.time-marker {
    height: 60px;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    padding: 2px 8px;
    font-size: 0.8rem;
    color: #666;
    width: 70px;
    background-color: #f9f9f9;
    z-index: 1;
    text-align: right;
    padding-right: 10px;
    position: relative;
    font-weight: 500;
}

.schedule-controls {
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    gap: 10px;
    padding: 15px;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    z-index: 10;
}

.schedule-dropdown {
    padding: 10px 15px;
    border: 1px solid #eee;
    border-radius: 8px;
    font-size: 0.95rem;
    background-color: white;
    color: #333;
    font-weight: 500;
    transition: all 0.3s ease;
}

.schedule-dropdown:focus {
    border-color: #4fc0e5;
    outline: none;
    box-shadow: 0 0 0 3px rgba(79, 192, 229, 0.2);
}

.schedule-save-btn {
    padding: 10px 20px;
    background: linear-gradient(90deg, #216e87 0%, #4fc0e5 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 10px rgba(33, 110, 135, 0.2);
}

.schedule-save-btn:hover {
    box-shadow: 0 6px 15px rgba(33, 110, 135, 0.3);
    transform: translateY(-2px);
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
    color: #216e87;
    font-size: 1.4rem;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.back-button {
    padding: 0.6rem 1rem;
    background: linear-gradient(90deg, #216e87 0%, #4fc0e5 100%);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(33, 110, 135, 0.2);
    display: flex;
    align-items: center;
    gap: 6px;
}

.back-button:hover {
    box-shadow: 0 4px 12px rgba(33, 110, 135, 0.3);
    transform: translateY(-2px);
}

.back-button::before {
    content: none;
}

.item-form {
    padding: 1.2rem;
    border-bottom: 1px solid #eee;
}

.item-form input {
    width: 100%;
    padding: 0.8rem;
    margin-bottom: 0.8rem;
    border: 1px solid #eee;
    border-radius: 8px;
    font-size: 0.95rem;
    transition: all 0.3s ease;
}

.item-form input:focus {
    border-color: #4fc0e5;
    outline: none;
    box-shadow: 0 0 0 3px rgba(79, 192, 229, 0.2);
}

.add-item-button {
    background: linear-gradient(90deg, #36D1DC 0%, #5B86E5 100%);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.8rem;
    cursor: pointer;
    width: 100%;
    margin-top: 0.5rem;
    font-size: 0.95rem;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 10px rgba(91, 134, 229, 0.2);
}

.add-item-button:hover {
    background: linear-gradient(90deg, #28c7d2 0%, #4a75d9 100%);
    box-shadow: 0 6px 15px rgba(91, 134, 229, 0.3);
    transform: translateY(-2px);
}

.scheduled-item {
    position: absolute;
    left: 70px;
    right: 20px;
    background-color: white;
    padding: 0.8rem;
    border-radius: 8px;
    min-height: 60px;
    cursor: move;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    z-index: 3;
    display: flex;
    align-items: center;
    border-left: 4px solid #4fc0e5;
    transition: box-shadow 0.3s ease;
}

.scheduled-item:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.scheduled-item-content {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.header-row {
    display: flex;
    align-items: center;
    gap: 10px;
}

.time-range {
    white-space: nowrap;
    font-weight: 600;
    color: #216e87;
    font-size: 0.9rem;
    background-color: rgba(79, 192, 229, 0.1);
    padding: 3px 8px;
    border-radius: 4px;
}

.item-details {
    display: flex;
    gap: 12px;
    font-size: 0.85rem;
    color: #666;
    margin-top: 6px;
}

.item-name {
    margin-left: 8px;
    font-weight: 600;
    color: #333;
}

.item-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.resize-handle {
    position: absolute;
    left: 0;
    right: 0;
    height: 8px;
    background-color: rgba(0, 0, 0, 0.05);
    cursor: ns-resize;
    transition: background-color 0.3s ease;
}

.resize-handle:hover {
    background-color: rgba(79, 192, 229, 0.3);
}

.resize-handle.top {
    top: 0;
    border-radius: 8px 8px 0 0;
}

.resize-handle.bottom {
    bottom: 0;
    border-radius: 0 0 8px 8px;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(3px);
}

.modal-content {
    background-color: white;
    padding: 2rem;
    border-radius: 12px;
    width: 450px;
    max-width: 90%;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    animation: modalFadeIn 0.4s;
}

@keyframes modalFadeIn {
    from { opacity: 0; transform: translateY(-40px); }
    to { opacity: 1; transform: translateY(0); }
}

.modal-content h3 {
    margin-top: 0;
    color: #216e87;
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    position: relative;
    padding-bottom: 0.8rem;
}

.modal-content h3::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #216e87 0%, #4fc0e5 100%);
    border-radius: 2px;
}

.modal-form {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
}

.form-group label {
    font-weight: 600;
    color: #333;
    font-size: 0.95rem;
}

.form-group input,
.form-group select {
    padding: 0.8rem;
    border: 1px solid #eee;
    border-radius: 8px;
    font-size: 0.95rem;
    width: 100%;
    transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
    border-color: #4fc0e5;
    outline: none;
    box-shadow: 0 0 0 3px rgba(79, 192, 229, 0.2);
}

.form-group select {
    background-color: white;
    cursor: pointer;
}

.modal-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1.5rem;
}

.cancel-button {
    padding: 0.8rem 1.5rem;
    background-color: #f5f5f5;
    border: 1px solid #eee;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    color: #666;
    transition: all 0.3s ease;
}

.cancel-button:hover {
    background-color: #e5e5e5;
}

.submit-button {
    padding: 0.8rem 1.5rem;
    background: linear-gradient(90deg, #216e87 0%, #4fc0e5 100%);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 10px rgba(33, 110, 135, 0.2);
}

.submit-button:hover {
    box-shadow: 0 6px 15px rgba(33, 110, 135, 0.3);
    transform: translateY(-2px);
}
</style>

<template>
    <div class="wraper">
        <div 
            class="components"
            @dragover.prevent
            @drop="onDropToRemove"
        >
            <div class="components-header">
                <button @click="goBack" class="back-button">
                    <span>←</span> Tillbaka
                </button>
                <h2>Schemaläggare</h2>
            </div>

            <div class="item-form">
                <button @click="addItem" class="add-item-button">Lägg till objekt</button>
            </div>

            <div class="draggable-items">
                <div 
                    v-for="preset in schedulePresets" 
                    :key="preset._id"
                    class="draggable-item"
                    draggable="true"
                    @dragstart="startDrag($event, preset)"
                >
                    {{ preset.lecture }}
                </div>
            </div>
            
            <div class="button-wrapper">
                <button @click="createSchedule" class="create-button">Skapa schema</button>
            </div>
        </div>
        <div class="schedule-container">
            <div class="days-header">
                <div 
                    v-for="(day, index) in days" 
                    :key="index" 
                    class="day" 
                    :class="{ selected: selectedDay === day }"
                    @click="selectDay(day)"
                >
                    {{ getDayName(day) }}
                </div>
            </div>
            <div 
                class="schedule"
                @dragover.prevent
                @drop="onDrop"
            >
                <div class="schedule-content">
                    <div class="grid-lines">
                        <div v-for="hour in 24" :key="hour" class="grid-line" 
                            :style="{ top: `${(hour - 1) * 60}px` }">
                        </div>
                    </div>

                    <div class="time-markers">
                        <div v-for="hour in 24" :key="hour" class="time-marker">
                            {{ formatHour(hour - 1) }}
                        </div>
                    </div>

                    <div class="schedule-grid">
                        <div 
                            v-for="scheduledItem in schedules[selectedDay]" 
                            :key="scheduledItem.id" 
                            class="scheduled-item"
                            :style="{ 
                                height: `${scheduledItem.duration}px`,
                                top: `${scheduledItem.startMinutes}px` 
                            }"
                            draggable="true"
                            @dragstart="startDragScheduledItem($event, scheduledItem)"
                        >
                            <div 
                                class="resize-handle top"
                                @mousedown="startResize($event, scheduledItem, 'top')"
                            ></div>
                            
                            <div class="scheduled-item-content">
                                <div class="header-row">
                                    <div class="time-range">{{ getTimeRange(scheduledItem) }}</div>
                                    <div class="item-name">{{ scheduledItem.name }}</div>
                                </div>
                                <div class="item-details">
                                    <span v-if="scheduledItem.teacher">Lärare: {{ scheduledItem.teacher }}</span>
                                    <span v-if="scheduledItem.room">Sal: {{ scheduledItem.room }}</span>
                                </div>
                            </div>

                            <div 
                                class="resize-handle bottom"
                                @mousedown="startResize($event, scheduledItem, 'bottom')"
                            ></div>
                        </div>
                    </div>
                    
                    <div class="schedule-controls">
                        <select v-model="selectedGroupId" class="schedule-dropdown" required>
                            <option value="" disabled>Välj grupp</option>
                            <option v-for="group in availableGroups" :key="group._id" :value="group._id">
                                {{ group.name }}
                            </option>
                        </select>
                        <button @click="saveSchedule" class="schedule-save-btn">
                            Spara schema
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showModal" class="modal-overlay">
            <div class="modal-content">
                <h3>Skapa nytt objekt</h3>
                <div class="modal-form">
                    <div class="form-group">
                        <label>Namn:</label>
                        <input 
                            v-model="newItem.name" 
                            placeholder="Ange objektnamn"
                        />
                    </div>
                    <div class="form-group">
                        <label>Lärare:</label>
                        <select v-model="newItem.teacher">
                            <option value="">Välj lärare</option>
                            <option 
                                v-for="teacher in teachersList" 
                                :key="teacher" 
                                :value="teacher"
                            >
                                {{ teacher.name }}
                            </option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Sal:</label>
                        <select v-model="newItem.room">
                            <option value="">Välj sal</option>
                            <option 
                                v-for="room in roomsList" 
                                :key="room" 
                                :value="room"
                            >
                                {{ room.name }}
                            </option>
                        </select>
                    </div>
                    <div class="modal-buttons">
                        <button @click="closeModal" class="cancel-button">Avbryt</button>
                        <button @click="createSchedulePreset" class="submit-button">Skapa</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'ScheduleCreatorJ',
    data() {
        return {
            items: [],
            newItemName: '',
            nextItemId: 1,
            schedules: {
                monday: [],
                tuesday: [],
                wednesday: [],
                thursday: [],
                friday: []
            },
            selectedDay: 'monday',
            days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
            dayTranslations: {
                'monday': 'Måndag',
                'tuesday': 'Tisdag',
                'wednesday': 'Onsdag',
                'thursday': 'Torsdag',
                'friday': 'Fredag'
            },
            selectedGroupId: '',
            availableGroups: [],
            resizing: false,
            currentItem: null,
            resizingDirection: null,
            resizingStartY: 0,
            resizingStartHeight: 0,
            resizingStartTop: 0,
            dragStartY: 0,
            showModal: false,
            newItem: {
                name: '',
                teacher: '',
                room: ''
            },
            schedulePresets: [],
            teachersList: [],
            roomsList: []
        }
    },
    mounted() {
        this.fetchGroups();
        this.fetchTeachers();
        this.fetchRooms();
        window.addEventListener('mousemove', this.handleResize);
        window.addEventListener('mouseup', this.stopResize);
    },
    beforeUnmount() {
        window.removeEventListener('mousemove', this.handleResize);
        window.removeEventListener('mouseup', this.stopResize);
    },
    methods: {
        addItem() {
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
            this.newItem = {
                name: '',
                teacher: '',
                room: ''
            };
        },
        submitItem() {
            if (this.newItem.name.trim()) {
                this.items.push({
                    name: this.newItem.name,
                    teacher: this.newItem.teacher,
                    room: this.newItem.room
                });
                this.closeModal();
            }
        },
        startDrag(evt, item) {
            evt.dataTransfer.dropEffect = 'move';
            evt.dataTransfer.effectAllowed = 'move';
            evt.dataTransfer.setData('itemData', JSON.stringify(item));
            evt.dataTransfer.setData('type', 'new');
        },
        startDragScheduledItem(evt, item) {
            evt.dataTransfer.dropEffect = 'move';
            evt.dataTransfer.effectAllowed = 'move';
            evt.dataTransfer.setData('itemData', JSON.stringify(item));
            evt.dataTransfer.setData('type', 'scheduled');
            
            const rect = evt.target.getBoundingClientRect();
            this.dragStartY = evt.clientY - rect.top;
        },
        async onDrop(evt) {
            const type = evt.dataTransfer.getData('type');
            const itemData = JSON.parse(evt.dataTransfer.getData('itemData'));
            
            if (type === 'new') {
                const scheduleRect = evt.currentTarget.getBoundingClientRect();
                const dropY = evt.clientY - scheduleRect.top + evt.currentTarget.scrollTop;
                const snapY = Math.round(dropY / 5) * 5;
                
                console.log('Item Data:', itemData);
                console.log('Teacher ID:', itemData.teacher);
                const teacherData = await this.fetchTeacher(itemData.teacher);
                console.log('Fetched Teacher Data:', teacherData);
                const roomData = await this.fetchRoom(itemData.room);
                
                this.schedules[this.selectedDay].push({
                    id: Date.now(),
                    name: itemData.lecture,
                    teacher: teacherData ? teacherData.name : itemData.teacher,
                    teacherId: teacherData ? teacherData._id : itemData.teacher,
                    room: roomData ? roomData.name : itemData.room,
                    roomId: roomData ? roomData._id : itemData.room,
                    duration: 60,
                    startMinutes: Math.max(0, snapY - 30)
                });
            } else if (type === 'scheduled') {
                const item = this.schedules[this.selectedDay].find(item => item.id === itemData.id);
                if (item) {
                    const scheduleRect = evt.currentTarget.getBoundingClientRect();
                    const dropY = evt.clientY - scheduleRect.top + evt.currentTarget.scrollTop;
                    const adjustedDropY = dropY - this.dragStartY;
                    const snapY = Math.round(adjustedDropY / 5) * 5;
                    const maxTop = 1440 - item.duration;
                    
                    item.startMinutes = Math.min(Math.max(0, snapY), maxTop);
                }
            }
        },
        onDropToRemove(evt) {
            const type = evt.dataTransfer.getData('type');
            const itemData = JSON.parse(evt.dataTransfer.getData('itemData'));
            
            if (type === 'scheduled') {
                const index = this.schedules[this.selectedDay].findIndex(item => item.id === itemData.id);
                if (index !== -1) {
                    this.schedules[this.selectedDay].splice(index, 1);
                }
            }
        },
        startResize(evt, item, direction) {
            this.resizing = true;
            this.currentItem = item;
            this.resizingDirection = direction;
            this.resizingStartY = evt.clientY;
            this.resizingStartHeight = item.duration;
            this.resizingStartTop = item.startMinutes;
            evt.preventDefault();
        },
        handleResize(evt) {
            if (!this.resizing || !this.currentItem) return;

            const deltaY = evt.clientY - this.resizingStartY;

            if (this.resizingDirection === 'bottom') {
                let newHeight = Math.round((this.resizingStartHeight + deltaY) / 5) * 5;
                newHeight = Math.max(60, newHeight);
                
                if (this.currentItem.startMinutes + newHeight <= 1440) {
                    this.currentItem.duration = newHeight;
                }
            } else {
                let newTop = Math.round((this.resizingStartTop + deltaY) / 5) * 5;
                let newHeight = this.resizingStartHeight + (this.resizingStartTop - newTop);
                
                if (newHeight < 60) {
                    newTop = this.currentItem.startMinutes + this.currentItem.duration - 60;
                    newHeight = 60;
                }

                if (newTop >= 0) {
                    this.currentItem.startMinutes = newTop;
                    this.currentItem.duration = newHeight;
                }
            }
        },
        stopResize() {
            this.resizing = false;
            this.currentItem = null;
        },
        getTimeRange(item) {
            const startMinutes = item.startMinutes;
            const endMinutes = item.startMinutes + item.duration;
            
            const startHour = Math.floor(startMinutes / 60);
            const startMin = startMinutes % 60;
            const endHour = Math.floor(endMinutes / 60);
            const endMin = endMinutes % 60;

            return `${startHour.toString().padStart(2, '0')}:${startMin.toString().padStart(2, '0')} - ${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;
        },
        selectDay(day) {
            this.selectedDay = day;
            console.log(day);
        },
        formatHour(hour) {
            return `${hour.toString().padStart(2, '0')}:00`;
        },
        goBack() {
            this.$router.push('/admintools');
        },
        createSchedule() {
            if (this.selectedGroupId) {
                this.fetchGroupSchedule(this.selectedGroupId);
            } else {
                this.schedules = {
                    monday: [],
                    tuesday: [],
                    wednesday: [],
                    thursday: [],
                    friday: []
                };
            }
        },
        async fetchGroups() {
            try {
                const response = await axios.get('http://localhost:1010/api/groups');
                this.availableGroups = response.data;
            } catch (error) {
                console.error('Error fetching groups:', error);
                this.availableGroups = [];
            }
        },
        async fetchTeacher(teacherId) {
            try {
                const response = await axios.get(`http://localhost:1010/api/teacher/${teacherId}`);
                return response.data;
            } catch (error) {
                console.error('Error fetching teacher:', error);
                return null;
            }
        },
        async fetchTeachers() {
            try {
                const response = await axios.get('http://localhost:1010/api/teachers');
                this.teachersList = response.data;
            } catch (error) {
                console.error('Error fetching teachers:', error);
                this.teachersList = [];
            }
        },
        async fetchRoom(roomId) {
            try {
                const response = await axios.get(`http://localhost:1010/api/rooms/${roomId}`);
                return response.data;
            } catch (error) {
                console.error('Error fetching room:', error); 
                return null;
            }
        },
        async fetchRooms() {
            try {
                const response = await axios.get('http://localhost:1010/api/rooms');
                this.roomsList = response.data;
            } catch (error) {
                console.error('Error fetching rooms:', error);
                this.roomsList = [];
            }
        },
        async fetchGroupSchedule(groupId, day) {
            try {
                // Reset schedules first
                this.clearSchedules();

                // Fetch schedule for each day
                const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
                
                for (const day of days) {
                    const response = await axios.get(
                        `http://localhost:1010/api/schema/${day}/${groupId}`
                    );
                    
                    // Convert server data to schedule format
                    const formattedItems = [];
                    
                    for (const item of response.data) {
                        // Fetch teacher and room names
                        let teacherData = null;
                        let roomData = null;
                        
                        if (item.teacher) {
                            teacherData = await this.fetchTeacher(item.teacher);
                        }
                        
                        if (item.room) {
                            roomData = await this.fetchRoom(item.room);
                        }
                        
                        formattedItems.push({
                            id: Date.now() + Math.random(), // Generate unique ID
                            name: item.lecture,
                            duration: parseInt(item.duration), // Ensure duration is a number
                            startMinutes: parseInt(item.startMinutes), // Ensure startMinutes is a number
                            teacher: teacherData ? teacherData.name : '',
                            teacherId: item.teacher || '',
                            room: roomData ? roomData.name : '',
                            roomId: item.room || ''
                        });
                    }

                    // Use lowercase day to match the selectedDay state
                    this.schedules[day] = formattedItems;
                }

                console.log('Loaded schedules:', this.schedules);
            } catch (error) {
                console.error('Error loading schedule:', error);
                this.clearSchedules();
            }
        },
        clearSchedules() {
            this.schedules = {
                monday: [],
                tuesday: [],
                wednesday: [],
                thursday: [],
                friday: []
            };
        },
        async saveSchedule() {
            if (!this.selectedGroupId) {
                alert('Please select a group first');
                return;
            }

            try {
                const formattedSchedules = {};
                for (const [day, items] of Object.entries(this.schedules)) {
                    formattedSchedules[day.toLowerCase()] = items.map(item => ({
                        lecture: item.name,
                        teacher: item.teacherId,
                        room: item.roomId,
                        startMinutes: item.startMinutes,
                        duration: item.duration
                    }));
                }

                const response = await axios.post('http://localhost:1010/api/schedule', {
                    selectedGroupId: this.selectedGroupId,
                    schedules: formattedSchedules
                });

                if (response.status === 201) {
                    alert('Schedule saved successfully!');
                } else {
                    throw new Error('Failed to save schedule');
                }
            } catch (error) {
                console.error('Error saving schedule:', error);
                alert('Error saving schedule. Please try again.');
            }
        },
        async createSchedulePreset() {
            if (!this.selectedGroupId) {
                alert('Please select a group first');
                return;
            }
            
            try {
                const payload = {
                    group: this.selectedGroupId,
                    lecture: this.newItem.name,
                    teacher: this.newItem.teacher,
                    room: this.newItem.room
                };
                const response = await axios.post('http://localhost:1010/api/schedulePreset', payload);
                this.fetchSchedulePresets();
                this.closeModal();
            } catch (error) {
                console.error('Error creating schedule preset:', error);
                alert('Error creating schedule preset. Please try again.');
            }
        },
        async fetchSchedulePresets() {
            const response = await axios.get(`http://localhost:1010/api/schedulePresets/${this.selectedGroupId}`);
            console.log(response);
            this.schedulePresets = response.data;
        },
        getDayName(day) {
            return this.dayTranslations[day] || day;
        }
    },
    watch: {
        selectedGroupId(newId) {
            if (newId) {
                this.fetchGroupSchedule(newId);
                this.fetchSchedulePresets();
            }
        }
    }
}
</script>
