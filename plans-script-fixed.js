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
                continueBtn.style.backgroundColor = '#003781';
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
    
    // Helper functions
    function getCurrentPrice(plan, deductible, frequency) {
        if (staticPricingData[plan] && staticPricingData[plan][deductible] && staticPricingData[plan][deductible][frequency]) {
            const price = staticPricingData[plan][deductible][frequency];
            return `${price.toFixed(2).replace('.', ',')} €`;
        }
        return '35,80 €';
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
        border: 2px solid #003781 !important;
        box-shadow: 0 4px 20px rgba(0, 55, 129, 0.15) !important;
        transform: translateY(-2px) !important;
        transition: all 0.3s ease !important;
    }
    
    .plan-button.selected {
        background: #003781 !important;
        color: white !important;
        border-color: #003781 !important;
        transition: all 0.3s ease !important;
    }
    
    .btn-primary:not(:disabled) {
        transition: all 0.3s ease !important;
    }
    
    .btn-primary:not(:disabled):hover {
        background: #004499 !important;
        transform: translateY(-1px) !important;
    }
`;
document.head.appendChild(style);