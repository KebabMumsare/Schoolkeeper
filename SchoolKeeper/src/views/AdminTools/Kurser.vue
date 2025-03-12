<template>
  <div class="kurser-container">
    <div class="header">
      <div class="header-top">
        <button class="back-to-admin-button" @click="goBackToAdmin">
          <span class="back-arrow">←</span> Tillbaka till Admin
        </button>
        <h1>Kurser från Skolverket</h1>
      </div>
      <div class="search-container">
        <input 
          type="text" 
          v-model="searchTerm" 
          placeholder="Sök efter kursnamn eller kurskod..." 
          class="search-input"
          @input="filterSubjects"
        >
      </div>
    </div>
    
    <!-- Loading and Error States -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Hämtar kurser från Skolverket...</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <h2>Ett fel uppstod</h2>
      <p>{{ errorMessage }}</p>
      <button @click="fetchSubjects" class="retry-button">Försök igen</button>
    </div>
    
    <!-- Subjects Grid -->
    <div v-else class="subjects-container">
      <div v-if="filteredSubjects.length === 0" class="no-results">
        <p>Inga kurser hittades. Försök med en annan sökning.</p>
      </div>
      <div class="subjects-grid">
        <div 
          v-for="subject in paginatedSubjects" 
          :key="subject.code" 
          class="subject-card"
          @click="showSubjectDetails(subject.code)"
        >
          <h2>{{ subject.name }}</h2>
          <p>Kurskod: {{ subject.code }}</p>
        </div>
        <!-- Empty placeholder cards to maintain grid layout -->
        <div v-for="n in emptyCardCount" :key="'empty-'+n" class="subject-card empty"></div>
      </div>
      
      <!-- Pagination -->
      <div class="pagination" v-if="filteredSubjects.length > itemsPerPage">
        <button 
          class="pagination-button" 
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          &laquo; Föregående
        </button>
        
        <span class="page-info">Sida {{ currentPage }} av {{ totalPages }}</span>
        
        <button 
          class="pagination-button" 
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          Nästa &raquo;
        </button>
      </div>
    </div>

    <!-- Detail Overlay -->
    <div class="detail-overlay" :class="{ active: showOverlay }">
      <button class="back-button" @click="closeOverlay">← Tillbaka</button>
      
      <!-- Loading State for Details -->
      <div v-if="loadingDetails" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Hämtar kursdetaljer...</p>
      </div>
      
      <!-- Error State for Details -->
      <div v-else-if="detailError" class="error-container">
        <h2>Ett fel uppstod</h2>
        <p>{{ detailErrorMessage }}</p>
        <button @click="retryFetchDetails" class="retry-button">Försök igen</button>
      </div>
      
      <!-- Subject Details -->
      <div v-else-if="currentSubject" class="detail-content">
        <div class="detail-header">
          <h2>{{ currentSubject.name || 'Kursdetaljer' }}</h2>
          
          <div class="basic-info">
            <div class="info-item" v-if="currentSubject.code">
              <span class="label">Kurskod</span>
              <div class="value">{{ currentSubject.code }}</div>
            </div>
            
            <div class="info-item" v-if="currentSubject.englishName">
              <span class="label">Engelskt namn</span>
              <div class="value">{{ currentSubject.englishName }}</div>
            </div>
          </div>
        </div>
        
        <div class="detail-body">
          <div class="info-section" v-if="currentSubject.description">
            <span class="label">Beskrivning</span>
            <div class="value content-text description-text" v-html="currentSubject.description"></div>
          </div>
          
          <div class="info-section" v-if="currentSubject.purpose">
            <span class="label">Syfte</span>
            <div class="value content-text purpose-text" v-html="formatTextWithParagraphs(currentSubject.purpose)"></div>
          </div>
          
          <!-- Courses Section -->
          <div class="info-section courses-section" v-if="currentSubject.courses && currentSubject.courses.length > 0">
            <h3 class="section-title">Kurser och betygsättning</h3>
            
            <div v-for="course in currentSubject.courses" :key="course.code" class="course-info">
              <div class="course-header" @click="toggleCourse(course.code)">
                <h3>{{ course.name }} <span class="dropdown-arrow" :class="{ expanded: expandedCourses.includes(course.code) }">▼</span></h3>
              </div>
              
              <div class="course-content" :class="{ expanded: expandedCourses.includes(course.code) }">
                <div class="course-meta" v-if="course.points">
                  <span class="meta-label">Poäng:</span> {{ course.points }}
                </div>
                
                <div v-if="course.description" class="course-description content-text" v-html="course.description"></div>
                
                <!-- Central Content -->
                <div v-if="course.centralContent" class="content-section">
                  <div class="section-header" @click="toggleSection('central-' + course.code)">
                    <h4>Centralt innehåll</h4>
                    <span class="dropdown-arrow" :class="{ expanded: expandedSections.includes('central-' + course.code) }">▼</span>
                  </div>
                  <div class="section-content" :class="{ expanded: expandedSections.includes('central-' + course.code) }">
                    <div class="central-content-text">
                      <ul class="content-list">
                        <li v-for="(item, index) in formatContentArray(course.centralContent)" :key="'central-' + index" v-html="item"></li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <!-- Knowledge Requirements -->
                <div v-if="course.knowledgeRequirements" class="content-section">
                  <div class="section-header" @click="toggleSection('knowledge-' + course.code)">
                    <h4>Kunskapskrav</h4>
                    <span class="dropdown-arrow" :class="{ expanded: expandedSections.includes('knowledge-' + course.code) }">▼</span>
                  </div>
                  <div class="section-content" :class="{ expanded: expandedSections.includes('knowledge-' + course.code) }">
                    <ul class="content-list">
                      <li v-for="(req, index) in formatContentArray(course.knowledgeRequirements)" :key="'knowledge-' + index" v-html="req"></li>
                    </ul>
                  </div>
                </div>
                
                <!-- Grade Scale -->
                <div v-if="course.gradeScale" class="content-section">
                  <div class="section-header" @click="toggleSection('grade-' + course.code)">
                    <h4>Betygsskala</h4>
                    <span class="dropdown-arrow" :class="{ expanded: expandedSections.includes('grade-' + course.code) }">▼</span>
                  </div>
                  <div class="section-content" :class="{ expanded: expandedSections.includes('grade-' + course.code) }">
                    <div class="grade-scale content-text" v-html="course.gradeScale"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- API Info -->
        <div class="info-section api-info" v-if="detailInfo">
          <span class="label">API Information</span>
          <div class="value">
            <p>Utgivare: {{ detailInfo.apiPublisher }}</p>
            <p>Version: {{ detailInfo.apiVersion }}</p>
            <p>Senast uppdaterad: {{ detailInfo.apiReleased }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Kurser',
  data() {
    return {
      allSubjects: [],
      filteredSubjects: [],
      searchTerm: '',
      showOverlay: false,
      currentSubject: null,
      detailInfo: null,
      expandedCourses: [],
      expandedSections: [],
      loading: false,
      error: false,
      errorMessage: '',
      loadingDetails: false,
      detailError: false,
      detailErrorMessage: '',
      currentSubjectCode: null,
      currentPage: 1,
      itemsPerPage: 9
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredSubjects.length / this.itemsPerPage);
    },
    paginatedSubjects() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredSubjects.slice(start, end);
    },
    emptyCardCount() {
      // Add empty cards to maintain grid layout
      if (this.paginatedSubjects.length === 0) return 0;
      const remainder = this.paginatedSubjects.length % 3;
      return remainder === 0 ? 0 : 3 - remainder;
    }
  },
  watch: {
    searchTerm() {
      this.currentPage = 1; // Reset to first page when searching
    }
  },
  mounted() {
    this.fetchSubjects();
  },
  methods: {
    async fetchSubjects() {
      this.loading = true;
      this.error = false;
      this.errorMessage = '';
      
      try {
        const response = await axios.get('http://localhost:1010/api/skolverket/subjects');
        
        if (Array.isArray(response.data.subjects)) {
          this.allSubjects = response.data.subjects;        
          this.filteredSubjects = [...this.allSubjects];
        } else {
          this.error = true;
          this.errorMessage = 'Inga kurser hittades.';
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
        this.error = true;
        this.errorMessage = `Kunde inte hämta kurser: ${error.message}. Kontrollera att API:et är tillgängligt.`;
      } finally {
        this.loading = false;
      }
    },
    
    async showSubjectDetails(code) {
      this.loadingDetails = true;
      this.detailError = false;
      this.detailErrorMessage = '';
      this.currentSubjectCode = code;
      this.showOverlay = true;
      
      try {
        const response = await axios.get(`http://localhost:1010/api/skolverket/subjects/${code}`);
        
        if (response.data && response.data.subject) {
          this.detailInfo = response.data;
          this.currentSubject = response.data.subject;
        } else {
          this.detailError = true;
          this.detailErrorMessage = 'Kunde inte hämta kursdetaljer.';
        }
      } catch (error) {
        console.error(`Error fetching details for subject ${code}:`, error);
        this.detailError = true;
        this.detailErrorMessage = `Kunde inte hämta kursdetaljer: ${error.message}. Kontrollera att API:et är tillgängligt.`;
      } finally {
        this.loadingDetails = false;
      }
    },
    
    retryFetchDetails() {
      if (this.currentSubjectCode) {
        this.showSubjectDetails(this.currentSubjectCode);
      }
    },
    
    closeOverlay() {
      this.showOverlay = false;
      this.currentSubject = null;
      this.detailInfo = null;
      this.expandedCourses = [];
      this.expandedSections = [];
      this.detailError = false;
      this.currentSubjectCode = null;
    },
    
    filterSubjects() {
      if (!this.searchTerm.trim()) {
        this.filteredSubjects = [...this.allSubjects];
        return;
      }
      
      const term = this.searchTerm.toLowerCase();
      this.filteredSubjects = this.allSubjects.filter(subject => 
        subject.name.toLowerCase().includes(term) ||
        subject.code.toLowerCase().includes(term)
      );
    },
    
    toggleCourse(code) {
      if (this.expandedCourses.includes(code)) {
        this.expandedCourses = this.expandedCourses.filter(c => c !== code);
      } else {
        this.expandedCourses.push(code);
      }
    },
    
    toggleSection(sectionId) {
      if (this.expandedSections.includes(sectionId)) {
        this.expandedSections = this.expandedSections.filter(s => s !== sectionId);
      } else {
        this.expandedSections.push(sectionId);
      }
    },
    
    formatContentArray(content) {
      if (Array.isArray(content)) {
        return content.map(item => {
          const text = item.text || item;
          return this.formatTextWithParagraphs(text);
        });
      } else if (typeof content === 'object') {
        return Object.values(content).map(item => {
          const text = item.text || item;
          return this.formatTextWithParagraphs(text);
        });
      }
      return [this.formatTextWithParagraphs(content)];
    },
    
    formatTextWithParagraphs(text) {
      if (!text) return '';
      
      // Replace periods followed by capital letters with period and line break
      let formattedText = text.replace(/\.(\s*)([A-ZÅÄÖ])/g, '.<br><br>$2');
      
      // Replace semicolons with semicolon and line break in certain contexts
      formattedText = formattedText.replace(/;(\s*)([a-zåäöA-ZÅÄÖ])/g, ';<br>$2');
      
      // Add spacing after bullet points and numbered lists
      formattedText = formattedText.replace(/•(\s*)([a-zåäöA-ZÅÄÖ])/g, '•<br>$2');
      formattedText = formattedText.replace(/(\d+\.)(\s*)([a-zåäöA-ZÅÄÖ])/g, '$1<br>$3');
      
      // Add spacing for dash-separated lists
      formattedText = formattedText.replace(/(\s*)-(\s*)([a-zåäöA-ZÅÄÖ])/g, '<br>- $3');
      
      return formattedText;
    },
    
    goBackToAdmin() {
      this.$router.push('/AdminTools');
    }
  }
};
</script>

