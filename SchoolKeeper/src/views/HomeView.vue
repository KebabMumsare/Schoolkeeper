<script>
import axios from 'axios';
import { useStorage } from '@vueuse/core';
import Footer from '@/components/Footer.vue';
const currentUser = useStorage('currentUser', {})

export default {
  data() {
    return {
      message: '',
      email: '',
      password: '',
      errorMessage: '',
      isLoading: false,
      emailError: '',
      passwordError: '',
      formSubmitted: false,
      showHelpModal: false,
      activeHelpTab: 'faq',
      supportEmail: ''
    };
  },
  methods: {
    validateEmail() {
      this.emailError = '';
      if (!this.email) {
        this.emailError = 'E-post krävs';
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        this.emailError = 'Vänligen ange en giltig e-postadress';
        return false;
      }
      return true;
    },
    
    validatePassword() {
      this.passwordError = '';
      if (!this.password) {
        this.passwordError = 'Lösenord krävs';
        return false;
      }
      return true;
    },
    
    async submitLogin() {
      this.formSubmitted = true;
      this.errorMessage = '';
      
      const isEmailValid = this.validateEmail();
      const isPasswordValid = this.validatePassword();
      
      if (!isEmailValid || !isPasswordValid) {
        return;
      }
      
      try {
        this.isLoading = true;
        
        const response = await axios.post('http://localhost:1010/api/login', {
          email: this.email, 
          password: this.password
        });
        
        console.log('Login response:', response.data);
        this.setCurrentUser(response.data);
        this.message = response.data.message;

        window.location.href = '/start';
      } catch (error) {
        console.error('Login error:', error);
        
        if (error.response) {
          if (error.response.status === 401) {
            this.errorMessage = 'Felaktig e-post eller lösenord. Försök igen.';
          } else if (error.response.status === 404) {
            this.errorMessage = 'Användaren hittades inte. Kontrollera din e-post.';
          } else if (error.response.status === 403) {
            this.errorMessage = 'Ditt konto är låst. Kontakta en administratör.';
          } else {
            this.errorMessage = 'Inloggningen misslyckades. Försök igen senare.';
          }
        } else {
          this.errorMessage = 'Kunde inte ansluta till servern. Kontrollera din internetanslutning.';
        }
      } finally {
        this.isLoading = false;
      }
    },
    async setCurrentUser(user) {
      console.log('Setting user:', JSON.stringify(user));
      console.log('User groups:', user.groups);
      // Find the class group (for backward compatibility)
      const classGroup = user.groups?.find(g => g.type === 'class');
      console.log('Found class group:', classGroup);

      currentUser.value = {
        id: user._id,
        name: user.name,
        access: user.access,
        class: classGroup?.name || '', // Keep class for backward compatibility
        groups: user.groups?.map(g => g._id) || [], // Add all group IDs
      }

      console.log('Updated currentUser:', currentUser.value);
    },
    setActiveHelpTab(tab) {
      this.activeHelpTab = tab;
    },
    
    submitSupportRequest() {
      if (!this.supportEmail.trim()) {
        return;
      }
      
      // Here you would typically send this to your backend
      console.log('Support request submitted with email:', this.supportEmail);
      
      // Show confirmation and reset
      this.supportEmail = '';
      alert('Din förfrågan har skickats. En administratör kommer att kontakta dig inom kort.');
    }
  },
  components: {
    Footer,
  },
};
</script>


