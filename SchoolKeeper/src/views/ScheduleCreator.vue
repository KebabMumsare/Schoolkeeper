<template>
    <div class="schedule-editor">
      <h2>Schedule Editor</h2>
      <div class="schedule-components">
        <h3>Components</h3>
        <div class="component-item" v-for="(component, index) in availableComponents" :key="index" @dragstart="onDragStart(component, $event)" draggable="true">
          {{ component.name }}
        </div>
      </div>
      <div class="schedule-container-wrapper">
        <div class="schedule-container" ref="scheduleContainer" @drop="onDrop($event)" @dragover.prevent>
          <h3>Schedule</h3>
          <div v-if="!isZoomedIn" class="hour-marker" v-for="hour in 24" :key="hour" :style="{ top: (hour * 60 * zoomScale) + 'px' }">
            {{ hour.toString().padStart(2, '0') + ':00' }}
          </div>
          <div v-for="(entry, index) in schedule" :key="index" class="schedule-entry" :style="{ top: (entry.positionY * zoomScale) + 'px', height: (entry.duration * zoomScale) + 'px' }" @mousedown="onEntryDragStart($event, index)">
            <div class="entry-content">
              <input type="text" v-model="entry.task" placeholder="Task description" />
              <button @click="removeEntry(index)">Remove</button>
              <div class="resize-handles">
                <div class="resize-top" @mousedown.stop="onResizeStart($event, index, 'top')"></div>
                <div class="resize-bottom" @mousedown.stop="onResizeStart($event, index, 'bottom')"></div>
              </div>
            </div>
            <div class="minute-indicator" v-if="entry.showAdjacentMinutes">
              <div class="minute-before">{{ formatTime((entry.positionY - 1) / zoomScale) }}</div>
              <div class="minute-after">{{ formatTime((entry.positionY + entry.duration + 1) / zoomScale) }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="zoom-controls">
        <button @click="zoomIn">Zoom In</button>
        <button @click="zoomOut">Zoom Out</button>
      </div>
      <button @click="saveSchedule">Save Schedule</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        availableComponents: [
          { name: 'Task Component', task: '', duration: 60 }
        ],
        schedule: [],
        dragComponent: null,
        resizeInfo: null,
        dragEntryInfo: null,
        isZoomedIn: false,
        zoomScale: 1,
      };
    },
    methods: {
      onDragStart(component, event) {
        this.dragComponent = component;
        event.dataTransfer.effectAllowed = 'move';
      },
      onDrop(event) {
        const dropY = (event.clientY - this.$refs.scheduleContainer.getBoundingClientRect().top) / this.zoomScale;
        const snappedDropY = Math.floor(dropY / 60) * 60;
        const newEntry = {
          ...this.dragComponent,
          positionY: snappedDropY,
          task: this.dragComponent.task,
          showAdjacentMinutes: true,
        };
        this.schedule.push(newEntry);
        this.isZoomedIn = true;
        this.generateAdjacentMinutes(newEntry);
      },
      removeEntry(index) {
        this.schedule.splice(index, 1);
        if (this.schedule.length === 0) {
          this.isZoomedIn = false;
        }
      },
      saveSchedule() {
        console.log('Schedule saved:', this.schedule);
      },
      onResizeStart(event, index, direction) {
        this.resizeInfo = {
          index,
          direction,
          startY: event.clientY,
          initialPosition: this.schedule[index].positionY,
          initialDuration: this.schedule[index].duration
        };
        document.addEventListener('mousemove', this.onResizing);
        document.addEventListener('mouseup', this.onResizeEnd);
      },
      onResizing(event) {
        if (this.resizeInfo) {
          const deltaY = (event.clientY - this.resizeInfo.startY) / this.zoomScale;
          const entry = this.schedule[this.resizeInfo.index];
          const increment = 1;
          if (this.resizeInfo.direction === 'top') {
            let newPosition = this.resizeInfo.initialPosition + deltaY;
            newPosition = Math.floor(newPosition / increment) * increment;
            const newDuration = Math.max(increment, this.resizeInfo.initialDuration - (newPosition - this.resizeInfo.initialPosition));
            entry.positionY = Math.max(0, newPosition);
            entry.duration = newDuration;
          } else if (this.resizeInfo.direction === 'bottom') {
            const newDuration = Math.max(increment, this.resizeInfo.initialDuration + deltaY);
            entry.duration = Math.floor(newDuration / increment) * increment;
          }
          this.generateAdjacentMinutes(entry);
          if (entry.positionY < 0) {
            entry.positionY = 0;
          }
        }
      },
      onResizeEnd() {
        document.removeEventListener('mousemove', this.onResizing);
        document.removeEventListener('mouseup', this.onResizeEnd);
        this.resizeInfo = null;
      },
      onEntryDragStart(event, index) {
        this.dragEntryInfo = {
          index,
          startY: event.clientY,
          initialPosition: this.schedule[index].positionY,
        };
        document.addEventListener('mousemove', this.onEntryDragging);
        document.addEventListener('mouseup', this.onEntryDragEnd);
      },
      onEntryDragging(event) {
        if (this.dragEntryInfo) {
          const deltaY = (event.clientY - this.dragEntryInfo.startY) / this.zoomScale;
          const entry = this.schedule[this.dragEntryInfo.index];
          let newPosition = this.dragEntryInfo.initialPosition + deltaY;
          newPosition = Math.floor(newPosition / 1) * 1;
          entry.positionY = Math.max(0, newPosition);
          this.generateAdjacentMinutes(entry);
        }
      },
      onEntryDragEnd() {
        document.removeEventListener('mousemove', this.onEntryDragging);
        document.removeEventListener('mouseup', this.onEntryDragEnd);
        this.dragEntryInfo = null;
      },
      zoomIn() {
        if (this.zoomScale < 5) {
          this.zoomScale += 0.5;
        }
      },
      zoomOut() {
        if (this.zoomScale > 1) {
          this.zoomScale -= 0.5;
        }
      },
      generateAdjacentMinutes(entry) {
        entry.showAdjacentMinutes = true;
      },
      formatTime(minute) {
        const hour = Math.floor(minute / 60);
        const min = minute % 60;
        return `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      }
    },
  };
  </script>
  
  <style scoped>
  .schedule-editor {
    display: flex;
    gap: 20px;
  }
  .schedule-components {
    width: 200px;
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
  }
  .component-item {
    background: #e0e0e0;
    padding: 10px;
    margin-bottom: 10px;
    cursor: grab;
  }
  .schedule-container-wrapper {
    overflow-y: auto;
    height: 800px; /* Set visible height for scrolling */
    border: 1px solid #ddd;
    margin-bottom: 20px;
  }
  .schedule-container {
    position: relative;
    flex-grow: 1;
    height: 1440px;
    overflow: hidden;
    padding: 10px;
    transform-origin: top left; /* For scaling from the top-left corner */
  }
  .hour-marker {
    position: absolute;
    left: 0;
    width: 100%;
    font-size: 12px;
    color: #999;
    border-top: 1px solid #ccc;
  }
  .schedule-entry {
    position: absolute;
    left: 0;
    right: 0;
    background: #f0f0f0;
    border: 1px solid #ccc;
    padding: 10px;
    cursor: grab;
  }
  .entry-content {
    position: relative;
  }
  .resize-handles {
    position: absolute;
    left: -10px;
    right: -10px;
    height: 100%;
  }
  .resize-top, .resize-bottom {
    height: 5px;
    background: #ccc;
    cursor: ns-resize;
  }
  .resize-top {
    position: absolute;
    top: -3px;
    left: 0;
    right: 0;
  }
  .resize-bottom {
    position: absolute;
    bottom: -3px;
    left: 0;
    right: 0;
  }
  .minute-indicator {
    display: flex;
    justify-content: space-between;
    margin-top: 5px;
    font-size: 12px;
    color: #666;
  }
  .zoom-controls {
    margin-bottom: 20px;
  }
  button {
    padding: 5px 10px;
    cursor: pointer;
  }
  </style>