<style scoped>
.kurser-container {
  padding: 20px;
  width: 90vw;
  max-width: 1200px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: #333;
  line-height: 1.6;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  margin-bottom: 30px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 20px;
  width: 100%;
}

.header-top {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
}

.header-top h1 {
  margin: 0 auto;
  text-align: center;
  flex-grow: 1;
  font-size: 2.2rem;
  color: #2c3e50;
}

.back-to-admin-button {
  position: absolute;
  left: 0;
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.back-to-admin-button:hover {
  background-color: #e9ecef;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.back-arrow {
  margin-right: 8px;
  font-size: 16px;
}

.search-container {
  margin: 20px 0 30px;
  position: relative;
  height: 60px;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 14px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  height: 50px;
}

.search-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 2px 10px rgba(52, 152, 219, 0.2);
}

.subjects-container {
  position: relative;
  min-height: 60vh;
  width: 100%;
  flex: 1;
}

.no-results {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  padding: 50px;
  background-color: #f9f9f9;
  border-radius: 12px;
  font-size: 1.1rem;
  color: #7f8c8d;
  width: 80%;
  max-width: 500px;
  z-index: 1;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.08);
}

.subjects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
  min-height: 60vh;
  width: 100%;
}

.subject-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  border: 1px solid #f0f0f0;
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.subject-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  border-color: #e0e0e0;
}

