<style scoped>
.classroom-view {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #f0f2f5;
}

main {
    flex-grow: 1;
    display: flex;
    padding: 2rem;
    margin-top: 5rem;
    /* Adjust based on your NavBar height */
}

.box-container {
    display: flex;
    width: calc(95vw - 50px); /* Subtract the width of the chat toggle button */
    height: calc(100vh - 10rem);
    /* Adjust based on your NavBar height and desired margins */
    gap: 1.5rem;
    margin-right: 50px; /* Add margin to avoid overlap with chat toggle */
}

.box {
    background-color: #fff;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.left-column {
    display: flex;
    flex-direction: column;
    width: 25%;
    gap: 1.5rem;
}

.info-box {
    background-color: #fff;
    flex: 0 0 auto;
    border-left: 4px solid #007bff;
}

.chat-box {
    background-color: #fff;
    flex: 1;
    display: flex;
    flex-direction: column;
    border-left: 4px solid #4CAF50;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
    width: 100%;
    height: 100%;
    border-top-left-radius: 8px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.chat-container.collapsed .chat-header,
.chat-container.collapsed .chat-messages,
.chat-container.collapsed .chat-input {
    visibility: hidden;
}

.chat-toggle {
    position: absolute;
    left: -50px;
    top: 50%;
    transform: translateY(-50%);
    background-color: #4CAF50;
    color: white;
    border: none;
    width: 50px;
    height: 50px;
    border-radius: 50% 0 0 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    box-shadow: -3px 0 10px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
    z-index: 101; /* Ensure toggle is above the content */
}

.chat-toggle:hover {
    background-color: #45a049;
    width: 55px;
    left: -55px;
}

.chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #eee;
}

.chat-header h2 {
    margin: 0;
    font-size: 1.4rem;
}

.chat-header h2::after {
    display: none;
}

.chat-close {
    background: none;
    border: none;
    color: #555;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 0.2rem;
    transition: all 0.2s ease;
}

.chat-close:hover {
    color: #333;
}

.right-box {
    background-color: #fff;
    flex: 1;
}

h2 {
    margin-top: 0;
    color: #333;
    font-size: 1.6rem;
    margin-bottom: 1.5rem;
    font-weight: 600;
    position: relative;
}

h2::after {
    content: '';
    display: block;
    width: 50px;
    height: 3px;
    background-color: #007bff;
    margin-top: 8px;
    position: absolute;
    bottom: -8px;
    left: 0;
}

p {
    margin: 0.75rem 0;
    color: #666;
    font-size: 1rem;
    line-height: 1.5;
}

strong {
    color: #333;
    font-weight: 600;
}

.chat-messages {
    flex-grow: 1;
    overflow-y: auto;
    margin-bottom: 15px;
    padding: 0.75rem;
    background-color: #f8f9fa;
    border-radius: 8px;
    max-height: calc(100% - 120px);
}

.chat-messages p {
    margin: 0.5rem 0;
    color: #555;
    font-size: 0.95rem;
    padding: 0.6rem 1rem;
    background-color: #e9ecef;
    border-radius: 12px;
    border-top-left-radius: 0;
    width: fit-content;
    max-width: 80%;
    word-break: break-word;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    animation: fadeIn 0.3s ease-out;
}

.chat-messages p strong {
    display: block;
    margin-bottom: 4px;
    color: #007bff;
    font-size: 0.85rem;
}

.chat-input {
    display: flex;
    margin-top: 10px;
    gap: 10px;
    background-color: #f8f9fa;
    padding: 12px;
    border-radius: 8px;
}

.chat-input input {
    flex-grow: 1;
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 20px;
    font-size: 0.95rem;
    transition: border-color 0.3s, box-shadow 0.3s;
    height: 40px;
    width: 80%;
}

.chat-input input:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    outline: none;
}

.chat-input button {
    padding: 0 15px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    font-size: 0.95rem;
    height: 40px;
    font-weight: 500;
    transition: background-color 0.3s;
}

.chat-input button:hover {
    background-color: #45a049;
    transform: translateY(-1px);
}

.assignments-list {
    margin-bottom: 1.5rem;
}

.assignment-item {
    background-color: #fff;
    border: 1px solid #e6e6e6;
    border-radius: 8px;
    margin-bottom: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    overflow: hidden;
}

