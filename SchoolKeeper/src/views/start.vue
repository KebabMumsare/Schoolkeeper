<template>
    <NavBar site="start" :currentUser="currentUser" />
    <main class="Schedule">
        <div class="Container">
            <h3 class="schedule-title">Schema</h3>
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
        
        <!-- Replace the regular schedule layout with a time-grid layout -->
        <div v-if="!isTeacher" class="enhanced-schedule-layout">
            <!-- Removed day selector from here -->
            
            <div class="schedule-content-wrapper">
                <!-- Current day schedule (now on the left side) -->
                <div class="schedule-view-container side-content">
                    <h4>Dagens Schema</h4>
                    <!-- Time grid background -->
                    <div class="time-grid-background">
                        <div class="time-column">
                            <div v-for="marker in timeMarkers" :key="marker.valuel" class="time-cell"
                                 :style="{ height: (60 * pixelsPerMinute) + 'px' }">
                                {{ marker.label }}
                            </div>
                        </div>
                        <div class="grid-lines">
                            <div v-for="marker in timeMarkers" :key="marker.value" class="grid-line"
                                 :style="{ top: marker.position + 'px' }">
                            </div>
                        </div>
                    </div>
                    
                    <!-- No lectures message -->
                    <div v-if="todaySchedule.length === 0" class="no-lectures-message">
                        Inga lektioner idag
                    </div>
                    
                    <!-- Lectures for the day in a visually appealing list format -->
                    <div v-else class="day-schedule-list">
                        <div v-for="(lecture, index) in todaySchedule" :key="lecture.id" 
                             class="schedule-lecture-item"
                             :class="{ 
                                'current-lecture': isCurrentLecture(lecture),
                                'first-lecture': index === 0
                             }"
                             :style="positionLectureByTime(lecture)"
                             @click="hasAttendancePermission ? openAttendanceModal(lecture) : null">
                            <div class="lecture-time">
                                {{ lecture.time.includes('-') ? lecture.time : lecture.time + (lecture.endTime ? ' - ' + lecture.endTime : '') }}
                            </div>
                            <div class="lecture-content">
                                <div class="lecture-title">{{ lecture.lecture }}</div>
                                <div class="lecture-location" v-if="lecture.room">{{ lecture.room }}</div>
                                <div class="lecture-id" v-if="lecture.id">{{ lecture.id }}</div>
                            </div>
                            <span v-if="hasAttendancePermission" class="attendance-button">📋</span>
                        </div>
                    </div>
                    
                    <!-- Current time indicator -->
                    <div class="current-time-indicator" :style="{ top: currentTimeIndicatorPosition + 'px' }"
                         v-if="isCurrentDay(currentDayIndex) && testDay === ''">
                        <div class="indicator-dot"></div>
                        <div class="indicator-line"></div>
                    </div>
                </div>
                
                <!-- Weekly overview (now on the right side) -->
                <div class="weekly-overview main-content">
                    <h4>Veckoöversikt</h4>
                    <div class="weekly-grid">
                        <div class="day-column" v-for="(day, i) in schema" :key="i"
                             :class="{ 'current-day-column': isCurrentDay(i) }"
                             @click="testDay = i.toString(); updateSchedules()">
                            <div class="day-title">{{ resolveDay(i) }}</div>
                            <div class="day-lectures">
                                <div v-if="day.length === 0" class="no-mini-lectures">Inga lektioner</div>
                                <div v-for="lecture in day" :key="lecture.id" 
                                     class="mini-lecture"
                                     :class="{ 'current-mini-lecture': isCurrentDay(i) && isCurrentLecture(lecture) }"
                                     @click="hasAttendancePermission ? openAttendanceModal(lecture) : null">
                                    <span class="mini-time">{{ lecture.time }}</span>
                                    <span class="mini-title">{{ lecture.lecture }}</span>
                                    <span v-if="lecture.id" class="mini-id">{{ lecture.id }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Removed test controls from here -->
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
    border-radius: 0;
    box-shadow: none;
    background-color: #f8f9fa;
    padding: 0;
    max-width: 100%;
    width: calc(100vw - 20px);
    margin: 60px auto 0;
    position: relative;
    z-index: 1;
    min-height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;
}

.Container {
    margin-bottom: 5px;
    padding: 0 15px;
    width: 100%;
}

.enhanced-schedule-layout {
    display: flex;
    flex-direction: column;
    gap: 0;
    background-color: white;
    border-radius: 0;
    padding: 0 10px;
    box-shadow: none;
    margin: 0;
    flex: 1;
    height: calc(100vh - 100px);
    width: 100%;
}

.schedule-content-wrapper {
    display: flex;
    gap: 0.5rem;
    width: 100%;
    flex: 1;
    height: 100%;
    padding: 0 5px 10px;
}

.main-content {
    flex: 3;
    order: 2;
    height: 100%;
}

.side-content {
    flex: 1;
    order: 1;
    min-width: 250px;
    height: 100%;
}

.schedule-view-container {
    position: relative;
    border-radius: 8px;
    border: 1px solid #edf2f7;
    background-color: #ffffff;
    overflow: hidden;
    height: 100%;
    min-height: unset;
    max-height: none;
    margin: 0 5px;
}

.day-schedule-list {
    position: relative;
    z-index: 2;
    height: calc(100% - 35px);
    overflow-y: auto;
    padding: 0 15px 15px 65px;
    margin-top: 35px;
}

.weekly-overview {
    background-color: #ffffff;
    border-radius: 8px;
    padding: 0.75rem;
    border: 1px solid #edf2f7;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    height: 100%; /* Make it fill the height */
    display: flex;
    flex-direction: column;
    margin: 0 5px;
}

.weekly-grid {
    display: flex;
    gap: 0.75rem;
    overflow-x: hidden;
    padding-bottom: 0.5rem;
    width: 100%;
    flex: 1; /* Make it fill the available space */
}