.subject-card h2 {
  margin-top: 0;
  color: #2c3e50;
  font-size: 1.4rem;
  margin-bottom: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.subject-card p {
  color: #7f8c8d;
  margin: 0;
  font-size: 0.95rem;
}

/* Loading and Error States */
.loading-container, .error-container {
  text-align: center;
  padding: 50px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.08);
  margin: 30px 0;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.loading-spinner {
  display: inline-block;
  width: 60px;
  height: 60px;
  border: 5px solid #f3f3f3;
  border-radius: 50%;
  border-top: 5px solid #3498db;
  animation: spin 1s linear infinite;
  margin-bottom: 25px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  color: #e74c3c;
}

.retry-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 20px;
  font-size: 16px;
  font-weight: 600;
  transition: background-color 0.3s;
}

.retry-button:hover {
  background-color: #2980b9;
}

/* Detail Overlay */
.detail-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.98);
  z-index: 1000;
  overflow-y: auto;
  display: none;
  padding: 20px;
}

.detail-overlay.active {
  display: block;
}

.detail-content {
  max-width: 850px;
  margin: 60px auto 40px;
  padding: 0;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.detail-header {
  background-color: #f8f9fa;
  padding: 30px 35px;
  border-bottom: 1px solid #eaeaea;
}

.detail-header h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 700;
}

