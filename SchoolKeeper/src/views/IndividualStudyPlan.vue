<template>
  <div class="individual-study-plan">
    <NavBar site="personal" :currentUser="currentUser" />
    <main class="study-plan-content">
      <div class="page-header">
        <button class="back-button" @click="goBack">
          <span class="back-icon">←</span> Tillbaka
        </button>
        <h1 class="page-title">Individuell Studieplan</h1>
        <p class="page-subtitle">Din personliga studieplan och målsättning</p>
      </div>
      
      <div class="plan-overview">
        <div class="plan-card">
          <div class="card-header">
            <h2 class="card-title">Studiemål</h2>
            <button class="edit-button" @click="toggleEditMode('goals')">
              <span class="button-icon">✏️</span>
            </button>
          </div>
          <div class="card-content" v-if="!editModes.goals">
            <p v-if="studyPlan.goals">{{ studyPlan.goals }}</p>
            <p v-else class="empty-state">Inga studiemål har angetts ännu. Klicka på redigera för att lägga till.</p>
          </div>
          <div class="card-edit" v-else>
            <textarea v-model="studyPlan.goals" placeholder="Beskriv dina studiemål här..."></textarea>
            <div class="edit-actions">
              <button class="save-button" @click="saveSection('goals')">Spara</button>
              <button class="cancel-button" @click="cancelEdit('goals')">Avbryt</button>
            </div>
          </div>
        </div>
        
        <div class="plan-card">
          <div class="card-header">
            <h2 class="card-title">Kurser</h2>
          </div>
          <div class="card-content">
            <div class="courses-list" v-if="studyPlan.courses && studyPlan.courses.length > 0">
              <div class="course-item" v-for="(course, index) in studyPlan.courses" :key="index">
                <div class="course-name">{{ course.name }}</div>
                <div class="course-details">
                  <span class="course-points">{{ course.points }} poäng</span>
                  <span class="course-status" :class="'status-' + course.status">{{ getStatusText(course.status) }}</span>
                </div>
              </div>
            </div>
            <p v-else class="empty-state">Inga kurser har lagts till ännu. Kontakta din lärare för att lägga till kurser.</p>
          </div>
        </div>
      </div>
      
      <div class="plan-details">
        <div class="plan-card">
          <div class="card-header">
            <h2 class="card-title">Framsteg</h2>
          </div>
          <div class="card-content">
            <div class="progress-stats">
              <div class="progress-item">
                <div class="progress-circle" :style="{ '--progress': completedPercentage + '%' }">
                  <span class="progress-text">{{ completedPercentage }}%</span>
                </div>
                <div class="progress-label">Avklarade kurser</div>
              </div>
              <div class="progress-item">
                <div class="stat-box">
                  <div class="stat-value">{{ totalPoints }}</div>
                  <div class="stat-label">Totala poäng</div>
                </div>
              </div>
              <div class="progress-item">
                <div class="stat-box">
                  <div class="stat-value">{{ completedPoints }}</div>
                  <div class="stat-label">Avklarade poäng</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="plan-card">
          <div class="card-header">
            <h2 class="card-title">Anteckningar</h2>
            <button class="edit-button" @click="toggleEditMode('notes')">
              <span class="button-icon">✏️</span>
            </button>
          </div>
          <div class="card-content" v-if="!editModes.notes">
            <p v-if="studyPlan.notes">{{ studyPlan.notes }}</p>
            <p v-else class="empty-state">Inga anteckningar har lagts till ännu. Klicka på redigera för att lägga till.</p>
          </div>
          <div class="card-edit" v-else>
            <textarea v-model="studyPlan.notes" placeholder="Lägg till anteckningar här..."></textarea>
            <div class="edit-actions">
              <button class="save-button" @click="saveSection('notes')">Spara</button>
              <button class="cancel-button" @click="cancelEdit('notes')">Avbryt</button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="info-banner">
        <div class="info-icon">ℹ️</div>
        <p>Kurser och lektioner kan endast redigeras av lärare och administratörer. Kontakta din lärare om du behöver göra ändringar i din kursplan.</p>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script>
import NavBar from "@/components/Nav-Bar.vue";
import axios from "axios";
import { useStorage } from "@vueuse/core";
import Footer from "@/components/Footer.vue";
import { useRouter } from 'vue-router';

