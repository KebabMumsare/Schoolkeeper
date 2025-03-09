<style>
.wraper {
    display: flex;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}

.components {
    width: 20vw;
    background-color: #f5f5f5;
    position: relative;
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
    background-color: #216e87;
    padding: 10px 0;
    flex-shrink: 0;
}

.day {
    flex: 1;
    text-align: center;
    cursor: pointer;
    color: white;
    font-weight: bold;
}

.schedule {
    flex: 1;
    background-color: #4fc0e5;
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
    min-width: 800px;
    scrollbar-width: none;
}

.schedule-content {
    position: relative;
    min-height: 1440px; /* 24 hours * 60px */
    scrollbar-width: none;
}

.schedule-content::-webkit-scrollbar {
    width: 0 !important;
    display: none !important;
}

.schedule-grid {
    position: absolute;
    left: 50px;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 2;
}

.button-wrapper {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 20px;
    display: flex;
    justify-content: center;
}

.draggable-items {
    padding: 1rem;
}

.draggable-item {
    background-color: white;
    padding: 0.5rem;
    margin: 0.5rem 0;
    border-radius: 0.25rem;
    cursor: move;
    border: 1px solid #ddd;
}

.grid-lines {
    position: absolute;
    left: 0;
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
    background-color: rgba(255, 255, 255, 0.3);
}

.time-markers {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    pointer-events: none;
}

.time-marker {
    height: 60px;
    border-top: 1px solid rgba(255, 255, 255, 0.3);
    padding: 2px 8px;
    font-size: 0.8rem;
    color: white;
    width: 50px;
    background-color: #4fc0e5;
    z-index: 1;
}

.day.selected {
    background-color: #1d5d73;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    border: 2px solid rgba(0, 0, 0, 0.3);
}

.schedule-controls {
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    gap: 10px;
    padding: 10px;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 10;
}

.schedule-dropdown {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    background-color: white;
}

.schedule-save-btn {
    padding: 8px 16px;
    background-color: #216e87;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.schedule-save-btn:hover {
    background-color: #1d5d73;
}

.components-header {
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    border-bottom: 1px solid #ddd;
}

.components-header h2 {
    margin: 0;
    color: #216e87;
}

