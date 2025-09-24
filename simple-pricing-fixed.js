// Simple Pricing JavaScript - Clean Working Version

let selectedPlan = null;

// Pricing data with deductible and frequency options
const planPrices = {
    basis: { monthly: 8.14, quarterly: 24.42, yearly: 97.68 },
    smart: { monthly: 12.28, quarterly: 36.84, yearly: 147.36 },
    komfort: { monthly: 20.40, quarterly: 61.20, yearly: 244.80 }
};

const deductibleMultipliers = {
    no: 1.2,
    10: 1.1,
    20: 1.0
};

console.log('Simple pricing script loading...');

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing simple pricing page');
    
    setupEventListeners();
    updatePrices();
    disableContinueButton();
    
    console.log('Simple pricing initialization complete');
});

function setupEventListeners() {
    console.log('Setting up event listeners');
    
    // Plan selection buttons - both card buttons and table buttons
    const planButtons = document.querySelectorAll('.select-btn, .table-select-btn');
    console.log('Found plan buttons:', planButtons.length);
    
    planButtons.forEach((button, index) => {
        const plan = button.getAttribute('data-plan');
        console.log(`Button ${index}: plan="${plan}"`);
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Plan button clicked:', plan);
            selectPlan(plan);
        });
    });

    // Price control changes
    const deductibleSelect = document.getElementById('deductible');
    const paymentSelect = document.getElementById('paymentFrequency');
    
    if (deductibleSelect) {
        deductibleSelect.addEventListener('change', updatePrices);
        console.log('Deductible selector found and setup');
    }
    if (paymentSelect) {
        paymentSelect.addEventListener('change', updatePrices);
        console.log('Payment frequency selector found and setup');
    }
    
    // Continue button
    const continueBtn = document.getElementById('continueBtn');
    if (continueBtn) {
        console.log('Continue button found - setting up click handler');
        continueBtn.addEventListener('click', handleContinueClick);
    } else {
        console.error('Continue button not found!');
    }
}

function handleContinueClick(e) {
    e.preventDefault();
    console.log('Continue button clicked');
    console.log('Selected plan:', selectedPlan);
    
    if (selectedPlan) {
        // Get current settings
        const deductibleSelect = document.getElementById('deductible');
        const paymentSelect = document.getElementById('paymentFrequency');
        
        const deductible = deductibleSelect ? deductibleSelect.value : '20';
        const paymentFrequency = paymentSelect ? paymentSelect.value : 'monthly';
        
        // Store selected plan data
        const selectedPlanData = {
            plan: selectedPlan,
            deductible: deductible,
            paymentFrequency: paymentFrequency,
            price: getCurrentPrice(selectedPlan),
            priceNumeric: getCurrentPriceNumeric(selectedPlan)
        };
        
        console.log('Storing plan data:', selectedPlanData);
        localStorage.setItem('selectedPlanData', JSON.stringify(selectedPlanData));
        
        // Show loading state
        this.textContent = 'Weiter...';
        this.disabled = true;
        
        // Navigate to application form
        setTimeout(() => {
            console.log('Navigating to application.html');
            window.location.href = 'application.html?from=pricing';
        }, 300);
    } else {
        console.log('No plan selected - showing alert');
        alert('Bitte wählen Sie zuerst einen Tarif aus.');
    }
}

function selectPlan(planName) {
    console.log('Selecting plan:', planName);
    
    if (!planName) {
        console.error('Plan name is undefined');
        return;
    }
    
    // Clear previous selections
    document.querySelectorAll('.price-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelectorAll('.select-btn, .table-select-btn').forEach(btn => {
        btn.classList.remove('selected');
    });

    // Select new plan card
    const planCard = document.querySelector(`[data-plan="${planName}"].price-card`);
    if (planCard) {
        planCard.classList.add('selected');
        console.log('Plan card selected');
    } else {
        console.warn('Plan card not found for:', planName);
    }
    
    // Select the button that was clicked
    const planButton = document.querySelector(`[data-plan="${planName}"].select-btn, [data-plan="${planName}"].table-select-btn`);
    if (planButton) {
        planButton.classList.add('selected');
        console.log('Plan button selected');
    }

    selectedPlan = planName;
    highlightTableColumn(planName);
    showSelectedPlan();
    enableContinueButton();
    
    console.log('Plan selection complete:', selectedPlan);
}