.assignment-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.create-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 0.8rem 1.2rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    font-size: 1rem;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.create-button:hover {
    background-color: #0069d9;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
}

.create-button:active {
    transform: translateY(0);
}

.right-column {
    flex: 1;
    display: flex;
    gap: 1.5rem;
    position: relative;
}

.assignments-box {
    flex: 2;
    background-color: #fff;
    transition: flex 0.3s ease-out;
    border-left: 4px solid #ff9800;
}

.assignments-box.with-submissions {
    flex: 1.5;
}

.details-box {
    flex: 1;
    background-color: #fff;
    min-width: 300px;
    max-width: 400px;
    animation: slideIn 0.3s ease-out;
    transform-origin: right;
    border-left: 4px solid #9c27b0;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.assignment-details {
    padding: 1.5rem 0;
}

.assignment-details .description {
    margin: 1.5rem 0;
    line-height: 1.6;
    color: #555;
}

.submissions-list {
    margin-top: 1.5rem;
}

.submission-item {
    background-color: white;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    border: 1px solid #eee;
    transition: all 0.3s ease;
}

.submission-item:hover {
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    transform: translateY(-2px);
}

.student-name {
    font-weight: 600;
    display: block;
    margin-bottom: 0.35rem;
    color: #333;
    font-size: 1.05rem;
}

.submission-date {
    font-size: 0.85rem;
    color: #666;
    display: block;
    margin-bottom: 0.75rem;
}

.file-list {
    margin-top: 0.75rem;
}

.create-assignment {
    flex: 2;
    background-color: #fff;
    align-self: flex-start;
    border-radius: 8px;
    padding: 1.5rem;
}

.create-assignment h3 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: #333;
    font-size: 1.4rem;
    font-weight: 600;
}

.create-assignment form {
    display: flex;
    flex-direction: column;
}

.create-assignment input,
.create-assignment textarea {
    margin-bottom: 1rem;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.3s, box-shadow 0.3s;
}

.create-assignment input:focus,
.create-assignment textarea:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    outline: none;
}

.create-assignment textarea {
    height: 150px;
    resize: vertical;
    line-height: 1.5;
}

.modal {
    position: fixed !important;
    z-index: 1000 !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    height: 100% !important;
    background-color: rgba(0, 0, 0, 0.5) !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    animation: fadeIn 0.3s ease-out !important;
}

.modal-content {
    position: relative !important;
    background-color: #fff !important;
    padding: 2rem !important;
    border-radius: 8px !important;
    width: 90% !important;
    max-width: 600px !important;
    max-height: 85vh !important;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
    overflow-y: auto !important;
    animation: zoomIn 0.3s ease-out !important;
}

.modal-buttons {
    display: flex;
    justify-content: flex-end;
    margin-top: 1.5rem;
    gap: 1rem;
}

.cancel-button {
    background-color: #f44336;
    color: white;
    border: none;
    padding: 0.8rem 1.2rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.3s;
}

.cancel-button:hover {
    background-color: #d32f2f;
}

/* Adjust the create-button style to be used in both places */
.create-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 0.8rem 1.2rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.3s;
}

.create-button:hover {
    background-color: #0069d9;
}

/* Styles for the create assignment form within the modal */
.create-assignment {
    background-color: #fff;
    border-radius: 8px;
    padding: 0;
}

.create-assignment h3 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: #333;
    font-size: 1.5rem;
    font-weight: 600;
    position: relative;
}

.create-assignment h3::after {
    content: '';
    display: block;
    width: 50px;
    height: 3px;
    background-color: #007bff;
    position: absolute;
    bottom: -8px;
    left: 0;
}

.create-assignment form {
    display: flex;
    flex-direction: column;
}

.create-assignment input,
.create-assignment textarea {
    margin-bottom: 1rem;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.3s, box-shadow 0.3s;
}

.create-assignment input:focus,
.create-assignment textarea:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    outline: none;
}

.create-assignment textarea {
    height: 150px;
    resize: vertical;
    line-height: 1.5;
}

.v-expansion-panel-title--active {
    background-color: #f8f9fa !important;
    font-weight: 600;
    font-size: 1.1rem;
    color: #007bff !important;
}

.v-expansion-panel-title {
    transition: all 0.3s ease;
    padding: 12px 16px !important;
}