.back-button {
    padding: 0.5rem 1rem;
    background-color: #216e87;
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

.item-form {
    padding: 1rem;
    border-top: 1px solid #ddd;
    margin-top: 1rem;
}

.item-form input {
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 0.25rem;
}

.add-item-button {
    background-color: #216e87;
    color: white;
    border: none;
    border-radius: 0.25rem;
    padding: 0.5rem;
    cursor: pointer;
    width: 100%;
    margin-top: 0.5rem;
}

.add-item-button:hover {
    background-color: #1d5d73;
}

.scheduled-item {
    position: absolute;
    left: 10px;
    right: 10px;
    background-color: white;
    padding: 0.5rem;
    border-radius: 0.25rem;
    min-height: 60px;
    cursor: move;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.scheduled-item-content {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 8px 0;
    min-height: 44px;
}

.time-range {
    font-size: 0.9rem;
    color: #666;
    white-space: nowrap;
}

.item-name {
    font-weight: 500;
}

.resize-handle {
    position: absolute;
    left: 0;
    right: 0;
    height: 8px;
    background-color: #ddd;
    cursor: ns-resize;
}

.resize-handle.top {
    top: 0;
    border-radius: 0.25rem 0.25rem 0 0;
}

.resize-handle.bottom {
    bottom: 0;
    border-radius: 0 0 0.25rem 0.25rem;
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
                    Back
                </button>
                <h2>Schedule Creator</h2>
            </div>

            <div class="item-form">
                <input 
                    v-model="newItemName" 
                    placeholder="Enter item name" 
                    @keyup.enter="addItem"
                />
                <button @click="addItem" class="add-item-button">Add Item</button>
            </div>

            <div class="draggable-items">
                <div 
                    v-for="item in items" 
                    :key="item.id"
                    class="draggable-item"
                    draggable="true"
                    @dragstart="startDrag($event, item)"
                >
                    {{ item.name }}
                </div>
            </div>
            
            <div class="button-wrapper">
                <button @click="createSchedule" class="create-button">Create Schedule</button>
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
                    {{ day }}
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
                                height: `${scheduledItem.minutes}px`,
                                top: `${scheduledItem.top}px` 
                            }"
                            draggable="true"
                            @dragstart="startDragScheduledItem($event, scheduledItem)"
                        >
                            <div 
                                class="resize-handle top"
                                @mousedown="startResize($event, scheduledItem, 'top')"
                            ></div>
                            
                            <div class="scheduled-item-content">
                                <div class="time-range">
                                    {{ getTimeRange(scheduledItem) }}
                                </div>
                                <div class="item-name">{{ scheduledItem.name }}</div>
                            </div>

                            <div 
                                class="resize-handle bottom"
                                @mousedown="startResize($event, scheduledItem, 'bottom')"
                            ></div>
                        </div>
                    </div>
                    
                    <div class="schedule-controls">
                        <select v-model="selectedGroupId" required>
                            <option value="" disabled>Välj grupp</option>
                            <option v-for="group in availableGroups" :key="group._id" :value="group._id">
                                {{ group.name }}
                            </option>
                        </select>
                        <button @click="saveSchedule" class="schedule-save-btn">
                            Save Schedule
                        </button>
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
                Monday: [],
                Tuesday: [],
                Wednesday: [],
                Thursday: [],
                Friday: []
            },
            selectedDay: 'Monday',
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            selectedGroupId: '',
            availableGroups: [],
            resizing: false,
            currentItem: null,
            resizingDirection: null,
            resizingStartY: 0,
            resizingStartHeight: 0,
            resizingStartTop: 0,
            dragStartY: 0
        }
    },
    mounted() {
        this.fetchGroups();
        window.addEventListener('mousemove', this.handleResize);
        window.addEventListener('mouseup', this.stopResize);
    },
    beforeUnmount() {
        window.removeEventListener('mousemove', this.handleResize);
        window.removeEventListener('mouseup', this.stopResize);
    },
    methods: {
        addItem() {
            if (this.newItemName.trim()) {
                this.items.push({
                    id: this.nextItemId++,
                    name: this.newItemName.trim()
                });
                this.newItemName = '';
            }
        },
        startDrag(evt, item) {
            evt.dataTransfer.dropEffect = 'move';
            evt.dataTransfer.effectAllowed = 'move';
            evt.dataTransfer.setData('itemID', item.id);
            evt.dataTransfer.setData('type', 'new');
        },
        startDragScheduledItem(evt, item) {
            evt.dataTransfer.dropEffect = 'move';
            evt.dataTransfer.effectAllowed = 'move';
            evt.dataTransfer.setData('itemID', item.id.toString());
            evt.dataTransfer.setData('type', 'scheduled');
            
            const rect = evt.target.getBoundingClientRect();
            this.dragStartY = evt.clientY - rect.top;
        },
        onDrop(evt) {
            const itemID = parseInt(evt.dataTransfer.getData('itemID'));
            const type = evt.dataTransfer.getData('type');
            
            if (type === 'new') {
                const item = this.items.find(item => item.id === itemID);
                if (item) {
                    const scheduleRect = evt.currentTarget.getBoundingClientRect();
                    const dropY = evt.clientY - scheduleRect.top + evt.currentTarget.scrollTop;
                    const snapY = Math.round(dropY / 5) * 5;
                    
                    this.schedules[this.selectedDay].push({
                        id: Date.now(),
                        name: item.name,
                        minutes: 60,
                        top: Math.max(0, snapY - 30) // Center the item at drop point
                    });
                }
            } else if (type === 'scheduled') {
                const item = this.schedules[this.selectedDay].find(item => item.id === itemID);
                if (item) {
                    const scheduleRect = evt.currentTarget.getBoundingClientRect();
                    const dropY = evt.clientY - scheduleRect.top + evt.currentTarget.scrollTop;
                    const adjustedDropY = dropY - this.dragStartY;
                    const snapY = Math.round(adjustedDropY / 5) * 5;
                    const maxTop = 1440 - item.minutes;
                    
                    item.top = Math.min(Math.max(0, snapY), maxTop);
                }
            }
        },
        onDropToRemove(evt) {
            const itemID = parseInt(evt.dataTransfer.getData('itemID'));
            const type = evt.dataTransfer.getData('type');
            
            if (type === 'scheduled') {
                const index = this.schedules[this.selectedDay].findIndex(item => item.id === itemID);
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
            this.resizingStartHeight = item.minutes;
            this.resizingStartTop = item.top;
            evt.preventDefault();
        },
        handleResize(evt) {
            if (!this.resizing || !this.currentItem) return;

            const deltaY = evt.clientY - this.resizingStartY;

            if (this.resizingDirection === 'bottom') {
                let newHeight = Math.round((this.resizingStartHeight + deltaY) / 5) * 5;
                newHeight = Math.max(60, newHeight);
                
                if (this.currentItem.top + newHeight <= 1440) {
                    this.currentItem.minutes = newHeight;
                }
            } else {
                let newTop = Math.round((this.resizingStartTop + deltaY) / 5) * 5;
                let newHeight = this.resizingStartHeight + (this.resizingStartTop - newTop);
                
                if (newHeight < 60) {
                    newTop = this.currentItem.top + this.currentItem.minutes - 60;
                    newHeight = 60;
                }

                if (newTop >= 0) {
                    this.currentItem.top = newTop;
                    this.currentItem.minutes = newHeight;
                }
            }
        },
        stopResize() {
            this.resizing = false;
            this.currentItem = null;
        },
        getTimeRange(item) {
            const startMinutes = item.top;
            const endMinutes = item.top + item.minutes;
            
            const startHour = Math.floor(startMinutes / 60);
            const startMin = startMinutes % 60;
            const endHour = Math.floor(endMinutes / 60);
            const endMin = endMinutes % 60;

            return `${startHour.toString().padStart(2, '0')}:${startMin.toString().padStart(2, '0')} - ${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;
        },
        selectDay(day) {
            this.selectedDay = day;
        },
        formatHour(hour) {
            return `${hour.toString().padStart(2, '0')}:00`;
        },
        goBack() {
            this.$router.push('/admintools');
        },
        createSchedule() {
            // Reset schedules
            this.schedules = {
                Monday: [],
                Tuesday: [],
                Wednesday: [],
                Thursday: [],
                Friday: []
            };
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
        async saveSchedule() {
            if (!this.selectedGroupId) {
                alert('Please select a group first');
                return;
            }

            try {
                const formattedSchedules = {};
                for (const [day, items] of Object.entries(this.schedules)) {
                    formattedSchedules[day] = items.map(item => ({
                        name: item.name,
                        top: item.top,
                        minutes: item.minutes
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
        }
    }
}
</script>
