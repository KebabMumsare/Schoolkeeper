<template>
    <NavBar site="start" :currentUser="currentUser" />
    <main class="Schedule">
        <div class="Container">
            <h3>Schema</h3>
        </div>
        
        <!-- Teacher's Lectures Section (only visible to teachers) -->
        <div v-if="isTeacher" class="teacher-lectures">
            <h4>Mina Lektioner</h4>
            <div class="teacher-lectures-container">
                <div v-if="teacherLectures.length > 0" class="teacher-lectures-list">
                    <div v-for="(lecture, index) in teacherLectures" :key="index" 
                         class="teacher-lecture-item"
                         :class="{
                             'status-current': lecture.locationStatus === 'current',
                             'status-changed': lecture.locationStatus === 'change',
                             'status-custom': lecture.locationStatus === 'custom',
                             'status-canceled': lecture.locationStatus === 'canceled'
                         }">
                        <div class="teacher-lecture-day">{{ getDayName(lecture.day) }}</div>
                        <div class="teacher-lecture-time">{{ lecture.time }}</div>
                        <div class="teacher-lecture-name">{{ lecture.lecture }}</div>
                        <div class="teacher-lecture-group">{{ lecture.group }}</div>
                        <div class="teacher-lecture-location">
                            <select v-model="lecture.locationStatus" class="location-select" @click.stop @change="handleLocationChange(lecture)">
                                <option value="current">Nuvarande sal</option>
                                <option value="change">Ändra sal</option>
                                <option value="custom">Valfri plats</option>
                                <option value="canceled">Inställd</option>
                            </select>
                            
                            <!--KOLLA HÄR JESPER-->
                            <select 
                                v-if="lecture.locationStatus === 'change'" 
                                v-model="lecture.newRoom" 
                                class="room-select"
                                @click.stop
                                @change="saveLocationChange(lecture)"
                            >
                                <option value="" disabled selected>Välj sal</option>
                                <option v-for="room in availableRooms" :key="room.id" :value="room.id">
                                    {{ room.name }}
                                </option>
                            </select>
                        </div>
                        <div class="teacher-lecture-actions">
                            <span class="attendance-icon" @click.stop="openAttendanceModal(lecture)">📋</span>
                        </div>
                    </div>
                </div>
                <div v-else class="no-lectures">
                    Du har inga lektioner tilldelade.
                </div>
            </div>
        </div>
        
        <!-- Regular schedule layout (only visible to non-teachers) -->
        <div v-if="!isTeacher" class="schedule-layout">
            <div class="today-schedule">
                <h4>Dagens schema ({{ resolveDay(currentDayIndex) }})</h4>
                <div class="schedule-timeline">
                    <div v-for="(lecture, index) in todaySchedule" :key="index" class="lecture-item">
                        <div class="lecture-time">{{ lecture.time }}</div>
                        <div class="lecture-name" 
                             :class="{ 'current-lecture': isCurrentLecture(lecture) }" 
                             @click="hasAttendancePermission ? openAttendanceModal(lecture) : null"
                             :style="{ cursor: hasAttendancePermission ? 'pointer' : 'default' }">
                            {{ lecture.lecture }}
                            <span v-if="hasAttendancePermission" class="attendance-icon">📋</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="weekly-schedule">
                <div class="schedule-container">
                    <div class="column" v-for="(day, i) in schema" :key="i">
                        <div class="day-header" :class="{ 'current-day': isCurrentDay(i) }">
                            {{ resolveDay(i) }}
                        </div>
                        <div class="time-slot" v-for="lecture in day" :key="lecture.id"
                             :class="{ 'current-lecture': isCurrentDay(i) && isCurrentLecture(lecture) }"
                             @click="hasAttendancePermission ? openAttendanceModal(lecture) : null"
                             :style="{ cursor: hasAttendancePermission ? 'pointer' : 'default' }">
                            {{ lecture.time }} <br> 
                            <span>
                                 {{ lecture.lecture }}
                                 <span v-if="hasAttendancePermission" class="attendance-icon small">📋</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Test controls (only visible to non-teachers) -->
        <div v-if="!isTeacher" class="test-controls">
            <label for="test-day">Dag:</label>
            <select id="test-day" v-model="testDay" @change="updateSchedules">
                <option value="">Idag</option>
                <option v-for="(day, index) in ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag']" :key="index" :value="index">
                    {{ day }}
                </option>
            </select>
        </div>
        
        <!-- Attendance Modal -->
        <div v-if="showAttendanceModal" class="attendance-modal">
            <div class="attendance-modal-content">
                <div class="attendance-modal-header">
                    <h3>Närvaro för {{ selectedLecture.lecture }}</h3>
                    <button @click="closeAttendanceModal" class="close-button">&times;</button>
                </div>
                <div class="attendance-modal-body">
                    <p><strong>Tid:</strong> {{ selectedLecture.time }}</p>
                    <div class="attendance-list">
                        <div v-for="(student, index) in students" :key="index" 
                             class="student-attendance-item"
                             :class="{
                                 'status-present': student.attendanceStatus === 'present',
                                 'status-absent': student.attendanceStatus === 'absent',
                                 'status-late': student.attendanceStatus === 'late',
                                 'status-registered-absence': student.attendanceStatus === 'registered-absence'
                             }"
                             @click="toggleAttendanceStatus(student)">
                            <span class="student-name">{{ student.name }}</span>
                            <div class="attendance-actions">
                                <div class="status-indicator">
                                    <span v-if="student.attendanceStatus === 'present'" class="status-text">Närvarande</span>
                                    <span v-else-if="student.attendanceStatus === 'absent'" class="status-text">Frånvarande</span>
                                    <span v-else-if="student.attendanceStatus === 'late'" class="status-text">Sen ankomst</span>
                                    <span v-else-if="student.attendanceStatus === 'registered-absence'" class="status-text">Anmäld frånvaro</span>
                                </div>
                            </div>
                            <!-- Late minutes input - always visible -->
                            <div class="lateness-input-container">
                                <input 
                                    type="number" 
                                    v-model="student.lateMinutes" 
                                    placeholder="Min" 
                                    min="0"
                                    max="60"
                                    @click.stop
                                    @input="handleLatenessInput(student)"
                                    :disabled="student.attendanceStatus === 'registered-absence'"
                                    :class="{ 'input-disabled': student.attendanceStatus === 'registered-absence' }"
                                >
                            </div>
                        </div>
                    </div>
                    <div class="attendance-legend">
                        <div class="legend-item">
                            <div class="legend-color status-present"></div>
                            <span>Närvarande</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color status-late"></div>
                            <span>Sen ankomst</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color status-absent"></div>
                            <span>Frånvarande</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color status-registered-absence"></div>
                            <span>Anmäld frånvaro</span>
                        </div>
                    </div>
                </div>
                <div class="attendance-modal-footer">
                    <button @click="saveAttendance" class="save-button">Spara närvaro</button>
                    <button @click="closeAttendanceModal" class="cancel-button">Avbryt</button>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