.v-expansion-panel-title:hover {
    background-color: #f5f5f5;
}

.v-expansion-panel-text {
    padding: 16px !important;
    font-size: 1rem !important;
}

/* Optional: If you want to adjust the icon position */
.v-expansion-panel-title__icon {
    margin-right: 10px !important;
}

/* Make the expansion panels more compact */
.v-expansion-panels {
    width: 100% !important;
    border-radius: 8px !important;
    overflow: hidden !important;
}

.v-expansion-panel {
    box-shadow: none !important;
    border: 1px solid #e6e6e6 !important;
    margin-bottom: 1rem !important;
    overflow: hidden !important;
    transition: all 0.3s ease !important;
    border-radius: 8px !important;
}

.v-expansion-panel:hover {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1) !important;
}

.v-expansion-panel-text__wrapper {
    padding: 0 !important;
}

.v-expansion-panel-text {
    padding: 16px !important;
    font-size: 1rem !important;
}

.assignment-title-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.due-date {
    font-size: 0.9rem;
    color: #666;
    margin-right: 24px; /* Add space for the expansion icon */
    background-color: #eff6ff;
    padding: 4px 10px;
    border-radius: 20px;
}

.message-container {
    display: flex;
    align-items: flex-start;
    gap: 1.5rem;
    padding: 1rem 0 !important;
    margin: 0 !important;
}

.message-container p {
    flex: 1;
    line-height: 1.6;
    color: #555;
}

.side-box {
    width: 30%;
    max-height: 100%;
    background-color: #f8f9fa;
    padding: 1.2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    font-size: 0.95rem;
    border: 1px solid #e6e6e6;
}

.side-box h3 {
    font-size: 1.1rem;
    margin-top: 0;
    margin-bottom: 1rem;
    color: #333;
    font-weight: 600;
}

.file-upload {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
}

.file-input {
    position: relative;
    padding: 2.5rem 1.5rem;
    border: 2px dashed #007bff;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.95rem;
    text-align: center;
    background-color: #f8f9fa;
    transition: all 0.3s ease;
}

.file-input::before {
    content: 'Drop files here or click to upload';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #007bff;
    pointer-events: none;
    font-weight: 500;
}

.file-input:hover {
    border-color: #0056b3;
    background-color: #e8f4ff;
}

/* Hide the default file input appearance */
.file-input input[type="file"] {
    opacity: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
}

.selected-files {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
}

.file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    padding: 0.6rem 0.8rem;
    border-radius: 6px;
    border: 1px solid #e6e6e6;
    font-size: 0.9rem;
    transition: all 0.2s ease;
}

.file-item:hover {
    background-color: #f8f9fa;
    border-color: #ddd;
}

.remove-file {
    background: none;
    border: none;
    color: #f44336;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 0 0.5rem;
    transition: color 0.2s ease;
}

.remove-file:hover {
    color: #d32f2f;
}

.submit-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 0.75rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    text-align: center;
}

.submit-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

.submit-button:not(:disabled):hover {
    background-color: #0069d9;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
}

.v-expansion-panel--inactive .v-expansion-panel-text__wrapper {
    max-height: 0 !important;
    min-height: 0 !important;
    padding: 0 !important;
}

/* Add these custom scrollbar styles for the chat messages */
.chat-messages::-webkit-scrollbar {
    width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
    background: #f8f9fa;
    border-radius: 6px;
}

.chat-messages::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 6px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
    background: #aaa;
}

/* For Firefox */
.chat-messages {
    scrollbar-width: thin;
    scrollbar-color: #ccc #f8f9fa;
}

.submitted-files {
    margin-top: 1.2rem;
}

.submitted-files h4 {
    margin-bottom: 0.75rem;
    font-size: 0.95rem;
    color: #555;
    font-weight: 600;
}

.file-actions {
    display: flex;
    gap: 0.5rem;
}

.download-file {
    background: none;
    border: none;
    color: #007bff;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 0 0.5rem;
    transition: color 0.2s ease;
}

.download-file:hover {
    color: #0056b3;
}

/* Add these styles */
.file-display {
    margin: 1.2rem 0;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
}

.selected-files, .submitted-files {
    background-color: #fff;
    border-radius: 6px;
    padding: 0.8rem;
    border: 1px solid #e6e6e6;
}

