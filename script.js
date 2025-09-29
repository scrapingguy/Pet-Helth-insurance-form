//<div class="custom-iframe-wrapper" id="myIframe">
//  <iframe src="https://vierbeinerabsicherung.moazzammalek.com/" id="moazzammalek" loading="lazy"></iframe>
//</div>
window.iframeResizer = {
  license: "GPLv3",
  onReady: () => {
    console.log("iframe-resizer is ready");
    if ("parentIframe" in window) {
      parentIframe.autoResize(true);
    }
  },
};
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
  // const height = getDocHeight();
  // console.log("Posting iframe height:", height);
  // window.parent.postMessage({ iframeHeight: height }, "*");
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

const APP_SCREEN_IDS = ["formScreen", "pricingScreen", "successScreen"];
let currentScreenId = "formScreen";

function showScreen(targetId) {
  currentScreenId = targetId;
  APP_SCREEN_IDS.forEach((id) => {
    const section = document.getElementById(id);
    if (!section) {
      return;
    }

    if (id === targetId) {
      section.removeAttribute("hidden");
      section.classList.add("active-screen");
    } else {
      section.setAttribute("hidden", "");
      section.classList.remove("active-screen");
    }
  });

  document.querySelector('main').scrollTo({ top: 0, behavior: "smooth" });

  if (typeof scheduleIframeHeightUpdate === "function") {
    scheduleIframeHeightUpdate();
  }

  if (targetId === "successScreen") {
    loadSelectionData();
    initializeCalendly();
  }
}

function goBackToForm() {
  showScreen("formScreen");
}

function goBackToPricing() {
  showScreen("pricingScreen");
}

window.showScreen = showScreen;
window.goBackToForm = goBackToForm;
window.goBackToPricing = goBackToPricing;

// Pet Health Insurance Form JavaScript

