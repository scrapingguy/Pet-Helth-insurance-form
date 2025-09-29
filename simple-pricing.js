//<div class="custom-iframe-wrapper" id="myIframe">
//  <iframe src="https://vierbeinerabsicherung.moazzammalek.com/" id="moazzammalek" loading="lazy"></iframe>
//</div>
window.iframeResizer = {
  license: "GPLv3",
  onReady: () =>  {
    console.log("iframe-resizer is ready");
    if ("parentIframe" in window) {
      parentIframe.autoResize(true);
    }
  },
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
  if ("parentIframe" in window) {
    parentIframe.resize();
  }
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

const RETENTION_VALUE_MAP = {
  no: 0,
  0: 0,
  10: 10,
  20: 20,
};

const PAYMENT_SCHEDULE_MAP = {
  monthly: "M",
  quarterly: "V",
  "semi-annually": "H",
  yearly: "J",
};

const PAYMENT_PERIOD_TEXT = {
  monthly: "Monat",
  quarterly: "Quartal",
  "semi-annually": "Halbjahr",
  yearly: "Jahr",
};

const PRICING_CACHE_PREFIX = "pricingData";
const pricingCache = new Map();
let latestPricingData = null;
let activePricingRequestId = 0;

function getPricingCacheKey(retention, scheduleCode) {
  return `${retention}_${scheduleCode}`;
}

function readPricingFromStorage(key) {
  if (pricingCache.has(key)) {
    return pricingCache.get(key);
  }

  try {
    const raw = localStorage.getItem(`${PRICING_CACHE_PREFIX}:${key}`);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    pricingCache.set(key, parsed);
    return parsed;
  } catch (error) {
    console.warn("Konnte zwischengespeicherte Preisdaten nicht lesen", error);
    return null;
  }
}

function writePricingToStorage(key, data) {
  pricingCache.set(key, data);
  try {
    localStorage.setItem(`${PRICING_CACHE_PREFIX}:${key}`, JSON.stringify(data));
  } catch (error) {
    console.warn("Konnte Preisdaten nicht im localStorage speichern", error);
  }
}

function getFormPayloadFromStorage() {
  try {
    const stored = localStorage.getItem("petInsuranceFormData");
    if (!stored) {
      return null;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.warn("Konnte gespeicherte Formulardaten nicht lesen", error);
    return null;
  }
}

function getDefaultPricingPayload() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const startDay = `${tomorrow.getDate()}`.padStart(2, "0");
  const startMonth = `${tomorrow.getMonth() + 1}`.padStart(2, "0");
  const startYear = tomorrow.getFullYear();
  const formattedStartDate = `${startDay}.${startMonth}.${startYear}`;
  const sessionId =
    Math.random().toString(36).slice(2, 15) +
    Math.random().toString(36).slice(2, 15);

  return {
    id: null,
    applicationNumber: null,
    sessionId,
    hash: null,
    step: 2,
    firstPageValid: true,
    currentStep: 2,
    useragent: navigator.userAgent,
    confirmSectionsValidated: false,
    consultation: false,
    consultationAt: null,
    contractDocuments: false,
    contractDocumentsAt: null,
    downloadDocuments: false,
    downloadDocumentsAt: null,
    finished: false,
    finishedAt: null,
    agencyMail: false,
    agencyMailAt: null,
    agencyId: null,
    agencyIdChanged: false,
    agencySite: false,
    agencyDecision: "AGENCY",
    abTest: { group: null, tests: [], id: null },
    nlf: {
      valid: true,
      zip: "10115",
      city: "Berlin",
      street: "",
      animalCategory: "CAT",
      animalGender: "FEMALE",
      animalRace: "K035",
      age: null,
      birthdate: "",
      streetNumber: "",
    },
    person: [
      {
        salutation: "UNKNOWN",
        firstname: "",
        lastname: "",
        street: "",
        number: "",
        zip: "10115",
        city: "Berlin",
        age: null,
        birthdate: null,
        coverage: 65000,
        retention: 20,
        product: null,
        options: [],
        payment_schedule: "M",
        contract_term: 1,
        email: null,
        phone: null,
      },
    ],
    animal: {
      category: "CAT",
      gender: "FEMALE",
      race: "K035",
      birthDate: "01.01.2020",
      age: null,
      sterilized: true,
      catHousingType: "INDOOR",
      preExistingDiagnosis: false,
      excludedExistingDiagnosis: false,
      treatments: [],
      surgeryAmount: 0,
      name: null,
      label: null,
      labelValue: null,
      operationArea: null,
      hasPreviousDiagnosis: null,
      previousDiagnosis: [],
      consultation: {
        sumInsuredType: null,
        sumInsuredValue: null,
        grantIllness: null,
        bestCoverage: null,
        recommendedProduct: "",
      },
    },
    price: -1,
    pricePositions: [],
    trackingId: null,
    visitorId: "",
    contactByEmail: false,
    contactByEmailAt: null,
    got_insurance: null,
    previous_insurance: null,
    previous_insurance_list: [],
    got_damage: null,
    damage_count: null,
    hb_selection: null,
    start_date: formattedStartDate,
    got_agency: null,
    want_agency: null,
    bank: {
      name: null,
      owner: null,
      iban: null,
      bic: null,
      sepaMandate: false,
      sepaMandateAt: null,
    },
    consultationProtocol: null,
    mazData: {
      token: null,
      importedData: false,
    },
    prefillContext: null,
  };
}

function buildPricingRequestPayload(retention, scheduleCode) {
  const basePayload = getFormPayloadFromStorage() || getDefaultPricingPayload();
  if (!basePayload?.person?.length) {
    return null;
  }

  const cloned = JSON.parse(JSON.stringify(basePayload));
  cloned.person[0] = {
    ...cloned.person[0],
    retention,
    payment_schedule: scheduleCode,
  };

  return cloned;
}

async function requestPricingData(retention, scheduleCode) {
  const payload = buildPricingRequestPayload(retention, scheduleCode);
  if (!payload) {
    throw new Error("Keine gültigen Formulardaten für die Tarifberechnung gefunden.");
  }

  const response = await fetch("https://api-vierbeinerabsicherung.moazzammalek.com/api/allianz", {
    method: "POST",
    headers: {
      accept: "application/json, text/plain, */*",
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`API-Status ${response.status}`);
  }

  const result = await response.json();

  if (result?.errors?.length) {
    throw new Error(result.errors[0]?.message || "Unbekannter API-Fehler");
  }

  const products = result?.data?.productResponse?.products;
  if (!Array.isArray(products) || products.length === 0) {
    throw new Error("Keine Produkte im API-Ergebnis enthalten.");
  }

  return {
    retention,
    schedule: scheduleCode,
    fetchedAt: new Date().toISOString(),
    products,
  };
}

function normalizePricingProducts(products) {
  const map = {};

  if (!Array.isArray(products)) {
    return map;
  }

  products.forEach((product) => {
    const titleKey = (product?.title || product?.ident || "").toLowerCase().trim();
    if (!titleKey) {
      return;
    }

    const addonOptions = {};
    if (Array.isArray(product?.options)) {
      product.options.forEach((option) => {
        if (!Array.isArray(option?.params)) {
          return;
        }
        option.params.forEach((param) => {
          if (!Array.isArray(param?.config)) {
            return;
          }
          param.config.forEach((configEntry) => {
            const valueKey = String(configEntry?.value);
            addonOptions[valueKey] = {
              price: typeof configEntry?.price === "number" ? configEntry.price : Number(configEntry?.price),
              disabled: Boolean(configEntry?.disabled) || configEntry?.price === -1,
              displayValue: configEntry?.displayValue || "",
              displayValueWithPrice: configEntry?.displayValueWithPrice || "",
            };
          });
        });
      });
    }

    map[titleKey] = {
      basePrice:
        typeof product?.priceAmount === "number"
          ? product.priceAmount
          : Number(product?.priceAmount),
      priceUnit: product?.priceUnit || null,
      addonOptions,
      raw: product,
    };
  });

  return map;
}

function setPriceCardsLoading(isLoading) {
  const priceCards = document.querySelectorAll(".price-card");
  priceCards.forEach((card) => {
    card.classList.toggle("price-loading", isLoading);
    if (isLoading) {
      const amountElement = card.querySelector(".amount");
      if (amountElement) {
        amountElement.textContent = "";
      }
    }
  });
}

function applyPricingData(pricingData, billingValue, retention, scheduleCode) {
  const normalized = normalizePricingProducts(pricingData?.products);
  latestPricingData = {
    cacheKey: getPricingCacheKey(retention, scheduleCode),
    retention,
    schedule: scheduleCode,
    billing: billingValue,
    products: normalized,
  };

  Object.entries(normalized).forEach(([planKey, product]) => {
    const amountElement = document.querySelector(`[data-plan="${planKey}"] .amount`);
    if (amountElement) {
      amountElement.textContent = Number.isFinite(product.basePrice)
        ? formatCurrency(product.basePrice)
        : "--";
    }
  });

  const periodText = getBillingPeriodText(billingValue);
  document.querySelectorAll(".period").forEach((element) => {
    element.textContent = `pro ${periodText}`;
  });

  setPriceCardsLoading(false);

  if (selectedPlan) {
    showSelectedPlan();
  }

  updateAddonPricing();
  scheduleIframeHeightUpdate();
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", function () {
  // Setup all event listeners
  setupEventListeners();

  // Initialize pricing display
  setPriceCardsLoading(true);
  updatePrices();

  // Make sure continue button starts disabled
  disableContinueButton();

  addonSection = document.getElementById("addonSection");
  if (addonSection) {
    addonSection.hidden = true;
  }

  const interactiveFields = document.querySelectorAll(
    "main input, main select, main textarea, main button"
  );
  interactiveFields.forEach((element) => {
    element.addEventListener("input", scheduleIframeHeightUpdate);
    element.addEventListener("change", scheduleIframeHeightUpdate);
    element.addEventListener("click", scheduleIframeHeightUpdate);
  });
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
  updateAddonPricing();
  scheduleIframeHeightUpdate();
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
  if (selectedPlanPrice) {
    selectedPlanPrice.textContent = Number.isFinite(price)
      ? `€${formatCurrency(price)}${period}`
      : "--";
  }
  if (selectedPlanElement) selectedPlanElement.style.display = "block";
  scheduleIframeHeightUpdate();
}

function showAddonSection() {
  if (!addonSection) return;
  if (addonSection.hidden) {
    addonSection.hidden = false;
  }
  addonSection.scrollIntoView({ behavior: "smooth", block: "start" });
  scheduleIframeHeightUpdate();
}

function hideSelectedPlan() {
  const selectedPlanElement = document.getElementById("selectedPlan");
  if (selectedPlanElement) {
    selectedPlanElement.style.display = "none";
  }
  scheduleIframeHeightUpdate();
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
  scheduleIframeHeightUpdate();
}

async function updatePrices() {
  const deductibleSelect = document.getElementById("deductible");
  const paymentSelect = document.getElementById("paymentFrequency");

  const deductible = deductibleSelect ? deductibleSelect.value : "20";
  const billing = paymentSelect ? paymentSelect.value : "monthly";

  const retention = RETENTION_VALUE_MAP[deductible] ?? 20;
  const scheduleCode = PAYMENT_SCHEDULE_MAP[billing] ?? "M";
  const cacheKey = getPricingCacheKey(retention, scheduleCode);

  setPriceCardsLoading(true);

  const cachedPricing = readPricingFromStorage(cacheKey);
  if (cachedPricing) {
    applyPricingData(cachedPricing, billing, retention, scheduleCode);
    return;
  }

  const requestId = ++activePricingRequestId;

  try {
    const pricingData = await requestPricingData(retention, scheduleCode);
    writePricingToStorage(cacheKey, pricingData);

    if (requestId !== activePricingRequestId) {
      return;
    }

    applyPricingData(pricingData, billing, retention, scheduleCode);
  } catch (error) {
    console.error("Tarifdaten konnten nicht geladen werden", error);
    if (requestId === activePricingRequestId) {
      setPriceCardsLoading(false);
      alert(
        "Die Tarifberechnung ist momentan nicht verfügbar. Bitte versuchen Sie es in Kürze erneut."
      );
    }
  }
}

function getCurrentPrice(plan) {
  if (!latestPricingData?.products) {
    return NaN;
  }

  const product = latestPricingData.products[plan];
  if (!product || !Number.isFinite(product.basePrice)) {
    return NaN;
  }

  return product.basePrice;
}

function getBillingPeriod() {
  const paymentSelect = document.getElementById("paymentFrequency");
  const billing = paymentSelect ? paymentSelect.value : latestPricingData?.billing || "monthly";

  switch (billing) {
    case "monthly":
      return "/Monat";
    case "quarterly":
      return "/Quartal";
    case "semi-annually":
      return "/Halbjahr";
    case "yearly":
      return "/Jahr";
    default:
      return "/Monat";
  }
}

function getBillingPeriodText(billing) {
  return PAYMENT_PERIOD_TEXT[billing] || PAYMENT_PERIOD_TEXT.monthly;
}

function formatCurrency(value) {
  if (!Number.isFinite(value)) {
    return "--";
  }

  return value.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getSelectedAddonPrice() {
  const selectedOption = document.querySelector(
    'input[name="addonCoverage"]:checked'
  );
  if (!selectedOption || !latestPricingData?.products) {
    return 0;
  }

  let planKey = selectedPlan;
  if (!planKey || !latestPricingData.products[planKey]) {
    [planKey] = Object.keys(latestPricingData.products);
  }

  const product = latestPricingData.products[planKey];
  const addonData = product?.addonOptions?.[selectedOption.value];

  if (!addonData || addonData.disabled || !Number.isFinite(addonData.price)) {
    return 0;
  }

  return addonData.price;
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
    updateAddonPricing();

    // Scroll to confirmation section
    confirmationSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  scheduleIframeHeightUpdate();
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
  updateAddonPricing();
  scheduleIframeHeightUpdate();
}

function updateAddonPricing() {
  const addonPriceElement = document.querySelector(".addon-price-amount");
  const addonPricePeriod = document.querySelector(".addon-price-period");
  const billingValue = document.getElementById("paymentFrequency")?.value || latestPricingData?.billing || "monthly";

  if (addonPricePeriod) {
    addonPricePeriod.textContent = `pro ${getBillingPeriodText(billingValue)}`;
  }

  if (!latestPricingData?.products) {
    if (addonPriceElement) {
      addonPriceElement.textContent = "--";
    }
    updateConfirmationSection();
    scheduleIframeHeightUpdate();
    return;
  }

  let activePlanKey = selectedPlan;
  if (!activePlanKey || !latestPricingData.products[activePlanKey]) {
    [activePlanKey] = Object.keys(latestPricingData.products);
  }

  const product = latestPricingData.products[activePlanKey];
  if (!product) {
    if (addonPriceElement) {
      addonPriceElement.textContent = "--";
    }
    updateConfirmationSection();
    scheduleIframeHeightUpdate();
    return;
  }

  const selectedOption = document.querySelector(
    'input[name="addonCoverage"]:checked'
  );

  const addonOptions = product.addonOptions || {};
  const optionEntries = Object.entries(addonOptions).filter(
    ([, data]) => !data.disabled && Number.isFinite(data.price)
  );

  let selectedValue = selectedOption ? selectedOption.value : null;
  if (!selectedValue || !addonOptions[selectedValue] || addonOptions[selectedValue].disabled) {
    if (optionEntries.length > 0) {
      selectedValue = optionEntries[0][0];
      const fallbackInput = document.querySelector(
        `input[name="addonCoverage"][value="${selectedValue}"]`
      );
      if (fallbackInput) {
        fallbackInput.checked = true;
      }
    }
  }

  document.querySelectorAll(".addon-option").forEach((label) => {
    const input = label.querySelector('input[name="addonCoverage"]');
    const textSpan = label.querySelector("span");
    if (!input || !textSpan) {
      return;
    }

    const config = addonOptions[input.value];
    const isDisabled = !config || config.disabled || !Number.isFinite(config.price);
    input.disabled = isDisabled;
    label.classList.toggle("disabled", isDisabled);

    if (config) {
      const baseText = config.displayValue || textSpan.textContent.split("(")[0].trim();
      const priceSuffix = !isDisabled
        ? ` (${formatCurrency(config.price)} €)`
        : "";
      textSpan.textContent = `${baseText}${priceSuffix}`;
    }
  });

  const activeAddon = addonOptions[selectedValue] || null;
  const addonPrice = activeAddon && !activeAddon.disabled && Number.isFinite(activeAddon.price)
    ? activeAddon.price
    : 0;

  if (addonPriceElement) {
    addonPriceElement.textContent = Number.isFinite(addonPrice)
      ? `${formatCurrency(addonPrice)} €`
      : "--";
  }

  updateConfirmationSection();
  scheduleIframeHeightUpdate();
}

function updateConfirmationSection() {
  const planNames = {
    basis: "Basis",
    smart: "Smart",
    komfort: "Komfort",
  };

  const planKey = selectedPlan || Object.keys(latestPricingData?.products || { komfort: {} })[0] || "komfort";
  const planName = planNames[planKey] || planKey;
  const planPriceValue = getCurrentPrice(planKey);

  const addonConfirmation = document.getElementById("addonConfirmation");
  const addonIsSelected = addonConfirmation
    ? addonConfirmation.style.display !== "none"
    : false;

  const selectedAddonOption = document.querySelector(
    'input[name="addonCoverage"]:checked'
  );

  let addonPriceValue = addonIsSelected ? getSelectedAddonPrice() : 0;
  let addonText = addonIsSelected
    ? "Heilbehandlungs- und Vorsorgeschutz"
    : "Kein Zusatzbaustein ausgewählt.";

  if (addonIsSelected && latestPricingData?.products) {
    const planProduct = latestPricingData.products[planKey];
    const addonMap = planProduct?.addonOptions || {};
    if (selectedAddonOption) {
      const addonInfo = addonMap[selectedAddonOption.value];
      if (addonInfo?.displayValue) {
        addonText = addonInfo.displayValue;
      }
      if (addonInfo?.disabled || !Number.isFinite(addonInfo?.price)) {
        addonPriceValue = 0;
      }
    }
  }

  const totalPriceValue = Number.isFinite(planPriceValue)
    ? planPriceValue + addonPriceValue
    : NaN;

  const tariffTitle = document.getElementById("selectedTariffTitle");
  const tariffPrice = document.getElementById("selectedTariffPrice");
  const addonOption = document.getElementById("addonSelectedOption");
  const addonSelectedPrice = document.getElementById("addonSelectedPrice");
  const totalPriceElement = document.getElementById("totalPrice");

  if (tariffTitle) {
    tariffTitle.textContent = `Ihr Tarif: ${planName}`;
  }

  if (tariffPrice) {
    tariffPrice.textContent = Number.isFinite(planPriceValue)
      ? `${formatCurrency(planPriceValue)} €`
      : "--";
  }

  if (addonOption) {
    addonOption.textContent = addonText;
  }

  if (addonSelectedPrice) {
    addonSelectedPrice.textContent = `${formatCurrency(addonPriceValue)} €`;
  }

  if (totalPriceElement) {
    totalPriceElement.textContent = Number.isFinite(totalPriceValue)
      ? `${formatCurrency(totalPriceValue)} €`
      : "--";
  }
  scheduleIframeHeightUpdate();
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

    .price-card.price-loading .currency,
    .price-card.price-loading .amount,
    .price-card.price-loading .period {
        visibility: hidden;
    }

    .price-card.price-loading .price {
        position: relative;
        min-height: 1.6rem;
    }

    .price-card.price-loading .price::after {
        content: "Tarif wird geladen …";
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #6b7280;
        font-size: 0.9rem;
        font-weight: 600;
    }

    .addon-option.disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .addon-option.disabled input {
        pointer-events: none;
    }
`;
document.head.appendChild(style);