.detail-body {
  padding: 35px;
}

.basic-info {
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  margin-top: 15px;
}

.info-item {
  flex: 1;
  min-width: 200px;
}

.back-button {
  position: fixed;
  top: 25px;
  left: 25px;
  padding: 12px 24px;
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  z-index: 1001;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.back-button:hover {
  background-color: #e9ecef;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.info-section {
  margin-bottom: 35px;
  padding-bottom: 25px;
  border-bottom: 1px solid #f0f0f0;
}

.info-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.section-title {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 20px;
  font-weight: 600;
}

.label {
  display: block;
  font-weight: 600;
  margin-bottom: 12px;
  color: #34495e;
  font-size: 1.1rem;
}

.value {
  line-height: 1.7;
  color: #333;
}

.content-text {
  font-size: 1rem;
  line-height: 1.8;
}

.content-text p {
  margin-bottom: 16px;
}

.content-text br {
  display: block;
  content: "";
  margin-top: 8px;
}

.content-list {
  padding-left: 20px;
  margin: 0;
}

.content-list li {
  margin-bottom: 16px;
  line-height: 1.7;
}

.content-list li:last-child {
  margin-bottom: 0;
}

/* Course sections */
.courses-section {
  margin-top: 40px;
}

.course-info {
  margin-bottom: 20px;
  border: 1px solid #eaeaea;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.course-header {
  padding: 18px 20px;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: background-color 0.2s;
}

.course-header:hover {
  background-color: #e9ecef;
}

.course-header h3 {
  margin: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;
  color: #2c3e50;
  font-weight: 600;
}

.course-content {
  padding: 0;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s ease-out;
  background-color: #fff;
}

.course-content.expanded {
  max-height: 3000px;
  padding: 25px;
}

.course-meta {
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 1rem;
}

.meta-label {
  font-weight: 600;
  color: #34495e;
}

.course-description {
  margin-bottom: 25px;
}

.dropdown-arrow {
  display: inline-block;
  transition: transform 0.3s;
  font-size: 0.8rem;
  color: #7f8c8d;
}

.dropdown-arrow.expanded {
  transform: rotate(180deg);
}

.content-section {
  margin-top: 20px;
  border-top: 1px solid #f0f0f0;
  padding-top: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 10px 0;
}

.section-header h4 {
  margin: 0;
  font-size: 1.1rem;
  color: #34495e;
  font-weight: 600;
}

.section-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s ease-out;
}

.section-content.expanded {
  max-height: 2000px;
  padding-top: 15px;
}

.grade-scale {
  padding: 10px 0;
}

.api-info {
  margin-top: 40px;
  padding: 25px 35px;
  border-top: 1px solid #eaeaea;
  font-size: 0.9rem;
  color: #7f8c8d;
  background-color: #f8f9fa;
}

.api-info .value p {
  margin: 5px 0;
}

@media (max-width: 992px) {
  .subjects-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .subjects-grid {
    grid-template-columns: 1fr;
  }
  
  .detail-content {
    margin: 50px auto 30px;
  }
  
  .detail-header, .detail-body {
    padding: 25px;
  }
  
  .basic-info {
    flex-direction: column;
    gap: 15px;
  }
  
  .back-button {
    top: 15px;
    left: 15px;
    padding: 10px 20px;
  }
  
  .back-to-admin-button {
    position: relative;
    margin-bottom: 15px;
  }
  
  .header-top {
    flex-direction: column;
  }
  
  .header-top h1 {
    font-size: 1.8rem;
    margin-top: 10px;
  }
}

.subject-card.empty {
  visibility: hidden;
  pointer-events: none;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  padding: 20px 0;
  width: 100%;
}

.pagination-button {
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 14px;
  color: #2c3e50;
  transition: all 0.3s ease;
}

.pagination-button:hover:not(:disabled) {
  background-color: #e9ecef;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  margin: 0 20px;
  font-size: 14px;
  color: #7f8c8d;
}

.description-text, .purpose-text {
  padding: 5px 0;
}

.purpose-text p {
  margin-bottom: 20px;
}

.central-content-text li {
  margin-bottom: 20px;
}

.central-content-text li:last-child {
  margin-bottom: 0;
}
</style>