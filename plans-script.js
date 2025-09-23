// Plans Page JavaScript - SIMPLIFIED VERSION

// Global variables
let selectedPlan = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Plans page loaded - SIMPLIFIED VERSION');
    
    // Get all plan buttons
    const planButtons = document.querySelectorAll('.plan-button');
    const continueBtn = document.getElementById('continueBtn');
    
    console.log('Found plan buttons:', planButtons.length);
    console.log('Found continue button:', !!continueBtn);
    
    // Make sure continue button starts disabled
    if (continueBtn) {
        continueBtn.disabled = true;
    continueBtn.style.backgroundColor = '#ccc';
        continueBtn.style.cursor = 'not-allowed';
    }
    
    // Add click listeners to plan buttons
    planButtons.forEach(function(button, index) {
        console.log('Setting up button', index, 'with plan:', button.dataset.plan);
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('PLAN BUTTON CLICKED:', this.dataset.plan);
            
            // Remove selection from all buttons
            planButtons.forEach(btn => btn.classList.remove('selected'));
            
            // Add selection to clicked button
            this.classList.add('selected');
            selectedPlan = this.dataset.plan;
            
            // Enable continue button
            if (continueBtn) {
                continueBtn.disabled = false;
                continueBtn.style.backgroundColor = '#c80a50';
                continueBtn.style.cursor = 'pointer';
                continueBtn.style.color = 'white';
                console.log('Continue button enabled');
            }
        });
    });
    
    // Continue button click handler
    if (continueBtn) {
        continueBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('CONTINUE BUTTON CLICKED');
            console.log('Selected plan:', selectedPlan);
            
            if (selectedPlan) {
                // Store plan data
                const planData = {
                    plan: selectedPlan,
                    deductible: '20',
                    paymentFrequency: 'monthly',
                    price: '35,80 €'
                };
                
                localStorage.setItem('selectedPlanData', JSON.stringify(planData));
                console.log('Plan data stored:', planData);
                
                // Navigate immediately
                console.log('Navigating to application.html...');
                window.location.href = 'application.html';
                
            } else {
                alert('Bitte wählen Sie zuerst einen Tarif aus!');
            }
        });
    }
    
    // Back button
    window.goBack = function() {
        window.history.back();
    };
    
    console.log('Plans page setup complete');
});

    // Demo pricing data based on deductible and payment frequency (fallback)
    const staticPricingData = {
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
    initializePage();
    
    function initializePage() {
        const urlParams = new URLSearchParams(window.location.search);
        const dataSource = urlParams.get('source'); // 'api' or 'static'
        
        // Check if we have API data
        const apiResponseData = localStorage.getItem('apiResponseData');
        
        if (dataSource === 'api' && apiResponseData) {
            try {
                const apiResponse = JSON.parse(apiResponseData);
                currentPricingData = parseAPIResponse(apiResponse);
                updatePricingFromAPI(currentPricingData);
            } catch (error) {
                currentPricingData = staticPricingData;
                updatePricing();
            }
        } else {
            currentPricingData = staticPricingData;
            updatePricing();
        }
        
        // Display form data if coming from form
        if (urlParams.get('from') === 'form') {
            displayFormData();
        }
    }
    
    function parseAPIResponse(apiResponse) {
        // Parse the API response and convert to our pricing structure
        try {
            let products = [];
            
            // Handle nested response structure
            if (apiResponse.success && apiResponse.data && apiResponse.data.data && 
                apiResponse.data.data.productResponse && apiResponse.data.data.productResponse.products) {
                products = apiResponse.data.data.productResponse.products;
            } else if (apiResponse.data && apiResponse.data.productResponse && 
                      apiResponse.data.productResponse.products) {
                products = apiResponse.data.productResponse.products;
            }
            
            if (products.length === 0) {
                throw new Error("No products found in API response");
            }
            
            return convertAPIToPricingData(products);
            
        } catch (error) {
            console.error("Error parsing API response:", error);
            return staticPricingData;
        }
    }
    
    function convertAPIToPricingData(products) {
        // Convert API products to our pricing structure
        const converted = {};
        
        products.forEach((product, index) => {
            const planKey = product.ident?.toLowerCase() || `plan${index + 1}`;
            const basePrice = product.priceAmount || 0;
            
            // Create pricing structure for different deductibles and frequencies
            converted[planKey] = {
                no: { 
                    monthly: basePrice,
                    quarterly: basePrice * 3,
                    'semi-annually': basePrice * 6,
                    yearly: basePrice * 12
                },
                '10': { 
                    monthly: basePrice * 0.9,
                    quarterly: basePrice * 0.9 * 3,
                    'semi-annually': basePrice * 0.9 * 6,
                    yearly: basePrice * 0.9 * 12
                },
                '20': { 
                    monthly: basePrice * 0.8,
                    quarterly: basePrice * 0.8 * 3,
                    'semi-annually': basePrice * 0.8 * 6,
                    yearly: basePrice * 0.8 * 12
                }
            };
        });
        
        return converted;
    }
    
    function updatePricingFromAPI(pricingData) {
        // Update the existing pricing display with API data
        Object.keys(pricingData).forEach((planKey, index) => {
            const planCard = document.querySelector(`[data-plan="${planKey}"]`) || 
                           document.querySelectorAll('.plan-card')[index];
            
            if (planCard) {
                const priceElement = planCard.querySelector('.plan-price .monthly-price');
                const annualElement = planCard.querySelector('.annual-price');
                
                if (priceElement && annualElement) {
                    const deductible = deductibleSelect.value;
                    const frequency = paymentFrequencySelect.value;
                    
                    const price = pricingData[planKey][deductible][frequency];
                    const monthlyPrice = pricingData[planKey][deductible].monthly;
                    
                    priceElement.textContent = `${price.toFixed(2).replace('.', ',')} €`;
                    annualElement.textContent = `${(monthlyPrice * 12).toFixed(2).replace('.', ',')}€ jährlich`;
                }
            }
        });
    }

    // Event listeners
    deductibleSelect.addEventListener('change', updatePricing);
    paymentFrequencySelect.addEventListener('change', updatePricing);

    planButtons.forEach(button => {
        console.log('Adding click listener to button:', button.dataset.plan);
        button.addEventListener('click', function() {
            console.log('Button clicked:', this.dataset.plan);
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
        if (!currentPricingData) return;
        
        const deductible = deductibleSelect.value;
        const frequency = paymentFrequencySelect.value;

        Object.keys(currentPricingData).forEach(plan => {
            const price = currentPricingData[plan][deductible][frequency];
            const monthlyPrice = currentPricingData[plan][deductible].monthly;
            const priceElement = document.querySelector(`.plan-card:nth-child(${getPlanIndex(plan)}) .price`);
            const monthlyPriceElement = document.querySelector(`.plan-card:nth-child(${getPlanIndex(plan)}) .monthly-price`);
            const annualPriceElement = document.querySelector(`.plan-card:nth-child(${getPlanIndex(plan)}) .annual-price`);
            
            if (priceElement) {
                priceElement.textContent = formatPrice(price, frequency);
            }
            if (monthlyPriceElement) {
                monthlyPriceElement.textContent = `${monthlyPrice.toFixed(2).replace('.', ',')} €`;
            }
            if (annualPriceElement) {
                annualPriceElement.textContent = `${(monthlyPrice * 12).toFixed(2).replace('.', ',')}€ jährlich`;
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
        console.log('Plan selected:', button.dataset.plan);
        
        // Remove previous selection from all plan cards and buttons
        document.querySelectorAll('.plan-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        planButtons.forEach(btn => {
            btn.classList.remove('selected');
        });

        // Add selection to clicked button and its parent card
        button.classList.add('selected');
        const planCard = button.closest('.plan-card');
        if (planCard) {
            planCard.classList.add('selected');
        }
        
        selectedPlan = button.dataset.plan;

        // Enable continue button with visual feedback
    continueBtn.disabled = false;
        continueBtn.style.opacity = '1';
        continueBtn.style.cursor = 'pointer';
        continueBtn.classList.add('enabled');
        
        console.log('Continue button enabled');
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
        console.log('Continue button clicked, selected plan:', selectedPlan);
        
        if (selectedPlan) {
            // Store selected plan data
            const planData = {
                plan: selectedPlan,
                deductible: deductibleSelect ? deductibleSelect.value : '20',
                paymentFrequency: paymentFrequencySelect ? paymentFrequencySelect.value : 'monthly',
                price: getCurrentPrice()
            };
            
            console.log('Storing plan data:', planData);
            localStorage.setItem('selectedPlanData', JSON.stringify(planData));
            
            // Navigate to application page
            console.log('Navigating to application.html');
            window.location.href = 'application.html?from=plans';
        } else {
            console.log('No plan selected');
            alert('Bitte wählen Sie zuerst einen Tarif aus.');
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