export default {
  name: 'IndividualStudyPlan',
  components: {
    NavBar,
    Footer,
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  data() {
    return {
      currentUser: useStorage('currentUser', { name: '', access: '', class: '' }),
      studyPlan: {
        goals: '',
        notes: '',
        courses: []
      },
      editModes: {
        goals: false,
        notes: false
      },
      tempData: {
        goals: '',
        notes: ''
      }
    }
  },
  computed: {
    totalPoints() {
      return this.studyPlan.courses.reduce((total, course) => total + Number(course.points || 0), 0);
    },
    completedPoints() {
      return this.studyPlan.courses
        .filter(course => course.status === 'completed')
        .reduce((total, course) => total + Number(course.points || 0), 0);
    },
    completedPercentage() {
      if (this.totalPoints === 0) return 0;
      return Math.round((this.completedPoints / this.totalPoints) * 100);
    }
  },
  methods: {
    goBack() {
      this.router.push('/personal');
    },
    fetchStudyPlan() {
      const userId = this.currentUser.name;
      
      // Attempt to fetch from API
      axios.get(`http://localhost:1010/api/study-plan/${userId}`)
        .then(response => {
          this.studyPlan = response.data;
        })
        .catch(error => {
          console.error('Error fetching study plan:', error);
          
          // Use mock data if API fails
          this.studyPlan = {
            goals: 'Mitt mål är att uppnå minst betyg B i alla kurser och utveckla mina kunskaper inom programmering och matematik.',
            notes: 'Behöver fokusera mer på matematikkursen under nästa termin.',
            courses: [
              { name: 'Programmering 1', points: 100, status: 'completed' },
              { name: 'Matematik 3c', points: 100, status: 'ongoing' },
              { name: 'Engelska 6', points: 100, status: 'completed' },
              { name: 'Fysik 2', points: 100, status: 'planned' }
            ]
          };
        });
    },
    toggleEditMode(section) {
      // Only allow editing goals and notes
      if (section === 'goals' || section === 'notes') {
        // Save current data to temp before enabling edit mode
        this.tempData[section] = JSON.parse(JSON.stringify(this.studyPlan[section]));
        this.editModes[section] = true;
      }
    },
    saveSection(section) {
      this.editModes[section] = false;
      this.saveStudyPlan();
    },
    cancelEdit(section) {
      // Restore from temp data
      this.studyPlan[section] = JSON.parse(JSON.stringify(this.tempData[section]));
      this.editModes[section] = false;
    },
    getStatusText(status) {
      const statusMap = {
        'planned': 'Planerad',
        'ongoing': 'Pågående',
        'completed': 'Avslutad'
      };
      return statusMap[status] || status;
    },
    saveStudyPlan() {
      const userId = this.currentUser.name;
      
      // Only save goals and notes, not courses
      const dataToSave = {
        goals: this.studyPlan.goals,
        notes: this.studyPlan.notes
      };
      
      axios.post(`http://localhost:1010/api/study-plan/${userId}`, dataToSave)
        .then(response => {
          console.log('Study plan saved successfully');
        })
        .catch(error => {
          console.error('Error saving study plan:', error);
          // In a real app, you would show an error message to the user
        });
    }
  },
  mounted() {
    this.fetchStudyPlan();
  }
}
</script>

<style scoped>
.study-plan-content {
  max-width: calc(100vw - 40px);
  width: 1000px;
  margin: 80px auto 30px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.page-header {
  text-align: center;
  margin-bottom: 10px;
  position: relative;
}

.back-button {
  position: absolute;
  left: 0;
  top: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background-color: #f0f0f0;
  color: #333;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.back-button:hover {
  background-color: #e0e0e0;
}

.back-icon {
  font-size: 1.2rem;
}

.page-title {
  font-size: 2.2rem;
  font-weight: 600;
  color: #216e87;
  margin: 0 0 5px;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
}

.plan-overview, .plan-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.plan-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.card-header {
  padding: 15px 20px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 1.3rem;
  color: #216e87;
  margin: 0;
  font-weight: 600;
}

.edit-button {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.edit-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.card-content {
  padding: 20px;
  flex: 1;
}

.empty-state {
  color: #888;
  font-style: italic;
  text-align: center;
  margin: 20px 0;
}

.card-edit {
  padding: 20px;
}

textarea {
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
}

.edit-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
  justify-content: flex-end;
}

.save-button, .cancel-button, .add-button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.save-button {
  background-color: #4fc0e5;
  color: white;
}

.save-button:hover {
  background-color: #3da1b5;
}

.cancel-button {
  background-color: #f0f0f0;
  color: #555;
}

.cancel-button:hover {
  background-color: #e0e0e0;
}

.add-button {
  background-color: #f0f0f0;
  color: #555;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  width: 100%;
}

.add-button:hover {
  background-color: #e0e0e0;
}

.courses-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.course-item {
  padding: 12px 15px;
  background-color: #f9f9f9;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.course-name {
  font-weight: 500;
  color: #333;
}

.course-details {
  display: flex;
  gap: 15px;
  align-items: center;
}

.course-points {
  color: #666;
  font-size: 0.9rem;
}

.course-status {
  font-size: 0.8rem;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.status-planned {
  background-color: #e9ecef;
  color: #495057;
}

.status-ongoing {
  background-color: #e3f2fd;
  color: #0d47a1;
}

.status-completed {
  background-color: #e8f5e9;
  color: #1b5e20;
}

.courses-edit {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.course-edit-item {
  display: grid;
  grid-template-columns: 2fr 0.5fr 1fr 36px;
  gap: 10px;
  align-items: center;
}

.course-edit-item input, .course-edit-item select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
}

.remove-button {
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  color: #dc3545;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.remove-button:hover {
  background-color: rgba(220, 53, 69, 0.1);
}

.progress-stats {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 20px;
}

.progress-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.progress-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: conic-gradient(#4fc0e5 var(--progress), #f0f0f0 0);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.progress-circle::before {
  content: '';
  position: absolute;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background-color: white;
}

.progress-text {
  position: relative;
  font-size: 1.8rem;
  font-weight: 600;
  color: #216e87;
}

.progress-label {
  font-size: 0.95rem;
  color: #666;
  text-align: center;
}

.stat-box {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px 20px;
  text-align: center;
  min-width: 120px;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 600;
  color: #216e87;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.95rem;
  color: #666;
}

@media (max-width: 992px) {
  .plan-overview, .plan-details {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .study-plan-content {
    margin-top: 70px;
    padding: 0 10px;
  }
  
  .page-header {
    padding-top: 40px;
  }
  
  .back-button {
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }
  
  .progress-stats {
    flex-direction: column;
  }
  
  .course-edit-item {
    grid-template-columns: 1fr;
  }
}

.info-banner {
  background-color: #e3f2fd;
  border-radius: 12px;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
  border-left: 4px solid #4fc0e5;
}

.info-icon {
  font-size: 1.5rem;
}

.info-banner p {
  margin: 0;
  color: #333;
  font-size: 0.95rem;
}
</style>
