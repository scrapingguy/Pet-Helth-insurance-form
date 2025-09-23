// Application Form JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const applicationForm = document.getElementById('applicationForm');
    const successModal = document.getElementById('successModal');
    
    // Initialize page
    loadFormData();
    loadOrderSummary();
    setupFormValidation();
    setupIbanFormatting();
    
    // Load saved form data from previous steps
    function loadFormData() {
        const petData = JSON.parse(localStorage.getItem('petInsuranceFormData') || '{}');
        const planData = JSON.parse(localStorage.getItem('selectedPlanData') || '{}');
        
        // Auto-fill PLZ from pet data if available
        if (petData.plz) {
            const plzPersonField = document.getElementById('plz_person');
            if (plzPersonField) {
                plzPersonField.value = petData.plz;
                // Auto-fill city if we have the mapping
                updateCityFromPLZ(petData.plz);
            }
        }
    }
    
    // Load and display order summary
    function loadOrderSummary() {
        const petData = JSON.parse(localStorage.getItem('petInsuranceFormData') || '{}');
        const planData = JSON.parse(localStorage.getItem('selectedPlanData') || '{}');
        
        // Update pet summary
        updatePetSummary(petData);
        
        // Update plan summary
        updatePlanSummary(planData);
        
        // Update pricing
        updatePricingSummary(planData);
    }
    
    function updatePetSummary(petData) {
        const petSummary = document.getElementById('pet-summary');
        if (!petSummary) return;
        
        const tierText = getPetTypeText(petData.tierKategorie || 'katze');
        const geschlechtText = getGenderText(petData.geschlecht || 'männlich');
        const rasse = petData.rasse || 'Nicht angegeben';
        const geburtsdatum = petData.geburtsdatum || 'Nicht angegeben';
        const plz = petData.plz || 'Nicht angegeben';
        
        petSummary.innerHTML = `
            <p><strong>Tier:</strong> ${tierText}</p>
            <p><strong>Geschlecht:</strong> ${geschlechtText}</p>
            <p><strong>Rasse:</strong> ${rasse}</p>
            <p><strong>Geburtsdatum:</strong> ${geburtsdatum}</p>
            <p><strong>PLZ:</strong> ${plz}</p>
        `;
    }
    
    function updatePlanSummary(planData) {
        const planSummary = document.getElementById('plan-summary');
        if (!planSummary) return;
        
        const planName = getPlanNameText(planData.plan || 'smart');
        const deductible = getDeductibleText(planData.deductible || '20');
        
        planSummary.innerHTML = `
            <p><strong>Tarif:</strong> ${planName}</p>
            <p><strong>Selbstbeteiligung:</strong> ${deductible}</p>
            <div style="margin-top: 15px; padding: 10px; background: #f0f8ff; border-radius: 4px; font-size: 12px; color: #666;">
                <p><strong>Leistungen im Überblick:</strong></p>
                ${getPlanFeatures(planData.plan || 'smart')}
            </div>
        `;
    }
    
    function updatePricingSummary(planData) {
        const monthlyPrice = document.getElementById('monthly-price');
        const deductibleInfo = document.getElementById('deductible-info');
        const paymentFrequency = document.getElementById('payment-frequency');
        const totalPrice = document.getElementById('total-price');
        
        if (monthlyPrice) {
            const price = planData.price || '35,80 €';
            monthlyPrice.textContent = price;
            
            if (totalPrice) {
                // Calculate total based on payment frequency
                const frequency = planData.paymentFrequency || 'monthly';
                const calculatedTotal = calculateTotalPrice(price, frequency);
                totalPrice.textContent = calculatedTotal;
            }
        }
        
        if (deductibleInfo) {
            deductibleInfo.textContent = getDeductibleText(planData.deductible || '20');
        }
        
        if (paymentFrequency) {
            paymentFrequency.textContent = getPaymentFrequencyText(planData.paymentFrequency || 'monthly');
        }
    }
    
    function calculateTotalPrice(monthlyPrice, frequency) {
        const price = parseFloat(monthlyPrice.replace(',', '.').replace(' €', ''));
        
        switch(frequency) {
            case 'monthly': return monthlyPrice;
            case 'quarterly': return `${(price * 3).toFixed(2).replace('.', ',')} € (vierteljährlich)`;
            case 'semi-annually': return `${(price * 6).toFixed(2).replace('.', ',')} € (halbjährlich)`;
            case 'yearly': return `${(price * 12).toFixed(2).replace('.', ',')} € (jährlich)`;
            default: return monthlyPrice;
        }
    }
    
    function getPlanFeatures(plan) {
        const features = {
            basis: [
                '✓ Jahreshöchstentschädigung: 3.000 €',
                '✓ GOT 2-fach',
                '✓ Nachbehandlung: bis 15 Tage'
            ],
            smart: [
                '✓ Jahreshöchstentschädigung: 7.500 €',
                '✓ GOT 4-fach',
                '✓ Nachbehandlung: bis 15 Tage',
                '✓ Rassespezifische Erkrankungen: bis 500 €'
            ],
            komfort: [
                '✓ Jahreshöchstentschädigung: unbegrenzt',
                '✓ GOT 4-fach',
                '✓ Nachbehandlung: bis 20 Tage',
                '✓ Rassespezifische Erkrankungen: bis 2.500 €'
            ]
        };
        
        return (features[plan] || features.smart).map(feature => 
            `<div style="margin: 3px 0;">${feature}</div>`
        ).join('');
    }
    
    // Setup form validation
    function setupFormValidation() {
        const requiredFields = document.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            field.addEventListener('blur', function() {
                validateField(this);
            });
            
            field.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
        
        // Email validation
        const emailField = document.getElementById('email');
        if (emailField) {
            emailField.addEventListener('blur', function() {
                validateEmail(this);
            });
        }
        
        // PLZ validation and city lookup
        const plzField = document.getElementById('plz_person');
        if (plzField) {
            plzField.addEventListener('input', function() {
                if (this.value.length === 5) {
                    updateCityFromPLZ(this.value);
                }
            });
        }
    }
    
    function validateField(field) {
        const value = field.value.trim();
        const isValid = value !== '';
        
        if (!isValid) {
            showFieldError(field, 'Dieses Feld ist erforderlich.');
            return false;
        }
        
        clearFieldError(field);
        return true;
    }
    
    function validateEmail(field) {
        const email = field.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            showFieldError(field, 'E-Mail-Adresse ist erforderlich.');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            showFieldError(field, 'Bitte geben Sie eine gültige E-Mail-Adresse ein.');
            return false;
        }
        
        clearFieldError(field);
        return true;
    }
    
    function showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    function clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }
    
    // IBAN formatting
    function setupIbanFormatting() {
        const ibanField = document.getElementById('iban');
        if (!ibanField) return;
        
        ibanField.addEventListener('input', function() {
            let value = this.value.replace(/\s/g, '').toUpperCase();
            
            // Add spaces every 4 characters
            let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
            
            // Limit to German IBAN length (22 characters + spaces)
            if (formatted.replace(/\s/g, '').length > 22) {
                formatted = formatted.substring(0, 27); // 22 chars + 5 spaces
            }
            
            this.value = formatted;
        });
        
        ibanField.addEventListener('blur', function() {
            validateIBAN(this);
        });
    }
    
    function validateIBAN(field) {
        const iban = field.value.replace(/\s/g, '');
        
        if (!iban) {
            showFieldError(field, 'IBAN ist erforderlich.');
            return false;
        }
        
        if (iban.length !== 22 || !iban.startsWith('DE')) {
            showFieldError(field, 'Bitte geben Sie eine gültige deutsche IBAN ein.');
            return false;
        }
        
        clearFieldError(field);
        return true;
    }
    
    // City lookup from PLZ
    function updateCityFromPLZ(plz) {
        const cityField = document.getElementById('ort');
        if (!cityField) return;
        
        // Simple PLZ to city mapping (demo data)
        const plzCityMap = {
            '10115': 'Berlin',
            '20095': 'Hamburg', 
            '80331': 'München',
            '50667': 'Köln',
            '60311': 'Frankfurt am Main',
            '70173': 'Stuttgart',
            '40213': 'Düsseldorf',
            '30159': 'Hannover',
            '90403': 'Nürnberg',
            '04109': 'Leipzig'
        };
        
        if (plzCityMap[plz]) {
            cityField.value = plzCityMap[plz];
        }
    }
    
    // Form submission
    if (applicationForm) {
        applicationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                submitApplication();
            }
        });
    }
    
    function validateForm() {
        let isValid = true;
        const requiredFields = document.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        // Validate email specifically
        const emailField = document.getElementById('email');
        if (emailField && !validateEmail(emailField)) {
            isValid = false;
        }
        
        // Validate IBAN
        const ibanField = document.getElementById('iban');
        if (ibanField && !validateIBAN(ibanField)) {
            isValid = false;
        }
        
        return isValid;
    }
    
    function submitApplication() {
        const submitBtn = applicationForm.querySelector('button[type="submit"]');
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Collect form data
        const formData = collectFormData();
        
        // Simulate API call
        setTimeout(() => {
            console.log('Application submitted:', formData);
            
            // Store application data
            localStorage.setItem('applicationData', JSON.stringify(formData));
            
            // Show success modal
            showSuccessModal();
            
            // Reset button
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }, 2000);
    }
    
    function collectFormData() {
        const formElements = applicationForm.querySelectorAll('input, select, textarea');
        const formData = {};
        
        formElements.forEach(element => {
            if (element.type === 'checkbox') {
                formData[element.name] = element.checked;
            } else if (element.type === 'radio') {
                if (element.checked) {
                    formData[element.name] = element.value;
                }
            } else {
                formData[element.name] = element.value;
            }
        });
        
        // Add timestamp
        formData.submissionTime = new Date().toISOString();
        formData.applicationNumber = generateApplicationNumber();
        
        return formData;
    }
    
    function generateApplicationNumber() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        
        return `TKV-${year}${month}${day}-${random}`;
    }
    
    function showSuccessModal() {
        successModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    window.closeSuccessModal = function() {
        successModal.classList.remove('show');
        document.body.style.overflow = '';
        
        // Optionally redirect or clear form
        // window.location.href = 'index.html';
    };
    
    // Utility functions
    function getPetTypeText(type) {
        switch(type) {
            case 'katze': return 'Katze';
            case 'hund': return 'Hund';
            case 'pferd': return 'Pferd';
            default: return type;
        }
    }
    
    function getGenderText(gender) {
        switch(gender) {
            case 'maennlich': return 'Männlich';
            case 'weiblich': return 'Weiblich';
            default: return gender;
        }
    }
    
    function getPlanNameText(plan) {
        switch(plan) {
            case 'basis': return 'Basis Tarif';
            case 'smart': return 'Smart Tarif';
            case 'komfort': return 'Komfort Tarif';
            default: return 'Smart Tarif';
        }
    }
    
    function getDeductibleText(deductible) {
        switch(deductible) {
            case 'no': return 'Keine';
            case '10': return '10%';
            case '20': return '20%';
            default: return '20%';
        }
    }
    
    function getPaymentFrequencyText(frequency) {
        switch(frequency) {
            case 'monthly': return 'Monatlich';
            case 'quarterly': return 'Vierteljährlich';
            case 'semi-annually': return 'Halbjährlich';
            case 'yearly': return 'Jährlich';
            default: return 'Monatlich';
        }
    }
    
    // Navigation
    window.goBack = function() {
        window.history.back();
    };
    
    // Auto-fill kontoinhaber with full name when name fields change
    const vornameField = document.getElementById('vorname');
    const nachnameField = document.getElementById('nachname');
    const kontoinhaberField = document.getElementById('kontoinhaber');
    
    function updateKontoinhaber() {
        if (vornameField && nachnameField && kontoinhaberField) {
            const vorname = vornameField.value.trim();
            const nachname = nachnameField.value.trim();
            
            if (vorname && nachname) {
                kontoinhaberField.value = `${vorname} ${nachname}`;
            }
        }
    }
    
    if (vornameField) vornameField.addEventListener('blur', updateKontoinhaber);
    if (nachnameField) nachnameField.addEventListener('blur', updateKontoinhaber);
});