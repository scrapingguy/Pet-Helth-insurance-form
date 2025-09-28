//<div class="custom-iframe-wrapper" id="myIframe">
//  <iframe src="https://vierbeinerabsicherung.moazzammalek.com/" id="moazzammalek" loading="lazy"></iframe>
//</div>
window.iframeResizer = {
  license: "GPLv3",
  onReady: () => console.log("iframe-resizer is ready"),
}
function getDocHeight() {
  const lastElement = document.querySelector("main"); // or your form wrapper
  if (!lastElement) return document.body.scrollHeight;

  const rect = lastElement.getBoundingClientRect();
  return rect.bottom + window.scrollY; // distance from top to bottom of element
}
// function getDocHeight() {
//   const body = document.body;
//   const html = document.documentElement;

//   return Math.max(
//     body.scrollHeight, body.offsetHeight,
//     html.clientHeight, html.scrollHeight, html.offsetHeight
//   );
// }

function postIframeHeight() {
  const height = getDocHeight();
  console.log("Posting iframe height:", height);
  window.parent.postMessage({ iframeHeight: height }, "*");
}

// Run when page loads
window.addEventListener("load", postIframeHeight);

// Run again when resized or content changes
window.addEventListener("resize", postIframeHeight);

const scheduleIframeHeightUpdate = () => {
  window.requestAnimationFrame(postIframeHeight);
};
// Simple Pricing JavaScript - Clean Working Version

let selectedPlan = null;
let addonSection = null;

// Pricing data
const planPrices = {
  basis: { monthly: 8.14, quarterly: 7.74, yearly: 7.33 },
  smart: { monthly: 12.28, quarterly: 11.67, yearly: 11.05 },
  komfort: { monthly: 20.4, quarterly: 19.38, yearly: 18.36 },
};

const deductibleMultipliers = {
  no: 1.2,
  10: 1.1,
  20: 1.0,
};

// Initialize when page loads
document.addEventListener("DOMContentLoaded", function () {
  // Setup all event listeners
  setupEventListeners();

  // Initialize pricing display
  updatePrices();

  // Make sure continue button starts disabled
  disableContinueButton();

  addonSection = document.getElementById("addonSection");
  if (addonSection) {
    addonSection.hidden = true;
  }
});

function setupEventListeners() {
  // Plan selection buttons (both card buttons and table buttons)
  const selectButtons = document.querySelectorAll(
    ".select-btn, .table-select-btn"
  );

  selectButtons.forEach((btn, index) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const plan = this.getAttribute("data-plan");
      selectPlan(plan);
    });
  });

  // Price control changes
  const deductibleSelect = document.getElementById("deductible");
  const paymentSelect = document.getElementById("paymentFrequency");

  if (deductibleSelect) {
    deductibleSelect.addEventListener("change", updatePrices);
  }
  if (paymentSelect) {
    paymentSelect.addEventListener("change", updatePrices);
  }

  // Addon select button
  const addonSelectBtn = document.querySelector(".addon-select-btn");
  if (addonSelectBtn) {
    addonSelectBtn.addEventListener("click", function (e) {
      e.preventDefault();
      selectAddon();
    });
  }

  // Remove addon button
  document.addEventListener("click", function (e) {
    if (e.target.closest(".remove-addon-btn")) {
      e.preventDefault();
      removeAddon();
    }
  });

  // Addon coverage radio buttons
  const addonRadios = document.querySelectorAll('input[name="addonCoverage"]');
  addonRadios.forEach((radio) => {
    radio.addEventListener("change", updateAddonPricing);
  });

  // Continue button
  const continueBtn = document.getElementById("continueBtn");
  if (continueBtn) {
    continueBtn.addEventListener("click", function (e) {
      e.preventDefault();

      if (selectedPlan) {
        // Check if customer contact form is visible and validate it
        const contactForm = document.getElementById("customerContactForm");
        if (contactForm && contactForm.offsetParent !== null) {
          if (validateCustomerForm()) {
            storeCustomerData();
            continueToApplication();
          }
        } else {
          continueToApplication();
        }
      } else {
        alert("Bitte wählen Sie zuerst einen Tarif aus.");
      }
    });
  }
}