.day-column {
    flex: 1;
    min-width: 0;
    background-color: white;
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid #edf2f7;
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    height: auto;
    min-height: calc(100vh - 150px); /* Increase to fill most of viewport */
}

.current-day-column {
    border-color: #4fc0e5;
    box-shadow: 0 2px 10px rgba(79, 192, 229, 0.2);
}

.day-title {
    padding: 8px;
    font-weight: 600;
    background-color: #f8f9fa;
    text-align: center;
    color: #555;
    border-bottom: 1px solid #edf2f7;
    font-size: 0.9rem;
    flex-shrink: 0;
}

.current-day-column .day-title {
    background-color: #4fc0e5;
    color: white;
}

.day-lectures {
    padding: 8px;
    overflow-y: auto;
    flex: 1;
}

.no-mini-lectures {
    padding: 10px 0;
    text-align: center;
    color: #888;
    font-style: italic;
    font-size: 0.85rem;
}

.mini-lecture {
    padding: 8px;
    margin-bottom: 8px;
    background-color: rgba(79, 192, 229, 0.05);
    border-left: 3px solid #4fc0e5;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.mini-lecture:hover {
    background-color: rgba(79, 192, 229, 0.1);
    transform: translateX(2px);
}

.current-mini-lecture {
    background-color: rgba(79, 192, 229, 0.2);
    border-left-color: #216e87;
}

.mini-time {
    display: block;
    font-size: 0.8rem;
    color: #216e87;
    margin-bottom: 3px;
    font-weight: 500;
}

.mini-title {
    display: block;
    font-weight: 500;
    font-size: 0.9rem;
    word-wrap: break-word; /* Allow text to wrap */
    white-space: normal; /* Allow text to wrap */
    overflow-wrap: break-word; /* Help with long words */
}

/* Media queries to ensure responsiveness */
@media (max-width: 992px) {
    .schedule-content-wrapper {
        flex-direction: column;
    }
    
    .main-content, .side-content {
        flex: 1;
        width: 100%;
        order: unset;
        min-height: calc(50vh - 80px); /* Adjust height for smaller screens */
    }
    
    .day-column {
        min-width: 120px;
        min-height: calc(50vh - 100px); /* Adjust height for smaller screens */
    }
    
    .schedule-view-container {
        min-height: calc(50vh - 80px); /* Adjust height for smaller screens */
    }
    
    .day-schedule-list {
        height: calc(50vh - 100px); /* Adjust height for smaller screens */
    }
}

@media (max-width: 768px) {
    .Schedule {
        margin-top: 50px;
        min-height: calc(100vh - 50px);
        width: 100vw;
        padding: 0 5px;
    }
    
    .enhanced-schedule-layout {
        height: calc(100vh - 90px);
        width: 100%;
        padding: 0 5px;
    }
    
    .schedule-content-wrapper {
        padding: 0 0 5px;
    }
    
    .teacher-lectures {
        margin: 0 5px 10px;
        width: calc(100% - 10px);
    }
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
    margin-top: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0.5rem;
}

.test-controls label {
    margin-right: 0.5rem;
    font-size: 0.9rem;
    color: #555;
}

.test-controls select {
    padding: 0.3rem 0.5rem;
    border-radius: 4px;
    border: 1px solid #ddd;
    background-color: white;
    font-size: 0.9rem;
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
    margin: 0 10px 10px;
    background-color: #ffffff;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: calc(100% - 20px);
}

.teacher-lectures h4 {
    margin-top: 0;
    margin-bottom: 15px;
    color: #333;
    font-size: 1.2rem;
}

.teacher-lectures-container {
    max-height: calc(100vh - 200px); /* Increase to use more vertical space */
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
    margin-bottom: 10px; /* Reduce margin */
    padding: 0 10px;
}

/* Enhance the "Schema" heading */
.schedule-title {
    font-size: 1.8rem; /* Slightly smaller for better space usage */
    font-weight: 600;
    color: #216e87;
    margin: 5px 0; /* Reduce margin */
    position: relative;
    display: inline-block;
    padding-bottom: 5px; /* Reduce padding */
}

.schedule-title::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    height: 4px;
    width: 60px;
    background-color: #4fc0e5;
    border-radius: 2px;
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

/* Add these styles for the enhanced schedule layout */
.enhanced-schedule-layout {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    background-color: white;
    border-radius: 8px;
    padding: 0.5rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    margin-top: 0.25rem;
    flex: 1; /* Make it fill available space */
    display: flex;
    flex-direction: column;
}

.days-header {
    display: flex;
    background-color: #f8f9fa;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 0.5rem;
}

.day-selector {
    flex: 1;
    text-align: center;
    padding: 8px;
    color: #555;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    border-bottom: 3px solid transparent;
    user-select: none;
    z-index: 5;
}

.day-selector:hover {
    background-color: #edf2f7;
    color: #216e87;
}

.selected-day {
    background-color: #ffffff;
    color: #216e87;
    font-weight: 600;
    border-bottom: 3px solid #216e87;
}

/* New layout wrapper for the switched content */
.schedule-content-wrapper {
    display: flex;
    gap: 0.75rem;
    width: 100%;
    flex: 1; /* Make it fill available space */
}

.main-content {
    flex: 3;
    order: 2; /* Changed to 2 to put it on the right */
}

.side-content {
    flex: 1;
    order: 1; /* Changed to 1 to put it on the left */
    min-width: 250px;
}

.schedule-view-container {
    position: relative;
    border-radius: 8px;
    border: 1px solid #edf2f7;
    background-color: #ffffff;
    overflow: hidden;
    min-height: calc(100vh - 150px); /* Increase minimum height to fill most of viewport */
    max-height: none; /* Remove max height restriction */
}