document.addEventListener("DOMContentLoaded", function () {
  // Form elements
  const form = document.getElementById("insuranceForm");
  const plzInput = document.getElementById("plz");
  const tierKategorieSelect = document.getElementById("tierKategorie");
  const geschlechtSelect = document.getElementById("geschlecht");
  const rasseSelect = document.getElementById("rasse");
  const gesundheitsproblemeRadios = document.querySelectorAll(
    'input[name="gesundheitsprobleme"]'
  );
  const behandlungsFrage = document.getElementById("behandlungsFrage");
  const krankheitenListe = document.getElementById("krankheitenListe");
  const submitButton = document.getElementById("berechnenButton");
  const formSteps = document.querySelectorAll(".form-step");
  const prevStepBtn = document.getElementById("prevStepBtn");
  const nextStepBtn = document.getElementById("nextStepBtn");
  const finalSubmitContainer = document.querySelector(".finalSubmitContainer");
  const stepIndicators = document.querySelectorAll("[data-step-indicator]");
  const stepLines = document.querySelectorAll("[data-step-line]");

  let currentStepIndex = 0;
  let stepThreeEnabled = false;

  function isStepThreeRequired() {
    const selected = document.querySelector(
      'input[name="gesundheitsprobleme"]:checked'
    );
    return selected && selected.value === "ja";
  }

  function updateStepsUI() {
    if (currentStepIndex === 2 && !stepThreeEnabled) {
      currentStepIndex = 1;
    }

    formSteps.forEach((step, index) => {
      const isActive =
        index === currentStepIndex && (index !== 2 || stepThreeEnabled);
      step.classList.toggle("active", isActive);
      step.setAttribute("aria-hidden", !isActive);
    });

    stepIndicators.forEach((indicator, index) => {
      const stepNumber = index + 1;
      indicator.classList.remove("completed", "active");
      if (indicator.classList.contains("hidden")) {
        return;
      }
      if (stepNumber - 1 < currentStepIndex) {
        indicator.classList.add("completed");
      } else if (stepNumber - 1 === currentStepIndex) {
        indicator.classList.add("active");
      }
    });

    stepLines.forEach((line) => {
      const lineStep = parseInt(line.dataset.stepLine, 10);
      if (Number.isNaN(lineStep)) return;
      line.classList.toggle("completed", currentStepIndex + 1 >= lineStep);
    });

    if (prevStepBtn) {
      prevStepBtn.classList.toggle("hidden", currentStepIndex === 0);
    }

    if (nextStepBtn) {
      if (
        (currentStepIndex === 2 && stepThreeEnabled) ||
        (currentStepIndex === 1 && !stepThreeEnabled)
      ) {
        nextStepBtn.classList.add("hidden");
      } else {
        nextStepBtn.classList.remove("hidden");
        nextStepBtn.textContent = "Weiter";
      }
    }

    if (finalSubmitContainer) {
      const shouldShowSubmit =
        (currentStepIndex === 2 && stepThreeEnabled) ||
        (currentStepIndex === 1 && !stepThreeEnabled);
      finalSubmitContainer.classList.toggle("visible", shouldShowSubmit);
    }

    const progressFill = document.querySelector(".progress-fill");
    if (progressFill) {
      const totalSteps = stepThreeEnabled ? 3 : 2;
      const denominator = Math.max(totalSteps - 1, 1);
      const effectiveIndex = Math.min(currentStepIndex, totalSteps - 1);
      const percent = (effectiveIndex / denominator) * 100;
      progressFill.style.width = `${Math.max(percent, 8)}%`;
    }

    scheduleIframeHeightUpdate();
  }

  function updateStepThreeAvailability() {
    stepThreeEnabled = isStepThreeRequired();
    const stepThreeIndicator = document.querySelector(
      '[data-step-indicator="3"]'
    );
    const stepThreeLine = document.querySelector('[data-step-line="3"]');
    if (stepThreeIndicator) {
      stepThreeIndicator.classList.toggle("hidden", !stepThreeEnabled);
    }
    if (stepThreeLine) {
      stepThreeLine.classList.toggle("hidden", !stepThreeEnabled);
    }
    if (!stepThreeEnabled && currentStepIndex === 2) {
      currentStepIndex = 1;
    }
    updateStepsUI();
  }

  function validateStep(stepIndex) {
    clearAllErrors();
    let valid = true;

    if (stepIndex === 0) {
      const plzField = document.getElementById("plz");
      const breedField = document.getElementById("rasse");
      const birthDateField = document.getElementById("geburtsdatum");

      if (!plzField || !plzField.value) {
        showError("plzError", "plz");
        valid = false;
      }

      if (!breedField || !breedField.value) {
        showError("rasseError", "rasse");
        valid = false;
      }

      if (!birthDateField || !birthDateField.value) {
        showError("geburtsdatumError", "geburtsdatum");
        valid = false;
      } else {
        validateBirthDateRealTime(birthDateField);
        const hasFutureError = document
          .getElementById("geburtsdatumFutureError")
          ?.classList.contains("show");
        const hasDateError = document
          .getElementById("geburtsdatumError")
          ?.classList.contains("show");
        if (hasFutureError || hasDateError) {
          valid = false;
        }
      }

      const plzInvalid =
        plzField && plzField.value && !isValidPLZ(plzField.value);
      if (plzInvalid) {
        showError("plzError", "plz");
        valid = false;
      }
    } else if (stepIndex === 1) {
      const kastriertSelected = document.querySelector(
        'input[name="kastriert"]:checked'
      );
      const haltungSelected = document.querySelector(
        'input[name="haltung"]:checked'
      );
      const gesundheitSelected = document.querySelector(
        'input[name="gesundheitsprobleme"]:checked'
      );

      if (!kastriertSelected) {
        showError("kastriertError", "kastriert");
        valid = false;
      }

      if (!haltungSelected) {
        showError("haltungError", "haltung");
        valid = false;
      }

      if (!gesundheitSelected) {
        showError("gesundheitsproblemeError", "gesundheitsprobleme");
        valid = false;
      }
    }

    return valid;
  }

  function goToNextStep() {
    if (!validateStep(currentStepIndex)) {
      return false;
    }

    if (currentStepIndex === 0) {
      currentStepIndex = 1;
      updateStepsUI();
      return true;
    }

    if (currentStepIndex === 1) {
      if (stepThreeEnabled) {
        currentStepIndex = 2;
        updateStepsUI();
      } else {
        if (typeof form.requestSubmit === "function") {
          form.requestSubmit();
        } else {
          form.submit();
        }
      }
      return true;
    }

    return false;
  }

  function goToPreviousStep() {
    if (currentStepIndex === 0) return false;
    currentStepIndex -= 1;
    updateStepsUI();
    return true;
  }

  function saveFormState() {
    const selectedBreedOption = rasseSelect?.selectedOptions?.[0];
    const formState = {
      plz: plzInput?.value || "",
      tierKategorie: tierKategorieSelect?.value || "",
      geschlecht: geschlechtSelect?.value || "",
      rasse: rasseSelect?.value || "",
      rasseLabel: selectedBreedOption?.textContent?.trim() || "",
      geburtsdatum: document.getElementById("geburtsdatum")?.value || "",
      kastriert: document.querySelector('input[name="kastriert"]:checked')?.value || "",
      haltung: document.querySelector('input[name="haltung"]:checked')?.value || "",
      gesundheitsprobleme:
        document.querySelector('input[name="gesundheitsprobleme"]:checked')?.value || "",
      timestamp: new Date().toISOString(),
    };

    try {
      localStorage.setItem("petInsuranceFormData", JSON.stringify(formState));
    } catch (error) {
      console.warn("Konnte Formulardaten nicht speichern", error);
    }
  }

  function handleFormSubmit(event) {
    event.preventDefault();

    const targetStepIndex = stepThreeEnabled ? 2 : 1;
    if (!validateStep(targetStepIndex)) {
      updateStepsUI();
      scheduleIframeHeightUpdate();
      return;
    }

    if (!validateFormWithErrors()) {
      updateStepsUI();
      scheduleIframeHeightUpdate();
      return;
    }

    saveFormState();

    const jsonData = generateFormJSON();

    try {
      localStorage.setItem("petInsuranceFormData", JSON.stringify(jsonData));
    } catch (error) {
      console.warn("Konnte Formulardaten nicht speichern", error);
    }

    if (typeof resetPricingView === "function") {
      resetPricingView();
    }

    clearPricingError();
    setPricingLoading(true);
    setPriceCardsLoading(true);

    showScreen("pricingScreen");
    scheduleIframeHeightUpdate();

    fetch("https://api-vierbeinerabsicherung.moazzammalek.com/api/allianz", {
      method: "POST",
      headers: {
        accept: "application/json, text/plain, */*",
        "content-type": "application/json",
      },
      body: JSON.stringify(jsonData),
      redirect: "follow",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Die Tarifberechnung ist momentan nicht verfügbar (Status ${response.status}).`
          );
        }
        return response.json();
      })
      .then((result) => {
        if (result?.errors && result.errors.length > 0) {
          throw new Error(result.errors[0].message || "Unbekannter API-Fehler.");
        }

        try {
          localStorage.setItem("apiResponseData", JSON.stringify(result));
        } catch (error) {
          console.warn("Konnte API-Antwort nicht speichern", error);
        }

        const retentionValue = jsonData?.person?.[0]?.retention ?? 20;
        const scheduleCode = jsonData?.person?.[0]?.payment_schedule ?? "M";
        const cacheKey = getPricingCacheKey(retentionValue, scheduleCode);
        const billingValue = document.getElementById("paymentFrequency")?.value || "monthly";
        const products = result?.data?.data?.productResponse?.products;

        if (Array.isArray(products) && products.length > 0) {
          const pricingData = {
            retention: retentionValue,
            schedule: scheduleCode,
            fetchedAt: new Date().toISOString(),
            products,
          };

          writePricingToStorage(cacheKey, pricingData);
          applyPricingData(pricingData, billingValue, retentionValue, scheduleCode);
        } else {
          throw new Error("Keine Produkte im API-Ergebnis enthalten.");
        }

        setPricingLoading(false);
        scheduleIframeHeightUpdate();
      })
      .catch((error) => {
        console.error("API-Anfrage fehlgeschlagen", error);
        setPricingLoading(false);
        setPriceCardsLoading(false);
        showApiError(
          "Die dynamische Tarifberechnung ist derzeit nicht möglich. Bitte versuchen Sie es in Kürze erneut."
        );
        scheduleIframeHeightUpdate();
      });
  }

  if (nextStepBtn) {
    nextStepBtn.addEventListener("click", (event) => {
      const handled = goToNextStep(event);
      if (handled === false) {
        scheduleIframeHeightUpdate();
      }
    });
  }

  if (prevStepBtn) {
    prevStepBtn.addEventListener("click", (event) => {
      const handled = goToPreviousStep(event);
      if (handled === false) {
        scheduleIframeHeightUpdate();
      }
    });
  }

  if (submitButton) {
    submitButton.addEventListener("click", scheduleIframeHeightUpdate);
  }

  if (form) {
    form.addEventListener("submit", handleFormSubmit);
  }

  // Treatment checkboxes
  const keinBesuchCheckbox = document.getElementById("neue_kein_besuch");
  const heilbehandlungCheckbox = document.getElementById("neue_heilbehandlung");
  const operationCheckbox = document.getElementById("neue_operation");
  const operationAnzahl = document.getElementById("operationAnzahl");

  // German date display function
  function updateGermanDateDisplay() {
    // Since we now use text input with placeholder, we don't need the overlay
    // This function is kept for compatibility but doesn't show anything
    const dateInput = document.getElementById("geburtsdatum");

    // Just validate the input format
    if (dateInput.value) {
      const germanDateRegex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
      const match = dateInput.value.match(germanDateRegex);

      if (match) {
        const [, day, month, year] = match;
        // Validate the date
        const date = new Date(year, month - 1, day);

        if (
          date.getDate() == day &&
          date.getMonth() == month - 1 &&
          date.getFullYear() == year
        ) {
          // Valid date - input field shows the value, no overlay needed
          return;
        }
      }
    }
    // No need to show anything since placeholder handles empty state
  }

  // Date input validation function for German format
  function validateDateInput(input) {
    let value = input.value;

    // Remove any characters that aren't numbers or dots
    value = value.replace(/[^0-9.]/g, "");

    // Auto-format as user types
    if (value.length === 2 && !value.includes(".")) {
      value = value + ".";
    } else if (value.length === 5 && value.split(".").length === 2) {
      value = value + ".";
    }

    // Limit to DD.MM.YYYY format (10 characters max)
    if (value.length > 10) {
      value = value.substring(0, 10);
    }

    input.value = value;

    // Check if field is required and empty
    if (input.hasAttribute("required") && !value) {
      input.setCustomValidity("Bitte geben Sie das Geburtsdatum ein.");
      return;
    }

    // Validate complete date
    if (value.length === 10) {
      const germanDateRegex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
      const match = value.match(germanDateRegex);

      if (match) {
        const [, day, month, year] = match;
        const date = new Date(year, month - 1, day);

        if (
          date.getDate() == day &&
          date.getMonth() == month - 1 &&
          date.getFullYear() == year
        ) {
          // Valid date
          input.setCustomValidity("");
        } else {
          input.setCustomValidity(
            "Bitte geben Sie ein gültiges Datum ein (TT.MM.JJJJ)."
          );
        }
      } else {
        input.setCustomValidity("Bitte verwenden Sie das Format TT.MM.JJJJ.");
      }
    } else if (value.length > 0) {
      // Partial input, don't show error yet
      input.setCustomValidity("");
    }
  }

  // Function to check form completion and update progress
  function checkFormCompletion() {
    let completedSteps = 0;

    const hasPLZAndAnimal =
      plzInput &&
      plzInput.value.length === 5 &&
      tierKategorieSelect &&
      tierKategorieSelect.value;
    if (hasPLZAndAnimal) {
      completedSteps += 1;
    }

    if (rasseSelect && rasseSelect.value) {
      completedSteps += 1;
    }

    const birthDateInput = document.getElementById("geburtsdatum");
    if (birthDateInput && birthDateInput.value.length === 10) {
      completedSteps += 1;
    }

    const neuteringRadios = document.querySelectorAll(
      'input[name="kastriert"]'
    );
    const neuteringSelected = Array.from(neuteringRadios).some(
      (radio) => radio.checked
    );
    if (neuteringSelected) {
      completedSteps += 1;
    }

    const housingRadios = document.querySelectorAll('input[name="haltung"]');
    const housingSelected = Array.from(housingRadios).some(
      (radio) => radio.checked
    );
    if (housingSelected) {
      completedSteps += 1;
    }

    if (gesundheitsproblemeRadios && gesundheitsproblemeRadios.length > 0) {
      const healthSelected = Array.from(gesundheitsproblemeRadios).some(
        (radio) => radio.checked
      );
      if (healthSelected) {
        completedSteps += 1;
      }
    }
  }

  // German postal code to city mapping (expanded dataset)
  const plzCityMap = {
    // Major cities
    "01067": "Dresden",
    10115: "Berlin",
    20095: "Hamburg",
    80331: "München",
    50667: "Köln",
    60311: "Frankfurt am Main",
    70173: "Stuttgart",
    40213: "Düsseldorf",
    30159: "Hannover",
    90403: "Nürnberg",
    "04109": "Leipzig",
    "06108": "Halle (Saale)",
    18055: "Rostock",
    24103: "Kiel",
    28195: "Bremen",
    36037: "Fulda",
    45127: "Essen",
    47051: "Duisburg",
    48143: "Münster",
    49074: "Osnabrück",
    52062: "Aachen",
    53111: "Bonn",
    55116: "Mainz",
    56068: "Koblenz",
    57072: "Siegen",
    58095: "Hagen",
    63065: "Offenbach am Main",
    64283: "Darmstadt",
    65183: "Wiesbaden",
    66111: "Saarbrücken",
    67059: "Ludwigshafen am Rhein",
    68159: "Mannheim",
    69115: "Heidelberg",
    72070: "Tübingen",
    76133: "Karlsruhe",
    79098: "Freiburg im Breisgau",
    81667: "München",
    86150: "Augsburg",
    89073: "Ulm",
    93047: "Regensburg",
    95444: "Bayreuth",
    97070: "Würzburg",
    99084: "Erfurt",
  };

  // Breed data for different animal types
  const breedData = {
    katze: [
      { value: "K035", label: "Mischling / Hauskatze / Europäisch Kurzhaar" },
      { value: "K033", label: "Maine Coon" },
      {
        value: "K044",
        label: "Perser / Colourpoint / Himalayan / Maskenperser",
      },
      { value: "K056", label: "Siam" },
      { value: "K014", label: "Britisch Kurzhaar" },
      { value: "K039", label: "Norwegische Waldkatze" },
      { value: "K011", label: "Bengal" },
      { value: "K016", label: "Burma Shorthair" },
      { value: "K001", label: "Abessinier" },
      { value: "K003", label: "American Bobtail Longhair" },
      { value: "K004", label: "American Bobtail Shorthair" },
      { value: "K005", label: "American Curl Longhair" },
      { value: "K006", label: "American Curl Shorthair" },
      { value: "K007", label: "American Lynx" },
      { value: "K008", label: "American Shorthair / Vienna Woods" },
      { value: "K009", label: "American Wirehair" },
      { value: "K010", label: "Balinese" },
      { value: "K012", label: "Birma" },
      { value: "K013", label: "Bombay" },
      { value: "K015", label: "Burma Longhair / Tiffany / Chantilly" },
      { value: "K017", label: "Burmilla" },
      { value: "K018", label: "California Spangled" },
      { value: "K019", label: "Ceylon" },
      { value: "K020", label: "Chartreux / Kartäuser" },
      { value: "K021", label: "Chausie" },
      { value: "K022", label: "Cymric" },
      { value: "K023", label: "Exotische Kurzhaarkatze" },
      { value: "K024", label: "Havanna" },
      { value: "K025", label: "Japanese Bobtail Longhair" },
      { value: "K026", label: "Japanese Bobtail Shorthair" },
      { value: "K027", label: "Kanaani" },
      { value: "K028", label: "Korat" },
      { value: "K029", label: "Kurilean Bobtail Longhair" },
      { value: "K030", label: "Kurilean Bobtail Shorthair" },
      { value: "K031", label: "La Perm Longhair" },
      { value: "K032", label: "La Perm Shorthair" },
      { value: "K034", label: "Manx" },
      { value: "K036", label: "Munchkin Longhair" },
      { value: "K037", label: "Munchkin Shorthair" },
      { value: "K038", label: "Nebelung" },
      { value: "K040", label: "Ocicat" },
      { value: "K041", label: "Ojos Azules" },
      { value: "K042", label: "Oriental Longhair / Javanese / Mandarin" },
      { value: "K043", label: "Oriental Shorthair" },
      { value: "K045", label: "Peterbald" },
      { value: "K046", label: "Pixiebob Longhair" },
      { value: "K047", label: "Pixiebob Shorthair" },
      { value: "K048", label: "Rex" },
      { value: "K049", label: "RagaMuffin" },
      { value: "K050", label: "Ragdoll" },
      { value: "K051", label: "Russisch Blau" },
      { value: "K052", label: "Safari" },
      { value: "K053", label: "Savannah" },
      { value: "K054", label: "Scottish Fold Longhair" },
      { value: "K055", label: "Scottish Fold Shorthair" },
      { value: "K057", label: "Sibirische Katze / Neva Masquarade" },
      { value: "K058", label: "Singapura" },
      { value: "K059", label: "Snowshoe" },
      { value: "K060", label: "Sokoke" },
      { value: "K061", label: "Somali" },
      { value: "K062", label: "Sphynx" },
      { value: "K063", label: "Thai" },
      { value: "K064", label: "Tonkanese" },
      { value: "K065", label: "Toyger" },
      { value: "K066", label: "Türkisch Angora" },
      { value: "K067", label: "Türkisch Van" },
      { value: "K068", label: "York Chocolate" },
      { value: "K069", label: "Serengeti" },
      { value: "K070", label: "Bunny cat" },
      { value: "K071", label: "Hasenkatze" },
      { value: "K072", label: "Mau, Ägyptische" },
      { value: "K074", label: "Mau, Egyptian" },
      { value: "K075", label: "Stummelschwanzkatze Langhaar, Amerikanische" },
      { value: "K076", label: "Stummelschwanzkatze Kurzhaar, Amerikanische" },
      { value: "K077", label: "Luchskatze, Amerikanische " },
      { value: "K078", label: "American Shorthair in chocolate-silver" },
      { value: "K079", label: "Balinesenkatze" },
      { value: "K080", label: "Leopardette" },
      { value: "K081", label: "Heilige Birm" },
      { value: "K082", label: "Birman" },
      { value: "K083", label: "Sacred Birman" },
      { value: "K084", label: "British Shorthair" },
      { value: "K085", label: "Ceylonkatze" },
      { value: "K086", label: "Ceylon cat" },
      { value: "K087", label: "Chartreuse" },
      { value: "K088", label: "Karthäuser" },
      { value: "K089", label: "Manx, Longhaired" },
      { value: "K090", label: "Manxkatze, Langhaarige" },
      { value: "K091", label: "Kymrische Katze" },
      { value: "K092", label: "Exotic Shorthair" },
      { value: "K093", label: "Exotic" },
      { value: "K094", label: "Havanna Brown" },
      { value: "K095", label: "Boby" },
      { value: "K096", label: "Stummelschwanzkatze, Japanische" },
      { value: "K097", label: "Chrysanthemenkatze, Langhaar" },
      { value: "K098", label: "Chrysanthemenkatze, Kurzhaar" },
      { value: "K099", label: "Kanaan-Katze" },
      { value: "K100", label: "Si-Sawat" },
      { value: "K101", label: "Maeo Dok-Lao" },
      { value: "K102", label: "Kurilian Bobtail" },
      { value: "K103", label: "Stummelschwanzkatze, Karelische " },
      { value: "K104", label: "Karelisch Bobtail, Langhaar" },
      { value: "K105", label: "Nibelung" },
      { value: "K106", label: "Norweger" },
      { value: "K107", label: "Norwegian Forest Cat" },
      { value: "K108", label: "Skogkatt" },
      { value: "K109", label: "Nors Skaukatt" },
      { value: "K110", label: "Ocikatze" },
      { value: "K111", label: "Orientalisch Langhaar" },
      { value: "K112", label: "Javanese/Mandarin" },
      { value: "K113", label: "Orientalisch Kurzhaar" },
      { value: "K114", label: "OKH, Foreign Shorthair" },
      { value: "K115", label: "Rex, Bohemian" },
      { value: "K116", label: "Rex, California" },
      { value: "K117", label: "Rex, Cornish" },
      { value: "K118", label: "Rex, Devon" },
      { value: "K119", label: "Rex, German" },
      { value: "K120", label: "Rex, Oregon" },
      { value: "K121", label: "Rex, Selkirk" },
      { value: "K122", label: "Rex, Ural" },
      { value: "K123", label: "Russische Katze" },
      { value: "K124", label: "Russian Blue" },
      { value: "K125", label: "Bleu Russe" },
      { value: "K126", label: "Archangelsk-Katze" },
      { value: "K127", label: "Malterkatze" },
      { value: "K128", label: "Spanische Katze" },
      { value: "K129", label: "Highland Fold" },
      { value: "K130", label: "Coupari" },
      { value: "K131", label: "Hängeohrenkatze Langhaar, Schottische" },
      { value: "K132", label: "Faltohrkatze Langhaar, Schottische" },
      { value: "K133", label: "Hängeohrenkatze Kurzhaar, Schottische" },
      { value: "K134", label: "Faltohrkatze Kurzhaar, Schottische" },
      { value: "K135", label: "Siamese" },
      { value: "K136", label: "Waldkatze, Sibirische " },
      { value: "K137", label: "Sibirian Cat" },
      { value: "K138", label: "Sibirska Koschka" },
      { value: "K139", label: "Sibirski" },
      { value: "K140", label: "Neva Masquerade" },
      { value: "K141", label: "Drain Cat" },
      { value: "K142", label: "Schneeschuhkatze" },
      { value: "K143", label: "Canadian Hairless" },
      { value: "K144", label: "Mexican Hairless" },
      { value: "K145", label: "Moon Cat" },
      { value: "K146", label: "Nacktkatze" },
      { value: "K147", label: "Siam alter Typ" },
      { value: "K148", label: "Tonkinese" },
      { value: "K149", label: "Siamese, Goldener " },
      { value: "K150", label: "Angorakatze" },
      { value: "K151", label: "Ankarakatze" },
      { value: "K152", label: "Ankara kedisi" },
      { value: "K153", label: "Vankatze" },
      { value: "K154", label: "Schwimmkatze" },
      { value: "K155", label: "Türkische Katze" },
      { value: "K156", label: "Turkish" },
      { value: "K157", label: "Van Kedesi" },
      { value: "K158", label: "Türkisch Vankedisi" },
      { value: "K159", label: "Karelisch Bobtail, Kurzhaar" },
      { value: "K160", label: "Deutsch Langhaar" },
    ],
    hund: [
      { value: "H132", label: "Mischling, groß (Widerristhöhe ab 45 cm)" },
      { value: "H133", label: "Mischling, klein (Widerristhöhe bis 45 cm)" },
      { value: "H668", label: "Labrador" },
      { value: "H171", label: "Retriever, Golden" },
      { value: "H255", label: "Terrier, Jack Russell" },
      { value: "H184", label: "Schäferhund, Deutscher" },
      { value: "H056", label: "Dackel" },
      { value: "H380", label: "Bulldogge, Französische (Bouledogue Francais)" },
      { value: "H045", label: "Chihuahua" },
      { value: "H052", label: "Collie, Border" },
      { value: "H903", label: "Afghan Hound" },
      { value: "H902", label: "Afghane" },
      { value: "H001", label: "Aidi" },
      { value: "H301", label: "Aiidi" },
      { value: "H513", label: "Ainu-Hund" },
      { value: "H514", label: "Ainu-Inu" },
      { value: "H510", label: "Akbas" },
      { value: "H002", label: "Akita" },
      { value: "H304", label: "Akita Ken" },
      { value: "H305", label: "Akita, Japanischer" },
      { value: "H303", label: "Akita-Inu" },
      { value: "H306", label: "Akitu, Amerikanischer" },
      { value: "H290", label: "Alano" },
      { value: "H003", label: "Alaskan Malamute" },
      { value: "H921", label: "Alauntbull" },
      { value: "H939", label: "Amerikanischer Königs-Schäferhund" },
      { value: "H932", label: "Andalousian Mouse-Hounting Dog" },
      { value: "H476", label: "Anglo-Franzose, Großer" },
      { value: "H308", label: "Anglo-Franzose, Kleiner" },
      { value: "H477", label: "Anglo-französischer Laufhund, Großer" },
      { value: "H307", label: "Anglo-französischer Laufhund, mittelgroßer" },
      { value: "H004", label: "Anglo-français de petite vénerie" },
      { value: "H569", label: "Apso Seng Kyi" },
      { value: "H881", label: "Apso, Dholi" },
      { value: "H880", label: "Apso, Doki-" },
      { value: "H879", label: "Apso, Tibet-" },
      { value: "H005", label: "Ariégeois" },
      { value: "H402", label: "Artois Hound" },
      { value: "H766", label: "Aussie" },
      { value: "H302", label: "Ayidi" },
      { value: "H006", label: "Azawakh" },
      { value: "H300", label: "Aïdi" },
      { value: "H595", label: "Barac" },
      { value: "H541", label: "Barb" },
      { value: "H007", label: "Barbet" },
      { value: "H008", label: "Bardino" },
      { value: "H313", label: "Bardino auténtico" },
      { value: "H314", label: "Bardino Majorero" },
      { value: "H010", label: "Barsoi" },
      { value: "H323", label: "Barzoï" },
      { value: "H339", label: "Bas Rouge" },
      { value: "H325", label: "Basendschi" },
      { value: "H011", label: "Basenji" },
      { value: "H012", label: "Basset" },
      { value: "H327", label: "Basset Artesien Normand (Basset Artois)" },
      {
        value: "H328",
        label: "Basset Bleu de Gascogne (Basset der Gascogne, Blauer)",
      },
      { value: "H329", label: "Basset d'Artois" },
      { value: "H330", label: "Basset Fauve de Bretagne" },
      { value: "H013", label: "Basset Griffon" },
      {
        value: "H333",
        label: "Basset Griffon Vendéen, Grand (B.G.V., Großer)",
      },
      {
        value: "H332",
        label: "Basset Griffon Vendéen, Petit  (B.G.V., Kleiner)",
      },
      { value: "H331", label: "Basset Hound" },
      { value: "H752", label: "Bauernhund, Schweizer" },
      { value: "H014", label: "Beagle" },
      { value: "H015", label: "Beagle Harrier" },
      { value: "H334", label: "Beagle, English" },
      { value: "H419", label: "Beardie" },
      { value: "H338", label: "Beauceron" },
      { value: "H337", label: "Bergamasco" },
      { value: "H016", label: "Bergamasker" },
      { value: "H696", label: "Berger belge" },
      { value: "H727", label: "Berger Blanc Suisse" },
      { value: "H017", label: "Berger de Beauce" },
      { value: "H018", label: "Berger de Brie (Briard)" },
      { value: "H297", label: "Berger de l'Atlas" },
      { value: "H019", label: "Berger de Picardie" },
      {
        value: "H349",
        label:
          "Berger de Pyrènèes á face rase (Pyrenäen-Schäferhund mit kurzhaarigem Gesicht)",
      },
      { value: "H020", label: "Berger des Pyrénées" },
      {
        value: "H350",
        label:
          "Berger des Pyrénées á poil long (Langhaariger Pyrenäen-Schäferhund, Pyrenäenschäferhund, Langhaariger, Schäferhund, Langhaariger Pyrenäen-)",
      },
      { value: "H342", label: "Berger Picard" },
      { value: "H299", label: "Berghund, Atlas" },
      { value: "H721", label: "Berghund, Polnischer" },
      { value: "H386", label: "Berghund, Serra da Estrela" },
      { value: "H720", label: "Berghund, Tatra-" },
      { value: "H021", label: "Bernhardiner" },
      { value: "H361", label: "Bichon Bolognais" },
      { value: "H352", label: "Bichon frisé" },
      { value: "H501", label: "Bichon havanais" },
      { value: "H580", label: "Bichon Maltais" },
      { value: "H022", label: "Bichon à poil frisé" },
      { value: "H353", label: "Bichon, Gelockter" },
      { value: "H023", label: "Billy" },
      { value: "H355", label: "Bloodhound" },
      { value: "H397", label: "Blue Heeler" },
      { value: "H024", label: "Bluthund" },
      { value: "H025", label: "Bobtail (Old English Sheepdog)" },
      { value: "H933", label: "Bodeguero Andaluz" },
      { value: "H295", label: "Boerboel" },
      { value: "H360", label: "Bolognese" },
      { value: "H026", label: "Bologneser" },
      { value: "H027", label: "Bolonka Zwetna" },
      { value: "H922", label: "Bolonka, Franzuska" },
      { value: "H923", label: "Bolonka, Franzuskaya" },
      { value: "H443", label: "Boolomo" },
      {
        value: "H446",
        label: "Bordeauxdogge (Dogge, Bordeaux-, Dogge de Bordeaux)",
      },
      { value: "H320", label: "Borsoi" },
      { value: "H826", label: "Boston Bull(dog)" },
      { value: "H028", label: "Bouvier des Ardennes" },
      { value: "H029", label: "Bouvier des Flandres" },
      { value: "H030", label: "Boxer, Deutscher" },
      { value: "H490", label: "Brabancon" },
      { value: "H491", label: "Brabancon, Petit" },
      {
        value: "H375",
        label:
          "Bracke, Alpenländische Dachs- (Bracke, Alpine Dachs-, Bracke, Alpenländische-Erzgebirgische Dachs-, Bracke, Österreichische Dachs-)",
      },
      { value: "H369", label: "Bracke, Ariège- (Braque de l'Ariège)" },
      { value: "H366", label: "Bracke, Balkan-" },
      { value: "H747", label: "Bracke, Bayerische Gebirgs-" },
      { value: "H367", label: "Bracke, Brandl- (Vieräugl)" },
      { value: "H370", label: "Bracke, Burbonnaiser (Braque du Bourbonnais)" },
      { value: "H456", label: "Bracke, Dunker-" },
      {
        value: "H372",
        label:
          "Bracke, Französische (Braque francais (type Gascogne/type Pyrénées)",
      },
      { value: "H373", label: "Bracke, Französische Klein-" },
      { value: "H560", label: "Bracke, Griechische" },
      { value: "H494", label: "Bracke, Halden" },
      { value: "H496", label: "Bracke, Hamilton-" },
      { value: "H520", label: "Bracke, Hygen-" },
      { value: "H368", label: "Bracke, Italienische (Bracco Italiano)" },
      {
        value: "H918",
        label:
          "Bracke, Polnische (Ogar Polski, Polish Hound, Brachet polonais, Sabueso polaco)",
      },
      { value: "H374", label: "Bracke, Saint-Germain- (Braque Saint-German)" },
      { value: "H741", label: "Bracke, Schiller-" },
      { value: "H411", label: "Bracke, Sizilianische" },
      { value: "H779", label: "Bracke, Smaland-" },
      { value: "H376", label: "Bracke, Westfälische Dachs-" },
      { value: "H031", label: "Bracken" },
      { value: "H032", label: "Bracken, Dachs-" },
      { value: "H371", label: "Braque d'Auvergne" },
      { value: "H341", label: "Briard" },
      { value: "H401", label: "Briquet" },
      { value: "H033", label: "Broholmer" },
      { value: "H377", label: "Broholmer, Dänischer" },
      { value: "H034", label: "Buhund" },
      { value: "H378", label: "Buhund, Norsk" },
      { value: "H829", label: "Bull Terrier, English" },
      { value: "H381", label: "Bulldog, American" },
      { value: "H920", label: "Bulldog, Continental" },
      { value: "H382", label: "Bulldog, Old Country" },
      { value: "H035", label: "Bulldogge" },
      {
        value: "H379",
        label:
          "Bulldogge, Englische (Bulldog, English, Bully, Bulldogge, kleine englische)",
      },
      { value: "H592", label: "Bulldogge, Italienische" },
      { value: "H864", label: "Bullterrier, American Pit-" },
      { value: "H862", label: "Bullterrier, Amerikanischer Pit-" },
      { value: "H831", label: "Bullterrier, Miniatur-" },
      { value: "H833", label: "Bullterrier, Zwerg" },
      { value: "H009", label: "Bärenhund" },
      { value: "H319", label: "Bärenhund, Germanischer" },
      {
        value: "H318",
        label:
          "Bärenhund, Karelischer (Karjalankarhukoira, Bear Dog, Karelian, Bear Laika, Karelian, Björnhund)",
      },
      { value: "H710", label: "Ca de Bestiar" },
      { value: "H924", label: "Ca de Bou" },
      { value: "H663", label: "Ca Rater Mallorquin" },
      { value: "H535", label: "Canaan Dog" },
      { value: "H036", label: "Cane Corso" },
      { value: "H716", label: "Cane da Pastore" },
      { value: "H336", label: "Cane da pastore Bergamasco" },
      { value: "H717", label: "Cane da Pastore Maremmano Abruzzese" },
      { value: "H751", label: "Cane di seguito" },
      { value: "H384", label: "Cane die Macellaio" },
      {
        value: "H470",
        label: "Cao de Fila, Dogge, Brasilianische, Mastiff, Brasilianischer",
      },
      { value: "H600", label: "Carlin" },
      { value: "H601", label: "Carlino" },
      { value: "H042", label: "Carpatin, Ciobanesc Romanesc" },
      { value: "H388", label: "Castro Laboreiro Hund" },
      { value: "H043", label: "Cattle Dog, Australian" },
      { value: "H906", label: "Chart Polski" },
      { value: "H684", label: "Chien couranr espagnol" },
      { value: "H497", label: "Chien courant Hamilton" },
      { value: "H522", label: "Chien courant Hygen" },
      { value: "H562", label: "Chien Courant Suisse" },
      { value: "H044", label: "Chien d'Artois" },
      { value: "H340", label: "Chien de Beauce" },
      { value: "H695", label: "Chien de Berger Belge" },
      { value: "H713", label: "Chien de berger de Majorque" },
      { value: "H658", label: "Chien de Franche-Comté" },
      { value: "H296", label: "Chien de l'Atlas" },
      { value: "H660", label: "Chien de montagne des Pyrénées" },
      { value: "H357", label: "Chien de Saint-Hubert" },
      { value: "H531", label: "Chin" },
      { value: "H929", label: "Chodenhund" },
      { value: "H928", label: "Chodsky pes" },
      { value: "H046", label: "Chortaj" },
      { value: "H403", label: "Chortaja Borzaja" },
      { value: "H047", label: "Chow-Chow" },
      { value: "H769", label: "Chrysanthemenhund" },
      { value: "H408", label: "Cimarron, Uruguayischer" },
      { value: "H048", label: "Cimarrón Uruguayo" },
      { value: "H049", label: "Cirneco dell'Etna" },
      { value: "H502", label: "Coban Köpegi" },
      { value: "H785", label: "Cockerspaniel" },
      { value: "H780", label: "Cockerspaniel, Amerikanischer" },
      { value: "H784", label: "Cockerspaniel, Englischer" },
      { value: "H050", label: "Collie" },
      { value: "H051", label: "Collie, Bearded" },
      { value: "H418", label: "Collie, Hairy Mou ed" },
      { value: "H416", label: "Collie, Highland" },
      { value: "H415", label: "Collie, Kurzhaar (Collie Smooth)" },
      { value: "H414", label: "Collie, Langhaar (Collie Rough)" },
      { value: "H417", label: "Collie, Mountain" },
      { value: "H326", label: "Congo Dog" },
      { value: "H053", label: "Coonhound, Black and Tan" },
      { value: "H054", label: "Corgi, Welsh" },
      { value: "H423", label: "Corgi, Welsh (Cardigan)" },
      { value: "H424", label: "Corgi, Welsh (Pembroke)" },
      { value: "H383", label: "Corso Hund, Italienischer" },
      { value: "H055", label: "Coton de Tuléar" },
      { value: "H666", label: "Curly, Retriever, kraus gelockter" },
      { value: "H776", label: "Cuvac" },
      { value: "H037", label: "Cão da Serra da Estrela" },
      { value: "H038", label: "Cão da Serra de Aires" },
      { value: "H041", label: "Cão de Agua português" },
      { value: "H039", label: "Cão de Castro Laboreiro" },
      { value: "H040", label: "Cão Fila de São Miguel" },
      { value: "H455", label: "Dachsbracke, Schwedische" },
      { value: "H426", label: "Dachshund" },
      { value: "H431", label: "Dackel, Kaninchen-" },
      { value: "H427", label: "Dackel, Kurzhaar-" },
      { value: "H429", label: "Dackel, Langhaar-" },
      { value: "H428", label: "Dackel, Rauhhaar-" },
      { value: "H430", label: "Dackel, Zwerg-" },
      { value: "H432", label: "Dalmatinac" },
      { value: "H057", label: "Dalmatiner" },
      { value: "H058", label: "Deerhound" },
      { value: "H434", label: "Deerhound, Scottish" },
      { value: "H059", label: "Deutsch Drahthaar" },
      { value: "H060", label: "Deutsch Kurzhaar" },
      { value: "H061", label: "Deutsch Langhaar" },
      { value: "H062", label: "Deutsch Stichelhaar" },
      { value: "H063", label: "Dingo" },
      { value: "H438", label: "Dingo, Australischer" },
      { value: "H288", label: "Do Khyi" },
      { value: "H064", label: "Dobermann" },
      { value: "H643", label: "Dobermann, Mini-" },
      { value: "H065", label: "Dogge" },
      { value: "H447", label: "Dogge, Argentinische" },
      {
        value: "H445",
        label:
          "Dogge, Deutsche (Dogge, Dänische, Dogge, Ulmer, Dogge, Englische, Hatzrüde, Saupacker, Dogge, Große)",
      },
      { value: "H582", label: "Dogge, Englische" },
      { value: "H591", label: "Dogge, Italienische" },
      { value: "H449", label: "Dogge, Kanarische" },
      { value: "H587", label: "Dogge, Spanische" },
      { value: "H451", label: "Dogge, Tibet" },
      { value: "H066", label: "Dogo Argentino" },
      { value: "H289", label: "Dogo Canario" },
      { value: "H602", label: "Doguillo" },
      { value: "H067", label: "Drentse Patrijshond" },
      { value: "H068", label: "Drever" },
      { value: "H069", label: "Dunker" },
      { value: "H070", label: "Elchhund" },
      { value: "H459", label: "Elchhund, Norwegischer (Norsk Elghund)" },
      { value: "H460", label: "Elchhund, Schwedischer (Jämthund)" },
      { value: "H071", label: "Elo" },
      { value: "H461", label: "Elo, Groß-" },
      { value: "H462", label: "Elo, Klein-" },
      { value: "H544", label: "Entenlockhund, Holländischer" },
      { value: "H072", label: "Epagneul Breton" },
      { value: "H073", label: "Epagneul de Pont-Audemer" },
      { value: "H074", label: "Epagneul français" },
      { value: "H793", label: "Epagneul nain continental" },
      { value: "H075", label: "Epagneul Picard" },
      { value: "H076", label: "Eurasier" },
      { value: "H761", label: "Faltenhund, Chinesischer" },
      { value: "H077", label: "Fila Brasileiro" },
      { value: "H828", label: "Fox Paulistinha" },
      { value: "H078", label: "Foxhound, American" },
      { value: "H471", label: "Foxhound, Amerikanischer" },
      { value: "H472", label: "Foxhound, Englischer" },
      { value: "H079", label: "Foxhound, English" },
      { value: "H848", label: "Foxterrier Smooth" },
      { value: "H844", label: "Foxterrier Wire" },
      { value: "H845", label: "Foxterrier, Kurzhaar" },
      { value: "H841", label: "Foxterrier, Rauhaar" },
      {
        value: "H558",
        label:
          "Francais blanc et noir (Laufhund, Französischer Weiss-Schwarzer-)",
      },
      {
        value: "H559",
        label:
          "Francais blanc et orange (Laufhund, Französischer Weiss-Oranger-)",
      },
      {
        value: "H557",
        label: "Francais tricolore (Laufhund, Französischer Dreifarbiger)",
      },
      { value: "H530", label: "Friaar-Hund" },
      { value: "H473", label: "Fuchshund, Englischer" },
      { value: "H080", label: "Galgo Español" },
      { value: "H517", label: "Gammel Dansk Honsehund" },
      { value: "H478", label: "Gascogne Laufhund, Großer Blauer" },
      { value: "H479", label: "Gascogner, Großer Blauer" },
      { value: "H630", label: "Gascogner, Kleiner blauer" },
      { value: "H480", label: "Gascon Saintongeois, Großer" },
      { value: "H634", label: "Gascon Saintongeois, Kleiner" },
      { value: "H632", label: "Gascony Hound, Small Blue" },
      { value: "H686", label: "Gazellenhund" },
      { value: "H746", label: "Gebirgsbracke, Bayerische" },
      { value: "H936", label: "German Trail Hound" },
      { value: "H940", label: "Goldendoodle" },
      { value: "H726", label: "Goralenhund" },
      { value: "H707", label: "Gos d'Atura Català" },
      { value: "H081", label: "Grand anglo-français" },
      { value: "H082", label: "Grand bleu de Gascogne" },
      { value: "H083", label: "Grand Gascon Saintongeois" },
      { value: "H084", label: "Greyhound" },
      { value: "H908", label: "Greyhound, Polish" },
      { value: "H475", label: "Greyhound, Spanish" },
      { value: "H085", label: "Griffon" },
      { value: "H488", label: "Griffon Belge" },
      {
        value: "H482",
        label: "Griffon bleu de Gascogne (Gascogne Griffon, Blauer)",
      },
      { value: "H492", label: "Griffon Bruxellois" },
      { value: "H483", label: "Griffon Fauve de Bretagne" },
      {
        value: "H484",
        label:
          "Griffon Korthals (Vorstehhund, Französischer Rauhhaariger, Griffon d'arrét á poil dur, Korthals, Griffon á poil dur)",
      },
      {
        value: "H485",
        label: "Griffon Nivernais (Grand Griffon Nivernais, Chien de Pays)",
      },
      {
        value: "H487",
        label:
          "Griffon Vendéen (Griffon Vendéen, Grand, Griffon Vendéen, Großer, Griffon Vendéen, Briquet)",
      },
      {
        value: "H486",
        label:
          "Griffon á poil Laineux (Griffon Boulet, Griffon, Französischer Wollhaariger, Griffon, French Wolly-haired Pointing, Grifón de muestra de pelo lanoso Francés)",
      },
      { value: "H086", label: "Griffon, Belgischer" },
      { value: "H087", label: "Griffon, Brabanter" },
      { value: "H088", label: "Griffon, Brüsseler" },
      { value: "H489", label: "Griffon, Kleiner belgischer" },
      { value: "H697", label: "Groenendael" },
      { value: "H089", label: "Grönlandhund" },
      { value: "H493", label: "Grönlandshund" },
      { value: "H090", label: "Haldenstövare" },
      { value: "H398", label: "Hall's Heeler" },
      { value: "H498", label: "Hamilton Hound" },
      { value: "H091", label: "Hamiltonstövare" },
      { value: "H748", label: "Hannoveraner" },
      { value: "H092", label: "Harrier" },
      { value: "H093", label: "Harzer Fuchs" },
      { value: "H655", label: "Haut Poitou" },
      { value: "H094", label: "Havaneser" },
      { value: "H396", label: "Heeler, (Australischer)" },
      { value: "H606", label: "Heidewachtel" },
      { value: "H561", label: "Hellinikos Ichnilatis" },
      { value: "H702", label: "Herder" },
      { value: "H701", label: "Herdershond, Hollandse" },
      { value: "H703", label: "Herdershond, Nederlandse" },
      { value: "H433", label: "Hirschhund, Schottischer" },
      { value: "H095", label: "Hirtenhund, Anatolischer" },
      { value: "H335", label: "Hirtenhund, Bergamasker" },
      { value: "H689", label: "Hirtenhund, Jugoslawischer" },
      { value: "H505", label: "Hirtenhund, Kangal-" },
      { value: "H706", label: "Hirtenhund, Katalanischer" },
      { value: "H942", label: "Hirtenhund, kaukasisch" },
      { value: "H715", label: "Hirtenhund, Maremmaner" },
      { value: "H719", label: "Hirtenhund, Tatra-" },
      { value: "H503", label: "Hirtenhund, Türkischer" },
      { value: "H550", label: "Hirtenhund, Ungarischer" },
      { value: "H096", label: "Hokkaido" },
      { value: "H515", label: "Hokkaido-Ken" },
      { value: "H405", label: "Hort" },
      { value: "H404", label: "Hortaya Borzaya" },
      { value: "H406", label: "Horty" },
      { value: "H097", label: "Hovawart" },
      { value: "H709", label: "Hrvatski Ovcar" },
      { value: "H356", label: "Hubertus-Hund, (Sankt-)" },
      { value: "H099", label: "Husky" },
      { value: "H519", label: "Husky, Alaskan" },
      { value: "H518", label: "Husky, Siberian" },
      { value: "H523", label: "Hygen Hound" },
      { value: "H100", label: "Hygenhund" },
      { value: "H098", label: "Hühnerhund, Altdänischer" },
      { value: "H627", label: "Hühnerhund, Burgos-" },
      { value: "H454", label: "Hühnerhund, Drent`scher" },
      { value: "H500", label: "Hütehund, Altdeutscher" },
      { value: "H348", label: "Hütehund, Pyrenäen-" },
      { value: "H735", label: "Ioujnorousskaia Ovtcharka" },
      { value: "H101", label: "Islandhund" },
      { value: "H529", label: "Islandsk Farehond" },
      { value: "H527", label: "Islanskur Fjarhundur" },
      { value: "H528", label: "Islenski Fjarhundutinn" },
      { value: "H887", label: "Jagdterrier, Westdeutscher" },
      { value: "H322", label: "Jagdwindhund, Russischer" },
      { value: "H102", label: "Japan Chin" },
      { value: "H547", label: "Jindo" },
      { value: "H548", label: "Jindo-Kae" },
      { value: "H549", label: "Jindo-kyon" },
      { value: "H694", label: "Jugoslovenski Ovcarski Pas-Sarplaninac" },
      { value: "H103", label: "Kai" },
      { value: "H532", label: "Kai Inu" },
      { value: "H534", label: "Kai tora-ken" },
      { value: "H762", label: "Kampfhund, Chinesischer" },
      { value: "H890", label: "Kampfhund, Japanischer" },
      { value: "H892", label: "Kampfhund, Tosa-" },
      { value: "H104", label: "Kanaan Hund" },
      { value: "H504", label: "Kangal" },
      { value: "H507", label: "Kangal Cobas Köbegi" },
      { value: "H508", label: "Karabas" },
      { value: "H509", label: "Karabash" },
      { value: "H511", label: "Kars-Hund" },
      { value: "H732", label: "Kavkazskaia Ovtcharka" },
      { value: "H636", label: "Kelb-tal Fenek (Kaninchenhund)" },
      { value: "H537", label: "Kelef K'naani" },
      { value: "H540", label: "Kelpie" },
      { value: "H105", label: "Kelpie, Australian" },
      { value: "H538", label: "Kelpie, Australischer" },
      { value: "H539", label: "Kelpie, Working" },
      { value: "H816", label: "Kirghiz Borzoi" },
      { value: "H106", label: "Kishu" },
      { value: "H543", label: "Kishu Ken" },
      { value: "H542", label: "Kishu-Inu" },
      { value: "H771", label: "Kochi-Hund" },
      { value: "H770", label: "Kochi-Ken" },
      { value: "H365", label: "Koehond, Vlaamse" },
      { value: "H545", label: "Koikerhund" },
      { value: "H107", label: "Komondor" },
      { value: "H108", label: "Kooikerhondje" },
      { value: "H109", label: "Korea Jindo Dog" },
      { value: "H705", label: "Kraski ovcar" },
      { value: "H110", label: "Kromfohrländer" },
      { value: "H111", label: "Kuvasz" },
      { value: "H291", label: "Labradoodle" },
      { value: "H700", label: "Laekenois" },
      { value: "H112", label: "Lagotto Romagnolo" },
      { value: "H113", label: "Laika" },
      { value: "H114", label: "Landseer" },
      { value: "H552", label: "Landseer, Europäisch-kontinentaler" },
      { value: "H553", label: "Landseer-Neufundländer" },
      { value: "H798", label: "Lao Khyi" },
      { value: "H115", label: "Lapphund" },
      {
        value: "H554",
        label: "Lapphund, Finnischer  (Suomenlapinkoira, Lapinkoira)",
      },
      {
        value: "H555",
        label: "Lapphund, Schwedischer  (Lappenspitz, Spitz, Lappen-)",
      },
      {
        value: "H556",
        label:
          "Lapplandhirtenhund, Finnischer  (Rentierhund, Lappländischer, Lapinporoika)",
      },
      { value: "H309", label: "Laufhund, Ariege" },
      { value: "H565", label: "Laufhund, Berner" },
      { value: "H458", label: "Laufhund, Dunker-" },
      { value: "H116", label: "Laufhund, Französischer" },
      { value: "H117", label: "Laufhund, Griechischer" },
      { value: "H495", label: "Laufhund, Hamilton-" },
      { value: "H521", label: "Laufhund, Hygen-" },
      { value: "H749", label: "Laufhund, Italienischer" },
      { value: "H566", label: "Laufhund, Jura" },
      { value: "H631", label: "Laufhund, Kleiner blauer Gascogne" },
      { value: "H652", label: "Laufhund, Kleiner Portugiesischer" },
      { value: "H567", label: "Laufhund, Luzerner" },
      { value: "H457", label: "Laufhund, Norwegischer" },
      { value: "H740", label: "Laufhund, Schiller-" },
      { value: "H568", label: "Laufhund, Schwyzer" },
      { value: "H778", label: "Laufhund, Smaland-" },
      { value: "H682", label: "Laufhund, Spanischer" },
      { value: "H118", label: "Laufhunde, Schweizerische" },
      { value: "H909", label: "Lebrel Polaco" },
      { value: "H119", label: "Leonberger" },
      { value: "H120", label: "Lhasa Apso" },
      { value: "H570", label: "Lhasaterrier" },
      { value: "H670", label: "Little River Duck Dog" },
      { value: "H901", label: "Lockenhaar, Friesisches" },
      { value: "H122", label: "Lundehund, Norwegischer" },
      { value: "H123", label: "Lurcher" },
      { value: "H907", label: "Lévrier polonaise" },
      { value: "H121", label: "Löwchen" },
      { value: "H623", label: "Löwenhund" },
      { value: "H671", label: "Löwenhund, Afrikanischer" },
      { value: "H910", label: "Magyar Agar" },
      { value: "H124", label: "Magyar Vizsla" },
      { value: "H674", label: "Mah Tai" },
      { value: "H714", label: "Majorca Sheperd Dog" },
      { value: "H439", label: "Maliki" },
      { value: "H699", label: "Malinois" },
      { value: "H927", label: "Mallorca-Dogge" },
      { value: "H579", label: "Maltese" },
      { value: "H125", label: "Malteser" },
      { value: "H839", label: "Manchester Terrier, Toy" },
      { value: "H126", label: "Mastiff" },
      { value: "H581", label: "Mastiff, (Old) English" },
      { value: "H662", label: "Mastiff, Alentejo-" },
      { value: "H127", label: "Mastiff, Bull-" },
      { value: "H891", label: "Mastiff, Japanischer" },
      { value: "H584", label: "Mastiff, Pyrenäen-" },
      { value: "H586", label: "Mastiff, Spanischer" },
      { value: "H452", label: "Mastiff, Tibet" },
      { value: "H453", label: "Mastiff, Tibetanischer" },
      { value: "H588", label: "Mastin aus León (mastin leonés)" },
      { value: "H128", label: "Mastin de los Pirineos" },
      { value: "H583", label: "Mastin del Pirineo" },
      { value: "H589", label: "Mastin der Extramadura (mastin extremeno)" },
      { value: "H590", label: "Mastin der Mancha (mastin manchego)" },
      { value: "H129", label: "Mastin Español" },
      { value: "H130", label: "Mastino Napoletano" },
      { value: "H941", label: "Merlsheimer" },
      { value: "H676", label: "Metzgerhund, Rottweiler" },
      { value: "H772", label: "Mikawa-Inu" },
      { value: "H642", label: "Minpin" },
      { value: "H593", label: "Mioritic" },
      { value: "H131", label: "Mioritic, Ciobanesc Romanesc" },
      { value: "H596", label: "Miortic, Romanian" },
      { value: "H442", label: "Mirigung" },
      { value: "H594", label: "Mocano" },
      { value: "H134", label: "Mops" },
      { value: "H894", label: "Moscow Watchdog" },
      { value: "H895", label: "Moskowskaia Storozewaia" },
      { value: "H896", label: "Moszkvai Örkutya" },
      { value: "H135", label: "Mudi" },
      { value: "H136", label: "Münsterländer, Großer" },
      { value: "H137", label: "Münsterländer, Kleiner" },
      { value: "H138", label: "Nackt-/Schopfhund" },
      { value: "H607", label: "Nackthund, Afrikanischer" },
      {
        value: "H608",
        label:
          "Nackthund, Chinesischer (Schopfhund, Chinesischer, Chinese crested dog)",
      },
      {
        value: "H609",
        label:
          "Nackthund, Mexikanischer (Mexican hairless, Xoloitzcuintli, Tepeizeuntli)",
      },
      {
        value: "H610",
        label:
          "Nackthund, Peruanischer (Perro sin pelo del peru, Nackthund, Inka-)",
      },
      { value: "H139", label: "Neufundländer" },
      { value: "H611", label: "Newfoundland" },
      { value: "H613", label: "Niederlaufhund, Berner (Glatthaar/Rauhhaar)" },
      { value: "H614", label: "Niederlaufhund, Jura" },
      { value: "H615", label: "Niederlaufhund, Luzerner" },
      { value: "H616", label: "Niederlaufhund, Schwyzer" },
      { value: "H140", label: "Niederlaufhunde, Schweizerische" },
      { value: "H656", label: "Niederungshütehund, Polnischer" },
      { value: "H854", label: "Nihon Teria" },
      { value: "H441", label: "Noggum" },
      { value: "H788", label: "Norfolk Spaniel" },
      { value: "H575", label: "Norsk Lundehund" },
      { value: "H877", label: "Nurse Maid" },
      { value: "H141", label: "Otterhound" },
      { value: "H617", label: "Otterhund" },
      { value: "H725", label: "Owczarek Podhalanski" },
      { value: "H731", label: "Owtscharka, Kaukasischer" },
      { value: "H733", label: "Owtscharka, Mittelasiatischer" },
      { value: "H734", label: "Owtscharka, Südrussischer" },
      { value: "H736", label: "Owtscharka, Zentralasiatischer" },
      { value: "H624", label: "Palasthund, Chinesischer" },
      { value: "H622", label: "Palasthund, Peking-" },
      { value: "H794", label: "Papillon" },
      { value: "H693", label: "Pas-Sarplaninac" },
      { value: "H916", label: "Patterdale Terrier" },
      { value: "H621", label: "Pekinese" },
      { value: "H142", label: "Pekingese" },
      { value: "H574", label: "Pequeno León" },
      { value: "H633", label: "Pequeno Sabuesoazul de Gascuna" },
      {
        value: "H625",
        label: "Perdiguero (Hühnerhund/Vorstehhund) von Burgos",
      },
      { value: "H626", label: "Perdiguero Burgales" },
      { value: "H143", label: "Perdiguero de Burgos" },
      { value: "H409", label: "Perro Criollo" },
      { value: "H144", label: "Perro de agua Español" },
      { value: "H316", label: "Perro de Ganado Majorero" },
      { value: "H315", label: "Perro de Majorero" },
      { value: "H708", label: "Perro de Pastor Catalán" },
      { value: "H711", label: "Perro de pastor Mallorquin" },
      { value: "H450", label: "Perro de Presa Canario" },
      { value: "H926", label: "Perro de Presa Mallorquin" },
      { value: "H925", label: "Perro dogo mallorquin" },
      { value: "H410", label: "Perro Gaucho" },
      { value: "H934", label: "Perro Ratonero Bodeguero" },
      { value: "H145", label: "Petit bleu de Gascogne" },
      { value: "H612", label: "Petit chien courant suisse" },
      { value: "H573", label: "Petit Chien lion" },
      { value: "H146", label: "Petit Gascon Saintongeois" },
      { value: "H795", label: "Phalene" },
      { value: "H635", label: "Pharaoh Hound" },
      { value: "H147", label: "Pharaonenhund" },
      { value: "H912", label: "Piccolo Levriero Italiano" },
      { value: "H148", label: "Pinscher" },
      { value: "H149", label: "Pinscher, Affen-" },
      { value: "H638", label: "Pinscher, Deutscher" },
      { value: "H444", label: "Pinscher, Dobermann-" },
      { value: "H641", label: "Pinscher, Miniature" },
      { value: "H639", label: "Pinscher, Mittelschlag-" },
      { value: "H640", label: "Pinscher, Reh-" },
      { value: "H150", label: "Pinscher, Zwerg-" },
      { value: "H863", label: "Pit-Bullterrier, American" },
      { value: "H860", label: "Pit-Bullterrier, Amerikanischer" },
      { value: "H151", label: "Podenco" },
      {
        value: "H645",
        label:
          "Podenco Canario (Podenco, Kanarischer, Windhund, Kanarischer, Canarian Warren Hound)",
      },
      {
        value: "H646",
        label:
          "Podenco Ibicenco (Podenco, Ibiza-, Ibizian Hound, Mallorquin, Xarnelo, Mayorquais, Charnegue, Charnegui, Balearen-Hund)",
      },
      { value: "H152", label: "Podengo" },
      { value: "H647", label: "Podengo Portugues (grande/medio)" },
      { value: "H650", label: "Podengo Portugueso Pequeno" },
      { value: "H153", label: "Podengo, Kleiner" },
      { value: "H649", label: "Podengo, Kleiner Portugiesischer" },
      {
        value: "H648",
        label: "Podengo, Portugiesischer (großer/mittelgroßer)",
      },
      { value: "H723", label: "Podhalaner" },
      { value: "H722", label: "Podhalenhund" },
      { value: "H154", label: "Pointer" },
      { value: "H653", label: "Pointer, Englischer" },
      { value: "H654", label: "Pointer, English" },
      { value: "H155", label: "Poitevin" },
      { value: "H657", label: "Polski Owczarek Nizinny" },
      { value: "H724", label: "Polski Owczarek Podhalanski" },
      { value: "H156", label: "PON (Polnischer Niederungshütehund)" },
      { value: "H157", label: "Porcelaine" },
      { value: "H651", label: "Portugiesischer Laufhund, Kleiner" },
      { value: "H292", label: "Prager Rattler" },
      { value: "H158", label: "Pudel, Groß-" },
      { value: "H159", label: "Pudel, Klein-" },
      { value: "H659", label: "Pudel, Königs-" },
      { value: "H160", label: "Pudel, Toy" },
      { value: "H161", label: "Pudel, Zwerg-" },
      { value: "H162", label: "Pudelpointer" },
      { value: "H599", label: "Pug" },
      { value: "H293", label: "Puggle" },
      { value: "H675", label: "Puh Quoc Hund" },
      { value: "H163", label: "Puli" },
      { value: "H164", label: "Pumi" },
      { value: "H165", label: "Pyrenäenberghund" },
      { value: "H585", label: "Pyrenäenhund" },
      { value: "H347", label: "Pyrenäenhütehund" },
      { value: "H345", label: "Pyrenäenschäferhund" },
      { value: "H399", label: "Queensland-Heeler" },
      { value: "H166", label: "Rafeiro do Alentejo" },
      { value: "H661", label: "Rafeiro von Alentejo" },
      { value: "H294", label: "Ratero" },
      { value: "H931", label: "Ratonero Andaluz" },
      { value: "H930", label: "Ratonero Bodeguero Andaluz" },
      { value: "H167", label: "Rauhbart" },
      {
        value: "H665",
        label:
          "Rauhbart, Böhmischer (Cesky fousek, Vorstehhund, Tschechischer)",
      },
      {
        value: "H664",
        label:
          "Rauhbart, Slowakischer (Slowensky hrubosrsty stavac, Ohar, Vorstehhund, Slowakischer, Vorstehhund, Slowakischer Drahthaariger)",
      },
      { value: "H644", label: "Rehrattler" },
      { value: "H168", label: "Retriever, Chesapeake Bay" },
      { value: "H169", label: "Retriever, Curly Coated" },
      { value: "H170", label: "Retriever, Flat Coated" },
      { value: "H667", label: "Retriever, Glatthaariger" },
      { value: "H172", label: "Retriever, Labrador" },
      { value: "H669", label: "Retriever, Nova Scotia" },
      { value: "H173", label: "Retriever, Nova Scotia Duck Tolling" },
      { value: "H672", label: "Ridgeback Dog, Thai" },
      { value: "H174", label: "Ridgeback, Rhodesian" },
      { value: "H175", label: "Ridgeback, Thai" },
      { value: "H673", label: "Ridgeback, Thailand-" },
      { value: "H176", label: "Rottweiler" },
      { value: "H324", label: "Russkaya Psovaya borzaya" },
      { value: "H177", label: "Russkiy Toy" },
      { value: "H499", label: "Sabueso de Hamilton" },
      { value: "H524", label: "Sabueso de Hygen" },
      { value: "H178", label: "Sabueso Español" },
      { value: "H564", label: "Sabueso Suizos" },
      { value: "H179", label: "Saluki" },
      { value: "H687", label: "Samoiedskaia Sabaka" },
      { value: "H180", label: "Samojede" },
      { value: "H688", label: "Samojedskaja" },
      { value: "H181", label: "Sarplaninac" },
      { value: "H935", label: "Scandinavian Hound" },
      { value: "H739", label: "Schafpudel, Niederländischer" },
      { value: "H197", label: "Schapendoes" },
      { value: "H738", label: "Schapendoes, Nederlandse" },
      { value: "H737", label: "Schapendoes, Niederländischer" },
      { value: "H742", label: "Schifferspitz, Belgischer" },
      { value: "H198", label: "Schillerstövare" },
      { value: "H199", label: "Schipperke" },
      { value: "H937", label: "Schlittenhund, Europäischer" },
      { value: "H796", label: "Schmetterlingshündchen" },
      { value: "H200", label: "Schnauzer" },
      { value: "H744", label: "Schnauzer, Mittel-" },
      { value: "H745", label: "Schnauzer, Riesen-" },
      { value: "H201", label: "Schnauzer, Zwerg-" },
      {
        value: "H919",
        label:
          "Schwarzwildbracke, Slowakische (Slovensky Kopov, Slowakischer Laufhund)",
      },
      { value: "H202", label: "Schweisshund, Bayerischer Gebirgs-" },
      { value: "H203", label: "Schweisshund, Hannoverscher" },
      { value: "H729", label: "Schäfer, Weißer" },
      { value: "H182", label: "Schäferhund, Altdeutscher" },
      { value: "H359", label: "Schäferhund, Altenglischer" },
      { value: "H730", label: "Schäferhund, Amerikanisch Canadisch Weißer" },
      { value: "H512", label: "Schäferhund, Anatolischer" },
      { value: "H765", label: "Schäferhund, Australischer" },
      { value: "H183", label: "Schäferhund, Belgischer" },
      {
        value: "H888",
        label: "Schäferhund, Bosnisch-Herzegowinischer und kroatischer",
      },
      { value: "H391", label: "Schäferhund, Carpatin" },
      { value: "H185", label: "Schäferhund, Holländischer" },
      { value: "H692", label: "Schäferhund, Illyrischer" },
      { value: "H526", label: "Schäferhund, Isländischer" },
      { value: "H691", label: "Schäferhund, Istrischer" },
      { value: "H690", label: "Schäferhund, Jugoslawischer" },
      { value: "H186", label: "Schäferhund, Karst" },
      { value: "H187", label: "Schäferhund, Katalanisch" },
      { value: "H193", label: "Schäferhund, Kaukasischer" },
      { value: "H188", label: "Schäferhund, Kroatischer" },
      { value: "H189", label: "Schäferhund, Mallorca" },
      { value: "H712", label: "Schäferhund, Mallorquinischer" },
      { value: "H190", label: "Schäferhund, Maremmen-Abruzzen-" },
      { value: "H298", label: "Schäferhund, Marokkanischer" },
      { value: "H194", label: "Schäferhund, Mittelasiatischer" },
      { value: "H704", label: "Schäferhund, Niederländischer" },
      { value: "H343", label: "Schäferhund, Picardie" },
      { value: "H344", label: "Schäferhund, Picardischer" },
      { value: "H387", label: "Schäferhund, Portugiesischer" },
      { value: "H346", label: "Schäferhund, Pyrenäen-" },
      { value: "H394", label: "Schäferhund, Rumänischer" },
      { value: "H413", label: "Schäferhund, Schottischer" },
      { value: "H764", label: "Schäferhund, Shetland" },
      { value: "H195", label: "Schäferhund, Südrussischer" },
      { value: "H191", label: "Schäferhund, Tatra" },
      { value: "H603", label: "Schäferhund, Ungarischer" },
      { value: "H192", label: "Schäferhund, Weisser Schweizer" },
      { value: "H728", label: "Schäferhund, Weißer" },
      { value: "H196", label: "Schäferhund, Zentralasiatischer" },
      { value: "H872", label: "Scottie" },
      { value: "H204", label: "Segugio Italiano a pelo forte" },
      { value: "H750", label: "Seguiser" },
      { value: "H205", label: "Sennenhund" },
      {
        value: "H753",
        label: "Sennenhund, Appenzeller  (Appenzellerhund, Appezöller Bläss)",
      },
      { value: "H754", label: "Sennenhund, Berner (Dürrbächler)" },
      { value: "H755", label: "Sennenhund, Entlebucher" },
      {
        value: "H756",
        label:
          "Sennenhund, Großer Schweizer (Great Swiss Mountain Dog, Grand bouvier suisse)",
      },
      { value: "H385", label: "Serra da Estrela Berghund" },
      { value: "H206", label: "Setter" },
      {
        value: "H757",
        label:
          "Setter, English (Setter, Englischer, Setter, Laverack, Setter, Llewellin)",
      },
      { value: "H758", label: "Setter, Gordon" },
      {
        value: "H760",
        label:
          "Setter, Irish Red (Setter, Irischer Roter, Setter, Irish, Setter, Red)",
      },
      {
        value: "H759",
        label:
          "Setter, Irish Red and White (Setter, Irischer Rot-Weißer, Setter, Parti-coloured)",
      },
      { value: "H207", label: "Shar Pei" },
      { value: "H393", label: "Sheepdog, Carpathian" },
      { value: "H597", label: "Sheepdog, Mioritic" },
      { value: "H358", label: "Sheepdog, Old English" },
      { value: "H208", label: "Sheepdog, Shetland" },
      { value: "H763", label: "Sheltie" },
      { value: "H938", label: "Sheperd, American King" },
      { value: "H209", label: "Shepherd Dog, Romanian Carpathian" },
      { value: "H210", label: "Shepherd Dog, Romanian Mioritic" },
      { value: "H211", label: "Shepherd, Australian" },
      { value: "H212", label: "Shiba" },
      { value: "H767", label: "Shiba Inu" },
      { value: "H768", label: "Shiba Ken" },
      { value: "H213", label: "Shih Tzu" },
      { value: "H214", label: "Shikoku" },
      { value: "H824", label: "Silky, Australian" },
      { value: "H823", label: "Silky, Sydney" },
      { value: "H506", label: "Sivas Kangal" },
      { value: "H215", label: "Sloughi" },
      { value: "H216", label: "Slovensky Cuvac" },
      { value: "H774", label: "Slughi" },
      { value: "H217", label: "Smalandsstövare" },
      { value: "H222", label: "Spaniel, (English) Cocker" },
      { value: "H218", label: "Spaniel, American Cocker" },
      { value: "H219", label: "Spaniel, American Water" },
      { value: "H781", label: "Spaniel, Amerikanischer Cocker-" },
      { value: "H783", label: "Spaniel, Amerikanischer Wasser-" },
      { value: "H464", label: "Spaniel, Bretonen-" },
      { value: "H463", label: "Spaniel, Bretonischer" },
      { value: "H465", label: "Spaniel, Brittany-" },
      { value: "H220", label: "Spaniel, Cavalier King Charles" },
      { value: "H221", label: "Spaniel, Clumber" },
      { value: "H787", label: "Spaniel, Englischer Springer-" },
      { value: "H223", label: "Spaniel, English Springer" },
      { value: "H791", label: "Spaniel, English Toy" },
      { value: "H224", label: "Spaniel, Field" },
      { value: "H467", label: "Spaniel, Französischer" },
      { value: "H790", label: "Spaniel, Irischer Wasser-" },
      { value: "H225", label: "Spaniel, Irish Water" },
      { value: "H226", label: "Spaniel, King Charles" },
      { value: "H227", label: "Spaniel, Kontinentaler Zwerg-" },
      { value: "H468", label: "Spaniel, Picardie-" },
      { value: "H466", label: "Spaniel, Pont-Audemer" },
      { value: "H228", label: "Spaniel, Sussex" },
      { value: "H229", label: "Spaniel, Tibet" },
      { value: "H797", label: "Spaniel, Tibetan" },
      { value: "H800", label: "Spaniel, Walisischer Springer" },
      { value: "H230", label: "Spaniel, Welsh Springer" },
      { value: "H683", label: "Spanischer Schmecker" },
      { value: "H801", label: "Spinone" },
      { value: "H231", label: "Spinone Italiano" },
      { value: "H232", label: "Spitz" },
      { value: "H743", label: "Spitz, Belgischer Schiffer-" },
      { value: "H809", label: "Spitz, Finnen-" },
      { value: "H804", label: "Spitz, Groß-" },
      { value: "H525", label: "Spitz, Isländischer" },
      { value: "H536", label: "Spitz, Israel" },
      { value: "H808", label: "Spitz, Japan" },
      { value: "H806", label: "Spitz, Klein-" },
      { value: "H805", label: "Spitz, Mittel-" },
      { value: "H807", label: "Spitz, Zwerg- (Pomeranian)" },
      {
        value: "H803",
        label: "Spitze, Deutsche: Spitz, Wolfs (Keeshond, Chien Loup)",
      },
      { value: "H799", label: "Springer Spaniel, Walisischer" },
      { value: "H786", label: "Springer-Spaniel, Englischer" },
      { value: "H351", label: "St. Bernhardshund" },
      { value: "H810", label: "Stabijhoun" },
      { value: "H233", label: "Stabÿhoun" },
      { value: "H874", label: "Staff" },
      { value: "H876", label: "Staffie" },
      { value: "H819", label: "Staffordshire-Terrier, Amerikanischer" },
      { value: "H893", label: "Sumo-Inu" },
      { value: "H563", label: "Swiss Hounds" },
      { value: "H813", label: "Taigan" },
      { value: "H812", label: "Taiwan Dog" },
      { value: "H234", label: "Taiwan Hund" },
      { value: "H235", label: "Tajgan" },
      { value: "H718", label: "Tatrahund" },
      { value: "H904", label: "Tazi" },
      { value: "H777", label: "Tchouvatch Slovaque" },
      { value: "H425", label: "Teckel" },
      { value: "H827", label: "Terrier Brasileiro" },
      { value: "H847", label: "Terrier Smooth, Fox-" },
      { value: "H843", label: "Terrier Wire, Fox-" },
      { value: "H870", label: "Terrier, Aberdeen-" },
      { value: "H236", label: "Terrier, Airedale" },
      { value: "H865", label: "Terrier, American Pit Bull" },
      { value: "H237", label: "Terrier, American Staffordshire" },
      { value: "H861", label: "Terrier, Amerikanischer Pit Bull" },
      { value: "H238", label: "Terrier, Australian" },
      { value: "H239", label: "Terrier, Australian Silky" },
      { value: "H821", label: "Terrier, Australischer" },
      { value: "H240", label: "Terrier, Bedlington" },
      { value: "H818", label: "Terrier, Bingley" },
      { value: "H619", label: "Terrier, Black" },
      { value: "H884", label: "Terrier, Black and Tan Rough-Haired" },
      { value: "H868", label: "Terrier, Black Russian" },
      { value: "H858", label: "Terrier, Black-and-tan" },
      { value: "H837", label: "Terrier, Black-and-tan Toy" },
      { value: "H241", label: "Terrier, Border" },
      { value: "H242", label: "Terrier, Boston" },
      { value: "H243", label: "Terrier, Brasilianischer" },
      { value: "H244", label: "Terrier, Bull-" },
      { value: "H836", label: "Terrier, Böhmischer" },
      { value: "H245", label: "Terrier, Cairn" },
      { value: "H246", label: "Terrier, Cesky" },
      { value: "H247", label: "Terrier, Dandie Dinmont" },
      { value: "H248", label: "Terrier, Deutscher Jagd-" },
      { value: "H830", label: "Terrier, English Bull" },
      { value: "H249", label: "Terrier, English Toy" },
      { value: "H618", label: "Terrier, Fell-" },
      { value: "H250", label: "Terrier, Fox- (Drahthaar)" },
      { value: "H251", label: "Terrier, Fox- (Glatthaar)" },
      { value: "H252", label: "Terrier, Glen of Imaal" },
      { value: "H852", label: "Terrier, Irischer" },
      { value: "H850", label: "Terrier, Irischer Glen of Imaal" },
      { value: "H253", label: "Terrier, Irish" },
      { value: "H857", label: "Terrier, Irish Blue" },
      { value: "H849", label: "Terrier, Irish Glen of Imaal" },
      { value: "H851", label: "Terrier, Irish Red" },
      { value: "H254", label: "Terrier, Irish Soft Coated Wheaten" },
      { value: "H256", label: "Terrier, Japanischer" },
      { value: "H257", label: "Terrier, Kerry Blue" },
      { value: "H846", label: "Terrier, Kurzhaar Fox-" },
      { value: "H258", label: "Terrier, Lakeland" },
      { value: "H571", label: "Terrier, Lhasa-" },
      { value: "H259", label: "Terrier, Lucas" },
      { value: "H260", label: "Terrier, Manchester" },
      { value: "H832", label: "Terrier, Miniatur-Bull-" },
      { value: "H855", label: "Terrier, Nippon-" },
      { value: "H856", label: "Terrier, Nishon-" },
      { value: "H261", label: "Terrier, Norfolk" },
      { value: "H262", label: "Terrier, Norwich" },
      { value: "H883", label: "Terrier, Old English Black and Tan" },
      { value: "H263", label: "Terrier, Parson Russell" },
      { value: "H859", label: "Terrier, Parson-Jack-Russel-" },
      { value: "H264", label: "Terrier, Pit Bull" },
      { value: "H842", label: "Terrier, Rauhaar Fox-" },
      { value: "H825", label: "Terrier, Rothbury-" },
      { value: "H867", label: "Terrier, Russischer" },
      { value: "H678", label: "Terrier, Russischer Toy" },
      { value: "H873", label: "Terrier, Schottischer" },
      { value: "H265", label: "Terrier, Schwarzer" },
      { value: "H866", label: "Terrier, Schwarzer Russischer" },
      { value: "H871", label: "Terrier, Scotch" },
      { value: "H266", label: "Terrier, Scottish" },
      { value: "H267", label: "Terrier, Sealyham" },
      { value: "H822", label: "Terrier, Silky" },
      { value: "H268", label: "Terrier, Skye" },
      { value: "H853", label: "Terrier, Soft-Coated Wheaten" },
      { value: "H820", label: "Terrier, Staffordshire" },
      { value: "H269", label: "Terrier, Staffordshire Bull-" },
      { value: "H869", label: "Terrier, Tchiorny" },
      { value: "H270", label: "Terrier, Tibet" },
      { value: "H878", label: "Terrier, Tibetan" },
      { value: "H840", label: "Terrier, Toy Manchester" },
      { value: "H835", label: "Terrier, Tschechischer" },
      { value: "H882", label: "Terrier, Waliser" },
      { value: "H817", label: "Terrier, Waterside-" },
      { value: "H886", label: "Terrier, Weißer Hochland" },
      { value: "H271", label: "Terrier, Welsh" },
      { value: "H272", label: "Terrier, West Highland White" },
      { value: "H273", label: "Terrier, Westfalen-" },
      { value: "H274", label: "Terrier, Yorkshire" },
      { value: "H834", label: "Terrier, Zwerg Bull-" },
      { value: "H698", label: "Tervueren" },
      { value: "H637", label: "Tesem" },
      { value: "H875", label: "The Nanny Dog" },
      { value: "H533", label: "Tora Inu" },
      { value: "H275", label: "Tornjak" },
      { value: "H889", label: "Tosa" },
      { value: "H276", label: "Tosa Inu" },
      { value: "H792", label: "Toy Spaniel, English" },
      { value: "H838", label: "Toy Terrier, Black-and-tan" },
      { value: "H679", label: "Toy Terrier, Russischer" },
      { value: "H363", label: "Treibhund, Ardennen-" },
      { value: "H400", label: "Treibhund, Australischer" },
      { value: "H364", label: "Treibhund, Flandrischer" },
      { value: "H389", label: "Treibhund, Portugiesischer" },
      { value: "H775", label: "Tschuwatsch, Slowakischer" },
      { value: "H362", label: "Tsvetnaya Bolonka" },
      { value: "H354", label: "Ténéfiffe" },
      { value: "H317", label: "Verdino" },
      { value: "H481", label: "Virelade" },
      { value: "H576", label: "Vogelhund, Norwegischer" },
      { value: "H516", label: "Vorstehhund, Altdänischer" },
      { value: "H435", label: "Vorstehhund, Deutscher Drahthaariger" },
      { value: "H436", label: "Vorstehhund, Deutscher Kurzhaariger" },
      { value: "H437", label: "Vorstehhund, Deutscher langhaariger" },
      { value: "H811", label: "Vorstehhund, Friesischer" },
      { value: "H604", label: "Vorstehhund, Grosser Münsterländer" },
      { value: "H802", label: "Vorstehhund, Italienischer Rauhhaariger" },
      { value: "H605", label: "Vorstehhund, Kleiner Münsterländer" },
      { value: "H577", label: "Vorstehhund, Ungarischer (Drahthaar)" },
      { value: "H578", label: "Vorstehhund, Ungarischer (Kurzhaar)" },
      { value: "H277", label: "Wachhund, Moskauer" },
      { value: "H897", label: "Wachtel, Deutscher" },
      { value: "H278", label: "Wachtelhund, Deutscher" },
      { value: "H440", label: "Warrigal" },
      {
        value: "H420",
        label: "Waschbärenhund, (Amerikanischer) Schwarz-Lohfarbener",
      },
      { value: "H421", label: "Waschbärenhund, Schwarz-roter" },
      { value: "H551", label: "Wasserhund der Romagna" },
      { value: "H312", label: "Wasserhund, Französischer" },
      { value: "H900", label: "Wasserhund, Friesischer" },
      { value: "H390", label: "Wasserhund, Portugiesischer" },
      { value: "H628", label: "Wasserhund, Spanischer" },
      { value: "H782", label: "Wasserspaniel, Amerikanischer" },
      { value: "H789", label: "Wasserspaniel, Irischer" },
      { value: "H546", label: "Wasserwild-Hund, Kleiner Holländischer" },
      { value: "H629", label: "Water Dog, Spanish" },
      { value: "H280", label: "Weimaraner" },
      { value: "H885", label: "Westie" },
      { value: "H899", label: "Wetter" },
      { value: "H898", label: "Wetterhond" },
      { value: "H281", label: "Wetterhoun" },
      { value: "H282", label: "Whippet" },
      { value: "H283", label: "Windhund, Afghanischer" },
      { value: "H773", label: "Windhund, Arabischer" },
      { value: "H905", label: "Windhund, Balutschi-" },
      { value: "H311", label: "Windhund, Berber-" },
      { value: "H814", label: "Windhund, Kirgisischer" },
      { value: "H913", label: "Windhund, Kleiner italienischer" },
      { value: "H407", label: "Windhund, Kurzhaariger" },
      { value: "H685", label: "Windhund, Persischer" },
      { value: "H284", label: "Windhund, Polnischer" },
      { value: "H321", label: "Windhund, Russischer" },
      { value: "H815", label: "Windhund, Sibirischer" },
      { value: "H474", label: "Windhund, Spanischer" },
      { value: "H310", label: "Windhund, Tuareg-" },
      { value: "H285", label: "Windhund, Ungarischer" },
      { value: "H286", label: "Windspiel" },
      { value: "H911", label: "Windspiel, Italienisches" },
      { value: "H917", label: "Wolf(s)hund, Tschechoslowakischer" },
      { value: "H469", label: "Wolf-Chow" },
      { value: "H915", label: "Wolfhound, Irish" },
      { value: "H287", label: "Wolfshund" },
      { value: "H914", label: "Wolfshund, Irischer" },
      { value: "H279", label: "Wäller" },
      { value: "H392", label: "Zavod" },
      { value: "H680", label: "Zwerghund, Russischer" },
      { value: "H422", label: "Zwerghund, Walisischer" },
      { value: "H681", label: "Zwergspaniel, Russischer" },
      { value: "H412", label: "Ätnahund" },
    ],
    pferd: [
      { value: "P103", label: "Hannoveraner" },
      { value: "P174", label: "Oldenburger" },
      { value: "P228", label: "Quarter Horse" },
      { value: "P113", label: "Islandpferd" },
      { value: "P257", label: "Deutsches Sportpferd" },
      { value: "P196", label: "Pony" },
      { value: "P099", label: "Haflinger" },
      { value: "P319", label: "Westfale" },
      { value: "P002", label: "Abtenauer" },
      { value: "P003", label: "Achal Tekkiner" },
      { value: "P004", label: "Achetta" },
      { value: "P005", label: "Aegidienberger" },
      { value: "P006", label: "Albino" },
      { value: "P008", label: "Alt-Oldenburger" },
      { value: "P009", label: "Altwürttemberger" },
      { value: "P007", label: "Altér Real" },
      { value: "P010", label: "American Cream and White" },
      { value: "P011", label: "American Cream Draft Horse" },
      { value: "P012", label: "American Saddlebred Horse" },
      { value: "P013", label: "American Standardbred" },
      { value: "P014", label: "Andalusier" },
      { value: "P015", label: "Anglo-Araber" },
      { value: "P016", label: "Anglo-Araber, Französischer" },
      { value: "P017", label: "Anglo-Araber, Polnischer" },
      { value: "P018", label: "Anglo-Araber, Sardischer" },
      { value: "P019", label: "Anglo-Araber, Spanischer" },
      { value: "P020", label: "Anglo-Argentino" },
      { value: "P021", label: "Anglo-Donpferd" },
      { value: "P022", label: "Anglo-Kabardiner" },
      { value: "P023", label: "Anglo-Karatschaever" },
      { value: "P024", label: "Anglo-Normanne" },
      { value: "P025", label: "Appaloosa" },
      { value: "P026", label: "Appaloosa Sport Horse" },
      { value: "P027", label: "Ara-Appaloosa" },
      { value: "P028", label: "Araber" },
      { value: "P029", label: "Araber, Hispano" },
      { value: "P030", label: "Araber, Shagya" },
      { value: "P031", label: "Araber, Syrischer" },
      { value: "P032", label: "Araber, Vollblut-" },
      { value: "P033", label: "Araber-Berber" },
      { value: "P034", label: "Araberpinto" },
      { value: "P035", label: "Arabisches Partbred" },
      { value: "P037", label: "Arabo-Haflinger" },
      { value: "P036", label: "Arabofriese" },
      { value: "P038", label: "Ardenner" },
      { value: "P039", label: "Ardenner, Lettischer" },
      { value: "P040", label: "Ardenner, Russischer" },
      { value: "P041", label: "Ardenner, Schwedischer" },
      { value: "P042", label: "Ariègois" },
      { value: "P043", label: "Arravani" },
      { value: "P044", label: "Asil-Araber" },
      { value: "P045", label: "Aveligneser" },
      { value: "P046", label: "Baden-Württemberger" },
      { value: "P047", label: "Bardigiano" },
      { value: "P048", label: "Belgier" },
      { value: "P049", label: "Berber" },
      { value: "P050", label: "Bosniake" },
      { value: "P051", label: "Boulonnais" },
      { value: "P052", label: "Brabanter" },
      { value: "P053", label: "Bretone" },
      { value: "P054", label: "Budjonny" },
      { value: "P055", label: "Burgenländer" },
      { value: "P056", label: "Camargue-Pferd" },
      { value: "P057", label: "Canadian Cutting Horse" },
      { value: "P058", label: "Canadian Horse" },
      { value: "P059", label: "Cavallo della Madonna" },
      { value: "P060", label: "Cavalo Portugues de Desperto" },
      { value: "P061", label: "Charolais Halbblut" },
      { value: "P062", label: "Cheval de Selle Francais" },
      { value: "P063", label: "Clydesdale" },
      { value: "P064", label: "Cob" },
      { value: "P065", label: "Cob Normand" },
      { value: "P066", label: "Colorado Ranger" },
      { value: "P067", label: "Comtois" },
      { value: "P068", label: "Criollo" },
      { value: "P069", label: "Curly Horse" },
      { value: "P070", label: "Curly Horse, American Bashkir" },
      { value: "P071", label: "Danubisches Pferd" },
      { value: "P072", label: "Dolepferd" },
      { value: "P073", label: "Donpferd" },
      { value: "P074", label: "Dülmener" },
      { value: "P075", label: "Dülmener Wildpferd" },
      { value: "P076", label: "Einsiedler" },
      { value: "P077", label: "Esel" },
      { value: "P078", label: "Estnisches Pferd" },
      { value: "P079", label: "Falabella" },
      { value: "P080", label: "Finnpferd" },
      { value: "P081", label: "Fjordpferd, Norwegisches" },
      { value: "P082", label: "Flamländer" },
      { value: "P083", label: "Foxtrotter, Missouri" },
      { value: "P084", label: "Foxtrotter, Österreichischer" },
      { value: "P085", label: "Frederiksborger" },
      { value: "P086", label: "Freiberger" },
      { value: "P087", label: "Friese" },
      { value: "P088", label: "Furioso-North-Star" },
      { value: "P089", label: "Gebirgspferd, Bosnisches" },
      { value: "P090", label: "Gebirgspferd, Mazedonisches" },
      { value: "P091", label: "Gelderländer" },
      { value: "P092", label: "Gidran" },
      { value: "P093", label: "Golden American Saddlebred" },
      { value: "P094", label: "Groninger Pferd" },
      { value: "P095", label: "Großpolnische Rasse" },
      { value: "P096", label: "Gudbrandsdaler" },
      { value: "P097", label: "Hack" },
      { value: "P098", label: "Hackney" },
      { value: "P100", label: "Haflinger, Edelblut" },
      { value: "P101", label: "Halbblut, Arabisches" },
      { value: "P102", label: "Halbblut, Limousin" },
      { value: "P104", label: "Hessen-Nassauer" },
      { value: "P105", label: "Hispano" },
      { value: "P106", label: "Holsteiner" },
      { value: "P107", label: "Hunter, Englischer" },
      { value: "P108", label: "Hunter, Irischer" },
      { value: "P109", label: "Huzule" },
      { value: "P110", label: "Irish Cob" },
      { value: "P111", label: "Irish Draught Horse" },
      { value: "P112", label: "Irish Sport Horse" },
      { value: "P114", label: "Jomud" },
      { value: "P115", label: "Jütländer" },
      { value: "P116", label: "Kabardiner" },
      { value: "P117", label: "Kaltblut" },
      { value: "P118", label: "Kaltblut, Altmärkisches" },
      { value: "P119", label: "Kaltblut, Belgisches" },
      { value: "P120", label: "Kaltblut, CSFR-" },
      { value: "P121", label: "Kaltblut, Italienisches" },
      { value: "P122", label: "Kaltblut, Lettisches" },
      { value: "P123", label: "Kaltblut, Litauisches" },
      { value: "P124", label: "Kaltblut, Mecklenburger" },
      { value: "P125", label: "Kaltblut, Niederländisches" },
      { value: "P126", label: "Kaltblut, Rheinisch-Deutsches" },
      { value: "P127", label: "Kaltblut, Rheinisch-Westfälisches" },
      { value: "P128", label: "Kaltblut, Russisches" },
      { value: "P130", label: "Kaltblut, Schwarzwälder" },
      { value: "P131", label: "Kaltblut, Slowenisches" },
      { value: "P129", label: "Kaltblut, Sächsisch-Thüringisches" },
      { value: "P132", label: "Kaltblut, Süddeutsches" },
      { value: "P133", label: "Kaltblut, Tschechisches" },
      { value: "P134", label: "Kaltblut, Ungarisches" },
      { value: "P135", label: "Kaltblutaraber, Skandinavischer" },
      { value: "P136", label: "Karabagh" },
      { value: "P137", label: "Kartäuser" },
      { value: "P138", label: "Kentucky Mountain Saddle Horse" },
      { value: "P139", label: "Kinsky-Pferd" },
      { value: "P140", label: "Kisberer" },
      { value: "P141", label: "Kladruber" },
      { value: "P142", label: "Kleinpferd" },
      { value: "P143", label: "Knabstrupper" },
      { value: "P144", label: "Konik Polski" },
      { value: "P145", label: "Kopczyk-Podlaski" },
      { value: "P146", label: "Kustanaier" },
      { value: "P324", label: "Leonharder" },
      { value: "P147", label: "Leutstettener" },
      { value: "P148", label: "Lewitzer" },
      { value: "P149", label: "Lipizzaner" },
      { value: "P150", label: "Lokaier" },
      { value: "P151", label: "Lusitano" },
      { value: "P152", label: "Malopolska" },
      { value: "P153", label: "Mangalarga Marchador" },
      { value: "P154", label: "Maremmano" },
      { value: "P155", label: "Maulesel" },
      { value: "P156", label: "Maultier" },
      { value: "P157", label: "Menorquiner" },
      { value: "P158", label: "Miniature Horse, American" },
      { value: "P159", label: "Miniaturpferd" },
      { value: "P160", label: "Mischblut" },
      { value: "P161", label: "Morgan Horse" },
      { value: "P162", label: "Moulassier" },
      { value: "P163", label: "Muli" },
      { value: "P164", label: "Muraközer" },
      { value: "P165", label: "Murgese" },
      { value: "P166", label: "Mustang" },
      { value: "P167", label: "Mustang, Kiger" },
      { value: "P168", label: "Mustang, Spanischer" },
      { value: "P169", label: "Nonius" },
      { value: "P170", label: "Nord-Adenner" },
      { value: "P171", label: "Norfolk Trotter" },
      { value: "P172", label: "Noriker" },
      { value: "P173", label: "Normannischer Cob" },
      { value: "P175", label: "Orlow-Traber" },
      { value: "P176", label: "Ostbulgare" },
      { value: "P177", label: "Ostfriese" },
      { value: "P178", label: "Ostpreuße" },
      { value: "P179", label: "Paint Horse" },
      { value: "P180", label: "Palomino" },
      { value: "P181", label: "Panje Pferd" },
      { value: "P182", label: "Paso Fino" },
      { value: "P183", label: "Paso Peruano" },
      { value: "P184", label: "Percheron" },
      { value: "P185", label: "Perser" },
      { value: "P186", label: "Peruano Argentino de Paso" },
      { value: "P187", label: "Pfalz-Ardenner" },
      { value: "P188", label: "Pintabian" },
      { value: "P189", label: "Pintarab" },
      { value: "P190", label: "Pinto" },
      { value: "P191", label: "Poitevin" },
      { value: "P192", label: "Polopferd, Deutsches" },
      { value: "P193", label: "Polopony" },
      { value: "P194", label: "Polopony, Argentinisches" },
      { value: "P195", label: "Poney Francais de Selle" },
      { value: "P197", label: "Pony of the Americas" },
      { value: "P198", label: "Pony, American Shetland" },
      { value: "P199", label: "Pony, Arenberg-Nordkirchener" },
      { value: "P200", label: "Pony, British Riding" },
      { value: "P201", label: "Pony, Connemara" },
      { value: "P202", label: "Pony, Dartmoor" },
      { value: "P203", label: "Pony, Deutsches Classic" },
      { value: "P204", label: "Pony, Deutsches Part-Bred Shetland" },
      { value: "P205", label: "Pony, Exmoor" },
      { value: "P206", label: "Pony, Fell" },
      { value: "P207", label: "Pony, Galicisches" },
      { value: "P208", label: "Pony, Gotland" },
      { value: "P209", label: "Pony, Highland" },
      { value: "P210", label: "Pony, Kaspisches" },
      { value: "P211", label: "Pony, Lehmkuhlener" },
      { value: "P213", label: "Pony, Minishetland" },
      { value: "P214", label: "Pony, Mongolen" },
      { value: "P212", label: "Pony, Mérens" },
      { value: "P215", label: "Pony, Neufundland" },
      { value: "P216", label: "Pony, New Forest" },
      { value: "P217", label: "Pony, Nigerianisches" },
      { value: "P218", label: "Pony, Nordkirchener" },
      { value: "P219", label: "Pony, Pottok" },
      { value: "P220", label: "Pony, Quarter" },
      { value: "P221", label: "Pony, Sardisches" },
      { value: "P222", label: "Pony, Shetland" },
      { value: "P223", label: "Pony, Tigerscheck" },
      { value: "P224", label: "Pony, Welsh" },
      { value: "P225", label: "Pony, Zwerg-" },
      { value: "P226", label: "Pura Raza Espanola" },
      { value: "P227", label: "Quarab" },
      { value: "P229", label: "Quarter Horse, American" },
      { value: "P230", label: "Racking Horse" },
      { value: "P231", label: "Reitpferd, Deutsches" },
      { value: "P232", label: "Reitpferd, Französisches" },
      { value: "P233", label: "Reitpferd, Italienisches" },
      { value: "P234", label: "Reitpferd, Kleines Deutsches" },
      { value: "P235", label: "Reitpferd, Russisches" },
      { value: "P236", label: "Reitpferd, Thüringer" },
      { value: "P237", label: "Reitpony, Deutsches" },
      { value: "P238", label: "Reitpony, Englisches" },
      { value: "P239", label: "Reitpony, Französisches" },
      { value: "P240", label: "Reitpony, Niederländisches" },
      { value: "P241", label: "Rocky Mountain Pferd" },
      { value: "P242", label: "Rottaler" },
      { value: "P243", label: "Salerner" },
      { value: "P244", label: "Sardisches Pferd" },
      { value: "P245", label: "Sarvarer" },
      { value: "P246", label: "Schleswiger" },
      { value: "P247", label: "Schwarzwälder Fuchs" },
      { value: "P248", label: "Sella Italiano" },
      { value: "P249", label: "Selle Argentino" },
      { value: "P250", label: "Selle Francais" },
      { value: "P251", label: "Senner" },
      { value: "P252", label: "Shire Horse" },
      { value: "P253", label: "Sizilianer" },
      { value: "P254", label: "Slaski" },
      { value: "P001", label: "Sonstige Pferderasse" },
      { value: "P255", label: "Sorraia" },
      { value: "P256", label: "Spanish-Norman Horse" },
      { value: "P258", label: "Sportpferd, Irisches" },
      { value: "P259", label: "Sportpferd, Italienisches" },
      { value: "P260", label: "Sportpferd, Portugiesisches" },
      { value: "P261", label: "Sportpferd, Ungarisches" },
      { value: "P262", label: "Spotted Saddle Horse" },
      { value: "P263", label: "Suffolk Punch" },
      { value: "P264", label: "Tennessee Walking Horse" },
      { value: "P265", label: "Tersker" },
      { value: "P266", label: "Thoroughbred" },
      { value: "P267", label: "Tinker" },
      { value: "P268", label: "Tiro Pesante Rapido" },
      { value: "P269", label: "Torgelsches Pferd" },
      { value: "P270", label: "Torisches Pferd" },
      { value: "P271", label: "Torisker" },
      { value: "P272", label: "Traber" },
      { value: "P273", label: "Traber, Andalusischer" },
      { value: "P274", label: "Traber, Deutscher" },
      { value: "P275", label: "Traber, Dole" },
      { value: "P276", label: "Traber, Französischer" },
      { value: "P277", label: "Traber, Metis" },
      { value: "P278", label: "Traber, Russischer" },
      { value: "P279", label: "Traber, Töltender" },
      { value: "P280", label: "Trait du Nord" },
      { value: "P281", label: "Trakehner" },
      { value: "P282", label: "Trotteur Francais" },
      { value: "P283", label: "Tschenerani" },
      { value: "P284", label: "Tuigpaard" },
      { value: "P285", label: "Ukrainer" },
      { value: "P286", label: "Vollblut" },
      { value: "P287", label: "Vollblut, Anglo-Arabisches" },
      { value: "P288", label: "Vollblut, Arabisches" },
      { value: "P289", label: "Vollblut, Englisches" },
      { value: "P290", label: "Warmblut" },
      { value: "P291", label: "Warmblut, Bayerisches" },
      { value: "P292", label: "Warmblut, Belgisches" },
      { value: "P293", label: "Warmblut, Brandenburger" },
      { value: "P294", label: "Warmblut, Britisches" },
      { value: "P295", label: "Warmblut, CSFR-" },
      { value: "P296", label: "Warmblut, Dänisches" },
      { value: "P297", label: "Warmblut, Hessisches" },
      { value: "P298", label: "Warmblut, Holländisches" },
      { value: "P299", label: "Warmblut, Lettisches" },
      { value: "P300", label: "Warmblut, Littauer" },
      { value: "P301", label: "Warmblut, Mecklenburger" },
      { value: "P302", label: "Warmblut, Niederländisches" },
      { value: "P304", label: "Warmblut, Polnisches" },
      { value: "P305", label: "Warmblut, Rheinisches" },
      { value: "P306", label: "Warmblut, Sachsen-Anhaltiner" },
      { value: "P308", label: "Warmblut, Schlesisches" },
      { value: "P309", label: "Warmblut, Schwedisches" },
      { value: "P310", label: "Warmblut, Schweizer" },
      { value: "P311", label: "Warmblut, Schweres" },
      { value: "P312", label: "Warmblut, Slowakisches" },
      { value: "P307", label: "Warmblut, Sächsisch-Thüringisches Schweres" },
      { value: "P313", label: "Warmblut, Tschechisches" },
      { value: "P314", label: "Warmblut, Ungarisches" },
      { value: "P315", label: "Warmblut, Württemberger" },
      { value: "P316", label: "Warmblut, Württemberger Schweres" },
      { value: "P317", label: "Warmblut, Zweibrücker" },
      { value: "P303", label: "Warmblut, Österreichisches" },
      { value: "P318", label: "Welsh Part Bred" },
      { value: "P320", label: "Wielkopolski" },
      { value: "P321", label: "Württemberger" },
      { value: "P322", label: "Zugpferd, Italienisches" },
      { value: "P323", label: "Zwergpony, Argentinisches" },
    ],
  };

  // PLZ input validation and city display
  // if (plzInput) {
  //   const cityNameElement = document.getElementById("cityName");
  //   const successBox = document.getElementById("plzSuccess");
  //   const errorBox = document.getElementById("plzError");

  //   plzInput.addEventListener("input", function () {
  //     const plz = this.value;
  //     if (plz.length === 5 && plzCityMap[plz]) {
  //       // Display city name with animation
  //       if (cityNameElement) {
  //         cityNameElement.textContent = plzCityMap[plz];
  //         cityNameElement.classList.add("show");
  //       }
  //       // Show success message
  //       if (successBox) {
  //         successBox.classList.add("show");
  //         successBox.style.display = "flex";
  //       }
  //       if (errorBox) {
  //         errorBox.classList.remove("show");
  //         errorBox.style.display = "none";
  //       }
  //       // Add success feedback
  //       this.style.borderBottomColor = "#28a745";
  //       this.style.background =
  //         "linear-gradient(180deg, rgba(40, 167, 69, 0.05) 0%, transparent 100%)";
  //     } else {
  //       // Hide success message
  //       if (successBox) {
  //         successBox.classList.remove("show");
  //         successBox.style.display = "none";
  //       }
  //       // Hide city name if PLZ is invalid or incomplete
  //       if (cityNameElement) {
  //         cityNameElement.classList.remove("show");
  //         // Clear text after transition
  //         setTimeout(() => {
  //           if (!cityNameElement.classList.contains("show")) {
  //             cityNameElement.textContent = "";
  //           }
  //         }, 300);
  //       }
  //       // Reset styling
  //       if (plz.length > 0) {
  //         this.style.borderBottomColor = "#ff8c42";
  //         this.style.background = "transparent";
  //       }
  //     }

  //     checkFormCompletion();
  //   });
  // }

  // Brand selection handling
  const animalSelect = document.getElementById("animal");
  const breedSelect = document.getElementById("breed");

  if (animalSelect && breedSelect) {
    animalSelect.addEventListener("change", function () {
      updateBreedOptions(this.value);
    });

    // Initialize with default selection
    updateBreedOptions(animalSelect.value);
  }

  // Animal category change handler
  if (tierKategorieSelect) {
    tierKategorieSelect.addEventListener("change", function () {
      const selectedAnimal = this.value;
      updateBreedOptions(selectedAnimal);

      // Update housing question text based on animal type
      updateHousingText(selectedAnimal);

      // Add visual feedback
      this.style.borderBottomColor = "#28a745";
      this.style.background =
        "linear-gradient(180deg, rgba(40, 167, 69, 0.05) 0%, transparent 100%)";

      checkFormCompletion();
    });

    // Initialize with current selection
    updateBreedOptions(tierKategorieSelect.value);
  }

  // PLZ input validation and city display
  // if (plzInput) {
  //   plzInput.addEventListener("input", function () {
  //     const plz = this.value;
  //     if (plz.length === 5 && plzCityMap[plz]) {
  //       // Could display city name here if needed
  //       // PLZ validation successful
  //     }
  //   });
  // }

  // Function to update breed dropdown based on selected animal category
  function updateBreedOptions(animalType) {
    if (!rasseSelect) return;

    // Clear existing options
    rasseSelect.innerHTML = "";

    // Get breeds for selected animal type
    const breeds = breedData[animalType] || [];

    // Add default option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    if (animalType === "katze") {
      defaultOption.textContent = "Rasse auswählen...";
    } else if (animalType === "hund") {
      defaultOption.textContent = "Rasse auswählen...";
    } else if (animalType === "pferd") {
      defaultOption.textContent = "Rasse auswählen...";
    }
    defaultOption.selected = true;
    rasseSelect.appendChild(defaultOption);

    // Add breed options
    breeds.forEach((breed) => {
      const option = document.createElement("option");
      // Check if breed is an object (new format) or string (old format)
      if (typeof breed === "object" && breed.value && breed.label) {
        option.value = breed.value;
        option.textContent = breed.label;
      } else {
        // Fallback for old string format
        option.value = breed.toLowerCase().replace(/[^a-z0-9]/g, "_");
        option.textContent = breed;
      }
      rasseSelect.appendChild(option);
    });

    // Add change listener for breed selection
    if (!rasseSelect.dataset.listenerAdded) {
      rasseSelect.addEventListener("change", function () {
        if (this.value) {
          // Add visual feedback
          this.style.borderBottomColor = "#28a745";
          this.style.background =
            "linear-gradient(180deg, rgba(40, 167, 69, 0.05) 0%, transparent 100%)";
        }
        checkFormCompletion();
      });
      rasseSelect.dataset.listenerAdded = "true";
    }
  }

  // Animal category change handler
  if (tierKategorieSelect) {
    tierKategorieSelect.addEventListener("change", function () {
      const selectedAnimal = this.value;
      updateBreedOptions(selectedAnimal);

      // Update housing question text based on animal type
      updateHousingText(selectedAnimal);
    });

    // Initialize breed options on page load
    updateBreedOptions(tierKategorieSelect.value);
  }

  // Function to update housing question text based on animal type
  function updateHousingText(animalType) {
    const haltungTitle = document.getElementById("haltungTitle");
    const indoorText = document.getElementById("indoorText");
    const outdoorText = document.getElementById("outdoorText");

    if (haltungTitle && indoorText && outdoorText) {
      if (animalType === "katze") {
        haltungTitle.textContent = "Wie wird Ihre Katze gehalten?";
        indoorText.textContent = "ausschließlich in der Wohnung";
        outdoorText.textContent = "Freigänger";
      } else if (animalType === "hund") {
        haltungTitle.textContent = "Wie wird Ihr Hund gehalten?";
        indoorText.textContent = "ausschließlich im Haus/Wohnung";
        outdoorText.textContent = "mit Gartenfreilauf/Auslauf";
      } else if (animalType === "pferd") {
        haltungTitle.textContent = "Wie wird Ihr Pferd gehalten?";
        indoorText.textContent = "Stallhaltung";
        outdoorText.textContent = "Koppel-/Weidehaltung";
      }
    }
  }

  // Add event listeners for all form interactions

  // Birth date input
  const birthDateInput = document.getElementById("geburtsdatum");
  if (birthDateInput) {
    birthDateInput.addEventListener("input", function () {
      validateDateInput(this);
      checkFormCompletion();
    });
  }

  // Neutering radio buttons
  const neuteringRadios = document.querySelectorAll('input[name="kastriert"]');
  neuteringRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      // Add visual feedback to the selected option
      const parentOption = this.closest(".radio-option");
      if (parentOption) {
        parentOption.style.borderColor = "#28a745";
        parentOption.style.background =
          "linear-gradient(135deg, #f0f8f5 0%, #ffffff 100%)";
      }
      checkFormCompletion();
    });
  });

  // Housing radio buttons
  const housingRadios = document.querySelectorAll('input[name="haltung"]');
  housingRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      // Add visual feedback to the selected option
      const parentOption = this.closest(".radio-option");
      if (parentOption) {
        parentOption.style.borderColor = "#28a745";
        parentOption.style.background =
          "linear-gradient(135deg, #f0f8f5 0%, #ffffff 100%)";
      }
      checkFormCompletion();
    });
  });

  // Handle health problems radio button change
  gesundheitsproblemeRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      // Add visual feedback
      const parentOption = this.closest(".radio-option");
      if (parentOption) {
        parentOption.style.borderColor = "#28a745";
        parentOption.style.background =
          "linear-gradient(135deg, #f0f8f5 0%, #ffffff 100%)";
      }

      if (this.value === "ja" && behandlungsFrage) {
        behandlungsFrage.style.display = "block";
        // Also show the disease list
        if (krankheitenListe) {
          krankheitenListe.style.display = "block";
        }
      } else if (behandlungsFrage) {
        behandlungsFrage.style.display = "none";
        // Hide the disease list
        if (krankheitenListe) {
          krankheitenListe.style.display = "none";
          // Reset disease list radio buttons
          const diseaseRadios = document.querySelectorAll(
            'input[name="spezielle_krankheiten"]'
          );
          diseaseRadios.forEach((radio) => (radio.checked = false));
        }
        // Reset all checkboxes when hiding the question
        const behandlungCheckboxes = document.querySelectorAll(
          'input[name="neue_behandlung"]'
        );
        behandlungCheckboxes.forEach((cb) => {
          cb.checked = false;
          cb.disabled = false;
        });
        // Hide operation count
        if (operationAnzahl) {
          operationAnzahl.style.display = "none";
        }
        // Remove grayed styling
        document.querySelectorAll(".checkbox-option").forEach((option) => {
          option.classList.remove("grayed-option");
        });
      }
      checkFormCompletion();
      updateStepThreeAvailability();
    });
  });

  // Handle treatment checkbox interactions
  if (keinBesuchCheckbox) {
    keinBesuchCheckbox.addEventListener("change", function () {
      if (this.checked) {
        // Disable and uncheck other options
        if (heilbehandlungCheckbox) {
          heilbehandlungCheckbox.checked = false;
          heilbehandlungCheckbox.disabled = true;
          heilbehandlungCheckbox.parentElement.classList.add("grayed-option");
        }
        if (operationCheckbox) {
          operationCheckbox.checked = false;
          operationCheckbox.disabled = true;
          operationCheckbox.parentElement.classList.add("grayed-option");
        }
        // Hide operation count
        if (operationAnzahl) {
          operationAnzahl.style.display = "none";
        }
      } else {
        // Re-enable other options
        if (heilbehandlungCheckbox) {
          heilbehandlungCheckbox.disabled = false;
          heilbehandlungCheckbox.parentElement.classList.remove(
            "grayed-option"
          );
        }
        if (operationCheckbox) {
          operationCheckbox.disabled = false;
          operationCheckbox.parentElement.classList.remove("grayed-option");
        }
      }
    });
  }

  // Handle operation checkbox
  if (operationCheckbox) {
    operationCheckbox.addEventListener("change", function () {
      if (this.checked) {
        if (operationAnzahl) {
          operationAnzahl.style.display = "block";
        }
      } else {
        if (operationAnzahl) {
          operationAnzahl.style.display = "none";
        }
      }
    });
  }

  // Prevent other checkboxes when "kein Besuch" is selected
  if (heilbehandlungCheckbox) {
    heilbehandlungCheckbox.addEventListener("change", function () {
      if (this.checked && keinBesuchCheckbox && keinBesuchCheckbox.checked) {
        keinBesuchCheckbox.checked = false;
        // Re-enable this checkbox
        this.disabled = false;
        this.parentElement.classList.remove("grayed-option");
      }
    });
  }

  // Generate JSON from form data
  function generateFormJSON() {
    // Get current date as start date
    const today = new Date();

    // Get form values
    const zipCode = document.getElementById("plz").value;
    const city = plzCityMap[zipCode] || "Unknown City";

    // Animal type - convert to uppercase
    const tierKategorie = document.getElementById("tierKategorie").value;
    let animal = "";
    if (tierKategorie === "katze") {
      animal = "CAT";
    } else if (tierKategorie === "hund") {
      animal = "DOG";
    } else if (tierKategorie === "pferd") {
      animal = "HORSE";
    }

    // Sex - convert to uppercase
    const geschlecht = document.getElementById("geschlecht").value;
    let sex = "";
    if (geschlecht === "maennlich") {
      sex = "MALE";
    } else if (geschlecht === "weiblich") {
      sex = "FEMALE";
    }

    // Breed - get the breed CODE (value) instead of label
    const rasseSelect = document.getElementById("rasse");
    const breedCode = rasseSelect.value;

    // Birth date - already in DD.MM.YYYY format (German) from text input
    const birthDateInput = document.getElementById("geburtsdatum").value;
    let birthDate = "";
    if (birthDateInput) {
      // Validate the German format DD.MM.YYYY
      const germanDateRegex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
      const match = birthDateInput.match(germanDateRegex);

      if (match) {
        const [, day, month, year] = match;
        const date = new Date(year, month - 1, day);

        // Verify the date is valid
        if (
          date.getDate() == day &&
          date.getMonth() == month - 1 &&
          date.getFullYear() == year
        ) {
          birthDate = birthDateInput; // Use as-is since it's already in DD.MM.YYYY format
        }
      }
    }

    // Environment - convert to uppercase for cats ONLY
    const haltung = document.querySelector(
      'input[name="haltung"]:checked'
    ).value;
    let environment = "";
    if (haltung === "wohnung") {
      environment = "INDOOR";
    } else if (haltung === "freigang") {
      environment = "OUTDOOR";
    }

    // Sterilized/Neutered status
    const kastriert = document.querySelector(
      'input[name="kastriert"]:checked'
    ).value;
    const sterilized = kastriert === "ja";

    // Health problems status
    const gesundheitsprobleme = document.querySelector(
      'input[name="gesundheitsprobleme"]:checked'
    ).value;
    const preExistingDiagnosis = gesundheitsprobleme === "ja";

    // For now, set excludedExistingDiagnosis to false
    const excludedExistingDiagnosis = false;

    // Treatment logic - build treatments array and surgery amount
    let treatments = [];
    let surgeryAmount = 0;

    if (gesundheitsprobleme === "ja") {
      const heilbehandlung = document.getElementById("neue_heilbehandlung");
      const operation = document.getElementById("neue_operation");
      const keinBesuch = document.getElementById("neue_kein_besuch");

      if (heilbehandlung && heilbehandlung.checked) {
        treatments.push("HEALING_TREATMENT");
      }

      if (operation && operation.checked) {
        treatments.push("SURGERY");
        const anzahlOperationen = document.getElementById("anzahl_operationen");
        surgeryAmount = anzahlOperationen
          ? parseInt(anzahlOperationen.value)
          : 1;
      }
    }

    // Start date in DD.MM.YYYY format (tomorrow's date as typical for insurance)
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const startDay = String(tomorrow.getDate()).padStart(2, "0");
    const startMonth = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const startYear = tomorrow.getFullYear();
    const formattedStartDate = `${startDay}.${startMonth}.${startYear}`;

    // Generate a random session ID
    const sessionId =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    // Create complete JSON object matching server structure
    const jsonData = {
      id: null,
      applicationNumber: null,
      sessionId: sessionId,
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
      abTest: {
        group: null,
        tests: [],
        id: null,
      },
      nlf: {
        valid: true,
        zip: zipCode,
        city: city,
        street: "",
        animalCategory: animal,
        animalGender: sex,
        animalRace: breedCode,
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
          zip: zipCode,
          city: city,
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
        category: animal,
        gender: sex,
        race: breedCode,
        birthDate: birthDate,
        age: null,
        sterilized: sterilized,
        // Only include catHousingType for cats
        ...(animal === "CAT" && { catHousingType: environment }),
        preExistingDiagnosis: preExistingDiagnosis,
        excludedExistingDiagnosis: excludedExistingDiagnosis,
        treatments: treatments,
        surgeryAmount: surgeryAmount,
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

    return jsonData;
  }

  function clearPricingError() {
    const errorBanner = document.getElementById("pricingErrorBanner");
    if (errorBanner && errorBanner.parentElement) {
      errorBanner.parentElement.removeChild(errorBanner);
      scheduleIframeHeightUpdate();
    }
  }

  function setPricingLoading(isLoading) {
    const pricingScreen = document.getElementById("pricingScreen");
    if (!pricingScreen) {
      return;
    }

    let indicator = document.getElementById("pricingLoadingIndicator");
    if (!indicator) {
      indicator = document.createElement("div");
      indicator.id = "pricingLoadingIndicator";
      indicator.style.display = "none";
      indicator.style.margin = "16px 0";
      indicator.style.padding = "12px 16px";
      indicator.style.borderRadius = "8px";
      indicator.style.background = "#eef5ff";
      indicator.style.color = "#084298";
      indicator.style.fontWeight = "500";
      indicator.style.alignItems = "center";
      indicator.style.gap = "8px";

      const spinner = document.createElement("span");
      spinner.className = "pricing-loading-spinner";
      spinner.style.width = "16px";
      spinner.style.height = "16px";
      spinner.style.border = "2px solid #84a9ff";
      spinner.style.borderTopColor = "transparent";
      spinner.style.borderRadius = "50%";
      spinner.style.display = "inline-block";
      spinner.style.animation = "pricingSpinner 0.8s linear infinite";

      const text = document.createElement("span");
      text.textContent = "Tarife werden geladen …";

      indicator.appendChild(spinner);
      indicator.appendChild(text);

      if (!document.getElementById("pricingLoadingStyles")) {
        const styleEl = document.createElement("style");
        styleEl.id = "pricingLoadingStyles";
        styleEl.textContent = `@keyframes pricingSpinner { to { transform: rotate(360deg); } }`;
        document.head.appendChild(styleEl);
      }

      const insertionTarget =
        pricingScreen.querySelector(".plans-title-section") ||
        pricingScreen.firstElementChild;
      if (insertionTarget) {
        insertionTarget.insertAdjacentElement("afterend", indicator);
      } else {
        pricingScreen.prepend(indicator);
      }
    }

    indicator.style.display = isLoading ? "flex" : "none";
    scheduleIframeHeightUpdate();
  }

  // Function to show error message when API fails
  function showApiError(
    errorMessage = "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut."
  ) {
    const pricingScreen = document.getElementById("pricingScreen");
    if (!pricingScreen) {
      console.error("Pricing screen container not found");
      return;
    }

    let errorBanner = document.getElementById("pricingErrorBanner");
    if (!errorBanner) {
      errorBanner = document.createElement("div");
      errorBanner.id = "pricingErrorBanner";
      errorBanner.setAttribute("role", "alert");
      errorBanner.style.background = "#fff3cd";
      errorBanner.style.border = "1px solid #ffeeba";
      errorBanner.style.color = "#856404";
      errorBanner.style.padding = "16px";
      errorBanner.style.borderRadius = "8px";
      errorBanner.style.margin = "16px 0";
      errorBanner.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.08)";

      const insertionTarget =
        pricingScreen.querySelector(".plans-title-section") ||
        pricingScreen.firstElementChild;
      if (insertionTarget) {
        insertionTarget.insertAdjacentElement("afterend", errorBanner);
      } else {
        pricingScreen.prepend(errorBanner);
      }
    } else {
      errorBanner.style.display = "block";
    }

    errorBanner.innerHTML = "";

    const title = document.createElement("div");
    title.style.fontWeight = "600";
    title.style.marginBottom = "4px";
    title.textContent = "Hinweis";

    const message = document.createElement("div");
    message.textContent = errorMessage;

    const fallback = document.createElement("div");
    fallback.style.marginTop = "8px";
    fallback.textContent = "Die Standardtarife stehen weiterhin zur Auswahl.";

    errorBanner.appendChild(title);
    errorBanner.appendChild(message);
    errorBanner.appendChild(fallback);

    scheduleIframeHeightUpdate();
  }

  // Enhanced form validation with user-friendly messages
  function validateFormData() {
    const tierKategorie = document.getElementById("tierKategorie")?.value;
    const rasse = document.getElementById("rasse")?.value;
    const geburtsdatum = document.getElementById("geburtsdatum")?.value;
    const plz = document.getElementById("plz")?.value;

    // 1. Check animal type and breed compatibility
    if (tierKategorie && rasse) {
      if (tierKategorie === "hund" && !rasse.startsWith("H")) {
        return {
          isValid: false,
          message:
            "❌ Falscher Rassencode!\n\nSie haben 'Hund' ausgewählt, aber eine Katzen- oder Pferderasse gewählt.\n\n✅ Bitte wählen Sie eine Hunderasse aus der Liste.",
        };
      }

      if (tierKategorie === "katze" && !rasse.startsWith("K")) {
        return {
          isValid: false,
          message:
            "❌ Falscher Rassencode!\n\nSie haben 'Katze' ausgewählt, aber eine Hunde- oder Pferderasse gewählt.\n\n✅ Bitte wählen Sie eine Katzenrasse aus der Liste.",
        };
      }

      if (tierKategorie === "pferd" && !rasse.startsWith("P")) {
        return {
          isValid: false,
          message:
            "❌ Falscher Rassencode!\n\nSie haben 'Pferd' ausgewählt, aber eine Hunde- oder Katzenrasse gewählt.\n\n✅ Bitte wählen Sie eine Pferderasse aus der Liste.",
        };
      }
    }

    // 2. Check birth date validity
    if (geburtsdatum) {
      const selectedDate = new Date(geburtsdatum);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check for future dates
      if (selectedDate > today) {
        return {
          isValid: false,
          message:
            "❌ Ungültiges Geburtsdatum!\n\nDas Geburtsdatum liegt in der Zukunft.\n\n✅ Bitte wählen Sie ein Datum aus der Vergangenheit.",
        };
      }

      // Check for too old dates (more than 30 years)
      const thirtyYearsAgo = new Date();
      thirtyYearsAgo.setFullYear(thirtyYearsAgo.getFullYear() - 30);

      if (selectedDate < thirtyYearsAgo) {
        return {
          isValid: false,
          message:
            "❌ Ungewöhnliches Geburtsdatum!\n\nDas Tier wäre über 30 Jahre alt.\n\n✅ Bitte überprüfen Sie das Geburtsdatum.",
        };
      }

      // Check for very young animals (less than 8 weeks old)
      const eightWeeksAgo = new Date();
      eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56); // 8 weeks = 56 days

      if (selectedDate > eightWeeksAgo) {
        return {
          isValid: false,
          message:
            "⚠️ Sehr junges Tier!\n\nDas Tier ist weniger als 8 Wochen alt.\n\n✅ Für sehr junge Tiere gelten besondere Bedingungen. Bitte kontaktieren Sie unseren Kundenservice.",
        };
      }
    }

    // 3. Check PLZ format
    if (plz && !isValidPLZ(plz)) {
      return {
        isValid: false,
        message:
          "❌ Ungültige Postleitzahl!\n\nBitte geben Sie eine gültige 5-stellige deutsche Postleitzahl ein.\n\n✅ Beispiel: 10115, 20095, 80331",
      };
    }

    return { isValid: true };
  }

  // User-friendly alert system
  function showUserAlert(message, type = "info") {
    // Create modal if it doesn't exist
    let modal = document.getElementById("userAlertModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "userAlertModal";
      modal.innerHTML = `
        <div class="alert-modal-overlay">
          <div class="alert-modal-content">
            <div class="alert-icon" id="alertIcon">⚠️</div>
            <div class="alert-message" id="alertMessage"></div>
            <div class="alert-buttons">
              <button class="alert-btn" onclick="closeUserAlert()">Verstanden</button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      // Add styles
      const style = document.createElement("style");
      style.textContent = `
        #userAlertModal {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 10000;
          backdrop-filter: blur(3px);
        }
        
        .alert-modal-overlay {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          padding: 20px;
        }
        
        .alert-modal-content {
          background: white;
          border-radius: 12px;
          padding: 30px;
          max-width: 400px;
          width: 100%;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          animation: alertSlideIn 0.3s ease-out;
        }
        
        @keyframes alertSlideIn {
          from {
            opacity: 0;
            transform: translateY(-30px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .alert-icon {
          font-size: 48px;
          margin-bottom: 20px;
        }
        
        .alert-message {
          font-size: 16px;
          line-height: 1.5;
          color: #333;
          margin-bottom: 25px;
          white-space: pre-line;
        }
        
        .alert-btn {
          background: #ff8c42;
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .alert-btn:hover {
          background: #ff7a28;
        }
        
        .alert-error .alert-icon { color: #dc3545; }
        .alert-warning .alert-icon { color: #ffc107; }
        .alert-success .alert-icon { color: #28a745; }
        .alert-info .alert-icon { color: #17a2b8; }
      `;
      document.head.appendChild(style);
    }

    // Set icon based on type
    const iconMap = {
      error: "❌",
      warning: "⚠️",
      success: "✅",
      info: "ℹ️",
    };

    document.getElementById("alertIcon").textContent = iconMap[type] || "ℹ️";
    document.getElementById("alertMessage").textContent = message;
    modal.className = `alert-${type}`;
    modal.style.display = "block";

    // Focus on button for keyboard accessibility
    setTimeout(() => {
      modal.querySelector(".alert-btn").focus();
    }, 100);
  }

  // Close alert modal
  window.closeUserAlert = function () {
    const modal = document.getElementById("userAlertModal");
    if (modal) {
      modal.style.display = "none";
    }
  };

  // Close modal on Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeUserAlert();
    }
  });

  // Enhanced form validation with error display
  function validateFormWithErrors() {
    let isValid = true;
    const missingFields = [];

    // Clear all previous errors
    clearAllErrors();

    // Check all required fields
    const requiredFields = [
      { id: "plz", name: "Postleitzahl" },
      { id: "tierKategorie", name: "Tierart" },
      { id: "geschlecht", name: "Geschlecht" },
      { id: "rasse", name: "Rasse" },
      { id: "geburtsdatum", name: "Geburtsdatum" },
    ];

    // Check regular input fields
    requiredFields.forEach((field) => {
      const element = document.getElementById(field.id);
      if (!element || !element.value) {
        missingFields.push(field.name);
        isValid = false;
        if (field.id === "plz") showError("plzError", "plz");
        if (field.id === "geburtsdatum")
          showError("geburtsdatumError", "geburtsdatum");
        if (field.id === "rasse") showError("rasseError", "rasse");
      }
    });

    // Check radio button fields
    const radioFields = [
      { name: "kastriert", label: "Kastration/Sterilisation" },
      { name: "haltung", label: "Haltungsart" },
      { name: "gesundheitsprobleme", label: "Gesundheitsprobleme" },
    ];

    radioFields.forEach((field) => {
      const checked = document.querySelector(
        `input[name="${field.name}"]:checked`
      );
      if (!checked) {
        missingFields.push(field.label);
        isValid = false;
        showError(`${field.name}Error`, field.name);
      }
    });

    // Show comprehensive error message if fields are missing
    if (!isValid) {
      showUserAlert(
        `❌ Pflichtfelder fehlen!\n\nBitte füllen Sie folgende Felder aus:\n\n• ${missingFields.join(
          "\n• "
        )}\n\n✅ Alle Felder sind für die Berechnung erforderlich.`,
        "error"
      );
      return false;
    }

    // Additional validation checks
    const validationResult = validateFormData();
    if (!validationResult.isValid) {
      showUserAlert(validationResult.message, "error");
      return false;
    }

    return true;
  }

  // Show error message
  function showError(errorId, fieldName) {
    const errorBox = document.getElementById(errorId);

    if (errorBox) {
      errorBox.classList.add("show");

      // Add field error styling
      const fieldElement =
        document.getElementById(fieldName) ||
        document.querySelector(`input[name="${fieldName}"]`) ||
        document.querySelector(`select[name="${fieldName}"]`);

      if (fieldElement) {
        const parentElement = fieldElement.closest(
          ".form-question, .date-input-container, .inline-form"
        );
        if (parentElement) {
          parentElement.classList.add("field-error");
        }
      }
    }
  }

  // Clear all errors
  function clearAllErrors() {
    const errorBoxes = document.querySelectorAll(".error-box");
    errorBoxes.forEach((box) => {
      box.classList.remove("show");
    });

    const fieldErrors = document.querySelectorAll(".field-error");
    fieldErrors.forEach((field) => {
      field.classList.remove("field-error");
    });
  }

  // Simple form validation (for submit button state)
  function validateForm() {
    const geburtsdatum = document.getElementById("geburtsdatum");
    const kastriert = document.querySelector('input[name="kastriert"]:checked');
    const haltung = document.querySelector('input[name="haltung"]:checked');
    const gesundheitsprobleme = document.querySelector(
      'input[name="gesundheitsprobleme"]:checked'
    );

    return (
      geburtsdatum &&
      geburtsdatum.value &&
      kastriert &&
      haltung &&
      gesundheitsprobleme
    );
  }

  // Enable/disable submit button based on form completion
  function updateSubmitButton() {
    if (submitButton) {
      // Don't disable the button - let validation happen on submit
      // submitButton.disabled = !validateForm();
    }
  }

  // Add change listeners to form fields
  if (form) {
    const formFields = form.querySelectorAll("input, select");
    formFields.forEach((field) => {
      field.addEventListener("change", updateSubmitButton);
      field.addEventListener("input", updateSubmitButton);

      // Clear errors when user interacts with fields
      field.addEventListener("focus", function () {
        clearFieldError(this);
      });

      field.addEventListener("change", function () {
        clearFieldError(this);
        // Real-time validation for birth date
        if (this.id === "geburtsdatum" && this.value) {
          validateBirthDateRealTime(this);
        }
        // Update German date display
        if (this.id === "geburtsdatum") {
          validateDateInput(this);
          updateGermanDateDisplay();
        }
      });

      field.addEventListener("input", function () {
        clearFieldError(this);
        // Real-time validation for birth date
        if (this.id === "geburtsdatum" && this.value) {
          validateBirthDateRealTime(this);
        }
        // Real-time validation for PLZ
        if (this.id === "plz" && this.value) {
          validatePLZRealTime(this);
        }
        // Update German date display
        if (this.id === "geburtsdatum") {
          validateDateInput(this);
          updateGermanDateDisplay();
        }
      });
    });
  }

  // PLZ validation function
  function isValidPLZ(plz) {
    // German postal codes are 5 digits
    const plzPattern = /^\d{5}$/;
    return plzPattern.test(plz);
  }

  // Real-time PLZ validation
  function validatePLZRealTime(plzField) {
    // Clear any existing PLZ errors first
    const plzError = document.getElementById("plzError");
    if (plzError) plzError.classList.remove("show");

    // Remove field error styling
    const parentElement = plzField.closest(
      ".form-question, .date-input-container, .inline-form"
    );
    if (parentElement) {
      parentElement.classList.remove("field-error");
    }

    // Only show error if PLZ is invalid (and has some length to avoid showing error while typing)
    if (plzField.value.length >= 5 && !isValidPLZ(plzField.value)) {
      showError("plzError", "plz");
    }
  }

  // Real-time birth date validation
  function validateBirthDateRealTime(dateField) {
    // Parse German date format DD.MM.YYYY
    const value = dateField.value;
    if (!value) return; // If empty, let the required validation handle it

    const germanDateRegex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
    const match = value.match(germanDateRegex);

    if (!match) {
      // Invalid format
      showError("geburtsdatumError", "geburtsdatum");
      return;
    }

    const [, day, month, year] = match;
    const selectedDate = new Date(year, month - 1, day);

    // Check if the date is valid (e.g., not 32.01.2025)
    if (
      selectedDate.getDate() != day ||
      selectedDate.getMonth() != month - 1 ||
      selectedDate.getFullYear() != year
    ) {
      showError("geburtsdatumError", "geburtsdatum");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of today

    // Clear any existing birth date errors first
    const geburtsdatumError = document.getElementById("geburtsdatumError");
    const geburtsdatumFutureError = document.getElementById(
      "geburtsdatumFutureError"
    );
    if (geburtsdatumError) geburtsdatumError.classList.remove("show");
    if (geburtsdatumFutureError)
      geburtsdatumFutureError.classList.remove("show");

    // Remove field error styling
    const parentElement = dateField.closest(
      ".form-question, .date-input-container, .inline-form"
    );
    if (parentElement) {
      parentElement.classList.remove("field-error");
    }

    // Only show error if date is in the future
    if (selectedDate > today) {
      showError("geburtsdatumFutureError", "geburtsdatum");
    }
  }

  // Clear error for specific field when user interacts with it
  function clearFieldError(field) {
    const fieldName = field.name || field.id;
    let errorId = null;

    // Map field names to error IDs
    switch (fieldName) {
      case "plz":
        errorId = "plzError";
        break;
      case "geburtsdatum":
        // Clear both birth date errors
        const geburtsdatumError = document.getElementById("geburtsdatumError");
        const geburtsdatumFutureError = document.getElementById(
          "geburtsdatumFutureError"
        );
        if (geburtsdatumError) geburtsdatumError.classList.remove("show");
        if (geburtsdatumFutureError)
          geburtsdatumFutureError.classList.remove("show");
        break;
      case "kastriert":
        errorId = "kastriertError";
        break;
      case "haltung":
        errorId = "haltungError";
        break;
      case "gesundheitsprobleme":
        errorId = "gesundheitsproblemeError";
        break;
      case "rasse":
        errorId = "rasseError";
        break;
    }

    // Hide the specific error
    if (errorId) {
      const errorBox = document.getElementById(errorId);
      if (errorBox) {
        errorBox.classList.remove("show");
      }

      // Remove field error styling from parent element
      const parentElement = field.closest(
        ".form-question, .date-input-container, .inline-form"
      );
      if (parentElement) {
        parentElement.classList.remove("field-error");
      }
    }
  }

  // Number input +/- button functionality
  const increaseBtn = document.getElementById("increaseBtn");
  const decreaseBtn = document.getElementById("decreaseBtn");
  const numberInput = document.getElementById("anzahl_operationen");

  if (increaseBtn && decreaseBtn && numberInput) {
    increaseBtn.addEventListener("click", function () {
      let currentValue = parseInt(numberInput.value) || 1;
      numberInput.value = currentValue + 1;
      updateSubmitButton();
    });

    decreaseBtn.addEventListener("click", function () {
      let currentValue = parseInt(numberInput.value) || 1;
      if (currentValue > 1) {
        numberInput.value = currentValue - 1;
        updateSubmitButton();
      }
    });

    // Ensure minimum value is 1
    numberInput.addEventListener("input", function () {
      if (this.value < 1) {
        this.value = 1;
      }
      updateSubmitButton();
    });
  }

  function initializeAppScreen() {
    const params = new URLSearchParams(window.location.search);
    const screenParam = (params.get("screen") || "").toLowerCase();
    const fromParam = (params.get("from") || "").toLowerCase();

    const screenMap = {
      form: "formScreen",
      pricing: "pricingScreen",
      success: "successScreen",
    };

    let targetScreen = "formScreen";

    if (fromParam === "form") {
      targetScreen = "pricingScreen";
    } else if (screenParam && screenMap[screenParam]) {
      targetScreen = screenMap[screenParam];
    }

    if (!document.getElementById(targetScreen)) {
      targetScreen = "formScreen";
    }

    showScreen(targetScreen);
    scheduleIframeHeightUpdate();
  }

  // Initial button state
  updateSubmitButton();

  // Initialize progress and date display on page load
  checkFormCompletion();
  updateGermanDateDisplay();
  updateStepThreeAvailability();
  initializeAppScreen();
});

let selectedPlan = null;
let addonSelected = false;
let addonSection = null;
let calendlyInitialized = false;

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

const PLAN_KEY_ORDER = ["basis", "smart", "komfort"];

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

  const products = result?.data?.data?.productResponse?.products;
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

function detectPlanKey(product) {
  const candidates = [
    product?.title,
    product?.ident,
    product?.productName,
    product?.productCode,
  ]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());

  for (const candidate of candidates) {
    if (candidate.includes("komfort") || candidate.includes("premium")) {
      return "komfort";
    }
    if (candidate.includes("smart") || candidate.includes("plus")) {
      return "smart";
    }
    if (candidate.includes("basis") || candidate.includes("basic") || candidate.includes("start")) {
      return "basis";
    }
  }

  return null;
}

function normalizePricingProducts(products) {
  const normalized = {};
  const assignedKeys = new Set();

  if (!Array.isArray(products)) {
    return normalized;
  }

  products.forEach((product, index) => {
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
              price:
                typeof configEntry?.price === "number"
                  ? configEntry.price
                  : Number(configEntry?.price),
              disabled:
                Boolean(configEntry?.disabled) || configEntry?.price === -1,
              displayValue: configEntry?.displayValue || "",
              displayValueWithPrice:
                configEntry?.displayValueWithPrice || "",
            };
          });
        });
      });
    }

    const entry = {
      basePrice:
        typeof product?.priceAmount === "number"
          ? product.priceAmount
          : Number(product?.priceAmount),
      priceUnit: product?.priceUnit || null,
      addonOptions,
      raw: product,
    };

    let planKey = detectPlanKey(product);
    if (planKey && assignedKeys.has(planKey)) {
      planKey = null;
    }

    if (!planKey) {
      planKey = PLAN_KEY_ORDER.find((candidate) => !assignedKeys.has(candidate));
    }

    if (!planKey) {
      planKey = `plan_${index}`;
    }

    assignedKeys.add(planKey);
    normalized[planKey] = entry;
  });

  return normalized;
}

function resolvePlanKey(preferredKey) {
  if (!latestPricingData?.products) {
    return null;
  }

  if (preferredKey && latestPricingData.products[preferredKey]) {
    return preferredKey;
  }

  for (const candidate of PLAN_KEY_ORDER) {
    if (latestPricingData.products[candidate]) {
      return candidate;
    }
  }

  const fallbackKey = Object.keys(latestPricingData.products)[0];
  return fallbackKey || null;
}

function setPriceCardsLoading(isLoading) {
  const selectButtons = document.querySelectorAll(".table-select-btn");
  selectButtons.forEach((btn) => {
    btn.classList.toggle("loading", isLoading);
    btn.disabled = isLoading;
  });

  if (isLoading) {
    document.querySelectorAll("[data-plan-amount]").forEach((element) => {
      element.textContent = "--";
    });

    document.querySelectorAll("[data-plan-period]").forEach((element) => {
      element.textContent = "wird berechnet …";
    });
  } else {
    selectButtons.forEach((btn) => {
      btn.disabled = false;
    });
  }
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

  document.querySelectorAll("[data-plan-amount]").forEach((element) => {
    const planKey = element.getAttribute("data-plan-amount");
    const product = normalized[planKey];
    element.textContent = product && Number.isFinite(product.basePrice)
      ? formatCurrency(product.basePrice)
      : "--";
  });

  const periodText = `pro ${getBillingPeriodText(billingValue)}`;
  document.querySelectorAll("[data-plan-period]").forEach((element) => {
    element.textContent = periodText;
  });

  setPriceCardsLoading(false);

  if (selectedPlan) {
    showSelectedPlan();
  }

  updateAddonPricing();
}

document.addEventListener("DOMContentLoaded", function () {
  initializePricingModule();
  initializeSuccessModule();
});

function updateAddonSelectionUI() {
  const addonSelectBtn = document.querySelector(".addon-select-btn");
  const addonSummary = document.getElementById("addonSummary");
  const addonPlaceholder = document.getElementById("addonPlaceholder");
  const removeBtn = document.querySelector(".remove-addon-btn");

  if (addonSelectBtn) {
    if (addonSelected) {
      addonSelectBtn.textContent = "Ausgewählt ✓";
      addonSelectBtn.style.backgroundColor = "#28a745";
      addonSelectBtn.disabled = true;
    } else {
      addonSelectBtn.textContent = "Auswählen";
      addonSelectBtn.style.backgroundColor = "";
      addonSelectBtn.disabled = false;
    }
  }

  if (addonSummary) {
    addonSummary.hidden = !addonSelected;
  }

  if (addonPlaceholder) {
    addonPlaceholder.hidden = addonSelected;
  }

  if (removeBtn) {
    removeBtn.style.display = addonSelected ? "inline-flex" : "none";
  }
}

function getSelectedAddonPrice() {
  const selectedOption = document.querySelector(
    'input[name="addonCoverage"]:checked'
  );
  if (!selectedOption || !latestPricingData?.products) {
    return 0;
  }

  const planKey = resolvePlanKey(selectedPlan);
  if (!planKey) {
    return 0;
  }

  const product = latestPricingData.products[planKey];
  const addonData = product?.addonOptions?.[selectedOption.value];

  if (!addonData || addonData.disabled || !Number.isFinite(addonData.price)) {
    return 0;
  }

  return addonData.price;
}

function getDeductibleDescription(value) {
  switch (value) {
    case "no":
      return "Keine Selbstbeteiligung";
    case "10":
      return "10 % Selbstbeteiligung";
    case "20":
      return "20 % Selbstbeteiligung";
    default:
      return `${value}% Selbstbeteiligung`;
  }
}

function getPaymentFrequencyDescription(value) {
  switch (value) {
    case "monthly":
      return "monatliche Zahlung";
    case "quarterly":
      return "vierteljährliche Zahlung";
    case "semi-annually":
      return "halbjährliche Zahlung";
    case "yearly":
      return "jährliche Zahlung";
    default:
      return "monatliche Zahlung";
  }
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

function initializePricingModule() {
  const pricingScreen = document.getElementById("pricingScreen");
  if (!pricingScreen) {
    return;
  }

  setupPricingEventListeners();
  setPriceCardsLoading(true);
  updatePrices();
  disableContinueButton();

  addonSection = document.getElementById("addonSection");
  updateConfirmationSection();

  const interactiveFields = document.querySelectorAll(
    "main input, main select, main textarea, main button"
  );
  interactiveFields.forEach((element) => {
    element.addEventListener("input", scheduleIframeHeightUpdate);
    element.addEventListener("change", scheduleIframeHeightUpdate);
    element.addEventListener("click", scheduleIframeHeightUpdate);
  });
}

function initializeSuccessModule() {
  loadSelectionData();
}

function setupPricingEventListeners() {
  const selectButtons = document.querySelectorAll(
    ".table-select-btn"
  );

  selectButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const plan = this.getAttribute("data-plan");
      selectPlan(plan);
    });
  });

  const deductibleSelect = document.getElementById("deductible");
  const paymentSelect = document.getElementById("paymentFrequency");

  if (deductibleSelect) {
    deductibleSelect.addEventListener("change", updatePrices);
  }

  if (paymentSelect) {
    paymentSelect.addEventListener("change", updatePrices);
  }

  const addonSelectBtn = document.querySelector(".addon-select-btn");
  if (addonSelectBtn) {
    addonSelectBtn.addEventListener("click", function (e) {
      e.preventDefault();
      selectAddon();
    });
  }

  document.addEventListener("click", function (e) {
    if (e.target.closest(".remove-addon-btn")) {
      e.preventDefault();
      removeAddon();
    }
  });

  const addonRadios = document.querySelectorAll('input[name="addonCoverage"]');
  addonRadios.forEach((radio) => {
    radio.addEventListener("change", updateAddonPricing);
  });

  const continueBtn = document.getElementById("continueBtn");
  if (continueBtn) {
    continueBtn.addEventListener("click", function (e) {
      e.preventDefault();

      if (!selectedPlan) {
        alert("Bitte wählen Sie zuerst einen Tarif aus.");
        return;
      }

      const contactForm = document.getElementById("customerContactForm");
      if (contactForm && contactForm.offsetParent !== null) {
        if (validateCustomerForm()) {
          storeCustomerData();
          continueToApplication();
        }
      } else {
        continueToApplication();
      }
    });
  }
}

function selectPlan(planName) {
  document.querySelectorAll(".table-select-btn").forEach((btn) => {
    btn.classList.remove("selected");
  });

  const planButtons = document.querySelectorAll(
    `[data-plan="${planName}"].table-select-btn`
  );
  planButtons.forEach((button) => {
    button.classList.add("selected");
  });

  document.querySelectorAll(".mobile-plan-card").forEach((card) => {
    card.classList.remove("selected");
  });

  const mobileCard = document.querySelector(
    `.mobile-plan-card[data-plan="${planName}"]`
  );
  if (mobileCard) {
    mobileCard.classList.add("selected");
  }

  selectedPlan = planName;
  highlightTableColumn(planName);
  showSelectedPlan();
  showAddonSection();
  updateAddonPricing();
  enableContinueButton();
  scheduleIframeHeightUpdate();
}

function highlightTableColumn(planName) {
  clearTableColumnHighlight();

  const columnMap = {
    basis: 2,
    smart: 3,
    komfort: 4,
  };

  const columnIndex = columnMap[planName];
  if (!columnIndex) return;

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

function resetPricingView() {
  selectedPlan = null;
  addonSelected = false;

  document.querySelectorAll(".table-select-btn").forEach((btn) => {
    btn.classList.remove("selected");
  });

  document.querySelectorAll(".mobile-plan-card").forEach((card) => {
    card.classList.remove("selected");
  });

  clearTableColumnHighlight();
  hideSelectedPlan();
  disableContinueButton();

  const addonCoverageDefault = document.querySelector(
    'input[name="addonCoverage"][value="2000"]'
  );
  if (addonCoverageDefault) {
    addonCoverageDefault.checked = true;
  }

  updateConfirmationSection();
}

async function updatePrices() {
  const deductibleSelect = document.getElementById("deductible");
  const paymentSelect = document.getElementById("paymentFrequency");

  const deductible = deductibleSelect ? deductibleSelect.value : "20";
  const billing = paymentSelect ? paymentSelect.value : "monthly";

  const retention = RETENTION_VALUE_MAP[deductible] ?? 20;
  const scheduleCode = PAYMENT_SCHEDULE_MAP[billing] ?? "M";
  const cacheKey = getPricingCacheKey(retention, scheduleCode);

  latestPricingData = null;
  setPriceCardsLoading(true);
  updateAddonPricing();

  const cachedPricing = readPricingFromStorage(cacheKey);
  if (cachedPricing) {
    applyPricingData(cachedPricing, billing, retention, scheduleCode);
    scheduleIframeHeightUpdate();
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
      showApiError(
        "Die dynamische Tarifberechnung ist derzeit nicht verfügbar. Bitte versuchen Sie es in Kürze erneut."
      );
    }
  } finally {
    scheduleIframeHeightUpdate();
  }
}

function getCurrentPrice(plan) {
  if (!latestPricingData?.products) {
    return NaN;
  }

  const resolvedPlanKey = resolvePlanKey(plan);
  if (!resolvedPlanKey) {
    return NaN;
  }

  const product = latestPricingData.products[resolvedPlanKey];
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

function selectAddon() {
  addonSelected = true;
  updateAddonSelectionUI();
  updateConfirmationSection();

  const confirmationSection = document.getElementById("addonConfirmation");
  if (confirmationSection) {
    confirmationSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function removeAddon() {
  addonSelected = false;
  updateAddonSelectionUI();
  updateConfirmationSection();
}

function updateAddonPricing() {
  const addonPriceElement = document.querySelector(".addon-price-amount");
  const addonPricePeriod = document.querySelector(".addon-price-period");
  const billingValue = document.getElementById("paymentFrequency")?.value || latestPricingData?.billing || "monthly";

  if (!latestPricingData?.products) {
    if (addonPriceElement) {
      addonPriceElement.textContent = "--";
    }
    if (addonPricePeriod) {
      addonPricePeriod.textContent = "wird berechnet …";
    }
    updateConfirmationSection();
    return;
  }

  if (addonPricePeriod) {
    addonPricePeriod.textContent = `pro ${getBillingPeriodText(billingValue)}`;
  }

  const activePlanKey = resolvePlanKey(selectedPlan);
  const product = activePlanKey ? latestPricingData.products[activePlanKey] : null;
  if (!product) {
    if (addonPriceElement) {
      addonPriceElement.textContent = "--";
    }
    updateConfirmationSection();
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
      const baseText = config.displayValueWithPrice || textSpan.textContent.split("(")[0].trim();
      textSpan.textContent = `${baseText}`;
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
}

function updateConfirmationSection() {
  const planNames = {
    basis: "Basis",
    smart: "Smart",
    komfort: "Komfort",
  };

  const confirmationHeading = document.getElementById("confirmationHeading");
  const tariffTitle = document.getElementById("selectedTariffTitle");
  const tariffPrice = document.getElementById("selectedTariffPrice");
  const tariffDetails = document.getElementById("selectedTariffDetails");
  const addonOption = document.getElementById("addonSelectedOption");
  const addonSelectedPrice = document.getElementById("addonSelectedPrice");
  const totalPriceElement = document.getElementById("totalPrice");
  const deductibleSelect = document.getElementById("deductible");
  const paymentSelect = document.getElementById("paymentFrequency");

  const deductibleValue = deductibleSelect ? deductibleSelect.value : "20";
  const paymentValue = paymentSelect ? paymentSelect.value : "monthly";
  const selectedAddonOption = document.querySelector(
    'input[name="addonCoverage"]:checked'
  );

  let addonPriceValue = addonSelected ? getSelectedAddonPrice() : 0;
  let addonText = "Kein Zusatzbaustein ausgewählt.";

  if (addonSelected) {
    if (selectedAddonOption && selectedAddonOption.value === "5000") {
      addonText =
        "Bis 5.000 € Heilbehandlungsschutz + 100 € Vorsorgezuschuss";
    } else {
      addonText =
        "Bis 2.000 € Heilbehandlungsschutz + 50 € Vorsorgezuschuss";
    }
  }

  if (!selectedPlan) {
    if (confirmationHeading) {
      confirmationHeading.textContent = "Wählen Sie Ihren Tarif";
    }
    if (tariffTitle) {
      tariffTitle.textContent = "Noch kein Tarif ausgewählt";
    }
    if (tariffDetails) {
      tariffDetails.textContent =
        "Bitte wählen Sie einen Tarif, um alle Details zu sehen.";
    }
    if (tariffPrice) {
      tariffPrice.textContent = "--";
    }
    if (addonOption) {
      addonOption.textContent = addonText;
    }
    if (addonSelectedPrice) {
      addonSelectedPrice.textContent = `${formatCurrency(addonPriceValue)} €`;
    }
    if (totalPriceElement) {
      totalPriceElement.textContent = "--";
    }
    updateAddonSelectionUI();
    scheduleIframeHeightUpdate();
    return;
  }

  const planName = planNames[selectedPlan] || selectedPlan;
  const planPriceValue = getCurrentPrice(selectedPlan || "komfort");

  if (confirmationHeading) {
    confirmationHeading.textContent =
      "Glückwunsch, Sie haben Ihr passendes Produkt gefunden";
  }

  if (tariffTitle) {
    tariffTitle.textContent = `Ihr Tarif: ${planName}`;
  }

  if (tariffDetails) {
    tariffDetails.textContent = `${getDeductibleDescription(
      deductibleValue
    )} · ${getPaymentFrequencyDescription(paymentValue)}`;
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
    totalPriceElement.textContent = Number.isFinite(planPriceValue)
      ? `${formatCurrency(planPriceValue + addonPriceValue)} €`
      : "--";
  }

  updateAddonSelectionUI();
  scheduleIframeHeightUpdate();
}

function validateCustomerForm() {
  const name = document.getElementById("customerName");
  const email = document.getElementById("customerEmail");
  const phone = document.getElementById("customerPhone");
  const privacy = document.getElementById("privacyConsent");

  let isValid = true;
  let emailInvalid = false;

  [name, email, phone].forEach((field) => {
    if (field) {
      field.classList.remove("error");
    }
  });

  if (!name || !name.value.trim()) {
    if (name) name.classList.add("error");
    isValid = false;
  }

  const emailValue = email?.value.trim() || "";
  if (emailValue && !isValidEmail(emailValue)) {
    if (email) email.classList.add("error");
    isValid = false;
    emailInvalid = true;
  }

  if (!phone || !phone.value.trim()) {
    if (phone) phone.classList.add("error");
    isValid = false;
  }

  if (!privacy || !privacy.checked) {
    if (privacy) privacy.classList.add("error");
    isValid = false;
  }

  if (!isValid) {
    if (emailInvalid) {
      alert(
        "Bitte geben Sie eine gültige E-Mail-Adresse ein oder lassen Sie das Feld leer."
      );
    } else {
      alert(
        "Bitte füllen Sie alle Pflichtfelder aus und stimmen Sie der Datenverarbeitung zu."
      );
    }
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

  try {
    localStorage.setItem("customerContactData", JSON.stringify(customerData));
  } catch (error) {
    console.warn("Konnte Kundendaten nicht speichern", error);
  }
}

function continueToApplication() {
  const addonOptionValue = document.querySelector(
    'input[name="addonCoverage"]:checked'
  )?.value;

  const selectionData = {
    selectedPlan: selectedPlan,
    planPrice: getCurrentPrice(selectedPlan || "komfort"),
    addonSelected,
    addonOption: addonSelected ? addonOptionValue || "2000" : null,
    timestamp: new Date().toISOString(),
  };

  const selectedPlanData = {
    plan: selectedPlan,
    deductible: document.getElementById("deductible")?.value || "20",
    paymentFrequency:
      document.getElementById("paymentFrequency")?.value || "monthly",
    price: getCurrentPrice(selectedPlan || "komfort"),
  };

  try {
    localStorage.setItem("insuranceSelection", JSON.stringify(selectionData));
    localStorage.setItem("selectedPlanData", JSON.stringify(selectedPlanData));
  } catch (error) {
    console.warn("Konnte Auswahl nicht speichern", error);
  }

  showScreen("successScreen");
}

function loadSelectionData() {
  let selectionData = {};

  try {
    selectionData = JSON.parse(
      localStorage.getItem("insuranceSelection") || "{}"
    );
  } catch (error) {
    console.warn("Konnte Auswahl nicht laden", error);
  }

  const selectedPlanElement = document.getElementById("selected-plan");
  if (selectedPlanElement) {
    selectedPlanElement.textContent = getPlanName(
      selectionData.selectedPlan || selectedPlan || "smart"
    );
  }

  const monthlyPremium = document.getElementById("monthly-premium");
  if (monthlyPremium) {
    let totalPrice = parseFloat(selectionData.planPrice || "0");
    if (selectionData.addonSelected) {
      const addonPrice = selectionData.addonOption === "5000" ? 33.33 : 23.38;
      totalPrice += addonPrice;
    }
    if (!Number.isFinite(totalPrice) || totalPrice <= 0) {
      totalPrice = parseFloat(getCurrentPrice(selectedPlan || "smart"));
    }
    monthlyPremium.textContent = totalPrice
      ? `${totalPrice.toFixed(2)} €`
      : "--";
  }
}

function initializeCalendly() {
  const calendlyContainer = document.getElementById("calendly-embed");
  if (!calendlyContainer) {
    return;
  }

  if (typeof Calendly === "undefined" || !Calendly.initInlineWidget) {
    setTimeout(initializeCalendly, 300);
    return;
  }

  const customerData = (() => {
    try {
      return JSON.parse(localStorage.getItem("customerContactData") || "{}");
    } catch (error) {
      console.warn("Konnte Kundendaten nicht laden", error);
      return {};
    }
  })();

  const insuranceSelection = (() => {
    try {
      return JSON.parse(localStorage.getItem("insuranceSelection") || "{}");
    } catch (error) {
      console.warn("Konnte Auswahl für Calendly nicht laden", error);
      return {};
    }
  })();

  calendlyContainer.innerHTML = "";

  Calendly.initInlineWidget({
    url: "https://calendly.com/kaikossendey/rueckruf",
    parentElement: calendlyContainer,
    prefill: {
      name: customerData.name || "",
      email: customerData.email || "",
      customAnswers: {
        a1: customerData.phone || "",
        a2: getPlanName(insuranceSelection.selectedPlan || selectedPlan || "smart"),
      },
    },
    utm: {
      utmCampaign: "Pet Insurance",
      utmSource: "Website",
      utmMedium: "Form",
    },
  });

  calendlyInitialized = true;
  scheduleIframeHeightUpdate();
}

function getPlanName(plan) {
  switch (plan) {
    case "basis":
      return "Basis Tarif";
    case "smart":
      return "Smart Tarif";
    case "komfort":
      return "Komfort Tarif";
    default:
      return "Smart Tarif";
  }
}

function goBack() {
  goBackToForm();
}