.Schedule {
    border-radius: 8px;
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
    background-color: #f8f9fa;
    padding: 0.75rem;
    max-width: 2000px;
    width: 95%;
    margin: 100px auto 0 auto;
    position: relative;
    z-index: 1;
}

.schedule-layout {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}

.today-schedule {
    flex: 1;
    background-color: #ffffff;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.weekly-schedule {
    flex: 2;
}

.additional-info {
    flex: 1;
    background-color: #ffffff;
    border-radius: 1vh;
    padding: 1vh;
    box-shadow: 0 2vh 4vh rgba(0, 0, 0, 0.1);
}

.schedule-container {
    display: flex;
    justify-content: space-between;
    margin-top: 0.3vh;
    border-radius: 1vh;
    box-shadow: 0 3vh 6vh rgba(0, 0, 0, 0.1);
    background-color: #ffffff;
    padding: 0.3vh;
    gap: 1vh;
    min-height: 43vh;
}

.column {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
}

.day-header {
    background-color: #c7d3e0;
    color: #000000;
    font-weight: bold;
    text-align: center;
    padding: 6px;
    border-bottom: 1px solid #dee2e6;
    margin-bottom: 3px;
    font-size: 0.85rem;
    white-space: nowrap;
    border-radius: 4px 4px 0 0;
}

.day-header.current-day {
    background-color: #6597c9;
    color: #000000;
    font-weight: bold;
}

.time-slot {
    padding: 6px;
    text-align: center;
    border-bottom: 1px solid #dee2e6;
    background-color: #f8f9fa;
    transition: background-color 0.2s ease;
    font-size: 0.75rem;
    min-height: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    word-wrap: break-word;
    hyphens: auto;
}

.time-slot:last-child {
    border-bottom: none;
    border-radius: 0 0 4px 4px;
}

.time-slot:hover {
    background-color: #e9ecef;
}

.name,
.section {
    margin-bottom: 0.3rem;
    font-size: 0.85rem;
}

