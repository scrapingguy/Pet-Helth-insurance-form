// Plans Page JavaScript with JSON Data Binding
let selectedPlan = null;
let productsData = null;

// Your Complete JSON Response Data
const jsonResponse = {
    "success": true,
    "data": {
        "data": {
            "productResponse": {
                "products": [
                    {
                        "id": "1",
                        "ident": "TM001",
                        "ps20ident": "BASIC",
                        "title": "Basis",
                        "topSeller": false,
                        "priceAmount": 9.72,
                        "priceUnit": "M",
                        "vat": 0.19,
                        "disabled": false,
                        "options": [
                            {
                                "id": "1",
                                "ident": "HB",
                                "ps20ident": "Curative Treatment up to",
                                "title": "Heilbehandlungs- und Vorsorgeschutz",
                                "icon": "product-health-stethoscope",
                                "inclusive": false,
                                "vat": 0.19,
                                "params": [
                                    {
                                        "id": "1",
                                        "type": "RADIO",
                                        "title": "",
                                        "config": [
                                            {
                                                "value": 2000,
                                                "ps20Ident": "Curative Treatment up to 2000 EUR/50 EUR",
                                                "price": 26.26,
                                                "inclusive": false,
                                                "displayValue": "Bis 2.000 € Heilbehandlungsschutz + 50 € Vorsorgezuschuss",
                                                "disabled": false,
                                                "displayValueWithPrice": "Bis 2.000 € Heilbehandlungsschutz + 50 € Vorsorgezuschuss (26,26 €)"
                                            },
                                            {
                                                "value": 5000,
                                                "ps20Ident": "Curative Treatment up to 5000 EUR/100 EUR",
                                                "price": -1,
                                                "inclusive": false,
                                                "displayValue": "Bis 5.000 € Heilbehandlungsschutz + 100 € Vorsorgezuschuss",
                                                "disabled": true,
                                                "displayValueWithPrice": "Bis 5.000 € Heilbehandlungsschutz + 100 € Vorsorgezuschuss"
                                            }
                                        ],
                                        "initialValue": 2000,
                                        "inclusiveValue": 5000
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "id": "2",
                        "ident": "TM002",
                        "ps20ident": "SMART",
                        "title": "Smart",
                        "topSeller": false,
                        "priceAmount": 17.91,
                        "priceUnit": "M",
                        "vat": 0.19,
                        "disabled": false,
                        "options": [
                            {
                                "id": "1",
                                "ident": "HB",
                                "ps20ident": "Curative Treatment up to",
                                "title": "Heilbehandlungs- und Vorsorgeschutz",
                                "icon": "product-health-stethoscope",
                                "inclusive": false,
                                "vat": 0.19,
                                "params": [
                                    {
                                        "id": "1",
                                        "type": "RADIO",
                                        "title": "",
                                        "config": [
                                            {
                                                "value": 2000,
                                                "ps20Ident": "Curative Treatment up to 2000 EUR/50 EUR",
                                                "price": 26.26,
                                                "inclusive": false,
                                                "displayValue": "Bis 2.000 € Heilbehandlungsschutz + 50 € Vorsorgezuschuss",
                                                "disabled": false,
                                                "displayValueWithPrice": "Bis 2.000 € Heilbehandlungsschutz + 50 € Vorsorgezuschuss (26,26 €)"
                                            },
                                            {
                                                "value": 5000,
                                                "ps20Ident": "Curative Treatment up to 5000 EUR/100 EUR",
                                                "price": 26.26,
                                                "inclusive": false,
                                                "displayValue": "Bis 5.000 € Heilbehandlungsschutz + 100 € Vorsorgezuschuss",
                                                "disabled": false,
                                                "displayValueWithPrice": "Bis 5.000 € Heilbehandlungsschutz + 100 € Vorsorgezuschuss (26,26 €)"
                                            }
                                        ],
                                        "initialValue": 2000,
                                        "inclusiveValue": 5000
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "id": "3",
                        "ident": "TM003",
                        "ps20ident": "COMFORT",
                        "title": "Komfort",
                        "topSeller": true,
                        "priceAmount": 31.82,
                        "priceUnit": "M",
                        "vat": 0.19,
                        "disabled": false,
                        "options": [
                            {
                                "id": "1",
                                "ident": "HB",
                                "ps20ident": "Curative Treatment up to",
                                "title": "Heilbehandlungs- und Vorsorgeschutz",
                                "icon": "product-health-stethoscope",
                                "inclusive": false,
                                "vat": 0.19,
                                "params": [
                                    {
                                        "id": "1",
                                        "type": "RADIO",
                                        "title": "",
                                        "config": [
                                            {
                                                "value": 2000,
                                                "ps20Ident": "Curative Treatment up to 2000 EUR/50 EUR",
                                                "price": 26.26,
                                                "inclusive": false,
                                                "displayValue": "Bis 2.000 € Heilbehandlungsschutz + 50 € Vorsorgezuschuss",
                                                "disabled": false,
                                                "displayValueWithPrice": "Bis 2.000 € Heilbehandlungsschutz + 50 € Vorsorgezuschuss (26,26 €)"
                                            },
                                            {
                                                "value": 5000,
                                                "ps20Ident": "Curative Treatment up to 5000 EUR/100 EUR",
                                                "price": 26.26,
                                                "inclusive": false,
                                                "displayValue": "Bis 5.000 € Heilbehandlungsschutz + 100 € Vorsorgezuschuss",
                                                "disabled": false,
                                                "displayValueWithPrice": "Bis 5.000 € Heilbehandlungsschutz + 100 € Vorsorgezuschuss (26,26 €)"
                                            }
                                        ],
                                        "initialValue": 2000,
                                        "inclusiveValue": 5000
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        }
    }
};

// Function to load JSON from external API
async function loadProductsFromAPI() {
    try {
        // Replace this URL with your actual API endpoint
        const response = await fetch('/api/products');
        const data = await response.json();
        return data;
    } catch (error) {
        console.warn('Failed to load from API, using sample data:', error);
        return jsonResponse;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initializeProducts();
    setupEventHandlers();
    setupStickyPricing();
});

async function initializeProducts() {
    try {
        // Try to load from API, fallback to sample data
        const data = await loadProductsFromAPI();
        
        if (data.success) {
            productsData = data.data.data.productResponse.products;
            renderProducts();
            console.log('Products loaded successfully:', productsData.length, 'products');
            console.log('Product details:', productsData);
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function renderProducts() {
    const container = document.querySelector('.plan-cards');
    if (!container || !productsData) return;
    
    container.innerHTML = '';
    
    productsData.forEach(product => {
        const cardHTML = createProductCard(product);
        container.insertAdjacentHTML('beforeend', cardHTML);
    });
    
    attachCardEventListeners();
}

function createProductCard(product) {
    const topSellerBadge = product.topSeller ? '<div class="top-seller-badge">Bestseller</div>' : '';
    const featuredClass = product.topSeller ? 'featured' : '';
    
    return `
        <div class="plan-card ${featuredClass}" data-product-id="${product.id}">
            ${topSellerBadge}
            <div class="plan-header">
                <h3 class="plan-name">${product.title}</h3>
                <div class="plan-price">
                    <span class="price">${formatPrice(product.priceAmount)}</span>
                    <span class="period">pro Monat</span>
                </div>
            </div>
            ${renderProductOptions(product.options)}
            <button class="plan-button" data-plan="${product.id}" ${product.disabled ? 'disabled' : ''}>
                ${product.disabled ? 'Nicht verfügbar' : 'Auswählen'}
            </button>
        </div>
    `;
}

function renderProductOptions(options) {
    if (!options || options.length === 0) return '';
    
    return `<div class="product-options">
        ${options.map(option => `
            <div class="product-option">
                <div class="option-title">
                    <span class="option-icon">🩺</span>
                    <span>${option.title}</span>
                </div>
                ${renderOptionParams(option.params)}
            </div>
        `).join('')}
    </div>`;
}

function renderOptionParams(params) {
    if (!params || params.length === 0) return '';
    
    return params.map(param => {
        if (param.type === 'RADIO' && param.config) {
            return `
                <div class="option-params">
                    ${param.config.map(config => `
                        <div class="param-config ${config.disabled ? 'disabled' : ''}">
                            <label class="radio-option">
                                <input type="radio" 
                                       name="param_${param.id}" 
                                       value="${config.value}"
                                       ${config.value === param.initialValue ? 'checked' : ''}
                                       ${config.disabled ? 'disabled' : ''}>
                                <span class="radio-text">${config.displayValue}</span>
                                ${config.price > 0 ? `<span class="option-price">+${formatPrice(config.price)}</span>` : ''}
                            </label>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        return '';
    }).join('');
}

function attachCardEventListeners() {
    const buttons = document.querySelectorAll('.plan-button:not([disabled])');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            buttons.forEach(btn => {
                btn.classList.remove('selected');
                btn.closest('.plan-card').classList.remove('selected');
            });
            
            this.classList.add('selected');
            this.closest('.plan-card').classList.add('selected');
            
            selectedPlan = this.dataset.plan;
            enableContinueButton();
        });
    });
}

function setupEventHandlers() {
    const continueBtn = document.getElementById('continueBtn');
    
    if (continueBtn) {
        continueBtn.disabled = true;
        continueBtn.addEventListener('click', handleContinueClick);
    }
    
    const deductibleSelect = document.getElementById('deductible');
    const paymentSelect = document.getElementById('paymentFrequency');
    
    if (deductibleSelect) {
        deductibleSelect.addEventListener('change', updatePrices);
    }
    if (paymentSelect) {
        paymentSelect.addEventListener('change', updatePrices);
    }
    
    initExpandableSections();
}

// Sticky pricing header logic
function setupStickyPricing() {
    const pricingTable = document.getElementById('pricingTable');
    const pricingScroll = document.getElementById('pricingScroll');
    const placeholder = document.getElementById('pricingPlaceholder');
    const comparisonScroll = document.getElementById('comparisonScroll');
    const ctaScroll = document.getElementById('ctaScroll');
    if (!pricingTable || !pricingScroll || !placeholder) return;

    let pricingTop = pricingTable.offsetTop;
    const pricingHeight = () => pricingTable.offsetHeight;

    function onScroll() {
        const y = window.scrollY || document.documentElement.scrollTop;
        if (y >= pricingTop) {
            pricingTable.classList.add('is-fixed');
            placeholder.style.height = pricingHeight() + 'px';
        } else {
            pricingTable.classList.remove('is-fixed');
            placeholder.style.height = '0px';
        }
    }

    // Recompute top on resize/content load
    function recalc() { pricingTop = pricingTable.getBoundingClientRect().top + window.scrollY; onScroll(); }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', recalc);
    window.addEventListener('orientationchange', recalc);
    setTimeout(recalc, 0);

    // Keep pricing horizontal scroll in sync with comparison on touch devices
    if (comparisonScroll) {
        let syncing = false;
        pricingScroll.addEventListener('scroll', () => {
            if (syncing) return; syncing = true;
            comparisonScroll.scrollLeft = pricingScroll.scrollLeft;
            if (ctaScroll) ctaScroll.scrollLeft = pricingScroll.scrollLeft;
            syncing = false;
        }, { passive: true });
        comparisonScroll.addEventListener('scroll', () => {
            if (syncing) return; syncing = true;
            pricingScroll.scrollLeft = comparisonScroll.scrollLeft;
            if (ctaScroll) ctaScroll.scrollLeft = comparisonScroll.scrollLeft;
            syncing = false;
        }, { passive: true });
        if (ctaScroll) {
            ctaScroll.addEventListener('scroll', () => {
                if (syncing) return; syncing = true;
                pricingScroll.scrollLeft = ctaScroll.scrollLeft;
                comparisonScroll.scrollLeft = ctaScroll.scrollLeft;
                syncing = false;
            }, { passive: true });
        }
    }
}

function handleContinueClick(e) {
    e.preventDefault();
    if (selectedPlan) {
        const selectedProduct = productsData.find(p => p.id === selectedPlan);
        
        localStorage.setItem('selectedPlanData', JSON.stringify({
            productId: selectedPlan,
            product: selectedProduct
        }));
        
        this.textContent = 'Weiter...';
        this.disabled = true;
        
        setTimeout(() => {
            window.location.href = 'application.html';
        }, 300);
    }
}

function enableContinueButton() {
    const continueBtn = document.getElementById('continueBtn');
    if (continueBtn) {
        continueBtn.disabled = false;
        continueBtn.style.backgroundColor = '#c80a50';
        continueBtn.style.cursor = 'pointer';
        continueBtn.style.opacity = '1';
    }
}

function updatePrices() {
    if (!productsData) return;
    
    const deductible = document.getElementById('deductible')?.value || '20';
    const frequency = document.getElementById('paymentFrequency')?.value || 'monthly';
    
    productsData.forEach(product => {
        const card = document.querySelector(`[data-product-id="${product.id}"]`);
        if (card) {
            const priceElement = card.querySelector('.price');
            const periodElement = card.querySelector('.period');
            
            if (priceElement && periodElement) {
                const calculatedPrice = calculatePrice(product, deductible, frequency);
                priceElement.textContent = calculatedPrice;
                periodElement.textContent = `pro ${getPeriodText(frequency)}`;
            }
        }
    });
}

function calculatePrice(product, deductible, frequency) {
    let basePrice = product.priceAmount;
    
    if (deductible === '10') basePrice *= 0.9;
    else if (deductible === '20') basePrice *= 0.8;
    
    const multipliers = {
        'monthly': 1,
        'quarterly': 3,
        'semi-annually': 6,
        'yearly': 12
    };
    
    const finalPrice = basePrice * (multipliers[frequency] || 1);
    return formatPrice(finalPrice);
}

function formatPrice(amount) {
    return `${amount.toFixed(2).replace('.', ',')} €`;
}

function getPeriodText(frequency) {
    const periods = {
        'monthly': 'Monat',
        'quarterly': 'Quartal',
        'semi-annually': 'Halbjahr',
        'yearly': 'Jahr'
    };
    return periods[frequency] || 'Monat';
}

function initExpandableSections() {
    const headers = document.querySelectorAll('.section-header');
    
    headers.forEach(header => {
        header.addEventListener('click', function() {
            const target = this.getAttribute('data-toggle');
            const content = document.getElementById(target + '-content');
            const icon = this.querySelector('.toggle-icon');
            
            if (content) {
                const isExpanded = content.classList.contains('active');
                
                if (isExpanded) {
                    content.style.maxHeight = '0px';
                    content.classList.remove('active');
                    this.classList.remove('active');
                    if (icon) icon.style.transform = 'rotate(0deg)';
                } else {
                    content.classList.add('active');
                    this.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + 'px';
                    if (icon) icon.style.transform = 'rotate(180deg)';
                }
            }
        });
        
        // Add mobile-friendly touch feedback
        if ('ontouchstart' in window) {
            header.addEventListener('touchstart', function() {
                this.style.backgroundColor = '#f0f0f0';
            });
            header.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.style.backgroundColor = '';
                }, 150);
            });
        }
    });
    
    populateExpandableContent();
}

function populateExpandableContent() {
    const operationContent = document.getElementById('operation-content');
    if (operationContent && operationContent.innerHTML.trim() === '') {
        operationContent.innerHTML = `
            <div class="coverage-row">
                <div class="coverage-label">
                    <span>Physiotherapie nach einer Operation</span>
                </div>
                <div class="coverage-values">
                    <div class="coverage-value basis">—</div>
                    <div class="coverage-value smart">bis 500 €</div>
                    <div class="coverage-value komfort">bis 1.000 €</div>
                </div>
            </div>
        `;
    }
}

window.goBack = function() {
    window.history.back();
};

// Add styles
const style = document.createElement('style');
style.textContent = `
    .plan-card.selected {
        border: 2px solid #c80a50 !important;
        box-shadow: 0 4px 20px rgba(200, 10, 80, 0.15) !important;
        transform: translateY(-2px) !important;
    }
    
    .plan-button.selected {
        background: #c80a50 !important;
        color: white !important;
    }
    
    .top-seller-badge {
        position: absolute;
        top: -10px;
        right: 20px;
        background: #c80a50;
        color: white;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: bold;
        z-index: 10;
    }
    
    .product-options {
        margin: 15px 0;
        padding: 15px;
        background: #f8f9fa;
        border-radius: 8px;
        border: 1px solid #e9ecef;
    }
    
    .option-title {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        font-weight: 600;
    }
    
    .option-icon {
        margin-right: 8px;
    }
    
    .option-params {
        margin-left: 20px;
    }
    
    .radio-option {
        display: flex;
        align-items: center;
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 6px;
        background: white;
        cursor: pointer;
        transition: all 0.2s ease;
        margin: 5px 0;
    }
    
    .radio-option:hover {
        border-color: #c80a50;
        background: #faf5f7;
    }
    
    .radio-option input[type="radio"] {
        margin-right: 10px;
    }
    
    .radio-text {
        flex: 1;
        font-size: 14px;
    }
    
    .option-price {
        color: #c80a50;
        font-weight: 600;
        margin-left: 10px;
    }
    
    .plan-card {
        position: relative;
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(style);