.schedule-view-container h4 {
    margin: 0;
    padding: 10px;
    background-color: #f8f9fa;
    color: #216e87;
    font-size: 0.9rem;
    border-bottom: 1px solid #edf2f7;
}

.time-grid-background {
    position: absolute;
    top: 35px; /* Adjusted to account for the header */
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    display: flex;
}

.time-column {
    width: 50px;
    background-color: #f8f9fa;
    border-right: 1px solid #edf2f7;
    flex-shrink: 0;
}

.time-cell {
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    color: #888;
    border-bottom: 1px solid rgba(0,0,0,0.04);
}

.grid-lines {
    flex: 1;
    position: relative;
}

.grid-line {
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    background-color: rgba(0,0,0,0.05);
}

.day-schedule-list {
    position: relative;
    z-index: 2;
    height: calc(100vh - 150px); /* Match container height */
    overflow-y: auto;
    padding: 0 15px 15px 65px;
    margin-top: 35px; /* Adjusted to account for the header */
}

.schedule-lecture-item {
    position: absolute; /* Use absolute positioning to place at exact time */
    left: 65px;
    right: 15px;
    padding: 8px 10px;
    background-color: rgba(79, 192, 229, 0.1);
    border-left: 4px solid #4fc0e5;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.2s ease;
    min-height: 40px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row; /* Change from column to row */
    align-items: flex-start; /* Align items at the start */
    gap: 8px; /* Add spacing between elements */
}

.schedule-lecture-item:hover {
    transform: translateX(3px);
    background-color: rgba(79, 192, 229, 0.2);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 3; /* Ensure hover item is above others */
}

.schedule-lecture-item.current-lecture {
    background-color: rgba(79, 192, 229, 0.3);
    border-left: 4px solid #216e87;
    box-shadow: 0 2px 15px rgba(33, 110, 135, 0.1);
    z-index: 4; /* Ensure current lecture is above others */
}

.schedule-lecture-item.first-lecture {
    margin-top: 5px;
}

.schedule-lecture-item .lecture-time {
    font-weight: 600;
    color: #216e87;
    font-size: 0.9rem;
    white-space: nowrap; /* Prevent the time from wrapping */
    flex-shrink: 0; /* Prevent the time from shrinking */
    min-width: 60px; /* Give the time a minimum width */
}

.schedule-lecture-item .lecture-content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow: hidden; /* Prevent content overflow */
}

.schedule-lecture-item .lecture-title {
    font-weight: 500;
    font-size: 1rem;
    color: #333;
    word-wrap: break-word; /* Allow text to wrap */
    white-space: normal; /* Allow text to wrap */
    overflow-wrap: break-word; /* Help with long words */
    hyphens: auto; /* Add hyphens for very long words */
}

.schedule-lecture-item .lecture-location {
    font-size: 0.85rem;
    color: #555;
    margin-top: 1px;
    word-wrap: break-word; /* Allow text to wrap */
    white-space: normal; /* Allow text to wrap */
}

.schedule-lecture-item .lecture-id {
    font-size: 0.75rem;
    color: #777;
    margin-top: 2px;
    word-wrap: break-word; /* Allow text to wrap */
    white-space: normal; /* Allow text to wrap */
    font-family: monospace; /* Better for IDs */
}

.current-time-indicator {
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    z-index: 5;
    pointer-events: none;
    top: 35px; /* Adjusted to account for the header */
}

.indicator-dot {
    width: 10px;
    height: 10px;
    background-color: #e74c3c;
    border-radius: 50%;
    position: absolute;
    left: 45px;
    top: -4px;
}

.indicator-line {
    position: absolute;
    left: 50px;
    right: 0;
    height: 2px;
    background-color: #e74c3c;
}

.no-lectures-message {
    position: relative;
    z-index: 2;
    display: flex;
    height: calc(100% - 35px); /* Adjusted to account for the header */
    justify-content: center;
    align-items: center;
    font-size: 1.1rem;
    color: #888;
    padding: 30px;
    margin-top: 35px; /* Adjusted to account for the header */
}

/* Weekly overview styles - now as side content */
.weekly-overview {
    background-color: #ffffff;
    border-radius: 8px;
    padding: 0.75rem;
    border: 1px solid #edf2f7;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    height: 100%; /* Make it fill the height */
    display: flex;
    flex-direction: column;
    margin: 0 5px;
}

.weekly-grid {
    display: flex;
    gap: 0.75rem;
    overflow-x: hidden;
    padding-bottom: 0.5rem;
    width: 100%;
    flex: 1; /* Make it fill the available space */
}

.day-column {
    flex: 1;
    min-width: 0;
    background-color: white;
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid #edf2f7;
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    height: auto;
    min-height: calc(100vh - 150px); /* Increase to fill most of viewport */
}

.current-day-column {
    border-color: #4fc0e5;
    box-shadow: 0 2px 10px rgba(79, 192, 229, 0.2);
}

.day-title {
    padding: 8px;
    font-weight: 600;
    background-color: #f8f9fa;
    text-align: center;
    color: #555;
    border-bottom: 1px solid #edf2f7;
    font-size: 0.9rem;
    flex-shrink: 0;
}

.current-day-column .day-title {
    background-color: #4fc0e5;
    color: white;
}

.day-lectures {
    padding: 8px;
    overflow-y: auto;
    flex: 1;
}

.no-mini-lectures {
    padding: 10px 0;
    text-align: center;
    color: #888;
    font-style: italic;
    font-size: 0.85rem;
}

.mini-lecture {
    padding: 8px;
    margin-bottom: 8px;
    background-color: rgba(79, 192, 229, 0.05);
    border-left: 3px solid #4fc0e5;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.mini-lecture:hover {
    background-color: rgba(79, 192, 229, 0.1);
    transform: translateX(2px);
}

.current-mini-lecture {
    background-color: rgba(79, 192, 229, 0.2);
    border-left-color: #216e87;
}