<template>
  <main class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h2>Välkommen till SchoolKeeper</h2>
        <p class="subtitle">Logga in för att fortsätta</p>
      </div>
      
      <form @submit.prevent="submitLogin" class="login-form">
        <div class="form-group" :class="{ 'has-error': emailError && formSubmitted }">
          <label for="email">E-post</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            placeholder="Ange din e-post" 
            required 
            autocomplete="email"
            @blur="validateEmail"
          />
          <div v-if="emailError && formSubmitted" class="field-error">{{ emailError }}</div>
        </div>

        <div class="form-group" :class="{ 'has-error': passwordError && formSubmitted }">
          <label for="password">Lösenord</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            placeholder="Ange ditt lösenord" 
            required 
            autocomplete="current-password"
            @blur="validatePassword"
          />
          <div v-if="passwordError && formSubmitted" class="field-error">{{ passwordError }}</div>
        </div>
        
        <div class="form-group">
          <button type="submit" class="login-button" :disabled="isLoading">
            <span v-if="isLoading" class="spinner"></span>
            <span v-else>Logga in</span>
          </button>
        </div>
      </form>
      
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      
      <div class="login-footer">
        <p><a href="#" @click.prevent="showHelpModal = true">Behöver du hjälp? Kontakta din administratör</a></p>
      </div>
    </div>
    
    <!-- Advanced Help Modal -->
    <transition name="fade">
      <div v-if="showHelpModal" class="help-modal-overlay" @click="showHelpModal = false">
        <div class="help-modal" @click.stop>
          <div class="help-modal-header">
            <h3>Supportcenter</h3>
            <button class="close-button" @click="showHelpModal = false">&times;</button>
          </div>
          
          <div class="help-tabs">
            <button 
              :class="['tab-button', { active: activeHelpTab === 'faq' }]" 
              @click="setActiveHelpTab('faq')"
            >
              <i class="tab-icon">❓</i> Vanliga frågor
            </button>
            <button 
              :class="['tab-button', { active: activeHelpTab === 'contact' }]" 
              @click="setActiveHelpTab('contact')"
            >
              <i class="tab-icon">✉️</i> Kontakt
            </button>
            <button 
              :class="['tab-button', { active: activeHelpTab === 'troubleshoot' }]" 
              @click="setActiveHelpTab('troubleshoot')"
            >
              <i class="tab-icon">🔧</i> Felsökning
            </button>
          </div>
          
          <div class="help-modal-content">
            <!-- FAQ Tab -->
            <div v-if="activeHelpTab === 'faq'" class="tab-content">
              <div class="faq-item" v-for="(item, index) in [
                { q: 'Jag har glömt mitt lösenord. Vad ska jag göra?', 
                  a: 'Kontakta din skoladministratör för att återställa ditt lösenord.' },
                { q: 'Varför kan jag inte logga in med mina uppgifter?', 
                  a: 'Ditt konto kan vara låst eller inaktiverat. Prova att rensa webbläsarens cache eller kontakta din administratör.' },
                { q: 'Hur uppdaterar jag min profilinformation?', 
                  a: 'Efter inloggning, gå till dina profilinställningar för att uppdatera din information.' },
                { q: 'Är mina uppgifter säkra?', 
                  a: 'Ja, vi använder branschstandard kryptering för att skydda alla användardata.' }
              ]" :key="index">
                <details>
                  <summary>{{ item.q }}</summary>
                  <p>{{ item.a }}</p>
                </details>
              </div>
            </div>
            
            <!-- Contact Tab -->
            <div v-if="activeHelpTab === 'contact'" class="tab-content">
              <div class="contact-card">
                <div class="contact-method">
                  <div class="contact-icon">📧</div>
                  <div class="contact-details">
                    <h4>E-postsupport</h4>
                    <p>Skicka e-post till <a href="mailto:support@schoolkeeper.edu">support@schoolkeeper.edu</a></p>
                  </div>
                </div>
                
                <div class="contact-method">
                  <div class="contact-icon">📞</div>
                  <div class="contact-details">
                    <h4>Telefonsupport</h4>
                    <p>Ring oss på <a href="tel:+11234567890">(123) 456-7890</a></p>
                    <p class="contact-hours">Tillgänglig måndag-fredag, 08:00-17:00</p>
                  </div>
                </div>
              </div>
              
              <div class="support-form">
                <h4>Begär support</h4>
                <p>Lämna din e-post så återkommer vi till dig</p>
                <div class="form-row">
                  <input 
                    type="email" 
                    v-model="supportEmail" 
                    placeholder="Din e-postadress"
                    class="support-input"
                  />
                  <button @click="submitSupportRequest" class="support-button">Skicka</button>
                </div>
              </div>
            </div>
            
            <!-- Troubleshoot Tab -->
            <div v-if="activeHelpTab === 'troubleshoot'" class="tab-content">
              <div class="troubleshoot-steps">
                <h4>Vanliga inloggningsproblem</h4>
                
                <div class="step">
                  <div class="step-number">1</div>
                  <div class="step-content">
                    <h5>Kontrollera dina uppgifter</h5>
                    <p>Se till att din e-post och lösenord är korrekt angivna. Lösenord är skiftlägeskänsliga.</p>
                  </div>
                </div>
                
                <div class="step">
                  <div class="step-number">2</div>
                  <div class="step-content">
                    <h5>Rensa webbläsarens cache</h5>
                    <p>Prova att rensa webbläsarens cache och cookies, starta sedan om webbläsaren.</p>
                    <button class="action-button" @click="window.location.reload(true)">Uppdatera sidan</button>
                  </div>
                </div>
                
                <div class="step">
                  <div class="step-number">3</div>
                  <div class="step-content">
                    <h5>Kontrollera internetanslutning</h5>
                    <p>Säkerställ att du har en stabil internetanslutning.</p>
                    <button class="action-button" @click="window.open('https://www.speedtest.net/', '_blank')">Testa anslutning</button>
                  </div>
                </div>
                
                <div class="step">
                  <div class="step-number">4</div>
                  <div class="step-content">
                    <h5>Fortfarande problem?</h5>
                    <p>Kontakta din administratör eller gå till Kontakt-fliken för supportalternativ.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </main>
  <Footer />
