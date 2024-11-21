<template>
    <div class="schedule-container">
        <div class="drop-zone" @drop="onDrop($event, 1)" @dragenter="onDragEnter($event, 1)" @dragover.prevent>
            <div v-for="item in getList(1)" 
                :key="item.id" 
                class="drop-element" 
                @mousedown="startResize(item)"
                @mousemove="onResize($event, item)"
                @mouseup="stopResize()"
                :style="{ height: item.height }"
                :ref="'item-' + item.id">
                <div class="drag-handle" 
                     draggable="true"
                     @dragstart="startDrag($event, item)">⋮⋮</div>
                {{ item.title }}
                <br>
                {{ item.time }}
            </div>
        </div>
        <div class="drop-zone" @drop="onDrop($event, 2)" @dragenter="onDragEnter($event, 2)" @dragover.prevent>
            <div v-for="item in getList(2)" 
                :key="item.id" 
                class="drop-element" 
                @mousedown="startResize(item)"
                @mousemove="onResize($event, item)"
                @mouseup="stopResize()"
                :style="{ height: item.height }"
                :ref="'item-' + item.id">
                <div class="drag-handle"
                     draggable="true"
                     @dragstart="startDrag($event, item)">⋮⋮</div>
                {{ item.title }}
                <br>
                {{ item.time }}
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
export default {
    name: 'SchedualCreatorTest',
    setup() {
        const items = ref([
            { id: 1, title: 'Item 1', list: 1, time: '1h 0m', height: '100px', position: 0 },
            { id: 2, title: 'Item 2', list: 1, time: '1h 0m', height: '100px', position: 1 },
            { id: 3, title: 'Item 3', list: 2, time: '1h 0m', height: '100px', position: 2 },
            { id: 4, title: 'Item 4', list: 2, time: '1h 0m', height: '100px', position: 3 },
            { id: 5, title: 'Item 5', list: 2, time: '1h 0m', height: '100px', position: 4 },
        ]);

        // Base height represents 1 hour
        const baseHeight = 100; // pixels
        const isResizing = ref(false);
        const currentItem = ref(null);

        const getList = (list) => {
            // Return items in their original order using position property
            return items.value
                .filter((item) => item.list === list)
                .sort((a, b) => a.position - b.position);
        }

        const startDrag = (event, item) => {
            event.dataTransfer.dropEffect = 'move';
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('itemID', item.id);
        }

        const onDrop = (event, list) => {
            const itemID = event.dataTransfer.getData('itemID');
            const item = items.value.find((item) => item.id == itemID);
            
            // If dropping in the same list, don't change anything
            if (item.list === list) return;
            
            // Get the highest position in the target list
            const maxPosition = Math.max(
                -1,
                ...items.value
                    .filter(i => i.list === list)
                    .map(i => i.position)
            );
            
            // Set the item's position to be after the last item in the target list
            item.position = maxPosition + 1;
            item.list = list;
        }

        const startResize = (item) => {
            // Only start resize if clicking near the bottom of the element
            const mouseY = event.clientY;
            const rect = event.target.getBoundingClientRect();
            const bottomThreshold = rect.bottom - 20; // 20px from bottom

            if (mouseY > bottomThreshold) {
                isResizing.value = true;
                currentItem.value = item;
            }
        }

        const stopResize = () => {
            if (isResizing.value && currentItem.value) {
                // Save the final height when stopping resize
                const element = document.querySelector(`[ref="item-${currentItem.value.id}"]`);
                if (element) {
                    currentItem.value.height = `${element.offsetHeight}px`;
                }
            }
            isResizing.value = false;
            currentItem.value = null;
        }

        const onResize = (event, item) => {
            if (!isResizing.value || item !== currentItem.value) return;
            
            const element = event.target;
            const height = element.offsetHeight;
            
            // Convert height to minutes first
            const totalMinutes = Math.round((height / baseHeight) * 60);
            // Round to nearest 5 minutes
            const roundedMinutes = Math.round(totalMinutes / 5) * 5;
            
            const hours = Math.floor(roundedMinutes / 60);
            const minutes = roundedMinutes % 60;
            
            // Update the item's time and height
            item.time = `${hours}h ${minutes}m`;
            item.height = `${height}px`;
        }

        return {
            getList,
            startDrag,
            onDrop,
            onResize,
            startResize,
            stopResize,
        }
    }
}
</script>

<style scoped>
.schedule-container {
    display: flex;
    gap: 20px;
    justify-content: center;
}

.drop-zone {
    text-align: center;
    border: 1px solid #ccc;
    width: 8rem;
    padding: 5px;
    min-height: 10px;
    background-color: #f5f5f5;
    border-radius: 4px;
}

.drop-element {
    position: relative;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 8px;
    padding-left: 25px; /* Make room for drag handle */
    margin: 5px 0;
    resize: vertical;
    overflow: auto;
    min-height: 80px;
    background-color: white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.drag-handle {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 20px;
    cursor: move;
    color: #666;
    font-size: 12px;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f8f8f8;
    border-right: 1px solid #ddd;
    border-radius: 4px 0 0 4px;
}

.drag-handle:hover {
    background-color: #eee;
}

.drop-element:hover {
    border-color: #999;
}

/* Add a visual indicator for the resize area */
.drop-element::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    background-color: #f0f0f0;
    cursor: ns-resize;
}

.drop-element:hover::after {
    background-color: #ddd;
}
</style>