.selected-files h4, .submitted-files h4 {
    margin-top: 0;
    margin-bottom: 0.75rem;
    font-size: 0.95rem;
    color: #555;
    border-bottom: 1px solid #eee;
    padding-bottom: 0.5rem;
    font-weight: 600;
}

.file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0.8rem;
    background-color: #f8f9fa;
    border-radius: 6px;
    margin-bottom: 0.5rem;
    transition: all 0.2s ease;
}

.file-item:last-child {
    margin-bottom: 0;
}

.file-item:hover {
    background-color: #eff6ff;
}

.file-item span {
    font-size: 0.9rem;
    color: #333;
}

.file-info {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}

.file-name {
    font-weight: 500;
    color: #333;
}

.submission-date {
    font-size: 0.8rem;
    color: #666;
}

.file-actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.download-file {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.2rem 0.5rem;
    font-size: 1.1rem;
    color: #007bff;
    transition: color 0.2s ease;
}

.download-file:hover {
    color: #0056b3;
}

.remove-file {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.2rem 0.5rem;
    font-size: 1.1rem;
    color: #f44336;
    transition: color 0.2s ease;
}

.remove-file:hover {
    color: #d32f2f;
}

.details-box {
    flex: 1;
    background-color: #fff;
    min-width: 300px;
    max-width: 400px;
    animation: slideIn 0.3s ease-out;
    transform-origin: right;
    border-left: 4px solid #9c27b0;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes zoomIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
}

/* Optional: Add transition for when the box disappears */
.right-column {
    flex: 1;
    display: flex;
    gap: 1.5rem;
    position: relative;
}

/* Alternative using Vue transition */
.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(30px);
    opacity: 0;
}

.file-actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.download-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background-color: #007bff;
    color: white;
    border: none;
    padding: 0.6rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.3s ease;
}

.download-button:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
}

.details-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #eee;
}

.details-header h2 {
    margin: 0;  /* Remove default margin to ensure proper alignment */
    padding-bottom: 0;
}

.details-header h2::after {
    display: none;
}

/* Box scrollbars */
.box::-webkit-scrollbar {
    width: 6px;
}

.box::-webkit-scrollbar-track {
    background: transparent;
}

.box::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 6px;
}

.box::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.3);
}