</template>

<style scoped>
.login-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4efe9 100%);
  position: relative;
  overflow: hidden;
}

.login-page::before {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
  border-radius: 50%;
  top: -150px;
  right: -150px;
  opacity: 0.4;
  filter: blur(30px);
  animation: float 8s ease-in-out infinite;
}

.login-page::after {
  content: '';
  position: absolute;
  width: 250px;
  height: 250px;
  background: linear-gradient(90deg, #FF9966 0%, #FF5E62 100%);
  border-radius: 50%;
  bottom: -125px;
  left: -125px;
  opacity: 0.4;
  filter: blur(30px);
  animation: float 10s ease-in-out infinite reverse;
}

@keyframes float {
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
  100% { transform: translateY(0) rotate(0deg); }
}

.login-container {
  max-width: 450px;
  width: 90%;
  margin: 0 auto;
  padding: 2.5rem;
  border-radius: 16px;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 10;
  animation: fadeIn 0.8s ease-out;
  border-top: 5px solid #4776E6;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
  margin-top: 0.5rem;
}

.login-form {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
  font-size: 1rem;
}

.form-group input {
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
}

.form-group input:focus {
  border-color: #4776E6;
  box-shadow: 0 0 0 3px rgba(71, 118, 230, 0.2);
  outline: none;
  background-color: #fff;
}

.form-group.has-error input {
  border-color: #f44336;
  background-color: rgba(244, 67, 54, 0.05);
}

.field-error {
  color: #f44336;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  animation: fadeIn 0.3s ease-out;
}

.login-button {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 10px rgba(71, 118, 230, 0.3);
}

.login-button:hover:not(:disabled) {
  background: linear-gradient(90deg, #3d6ae0 0%, #7e49d4 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(71, 118, 230, 0.4);
}

.login-button:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 5px rgba(71, 118, 230, 0.4);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  background-color: rgba(244, 67, 54, 0.1);
  color: #f44336;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  text-align: center;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.login-footer {
  text-align: center;
  margin-top: 2rem;
  color: #666;
  font-size: 0.9rem;
}

.login-footer a {
  color: #4776E6;
  text-decoration: none;
  transition: color 0.3s ease;
}

.login-footer a:hover {
  color: #8E54E9;
  text-decoration: underline;
}

/* Advanced Help Modal Styles */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.help-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.help-modal {
  background-color: white;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}

.help-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #eee;
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
}