function selectPlan(planName) {
  // Clear previous selections
  document.querySelectorAll(".price-card").forEach((card) => {
    card.classList.remove("selected");
  });
  document.querySelectorAll(".select-btn, .table-select-btn").forEach((btn) => {
    btn.classList.remove("selected");
  });

  // Select new plan
  const planCard = document.querySelector(
    `[data-plan="${planName}"].price-card`
  );
  if (planCard) {
    planCard.classList.add("selected");
  }

  // Select the button
  const planButton = document.querySelector(
    `[data-plan="${planName}"].select-btn, [data-plan="${planName}"].table-select-btn`
  );
  if (planButton) {
    planButton.classList.add("selected");
  }

  selectedPlan = planName;
  highlightTableColumn(planName);
  showSelectedPlan();
  showAddonSection();
  enableContinueButton();
}

function highlightTableColumn(planName) {
  // Clear previous highlighting
  clearTableColumnHighlight();

  // Map plan names to column indices
  const columnMap = {
    basis: 2,
    smart: 3,
    komfort: 4,
  };

  const columnIndex = columnMap[planName];
  if (!columnIndex) return;

  // Highlight the entire column
  const columnCells = document.querySelectorAll(`
        .comparison-table th:nth-child(${columnIndex}),
        .comparison-table td:nth-child(${columnIndex})
    `);

  columnCells.forEach((cell) => {
    cell.classList.add("selected-column");
  });
}

function clearTableColumnHighlight() {
  const highlightedCells = document.querySelectorAll(".selected-column");
  highlightedCells.forEach((cell) => {
    cell.classList.remove("selected-column");
  });
}

function showSelectedPlan() {
  if (!selectedPlan) return;

  const planNames = {
    basis: "Basis",
    smart: "Smart",
    komfort: "Komfort",
  };

  const planName = planNames[selectedPlan] || selectedPlan;
  const price = getCurrentPrice(selectedPlan);
  const period = getBillingPeriod();

  const selectedPlanElement = document.getElementById("selectedPlan");
  const selectedPlanName = document.getElementById("selectedPlanName");
  const selectedPlanPrice = document.getElementById("selectedPlanPrice");

  if (selectedPlanName) selectedPlanName.textContent = planName;
  if (selectedPlanPrice) selectedPlanPrice.textContent = `€${price}${period}`;
  if (selectedPlanElement) selectedPlanElement.style.display = "block";
}

