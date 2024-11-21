<template>
    <div class="wraper">
        <div 
            class="components"
            @dragover.prevent
            @drop="onDropToRemove"
        >
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
                        v-for="scheduledItem in scheduledItems" 
                        :key="scheduledItem.id" 
                        class="scheduled-item"
                        :style="{ 
                            height: `${scheduledItem.minutes}px`,
                            top: `${scheduledItem.top}px` 
                        }"
                        draggable="true"
                        @dragstart="startDragScheduledItem($event, scheduledItem)"
                        @drag="handleDrag($event, scheduledItem)"
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
            </div>
        </div>
    </div>
</template>

<style scoped>
.wraper {
    display: flex;
    width: 100vw;
    height: 100vh;
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

.schedule {
    flex: 1;
    background-color: #4fc0e5;
    position: relative;
    overflow: auto;
    min-width: 800px;
}

.schedule-content {
    position: relative;
    min-height: 1440px; /* 24 hours * 60px */
}

.schedule-grid {
    position: absolute;
    left: 50px; /* Width of time markers */
    right: 0;
    top: 0;
    bottom: 0;
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

.grid-lines {
    position: absolute;
    left: 50px; /* Align with schedule-grid */
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
    width: 50px;
    border-right: 1px solid rgba(255, 255, 255, 0.3);
    background-color: #4fc0e5;
    z-index: 2;
}

.time-marker {
    height: 60px;
    border-top: 1px solid rgba(255, 255, 255, 0.3);
    padding: 2px;
    font-size: 0.8rem;
    color: white;
}
</style>

<script>
export default {
    data() {
        return {
            items: [
                { id: 1, name: 'Math Class' },
                { id: 2, name: 'Science Class' },
                { id: 3, name: 'English Class' },
            ],
            scheduledItems: [],
            resizing: null,
            startY: 0,
            startHeight: 0,
            startTop: 0,
            dragStartY: 0,
            dragStartTop: 0,
        }
    },
    mounted() {
        window.addEventListener('mousemove', this.handleResize)
        window.addEventListener('mouseup', this.stopResize)
    },
    beforeUnmount() {
        window.removeEventListener('mousemove', this.handleResize)
        window.removeEventListener('mouseup', this.stopResize)
    },
    methods: {
        startDrag(evt, item) {
            evt.dataTransfer.dropEffect = 'move'
            evt.dataTransfer.effectAllowed = 'move'
            evt.dataTransfer.setData('itemID', item.id)
            evt.dataTransfer.setData('type', 'new')
        },
        startDragScheduledItem(evt, item) {
            evt.dataTransfer.dropEffect = 'move'
            evt.dataTransfer.effectAllowed = 'move'
            evt.dataTransfer.setData('itemID', item.id)
            evt.dataTransfer.setData('type', 'scheduled')
            
            this.dragStartY = evt.clientY
            this.dragStartTop = item.top
        },
        onDrop(evt) {
            const itemID = parseInt(evt.dataTransfer.getData('itemID'))
            const type = evt.dataTransfer.getData('type')
            
            if (type === 'new') {
                const item = this.items.find(item => item.id === itemID)
                if (item) {
                    const scheduleRect = evt.currentTarget.getBoundingClientRect()
                    const dropY = evt.clientY - scheduleRect.top + evt.currentTarget.scrollTop
                    const snapY = Math.round(dropY / 15) * 15
                    const maxTop = 1440 - 60
                    const proposedTop = Math.min(Math.max(0, snapY), maxTop)

                    const newItem = {
                        ...item,
                        id: Date.now(),
                        minutes: 60,
                        top: proposedTop
                    }

                    this.scheduledItems.push(newItem)
                    this.handleCollisions(newItem, proposedTop)
                }
            } else if (type === 'scheduled') {
                const item = this.scheduledItems.find(item => item.id === itemID)
                if (item) {
                    const scheduleRect = evt.currentTarget.getBoundingClientRect()
                    const dropY = evt.clientY - scheduleRect.top + evt.currentTarget.scrollTop
                    const snapY = Math.round(dropY / 15) * 15
                    const maxTop = 1440 - item.minutes
                    const proposedTop = Math.min(Math.max(0, snapY), maxTop)
                    
                    this.handleCollisions(item, proposedTop)
                }
            }
        },
        onDropToRemove(evt) {
            const itemID = parseInt(evt.dataTransfer.getData('itemID'))
            const type = evt.dataTransfer.getData('type')
            
            if (type === 'scheduled') {
                const index = this.scheduledItems.findIndex(item => item.id === itemID)
                if (index !== -1) {
                    this.scheduledItems.splice(index, 1)
                }
            }
        },
        startResize(evt, item, direction) {
            this.resizing = { item, direction }
            this.startY = evt.clientY
            this.startHeight = item.minutes
            this.startTop = item.top || 0
            evt.preventDefault()
        },
        handleResize(evt) {
            if (!this.resizing) return
            
            const deltaY = evt.clientY - this.startY
            
            if (this.resizing.direction === 'bottom') {
                const newHeight = Math.max(60, this.startHeight + deltaY)
                this.resizing.item.minutes = Math.round(newHeight / 15) * 15
            } else {
                const newHeight = Math.max(60, this.startHeight - deltaY)
                const newTop = this.startTop + (this.startHeight - newHeight)
                this.resizing.item.minutes = Math.round(newHeight / 15) * 15
                this.resizing.item.top = Math.round(newTop / 15) * 15
            }
        },
        stopResize() {
            this.resizing = null
        },
        formatDuration(minutes) {
            const hours = Math.floor(minutes / 60)
            const mins = minutes % 60
            return `${hours}h ${mins}m`
        },
        formatHour(hour) {
            return `${hour.toString().padStart(2, '0')}:00`
        },
        getTimeRange(item) {
            const startMinutes = item.top
            const endMinutes = item.top + item.minutes
            
            const startHour = Math.floor(startMinutes / 60)
            const startMin = startMinutes % 60
            const endHour = Math.floor(endMinutes / 60)
            const endMin = endMinutes % 60

            return `${startHour.toString().padStart(2, '0')}:${startMin.toString().padStart(2, '0')} - ${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`
        },
        handleDrag(evt, item) {
            if (!evt.clientY) return
            
            const deltaY = evt.clientY - this.dragStartY
            const newTop = Math.max(0, this.dragStartTop + deltaY)
            const snappedTop = Math.round(newTop / 15) * 15
            
            const maxTop = 1440 - item.minutes
            const proposedTop = Math.min(snappedTop, maxTop)
            
            this.handleCollisions(item, proposedTop)
        },
        handleCollisions(movingItem, proposedTop) {
            if (!this.scheduledItems.includes(movingItem)) {
                movingItem.top = proposedTop
                return
            }

            const itemBottom = proposedTop + movingItem.minutes
            
            const overlappingItems = this.scheduledItems.filter(item => {
                if (item === movingItem) return false
                
                const otherTop = item.top
                const otherBottom = item.top + item.minutes
                
                return (proposedTop < otherBottom && itemBottom > otherTop)
            }).sort((a, b) => a.top - b.top)

            if (overlappingItems.length > 0) {
                if (proposedTop > movingItem.top) {
                    let currentBottom = itemBottom
                    overlappingItems.forEach(item => {
                        const maxTop = 1440 - item.minutes
                        item.top = Math.min(currentBottom, maxTop)
                        currentBottom = item.top + item.minutes
                    })
                } else {
                    let currentTop = proposedTop
                    [overlappingItems].reverse().forEach(item => {
                        item.top = Math.max(0, currentTop - item.minutes)
                        currentTop = item.top
                    })
                }
            }

            movingItem.top = proposedTop
        }
    }
}
</script>