.help-modal-header h3 {
  margin: 0;
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: white;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.close-button:hover {
  opacity: 1;
}

.help-tabs {
  display: flex;
  border-bottom: 1px solid #eee;
  background-color: #f9f9f9;
}

.tab-button {
  flex: 1;
  padding: 1rem 0.5rem;
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.tab-button.active {
  color: #4776E6;
  background-color: white;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
}

.tab-icon {
  margin-right: 0.5rem;
  font-style: normal;
}

.help-modal-content {
  padding: 0;
  overflow-y: auto;
  flex: 1;
}

.tab-content {
  padding: 1.5rem 2rem;
}

/* FAQ Tab Styles */
.faq-item {
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.faq-item details {
  padding-bottom: 1rem;
}

.faq-item summary {
  cursor: pointer;
  font-weight: 600;
  color: #333;
  padding: 0.8rem 0;
  position: relative;
  list-style: none;
}

.faq-item summary::-webkit-details-marker {
  display: none;
}

.faq-item summary::after {
  content: '+';
  position: absolute;
  right: 0;
  font-size: 1.2rem;
  color: #4776E6;
  transition: transform 0.3s ease;
}

.faq-item details[open] summary::after {
  transform: rotate(45deg);
}

.faq-item p {
  margin: 0.5rem 0 1rem;
  padding-left: 1rem;
  color: #666;
  line-height: 1.5;
}

/* Contact Tab Styles */
.contact-card {
  background-color: #f9f9f9;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.contact-method {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.contact-method:last-child {
  margin-bottom: 0;
}

.contact-icon {
  font-size: 1.8rem;
  margin-right: 1rem;
  background-color: rgba(71, 118, 230, 0.1);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.contact-details {
  flex: 1;
}

.contact-details h4 {
  margin: 0 0 0.5rem;
  color: #333;
}

.contact-details p {
  margin: 0;
  color: #666;
}

.contact-hours {
  font-size: 0.85rem;
  margin-top: 0.5rem !important;
  color: #888 !important;
}

.support-form {
  background-color: white;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 1.5rem;
}

.support-form h4 {
  margin: 0 0 0.5rem;
  color: #333;
}

.support-form p {
  margin: 0 0 1rem;
  color: #666;
}

.form-row {
  display: flex;
  gap: 0.5rem;
}

.support-input {
  flex: 1;
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.support-button {
  padding: 0.8rem 1.5rem;
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.support-button:hover {
  box-shadow: 0 4px 10px rgba(71, 118, 230, 0.3);
}

/* Troubleshoot Tab Styles */
.troubleshoot-steps {
  padding: 0.5rem;
}

.troubleshoot-steps h4 {
  margin: 0 0 1.5rem;
  color: #333;
  text-align: center;
}

.step {
  display: flex;
  margin-bottom: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 12px;
  padding: 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.step:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.step-number {
  width: 36px;
  height: 36px;
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 1rem;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-content h5 {
  margin: 0 0 0.5rem;
  color: #333;
}

.step-content p {
  margin: 0 0 0.8rem;
  color: #666;
}

.action-button {
  background-color: #f0f0f0;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  color: #4776E6;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button:hover {
  background-color: #e0e0e0;
}

@media (max-width: 768px) {
  .help-modal {
    width: 95%;
    max-height: 80vh;
  }
  
  .tab-button {
    padding: 0.8rem 0.3rem;
    font-size: 0.9rem;
  }
  
  .tab-content {
    padding: 1.2rem;
  }
  
  .form-row {
    flex-direction: column;
  }
  
  .support-button {
    margin-top: 0.5rem;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .login-container {
    padding: 2rem;
    width: 85%;
  }
  
  h2 {
    font-size: 1.8rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 1.5rem;
    width: 90%;
  }
  
  h2 {
    font-size: 1.6rem;
  }
  
  .form-group input {
    padding: 0.9rem;
  }
  
  .login-button {
    padding: 0.9rem;
  }
}
</style>