button {
    padding: 6px;
    font-size: 0.85rem;
}

.current-datetime {
    margin-bottom: 1rem;
    font-size: 0.9rem;
    color: #333;
}

.test-controls {
    margin-top: 1rem;
    font-size: 0.9rem;
}

.test-controls select {
    margin-left: 0.5rem;
}

.schedule-timeline {
    position: relative;
    margin-top: 1vh;
    display: flex;
    flex-direction: column;
}

.lecture-item {
    display: flex;
    align-items: center;
    margin-bottom: 1vh;
    position: relative;
    min-height: 5vh;
    padding: 1vh;
    box-shadow: 0 0.5vh 1vh rgba(0, 0, 0, 0.1);
}

.lecture-time {
    width: auto;
    text-align: left;
    font-weight: bold;
    padding-right: 1vh;
    margin-right: auto;
}

.lecture-name {
    flex-grow: 1;
    padding: 0.5vh;
    background-color: #f0f0f0;
    border-radius: 4px;
    word-break: break-word;
    overflow: hidden;
    text-align: center;
}

.current-time-indicator {
    position: absolute;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #ff4d4f;
    pointer-events: none;
}

.test-list {
    max-height: 300px; /* Adjust this value as needed */
    overflow-y: auto;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    padding: 10px;
    background-color: #f8f9fa;
}

.test-list h5 {
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 1rem;
}

.test-list ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.test-item {
    display: flex;
    flex-direction: column;
    padding: 10px;
    border-bottom: 1px solid #dee2e6;
}

.test-item:last-child {
    border-bottom: none;
}

.test-subject {
    font-weight: bold;
    color: #007bff;
}

.test-date {
    font-size: 0.9rem;
    color: #6c757d;
}

.test-name {
    font-size: 0.9rem;
}

.upcoming-tests {
    display: flex;
    align-items: center;
}

.bullet-point {
    width: 10px;
    height: 10px;
    background-color: #ff0000;
    border-radius: 50%;
    margin-left: 8px;
}

/* Add these new styles for the attendance modal */
.attendance-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 200;
    padding-top: 60px;
    box-sizing: border-box;
}

.attendance-modal-content {
    background-color: #fff;
    border-radius: 8px;
    width: 80%;
    max-width: 800px;
    max-height: 85vh;
    overflow-y: auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    position: relative;
    margin-top: 20px;
}

.attendance-modal-header {
    position: sticky;
    top: 0;
    background-color: #fff;
    padding: 15px;
    border-bottom: 1px solid #ddd;
    border-radius: 8px 8px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 10;
}

.attendance-modal-header h3 {
    margin: 0;
    font-size: 1.4rem;
    font-weight: 500;
}

.close-button {
    background: none;
    border: none;
    font-size: 28px;
    color: white;
    cursor: pointer;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.2s;
}

.close-button:hover {
    background-color: rgba(255, 255, 255, 0.2);
}

.attendance-modal-body {
    padding: 25px;
    overflow-y: auto;
    flex: 1;
}

.attendance-list {
    margin-top: 15px;
    position: relative;
    padding-right: 100px; /* Add space for the lateness input */
}

.student-attendance-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative; /* Add this to position the lateness input */
}

.student-name {
    font-weight: bold;
    font-size: 1.1rem;
}

.attendance-options select {
    padding: 8px 12px;
    border-radius: 4px;
    border: 1px solid #ccc;
    font-size: 1rem;
    min-width: 180px;
}

.attendance-modal-footer {
    position: sticky;
    bottom: 0;
    background-color: #fff;
    padding: 15px;
    border-top: 1px solid #ddd;
    border-radius: 0 0 8px 8px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    z-index: 10;
}

.save-button {
    padding: 8px 16px;
    background-color: #4fc0e5;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.save-button:hover {
    background-color: #3da1b5;
}

.cancel-button {
    padding: 8px 16px;
    background-color: #f0f0f0;
    color: #333;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.cancel-button:hover {
    background-color: #e0e0e0;
}

.lecture-name, .time-slot {
    cursor: pointer;
}

.lecture-name:hover, .time-slot:hover {
    background-color: #e9ecef;
}

/* Add this to prevent body scrolling when modal is open */
body.modal-open {
    overflow: hidden;
}

/* Add these new styles for the attendance icon */
.attendance-icon {
    font-size: 0.9rem;
    margin-left: 5px;
    opacity: 0.7;
}

.attendance-icon.small {
    font-size: 0.8rem;
}

