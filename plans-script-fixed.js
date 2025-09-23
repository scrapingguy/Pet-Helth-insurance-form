// Plans Page JavaScript with JSON Data Binding// Plans Page JavaScript with JSON Data Binding// Plans Page JavaScript - Clean Professional Version with JSON Data Binding// Plans Page JavaScript - Clean Professional Version

let selectedPlan = null;

let productsData = null;let selectedPlan = null;



// JSON Response Data Structurelet productsData = null;

const productResponse = {

    "success": true,

    "data": {

        "data": {// Your JSON response datalet selectedPlan = null;let selectedPlan = null;

            "productResponse": {

                "products": [const productResponse = {

                    {

                        "id": "1",    "success": true,let productsData = null;let productsData = null;

                        "title": "Basis", 

                        "topSeller": false,    "data": {

                        "priceAmount": 9.72,

                        "priceUnit": "M",        "data": {

                        "disabled": false,

                        "options": []            "productResponse": {

                    },

                    {                "products": [// Sample JSON response - replace this with your actual API call// Sample JSON response - replace this with your actual API call

                        "id": "2", 

                        "title": "Smart",                    {

                        "topSeller": false,

                        "priceAmount": 17.91,                        "id": "1",const sampleProductResponse = {const sampleProductResponse = {

                        "priceUnit": "M", 

                        "disabled": false,                        "title": "Basis",

                        "options": []

                    },                        "topSeller": false,    "success": true,    "success": true,

                    {

                        "id": "3",                        "priceAmount": 9.72,

                        "title": "Komfort",

                        "topSeller": true,                        "priceUnit": "M",    "data": {    "data": {

                        "priceAmount": 31.82,

                        "priceUnit": "M",                        "disabled": false,

                        "disabled": false,

                        "options": []                        "options": [        "data": {        "data": {

                    }

                ]                            {

            }

        }                                "id": "1",            "productResponse": {            "productResponse": {

    }

};                                "title": "Heilbehandlungs- und Vorsorgeschutz",



document.addEventListener('DOMContentLoaded', function() {                                "icon": "product-health-stethoscope",                "products": [                "products": [

    initializeProducts();

    setupEventHandlers();                                "params": [

});

                                    {                    {                    {

function initializeProducts() {

    try {                                        "id": "1",

        if (productResponse.success) {

            productsData = productResponse.data.data.productResponse.products;                                        "type": "RADIO",                        "id": "1",                        "id": "1",

            renderProducts();

            console.log('Products loaded successfully:', productsData.length, 'products');                                        "config": [

        }

    } catch (error) {                                            {                        "ident": "TM001",                        "ident": "TM001",

        console.error('Error loading products:', error);

    }                                                "value": 2000,

}

                                                "price": 26.26,                        "ps20ident": "BASIC",                        "ps20ident": "BASIC",

function renderProducts() {

    const container = document.querySelector('.plan-cards');                                                "displayValue": "Bis 2.000 € Heilbehandlungsschutz + 50 € Vorsorgezuschuss",

    if (!container || !productsData) return;

                                                    "disabled": false                        "title": "Basis",                        "title": "Basis",

    container.innerHTML = '';

                                                },

    productsData.forEach(product => {

        const cardHTML = createProductCard(product);                                            {                        "topSeller": false,                        "topSeller": false,

        container.insertAdjacentHTML('beforeend', cardHTML);

    });                                                "value": 5000,

    

    attachCardEventListeners();                                                "price": -1,                        "priceAmount": 9.72,                        "priceAmount": 9.72,

}

                                                "displayValue": "Bis 5.000 € Heilbehandlungsschutz + 100 € Vorsorgezuschuss",

function createProductCard(product) {

    const topSellerBadge = product.topSeller ? '<div class="top-seller-badge">Bestseller</div>' : '';                                                "disabled": true                        "priceUnit": "M",                        "priceUnit": "M",

    const featuredClass = product.topSeller ? 'featured' : '';

                                                }

    return `

        <div class="plan-card ${featuredClass}" data-product-id="${product.id}">                                        ],                        "vat": 0.19,                        "vat": 0.19,

            ${topSellerBadge}

            <div class="plan-header">                                        "initialValue": 2000

                <h3 class="plan-name">${product.title}</h3>

                <div class="plan-price">                                    }                        "disabled": false,                        "disabled": false,

                    <span class="price">${formatPrice(product.priceAmount)}</span>

                    <span class="period">pro Monat</span>                                ]

                </div>

            </div>                            }                        "options": [                        "options": [

            <button class="plan-button" data-plan="${product.id}" ${product.disabled ? 'disabled' : ''}>

                ${product.disabled ? 'Nicht verfügbar' : 'Auswählen'}                        ]

            </button>

        </div>                    },                            {                            {

    `;

}                    {



function attachCardEventListeners() {                        "id": "2",                                "id": "1",                                "id": "1",

    const buttons = document.querySelectorAll('.plan-button:not([disabled])');

                            "title": "Smart",

    buttons.forEach(button => {

        button.addEventListener('click', function(e) {                        "topSeller": false,                                "ident": "HB",                                "ident": "HB",

            e.preventDefault();

                                    "priceAmount": 17.91,

            buttons.forEach(btn => {

                btn.classList.remove('selected');                        "priceUnit": "M",                                "ps20ident": "Curative Treatment up to",                                "ps20ident": "Curative Treatment up to",

                btn.closest('.plan-card').classList.remove('selected');

            });                        "disabled": false,

            

            this.classList.add('selected');                        "options": [                                "title": "Heilbehandlungs- und Vorsorgeschutz",                                "title": "Heilbehandlungs- und Vorsorgeschutz",

            this.closest('.plan-card').classList.add('selected');

                                        {

            selectedPlan = this.dataset.plan;

            enableContinueButton();                                "id": "1",                                "icon": "product-health-stethoscope",                                "icon": "product-health-stethoscope",

        });

    });                                "title": "Heilbehandlungs- und Vorsorgeschutz",

}

                                "icon": "product-health-stethoscope",                                "inclusive": false,                                "inclusive": false,

function setupEventHandlers() {

    const continueBtn = document.getElementById('continueBtn');                                "params": [

    const deductibleSelect = document.getElementById('deductible');

    const paymentSelect = document.getElementById('paymentFrequency');                                    {                                "vat": 0.19,                                "vat": 0.19,

    

    if (continueBtn) {                                        "id": "1",

        continueBtn.disabled = true;

        continueBtn.addEventListener('click', handleContinueClick);                                        "type": "RADIO",                                "params": [                                "params": [

    }

                                            "config": [

    if (deductibleSelect) {

        deductibleSelect.addEventListener('change', updatePrices);                                            {                                    {                                    {

    }

    if (paymentSelect) {                                                "value": 2000,

        paymentSelect.addEventListener('change', updatePrices);

    }                                                "price": 26.26,                                        "id": "1",                                        "id": "1",

    

    initExpandableSections();                                                "displayValue": "Bis 2.000 € Heilbehandlungsschutz + 50 € Vorsorgezuschuss",

}

                                                "disabled": false                                        "type": "RADIO",                                        "type": "RADIO",

function handleContinueClick(e) {

    e.preventDefault();                                            },

    if (selectedPlan) {

        const selectedProduct = productsData.find(p => p.id === selectedPlan);                                            {                                        "title": "",                                        "title": "",

        const planData = {

            productId: selectedPlan,                                                "value": 5000,

            product: selectedProduct,

            deductible: document.getElementById('deductible')?.value || '20',                                                "price": 26.26,                                        "config": [                                        "config": [

            paymentFrequency: document.getElementById('paymentFrequency')?.value || 'monthly'

        };                                                "displayValue": "Bis 5.000 € Heilbehandlungsschutz + 100 € Vorsorgezuschuss",

        

        localStorage.setItem('selectedPlanData', JSON.stringify(planData));                                                "disabled": false                                            {                                            {

        this.textContent = 'Weiter...';

        this.disabled = true;                                            }

        

        setTimeout(() => {                                        ],                                                "value": 2000,                                                "value": 2000,

            window.location.href = 'application.html';

        }, 300);                                        "initialValue": 2000

    }

}                                    }                                                "ps20Ident": "Curative Treatment up to 2000 EUR/50 EUR",                                                "ps20Ident": "Curative Treatment up to 2000 EUR/50 EUR",



function enableContinueButton() {                                ]

    const continueBtn = document.getElementById('continueBtn');

    if (continueBtn) {                            }                                                "price": 26.26,                                                "price": 26.26,

        continueBtn.disabled = false;

        continueBtn.style.backgroundColor = '#c80a50';                        ]

        continueBtn.style.cursor = 'pointer';

        continueBtn.style.opacity = '1';                    },                                                "inclusive": false,                                                "inclusive": false,

    }

}                    {



function updatePrices() {                        "id": "3",                                                "displayValue": "Bis 2.000 € Heilbehandlungsschutz + 50 € Vorsorgezuschuss",                                                "displayValue": "Bis 2.000 € Heilbehandlungsschutz + 50 € Vorsorgezuschuss",

    if (!productsData) return;

                            "title": "Komfort",

    const deductible = document.getElementById('deductible')?.value || '20';

    const frequency = document.getElementById('paymentFrequency')?.value || 'monthly';                        "topSeller": true,                                                "disabled": false,                                                "disabled": false,

    

    productsData.forEach(product => {                        "priceAmount": 31.82,

        const card = document.querySelector(`[data-product-id="${product.id}"]`);

        if (card) {                        "priceUnit": "M",                                                "displayValueWithPrice": "Bis 2.000 € Heilbehandlungsschutz + 50 € Vorsorgezuschuss (26,26 €)"                                                "displayValueWithPrice": "Bis 2.000 € Heilbehandlungsschutz + 50 € Vorsorgezuschuss (26,26 €)"

            const priceElement = card.querySelector('.price');

            const periodElement = card.querySelector('.period');                        "disabled": false,

            

            if (priceElement && periodElement) {                        "options": [                                            },                                            },

                const calculatedPrice = calculatePrice(product, deductible, frequency);

                priceElement.textContent = calculatedPrice;                            {

                periodElement.textContent = `pro ${getPeriodText(frequency)}`;

            }                                "id": "1",                                            {                                            {

        }

    });                                "title": "Heilbehandlungs- und Vorsorgeschutz",

}

                                "icon": "product-health-stethoscope",                                                "value": 5000,                                                "value": 5000,

function calculatePrice(product, deductible, frequency) {

    let basePrice = product.priceAmount;                                "params": [

    

    if (deductible === '10') basePrice *= 0.9;                                    {                                                "ps20Ident": "Curative Treatment up to 5000 EUR/100 EUR",                                                "ps20Ident": "Curative Treatment up to 5000 EUR/100 EUR",

    else if (deductible === '20') basePrice *= 0.8;

                                            "id": "1",

    const multipliers = {

        'monthly': 1,                                        "type": "RADIO",                                                "price": -1,                                                "price": -1,

        'quarterly': 3,

        'semi-annually': 6,                                        "config": [

        'yearly': 12

    };                                            {                                                "inclusive": false,                                                "inclusive": false,

    

    const finalPrice = basePrice * (multipliers[frequency] || 1);                                                "value": 2000,

    return formatPrice(finalPrice);

}                                                "price": 26.26,                                                "displayValue": "Bis 5.000 € Heilbehandlungsschutz + 100 € Vorsorgezuschuss",                                                "displayValue": "Bis 5.000 € Heilbehandlungsschutz + 100 € Vorsorgezuschuss",



function formatPrice(amount) {                                                "displayValue": "Bis 2.000 € Heilbehandlungsschutz + 50 € Vorsorgezuschuss",

    return `${amount.toFixed(2).replace('.', ',')} €`;

}                                                "disabled": false                                                "disabled": true,                                                "disabled": true,



function getPeriodText(frequency) {                                            },

    const periods = {

        'monthly': 'Monat',                                            {                                                "displayValueWithPrice": "Bis 5.000 € Heilbehandlungsschutz + 100 € Vorsorgezuschuss"                                                "displayValueWithPrice": "Bis 5.000 € Heilbehandlungsschutz + 100 € Vorsorgezuschuss"

        'quarterly': 'Quartal',

        'semi-annually': 'Halbjahr',                                                "value": 5000,

        'yearly': 'Jahr'

    };                                                "price": 26.26,                                            }                                            }

    return periods[frequency] || 'Monat';

}                                                "displayValue": "Bis 5.000 € Heilbehandlungsschutz + 100 € Vorsorgezuschuss",



function initExpandableSections() {                                                "disabled": false                                        ],                                        ],

    const headers = document.querySelectorAll('.section-header');

                                                }

    headers.forEach(header => {

        header.addEventListener('click', function() {                                        ],                                        "initialValue": 2000,                                        "initialValue": 2000,

            const target = this.getAttribute('data-toggle');

            const content = document.getElementById(target + '-content');                                        "initialValue": 2000

            const icon = this.querySelector('.toggle-icon');

                                                }                                        "inclusiveValue": 5000                                        "inclusiveValue": 5000

            if (content) {

                const isExpanded = content.classList.contains('active');                                ]

                

                if (isExpanded) {                            }                                    }                                    }

                    content.style.maxHeight = '0px';

                    content.classList.remove('active');                        ]

                    this.classList.remove('active');

                    if (icon) icon.style.transform = 'rotate(0deg)';                    }                                ]                                ]

                } else {

                    content.classList.add('active');                ]

                    this.classList.add('active');

                    content.style.maxHeight = content.scrollHeight + 'px';            }                            }                            }

                    if (icon) icon.style.transform = 'rotate(180deg)';

                }        }

            }

        });    }                        ]                        ]

    });

    };

    populateExpandableContent();

}                    },                    },



function populateExpandableContent() {document.addEventListener('DOMContentLoaded', function() {

    const operationContent = document.getElementById('operation-content');

    if (operationContent) {    initializeProducts();                    {                    {

        operationContent.innerHTML = `

            <div class="coverage-row">    setupEventHandlers();

                <div class="coverage-label">

                    <span>Physiotherapie nach einer Operation</span>});                        "id": "2",                        "id": "2",

                </div>

                <div class="coverage-values">

                    <div class="coverage-value basis">—</div>

                    <div class="coverage-value smart">bis 500 €</div>function initializeProducts() {                        "ident": "TM002",                        "ident": "TM002",

                    <div class="coverage-value komfort">bis 1.000 €</div>

                </div>    try {

            </div>

        `;        if (productResponse.success && productResponse.data.data.productResponse.products) {                        "ps20ident": "SMART",                        "ps20ident": "SMART",

    }

}            productsData = productResponse.data.data.productResponse.products;



window.goBack = function() {            renderProducts();                        "title": "Smart",                        "title": "Smart",

    window.history.back();

};            console.log('Products loaded:', productsData);



// Add styles for the new features        }                        "topSeller": false,                        "topSeller": false,

const style = document.createElement('style');

style.textContent = `    } catch (error) {

    .plan-card.selected {

        border: 2px solid #c80a50 !important;        console.error('Error loading products:', error);                        "priceAmount": 17.91,                        "priceAmount": 17.91,

        box-shadow: 0 4px 20px rgba(200, 10, 80, 0.15) !important;

        transform: translateY(-2px) !important;    }

    }

    }                        "priceUnit": "M",                        "priceUnit": "M",

    .plan-button.selected {

        background: #c80a50 !important;

        color: white !important;

    }function renderProducts() {                        "vat": 0.19,                        "vat": 0.19,

    

    .top-seller-badge {    const container = document.querySelector('.plan-cards');

        position: absolute;

        top: -10px;    if (!container || !productsData) return;                        "disabled": false,                        "disabled": false,

        right: 20px;

        background: #c80a50;    

        color: white;

        padding: 4px 12px;    container.innerHTML = '';                        "options": [                        "options": [

        border-radius: 12px;

        font-size: 12px;    

        font-weight: bold;

        z-index: 10;    productsData.forEach(product => {                            {                            {

    }

            const cardHTML = createProductCard(product);

    .plan-card {

        position: relative;        container.insertAdjacentHTML('beforeend', cardHTML);                                "id": "1",                                "id": "1",

        transition: all 0.3s ease;

    }    });

`;

document.head.appendChild(style);                                    "ident": "HB",                                "ident": "HB",

    attachCardEventListeners();

}                                "ps20ident": "Curative Treatment up to",                                "ps20ident": "Curative Treatment up to",



function createProductCard(product) {                                "title": "Heilbehandlungs- und Vorsorgeschutz",                                "title": "Heilbehandlungs- und Vorsorgeschutz",

    const topSellerBadge = product.topSeller ? '<div class="top-seller-badge">Bestseller</div>' : '';

    const featuredClass = product.topSeller ? 'featured' : '';                                "icon": "product-health-stethoscope",                                "icon": "product-health-stethoscope",

    

    return `                                "inclusive": false,                                "inclusive": false,

        <div class="plan-card ${featuredClass}" data-product-id="${product.id}">

            ${topSellerBadge}                                "vat": 0.19,                                "vat": 0.19,

            <div class="plan-header">

                <h3 class="plan-name">${product.title}</h3>                                "params": [                                "params": [

                <div class="plan-price">

                    <span class="price">${formatPrice(product.priceAmount)}</span>                                    {                                    {

                    <span class="period">pro Monat</span>

                </div>                                        "id": "1",                                        "id": "1",

            </div>

            <div class="product-options">                                        "type": "RADIO",                                        "type": "RADIO",

                ${renderOptions(product.options)}

            </div>                                        "title": "",                                        "title": "",

            <button class="plan-button" data-plan="${product.id}" ${product.disabled ? 'disabled' : ''}>

                ${product.disabled ? 'Nicht verfügbar' : 'Auswählen'}                                        "config": [                                        "config": [

            </button>

        </div>                                            {                                            {

    `;

}                                                "value": 2000,                                                "value": 2000,



function renderOptions(options) {                                                "ps20Ident": "Curative Treatment up to 2000 EUR/50 EUR",                                                "ps20Ident": "Curative Treatment up to 2000 EUR/50 EUR",

    if (!options || options.length === 0) return '';

                                                    "price": 26.26,                                                "price": 26.26,

    return options.map(option => `

        <div class="product-option">                                                "inclusive": false,                                                "inclusive": false,

            <div class="option-title">

                <span class="option-icon">🩺</span>                                                "displayValue": "Bis 2.000 € Heilbehandlungsschutz + 50 € Vorsorgezuschuss",                                                "displayValue": "Bis 2.000 € Heilbehandlungsschutz + 50 € Vorsorgezuschuss",

                <span>${option.title}</span>

            </div>                                                "disabled": false,                                                "disabled": false,

            ${renderParams(option.params)}

        </div>                                                "displayValueWithPrice": "Bis 2.000 € Heilbehandlungsschutz + 50 € Vorsorgezuschuss (26,26 €)"                                                "displayValueWithPrice": "Bis 2.000 € Heilbehandlungsschutz + 50 € Vorsorgezuschuss (26,26 €)"

    `).join('');

}                                            },                                            },



function renderParams(params) {                                            {                                            {

    if (!params || params.length === 0) return '';

                                                    "value": 5000,                                                "value": 5000,

    return params.map(param => {

        if (param.type === 'RADIO' && param.config) {                                                "ps20Ident": "Curative Treatment up to 5000 EUR/100 EUR",                                                "ps20Ident": "Curative Treatment up to 5000 EUR/100 EUR",

            return `

                <div class="option-params">                                                "price": 26.26,                                                "price": 26.26,

                    ${param.config.map(config => `

                        <div class="param-config ${config.disabled ? 'disabled' : ''}">                                                "inclusive": false,                                                "inclusive": false,

                            <label class="radio-option">

                                <input type="radio" name="param_${param.id}" value="${config.value}"                                                "displayValue": "Bis 5.000 € Heilbehandlungsschutz + 100 € Vorsorgezuschuss",                                                "displayValue": "Bis 5.000 € Heilbehandlungsschutz + 100 € Vorsorgezuschuss",

                                       ${config.value === param.initialValue ? 'checked' : ''}

                                       ${config.disabled ? 'disabled' : ''}>                                                "disabled": false,                                                "disabled": false,

                                <span class="radio-text">${config.displayValue}</span>

                                ${config.price > 0 ? `<span class="option-price">+${formatPrice(config.price)}</span>` : ''}                                                "displayValueWithPrice": "Bis 5.000 € Heilbehandlungsschutz + 100 € Vorsorgezuschuss (26,26 €)"                                                "displayValueWithPrice": "Bis 5.000 € Heilbehandlungsschutz + 100 € Vorsorgezuschuss (26,26 €)"

                            </label>

                        </div>                                            }                                            }

                    `).join('')}

                </div>                                        ],                                        ],

            `;

        }                                        "initialValue": 2000,                                        "initialValue": 2000,

        return '';

    }).join('');                                        "inclusiveValue": 5000                                        "inclusiveValue": 5000

}

                                    }                                    }

function attachCardEventListeners() {

    const buttons = document.querySelectorAll('.plan-button:not([disabled])');                                ]                                ]

    

    buttons.forEach(button => {                            }                            }

        button.addEventListener('click', function(e) {

            e.preventDefault();                        ]                        ]

            

            // Remove previous selections                    },                    },

            buttons.forEach(btn => {

                btn.classList.remove('selected');                    {                    {

                btn.closest('.plan-card').classList.remove('selected');

            });                        "id": "3",                        "id": "3",

            

            // Select current card                        "ident": "TM003",                        "ident": "TM003",

            this.classList.add('selected');

            this.closest('.plan-card').classList.add('selected');                        "ps20ident": "COMFORT",                        "ps20ident": "COMFORT",

            

            selectedPlan = this.dataset.plan;                        "title": "Komfort",                        "title": "Komfort",

            enableContinueButton();

        });                        "topSeller": true,                        "topSeller": true,

    });

}                        "priceAmount": 31.82,                        "priceAmount": 31.82,



function setupEventHandlers() {                        "priceUnit": "M",                        "priceUnit": "M",

    const continueBtn = document.getElementById('continueBtn');

    const deductibleSelect = document.getElementById('deductible');                        "vat": 0.19,                        "vat": 0.19,

    const paymentSelect = document.getElementById('paymentFrequency');

                            "disabled": false,                        "disabled": false,

    if (continueBtn) {

        continueBtn.disabled = true;                        "options": [                        "options": [

        continueBtn.addEventListener('click', function(e) {

            e.preventDefault();                            {                            {

            if (selectedPlan) {

                const selectedProduct = productsData.find(p => p.id === selectedPlan);                                "id": "1",                                "id": "1",

                const planData = {

                    productId: selectedPlan,                                "ident": "HB",                                "ident": "HB",

                    product: selectedProduct,

                    deductible: deductibleSelect?.value || '20',                                "ps20ident": "Curative Treatment up to",                                "ps20ident": "Curative Treatment up to",

                    paymentFrequency: paymentSelect?.value || 'monthly'

                };                                "title": "Heilbehandlungs- und Vorsorgeschutz",                                "title": "Heilbehandlungs- und Vorsorgeschutz",

                

                localStorage.setItem('selectedPlanData', JSON.stringify(planData));                                "icon": "product-health-stethoscope",                                "icon": "product-health-stethoscope",

                this.textContent = 'Weiter...';

                this.disabled = true;                                "inclusive": false,                                "inclusive": false,

                

                setTimeout(() => {                                "vat": 0.19,                                "vat": 0.19,

                    window.location.href = 'application.html';

                }, 300);                                "params": [                                "params": [

            }

        });                                    {                                    {

    }

                                            "id": "1",                                        "id": "1",

    if (deductibleSelect) {

        deductibleSelect.addEventListener('change', updatePrices);                                        "type": "RADIO",                                        "type": "RADIO",

    }

    if (paymentSelect) {                                        "title": "",                                        "title": "",

        paymentSelect.addEventListener('change', updatePrices);

    }                                        "config": [                                        "config": [

    

    // Initialize expandable sections                                            {                                            {

    initExpandableSections();

}                                                "value": 2000,                                                "value": 2000,



function enableContinueButton() {                                                "ps20Ident": "Curative Treatment up to 2000 EUR/50 EUR",                                                "ps20Ident": "Curative Treatment up to 2000 EUR/50 EUR",

    const continueBtn = document.getElementById('continueBtn');

    if (continueBtn) {                                                "price": 26.26,                                                "price": 26.26,

        continueBtn.disabled = false;

        continueBtn.style.backgroundColor = '#c80a50';                                                "inclusive": false,                                                "inclusive": false,

        continueBtn.style.cursor = 'pointer';

        continueBtn.style.opacity = '1';                                                "displayValue": "Bis 2.000 € Heilbehandlungsschutz + 50 € Vorsorgezuschuss",                                                "displayValue": "Bis 2.000 € Heilbehandlungsschutz + 50 € Vorsorgezuschuss",

    }

}                                                "disabled": false,                                                "disabled": false,



function updatePrices() {                                                "displayValueWithPrice": "Bis 2.000 € Heilbehandlungsschutz + 50 € Vorsorgezuschuss (26,26 €)"                                                "displayValueWithPrice": "Bis 2.000 € Heilbehandlungsschutz + 50 € Vorsorgezuschuss (26,26 €)"

    if (!productsData) return;

                                                },                                            },

    const deductible = document.getElementById('deductible')?.value || '20';

    const frequency = document.getElementById('paymentFrequency')?.value || 'monthly';                                            {                                            {

    

    productsData.forEach(product => {                                                "value": 5000,                                                "value": 5000,

        const card = document.querySelector(`[data-product-id="${product.id}"]`);

        if (card) {                                                "ps20Ident": "Curative Treatment up to 5000 EUR/100 EUR",                                                "ps20Ident": "Curative Treatment up to 5000 EUR/100 EUR",

            const priceElement = card.querySelector('.price');

            const periodElement = card.querySelector('.period');                                                "price": 26.26,                                                "price": 26.26,

            

            if (priceElement && periodElement) {                                                "inclusive": false,                                                "inclusive": false,

                const calculatedPrice = calculatePrice(product, deductible, frequency);

                priceElement.textContent = calculatedPrice;                                                "displayValue": "Bis 5.000 € Heilbehandlungsschutz + 100 € Vorsorgezuschuss",                                                "displayValue": "Bis 5.000 € Heilbehandlungsschutz + 100 € Vorsorgezuschuss",

                periodElement.textContent = `pro ${getPeriodText(frequency)}`;

            }                                                "disabled": false,                                                "disabled": false,

        }

    });                                                "displayValueWithPrice": "Bis 5.000 € Heilbehandlungsschutz + 100 € Vorsorgezuschuss (26,26 €)"                                                "displayValueWithPrice": "Bis 5.000 € Heilbehandlungsschutz + 100 € Vorsorgezuschuss (26,26 €)"

}

                                            }                                            }

function calculatePrice(product, deductible, frequency) {

    let basePrice = product.priceAmount;                                        ],                                        ],

    

    // Apply deductible discount                                        "initialValue": 2000,                                        "initialValue": 2000,

    if (deductible === '10') basePrice *= 0.9;

    else if (deductible === '20') basePrice *= 0.8;                                        "inclusiveValue": 5000                                        "inclusiveValue": 5000

    

    // Apply frequency multiplier                                    }                                    }

    const multipliers = {

        'monthly': 1,                                ]                                ]

        'quarterly': 3,

        'semi-annually': 6,                            }                            }

        'yearly': 12

    };                        ]                        ]

    

    const finalPrice = basePrice * (multipliers[frequency] || 1);                    }                    }

    return formatPrice(finalPrice);

}                ]                ]



function formatPrice(amount) {            }            }

    return `${amount.toFixed(2).replace('.', ',')} €`;

}        }        }



