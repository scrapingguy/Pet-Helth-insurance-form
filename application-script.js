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
    setupDateInputs();
    
    // Load saved form data from previous steps
    function loadFormData() {
        const petData = JSON.parse(localStorage.getItem('petInsuranceFormData') || '{}');
        const planData = JSON.parse(localStorage.getItem('selectedPlanData') || '{}');
        
        // Create sample data if none exists (for testing)
        if (!petData.tierKategorie && !planData.plan) {
            const samplePetData = {
                tierKategorie: 'katze',
                geschlecht: 'weiblich',
                rasse: 'Hauskatze',
                geburtsdatum: '2020-05-15',
                plz: '12345'
            };
            const samplePlanData = {
                plan: 'smart',
                deductible: '20',
                price: '35,80 €',
                paymentFrequency: 'monthly'
            };
            
            localStorage.setItem('petInsuranceFormData', JSON.stringify(samplePetData));
            localStorage.setItem('selectedPlanData', JSON.stringify(samplePlanData));
            
            console.log('Created sample data for testing');
        }
        
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
        
        let medicalTreatmentInfo = '';
        if (planData.medicalTreatment && planData.medicalTreatment.selected) {
            medicalTreatmentInfo = `
                <div style="margin-top: 10px; padding: 10px; background: #e3f2fd; border-radius: 4px;">
                    <p><strong>Medical Treatment:</strong> ${planData.medicalTreatment.description}</p>
                    <p><strong>Additional Cost:</strong> ${planData.medicalTreatment.price} per month</p>
                </div>
            `;
        }
        
        planSummary.innerHTML = `
            <p><strong>Tarif:</strong> ${planName}</p>
            <p><strong>Selbstbeteiligung:</strong> ${deductible}</p>
            <div style="margin-top: 15px; padding: 10px; background: #f0f8ff; border-radius: 4px; font-size: 12px; color: #666;">
                <p><strong>Leistungen im Überblick:</strong></p>
                ${getPlanFeatures(planData.plan || 'smart')}
            </div>
            ${medicalTreatmentInfo}
        `;
    }
    
    function updatePricingSummary(planData) {
        const monthlyPrice = document.getElementById('monthly-price');
        const deductibleInfo = document.getElementById('deductible-info');
        const paymentFrequency = document.getElementById('payment-frequency');
        const totalPrice = document.getElementById('total-price');
        
        console.log('Updating pricing summary with plan data:', planData);
        
        if (monthlyPrice) {
            let basePrice = parseFloat((planData.price || '35,80 €').replace(',', '.').replace(' €', ''));
            console.log('Base price:', basePrice);
            
            // Add medical treatment cost if selected
            if (planData.medicalTreatment && planData.medicalTreatment.selected) {
                const medicalPrice = parseFloat(planData.medicalTreatment.price.replace(',', '.').replace(' €', ''));
                console.log('Medical price:', medicalPrice);
                basePrice += medicalPrice;
                console.log('Total price with medical:', basePrice);
            }
            
            const formattedPrice = `${basePrice.toFixed(2).replace('.', ',')} €`;
            console.log('Formatted price:', formattedPrice);
            monthlyPrice.textContent = formattedPrice;
            
            if (totalPrice) {
                // Calculate total based on payment frequency
                const frequency = planData.paymentFrequency || 'monthly';
                const calculatedTotal = calculateTotalPrice(formattedPrice, frequency);
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
    
    // Date input setup and backspace fix - Enhanced for complete dot clearing
    function setupDateInputs() {
        const dateInputs = document.querySelectorAll('input[type="date"]');
        
        dateInputs.forEach(dateInput => {
            let lastValue = '';
            let isClearing = false;
            
            // Store original placeholder and value
            const originalPlaceholder = dateInput.placeholder || '';
            
            // Create a wrapper for enhanced functionality
            const wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            wrapper.style.display = 'inline-block';
            wrapper.style.width = '100%';
            
            // Insert wrapper before the input and move input inside
            dateInput.parentNode.insertBefore(wrapper, dateInput);
            wrapper.appendChild(dateInput);
            
            // Create clear button
            const clearBtn = document.createElement('button');
            clearBtn.type = 'button';
            clearBtn.innerHTML = '×';
            clearBtn.style.cssText = `
                position: absolute;
                right: 30px;
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                font-size: 18px;
                color: #999;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
                display: none;
                z-index: 10;
            `;
            
            clearBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                forceClearDateInput(dateInput);
            });
            
            wrapper.appendChild(clearBtn);
            
            // Show/hide clear button based on content
            function updateClearButton() {
                if (dateInput.value && dateInput.value.length > 0) {
                    clearBtn.style.display = 'block';
                } else {
                    clearBtn.style.display = 'none';
                }
            }
            
            // Track value changes
            dateInput.addEventListener('focus', function() {
                lastValue = this.value || '';
                isClearing = false;
                updateClearButton();
            });
            
            // Handle keydown for backspace detection
            dateInput.addEventListener('keydown', function(e) {
                const currentValue = this.value || '';
                
                if (e.keyCode === 8) { // Backspace
                    // If field has content and user is backspacing
                    if (currentValue && currentValue.length > 0) {
                        isClearing = true;
                        
                        // Set a timer to check and clear after browser processes the backspace
                        setTimeout(() => {
                            const newValue = this.value || '';
                            
                            // Check if we have partial date or just separators
                            if (newValue.length < 10 && (newValue.includes('-') || newValue.includes('.') || newValue.includes('/'))) {
                                forceClearDateInput(this);
                            }
                            
                            // If field is now empty or has invalid content, ensure it's completely clear
                            if (!newValue || newValue.length === 0 || this.validity.badInput) {
                                forceClearDateInput(this);
                            }
                            
                            updateClearButton();
                            isClearing = false;
                        }, 1);
                    }
                }
                
                // Allow essential keys
                const allowedKeys = [8, 9, 27, 13, 46, 37, 38, 39, 40]; // backspace, tab, esc, enter, delete, arrows
                if (allowedKeys.includes(e.keyCode)) {
                    return;
                }
                
                // Allow Ctrl combinations
                if (e.ctrlKey && [65, 67, 86, 88].includes(e.keyCode)) {
                    return;
                }
            });
            
            // Handle input changes
            dateInput.addEventListener('input', function(e) {
                clearFieldError(this);
                updateClearButton();
                
                const value = this.value || '';
                
                // If we detect partial dates or separator artifacts, clear completely
                if (value && (value.match(/^[\.\-\/\s]*$/) || (value.length < 10 && value.includes('-')))) {
                    forceClearDateInput(this);
                }
            });
            
            // Handle keyup for additional clearing
            dateInput.addEventListener('keyup', function(e) {
                if (e.keyCode === 8 && isClearing) {
                    const value = this.value || '';
                    
                    // If we still have artifacts, clear them
                    if (value && (value.length < 10 || this.validity.badInput)) {
                        forceClearDateInput(this);
                    }
                }
                updateClearButton();
            });
            
            // Double-click to clear
            dateInput.addEventListener('dblclick', function(e) {
                forceClearDateInput(this);
                updateClearButton();
            });
            
            // Handle paste events
            dateInput.addEventListener('paste', function(e) {
                setTimeout(() => {
                    const value = this.value || '';
                    if (value && !value.match(/^\d{4}-\d{2}-\d{2}$/)) {
                        forceClearDateInput(this);
                    }
                    updateClearButton();
                }, 1);
            });
            
            // Validation on change
            dateInput.addEventListener('change', function(e) {
                const value = this.value || '';
                
                // Final validation - if not empty and not valid, clear
                if (value && (this.validity.badInput || !value.match(/^\d{4}-\d{2}-\d{2}$/))) {
                    forceClearDateInput(this);
                } else if (value) {
                    validateDateInput(this);
                }
                updateClearButton();
            });
            
            // Handle blur to ensure final cleanup
            dateInput.addEventListener('blur', function() {
                const value = this.value || '';
                if (value && this.validity.badInput) {
                    forceClearDateInput(this);
                }
                updateClearButton();
            });
        });
    }
    
    // Helper function to force clear date input completely
    function forceClearDateInput(input) {
        const originalPlaceholder = input.placeholder || '';
        
        // Multiple approaches to ensure complete clearing
        input.value = '';
        input.type = 'text';
        input.value = '';
        input.setAttribute('value', '');
        input.removeAttribute('value');
        input.type = 'date';
        input.value = '';
        input.placeholder = originalPlaceholder;
        
        // Trigger events to update UI
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Clear any validation errors
        clearFieldError(input);
    }
    
    function validateDateInput(field) {
        const value = field.value;
        
        if (field.hasAttribute('required') && !value) {
            showFieldError(field, 'Dieses Feld ist erforderlich.');
            return false;
        }
        
        if (value) {
            const selectedDate = new Date(value);
            const today = new Date();
            const minAge = new Date();
            minAge.setFullYear(today.getFullYear() - 100); // 100 years ago
            
            // Check if date is in valid range
            if (selectedDate > today) {
                showFieldError(field, 'Das Datum kann nicht in der Zukunft liegen.');
                return false;
            }
            
            if (selectedDate < minAge) {
                showFieldError(field, 'Bitte geben Sie ein gültiges Datum ein.');
                return false;
            }
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
    
    // Medical Treatment Section functionality
    setupMedicalTreatmentSection();
    
    function setupMedicalTreatmentSection() {
        const chooseMedicalBtn = document.getElementById('chooseMedicalBtn');
        const medicalSection = document.querySelector('.medical-treatment-section');
        const medicalRadios = document.querySelectorAll('input[name="medical_coverage"]');
        const priceAmount = document.querySelector('.medical-price .price-amount');
        
        // Medical coverage pricing
        const medicalPricing = {
            '2000': { price: '23.38 €', text: 'Up to €2,000 medical treatment cover + €50 preventive care allowance (€23.38)' },
            '5000': { price: '33.33 €', text: 'Up to €5,000 medical treatment cover + €100 preventive care allowance (€33.33)' }
        };
        
        // Initialize medical section state
        let medicalSelected = false;
        
        // Choose button functionality
        if (chooseMedicalBtn) {
            chooseMedicalBtn.addEventListener('click', function() {
                medicalSelected = !medicalSelected;
                
                if (medicalSelected) {
                    if (medicalSection) medicalSection.classList.add('selected');
                    chooseMedicalBtn.textContent = 'Remove';
                    chooseMedicalBtn.style.background = '#dc3545';
                } else {
                    if (medicalSection) medicalSection.classList.remove('selected');
                    chooseMedicalBtn.textContent = 'Choose';
                    chooseMedicalBtn.style.background = '#ff8c42';
                }
                
                // Update order summary
                updateOrderSummaryWithMedical();
            });
        }
        
        // Radio button change handler
        medicalRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                const selectedOption = medicalPricing[this.value];
                if (selectedOption && priceAmount) {
                    priceAmount.textContent = selectedOption.price;
                }
                
                // Update order summary if medical treatment is selected
                if (medicalSelected) {
                    updateOrderSummaryWithMedical();
                }
            });
        });
        
        function updateOrderSummaryWithMedical() {
            const planData = JSON.parse(localStorage.getItem('selectedPlanData') || '{}');
            const selectedRadio = document.querySelector('input[name="medical_coverage"]:checked');
            
            console.log('Updating medical treatment:', medicalSelected, selectedRadio ? selectedRadio.value : 'none');
            
            if (medicalSelected && selectedRadio) {
                // Add medical treatment to plan data
                const medicalOption = medicalPricing[selectedRadio.value];
                planData.medicalTreatment = {
                    selected: true,
                    coverage: selectedRadio.value,
                    price: medicalOption.price,
                    description: medicalOption.text
                };
                console.log('Adding medical treatment:', planData.medicalTreatment);
            } else {
                // Remove medical treatment from plan data
                if (planData.medicalTreatment) {
                    delete planData.medicalTreatment;
                    console.log('Removing medical treatment');
                }
            }
            
            // Save updated plan data
            localStorage.setItem('selectedPlanData', JSON.stringify(planData));
            
            // Update pricing summary
            updatePricingSummary(planData);
            updatePlanSummary(planData);
        }
    }
});

// Utility functions that can be called globally
function getPetTypeText(tierKategorie) {
    const types = {
        'hund': 'Hund',
        'katze': 'Katze'
    };
    return types[tierKategorie] || 'Katze';
}

function getGenderText(geschlecht) {
    const genders = {
        'männlich': 'Männlich',
        'weiblich': 'Weiblich'
    };
    return genders[geschlecht] || 'Männlich';
}

function getPlanNameText(plan) {
    const plans = {
        'basis': 'Basis-Schutz',
        'smart': 'Smart-Schutz',
        'komfort': 'Komfort-Schutz'
    };
    return plans[plan] || 'Smart-Schutz';
}

function getDeductibleText(deductible) {
    const deductibles = {
        '0': 'Keine Selbstbeteiligung',
        '20': '20% Selbstbeteiligung',
        '150': '150€ Selbstbeteiligung pro Jahr'
    };
    return deductibles[deductible] || '20% Selbstbeteiligung';
}

function getPaymentFrequencyText(frequency) {
    const frequencies = {
        'monthly': 'Monatlich',
        'quarterly': 'Vierteljährlich',
        'semi-annually': 'Halbjährlich',
        'yearly': 'Jährlich'
    };
    return frequencies[frequency] || 'Monatlich';
}