function highlightTableColumn(planName) {
    clearTableColumnHighlight();
    
    const columnMap = {
        'basis': 2,
        'smart': 3,
        'komfort': 4
    };
    
    const columnIndex = columnMap[planName];
    if (!columnIndex) return;
    
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
    const selectedPlanNameElement = document.getElementById('selectedPlanName');
    const selectedPlanPriceElement = document.getElementById('selectedPlanPrice');
    
    if (selectedPlanNameElement) selectedPlanNameElement.textContent = planName;
    if (selectedPlanPriceElement) selectedPlanPriceElement.textContent = `€${price}${period}`;
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
        btn.style.cursor = 'pointer';
        btn.style.opacity = '1';
        btn.style.color = 'white';
        btn.textContent = 'Weiter →';
        console.log('Continue button enabled');
    } else {
        console.error('Continue button not found when trying to enable');
    }
}

function disableContinueButton() {
    const btn = document.getElementById('continueBtn');
    if (btn) {
        btn.disabled = true;
        btn.style.backgroundColor = '#ccc';
        btn.style.cursor = 'not-allowed';
        btn.style.opacity = '0.6';
        btn.style.color = '#666';
        btn.textContent = 'Weiter →';
        console.log('Continue button disabled');
    }
}

function updatePrices() {
    const deductibleSelect = document.getElementById('deductible');
    const paymentSelect = document.getElementById('paymentFrequency');
    
    const deductible = deductibleSelect ? deductibleSelect.value : '20';
    const billing = paymentSelect ? paymentSelect.value : 'monthly';
    const multiplier = deductibleMultipliers[deductible] || 1.0;

    console.log('Updating prices - Deductible:', deductible, 'Billing:', billing, 'Multiplier:', multiplier);

    Object.keys(planPrices).forEach(plan => {
        const basePrice = planPrices[plan][billing] || planPrices[plan].monthly;
        const finalPrice = (basePrice * multiplier).toFixed(2);
        
        // Update price display
        const amountElement = document.querySelector(`[data-plan="${plan}"] .amount`);
        if (amountElement) {
            amountElement.textContent = finalPrice;
            console.log(`Updated ${plan} price to ${finalPrice}`);
        } else {
            console.warn(`Amount element not found for plan: ${plan}`);
        }
    });

    // Update period text
    const period = getBillingPeriodText(billing);
    document.querySelectorAll('.period').forEach(element => {
        element.textContent = period;
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
    const basePrice = planPrices[plan]?.[billing] || planPrices[plan]?.monthly || 0;
    return (basePrice * multiplier).toFixed(2);
}

function getCurrentPriceNumeric(plan) {
    const deductibleSelect = document.getElementById('deductible');
    const paymentSelect = document.getElementById('paymentFrequency');
    
    const deductible = deductibleSelect ? deductibleSelect.value : '20';
    const billing = paymentSelect ? paymentSelect.value : 'monthly';
    const multiplier = deductibleMultipliers[deductible] || 1.0;
    const basePrice = planPrices[plan]?.[billing] || planPrices[plan]?.monthly || 0;
    return basePrice * multiplier;
}

function getBillingPeriod() {
    const paymentSelect = document.getElementById('paymentFrequency');
    const billing = paymentSelect ? paymentSelect.value : 'monthly';
    return billing === 'monthly' ? '/Monat' : billing === 'quarterly' ? '/Quartal' : billing === 'yearly' ? '/Jahr' : '/Monat';
}

function getBillingPeriodText(billing) {
    const periods = {
        'monthly': 'pro Monat',
        'quarterly': 'pro Quartal', 
        'semi-annually': 'pro Halbjahr',
        'yearly': 'pro Jahr'
    };
    return periods[billing] || 'pro Monat';
}

function goBack() {
    console.log('Going back to index.html');
    window.location.href = 'index.html';
}

// Make goBack available globally
window.goBack = goBack;

console.log('Simple pricing script loaded successfully');