function getPeriodText(frequency) {    }    }

    const periods = {

        'monthly': 'Monat',};};

        'quarterly': 'Quartal',

        'semi-annually': 'Halbjahr',

        'yearly': 'Jahr'

    };document.addEventListener('DOMContentLoaded', function() {document.addEventListener('DOMContentLoaded', function() {

    return periods[frequency] || 'Monat';

}    // Initialize products data and render UI    // Initialize products data and render UI



function initExpandableSections() {    initializeProductsData();    initializeProductsData();

    const headers = document.querySelectorAll('.section-header');

            

    headers.forEach(header => {

        header.addEventListener('click', function() {    // Get elements    // Get elements

            const target = this.getAttribute('data-toggle');

            const content = document.getElementById(target + '-content');    const continueBtn = document.getElementById('continueBtn');    const continueBtn = document.getElementById('continueBtn');

            const icon = this.querySelector('.toggle-icon');

                const deductibleSelect = document.getElementById('deductible');    const deductibleSelect = document.getElementById('deductible');

            if (content) {

                const isExpanded = content.classList.contains('active');    const paymentFrequencySelect = document.getElementById('paymentFrequency');    const paymentFrequencySelect = document.getElementById('paymentFrequency');

                

                if (isExpanded) {        

                    content.style.maxHeight = '0px';

                    content.classList.remove('active');    // Initialize continue button (disabled state)    

                    this.classList.remove('active');

                    if (icon) icon.style.transform = 'rotate(0deg)';    if (continueBtn) {    // Initialize continue button (disabled state)

                } else {

                    content.classList.add('active');        continueBtn.disabled = true;    if (continueBtn) {

                    this.classList.add('active');

                    content.style.maxHeight = content.scrollHeight + 'px';        continueBtn.style.backgroundColor = '#ccc';        continueBtn.disabled = true;

                    if (icon) icon.style.transform = 'rotate(180deg)';

                }        continueBtn.style.cursor = 'not-allowed';        continueBtn.style.backgroundColor = '#ccc';

            }

        });        continueBtn.style.opacity = '0.6';        continueBtn.style.cursor = 'not-allowed';

    });

        }        continueBtn.style.opacity = '0.6';

    // Populate expandable content

    populateExpandableContent();        }

}

    // Continue button click handler    

function populateExpandableContent() {

    const operationContent = document.getElementById('operation-content');    if (continueBtn) {    // Continue button click handler

    if (operationContent) {

        operationContent.innerHTML = `        continueBtn.addEventListener('click', function(event) {    if (continueBtn) {

            <div class="coverage-row">

                <div class="coverage-label">            event.preventDefault();        continueBtn.addEventListener('click', function(event) {

                    <span>Physiotherapie nach einer Operation</span>

                </div>                        event.preventDefault();

                <div class="coverage-values">

                    <div class="coverage-value basis">—</div>            if (selectedPlan) {            

                    <div class="coverage-value smart">bis 500 €</div>

                    <div class="coverage-value komfort">bis 1.000 €</div>                // Get current product data            if (selectedPlan) {

                </div>

            </div>                const selectedProduct = productsData.find(p => p.id === selectedPlan);                // Get current product data

        `;

    }                const deductible = deductibleSelect ? deductibleSelect.value : '20';                const selectedProduct = productsData.find(p => p.id === selectedPlan);

}

                const frequency = paymentFrequencySelect ? paymentFrequencySelect.value : 'monthly';                const deductible = deductibleSelect ? deductibleSelect.value : '20';

// Back button functionality

window.goBack = function() {                                const frequency = paymentFrequencySelect ? paymentFrequencySelect.value : 'monthly';

    window.history.back();

};                // Prepare plan data                



// Add dynamic styles                const planData = {                // Prepare plan data

const style = document.createElement('style');

style.textContent = `                    productId: selectedPlan,                const planData = {

    .plan-card.selected {

        border: 2px solid #c80a50 !important;                    product: selectedProduct,                    productId: selectedPlan,

        box-shadow: 0 4px 20px rgba(200, 10, 80, 0.15) !important;

        transform: translateY(-2px) !important;                    deductible: deductible,                    product: selectedProduct,

    }

                        paymentFrequency: frequency,                    deductible: deductible,

    .plan-button.selected {

        background: #c80a50 !important;                    price: calculatePrice(selectedProduct, deductible, frequency)                    paymentFrequency: frequency,

        color: white !important;

    }                };                    price: calculatePrice(selectedProduct, deductible, frequency)

    

    .top-seller-badge {                                };

        position: absolute;

        top: -10px;                // Store in localStorage                

        right: 20px;

        background: #c80a50;                localStorage.setItem('selectedPlanData', JSON.stringify(planData));                // Store in localStorage

        color: white;

        padding: 4px 12px;                                localStorage.setItem('selectedPlanData', JSON.stringify(planData));

        border-radius: 12px;

        font-size: 12px;                // Show loading state                

        font-weight: bold;

        z-index: 10;                this.textContent = 'Weiter...';                // Show loading state

    }

                    this.disabled = true;                this.textContent = 'Weiter...';

    .product-options {

        margin: 15px 0;                                this.disabled = true;

        padding: 15px;

        background: #f8f9fa;                // Navigate to application page                

        border-radius: 8px;

        border: 1px solid #e9ecef;                setTimeout(() => {                // Navigate to application page

    }

                        window.location.href = 'application.html';                setTimeout(() => {

    .option-title {

        display: flex;                }, 300);                    window.location.href = 'application.html';

        align-items: center;

        margin-bottom: 10px;                                }, 300);

        font-weight: 600;

    }            } else {                

    

    .option-icon {                alert('Bitte wählen Sie zuerst einen Tarif aus.');            } else {

        margin-right: 8px;

    }            }                alert('Bitte wählen Sie zuerst einen Tarif aus.');

    

    .option-params {        });            }

        margin-left: 20px;

    }    }        });

    

    .param-config {        }

        margin: 8px 0;

    }    // Pricing update handlers    

    

    .radio-option {    if (deductibleSelect) {    // Pricing update handlers

        display: flex;

        align-items: center;        deductibleSelect.addEventListener('change', updatePricing);    if (deductibleSelect) {

        padding: 8px 12px;

        border: 1px solid #ddd;    }        deductibleSelect.addEventListener('change', updatePricing);

        border-radius: 6px;

        background: white;    if (paymentFrequencySelect) {    }

        cursor: pointer;

        transition: all 0.2s ease;        paymentFrequencySelect.addEventListener('change', updatePricing);    if (paymentFrequencySelect) {

    }

        }        paymentFrequencySelect.addEventListener('change', updatePricing);

    .radio-option:hover {

        border-color: #c80a50;        }

        background: #faf5f7;

    }    // Initialize expandable sections    

    

    .radio-option input[type="radio"] {    initializeExpandableSections();    // Initialize expandable sections

        margin-right: 10px;

    }});    initializeExpandableSections();

    

    .radio-text {});

        flex: 1;

        font-size: 14px;// Initialize products data from JSON response

    }

    function initializeProductsData() {// Initialize products data from JSON response

    .option-price {

        color: #c80a50;    try {function initializeProductsData() {

        font-weight: 600;

        margin-left: 10px;        // Extract products from the JSON response    try {

    }

            if (sampleProductResponse.success && sampleProductResponse.data.data.productResponse.products) {        // Extract products from the JSON response

    .param-config.disabled {

        opacity: 0.6;            productsData = sampleProductResponse.data.data.productResponse.products;        if (sampleProductResponse.success && sampleProductResponse.data.data.productResponse.products) {

    }

                renderProductCards();            productsData = sampleProductResponse.data.data.productResponse.products;

    .plan-card {

        position: relative;            updatePricing();            renderProductCards();

        transition: all 0.3s ease;

    }            console.log('Products data loaded successfully:', productsData);            updatePricing();

`;

document.head.appendChild(style);        } else {            console.log('Products data loaded successfully:', productsData);

            console.error('Invalid product response structure');        } else {

            fallbackToStaticData();            console.error('Invalid product response structure');

        }            fallbackToStaticData();

    } catch (error) {        }

        console.error('Error parsing product data:', error);    } catch (error) {

        fallbackToStaticData();        console.error('Error parsing product data:', error);

    }        fallbackToStaticData();

}    }

}

