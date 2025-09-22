// Plans Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const deductibleSelect = document.getElementById('deductible');
    const paymentFrequencySelect = document.getElementById('paymentFrequency');
    const planButtons = document.querySelectorAll('.plan-button');
    const continueBtn = document.getElementById('continueBtn');
    const expandableSections = document.querySelectorAll('.section-header');

    let selectedPlan = null;

    // Demo pricing data based on deductible and payment frequency
    const pricingData = {
        basis: {
            no: { monthly: 22.15, quarterly: 66.45, 'semi-annually': 132.90, yearly: 265.80 },
            '10': { monthly: 19.94, quarterly: 59.82, 'semi-annually': 119.64, yearly: 239.28 },
            '20': { monthly: 17.62, quarterly: 52.86, 'semi-annually': 105.72, yearly: 211.44 }
        },
        smart: {
            no: { monthly: 44.75, quarterly: 134.25, 'semi-annually': 268.50, yearly: 537.00 },
            '10': { monthly: 40.28, quarterly: 120.84, 'semi-annually': 241.68, yearly: 483.36 },
            '20': { monthly: 35.80, quarterly: 107.40, 'semi-annually': 214.80, yearly: 429.60 }
        },
        komfort: {
            no: { monthly: 81.38, quarterly: 244.14, 'semi-annually': 488.28, yearly: 976.56 },
            '10': { monthly: 73.24, quarterly: 219.72, 'semi-annually': 439.44, yearly: 878.88 },
            '20': { monthly: 65.10, quarterly: 195.30, 'semi-annually': 390.60, yearly: 781.20 }
        }
    };

    // Initialize page
    updatePricing();
    
    // Get URL parameters if coming from form
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('from') === 'form') {
        displayFormData();
    }

    // Event listeners
    deductibleSelect.addEventListener('change', updatePricing);
    paymentFrequencySelect.addEventListener('change', updatePricing);

    planButtons.forEach(button => {
        button.addEventListener('click', function() {
            selectPlan(this);
        });
    });

    expandableSections.forEach(header => {
        header.addEventListener('click', function() {
            toggleSection(this);
        });
    });

    // Functions
    function updatePricing() {
        const deductible = deductibleSelect.value;
        const frequency = paymentFrequencySelect.value;

        Object.keys(pricingData).forEach(plan => {
            const price = pricingData[plan][deductible][frequency];
            const priceElement = document.querySelector(`.plan-card:nth-child(${getPlanIndex(plan)}) .price`);
            if (priceElement) {
                priceElement.textContent = formatPrice(price, frequency);
            }
        });
    }

    function getPlanIndex(plan) {
        switch(plan) {
            case 'basis': return 1;
            case 'smart': return 2;
            case 'komfort': return 3;
            default: return 1;
        }
    }

    function formatPrice(price, frequency) {
        const formattedPrice = price.toFixed(2).replace('.', ',');
        switch(frequency) {
            case 'monthly': return `${formattedPrice} €`;
            case 'quarterly': return `${formattedPrice} €`;
            case 'semi-annually': return `${formattedPrice} €`;
            case 'yearly': return `${formattedPrice} €`;
            default: return `${formattedPrice} €`;
        }
    }

    function selectPlan(button) {
        // Remove previous selection
        planButtons.forEach(btn => {
            btn.classList.remove('selected');
        });

        // Add selection to clicked button
        button.classList.add('selected');
        selectedPlan = button.dataset.plan;

        // Enable continue button
        continueBtn.disabled = false;
    }

    function toggleSection(header) {
        const content = header.nextElementSibling;
        const isActive = header.classList.contains('active');

        // Close all sections first
        expandableSections.forEach(section => {
            section.classList.remove('active');
            section.nextElementSibling.classList.remove('active');
        });

        // If this section wasn't active, open it
        if (!isActive) {
            header.classList.add('active');
            content.classList.add('active');
            populateSectionContent(header.dataset.toggle, content);
        }
    }

    function populateSectionContent(sectionType, content) {
        let html = '';
        
        switch(sectionType) {
            case 'operation':
                html = `
                    <div class="additional-coverage">
                        <div class="coverage-row">
                            <div class="coverage-label">
                                <span>Behandlung rassespezifischer und besonderer Erkrankungen und Fehlstellungen</span>
                                <span class="info-icon">ⓘ</span>
                            </div>
                            <div class="coverage-values">
                                <div class="coverage-value basis">—</div>
                                <div class="coverage-value smart">einmalig bis 500 €</div>
                                <div class="coverage-value komfort">einmalig bis 2.500 €</div>
                            </div>
                        </div>
                        <div class="coverage-row">
                            <div class="coverage-label">
                                <span>Strahlentherapie nach Operationen</span>
                                <span class="info-icon">ⓘ</span>
                            </div>
                            <div class="coverage-values">
                                <div class="coverage-value basis">500 €</div>
                                <div class="coverage-value smart">500 €</div>
                                <div class="coverage-value komfort">2.500 €</div>
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'additional':
                html = `
                    <div class="additional-coverage">
                        <div class="coverage-row">
                            <div class="coverage-label">
                                <span>Freie Tierarzt- und Klinikwahl</span>
                                <span class="info-icon">ⓘ</span>
                            </div>
                            <div class="coverage-values">
                                <div class="coverage-value basis">✓</div>
                                <div class="coverage-value smart">✓</div>
                                <div class="coverage-value komfort">✓</div>
                            </div>
                        </div>
                        <div class="coverage-row">
                            <div class="coverage-label">
                                <span>Erweiterte Notfallversorgung</span>
                                <span class="info-icon">ⓘ</span>
                            </div>
                            <div class="coverage-values">
                                <div class="coverage-value basis">—</div>
                                <div class="coverage-value smart">✓</div>
                                <div class="coverage-value komfort">✓</div>
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'service':
                html = `
                    <div class="additional-coverage">
                        <div class="coverage-row">
                            <div class="coverage-label">
                                <span>24/7 Tierarzt-Hotline</span>
                                <span class="info-icon">ⓘ</span>
                            </div>
                            <div class="coverage-values">
                                <div class="coverage-value basis">—</div>
                                <div class="coverage-value smart">✓</div>
                                <div class="coverage-value komfort">✓</div>
                            </div>
                        </div>
                        <div class="coverage-row">
                            <div class="coverage-label">
                                <span>Digitale Gesundheitsakte</span>
                                <span class="info-icon">ⓘ</span>
                            </div>
                            <div class="coverage-values">
                                <div class="coverage-value basis">—</div>
                                <div class="coverage-value smart">—</div>
                                <div class="coverage-value komfort">✓</div>
                            </div>
                        </div>
                    </div>
                `;
                break;
        }
        
        content.innerHTML = html;
    }

    function displayFormData() {
        // Get form data from localStorage or URL parameters
        const formData = JSON.parse(localStorage.getItem('petInsuranceFormData') || '{}');
        
        if (formData.tierKategorie) {
            // Update page title or add pet info display
            const petInfo = document.createElement('div');
            petInfo.className = 'pet-info';
            petInfo.innerHTML = `
                <div class="pet-summary">
                    <h3>Ihre Angaben:</h3>
                    <p><strong>Tier:</strong> ${getPetTypeText(formData.tierKategorie)}</p>
                    <p><strong>Geschlecht:</strong> ${getGenderText(formData.geschlecht)}</p>
                    <p><strong>Rasse:</strong> ${formData.rasse || 'Nicht angegeben'}</p>
                    <p><strong>Geburtsdatum:</strong> ${formData.geburtsdatum || 'Nicht angegeben'}</p>
                </div>
            `;
            
            document.querySelector('.plans-title-section .container').appendChild(petInfo);
        }
    }

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

    // Global functions for navigation
    window.goBack = function() {
        window.history.back();
    };

    // Continue button handler
    continueBtn.addEventListener('click', function() {
        if (selectedPlan) {
            // Store selected plan data
            const planData = {
                plan: selectedPlan,
                deductible: deductibleSelect.value,
                paymentFrequency: paymentFrequencySelect.value,
                price: getCurrentPrice()
            };
            
            localStorage.setItem('selectedPlanData', JSON.stringify(planData));
            
            // Navigate to application page
            window.location.href = 'application.html?from=plans';
        }
    });

    function getCurrentPrice() {
        const deductible = deductibleSelect.value;
        const frequency = paymentFrequencySelect.value;
        if (selectedPlan) {
            const price = pricingData[selectedPlan][deductible][frequency];
            return formatPrice(price, frequency);
        }
        return '';
    }

    function getDeductibleText() {
        switch(deductibleSelect.value) {
            case 'no': return 'Keine';
            case '10': return '10%';
            case '20': return '20%';
            default: return '';
        }
    }

    function getPaymentFrequencyText() {
        switch(paymentFrequencySelect.value) {
            case 'monthly': return 'Monatlich';
            case 'quarterly': return 'Vierteljährlich';
            case 'semi-annually': return 'Halbjährlich';
            case 'yearly': return 'Jährlich';
            default: return '';
        }
    }
});