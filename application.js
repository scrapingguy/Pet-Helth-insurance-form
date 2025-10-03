// Application Form JavaScript
class ApplicationForm {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 5;
        this.formData = {};
        this.uploadedFiles = {
            personal_id: [],
            vaccination_record: [],
            vet_reports: []
        };
        
        // Load selected plan data from previous page
        this.selectedPlan = this.loadSelectedPlan();
        
        this.init();
    }

    loadSelectedPlan() {
        try {
            const storedData = sessionStorage.getItem('selectedInsurancePlan');
            if (storedData) {
                return JSON.parse(storedData);
            }
        } catch (error) {
            console.warn('Konnte gespeicherte Tarifauswahl nicht laden:', error);
        }
        
        // Fallback data if no selection found
        return {
            selectedPlan: 'Smart',
            planTitle: 'Smart Tarif',
            monthlyPrice: '25,00 €',
            totalPrice: '25,00 €'
        };
    }

    init() {
        this.setupEventListeners();
        this.updateProgressIndicator();
        this.setupFileUploads();
        this.setupFormValidation();
        this.populateMinDates();
    }

    setupEventListeners() {
        // Continue button
        const continueButton = document.getElementById('continueButton');
        if (continueButton) {
            continueButton.addEventListener('click', () => this.nextStep());
        }

        // Back button
        const backButton = document.getElementById('backButton');
        if (backButton) {
            backButton.addEventListener('click', () => this.previousStep());
        }

        // Form field change tracking
        document.addEventListener('change', (e) => {
            if (e.target.matches('input, select, textarea')) {
                this.updateFormData();
                this.validateCurrentStep();
            }
        });

        // Radio button styling
        document.addEventListener('change', (e) => {
            if (e.target.type === 'radio') {
                this.updateRadioSelection(e.target);
            }
        });

        // Checkbox styling
        document.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                this.updateCheckboxSelection(e.target);
            }
        });

        // Conditional field visibility
        this.setupConditionalFields();
    }

    setupConditionalFields() {
        // Show/hide pre-existing conditions details
        const vorerkrankungenRadios = document.querySelectorAll('input[name="vorerkrankungen"]');
        vorerkrankungenRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                const detailsDiv = document.getElementById('vorerkrankungen_details');
                if (radio.value === 'ja' && radio.checked) {
                    detailsDiv.style.display = 'block';
                    document.getElementById('vorerkrankungen_beschreibung').required = true;
                } else if (radio.value === 'keine' && radio.checked) {
                    detailsDiv.style.display = 'none';
                    document.getElementById('vorerkrankungen_beschreibung').required = false;
                }
            });
        });

        // Show/hide previous insurance details
        const vorversicherungRadios = document.querySelectorAll('input[name="vorversicherung"]');
        vorversicherungRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                const detailsDiv = document.getElementById('vorversicherung_details');
                if (radio.value === 'ja' && radio.checked) {
                    detailsDiv.style.display = 'block';
                } else if (radio.value === 'nein' && radio.checked) {
                    detailsDiv.style.display = 'none';
                }
            });
        });
    }

    setupFormValidation() {
        // Real-time validation for specific fields
        const plzField = document.getElementById('plz');
        if (plzField) {
            plzField.addEventListener('input', (e) => {
                const value = e.target.value;
                if (value.length === 5 && /^\d{5}$/.test(value)) {
                    this.removeFieldError(e.target);
                }
            });
        }

        const emailField = document.getElementById('email');
        if (emailField) {
            emailField.addEventListener('blur', (e) => {
                if (this.isValidEmail(e.target.value)) {
                    this.removeFieldError(e.target);
                }
            });
        }

        const ibanField = document.getElementById('iban');
        if (ibanField) {
            ibanField.addEventListener('input', (e) => {
                // Remove spaces and convert to uppercase
                e.target.value = e.target.value.replace(/\s/g, '').toUpperCase();
                
                // Add spaces every 4 characters for better readability
                const formatted = e.target.value.replace(/(.{4})/g, '$1 ').trim();
                if (formatted !== e.target.value) {
                    e.target.value = formatted;
                }
            });
        }
    }

    populateMinDates() {
        // Set minimum date for insurance start (3 months from now)
        const versicherungsbeginn = document.getElementById('versicherungsbeginn');
        if (versicherungsbeginn) {
            const minDate = new Date();
            minDate.setMonth(minDate.getMonth() + 3);
            versicherungsbeginn.min = minDate.toISOString().split('T')[0];
            versicherungsbeginn.value = minDate.toISOString().split('T')[0];
        }

        // Set maximum date for customer birth date (18 years old minimum)
        const geburtsdatumKunde = document.getElementById('geburtsdatum_kunde');
        if (geburtsdatumKunde) {
            const maxDate = new Date();
            maxDate.setFullYear(maxDate.getFullYear() - 18);
            geburtsdatumKunde.max = maxDate.toISOString().split('T')[0];
        }

        // Set maximum date for pet birth date (today)
        const geburtsdatumTier = document.getElementById('geburtsdatum_tier');
        if (geburtsdatumTier) {
            const today = new Date();
            geburtsdatumTier.max = today.toISOString().split('T')[0];
        }
    }

    setupFileUploads() {
        const fileUploads = document.querySelectorAll('.file-upload');
        
        fileUploads.forEach(upload => {
            const input = upload.querySelector('input[type="file"]');
            const uploadType = upload.dataset.uploadType;
            
            // Click to upload
            upload.addEventListener('click', () => {
                input.click();
            });

            // File selection
            input.addEventListener('change', (e) => {
                this.handleFileSelection(e.files, uploadType);
            });

            // Drag and drop
            upload.addEventListener('dragover', (e) => {
                e.preventDefault();
                upload.classList.add('dragover');
            });

            upload.addEventListener('dragleave', () => {
                upload.classList.remove('dragover');
            });

            upload.addEventListener('drop', (e) => {
                e.preventDefault();
                upload.classList.remove('dragover');
                this.handleFileSelection(e.dataTransfer.files, uploadType);
            });
        });
    }

    handleFileSelection(files, uploadType) {
        const fileList = document.getElementById(`${uploadType}_files`);
        
        Array.from(files).forEach(file => {
            // Validate file
            if (!this.validateFile(file)) {
                return;
            }

            // Add to uploaded files
            this.uploadedFiles[uploadType].push({
                file: file,
                name: file.name,
                size: file.size,
                id: Date.now() + Math.random()
            });

            // Update UI
            this.updateFileList(uploadType, fileList);
        });

        this.validateCurrentStep();
    }

    validateFile(file) {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

        if (file.size > maxSize) {
            alert('Datei ist zu groß. Maximale Dateigröße: 5MB');
            return false;
        }

        if (!allowedTypes.includes(file.type)) {
            alert('Dateityp nicht unterstützt. Erlaubt: PDF, JPG, PNG');
            return false;
        }

        return true;
    }

    updateFileList(uploadType, container) {
        container.innerHTML = '';
        
        this.uploadedFiles[uploadType].forEach(fileObj => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-info">
                    <span>📎</span>
                    <span>${fileObj.name}</span>
                    <small>(${this.formatFileSize(fileObj.size)})</small>
                </div>
                <button type="button" class="file-remove" onclick="applicationForm.removeFile('${uploadType}', '${fileObj.id}')">
                    Entfernen
                </button>
            `;
            container.appendChild(fileItem);
        });
    }

    removeFile(uploadType, fileId) {
        this.uploadedFiles[uploadType] = this.uploadedFiles[uploadType].filter(f => f.id != fileId);
        const fileList = document.getElementById(`${uploadType}_files`);
        this.updateFileList(uploadType, fileList);
        this.validateCurrentStep();
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    updateRadioSelection(radio) {
        // Remove selected class from all options in the same group
        const group = document.querySelectorAll(`input[name="${radio.name}"]`);
        group.forEach(r => {
            r.closest('.radio-option').classList.remove('selected');
        });
        
        // Add selected class to current option
        radio.closest('.radio-option').classList.add('selected');
    }

    updateCheckboxSelection(checkbox) {
        const option = checkbox.closest('.checkbox-option');
        if (checkbox.checked) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            if (this.currentStep < this.totalSteps) {
                this.showStep(this.currentStep + 1);
            } else {
                this.submitApplication();
            }
        }
    }

    previousStep() {
        if (this.currentStep > 1) {
            this.showStep(this.currentStep - 1);
        }
    }

    showStep(stepNumber) {
        // Hide current step
        const currentStepElement = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        if (currentStepElement) {
            currentStepElement.style.display = 'none';
        }

        // Show new step
        const newStepElement = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
        if (newStepElement) {
            newStepElement.style.display = 'block';
        }

        this.currentStep = stepNumber;
        this.updateProgressIndicator();
        this.updateNavigationButtons();
        this.scrollToTop();

        // Update summary if on review step
        if (stepNumber === 5) {
            this.updateSummary();
        }
    }

    updateProgressIndicator() {
        const steps = document.querySelectorAll('.progress-step');
        
        steps.forEach((step, index) => {
            const stepNumber = index + 1;
            
            if (stepNumber < this.currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (stepNumber === this.currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
    }

    updateNavigationButtons() {
        const backButton = document.getElementById('backButton');
        const continueButton = document.getElementById('continueButton');

        // Update back button text
        if (this.currentStep === 1) {
            backButton.innerHTML = '← Zurück zur Tarifauswahl';
        } else {
            backButton.innerHTML = '← Zurück';
        }

        // Update continue button text
        const buttonTexts = {
            1: 'Weiter zu Tierinformationen →',
            2: 'Weiter zu Versicherungsdetails →',
            3: 'Weiter zu Dokumenten →',
            4: 'Weiter zur Prüfung →',
            5: 'Antrag verbindlich absenden 📋'
        };

        continueButton.innerHTML = buttonTexts[this.currentStep];

        // Update button styling for final step
        if (this.currentStep === 5) {
            continueButton.classList.add('btn-submit');
        } else {
            continueButton.classList.remove('btn-submit');
        }
    }

    validateCurrentStep() {
        const currentStepElement = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;

        // Clear previous errors
        this.clearErrors();

        // Validate required fields
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        // Step-specific validations
        if (this.currentStep === 4) {
            // Check required file uploads
            if (this.uploadedFiles.personal_id.length === 0) {
                this.showFieldError(document.querySelector('[data-upload-type="personal_id"]'), 'Bitte laden Sie eine Kopie Ihres Personalausweises hoch.');
                isValid = false;
            }
            if (this.uploadedFiles.vaccination_record.length === 0) {
                this.showFieldError(document.querySelector('[data-upload-type="vaccination_record"]'), 'Bitte laden Sie den Impfpass Ihres Tieres hoch.');
                isValid = false;
            }
        }

        // Enable/disable continue button
        const continueButton = document.getElementById('continueButton');
        continueButton.disabled = !isValid;

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        
        // Check if required field is empty
        if (field.required && !value) {
            this.showFieldError(field, 'Dieses Feld ist erforderlich.');
            return false;
        }

        // Email validation
        if (field.type === 'email' && value && !this.isValidEmail(value)) {
            this.showFieldError(field, 'Bitte geben Sie eine gültige E-Mail-Adresse ein.');
            return false;
        }

        // PLZ validation
        if (field.id === 'plz' && value && !/^\d{5}$/.test(value)) {
            this.showFieldError(field, 'Bitte geben Sie eine 5-stellige Postleitzahl ein.');
            return false;
        }

        // IBAN validation (basic)
        if (field.id === 'iban' && value && !this.isValidIBAN(value)) {
            this.showFieldError(field, 'Bitte geben Sie eine gültige IBAN ein.');
            return false;
        }

        // Radio group validation
        if (field.type === 'radio' && field.required) {
            const groupName = field.name;
            const checked = document.querySelector(`input[name="${groupName}"]:checked`);
            if (!checked) {
                this.showFieldError(field.closest('.radio-group'), 'Bitte wählen Sie eine Option.');
                return false;
            }
        }

        // Checkbox group validation (for required checkboxes)
        if (field.type === 'checkbox' && field.required && !field.checked) {
            this.showFieldError(field, 'Dieses Feld ist erforderlich.');
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidIBAN(iban) {
        // Remove spaces and convert to uppercase
        iban = iban.replace(/\s/g, '').toUpperCase();
        
        // Basic IBAN format check (simplified)
        if (iban.length < 15 || iban.length > 34) {
            return false;
        }
        
        if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(iban)) {
            return false;
        }
        
        return true;
    }

    showFieldError(field, message) {
        const formGroup = field.closest('.form-group') || field.closest('.form-section');
        formGroup.classList.add('error');
        
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    removeFieldError(field) {
        const formGroup = field.closest('.form-group');
        if (formGroup) {
            formGroup.classList.remove('error');
            const errorElement = formGroup.querySelector('.error-message');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        }
    }

    clearErrors() {
        const errorGroups = document.querySelectorAll('.form-group.error, .form-section.error');
        errorGroups.forEach(group => {
            group.classList.remove('error');
            const errorElement = group.querySelector('.error-message');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        });
    }

    updateFormData() {
        const form = document.getElementById('applicationForm');
        const formData = new FormData(form);
        
        for (let [key, value] of formData.entries()) {
            this.formData[key] = value;
        }
    }

    updateSummary() {
        // Personal data summary
        const name = `${this.getFieldValue('anrede')} ${this.getFieldValue('vorname')} ${this.getFieldValue('nachname')}`;
        document.getElementById('summary_name').textContent = name;
        
        const address = `${this.getFieldValue('strasse')}, ${this.getFieldValue('plz')} ${this.getFieldValue('ort')}`;
        document.getElementById('summary_address').textContent = address;
        
        const contact = `${this.getFieldValue('email')}, ${this.getFieldValue('telefon')}`;
        document.getElementById('summary_contact').textContent = contact;

        // Pet summary
        const pet = `${this.getFieldValue('tiername')} (${this.getFieldValue('tierart_detail')}, ${this.getFieldValue('rasse')})`;
        document.getElementById('summary_pet').textContent = pet;
        
        const vet = this.getFieldValue('tierarzt_name');
        document.getElementById('summary_vet').textContent = vet;

        // Insurance summary
        const tariff = this.selectedPlan ? this.selectedPlan.planTitle : 'Gewählter Tarif';
        document.getElementById('summary_tariff').textContent = tariff;
        
        const deductible = this.getFieldValue('selbstbeteiligung');
        document.getElementById('summary_deductible').textContent = deductible === '0' ? 'Keine Selbstbeteiligung' : `${deductible} € pro Jahr`;
        
        const payment = this.getFieldValue('zahlungsweise');
        document.getElementById('summary_payment').textContent = this.formatPaymentMethod(payment);
        
        // Update premium from selected plan
        const premium = this.selectedPlan ? this.selectedPlan.monthlyPrice : '€ XX,XX';
        document.getElementById('summary_premium').textContent = premium;
    }

    getFieldValue(fieldName) {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (!field) return '-';
        
        if (field.type === 'radio') {
            const checked = document.querySelector(`[name="${fieldName}"]:checked`);
            return checked ? checked.value : '-';
        }
        
        return field.value || '-';
    }

    formatPaymentMethod(method) {
        const methods = {
            'monatlich': 'Monatlich',
            'vierteljährlich': 'Vierteljährlich (3% Rabatt)',
            'halbjährlich': 'Halbjährlich (5% Rabatt)',
            'jährlich': 'Jährlich (10% Rabatt)'
        };
        return methods[method] || '-';
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    submitApplication() {
        if (!this.validateCurrentStep()) {
            return;
        }

        // Show loading state
        const continueButton = document.getElementById('continueButton');
        const originalText = continueButton.innerHTML;
        continueButton.innerHTML = '⏳ Antrag wird übermittelt...';
        continueButton.disabled = true;

        // Collect all form data
        this.updateFormData();
        
        // Simulate submission (replace with actual API call)
        setTimeout(() => {
            this.showSuccessMessage();
        }, 2000);
    }

    showSuccessMessage() {
        // Hide the form and show success message
        document.querySelector('.application-form').style.display = 'none';
        
        // Create success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-section';
        successMessage.innerHTML = `
            <div class="success-card">
                <div class="success-icon">✓</div>
                <h1>Vielen Dank für Ihren Antrag!</h1>
                <p class="success-message">
                    Ihr Antrag wurde erfolgreich übermittelt. Sie erhalten in Kürze eine Bestätigung per E-Mail 
                    mit allen Details und den nächsten Schritten.
                </p>
                <div class="success-details">
                    <h3>Was passiert als nächstes?</h3>
                    <ul style="text-align: left; max-width: 500px; margin: 0 auto;">
                        <li>✅ Sie erhalten eine E-Mail-Bestätigung</li>
                        <li>📋 Ihr Antrag wird geprüft (1-3 Werktage)</li>
                        <li>📞 Wir kontaktieren Sie bei Rückfragen</li>
                        <li>🛡️ Bei Annahme beginnt Ihr Versicherungsschutz</li>
                    </ul>
                </div>
                <div class="action-buttons" style="margin-top: 30px;">
                    <button class="btn-continue" onclick="window.location.href='index.html'">
                        Zurück zur Startseite
                    </button>
                </div>
            </div>
        `;
        
        document.querySelector('main').appendChild(successMessage);
    }
}

// Initialize the application form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.applicationForm = new ApplicationForm();
});

// Add some CSS for the success message
const style = document.createElement('style');
style.textContent = `
    .success-section {
        padding: 40px 20px;
        background: #f8f9fa;
        min-height: 60vh;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .success-card {
        background: white;
        border-radius: 12px;
        padding: 40px;
        max-width: 600px;
        text-align: center;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    
    .success-icon {
        width: 80px;
        height: 80px;
        background: #28a745;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40px;
        font-weight: bold;
        margin: 0 auto 30px;
    }
    
    .success-card h1 {
        font-size: 32px;
        color: #ff8c42;
        margin-bottom: 20px;
    }
    
    .success-message {
        font-size: 18px;
        color: #666;
        margin-bottom: 30px;
        line-height: 1.6;
    }
    
    .success-details {
        margin: 30px 0;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 8px;
    }
    
    .success-details h3 {
        color: #ff8c42;
        margin-bottom: 15px;
    }
    
    .success-details ul {
        list-style: none;
        padding: 0;
    }
    
    .success-details li {
        padding: 8px 0;
        color: #666;
    }
    
    .btn-submit {
        background: #28a745 !important;
        font-weight: bold;
    }
    
    .btn-submit:hover {
        background: #218838 !important;
    }
`;
document.head.appendChild(style);