.mini-time {
    display: block;
    font-size: 0.8rem;
    color: #216e87;
    margin-bottom: 3px;
    font-weight: 500;
}

.mini-title {
    display: block;
    font-weight: 500;
    font-size: 0.9rem;
    word-wrap: break-word; /* Allow text to wrap */
    white-space: normal; /* Allow text to wrap */
    overflow-wrap: break-word; /* Help with long words */
}

/* Media queries to ensure responsiveness */
@media (max-width: 992px) {
    .schedule-content-wrapper {
        flex-direction: column;
    }
    
    .main-content, .side-content {
        flex: 1;
        width: 100%;
        order: unset;
        min-height: calc(50vh - 80px); /* Adjust height for smaller screens */
    }
    
    .day-column {
        min-width: 120px;
        min-height: calc(50vh - 100px); /* Adjust height for smaller screens */
    }
    
    .schedule-view-container {
        min-height: calc(50vh - 80px); /* Adjust height for smaller screens */
    }
    
    .day-schedule-list {
        height: calc(50vh - 100px); /* Adjust height for smaller screens */
    }
}

@media (max-width: 768px) {
    .enhanced-schedule-layout {
        padding: 0.25rem; /* Reduce padding further on mobile */
    }
    
    .weekly-grid {
        overflow-x: auto;
    }
    
    .day-column {
        min-width: 110px;
        flex: 0 0 110px;
    }
    
    .Schedule {
        margin-top: 50px; /* Adjust for smaller navbar on mobile */
        min-height: calc(100vh - 50px); /* Adjust for smaller navbar */
        width: 100vw;
        padding: 0 5px;
    }
    
    .enhanced-schedule-layout {
        height: calc(100vh - 90px);
        width: 100%;
        padding: 0 5px;
    }
    
    .schedule-content-wrapper {
        padding: 0 0 5px;
    }
    
    .teacher-lectures {
        margin: 0 5px 10px;
        width: calc(100% - 10px);
    }
}

