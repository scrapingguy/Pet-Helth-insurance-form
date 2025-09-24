// Simple Pricing JavaScript - Clean Working Version

let selectedPlan = null;

// Pricing data
const planPrices = {
    basis: { monthly: 8.14, quarterly: 7.74, yearly: 7.33 },
    smart: { monthly: 12.28, quarterly: 11.67, yearly: 11.05 },
    komfort: { monthly: 20.40, quarterly: 19.38, yearly: 18.36 }
};

const deductibleMultipliers = {
    no: 1.2,
    10: 1.1,
    20: 1.0
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Simple pricing page loaded');
    
    // Setup all event listeners
    setupEventListeners();
    
    // Initialize pricing display
    updatePrices();
    
    // Make sure continue button starts disabled
    disableContinueButton();
    
    console.log('Initialization complete');
});

function setupEventListeners() {
    // Plan selection buttons (both card buttons and table buttons)
    const selectButtons = document.querySelectorAll('.select-btn, .table-select-btn');
    console.log('Found select buttons:', selectButtons.length);
    
    selectButtons.forEach((btn, index) => {
        console.log(`Button ${index}: plan="${btn.getAttribute('data-plan')}"`);
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const plan = this.getAttribute('data-plan');
            console.log('Plan button clicked:', plan);
            selectPlan(plan);
        });
    });

    // Price control changes
    const deductibleSelect = document.getElementById('deductible');
    const paymentSelect = document.getElementById('paymentFrequency');
    
    if (deductibleSelect) {
        deductibleSelect.addEventListener('change', updatePrices);
    }
    if (paymentSelect) {
        paymentSelect.addEventListener('change', updatePrices);
    }
    
    // Continue button
    const continueBtn = document.getElementById('continueBtn');
    if (continueBtn) {
        continueBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Continue button clicked, selectedPlan:', selectedPlan);
            
            if (selectedPlan) {
                // Store selected plan data
                const selectedPlanData = {
                    plan: selectedPlan,
                    deductible: deductibleSelect ? deductibleSelect.value : '20',
                    paymentFrequency: paymentSelect ? paymentSelect.value : 'monthly',
                    price: getCurrentPrice(selectedPlan)
                };
                
                localStorage.setItem('selectedPlanData', JSON.stringify(selectedPlanData));
                console.log('Plan data stored:', selectedPlanData);
                
                // Navigate to application form
                window.location.href = 'application.html?from=pricing';
            } else {
                alert('Bitte wählen Sie zuerst einen Tarif aus.');
            }
        });
    }
}

function selectPlan(planName) {
    console.log('Selecting plan:', planName);
    
    // Clear previous selections
    document.querySelectorAll('.price-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelectorAll('.select-btn, .table-select-btn').forEach(btn => {
        btn.classList.remove('selected');
    });

    // Select new plan
    const planCard = document.querySelector(`[data-plan="${planName}"].price-card`);
    if (planCard) {
        planCard.classList.add('selected');
    }
    
    // Select the button
    const planButton = document.querySelector(`[data-plan="${planName}"].select-btn, [data-plan="${planName}"].table-select-btn`);
    if (planButton) {
        planButton.classList.add('selected');
    }

    selectedPlan = planName;
    highlightTableColumn(planName);
    showSelectedPlan();
    enableContinueButton();
    
    console.log('Plan selected successfully:', selectedPlan);
}

function highlightTableColumn(planName) {
    // Clear previous highlighting
    clearTableColumnHighlight();
    
    // Map plan names to column indices
    const columnMap = {
        'basis': 2,
        'smart': 3,
        'komfort': 4
    };
    
    const columnIndex = columnMap[planName];
    if (!columnIndex) return;
    
    // Highlight the entire column
    const columnCells = document.querySelectorAll(`
        .comparison-table th:nth-child(${columnIndex}),
        .comparison-table td:nth-child(${columnIndex})
    `);
    
    columnCells.forEach(cell => {
        cell.classList.add('selected-column');
    });
}

function clearTableColumnHighlight() {
    const highlightedCells = document.querySelectorAll('.selected-column');
    highlightedCells.forEach(cell => {
        cell.classList.remove('selected-column');
    });
}