// Render product cards dynamically

function renderProductCards() {// Render product cards dynamically

    const planCardsContainer = document.querySelector('.plan-cards');function renderProductCards() {

    if (!planCardsContainer || !productsData) {    const planCardsContainer = document.querySelector('.plan-cards');

        console.error('Plan cards container not found or no products data');    if (!planCardsContainer || !productsData) {

        return;        console.error('Plan cards container not found or no products data');

    }        return;

        }

    // Clear existing cards    

    planCardsContainer.innerHTML = '';    // Clear existing cards

        planCardsContainer.innerHTML = '';

    // Create cards for each product    

    productsData.forEach(product => {    // Create cards for each product

        const cardHtml = createProductCardHtml(product);    productsData.forEach(product => {

        planCardsContainer.insertAdjacentHTML('beforeend', cardHtml);        const cardHtml = createProductCardHtml(product);

    });        planCardsContainer.insertAdjacentHTML('beforeend', cardHtml);

        });

    // Add event listeners to new buttons    

    attachProductCardEventListeners();    // Add event listeners to new buttons

}    attachProductCardEventListeners();

}

// Create HTML for a product card

function createProductCardHtml(product) {// Create HTML for a product card

    const isTopSeller = product.topSeller;function createProductCardHtml(product) {

    const featuredClass = isTopSeller ? 'featured' : '';    const isTopSeller = product.topSeller;

    const topSellerBadge = isTopSeller ? '<div class="top-seller-badge">Bestseller</div>' : '';    const featuredClass = isTopSeller ? 'featured' : '';

        const topSellerBadge = isTopSeller ? '<div class="top-seller-badge">Bestseller</div>' : '';

    return `    

        <div class="plan-card ${featuredClass}" data-product-id="${product.id}">    return `

            ${topSellerBadge}        <div class="plan-card ${featuredClass}" data-product-id="${product.id}">

            <div class="plan-header">            ${topSellerBadge}

                <h3 class="plan-name">${product.title}</h3>            <div class="plan-header">

                <div class="plan-price">                <h3 class="plan-name">${product.title}</h3>

                    <span class="price">${formatPrice(product.priceAmount)}</span>                <div class="plan-price">

                    <span class="period">pro ${getPeriodText(product.priceUnit)}</span>                    <span class="price">${formatPrice(product.priceAmount)}</span>

                </div>                    <span class="period">pro ${getPeriodText(product.priceUnit)}</span>

            </div>                </div>

            <div class="product-options">            </div>

                ${renderProductOptions(product.options)}            <div class="product-options">

            </div>                ${renderProductOptions(product.options)}

            <button class="plan-button ${product.disabled ? 'disabled' : ''}"             </div>

                    data-plan="${product.id}"             <button class="plan-button ${product.disabled ? 'disabled' : ''}" 

                    ${product.disabled ? 'disabled' : ''}>                    data-plan="${product.id}" 

                ${product.disabled ? 'Nicht verfügbar' : 'Auswählen'}                    ${product.disabled ? 'disabled' : ''}>

            </button>                ${product.disabled ? 'Nicht verfügbar' : 'Auswählen'}

        </div>            </button>

    `;        </div>

}    `;

}

// Render product options

function renderProductOptions(options) {// Render product options

    if (!options || options.length === 0) return '';function renderProductOptions(options) {

        if (!options || options.length === 0) return '';

    let optionsHtml = '';    

    options.forEach(option => {    let optionsHtml = '';

        optionsHtml += `    options.forEach(option => {

            <div class="product-option">        optionsHtml += `

                <div class="option-title">            <div class="product-option">

                    <span class="option-icon">${getIconHtml(option.icon)}</span>                <div class="option-title">

                    <span>${option.title}</span>                    <span class="option-icon">${getIconHtml(option.icon)}</span>

                </div>                    <span>${option.title}</span>

                ${renderOptionParams(option.params)}                </div>

            </div>                ${renderOptionParams(option.params)}

        `;            </div>

    });        `;

        });

    return optionsHtml;    

}    return optionsHtml;

}

// Render option parameters

function renderOptionParams(params) {// Render option parameters

    if (!params || params.length === 0) return '';function renderOptionParams(params) {

        if (!params || params.length === 0) return '';

    let paramsHtml = '';    

    params.forEach(param => {    let paramsHtml = '';

        if (param.type === 'RADIO' && param.config) {    params.forEach(param => {

            paramsHtml += `        if (param.type === 'RADIO' && param.config) {

                <div class="option-params">            paramsHtml += `

                    ${param.config.map(config => `                <div class="option-params">

                        <div class="param-config ${config.disabled ? 'disabled' : ''}">                    ${param.config.map(config => `

                            <label class="radio-option">                        <div class="param-config ${config.disabled ? 'disabled' : ''}">

                                <input type="radio"                             <label class="radio-option">

                                       name="param_${param.id}"                                 <input type="radio" 

                                       value="${config.value}"                                       name="param_${param.id}" 

                                       ${config.value === param.initialValue ? 'checked' : ''}                                       value="${config.value}"

                                       ${config.disabled ? 'disabled' : ''}>                                       ${config.value === param.initialValue ? 'checked' : ''}

                                <span class="radio-text">${config.displayValue}</span>                                       ${config.disabled ? 'disabled' : ''}>

                                ${config.price > 0 ? `<span class="option-price">+${formatPrice(config.price)}</span>` : ''}                                <span class="radio-text">${config.displayValue}</span>

                            </label>                                ${config.price > 0 ? `<span class="option-price">+${formatPrice(config.price)}</span>` : ''}

                        </div>                            </label>

                    `).join('')}                        </div>

                </div>                    `).join('')}

            `;                </div>

        }            `;

    });        }

        });

    return paramsHtml;    

}    return paramsHtml;

}

// Attach event listeners to product cards

function attachProductCardEventListeners() {// Attach event listeners to product cards

    const planButtons = document.querySelectorAll('.plan-button:not(.disabled)');function attachProductCardEventListeners() {

        const planButtons = document.querySelectorAll('.plan-button:not(.disabled)');

    planButtons.forEach(function(button) {    

        button.addEventListener('click', function(event) {    planButtons.forEach(function(button) {

            event.preventDefault();        button.addEventListener('click', function(event) {

                        event.preventDefault();

            // Remove selection from all buttons and cards            

            planButtons.forEach(btn => {            // Remove selection from all buttons and cards

                btn.classList.remove('selected');            planButtons.forEach(btn => {

                const card = btn.closest('.plan-card');                btn.classList.remove('selected');

                if (card) card.classList.remove('selected');                const card = btn.closest('.plan-card');

            });                if (card) card.classList.remove('selected');

                        });

            // Select this button and card            

            this.classList.add('selected');            // Select this button and card

            const selectedCard = this.closest('.plan-card');            this.classList.add('selected');

            if (selectedCard) {            const selectedCard = this.closest('.plan-card');

                selectedCard.classList.add('selected');            if (selectedCard) {

            }                selectedCard.classList.add('selected');

                        }

            // Store selected plan            

            selectedPlan = this.dataset.plan;            // Store selected plan

                        selectedPlan = this.dataset.plan;

            // Enable continue button            

            const continueBtn = document.getElementById('continueBtn');            // Enable continue button

            if (continueBtn) {            const continueBtn = document.getElementById('continueBtn');

                continueBtn.disabled = false;            if (continueBtn) {

                continueBtn.style.backgroundColor = '#c80a50';                continueBtn.disabled = false;

                continueBtn.style.cursor = 'pointer';                continueBtn.style.backgroundColor = '#c80a50';

                continueBtn.style.color = 'white';                continueBtn.style.cursor = 'pointer';

                continueBtn.style.opacity = '1';                continueBtn.style.color = 'white';

                continueBtn.textContent = 'Weiter';                continueBtn.style.opacity = '1';

            }                continueBtn.textContent = 'Weiter';

        });            }

    });        });

}    });

}

// Calculate price based on product, deductible, and frequency

function calculatePrice(product, deductible, frequency) {// Calculate price based on product, deductible, and frequency

    let basePrice = product.priceAmount;function calculatePrice(product, deductible, frequency) {

        let basePrice = product.priceAmount;

    // Apply deductible discount    

    if (deductible === '10') {    // Apply deductible discount

        basePrice *= 0.9; // 10% discount    if (deductible === '10') {

    } else if (deductible === '20') {        basePrice *= 0.9; // 10% discount

        basePrice *= 0.8; // 20% discount    } else if (deductible === '20') {

    }        basePrice *= 0.8; // 20% discount

        }

    // Apply frequency multiplier    

    const multipliers = {    // Apply frequency multiplier

        'monthly': 1,    const multipliers = {

        'quarterly': 3,        'monthly': 1,

        'semi-annually': 6,        'quarterly': 3,

        'yearly': 12        'semi-annually': 6,

    };        'yearly': 12

        };

    const finalPrice = basePrice * (multipliers[frequency] || 1);    

    return formatPrice(finalPrice);    const finalPrice = basePrice * (multipliers[frequency] || 1);

}    return formatPrice(finalPrice);

}