/* Add styles to ensure the component takes up the full screen */
main {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.attendance-modal {
    position: fixed; /* Ensure modal is fixed on screen */
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000; /* Ensure it's above everything */
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.attendance-modal-content {
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.mini-id {
    display: block;
    font-size: 0.7rem;
    color: #777;
    margin-top: 2px;
    font-family: monospace;
    word-wrap: break-word;
    white-space: normal;
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
            testSchedule: [],
            courses: [],
            showAttendanceModal: false,
            selectedLecture: {},
            students: [],
            teacherLectures: [],
            availableRooms: [],
            scheduleHeight: 450,
            pixelsPerMinute: 0.75,
            timeMarkers: [],
            earliestTime: 8 * 60, // Default 8:00 AM in minutes
            latestTime: 17 * 60,  // Default 5:00 PM in minutes
            currentTimeIndicatorPosition: -100,
            defaultStartHour: 8,   // Default start hour if no lectures
            defaultEndHour: 17,    // Default end hour if no lectures
            baseStartHour: 8,      // For positioning calculations
        };
    },
    computed: {
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
                console.log(`Fetching schema for ${day}`);
                
                // If user has no groups, return empty schedule
                if (!this.currentUser.groups || !this.currentUser.groups.length) {
                    console.log('No groups found, returning empty schedule for weekly view');
                    this.schema[i] = [];
                    return;
                }

                // Fetch actual schedules from database
                const schedules = [];
                const seenLectures = new Set(); // Track unique lectures to avoid duplicates
                
                for (const group of this.currentUser.groups) {
                    try {
                        console.log(`Fetching ${day} schedule for group ${group}`);
                        const response = await axios.get(
                            `http://localhost:1010/api/schema/${day}/${group}`
                        );
                        
                        if (response.data && response.data.length > 0) {
                            // Process the data to ensure it has duration information
                            const processedData = response.data.map(lecture => {
                                // Make a copy with added duration if needed
                                const processedLecture = {...lecture};
                                
                                // Ensure the lecture has a duration
                                if (!processedLecture.duration) {
                                    // If we have both start and end time, calculate duration
                                    if (processedLecture.endTime) {
                                        const [startHours, startMinutes] = processedLecture.time.split(':').map(Number);
                                        const [endHours, endMinutes] = processedLecture.endTime.split(':').map(Number);
                                        const startInMinutes = startHours * 60 + startMinutes;
                                        const endInMinutes = endHours * 60 + endMinutes;
                                        processedLecture.duration = endInMinutes - startInMinutes;
                                    } else {
                                        // Default to 60 minutes for lectures without duration
                                        processedLecture.duration = 60;
                                    }
                                }
                                
                                return processedLecture;
                            });
                            
                            // Filter out duplicate lectures by checking time and name
                            for (const lecture of processedData) {
                                const lectureKey = `${lecture.time}-${lecture.lecture}`;
                                if (!seenLectures.has(lectureKey)) {
                                    seenLectures.add(lectureKey);
                                    schedules.push(lecture);
                                } else {
                                    console.log(`Skipping duplicate lecture in weekly view: ${lecture.lecture} at ${lecture.time}`);
                                }
                            }
                            
                            console.log(`Found ${processedData.length} lectures for group ${group} on ${day}`);
                        } else {
                            console.log(`No lectures found for group ${group} on ${day}`);
                        }
                    } catch (error) {
                        console.error(`Error fetching ${day} schedule for group ${group}:`, error);
                    }
                }

                if (schedules.length > 0) {
                    // Validate each lecture before sorting and displaying
                    const validatedSchedules = schedules.filter(lecture => {
                        // Make sure lecture has a title
                        if (!lecture.lecture || typeof lecture.lecture !== 'string') {
                            console.warn(`Invalid lecture title in weekly view: ${JSON.stringify(lecture)}`);
                            return false;
                        }
                        
                        // Make sure lecture has a valid time
                        if (!lecture.time || !lecture.time.includes(':')) {
                            console.warn(`Invalid lecture time in weekly view: ${JSON.stringify(lecture)}`);
                            return false;
                        }
                        
                        return true;
                    });
                    
                    this.schema[i] = this.sortScheduleByTime(validatedSchedules);
                    console.log(`Successfully processed ${validatedSchedules.length} lectures for ${day}`);
                } else {
                    // Empty array if no schedules found
                    this.schema[i] = [];
                }
            } catch (error) {
                console.error(`Error fetching ${day} schedule:`, error);
                // Keep the array empty if there's an error
                this.schema[i] = [];
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
            const today = new Date().getDay();
            const adjustedToday = today === 0 ? 4 : today - 1;
            return dayIndex === adjustedToday || dayIndex === parseInt(this.testDay);
        },
        async fetchTodaySchedule() {
            // Skip for teachers
            if (this.isTeacher) return;
            
            const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            const dayIndex = this.testDay !== '' ? parseInt(this.testDay) : new Date().getDay() - 1;
            
            // For Sunday, use Friday's schedule (index 4) if no test day is selected
            const adjustedDayIndex = dayIndex < 0 ? 4 : dayIndex;
            this.currentDayIndex = adjustedDayIndex;
            
            const dayName = days[adjustedDayIndex === 4 && new Date().getDay() === 0 ? 5 : adjustedDayIndex + 1];
            
            try {
                console.log(`Fetching schedule for ${dayName}`);
                
                // If user has no groups, return empty schedule
                if (!this.currentUser.groups || !this.currentUser.groups.length) {
                    console.log('No groups found, returning empty schedule');
                    this.todaySchedule = [];
                    this.calculateScheduleLayout();
                    this.updateCurrentTimePosition();
                    return;
                }

                // Attempt to fetch real data
                const schedules = [];
                const seenLectures = new Set(); // Track unique lectures to avoid duplicates
                let fetchSucceeded = false;
                
                for (const groupId of this.currentUser.groups) {
                    try {
                        console.log(`Fetching ${dayName} schedule for group ${groupId}`);
                        const response = await axios.get(
                            `http://localhost:1010/api/schema/${dayName}/${groupId}`
                        );
                        
                        if (response.data && response.data.length > 0) {
                            fetchSucceeded = true;
                            
                            // Process each lecture to ensure it has a duration
                            const processedData = response.data.map(lecture => {
                                // Make a copy to avoid modifying the original
                                const processedLecture = {...lecture};
                                
                                // Ensure the lecture has a duration
                                if (!processedLecture.duration) {
                                    // If has endTime, calculate duration
                                    if (processedLecture.endTime) {
                                        const [startHours, startMinutes] = processedLecture.time.split(':').map(Number);
                                        const [endHours, endMinutes] = processedLecture.endTime.split(':').map(Number);
                                        const startInMinutes = startHours * 60 + startMinutes;
                                        const endInMinutes = endHours * 60 + endMinutes;
                                        processedLecture.duration = endInMinutes - startInMinutes;
                                    } else {
                                        // Default to 60 minutes
                                        processedLecture.duration = 60; 
                                    }
                                }
                                
                                return processedLecture;
                            });
                            
                            // Filter out duplicate lectures by checking time and name
                            for (const lecture of processedData) {
                                const lectureKey = `${lecture.time}-${lecture.lecture}`;
                                if (!seenLectures.has(lectureKey)) {
                                    seenLectures.add(lectureKey);
                                    schedules.push(lecture);
                                } else {
                                    console.log(`Skipping duplicate lecture: ${lecture.lecture} at ${lecture.time}`);
                                }
                            }
                            
                            console.log(`Found ${processedData.length} lectures for group ${groupId} on ${dayName}`);
                        } else {
                            console.log(`No lectures found for group ${groupId} on ${dayName}`);
                        }
                    } catch (error) {
                        console.error(`Error fetching for group ${groupId} on ${dayName}:`, error);
                    }
                }

                if (schedules.length > 0) {
                    // Validate each lecture before sorting and displaying
                    const validatedSchedules = schedules.filter(lecture => {
                        // Make sure lecture has a title
                        if (!lecture.lecture || typeof lecture.lecture !== 'string') {
                            console.warn(`Invalid lecture title: ${JSON.stringify(lecture)}`);
                            return false;
                        }
                        
                        // Make sure lecture has a valid time
                        if (!lecture.time || !lecture.time.includes(':')) {
                            console.warn(`Invalid lecture time: ${JSON.stringify(lecture)}`);
                            return false;
                        }
                        
                        return true;
                    });
                    
                    this.todaySchedule = this.sortScheduleByTime(validatedSchedules);
                    console.log('Successfully loaded schedule data:', this.todaySchedule);
                } else {
                    // No schedules found
                    console.log('No lectures found for today');
                    this.todaySchedule = [];
                }
                
                // Calculate layout and update time position regardless of data source
                this.calculateScheduleLayout();
                this.updateCurrentTimePosition();
            } catch (error) {
                console.error('Error fetching schedule:', error);
                this.todaySchedule = [];
                this.calculateScheduleLayout();
            }
        },
        async fetchTestSchedule() {
            try {
                const response = await axios.get(`http://localhost:1010/api/tests/`);
                this.testSchedule = response.data;
            } catch (error) {
                console.error('Error fetching test schedule:', error);
            }
        },
        updateCurrentTimePosition() {
            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();
            
            if (currentMinutes >= this.earliestTime && currentMinutes <= this.latestTime) {
                const minutesFromEarliest = currentMinutes - this.earliestTime;
                this.currentTimePosition = (minutesFromEarliest / (this.latestTime - this.earliestTime)) * this.scheduleHeight;
            } else {
                this.currentTimePosition = -1;
            }
        },
        isCurrentLecture(lecture) {
            const now = new Date();
            const [startHour, startMinute] = lecture.time.split(':').map(Number);
            const lectureStart = new Date(now.setHours(startHour, startMinute, 0));
            const lectureEnd = new Date(lectureStart.getTime() + 60 * 60 * 1000);
            return now >= lectureStart && now < lectureEnd;
        },
        updateSchedules() {
            if (!this.isTeacher) {
                this.fetchTodaySchedule();
            }
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
                // Handle different time formats
                let timeA, timeB;
                
                // If time contains a range (e.g. "09:00 - 10:30"), use the start time
                if (a.time.includes('-')) {
                    timeA = this.convertTimeToMinutes(a.time.split('-')[0].trim());
                } else {
                    timeA = this.convertTimeToMinutes(a.time);
                }
                
                if (b.time.includes('-')) {
                    timeB = this.convertTimeToMinutes(b.time.split('-')[0].trim());
                } else {
                    timeB = this.convertTimeToMinutes(b.time);
                }
                
                return timeA - timeB;
            });
        },
        convertTimeToMinutes(timeStr) {
            // Make sure we're working with a clean time string
            const cleanTimeStr = timeStr.trim();
            const [hours, minutes] = cleanTimeStr.split(':').map(Number);
            return hours * 60 + minutes;
        },
        attendanceRoute() {
            this.$router.push('/attendance')
        },
        openAttendanceModal(lecture) {
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
                const response = await axios.get(`http://localhost:1010/api/students/${lecture.group}`);
                
                if (!response.data || response.data.length === 0) {
                    this.students = [
                        { id: 1, name: 'Anna Andersson', attendanceStatus: 'present' },
                        { id: 2, name: 'Erik Eriksson', attendanceStatus: 'present' },
                        { id: 3, name: 'Maria Svensson', attendanceStatus: 'present' },
                        { id: 4, name: 'Johan Johansson', attendanceStatus: 'present' },
                        { id: 5, name: 'Lina Lindberg', attendanceStatus: 'present' },
                    ];
                } else {
                    this.students = response.data.map(student => ({
                        ...student,
                        attendanceStatus: 'present'
                    }));
                }
            } catch (error) {
                console.error('Error fetching students:', error);
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
                
                await axios.post('http://localhost:1010/api/attendance', attendanceData);
                
                this.closeAttendanceModal();
                
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
            
            console.log("Attempting to fetch teacher lectures...");
            console.log("Current user:", this.currentUser);
            
            try {
                // Check if we have a user ID before making the request
                if (!this.currentUser.id) {
                    console.error("Teacher ID missing, cannot fetch lectures");
                    // Add fallback test data since the ID is missing
                    this.teacherLectures = [
                        {
                            id: 1,
                            day: 'monday',
                            time: '09:00',
                            lecture: 'Matematik',
                            group: 'TE2',
                            room: 'A101',
                            locationStatus: 'current'
                        },
                        {
                            id: 2,
                            day: 'monday',
                            time: '13:00',
                            lecture: 'Programmering',
                            group: 'TE2',
                            room: 'B204',
                            locationStatus: 'current'
                        },
                        {
                            id: 3,
                            day: 'tuesday',
                            time: '10:30',
                            lecture: 'Matematik',
                            group: 'NA3',
                            room: 'A101',
                            locationStatus: 'current'
                        },
                        {
                            id: 4,
                            day: 'wednesday',
                            time: '09:00',
                            lecture: 'Programmering',
                            group: 'TE2',
                            room: 'B204',
                            locationStatus: 'current'
                        },
                        {
                            id: 5,
                            day: 'friday',
                            time: '13:15',
                            lecture: 'Matematik',
                            group: 'TE2',
                            room: 'A101',
                            locationStatus: 'current'
                        }
                    ];
                    return;
                }
                
                console.log(`Making API request to fetch lectures for teacher ID: ${this.currentUser.id}`);
                const response = await axios.get(`http://localhost:1010/api/teacher-lectures/${this.currentUser.id}`);
                
                if (response.data && response.data.length > 0) {
                    console.log(`Received ${response.data.length} lectures from server`);
                    this.teacherLectures = this.sortLecturesByDayAndTime(response.data);
                } else {
                    console.log("No lectures returned from server, using fallback data");
                    // Add fallback test data since no data was returned
                    this.teacherLectures = [
                        {
                            id: 1,
                            day: 'monday',
                            time: '09:00',
                            lecture: 'Matematik',
                            group: 'TE2',
                            room: 'A101',
                            locationStatus: 'current'
                        },
                        {
                            id: 2,
                            day: 'monday',
                            time: '13:00',
                            lecture: 'Programmering',
                            group: 'TE2',
                            room: 'B204',
                            locationStatus: 'current'
                        },
                        {
                            id: 3,
                            day: 'tuesday',
                            time: '10:30',
                            lecture: 'Matematik',
                            group: 'NA3',
                            room: 'A101',
                            locationStatus: 'current'
                        },
                        {
                            id: 4,
                            day: 'wednesday',
                            time: '09:00',
                            lecture: 'Programmering',
                            group: 'TE2',
                            room: 'B204',
                            locationStatus: 'current'
                        },
                        {
                            id: 5,
                            day: 'friday',
                            time: '13:15',
                            lecture: 'Matematik',
                            group: 'TE2',
                            room: 'A101',
                            locationStatus: 'current'
                        }
                    ];
                }
            } catch (error) {
                console.error('Error fetching teacher lectures:', error);
                // Add fallback test data since there was an error
                this.teacherLectures = [
                    {
                        id: 1,
                        day: 'monday',
                        time: '09:00',
                        lecture: 'Matematik',
                        group: 'TE2',
                        room: 'A101',
                        locationStatus: 'current'
                    },
                    {
                        id: 2,
                        day: 'monday',
                        time: '13:00',
                        lecture: 'Programmering',
                        group: 'TE2',
                        room: 'B204',
                        locationStatus: 'current'
                    },
                    {
                        id: 3,
                        day: 'tuesday',
                        time: '10:30',
                        lecture: 'Matematik',
                        group: 'NA3',
                        room: 'A101',
                        locationStatus: 'current'
                    },
                    {
                        id: 4,
                        day: 'wednesday',
                        time: '09:00',
                        lecture: 'Programmering',
                        group: 'TE2',
                        room: 'B204',
                        locationStatus: 'current'
                    },
                    {
                        id: 5,
                        day: 'friday',
                        time: '13:15',
                        lecture: 'Matematik',
                        group: 'TE2',
                        room: 'A101',
                        locationStatus: 'current'
                    }
                ];
            }
        },
        sortLecturesByDayAndTime(lectures) {
            const dayOrder = { 'monday': 0, 'tuesday': 1, 'wednesday': 2, 'thursday': 3, 'friday': 4 };
            
            return [...lectures].sort((a, b) => {
                if (dayOrder[a.day] !== dayOrder[b.day]) {
                    return dayOrder[a.day] - dayOrder[b.day];
                }
                
                const timeA = this.convertTimeToMinutes(a.time);
                const timeB = this.convertTimeToMinutes(b.time);
                return timeA - timeB;
            });
        },
        toggleAttendanceStatus(student) {
            if (student.attendanceStatus === 'present') {
                student.attendanceStatus = 'absent';
                delete student.lateMinutes;
            } else if (student.attendanceStatus === 'absent') {
                student.attendanceStatus = 'registered-absence';
                delete student.lateMinutes;
            } else if (student.attendanceStatus === 'registered-absence') {
                student.attendanceStatus = 'present';
                delete student.lateMinutes;
            } else if (student.attendanceStatus === 'late') {
                student.attendanceStatus = 'absent';
                delete student.lateMinutes;
            }
        },
        handleLatenessInput(student) {
            if (student.lateMinutes) {
                student.attendanceStatus = 'late';
            }
            else if (!student.lateMinutes && student.attendanceStatus === 'late') {
                student.attendanceStatus = 'present';
            }
        },
        handleLocationChange(lecture) {
            if (lecture.locationStatus === 'canceled' || lecture.locationStatus === 'custom') {
                this.saveLocationChange(lecture);
            }
        },
        selectRoom(lecture, roomId) {
            lecture.newRoom = roomId;
            lecture.locationStatus = 'changed';
            lecture.showRoomSelector = false;
            
            this.saveLocationChange(lecture);
        },
        cancelRoomChange(lecture) {
            lecture.showRoomSelector = false;
        },
        async saveLocationChange(lecture) {
            try {
                const locationData = {
                    lectureId: lecture.id,
                    locationStatus: lecture.locationStatus,
                    newRoom: lecture.newRoom || '',
                    customLocation: lecture.customLocation || ''
                };
                
                await axios.post('http://localhost:1010/api/update-lecture-location', locationData);
                
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
        calculateScheduleLayout() {
            // First, let's determine the earliest and latest times from the schedule
            if (this.todaySchedule.length > 0) {
                // Find the earliest start time
                let earliestHour = this.defaultStartHour;
                let latestHour = this.defaultEndHour;
                
                this.todaySchedule.forEach(lecture => {
                    try {
                        let startHour, startMinute;
                        
                        // Parse the start time
                        if (lecture.time.includes('-')) {
                            const [startTime] = lecture.time.split('-').map(t => t.trim());
                            [startHour, startMinute] = startTime.split(':').map(Number);
                        } else {
                            [startHour, startMinute] = lecture.time.split(':').map(Number);
                        }
                        
                        // Calculate end time
                        let endHour = startHour + 1; // Default 1 hour duration
                        let endMinute = startMinute;
                        
                        if (lecture.time && lecture.time.includes('-')) {
                            const [, endTime] = lecture.time.split('-').map(t => t.trim());
                            [endHour, endMinute] = endTime.split(':').map(Number);
                        } else if (lecture.endTime) {
                            [endHour, endMinute] = lecture.endTime.split(':').map(Number);
                        } else if (lecture.duration) {
                            const durationMinutes = lecture.duration;
                            const endTimeMinutes = startHour * 60 + startMinute + durationMinutes;
                            endHour = Math.floor(endTimeMinutes / 60);
                            endMinute = endTimeMinutes % 60;
                        }
                        
                        // Update earliest and latest times
                        earliestHour = Math.min(earliestHour, startHour);
                        latestHour = Math.max(latestHour, endHour + (endMinute > 0 ? 1 : 0));
                        
                    } catch (error) {
                        console.error('Error parsing lecture time:', error, lecture);
                    }
                });
                
                // Ensure we have a reasonable buffer (at least 1 hour before first lecture)
                earliestHour = Math.max(7, earliestHour - 1);
                latestHour = Math.min(18, latestHour + 1);
                
                // Set the calculated times
                this.earliestTime = earliestHour * 60;
                this.latestTime = latestHour * 60;
                this.baseStartHour = earliestHour;
                
                console.log(`Dynamic schedule times: ${earliestHour}:00 - ${latestHour}:00`);
            } else {
                // No lectures, use default values
                this.earliestTime = this.defaultStartHour * 60;
                this.latestTime = this.defaultEndHour * 60;
                this.baseStartHour = this.defaultStartHour;
                
                console.log(`Using default schedule times: ${this.defaultStartHour}:00 - ${this.defaultEndHour}:00`);
            }
            
            // Calculate the total time range and update the schedule display
            const totalMinutes = this.latestTime - this.earliestTime;
            const totalHours = totalMinutes / 60;
            
            // The height of the schedule is fixed, but we adjust pixels per hour based on range
            this.scheduleHeight = 450; // Keep a consistent height
            this.pixelsPerMinute = this.scheduleHeight / totalMinutes;
            
            // Generate the time markers and update the indicator
            this.generateTimeMarkers();
            this.updateCurrentTimeIndicator();
            
            console.log("Schedule layout calculated:", {
                earliestTime: this.earliestTime,
                latestTime: this.latestTime,
                scheduleHeight: this.scheduleHeight,
                pixelsPerMinute: this.pixelsPerMinute
            });
        },
        generateTimeMarkers() {
            this.timeMarkers = [];
            
            const startHour = Math.floor(this.earliestTime / 60);
            const endHour = Math.ceil(this.latestTime / 60);
            
            for (let hour = startHour; hour <= endHour; hour++) {
                this.timeMarkers.push({
                    value: hour,
                    label: `${hour}:00`,
                    position: ((hour * 60) - this.earliestTime) * this.pixelsPerMinute
                });
            }
            
            console.log("Generated dynamic time markers:", this.timeMarkers);
        },
        positionLectureByTime(lecture) {
            try {
                // Parse time from the lecture
                let startHour, startMinute;
                
                if (lecture.time.includes('-')) {
                    // If format is "HH:MM - HH:MM"
                    const [startTime] = lecture.time.split('-').map(t => t.trim());
                    [startHour, startMinute] = startTime.split(':').map(Number);
                } else {
                    [startHour, startMinute] = lecture.time.split(':').map(Number);
                }
                
                // Calculate duration
                let duration = 60; // Default to 60 minutes
                
                if (lecture.time && lecture.time.includes('-')) {
                    // Calculate from time range "HH:MM - HH:MM"
                    const [startTime, endTime] = lecture.time.split('-').map(t => t.trim());
                    const [startH, startM] = startTime.split(':').map(Number);
                    const [endH, endM] = endTime.split(':').map(Number);
                    
                    const startInMinutes = startH * 60 + startM;
                    const endInMinutes = endH * 60 + endM;
                    duration = endInMinutes - startInMinutes;
                } else if (lecture.endTime) {
                    // Calculate from separate start and end times
                    const [endHour, endMinute] = lecture.endTime.split(':').map(Number);
                    const startInMinutes = startHour * 60 + startMinute;
                    const endInMinutes = endHour * 60 + endMinute;
                    duration = endInMinutes - startInMinutes;
                } else if (lecture.duration) {
                    duration = lecture.duration;
                }
                
                // Ensure reasonable duration (at least 30 min, at most 4 hours)
                duration = Math.max(30, Math.min(duration, 240));
                
                // Position relative to the dynamic earliest time
                const lectureStartMinutes = startHour * 60 + startMinute;
                const minutesFromEarliest = lectureStartMinutes - this.earliestTime;
                
                // Calculate position using the pixels per minute
                const topPosition = minutesFromEarliest * this.pixelsPerMinute;
                const height = duration * this.pixelsPerMinute;
                
                console.log(`Positioning lecture "${lecture.lecture}" at ${lecture.time} → top: ${topPosition}px, height: ${height}px`);
                
                return {
                    top: `${topPosition}px`,
                    height: `${height}px`
                };
            } catch (error) {
                console.error(`Error positioning lecture ${lecture.lecture}:`, error);
                return { top: '0px', height: '45px' }; // Fallback position
            }
        },
        updateCurrentTimeIndicator() {
            const now = new Date();
            const hour = now.getHours();
            const minutes = now.getMinutes();
            const currentMinutes = hour * 60 + minutes;
            
            // Only show the indicator if the current time is within the displayed time range
            if (currentMinutes >= this.earliestTime && currentMinutes <= this.latestTime) {
                const minutesFromEarliest = currentMinutes - this.earliestTime;
                this.currentTimeIndicatorPosition = minutesFromEarliest * this.pixelsPerMinute;
            } else {
                this.currentTimeIndicatorPosition = -100; // Hide off-screen
            }
        },
    },
    mounted() {
        console.log('Component mounted');
        
        for (let i = 0; i < 5; i++) {
            this.fetchSchema(i);
        }
        
        setTimeout(() => {
            this.fetchTodaySchedule();
        }, 100);
        
        this.$nextTick(() => {
            const daySelectors = document.querySelectorAll('.day-selector');
            daySelectors.forEach((el, index) => {
                el.addEventListener('click', () => {
                    console.log(`Clicked on day ${index}`);
                    this.testDay = index.toString();
                    this.updateSchedules();
                });
            });
        });
        
        if (typeof this.updateDateTime === 'function') {
            this.updateDateTime();
            setInterval(this.updateDateTime, 1000);
        }
        
        if (typeof this.fetchCourses === 'function') {
            this.fetchCourses();
        }
        
        this.fetchRooms();
        
        setInterval(() => {
            this.updateCurrentTimePosition();
            this.$forceUpdate();
        }, 60000);
        
        // Fetch teacher lectures with a slight delay to ensure current user is loaded
        setTimeout(() => {
            if (this.isTeacher) {
                console.log("Teacher detected, fetching lectures...");
                this.fetchTeacherLectures();
            }
        }, 500);
        
        // Update the current time indicator every minute
        setInterval(() => {
            this.updateCurrentTimeIndicator();
        }, 60000);
        
        // Initial update
        this.updateCurrentTimeIndicator();
    },
    watch: {
        // Add a watcher for currentUser to fetch teacher lectures when user data changes
        currentUser: {
            handler(newValue, oldValue) {
                console.log("Current user changed:", newValue);
                if (newValue && newValue.access === 'Lärare' && (!oldValue || oldValue.access !== 'Lärare')) {
                    console.log("Teacher user detected, fetching lectures");
                    this.fetchTeacherLectures();
                }
            },
            deep: true
        },
        testDay() {
            this.updateSchedules();
        }
    }
};
</script>