function showSelectedPlan() {
    if (!selectedPlan) return;

    const planNames = {
        basis: 'Basis',
        smart: 'Smart', 
        komfort: 'Komfort'
    };

    const planName = planNames[selectedPlan] || selectedPlan;
    const price = getCurrentPrice(selectedPlan);
    const period = getBillingPeriod();

    const selectedPlanElement = document.getElementById('selectedPlan');
    const selectedPlanName = document.getElementById('selectedPlanName');
    const selectedPlanPrice = document.getElementById('selectedPlanPrice');
    
    if (selectedPlanName) selectedPlanName.textContent = planName;
    if (selectedPlanPrice) selectedPlanPrice.textContent = `€${price}${period}`;
    if (selectedPlanElement) selectedPlanElement.style.display = 'block';
}

function hideSelectedPlan() {
    const selectedPlanElement = document.getElementById('selectedPlan');
    if (selectedPlanElement) {
        selectedPlanElement.style.display = 'none';
    }
}

function enableContinueButton() {
    const btn = document.getElementById('continueBtn');
    if (btn) {
        btn.disabled = false;
        btn.style.backgroundColor = '#c80a50';
        btn.style.color = 'white';
        btn.style.cursor = 'pointer';
        btn.style.opacity = '1';
        console.log('Continue button enabled');
    }
}

function disableContinueButton() {
    const btn = document.getElementById('continueBtn');
    if (btn) {
        btn.disabled = true;
        btn.style.backgroundColor = '#ccc';
        btn.style.color = '#666';
        btn.style.cursor = 'not-allowed';
        btn.style.opacity = '0.6';
        console.log('Continue button disabled');
    }
}

function updatePrices() {
    const deductibleSelect = document.getElementById('deductible');
    const paymentSelect = document.getElementById('paymentFrequency');
    
    const deductible = deductibleSelect ? deductibleSelect.value : '20';
    const billing = paymentSelect ? paymentSelect.value : 'monthly';
    const multiplier = deductibleMultipliers[deductible] || 1.0;

    Object.keys(planPrices).forEach(plan => {
        const basePrice = planPrices[plan][billing] || planPrices[plan].monthly;
        const finalPrice = (basePrice * multiplier).toFixed(2);
        
        // Update price display
        const amountElement = document.querySelector(`[data-plan="${plan}"] .amount`);
        if (amountElement) {
            amountElement.textContent = finalPrice;
        }
    });

    // Update period text
    const periodText = getBillingPeriodText(billing);
    document.querySelectorAll('.period').forEach(element => {
        element.textContent = `pro ${periodText}`;
    });

    // Update selected plan if one is chosen
    if (selectedPlan) {
        showSelectedPlan();
    }
}

function getCurrentPrice(plan) {
    const deductibleSelect = document.getElementById('deductible');
    const paymentSelect = document.getElementById('paymentFrequency');
    
    const deductible = deductibleSelect ? deductibleSelect.value : '20';
    const billing = paymentSelect ? paymentSelect.value : 'monthly';
    const multiplier = deductibleMultipliers[deductible] || 1.0;
    const basePrice = planPrices[plan][billing] || planPrices[plan].monthly;
    
    return (basePrice * multiplier).toFixed(2);
}

function getBillingPeriod() {
    const paymentSelect = document.getElementById('paymentFrequency');
    const billing = paymentSelect ? paymentSelect.value : 'monthly';
    
    return billing === 'monthly' ? '/Monat' : 
           billing === 'quarterly' ? '/Quartal' : 
           billing === 'yearly' ? '/Jahr' : '/Monat';
}

function getBillingPeriodText(billing) {
    return billing === 'monthly' ? 'Monat' :
           billing === 'quarterly' ? 'Quartal' :
           billing === 'yearly' ? 'Jahr' : 'Monat';
}

function goBack() {
    window.location.href = 'index.html';
}

// Add CSS for selected states
const style = document.createElement('style');
style.textContent = `
    .price-card.selected {
        border: 2px solid #c80a50 !important;
        box-shadow: 0 4px 20px rgba(200, 10, 80, 0.15) !important;
        transform: translateY(-2px) !important;
    }
    
    .select-btn.selected,
    .table-select-btn.selected {
        background: #c80a50 !important;
        color: white !important;
        border-color: #c80a50 !important;
    }
    
    .selected-column {
        background: rgba(200, 10, 80, 0.05) !important;
        border-left: 2px solid #c80a50 !important;
        border-right: 2px solid #c80a50 !important;
    }
    
    .comparison-table .selected-column:first-of-type {
        border-left: 2px solid #c80a50 !important;
    }
    
    .comparison-table .selected-column:last-of-type {
        border-right: 2px solid #c80a50 !important;
    }
`;
document.head.appendChild(style);