// Update pricing for all cards

function updatePricing() {// Update pricing for all cards

    if (!productsData) return;function updatePricing() {

        if (!productsData) return;

    const deductible = document.getElementById('deductible')?.value || '20';    

    const frequency = document.getElementById('paymentFrequency')?.value || 'monthly';    const deductible = document.getElementById('deductible')?.value || '20';

        const frequency = document.getElementById('paymentFrequency')?.value || 'monthly';

    productsData.forEach(product => {    

        const card = document.querySelector(`[data-product-id="${product.id}"]`);    productsData.forEach(product => {

        if (card) {        const card = document.querySelector(`[data-product-id="${product.id}"]`);

            const priceElement = card.querySelector('.price');        if (card) {

            const periodElement = card.querySelector('.period');            const priceElement = card.querySelector('.price');

                        const periodElement = card.querySelector('.period');

            if (priceElement && periodElement) {            

                const calculatedPrice = calculatePrice(product, deductible, frequency);            if (priceElement && periodElement) {

                priceElement.textContent = calculatedPrice;                const calculatedPrice = calculatePrice(product, deductible, frequency);

                periodElement.textContent = `pro ${getPeriodText(frequency)}`;                priceElement.textContent = calculatedPrice;

            }                periodElement.textContent = `pro ${getPeriodText(frequency)}`;

        }            }

    });        }

}    });

}