/* Optional: Add a hover effect to indicate clickable items for teachers/admins */
.lecture-name:hover .attendance-icon,
.time-slot:hover .attendance-icon {
    opacity: 1;
}

/* Styles for teacher's lectures section */
.teacher-lectures {
    margin-bottom: 20px;
    background-color: #ffffff;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 98%;
    margin-left: auto;
    margin-right: auto;
}

.teacher-lectures h4 {
    margin-top: 0;
    margin-bottom: 15px;
    color: #333;
    font-size: 1.2rem;
}

.teacher-lectures-container {
    max-height: 75vh;
    overflow-y: auto;
    border: 1px solid #eee;
    border-radius: 4px;
    padding-bottom: 40px;
}

.teacher-lecture-item {
    display: grid;
    grid-template-columns: minmax(80px, 120px) minmax(70px, 100px) minmax(150px, 1fr) minmax(80px, 120px) minmax(150px, 180px) minmax(40px, 60px);
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
    transition: background-color 0.2s;
    gap: 15px;
}

.teacher-lecture-item:hover {
    background-color: #f5f9ff;
}

.teacher-lecture-day {
    font-weight: bold;
    font-size: 1.1rem;
}

.teacher-lecture-time {
    color: #555;
    font-size: 1.1rem;
}

.teacher-lecture-name {
    font-weight: 500;
    font-size: 1.1rem;
}

.teacher-lecture-group {
    color: #666;
    font-size: 1rem;
}

.teacher-lecture-location {
    position: relative;
    z-index: 10;
}

.location-select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #fff;
    font-size: 0.9rem;
}

.room-select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #fff;
    font-size: 0.9rem;
    margin-top: 5px;
}

/* Style for the room select when a room is selected */
.status-changed .room-select {
    border-color: #FFEB3B;
    background-color: rgba(255, 235, 59, 0.1);
}

.teacher-lecture-actions {
    text-align: right;
}

.no-lectures {
    padding: 20px;
    text-align: center;
    color: #666;
}

.status-present {
    background-color: rgba(76, 175, 80, 0.2);
    border-left: 5px solid #4CAF50;
}

.status-absent {
    background-color: rgba(244, 67, 54, 0.2);
    border-left: 5px solid #F44336;
}

.status-registered-absence {
    background-color: rgba(33, 150, 243, 0.2);
    border-left: 5px solid #2196F3;
}

.status-late {
    background-color: rgba(255, 193, 7, 0.2);
    border-left: 5px solid #FFC107;
}

.attendance-actions {
    display: flex;
    align-items: center;
    gap: 15px;
}

.status-indicator {
    min-width: 120px;
    text-align: right;
}

.status-text {
    font-size: 0.9rem;
    font-weight: 500;
}

.lateness-input-container {
    position: absolute;
    right: -70px; /* Position it outside the row */
    top: 50%;
    transform: translateY(-50%);
    z-index: 5;
}

