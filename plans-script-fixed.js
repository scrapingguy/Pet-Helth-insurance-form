// Plans Page JavaScript - Clean Professional Version

let selectedPlan = null;

document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const planButtons = document.querySelectorAll('.plan-button');
    const continueBtn = document.getElementById('continueBtn');
    const deductibleSelect = document.getElementById('deductible');
    const paymentFrequencySelect = document.getElementById('paymentFrequency');
    
    // Demo pricing data
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
    
    // Initialize continue button (disabled state)
    if (continueBtn) {
        continueBtn.disabled = true;
        continueBtn.style.backgroundColor = '#ccc';
        continueBtn.style.cursor = 'not-allowed';
        continueBtn.style.opacity = '0.6';
    }
    
    // Add click event to each plan button
    planButtons.forEach(function(button) {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            
            // Remove selection from all buttons and cards
            planButtons.forEach(btn => {
                btn.classList.remove('selected');
                const card = btn.closest('.plan-card');
                if (card) card.classList.remove('selected');
            });
            
            // Select this button and card
            this.classList.add('selected');
            const selectedCard = this.closest('.plan-card');
            if (selectedCard) {
                selectedCard.classList.add('selected');
            }
            
            // Store selected plan
            selectedPlan = this.dataset.plan;
            
            // Enable continue button
            if (continueBtn) {
                continueBtn.disabled = false;
                continueBtn.style.backgroundColor = '#c80a50';
                continueBtn.style.cursor = 'pointer';
                continueBtn.style.color = 'white';
                continueBtn.style.opacity = '1';
                continueBtn.textContent = 'Weiter';
            }
        });
    });
    
    // Continue button click handler
    if (continueBtn) {
        continueBtn.addEventListener('click', function(event) {
            event.preventDefault();
            
            if (selectedPlan) {
                // Get current pricing
                const deductible = deductibleSelect ? deductibleSelect.value : '20';
                const frequency = paymentFrequencySelect ? paymentFrequencySelect.value : 'monthly';
                const price = getCurrentPrice(selectedPlan, deductible, frequency);
                
                // Prepare plan data
                const planData = {
                    plan: selectedPlan,
                    deductible: deductible,
                    paymentFrequency: frequency,
                    price: price
                };
                
                // Store in localStorage
                localStorage.setItem('selectedPlanData', JSON.stringify(planData));
                
                // Show loading state
                this.textContent = 'Weiter...';
                this.disabled = true;
                
                // Navigate to application page
                setTimeout(() => {
                    window.location.href = 'application.html';
                }, 300);
                
            } else {
                alert('Bitte wählen Sie zuerst einen Tarif aus.');
            }
        });
    }
    
    // Pricing update handlers
    if (deductibleSelect) {
        deductibleSelect.addEventListener('change', updatePricing);
    }
    if (paymentFrequencySelect) {
        paymentFrequencySelect.addEventListener('change', updatePricing);
    }
    
    // Initialize pricing
    updatePricing();
    
    // Initialize expandable sections
    initializeExpandableSections();
    
    // Helper functions
    function getCurrentPrice(plan, deductible, frequency) {
        if (staticPricingData[plan] && staticPricingData[plan][deductible] && staticPricingData[plan][deductible][frequency]) {
            const price = staticPricingData[plan][deductible][frequency];
            return `${price.toFixed(2).replace('.', ',')} €`;
        }
        return '35,80 €';
    }
    
    function initializeExpandableSections() {
        const sectionHeaders = document.querySelectorAll('.section-header');
        console.log('Found', sectionHeaders.length, 'expandable section headers');
        
        // First populate content, then add event listeners
        populateExpandableContent();
        
        sectionHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const toggleTarget = this.getAttribute('data-toggle');
                const content = document.getElementById(toggleTarget + '-content');
                const toggleIcon = this.querySelector('.toggle-icon');
                
                console.log('Clicked section:', toggleTarget);
                
                if (content) {
                    const isExpanded = content.classList.contains('active');
                    
                    if (isExpanded) {
                        // Collapse
                        content.style.maxHeight = '0px';
                        content.classList.remove('active');
                        this.classList.remove('active');
                        if (toggleIcon) {
                            toggleIcon.style.transform = 'rotate(0deg)';
                        }
                    } else {
                        // Expand
                        content.classList.add('active');
                        this.classList.add('active');
                        content.style.maxHeight = content.scrollHeight + 'px';
                        if (toggleIcon) {
                            toggleIcon.style.transform = 'rotate(180deg)';
                        }
                        
                        // After animation, set to auto for dynamic content
                        setTimeout(() => {
                            if (content.classList.contains('active')) {
                                content.style.maxHeight = 'auto';
                            }
                        }, 300);
                    }
                } else {
                    console.error('Content element not found for:', toggleTarget + '-content');
                }
            });
        });
    }
    
    function populateExpandableContent() {
        // Add content for operation section
        const operationContent = document.getElementById('operation-content');
        if (operationContent) {
            operationContent.innerHTML = `
                <div class="coverage-row">
                    <div class="coverage-label">
                        <span>Physiotherapie nach einer Operation</span>
                        <span class="info-icon">ⓘ</span>
                    </div>
                    <div class="coverage-values">
                        <div class="coverage-value basis">—</div>
                        <div class="coverage-value smart">bis 500 €</div>
                        <div class="coverage-value komfort">bis 1.000 €</div>
                    </div>
                </div>
                <div class="coverage-row">
                    <div class="coverage-label">
                        <span>Alternative Heilmethoden (nach OP)</span>
                        <span class="info-icon">ⓘ</span>
                    </div>
                    <div class="coverage-values">
                        <div class="coverage-value basis">—</div>
                        <div class="coverage-value smart">bis 250 €</div>
                        <div class="coverage-value komfort">bis 500 €</div>
                    </div>
                </div>
            `;
        }
        
        // Add content for additional section
        const additionalContent = document.getElementById('additional-content');
        if (additionalContent) {
            additionalContent.innerHTML = `
                <div class="coverage-row">
                    <div class="coverage-label">
                        <span>Unterbringung bei stationärer Behandlung</span>
                        <span class="info-icon">ⓘ</span>
                    </div>
                    <div class="coverage-values">
                        <div class="coverage-value basis">bis 14 Tage</div>
                        <div class="coverage-value smart">bis 20 Tage</div>
                        <div class="coverage-value komfort">bis 30 Tage</div>
                    </div>
                </div>
                <div class="coverage-row">
                    <div class="coverage-label">
                        <span>Freie Tierarztwahl</span>
                        <span class="info-icon">ⓘ</span>
                    </div>
                    <div class="coverage-values">
                        <div class="coverage-value basis">✓</div>
                        <div class="coverage-value smart">✓</div>
                        <div class="coverage-value komfort">✓</div>
                    </div>
                </div>
            `;
        }
        
        // Add content for service section
        const serviceContent = document.getElementById('service-content');
        if (serviceContent) {
            serviceContent.innerHTML = `
                <div class="coverage-row">
                    <div class="coverage-label">
                        <span>24/7 Tierärztlicher Notdienst Hotline</span>
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
                        <span>Online Kundenbereich</span>
                        <span class="info-icon">ⓘ</span>
                    </div>
                    <div class="coverage-values">
                        <div class="coverage-value basis">✓</div>
                        <div class="coverage-value smart">✓</div>
                        <div class="coverage-value komfort">✓</div>
                    </div>
                </div>
            `;
        }
    }
    
    function updatePricing() {
        if (!deductibleSelect || !paymentFrequencySelect) return;
        
        const deductible = deductibleSelect.value;
        const frequency = paymentFrequencySelect.value;
        
        // Update each plan card
        Object.keys(staticPricingData).forEach((plan, index) => {
            const price = staticPricingData[plan][deductible][frequency];
            const priceElement = document.querySelector(`.plan-card:nth-child(${index + 1}) .price`);
            
            if (priceElement) {
                priceElement.textContent = `${price.toFixed(2).replace('.', ',')} €`;
            }
        });
    }
    
    // Back button functionality
    window.goBack = function() {
        window.history.back();
    };
});

// Professional CSS for selection states
const style = document.createElement('style');
style.textContent = `
    .plan-card.selected {
        border: 2px solid #c80a50 !important;
        box-shadow: 0 4px 20px rgba(200, 10, 80, 0.15) !important;
        transform: translateY(-2px) !important;
        transition: all 0.3s ease !important;
    }
    
    .plan-button.selected {
        background: #c80a50 !important;
        color: white !important;
        border-color: #c80a50 !important;
        transition: all 0.3s ease !important;
    }
    
    .btn-primary:not(:disabled) {
        transition: all 0.3s ease !important;
    }
    
    .btn-primary:not(:disabled):hover {
        background: #c80a50 !important;
        transform: translateY(-1px) !important;
    }
`;
document.head.appendChild(style);