// Helper functions

function formatPrice(amount) {// Helper functions

    return `${amount.toFixed(2).replace('.', ',')} €`;function formatPrice(amount) {

}    return `${amount.toFixed(2).replace('.', ',')} €`;

}

function getPeriodText(unit) {

    const periods = {function getPeriodText(unit) {

        'M': 'Monat',    const periods = {

        'monthly': 'Monat',        'M': 'Monat',

        'quarterly': 'Quartal',        'monthly': 'Monat',

        'semi-annually': 'Halbjahr',        'quarterly': 'Quartal',

        'yearly': 'Jahr'        'semi-annually': 'Halbjahr',

    };        'yearly': 'Jahr'

    return periods[unit] || 'Monat';    };

}    return periods[unit] || 'Monat';

}

function getIconHtml(iconName) {

    // Map icon names to actual icons or Unicode symbolsfunction getIconHtml(iconName) {

    const icons = {    // Map icon names to actual icons or Unicode symbols

        'product-health-stethoscope': '🩺',    const icons = {

        'default': '📋'        'product-health-stethoscope': '🩺',

    };        'default': '📋'

    return icons[iconName] || icons['default'];    };

}    return icons[iconName] || icons['default'];

}

function fallbackToStaticData() {

    console.warn('Using fallback static data');function fallbackToStaticData() {

    // Keep original static functionality as fallback    console.warn('Using fallback static data');

}    // Keep original static functionality as fallback

}