.lateness-input-container input {
    width: 60px;
    padding: 5px 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 0.9rem;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.input-disabled {
    opacity: 0.5;
    background-color: #f5f5f5;
}

.attendance-legend {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 25px;
    padding-top: 15px;
    border-top: 1px solid #eee;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
}

.legend-color {
    width: 20px;
    height: 20px;
    border-radius: 4px;
}

/* Style for canceled lectures */
.teacher-lecture-item.canceled {
    opacity: 0.6;
    text-decoration: line-through;
    background-color: rgba(244, 67, 54, 0.05);
}

/* Style for custom location lectures */
.teacher-lecture-item.custom-location {
    background-color: rgba(33, 150, 243, 0.05);
}

.room-selector-overlay {
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

.room-selector-dialog {
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    width: 400px;
    max-width: 90%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.room-selector-dialog h4 {
    margin-top: 0;
    margin-bottom: 15px;
    text-align: center;
}

.room-options {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 20px;
}

.room-option {
    padding: 12px;
    text-align: center;
    background-color: #f5f5f5;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.room-option:hover {
    background-color: #e0e0e0;
}

.room-selector-actions {
    display: flex;
    justify-content: flex-end;
}

/* Style for changed room lectures */
.teacher-lecture-item.changed-room {
    background-color: rgba(33, 150, 243, 0.05);
}

.teacher-lecture-item.changed-room .teacher-lecture-location::after {
    content: "✓";
    color: #4CAF50;
    margin-left: 5px;
}

/* Status colors for lecture locations */
.teacher-lecture-item.status-current {
    background-color: #ffffff;
    border-left: 5px solid transparent;
}

.teacher-lecture-item.status-changed {
    background-color: rgba(255, 235, 59, 0.2);
    border-left: 5px solid #FFEB3B; /* Yellow */
}

.teacher-lecture-item.status-custom {
    background-color: rgba(255, 152, 0, 0.2);
    border-left: 5px solid #FF9800; /* Orange */
}

.teacher-lecture-item.status-canceled {
    background-color: rgba(244, 67, 54, 0.2);
    border-left: 5px solid #F44336; /* Red */
    text-decoration: line-through;
    opacity: 0.7;
}

/* Style the select element based on status */
.status-changed .location-select {
    border-color: #FFEB3B;
}

.status-custom .location-select {
    border-color: #FF9800;
}

.status-canceled .location-select {
    border-color: #F44336;
}

/* Ensure the navbar has proper z-index */
:deep(.navbar) {
    z-index: 100;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
}

/* Add more space to the Container element that holds the "Schema" heading */
.Container {
    margin-bottom: 15px;
}

/* Add media queries for smaller screens */
@media (max-width: 1200px) {
    .teacher-lecture-item {
        grid-template-columns: minmax(80px, 100px) minmax(60px, 80px) minmax(120px, 1fr) minmax(70px, 100px) minmax(120px, 150px) minmax(40px, 50px);
        padding: 12px 15px;
        gap: 10px;
    }
}

@media (max-width: 992px) {
    .teacher-lecture-item {
        grid-template-columns: minmax(70px, 90px) minmax(50px, 70px) minmax(100px, 1fr) minmax(60px, 80px) minmax(100px, 130px) minmax(30px, 40px);
        padding: 10px 12px;
        gap: 8px;
        font-size: 0.9rem;
    }
    
    .room-select {
        font-size: 0.8rem;
    }
    
    .location-select {
        font-size: 0.8rem;
    }
}

@media (max-width: 768px) {
    .teacher-lecture-item {
        grid-template-columns: 1fr;
        grid-template-rows: auto auto auto;
        gap: 5px;
        padding: 15px;
    }
    
    .teacher-lecture-day, 
    .teacher-lecture-time {
        grid-column: 1;
        display: inline-block;
        margin-right: 10px;
    }
    
    .teacher-lecture-name,
    .teacher-lecture-group {
        grid-column: 1;
    }
    
    .teacher-lecture-location {
        grid-column: 1;
        margin-top: 10px;
    }
    
    .teacher-lecture-actions {
        position: absolute;
        top: 15px;
        right: 15px;
    }
    
    /* Make the student schedule responsive */
    .schedule-layout {
        flex-direction: column;
    }
    
    .weekly-schedule {
        overflow-x: auto;
    }
    
    .schedule-container {
        min-width: 600px; /* Ensure minimum width for scrolling */
    }
}

/* Improve the attendance modal for smaller screens */
@media (max-width: 768px) {
    .attendance-modal-content {
        width: 95%;
        max-height: 90vh;
    }
    
    .student-attendance-item {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .attendance-actions {
        margin-top: 5px;
        width: 100%;
    }
    
    .lateness-input-container {
        position: static;
        margin-top: 5px;
        transform: none;
    }
}

/* Ensure text doesn't overflow in grid cells */
.teacher-lecture-day, 
.teacher-lecture-time,
.teacher-lecture-name,
.teacher-lecture-group {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* Make the room select dropdown responsive */
.room-select {
    width: 100%;
    max-width: 200px;
}
</style>

<script>
import NavBar from "@/components/Nav-Bar.vue";
import axios from "axios";
import { useStorage } from "@vueuse/core";  // Named import
import Footer from "@/components/Footer.vue";
import draggable from 'vuedraggable';

export default {
    name: 'Start',
    components: {
        NavBar,
        Footer,
    },
    data() {
        return {
            currentUser: useStorage('currentUser', { name: '', access: '', class: '' }),
            schema: [[], [], [], [], []],
            currentDayIndex: 0,
            currentDate: '',
            currentTime: '',
            testDay: '',
            todaySchedule: [],
            currentTimePosition: 0,
            testSchedule: [], // Corrected spelling and initialized as an empty array
            courses: [],
            // New data properties for attendance modal
            showAttendanceModal: false,
            selectedLecture: {},
            students: [],
            teacherLectures: [], // New property to store teacher's lectures
            availableRooms: [], // Initialize as empty array
        };
    },
    computed: {
        // Add a computed property to check if the user has permission to access attendance features
        hasAttendancePermission() {
            return this.currentUser && 
                  (this.currentUser.access === 'Admin' || 
                   this.currentUser.access === 'Lärare');
        },
        isTeacher() {
            return this.currentUser && 
                  (this.currentUser.access === 'Lärare');
        }
    },
    methods: {
        resolveDay(i) {
            switch (i) {
                case 0:
                    return "Måndag";
                case 1:
                    return "Tisdag";
                case 2:
                    return "Onsdag";
                case 3:
                    return "Torsdag";
                case 4:
                    return "Fredag";
            }
        },
        async fetchSchema(i) {
            let day = "";
            switch (i) {
                case 0: day = "monday"; break;
                case 1: day = "tuesday"; break;
                case 2: day = "wednesday"; break;
                case 3: day = "thursday"; break;
                case 4: day = "friday"; break;
            }

            try {
                // Check if user has groups
                if (!this.currentUser.groups || !this.currentUser.groups.length) {
                    console.log('No groups found for user:', this.currentUser);
                    return;
                }

                const schedules = [];
                console.log('Fetching schedules for groups:', this.currentUser.groups);

                // Fetch schedules for each group the user belongs to
                for (const group of this.currentUser.groups) {
                    try {
                        const response = await axios.get(
                            `http://localhost:1010/api/schema/${day}/${group}`
                        );
                        if (response.data && response.data.length > 0) {
                            schedules.push(...response.data);
                        }
                    } catch (groupError) {
                        console.error(`Error fetching schedule for group ${group}:`, groupError);
                    }
                }

                // Sort and update the schema
                if (schedules.length > 0) {
                    this.schema[i] = this.sortScheduleByTime(schedules.map(item => ({
                        ...item,
                        time: item.time.split(' - ')[0],
                    })));
                }
            } catch (error) {
                console.error(`Error fetching ${day} schedule:`, error);
                this.error = `Failed to load ${day} schedule`;
            }
        },
        updateDateTime() {
            const now = new Date();
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            this.currentDay = days[now.getDay()];
            this.currentDate = now.toLocaleDateString();
            this.currentTime = now.toLocaleTimeString();
        },
        isCurrentDay(dayIndex) {
            if (this.testDay !== '') {
                return dayIndex === parseInt(this.testDay);
            }
            const today = new Date().getDay();
            const adjustedToday = today === 0 ? 6 : today - 1;
            return dayIndex === adjustedToday;
        },
        async fetchTodaySchedule() {
            const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            const dayIndex = this.testDay !== '' ? parseInt(this.testDay) : new Date().getDay() - 1;
            this.currentDayIndex = dayIndex;
            const dayName = days[dayIndex + 1];
            
            try {
                if (!this.currentUser.groups || !this.currentUser.groups.length) {
                    console.log('No groups found for today schedule');
                    return;
                }

                const schedules = [];
                for (const groupId of this.currentUser.groups) {
                    const response = await axios.get(
                        `http://localhost:1010/api/schema/${dayName}/${groupId}`
                    );
                    if (response.data && response.data.length > 0) {
                        schedules.push(...response.data);
                    }
                }

                this.todaySchedule = this.sortScheduleByTime(schedules);
                this.updateCurrentTimePosition();
            } catch (error) {
                console.error('Error fetching today\'s schedule:', error);
            }
        },
        async fetchTestSchedule() {
            try {
                const response = await axios.get(`http://localhost:1010/api/tests/`);
                this.testSchedule = response.data; // Assign the fetched data to the array
            } catch (error) {
                console.error('Error fetching test schedule:', error);
            }
        },
        updateCurrentTimePosition() {
            const now = new Date();
            const startTime = new Date(now.setHours(8, 0, 0)); // Assuming school day starts at 8:00
            const currentTime = new Date();
            const timeDiff = (currentTime - startTime) / (1000 * 60); // Difference in minutes
            this.currentTimePosition = timeDiff * 2; // 2px per minute
        },
        isCurrentLecture(lecture) {
            const now = new Date();
            const [startHour, startMinute] = lecture.time.split(':').map(Number);
            const lectureStart = new Date(now.setHours(startHour, startMinute, 0));
            const lectureEnd = new Date(lectureStart.getTime() + 60 * 60 * 1000); // Assuming 1-hour lectures
            return now >= lectureStart && now < lectureEnd;
        },
        updateSchedules() {
            this.fetchTodaySchedule();
            // If you need to update the weekly schedule as well, call that method here
        },
        hasTest(subject) {
            return this.testSchedule.some(test => 
                test.subject.toLowerCase() === subject.toLowerCase()
            );
        },
        async fetchCourses() {
            const response = await axios.get(`http://localhost:1010/api/courses`);
            this.courses = response.data;
        },
        sortScheduleByTime(schedule) {
            return [...schedule].sort((a, b) => {
                const timeA = this.convertTimeToMinutes(a.time);
                const timeB = this.convertTimeToMinutes(b.time);
                return timeA - timeB;
            });
        },
        convertTimeToMinutes(timeStr) {
            const [hours, minutes] = timeStr.split(':').map(Number);
            return hours * 60 + minutes;
        },
        attendanceRoute() {
            this.$router.push('/attendance')
        },
        // New methods for attendance modal
        openAttendanceModal(lecture) {
            // Only allow teachers and admins to open the attendance modal
            if (!this.hasAttendancePermission) {
                return;
            }
            
            this.selectedLecture = lecture;
            this.fetchStudentsForLecture(lecture);
            this.showAttendanceModal = true;
            document.body.classList.add('modal-open');
        },
        
        closeAttendanceModal() {
            this.showAttendanceModal = false;
            this.selectedLecture = {};
            this.students = [];
            document.body.classList.remove('modal-open');
        },
        
        async fetchStudentsForLecture(lecture) {
            try {
                // Assuming you have an API endpoint to fetch students for a specific lecture
                const response = await axios.get(`http://localhost:1010/api/students/${lecture.group}`);
                
                // If you don't have a specific endpoint, you can use mock data for now
                if (!response.data || response.data.length === 0) {
                    // Mock data if no students are returned
                    this.students = [
                        { id: 1, name: 'Anna Andersson', attendanceStatus: 'present' },
                        { id: 2, name: 'Erik Eriksson', attendanceStatus: 'present' },
                        { id: 3, name: 'Maria Svensson', attendanceStatus: 'present' },
                        { id: 4, name: 'Johan Johansson', attendanceStatus: 'present' },
                        { id: 5, name: 'Lina Lindberg', attendanceStatus: 'present' },
                    ];
                } else {
                    // Map the response data to include attendanceStatus set to 'present' by default
                    this.students = response.data.map(student => ({
                        ...student,
                        attendanceStatus: 'present'
                    }));
                }
            } catch (error) {
                console.error('Error fetching students:', error);
                // Use mock data in case of error
                this.students = [
                    { id: 1, name: 'Anna Andersson', attendanceStatus: 'present' },
                    { id: 2, name: 'Erik Eriksson', attendanceStatus: 'present' },
                    { id: 3, name: 'Maria Svensson', attendanceStatus: 'present' },
                    { id: 4, name: 'Johan Johansson', attendanceStatus: 'present' },
                    { id: 5, name: 'Lina Lindberg', attendanceStatus: 'present' },
                ];
            }
        },
        
        async saveAttendance() {
            try {
                // Prepare the attendance data
                const attendanceData = {
                    lectureId: this.selectedLecture.id,
                    lectureName: this.selectedLecture.lecture,
                    date: new Date().toISOString(),
                    students: this.students.map(student => ({
                        studentId: student.id,
                        studentName: student.name,
                        status: student.attendanceStatus,
                        lateMinutes: student.lateMinutes || 0
                    }))
                };
                
                // Send the attendance data to your API
                await axios.post('http://localhost:1010/api/attendance', attendanceData);
                
                // Close the modal after saving
                this.closeAttendanceModal();
                
                // Optional: Show a success message
                alert('Närvaro har sparats!');
            } catch (error) {
                console.error('Error saving attendance:', error);
                alert('Ett fel uppstod när närvaron skulle sparas. Försök igen.');
            }
        },
        getDayName(day) {
            const days = {
                'monday': 'Måndag',
                'tuesday': 'Tisdag',
                'wednesday': 'Onsdag',
                'thursday': 'Torsdag',
                'friday': 'Fredag'
            };
            return days[day] || day;
        },
        async fetchTeacherLectures() {
            if (!this.isTeacher) return;
            
            try {
                // Assuming there's an API endpoint to fetch lectures by teacher ID
                const response = await axios.get(`http://localhost:1010/api/teacher-lectures/${this.currentUser.id}`);
                
                if (response.data && response.data.length > 0) {
                    // Sort lectures by day and time
                    this.teacherLectures = this.sortLecturesByDayAndTime(response.data);
                } else {
                    this.teacherLectures = [];
                }
            } catch (error) {
                console.error('Error fetching teacher lectures:', error);
                
                // Mock data for testing
                this.teacherLectures = [
                    { id: 1, day: 'monday', time: '08:30', lecture: 'Matematik', group: 'TE19A', locationStatus: 'current', customLocation: '' },
                    { id: 2, day: 'monday', time: '10:15', lecture: 'Fysik', group: 'NA20B', locationStatus: 'current', customLocation: '' },
                    { id: 3, day: 'tuesday', time: '13:00', lecture: 'Matematik', group: 'TE20A', locationStatus: 'current', customLocation: '' },
                    { id: 4, day: 'wednesday', time: '08:30', lecture: 'Programmering', group: 'TE19A', locationStatus: 'current', customLocation: '' },
                    { id: 5, day: 'friday', time: '14:45', lecture: 'Fysik', group: 'NA19C', locationStatus: 'current', customLocation: '' },
                ];
            }
        },
        sortLecturesByDayAndTime(lectures) {
            const dayOrder = { 'monday': 0, 'tuesday': 1, 'wednesday': 2, 'thursday': 3, 'friday': 4 };
            
            return [...lectures].sort((a, b) => {
                // First sort by day
                if (dayOrder[a.day] !== dayOrder[b.day]) {
                    return dayOrder[a.day] - dayOrder[b.day];
                }
                
                // Then sort by time
                const timeA = this.convertTimeToMinutes(a.time);
                const timeB = this.convertTimeToMinutes(b.time);
                return timeA - timeB;
            });
        },
        toggleAttendanceStatus(student) {
            // Cycle through attendance statuses (skipping 'late' status)
            if (student.attendanceStatus === 'present') {
                // Skip 'late' and go directly to 'absent'
                student.attendanceStatus = 'absent';
                // Remove late minutes when marked as absent
                delete student.lateMinutes;
            } else if (student.attendanceStatus === 'absent') {
                student.attendanceStatus = 'registered-absence';
                // Remove late minutes when marked as registered absence
                delete student.lateMinutes;
            } else if (student.attendanceStatus === 'registered-absence') {
                student.attendanceStatus = 'present';
                // Remove late minutes when marked as present
                delete student.lateMinutes;
            } else if (student.attendanceStatus === 'late') {
                // If currently late, go to absent
                student.attendanceStatus = 'absent';
                // Remove late minutes when marked as absent
                delete student.lateMinutes;
            }
        },
        handleLatenessInput(student) {
            // If the student has any value in lateMinutes
            if (student.lateMinutes) {
                // Set the status to late
                student.attendanceStatus = 'late';
            }
            // If the lateMinutes field is cleared and the student is marked as late
            else if (!student.lateMinutes && student.attendanceStatus === 'late') {
                // Change back to present
                student.attendanceStatus = 'present';
            }
        },
        handleLocationChange(lecture) {
            // No need to show room selector for "change" anymore
            if (lecture.locationStatus === 'canceled' || lecture.locationStatus === 'custom') {
                // Save the change immediately
                this.saveLocationChange(lecture);
            }
        },
        selectRoom(lecture, roomId) {
            // Set the new room
            lecture.newRoom = roomId;
            lecture.locationStatus = 'changed';
            lecture.showRoomSelector = false;
            
            // Save the change
            this.saveLocationChange(lecture);
        },
        cancelRoomChange(lecture) {
            // Hide the room selector without making changes
            lecture.showRoomSelector = false;
        },
        async saveLocationChange(lecture) {
            try {
                // Prepare the data
                const locationData = {
                    lectureId: lecture.id,
                    locationStatus: lecture.locationStatus,
                    newRoom: lecture.newRoom || '',
                    customLocation: lecture.customLocation || ''
                };
                
                // Send the data to your API
                await axios.post('http://localhost:1010/api/update-lecture-location', locationData);
                
                // Optional: Show a success message
                console.log('Location updated successfully');
            } catch (error) {
                console.error('Error updating location:', error);
            }
        },
        async fetchRooms() {
            const response = await axios.get('http://localhost:1010/api/rooms');
            this.availableRooms = response.data;
            console.log(this.availableRooms);
        },
    },
    mounted() {
        for (let i = 0; i < 5; i++) {
            this.fetchSchema(i);
        }
        
        this.updateDateTime();
        this.fetchCourses();
        this.fetchRooms();
        setInterval(this.updateDateTime, 1000);
        this.fetchTodaySchedule();
        this.fetchTestSchedule();
        setInterval(() => {
            this.updateCurrentTimePosition();
            this.$forceUpdate();
        }, 60000);
        
        // Add this to fetch teacher's lectures
        this.fetchTeacherLectures();
    },
    watch: {
        testDay() {
            this.updateSchedules();
        }
    }
};
</script>