/* For Firefox */
.box {
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

/* Right column for chat */
.chat-container {
    position: fixed;
    right: 0;
    top: 5rem; /* Adjust based on your NavBar height */
    bottom: 0;
    width: 350px;
    z-index: 100;
    transition: transform 0.3s ease;
    display: flex;
}

.chat-container.collapsed {
    transform: translateX(346px);  /* Show only the 4px green border */
}

.chat-box {
    background-color: #fff;
    flex: 1;
    display: flex;
    flex-direction: column;
    border-left: 4px solid #4CAF50;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
    width: 100%;
    height: 100%;
    border-top-left-radius: 8px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.chat-container.collapsed .chat-header,
.chat-container.collapsed .chat-messages,
.chat-container.collapsed .chat-input {
    visibility: hidden;
}

.chat-toggle {
    position: absolute;
    left: -50px;
    top: 50%;
    transform: translateY(-50%);
    background-color: #4CAF50;
    color: white;
    border: none;
    width: 50px;
    height: 50px;
    border-radius: 50% 0 0 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    box-shadow: -3px 0 10px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
    z-index: 101; /* Ensure toggle is above the content */
}

.chat-toggle:hover {
    background-color: #45a049;
    width: 55px;
    left: -55px;
}

.chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #eee;
}

.chat-header h2 {
    margin: 0;
    font-size: 1.4rem;
}

.chat-header h2::after {
    display: none;
}

.chat-close {
    background: none;
    border: none;
    color: #555;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 0.2rem;
    transition: all 0.2s ease;
}

.chat-close:hover {
    color: #333;
}
</style>

<template>
    <div class="classroom-view">
        <NavBar site="files" :currentUser="currentUser" />
        <main>
            <div class="box-container">
                <div class="left-column">
                    <div class="box info-box">
                        <h2>{{ classroom.name }}</h2>
                        <p><strong>Uppgift:</strong> {{ classroom.subject }}</p>
                        <p><strong>Klass:</strong> {{ classroom.class }}</p>
                    </div>
                </div>
                <div class="right-column">
                    <div class="box assignments-box" :class="{ 'with-submissions': selectedAssignment }">
                        <h2>Uppgifter</h2>
                        <div class="assignments-list">
                            <v-expansion-panels v-for="assignment in assignments" :key="assignment._id">
                                <v-expansion-panel @click="toggleAssignment(assignment)">
                                    <v-expansion-panel-title :class="{ 'v-expansion-panel-title--active': $attrs.modelValue }">
                                        <div class="assignment-title-container">
                                            <span>{{ assignment.title }}</span>
                                            <span class="due-date">Due: {{ new Date(assignment.due_date).toLocaleDateString() }}</span>
                                        </div>
                                    </v-expansion-panel-title>
                                    <v-expansion-panel-text>
                                        <div class="message-container">
                                            <p>{{ assignment.message }}</p>
                                            <div v-if="currentUser.access === 'Elev'" class="side-box">
                                                <h3>Lämmna in Uppgift</h3>
                                                <div class="file-upload">
                                                    <div class="file-input">
                                                        <input 
                                                            type="file" 
                                                            ref="fileInput" 
                                                            @change="handleFileChange" 
                                                            multiple
                                                        >
                                                    </div>
                                                    <div class="file-display">
                                                        <div class="selected-files" v-if="selectedFiles.length">
                                                            <h4>Selected Files:</h4>
                                                            <div v-for="(file, index) in selectedFiles" :key="'selected-' + index" class="file-item">
                                                                <span>{{ file.name }}</span>
                                                                <button @click="removeFile(index)" class="remove-file">×</button>
                                                            </div>
                                                        </div>

                                                        <div class="submitted-files">
                                                            <h4>Inlämnade Filer:</h4>
                                                            <div v-if="Object.keys(submittedFiles).length > 0">
                                                                <div v-for="submission in submittedFiles[assignment._id] || []" :key="submission._id" class="file-item">
                                                                    <div class="file-info">
                                                                        <span class="file-name">{{ submission.file_names[0] }}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div v-else>
                                                                Inga inlämnade filer i denna uppgift
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        @click="() => submitFiles(assignment._id)" 
                                                        class="submit-button"
                                                        :disabled="!selectedFiles.length"
                                                    >
                                                        Lämmna in
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </v-expansion-panel-text>
                                </v-expansion-panel>
                            </v-expansion-panels>
                        </div>
                        <button v-if="currentUser.access === 'Admin' || currentUser.access === 'Lärare'"
                            @click="openModal" class="create-button">
                            Skapa ny Uppgift
                        </button>
                    </div>
                    
                    <Transition name="slide-fade">
                        <div v-if="selectedAssignment && (currentUser.access === 'Lärare' || currentUser.access === 'Admin')" class="box details-box">
                            <div class="details-header">
                                <h2>Inlämningar</h2>
                                <div class="file-actions">
                                    <button class="download-button" @click="downloadAssignment">
                                        Ladda ner alla
                                    </button>
                                </div>
                            </div>
                            <div class="submissions-list">
                                <div v-if="allSubmissions.length > 0">
                                    <div v-for="submission in allSubmissions.filter(submission => submission.assignment_id === selectedAssignment._id)" 
                                         :key="submission._id" 
                                         class="submission-item">
                                        <span class="student-name">{{ getStudentName(submission.student_id) }}</span>
                                        <span class="submission-date">{{ new Date(submission.created_at).toLocaleDateString() }}</span>
                                        <div class="file-list">
                                            <div v-for="file in submission.file_names" :key="file" class="file-item">
                                                <span>{{ file }}</span>
                                                <div class="file-actions">
                                                    <button class="download-button">
                                                        Ladda ner
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p v-else>Inga inlämningar än</p>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        </main>

        <!-- Chat container (fixed on right side) -->
        <div class="chat-container" :class="{ 'collapsed': isChatCollapsed }">
            <button class="chat-toggle" @click="toggleChat">
                <span v-if="isChatCollapsed">💬</span>
                <span v-else>→</span>
            </button>
            <div class="chat-box">
                <div class="chat-header">
                    <h2>Chat</h2>
                    <button class="chat-close" @click="closeChat">×</button>
                </div>
                <div class="chat-messages">
                    <p v-for="(message, index) in messages" :key="index">
                        <strong>{{ message.user_id }}</strong>
                        {{ message.message }}
                    </p>
                </div>
                <div class="chat-input">
                    <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Skriv ett meddelande..." />
                    <button @click="sendMessage">Skicka</button>
                </div>
            </div>
        </div>

        <!-- Modal for creating assignments -->
        <div v-if="showModal" class="modal">
            <div class="modal-content create-assignment">
                <h3>Skappa ny Uppgift</h3>
                <form @submit.prevent="createAssignment">
                    <input v-model="newAssignment.title" placeholder="Assignment Title" required>
                    <textarea v-model="newAssignment.message" placeholder="Assignment Description" required></textarea>
                    <input v-model="newAssignment.due_date" type="date" required>
                    <div class="modal-buttons">
                        <button type="submit" class="create-button">Skappa ny Uppgift</button>
                        <button @click="showModal = false" class="cancel-button">Avbryt</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <Footer />
</template>

<script>
import NavBar from '@/components/Nav-Bar.vue';
import { useStorage } from "@vueuse/core";
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
    name: 'Classroom',
    components: {
        NavBar
    },
    data() {
        return {
            currentUser: useStorage('currentUser', { id: '', name: '', access: '', class: '' }),
            classroom: { name: 'Loading...', subject: '', class: '' },
            messages: [],
            newMessage: '',
            assignments: [],
            newAssignment: {
                title: '',
                message: '',
                due_date: ''
            },
            showModal: false,
            selectedFiles: [],
            submittedFiles: {},
            allSubmissions: {},
            selectedAssignment: null,
            isChatCollapsed: true
        }
    },
    setup() {
        const router = useRouter();
        return { router };
    },
    methods: {
        async fetchClassroom() {
            try {
                const response = await axios.get(`http://localhost:1010/api/classrooms/${this.$route.params.id}`);
                this.classroom = response.data;
                this.fetchChat(); // Fetch chat messages after classroom data is loaded
            } catch (error) {
                console.error('Error fetching classroom:', error);
            }
        },
        async fetchChat() {
            try {
                const response = await axios.get(`http://localhost:1010/api/chats/${this.classroom._id}`);
                this.messages = response.data;
            } catch (error) {
                console.error('Error fetching chat:', error);
            }
        },
        async sendMessage() {
            if (this.newMessage.trim()) {
                try {
                    const payload = {
                        message: this.newMessage,
                        classroom_id: this.$route.params.id,
                        user_id: this.currentUser.name,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    };
                    console.log('Sending message payload:', payload);
                    const response = await axios.post('http://localhost:1010/api/chats', payload);
                    console.log('Server response:', response.data);
                    this.messages.push(response.data);
                    this.newMessage = '';
                } catch (error) {
                    console.error('Error sending message:', error.response ? error.response.data : error.message);
                }
            }
        },
        async fetchAssignments() {
            try {
                const response = await axios.get(`http://localhost:1010/api/assignments/${this.$route.params.id}`);
                this.assignments = response.data;
            } catch (error) {
                console.error('Error fetching assignments:', error);
            }
        },
        async fetchSubmissions() {
            try {
                const response = await axios.get(`http://localhost:1010/api/submissions/${this.$route.params.id}/${this.currentUser.id}`);
                console.log('Raw submissions response:', response.data);
                
                // Transform the data if needed
                const submissions = response.data;
                if (Array.isArray(submissions)) {
                    // Group submissions by assignment ID
                    this.submittedFiles = submissions.reduce((acc, submission) => {
                        if (!acc[submission.assignment_id]) {
                            acc[submission.assignment_id] = [];
                        }
                        acc[submission.assignment_id].push(submission);
                        return acc;
                    }, {});
                } else {
                    this.submittedFiles = submissions; // If data is already in the correct format
                }
                
                console.log('Submitted files after assignment:', this.submittedFiles);
            } catch (error) {
                console.error('Error fetching submissions:', error);
            }
        },
        async fetchAllSubmissions() {
            try {
                const response = await axios.get(`http://localhost:1010/api/submissions/${this.$route.params.id}`);
                this.allSubmissions = response.data;
                console.log('All submissions:', this.allSubmissions);
            } catch (error) {
                console.error('Error fetching all submissions:', error);
            }
        },
        async createAssignment() {
            if (this.newAssignment.title && this.newAssignment.message && this.newAssignment.due_date) {
                try {
                    const payload = {
                        ...this.newAssignment,
                        classroom_id: this.$route.params.id,
                        created_at: new Date().toISOString(),
                    };
                    const response = await axios.post('http://localhost:1010/api/assignments', payload);
                    this.assignments.push(response.data);
                    this.newAssignment = { title: '', message: '', due_date: '' };
                    this.showModal = false;

                    // Navigate to the newly created assignment under the classroom
                    this.router.push({ name: 'assignment', params: { id: this.$route.params.id, assignmentId: response.data._id } });
                } catch (error) {
                    console.error('Error creating assignment:', error);
                }
            }
        },
        async deleteSubmission(assignmentId, fileId) {
            if (!confirm('Are you sure you want to delete this submission?')) return;
            
            try {
                await axios.delete(`http://localhost:1010/files/submission/${fileId}`);
                await this.fetchSubmissions();
            } catch (error) {
                console.error('Error deleting submission:', error);
                alert('Error deleting submission');
            }
        },
        async submitFiles(assignmentId) {
            if (!this.selectedFiles.length) return;

            const formData = new FormData();
            this.selectedFiles.forEach(file => {
                formData.append('files', file);
            });

            try {
                await axios.post(
                    `http://localhost:1010/files/submit/${this.$route.params.id}/${assignmentId}/${this.currentUser.id}`, 
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                
                // Clear selected files
                this.selectedFiles = [];
                this.$refs.fileInput.value = '';
                
                // Fetch updated submitted files
                await this.fetchSubmissions();
            } catch (error) {
                console.error('Error submitting files:', error);
                alert('Error submitting files. Please try again.');
            }
        },
        async downloadFile(filePath, fileName) {
            try {
                const response = await axios.get(
                    `http://localhost:1010/api/download/${filePath}`,
                    { responseType: 'blob' }
                );
                
                // Create blob link to download
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Error downloading file:', error);
                alert('Error downloading file. Please try again.');
            }
        },
        async deleteSubmission(assignmentId, submissionId) {
            if (!confirm('Are you sure you want to delete this submission?')) return;
            
            try {
                await axios.delete(`http://localhost:1010/api/submissions/${submissionId}`);
                // Update the local state after successful deletion
                if (this.submittedFiles[assignmentId]) {
                    this.submittedFiles[assignmentId] = this.submittedFiles[assignmentId]
                        .filter(submission => submission._id !== submissionId);
                }
            } catch (error) {
                console.error('Error deleting submission:', error);
                alert('Error deleting submission. Please try again.');
            }
        },
        async downloadAssignment() {
            try {
                const response = await axios.get(`http://localhost:1010/api/download/${this.selectedAssignment._id}`,
                { responseType: 'blob' }
                );
                
                // Create blob link to download
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${this.selectedAssignment.message}.zip`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Error downloading assignment:', error);
            }
        },
        getSubmissionsForAssignment(assignmentId) {
            console.log('Submitted files:', this.allSubmissions[assignmentId]);
            return this.allSubmissions[assignmentId] || [];
        },
        toggleAssignment(assignment) {
            this.selectedAssignment = this.selectedAssignment?._id === assignment._id ? null : assignment;
        },
        getStudentName(studentId) {
            const submission = this.allSubmissions.find(submission => submission.student_id === studentId);

            return submission.student_id.name;
        },
        openModal() {
            this.showModal = true;
            console.log('Modal should be open:', this.showModal);
        },
        handleFileChange(event) {
            const newFiles = Array.from(event.target.files);
            this.selectedFiles = [...this.selectedFiles, ...newFiles];
        },
        removeFile(index) {
            this.selectedFiles.splice(index, 1);
        },
        toggleChat() {
            this.isChatCollapsed = !this.isChatCollapsed;
        },
        closeChat() {
            this.isChatCollapsed = true;
        },
    },
    async mounted() {
        try {
            await this.fetchClassroom();
            await this.fetchAssignments();
            await this.fetchSubmissions();
            if (this.currentUser.access === 'Admin' || this.currentUser.access === 'Lärare') {
                await this.fetchAllSubmissions();
            }
        } catch (error) {
            console.error('Error initializing classroom data:', error);
        }
    },
}
</script>