function initializeExpandableSections() {                    window.location.href = 'application.html';

    const sectionHeaders = document.querySelectorAll('.section-header');                }, 300);

    console.log('Found', sectionHeaders.length, 'expandable section headers');                

                } else {

    // First populate content, then add event listeners                alert('Bitte wählen Sie zuerst einen Tarif aus.');

    populateExpandableContent();            }

            });

    sectionHeaders.forEach(header => {    }

        header.addEventListener('click', function() {    

            const toggleTarget = this.getAttribute('data-toggle');    // Pricing update handlers

            const content = document.getElementById(toggleTarget + '-content');    if (deductibleSelect) {

            const toggleIcon = this.querySelector('.toggle-icon');        deductibleSelect.addEventListener('change', updatePricing);

                }

            console.log('Clicked section:', toggleTarget);    if (paymentFrequencySelect) {

                    paymentFrequencySelect.addEventListener('change', updatePricing);

            if (content) {    }

                const isExpanded = content.classList.contains('active');    

                    // Initialize pricing

                if (isExpanded) {    updatePricing();

                    // Collapse    

                    content.style.maxHeight = '0px';    // Initialize expandable sections

                    content.classList.remove('active');    initializeExpandableSections();

                    this.classList.remove('active');    

                    if (toggleIcon) {    // Helper functions

                        toggleIcon.style.transform = 'rotate(0deg)';    function getCurrentPrice(plan, deductible, frequency) {

                    }        if (staticPricingData[plan] && staticPricingData[plan][deductible] && staticPricingData[plan][deductible][frequency]) {

                } else {            const price = staticPricingData[plan][deductible][frequency];

                    // Expand            return `${price.toFixed(2).replace('.', ',')} €`;

                    content.classList.add('active');        }

                    this.classList.add('active');        return '35,80 €';

                    content.style.maxHeight = content.scrollHeight + 'px';    }

                    if (toggleIcon) {    

                        toggleIcon.style.transform = 'rotate(180deg)';    function initializeExpandableSections() {

                    }        const sectionHeaders = document.querySelectorAll('.section-header');

                            console.log('Found', sectionHeaders.length, 'expandable section headers');

                    // After animation, set to auto for dynamic content        

                    setTimeout(() => {        // First populate content, then add event listeners

                        if (content.classList.contains('active')) {        populateExpandableContent();

                            content.style.maxHeight = 'auto';        

                        }        sectionHeaders.forEach(header => {

                    }, 300);            header.addEventListener('click', function() {

                }                const toggleTarget = this.getAttribute('data-toggle');

            } else {                const content = document.getElementById(toggleTarget + '-content');

                console.error('Content element not found for:', toggleTarget + '-content');                const toggleIcon = this.querySelector('.toggle-icon');

            }                

        });                console.log('Clicked section:', toggleTarget);

    });                

}                if (content) {

                    const isExpanded = content.classList.contains('active');

function populateExpandableContent() {                    

    // Add content for operation section                    if (isExpanded) {

    const operationContent = document.getElementById('operation-content');                        // Collapse

    if (operationContent) {                        content.style.maxHeight = '0px';

        operationContent.innerHTML = `                        content.classList.remove('active');

            <div class="coverage-row">                        this.classList.remove('active');

                <div class="coverage-label">                        if (toggleIcon) {

                    <span>Physiotherapie nach einer Operation</span>                            toggleIcon.style.transform = 'rotate(0deg)';

                    <span class="info-icon">ⓘ</span>                        }

                </div>                    } else {

                <div class="coverage-values">                        // Expand

                    <div class="coverage-value basis">—</div>                        content.classList.add('active');

                    <div class="coverage-value smart">bis 500 €</div>                        this.classList.add('active');

                    <div class="coverage-value komfort">bis 1.000 €</div>                        content.style.maxHeight = content.scrollHeight + 'px';

                </div>                        if (toggleIcon) {

            </div>                            toggleIcon.style.transform = 'rotate(180deg)';

            <div class="coverage-row">                        }

                <div class="coverage-label">                        

                    <span>Alternative Heilmethoden (nach OP)</span>                        // After animation, set to auto for dynamic content

                    <span class="info-icon">ⓘ</span>                        setTimeout(() => {

                </div>                            if (content.classList.contains('active')) {

                <div class="coverage-values">                                content.style.maxHeight = 'auto';

                    <div class="coverage-value basis">—</div>                            }

                    <div class="coverage-value smart">bis 250 €</div>                        }, 300);

                    <div class="coverage-value komfort">bis 500 €</div>                    }

                </div>                } else {

            </div>                    console.error('Content element not found for:', toggleTarget + '-content');

        `;                }

    }            });

            });

    // Add content for additional section    }

    const additionalContent = document.getElementById('additional-content');    

    if (additionalContent) {    function populateExpandableContent() {

        additionalContent.innerHTML = `        // Add content for operation section

            <div class="coverage-row">        const operationContent = document.getElementById('operation-content');

                <div class="coverage-label">        if (operationContent) {

                    <span>Unterbringung bei stationärer Behandlung</span>            operationContent.innerHTML = `

                    <span class="info-icon">ⓘ</span>                <div class="coverage-row">

                </div>                    <div class="coverage-label">

                <div class="coverage-values">                        <span>Physiotherapie nach einer Operation</span>

                    <div class="coverage-value basis">bis 14 Tage</div>                        <span class="info-icon">ⓘ</span>

                    <div class="coverage-value smart">bis 20 Tage</div>                    </div>

                    <div class="coverage-value komfort">bis 30 Tage</div>                    <div class="coverage-values">

                </div>                        <div class="coverage-value basis">—</div>

            </div>                        <div class="coverage-value smart">bis 500 €</div>

            <div class="coverage-row">                        <div class="coverage-value komfort">bis 1.000 €</div>

                <div class="coverage-label">                    </div>

                    <span>Freie Tierarztwahl</span>                </div>

                    <span class="info-icon">ⓘ</span>                <div class="coverage-row">

                </div>                    <div class="coverage-label">

                <div class="coverage-values">                        <span>Alternative Heilmethoden (nach OP)</span>

                    <div class="coverage-value basis">✓</div>                        <span class="info-icon">ⓘ</span>

                    <div class="coverage-value smart">✓</div>                    </div>

                    <div class="coverage-value komfort">✓</div>                    <div class="coverage-values">

                </div>                        <div class="coverage-value basis">—</div>

            </div>                        <div class="coverage-value smart">bis 250 €</div>

        `;                        <div class="coverage-value komfort">bis 500 €</div>

    }                    </div>

                    </div>

    // Add content for service section            `;

    const serviceContent = document.getElementById('service-content');        }

    if (serviceContent) {        

        serviceContent.innerHTML = `        // Add content for additional section

            <div class="coverage-row">        const additionalContent = document.getElementById('additional-content');

                <div class="coverage-label">        if (additionalContent) {

                    <span>24/7 Tierärztlicher Notdienst Hotline</span>            additionalContent.innerHTML = `

                    <span class="info-icon">ⓘ</span>                <div class="coverage-row">

                </div>                    <div class="coverage-label">

                <div class="coverage-values">                        <span>Unterbringung bei stationärer Behandlung</span>

                    <div class="coverage-value basis">—</div>                        <span class="info-icon">ⓘ</span>

                    <div class="coverage-value smart">✓</div>                    </div>

                    <div class="coverage-value komfort">✓</div>                    <div class="coverage-values">

                </div>                        <div class="coverage-value basis">bis 14 Tage</div>

            </div>                        <div class="coverage-value smart">bis 20 Tage</div>

            <div class="coverage-row">                        <div class="coverage-value komfort">bis 30 Tage</div>

                <div class="coverage-label">                    </div>

                    <span>Online Kundenbereich</span>                </div>

                    <span class="info-icon">ⓘ</span>                <div class="coverage-row">

                </div>                    <div class="coverage-label">

                <div class="coverage-values">                        <span>Freie Tierarztwahl</span>

                    <div class="coverage-value basis">✓</div>                        <span class="info-icon">ⓘ</span>

                    <div class="coverage-value smart">✓</div>                    </div>

                    <div class="coverage-value komfort">✓</div>                    <div class="coverage-values">

                </div>                        <div class="coverage-value basis">✓</div>

            </div>                        <div class="coverage-value smart">✓</div>

        `;                        <div class="coverage-value komfort">✓</div>

    }                    </div>

}                </div>

            `;

// Back button functionality        }

window.goBack = function() {        

    window.history.back();        // Add content for service section

};        const serviceContent = document.getElementById('service-content');

        if (serviceContent) {

// Professional CSS for selection states and product options            serviceContent.innerHTML = `

const style = document.createElement('style');                <div class="coverage-row">

style.textContent = `                    <div class="coverage-label">

    .plan-card.selected {                        <span>24/7 Tierärztlicher Notdienst Hotline</span>

        border: 2px solid #c80a50 !important;                        <span class="info-icon">ⓘ</span>

        box-shadow: 0 4px 20px rgba(200, 10, 80, 0.15) !important;                    </div>

        transform: translateY(-2px) !important;                    <div class="coverage-values">

        transition: all 0.3s ease !important;                        <div class="coverage-value basis">—</div>

    }                        <div class="coverage-value smart">✓</div>

                            <div class="coverage-value komfort">✓</div>

    .plan-button.selected {                    </div>

        background: #c80a50 !important;                </div>

        color: white !important;                <div class="coverage-row">

        border-color: #c80a50 !important;                    <div class="coverage-label">

        transition: all 0.3s ease !important;                        <span>Online Kundenbereich</span>

    }                        <span class="info-icon">ⓘ</span>

                        </div>

    .btn-primary:not(:disabled) {                    <div class="coverage-values">

        transition: all 0.3s ease !important;                        <div class="coverage-value basis">✓</div>

    }                        <div class="coverage-value smart">✓</div>

                            <div class="coverage-value komfort">✓</div>

    .btn-primary:not(:disabled):hover {                    </div>

        background: #c80a50 !important;                </div>

        transform: translateY(-1px) !important;            `;

    }        }

        }

    .top-seller-badge {    

        position: absolute;    function updatePricing() {

        top: -10px;        if (!deductibleSelect || !paymentFrequencySelect) return;

        right: 20px;        

        background: #c80a50;        const deductible = deductibleSelect.value;

        color: white;        const frequency = paymentFrequencySelect.value;

        padding: 4px 12px;        

        border-radius: 12px;        // Update each plan card

        font-size: 12px;        Object.keys(staticPricingData).forEach((plan, index) => {

        font-weight: bold;            const price = staticPricingData[plan][deductible][frequency];

        z-index: 10;            const priceElement = document.querySelector(`.plan-card:nth-child(${index + 1}) .price`);

    }            

                if (priceElement) {

    .product-options {                priceElement.textContent = `${price.toFixed(2).replace('.', ',')} €`;

        margin: 15px 0;            }

        padding: 15px;        });

        background: #f8f9fa;    }

        border-radius: 8px;    

        border: 1px solid #e9ecef;    // Back button functionality

    }    window.goBack = function() {

            window.history.back();

    .product-option {    };

        margin-bottom: 15px;});

    }

    // Professional CSS for selection states

    .option-title {const style = document.createElement('style');

        display: flex;style.textContent = `

        align-items: center;    .plan-card.selected {

        margin-bottom: 10px;        border: 2px solid #c80a50 !important;

        font-weight: 600;        box-shadow: 0 4px 20px rgba(200, 10, 80, 0.15) !important;

        color: #333;        transform: translateY(-2px) !important;

    }        transition: all 0.3s ease !important;

        }

    .option-icon {    

        margin-right: 8px;    .plan-button.selected {

        font-size: 16px;        background: #c80a50 !important;

    }        color: white !important;

            border-color: #c80a50 !important;

    .option-params {        transition: all 0.3s ease !important;

        margin-left: 20px;    }

    }    

        .btn-primary:not(:disabled) {

    .param-config {        transition: all 0.3s ease !important;

        margin: 8px 0;    }

    }    

        .btn-primary:not(:disabled):hover {

    .param-config.disabled {        background: #c80a50 !important;

        opacity: 0.6;        transform: translateY(-1px) !important;

    }    }

    `;

    .radio-option {document.head.appendChild(style);
        display: flex;
        align-items: center;
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 6px;
        background: white;
        cursor: pointer;
        transition: all 0.2s ease;
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
        font-size: 14px;
    }
    
    .plan-card {
        position: relative;
    }
`;
document.head.appendChild(style);