function showAddonSection() {
  if (!addonSection) return;
  if (addonSection.hidden) {
    addonSection.hidden = false;
  }
  addonSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function hideSelectedPlan() {
  const selectedPlanElement = document.getElementById("selectedPlan");
  if (selectedPlanElement) {
    selectedPlanElement.style.display = "none";
  }
}

function enableContinueButton() {
  const btn = document.getElementById("continueBtn");
  if (btn) {
    btn.disabled = false;
    btn.style.backgroundColor = "#ff8c42";
    btn.style.color = "white";
    btn.style.cursor = "pointer";
    btn.style.opacity = "1";
  }
}

function disableContinueButton() {
  const btn = document.getElementById("continueBtn");
  if (btn) {
    btn.disabled = true;
    btn.style.backgroundColor = "#ccc";
    btn.style.color = "#666";
    btn.style.cursor = "not-allowed";
    btn.style.opacity = "0.6";
  }
}

function updatePrices() {
  const deductibleSelect = document.getElementById("deductible");
  const paymentSelect = document.getElementById("paymentFrequency");

  const deductible = deductibleSelect ? deductibleSelect.value : "20";
  const billing = paymentSelect ? paymentSelect.value : "monthly";
  const multiplier = deductibleMultipliers[deductible] || 1.0;

  Object.keys(planPrices).forEach((plan) => {
    const basePrice = planPrices[plan][billing] || planPrices[plan].monthly;
    const finalPrice = (basePrice * multiplier).toFixed(2);

    // Update price display
    const amountElement = document.querySelector(
      `[data-plan="${plan}"] .amount`
    );
    if (amountElement) {
      amountElement.textContent = finalPrice;
    }
  });

  // Update period text
  const periodText = getBillingPeriodText(billing);
  document.querySelectorAll(".period").forEach((element) => {
    element.textContent = `pro ${periodText}`;
  });

  // Update selected plan if one is chosen
  if (selectedPlan) {
    showSelectedPlan();
  }
}

function getCurrentPrice(plan) {
  const deductibleSelect = document.getElementById("deductible");
  const paymentSelect = document.getElementById("paymentFrequency");

  const deductible = deductibleSelect ? deductibleSelect.value : "20";
  const billing = paymentSelect ? paymentSelect.value : "monthly";
  const multiplier = deductibleMultipliers[deductible] || 1.0;
  const basePrice = planPrices[plan][billing] || planPrices[plan].monthly;

  return (basePrice * multiplier).toFixed(2);
}

function getBillingPeriod() {
  const paymentSelect = document.getElementById("paymentFrequency");
  const billing = paymentSelect ? paymentSelect.value : "monthly";

  return billing === "monthly"
    ? "/Monat"
    : billing === "quarterly"
    ? "/Quartal"
    : billing === "yearly"
    ? "/Jahr"
    : "/Monat";
}

function getBillingPeriodText(billing) {
  return billing === "monthly"
    ? "Monat"
    : billing === "quarterly"
    ? "Quartal"
    : billing === "yearly"
    ? "Jahr"
    : "Monat";
}

// Addon management functions
function selectAddon() {
  const confirmationSection = document.getElementById("addonConfirmation");
  const addonSelectBtn = document.querySelector(".addon-select-btn");

  if (confirmationSection && addonSelectBtn) {
    // Show confirmation section
    confirmationSection.style.display = "block";

    // Update button text to indicate selection
    addonSelectBtn.textContent = "Ausgewählt ✓";
    addonSelectBtn.style.backgroundColor = "#28a745";
    addonSelectBtn.disabled = true;

    // Update the confirmation section with current data
    updateConfirmationSection();

    // Scroll to confirmation section
    confirmationSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function removeAddon() {
  const confirmationSection = document.getElementById("addonConfirmation");
  const addonSelectBtn = document.querySelector(".addon-select-btn");

  if (confirmationSection && addonSelectBtn) {
    // Hide confirmation section
    confirmationSection.style.display = "none";

    // Reset button
    addonSelectBtn.textContent = "Auswählen";
    addonSelectBtn.style.backgroundColor = "";
    addonSelectBtn.disabled = false;
  }
}

function updateAddonPricing() {
  const selectedOption = document.querySelector(
    'input[name="addonCoverage"]:checked'
  );
  if (selectedOption) {
    const addonPriceElement = document.querySelector(".addon-price-amount");
    const value = selectedOption.value;

    // Update pricing based on selection
    if (value === "2000") {
      if (addonPriceElement) addonPriceElement.textContent = "23,38 €";
    } else if (value === "5000") {
      if (addonPriceElement) addonPriceElement.textContent = "33,33 €";
    }

    // Update confirmation section if visible
    const confirmationSection = document.getElementById("addonConfirmation");
    if (confirmationSection && confirmationSection.style.display !== "none") {
      updateConfirmationSection();
    }
  }
}

function updateConfirmationSection() {
  // Get current plan details
  const planNames = {
    basis: "Basis",
    smart: "Smart",
    komfort: "Komfort",
  };

  const planName = planNames[selectedPlan] || "Komfort";
  const planPrice = getCurrentPrice(selectedPlan);

  // Get selected addon option
  const selectedAddon = document.querySelector(
    'input[name="addonCoverage"]:checked'
  );
  let addonPrice = 23.38;
  let addonText = "Bis 2.000 € Heilbehandlungsschutz + 50 € Vorsorgezuschuss";

  if (selectedAddon) {
    if (selectedAddon.value === "5000") {
      addonPrice = 33.33;
      addonText = "Bis 5.000 € Heilbehandlungsschutz + 100 € Vorsorgezuschuss";
    }
  }

  // Calculate total
  const totalPrice = parseFloat(planPrice) + addonPrice;

  // Update confirmation section elements
  const tariffTitle = document.getElementById("selectedTariffTitle");
  const tariffPrice = document.getElementById("selectedTariffPrice");
  const addonOption = document.getElementById("addonSelectedOption");
  const addonSelectedPrice = document.getElementById("addonSelectedPrice");
  const totalPriceElement = document.getElementById("totalPrice");

  if (tariffTitle) tariffTitle.textContent = `Ihr Tarif: ${planName}`;
  if (tariffPrice) tariffPrice.textContent = `${planPrice} €`;
  if (addonOption) addonOption.textContent = addonText;
  if (addonSelectedPrice)
    addonSelectedPrice.textContent = `${addonPrice.toFixed(2)} €`;
  if (totalPriceElement)
    totalPriceElement.textContent = `${totalPrice.toFixed(2)} €`;
}

// Customer form validation and data functions
function validateCustomerForm() {
  const name = document.getElementById("customerName");
  const email = document.getElementById("customerEmail");
  const phone = document.getElementById("customerPhone");
  const privacy = document.getElementById("privacyConsent");

  let isValid = true;

  // Clear previous error styles
  [name, email, phone].forEach((field) => {
    if (field) {
      field.classList.remove("error");
    }
  });

  // Validate name
  if (!name || !name.value.trim()) {
    if (name) name.classList.add("error");
    isValid = false;
  }

  // Validate email
  if (!email || !email.value.trim() || !isValidEmail(email.value)) {
    if (email) email.classList.add("error");
    isValid = false;
  }

  // Validate phone
  if (!phone || !phone.value.trim()) {
    if (phone) phone.classList.add("error");
    isValid = false;
  }

  // Validate privacy consent
  if (!privacy || !privacy.checked) {
    if (privacy) privacy.classList.add("error");
    isValid = false;
  }

  if (!isValid) {
    alert(
      "Bitte füllen Sie alle Pflichtfelder aus und stimmen Sie der Datenverarbeitung zu."
    );
  }

  return isValid;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function storeCustomerData() {
  const customerData = {
    name: document.getElementById("customerName")?.value || "",
    email: document.getElementById("customerEmail")?.value || "",
    phone: document.getElementById("customerPhone")?.value || "",
    timestamp: new Date().toISOString(),
  };

  localStorage.setItem("customerContactData", JSON.stringify(customerData));
}
function continueToApplication() {
  // Store the selected plan and addon data in localStorage
  const selectionData = {
    selectedPlan: selectedPlan,
    planPrice: getCurrentPrice(selectedPlan),
    addonSelected:
      document.getElementById("addonConfirmation")?.style.display !== "none",
    addonOption:
      document.querySelector('input[name="addonCoverage"]:checked')?.value ||
      "2000",
    timestamp: new Date().toISOString(),
  };

  // Also store selected plan data for backward compatibility
  const selectedPlanData = {
    plan: selectedPlan,
    deductible: document.getElementById("deductible")?.value || "20",
    paymentFrequency:
      document.getElementById("paymentFrequency")?.value || "monthly",
    price: getCurrentPrice(selectedPlan),
  };

  localStorage.setItem("insuranceSelection", JSON.stringify(selectionData));
  localStorage.setItem("selectedPlanData", JSON.stringify(selectedPlanData));

  // Redirect directly to success page
  window.location.href = "success.html";
}

function goBack() {
  window.location.href = "index.html";
}

// Add CSS for selected states
const style = document.createElement("style");
style.textContent = `
    .price-card.selected {
        border: 2px solid #ff8c42 !important;
        box-shadow: 0 4px 20px rgba(200, 10, 80, 0.15) !important;
        transform: translateY(-2px) !important;
    }
    
    .select-btn.selected,
    .table-select-btn.selected {
        background: #ff8c42 !important;
        color: white !important;
        border-color: #ff8c42 !important;
    }
    
    .selected-column {
        background: rgba(200, 10, 80, 0.05) !important;
        border-left: 2px solid #ff8c42 !important;
        border-right: 2px solid #ff8c42 !important;
    }
    
    .comparison-table .selected-column:first-of-type {
        border-left: 2px solid #ff8c42 !important;
    }
    
    .comparison-table .selected-column:last-of-type {
        border-right: 2px solid #ff8c42 !important;
    }
`;
document.head.appendChild(style);
