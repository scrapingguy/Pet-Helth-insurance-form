// Comprehensive Pet Health Insurance Form JavaScript
// Consolidated version for openpage.io

document.addEventListener("DOMContentLoaded", function () {
  // Application state management
  const AppState = {
    currentStep: 1,
    formData: {
      // Step 1 - Pet Information
      plz: '',
      city: '',
      tierKategorie: 'katze',
      geschlecht: 'maennlich',
      rasse: '',
      geburtsdatum: '',
      kastriert: '',
      haltung: '',
      gesundheitsprobleme: '',
      behandlungen: [],
      anzahl_operationen: 1,
      
      // Step 2 - Plan Selection
      selectedPlan: '',
      deductible: '20',
      paymentFrequency: 'monthly',
      
      // Step 3 - Personal Information
      anrede: '',
      titel: '',
      vorname: '',
      nachname: '',
      geburtsdatum_person: '',
      strasse: '',
      plz_person: '',
      ort: '',
      telefon: '',
      email: '',
      iban: '',
      kontoinhaber: '',
      datenschutz: false,
      agb: false,
      sepa_mandat: false
    }
  };

  // German postal code to city mapping (expanded dataset)
  const plzCityMap = {
    // Major cities
    "01067": "Dresden", "10115": "Berlin", "20095": "Hamburg", "80331": "München",
    "50667": "Köln", "60311": "Frankfurt am Main", "70173": "Stuttgart", 
    "40213": "Düsseldorf", "30159": "Hannover", "90403": "Nürnberg", "04109": "Leipzig",
    
    // More cities for demo
    "28195": "Bremen", "24103": "Kiel", "39104": "Magdeburg", "99084": "Erfurt",
    "55116": "Mainz", "66111": "Saarbrücken", "65185": "Wiesbaden", "19055": "Schwerin",
    "14467": "Potsdam", "01097": "Dresden", "10178": "Berlin", "20146": "Hamburg",
    "80539": "München", "50679": "Köln", "60329": "Frankfurt am Main"
  };

  // Breed data by animal type
  const breedData = {
    katze: [
      "Abessiner", "American Curl", "American Shorthair", "Bengalkatze", "Birma",
      "Bombay", "Britisch Kurzhaar", "Britisch Langhaar", "Burma", "Chartreux",
      "Devon Rex", "Europäisch Kurzhaar", "Exotic Shorthair", "Heilige Birma",
      "Maine Coon", "Norwegische Waldkatze", "Perser", "Ragdoll", "Russian Blue",
      "Savannah", "Siamese", "Sphynx", "Turkish Angora", "Sonstige"
    ],
    hund: [
      "Afghanischer Windhund", "Airedale Terrier", "Akita Inu", "Australian Shepherd",
      "Beagle", "Bernhardiner", "Border Collie", "Boxer", "Bulldogge",
      "Chihuahua", "Cocker Spaniel", "Dackel", "Dalmatiner", "Deutsche Dogge",
      "Deutscher Schäferhund", "Golden Retriever", "Husky", "Jack Russell Terrier",
      "Labrador", "Mops", "Pudel", "Rottweiler", "Shih Tzu", "Yorkshire Terrier", "Sonstige"
    ],
    pferd: [
      "Araber", "Friese", "Haflinger", "Hannoveraner", "Holsteiner",
      "Isländer", "Oldenburger", "Quarter Horse", "Shetlandpony",
      "Tinker", "Trakehner", "Warmblut", "Sonstige"
    ]
  };

  // Plan pricing data
  const planPricing = {
    basis: { monthly: 7.33, quarterly: 21.99, semiAnnually: 43.98, yearly: 87.96 },
    smart: { monthly: 11.05, quarterly: 33.15, semiAnnually: 66.30, yearly: 132.60 },
    komfort: { monthly: 18.36, quarterly: 55.08, semiAnnually: 110.16, yearly: 220.32 }
  };

  // Navigation functions
  window.goToStep = function(step) {
    // Hide current step
    document.querySelectorAll('.app-section').forEach(section => {
      section.style.display = 'none';
    });
    
    // Show target step
    document.getElementById(`step${step}`).style.display = 'block';
    
    // Update progress bar
    updateProgressBar(step);
    
    AppState.currentStep = step;
    
    // Load data for step
    if (step === 3) {
      populateOrderSummary();
    } else if (step === 4) {
      populateSuccessPage();
    }
  };

  function updateProgressBar(step) {
    document.querySelectorAll('.progress-step').forEach((progressStep, index) => {
      const stepNumber = index + 1;
      progressStep.classList.remove('active', 'completed');
      
      if (stepNumber < step) {
        progressStep.classList.add('completed');
      } else if (stepNumber === step) {
        progressStep.classList.add('active');
      }
    });
    
    document.querySelectorAll('.progress-line').forEach((line, index) => {
      line.classList.remove('completed');
      if (index + 1 < step) {
        line.classList.add('completed');
      }
    });
  }

  // Step 1: Pet Information Form Logic
  function initializeStep1() {
    const form = document.getElementById("insuranceForm");
    const plzInput = document.getElementById("plz");
    const tierKategorieSelect = document.getElementById("tierKategorie");
    const rasseSelect = document.getElementById("rasse");
    const gesundheitsproblemeRadios = document.querySelectorAll('input[name="gesundheitsprobleme"]');
    const behandlungsFrage = document.getElementById("behandlungsFrage");
    const operationAnzahl = document.getElementById("operationAnzahl");

    // PLZ validation and city display
    if (plzInput) {
      plzInput.addEventListener("input", function() {
        const plz = this.value;
        const cityDisplay = document.getElementById("cityName");
        
        clearFieldError(this, "plz");
        
        if (plz.length === 5 && plzCityMap[plz]) {
          AppState.formData.plz = plz;
          AppState.formData.city = plzCityMap[plz];
          cityDisplay.textContent = plzCityMap[plz];
          cityDisplay.classList.add("show");
        } else {
          cityDisplay.textContent = "";
          cityDisplay.classList.remove("show");
        }
        
        updateSubmitButton();
      });
    }

    // Animal category change
    if (tierKategorieSelect) {
      tierKategorieSelect.addEventListener("change", function() {
        AppState.formData.tierKategorie = this.value;
        updateBreedOptions();
        updateHousingQuestionText();
        updateSubmitButton();
      });
    }

    // Breed selection
    if (rasseSelect) {
      rasseSelect.addEventListener("change", function() {
        AppState.formData.rasse = this.value;
        updateSubmitButton();
      });
    }

    // Birth date handling
    const geburtsdatumInput = document.getElementById("geburtsdatum");
    if (geburtsdatumInput) {
      geburtsdatumInput.addEventListener("change", function() {
        AppState.formData.geburtsdatum = this.value;
        updateGermanDateDisplay();
        validateBirthDate();
        updateSubmitButton();
      });
    }

    // Health problems handling
    gesundheitsproblemeRadios.forEach(radio => {
      radio.addEventListener("change", function() {
        AppState.formData.gesundheitsprobleme = this.value;
        
        if (this.value === "ja") {
          behandlungsFrage.style.display = "block";
        } else {
          behandlungsFrage.style.display = "none";
          // Reset treatment selections
          document.querySelectorAll('input[name="neue_behandlung"]').forEach(cb => {
            cb.checked = false;
          });
          operationAnzahl.style.display = "none";
        }
        
        clearFieldError(this, "gesundheitsprobleme");
        updateSubmitButton();
      });
    });

    // Treatment checkboxes
    const keinBesuchCheckbox = document.getElementById("neue_kein_besuch");
    const heilbehandlungCheckbox = document.getElementById("neue_heilbehandlung");
    const operationCheckbox = document.getElementById("neue_operation");

    if (operationCheckbox) {
      operationCheckbox.addEventListener("change", function() {
        if (this.checked) {
          operationAnzahl.style.display = "block";
        } else {
          operationAnzahl.style.display = "none";
        }
        updateTreatmentData();
        updateSubmitButton();
      });
    }

    [keinBesuchCheckbox, heilbehandlungCheckbox].forEach(checkbox => {
      if (checkbox) {
        checkbox.addEventListener("change", function() {
          updateTreatmentData();
          updateSubmitButton();
        });
      }
    });

    // Number input controls
    const increaseBtn = document.getElementById("increaseBtn");
    const decreaseBtn = document.getElementById("decreaseBtn");
    const numberInput = document.getElementById("anzahl_operationen");

    if (increaseBtn && decreaseBtn && numberInput) {
      increaseBtn.addEventListener("click", function() {
        let currentValue = parseInt(numberInput.value) || 1;
        numberInput.value = currentValue + 1;
        AppState.formData.anzahl_operationen = numberInput.value;
        updateSubmitButton();
      });

      decreaseBtn.addEventListener("click", function() {
        let currentValue = parseInt(numberInput.value) || 1;
        if (currentValue > 1) {
          numberInput.value = currentValue - 1;
          AppState.formData.anzahl_operationen = numberInput.value;
          updateSubmitButton();
        }
      });
    }

    // Radio button handlers
    document.querySelectorAll('input[name="kastriert"]').forEach(radio => {
      radio.addEventListener("change", function() {
        AppState.formData.kastriert = this.value;
        clearFieldError(this, "kastriert");
        updateSubmitButton();
      });
    });

    document.querySelectorAll('input[name="haltung"]').forEach(radio => {
      radio.addEventListener("change", function() {
        AppState.formData.haltung = this.value;
        clearFieldError(this, "haltung");
        updateSubmitButton();
      });
    });

    // Form submission
    if (form) {
      form.addEventListener("submit", function(e) {
        e.preventDefault();
        if (validateStep1()) {
          goToStep(2);
        }
      });
    }

    // Initialize breed options and UI
    updateBreedOptions();
    updateHousingQuestionText();
    updateSubmitButton();
  }

  // Step 2: Plan Selection Logic
  function initializeStep2() {
    const deductibleSelect = document.getElementById("deductible");
    const paymentFrequencySelect = document.getElementById("paymentFrequency");
    const continueBtn = document.getElementById("continueBtn");

    // Deductible change
    if (deductibleSelect) {
      deductibleSelect.addEventListener("change", function() {
        AppState.formData.deductible = this.value;
        updatePricing();
      });
    }

    // Payment frequency change
    if (paymentFrequencySelect) {
      paymentFrequencySelect.addEventListener("change", function() {
        AppState.formData.paymentFrequency = this.value;
        updatePricing();
      });
    }

    // Plan selection buttons
    document.querySelectorAll('.select-btn').forEach(button => {
      button.addEventListener('click', function() {
        const plan = this.getAttribute('data-plan');
        AppState.formData.selectedPlan = plan;
        
        // Update button states
        document.querySelectorAll('.select-btn').forEach(btn => {
          btn.classList.remove('selected');
        });
        this.classList.add('selected');
        
        // Enable continue button
        if (continueBtn) {
          continueBtn.disabled = false;
        }
      });
    });

    // Continue button
    if (continueBtn) {
      continueBtn.addEventListener('click', function() {
        if (AppState.formData.selectedPlan) {
          goToStep(3);
        }
      });
    }

    updatePricing();
  }

  // Step 3: Application Form Logic
  function initializeStep3() {
    const applicationForm = document.getElementById("applicationForm");
    
    if (applicationForm) {
      // Form field handlers
      const formFields = [
        'anrede', 'titel', 'vorname', 'nachname', 'geburtsdatum_person',
        'strasse', 'plz_person', 'ort', 'telefon', 'email', 'iban', 'kontoinhaber'
      ];
      
      formFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
          field.addEventListener('input', function() {
            AppState.formData[fieldName] = this.value;
            
            // Auto-populate city for PLZ
            if (fieldName === 'plz_person' && this.value.length === 5 && plzCityMap[this.value]) {
              const ortField = document.getElementById('ort');
              if (ortField && !ortField.value) {
                ortField.value = plzCityMap[this.value];
                AppState.formData.ort = plzCityMap[this.value];
              }
            }
          });
        }
      });

      // Checkbox handlers
      ['datenschutz', 'agb', 'sepa_mandat'].forEach(checkboxName => {
        const checkbox = document.getElementById(checkboxName);
        if (checkbox) {
          checkbox.addEventListener('change', function() {
            AppState.formData[checkboxName] = this.checked;
          });
        }
      });

      // Form submission
      applicationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateStep3()) {
          submitApplication();
        }
      });
    }
  }

  // Helper Functions

  function updateBreedOptions() {
    const rasseSelect = document.getElementById("rasse");
    const tierKategorie = AppState.formData.tierKategorie;
    
    if (rasseSelect && breedData[tierKategorie]) {
      rasseSelect.innerHTML = '<option value="">Rasse auswählen...</option>';
      
      breedData[tierKategorie].forEach(breed => {
        const option = document.createElement("option");
        option.value = breed;
        option.textContent = breed;
        rasseSelect.appendChild(option);
      });
    }
  }

  function updateHousingQuestionText() {
    const tierKategorie = AppState.formData.tierKategorie;
    const haltungTitle = document.getElementById("haltungTitle");
    const indoorText = document.getElementById("indoorText");
    const outdoorText = document.getElementById("outdoorText");
    
    if (haltungTitle && indoorText && outdoorText) {
      switch(tierKategorie) {
        case 'katze':
          haltungTitle.textContent = "Wie wird Ihre Katze gehalten?";
          indoorText.textContent = "ausschließlich in der Wohnung";
          outdoorText.textContent = "Freigänger";
          break;
        case 'hund':
          haltungTitle.textContent = "Wie wird Ihr Hund gehalten?";
          indoorText.textContent = "ausschließlich in der Wohnung";
          outdoorText.textContent = "mit Garten/Freilauf";
          break;
        case 'pferd':
          haltungTitle.textContent = "Wie wird Ihr Pferd gehalten?";
          indoorText.textContent = "Boxenhaltung";
          outdoorText.textContent = "Offenstall/Weide";
          break;
      }
    }
  }

  function updateGermanDateDisplay() {
    const dateInput = document.getElementById("geburtsdatum");
    const dateDisplay = document.getElementById("dateDisplay");

    if (dateInput && dateDisplay && dateInput.value) {
      const date = new Date(dateInput.value);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      dateDisplay.textContent = `${day}.${month}.${year}`;
    } else if (dateDisplay) {
      dateDisplay.textContent = "";
    }
  }

  function updateTreatmentData() {
    const treatments = [];
    
    document.querySelectorAll('input[name="neue_behandlung"]:checked').forEach(cb => {
      treatments.push(cb.value);
    });
    
    AppState.formData.behandlungen = treatments;
  }

  function updatePricing() {
    const frequency = AppState.formData.paymentFrequency;
    
    document.querySelectorAll('.price-card').forEach(card => {
      const plan = card.getAttribute('data-plan');
      const amountSpan = card.querySelector('.amount');
      
      if (amountSpan && planPricing[plan]) {
        let price = planPricing[plan].monthly;
        
        switch(frequency) {
          case 'quarterly':
            price = planPricing[plan].quarterly;
            break;
          case 'semi-annually':
            price = planPricing[plan].semiAnnually;
            break;
          case 'yearly':
            price = planPricing[plan].yearly;
            break;
        }
        
        amountSpan.textContent = price.toFixed(2);
      }
    });
  }

  function populateOrderSummary() {
    const petSummary = document.getElementById('pet-summary');
    const planSummary = document.getElementById('plan-summary');
    const monthlyPrice = document.getElementById('monthly-price');
    const totalPrice = document.getElementById('total-price');
    
    if (petSummary) {
      petSummary.innerHTML = `
        <div style="margin-bottom: 8px;"><strong>Tierart:</strong> ${getPetTypeText(AppState.formData.tierKategorie)}</div>
        <div style="margin-bottom: 8px;"><strong>Rasse:</strong> ${AppState.formData.rasse || 'Nicht angegeben'}</div>
        <div style="margin-bottom: 8px;"><strong>Geburtsdatum:</strong> ${AppState.formData.geburtsdatum || 'Nicht angegeben'}</div>
        <div><strong>PLZ:</strong> ${AppState.formData.plz} ${AppState.formData.city}</div>
      `;
    }
    
    if (planSummary) {
      planSummary.innerHTML = `
        <div style="margin-bottom: 8px;"><strong>Tarif:</strong> ${getPlanName(AppState.formData.selectedPlan)}</div>
        <div style="margin-bottom: 8px;"><strong>Selbstbeteiligung:</strong> ${AppState.formData.deductible}%</div>
        <div><strong>Zahlungsweise:</strong> ${getPaymentFrequencyText(AppState.formData.paymentFrequency)}</div>
      `;
    }
    
    const price = planPricing[AppState.formData.selectedPlan]?.monthly || 0;
    if (monthlyPrice) {
      monthlyPrice.textContent = `${price.toFixed(2)} €`;
    }
    if (totalPrice) {
      totalPrice.textContent = `${price.toFixed(2)} €`;
    }
  }

  function populateSuccessPage() {
    const submissionDate = document.getElementById('submission-date');
    const selectedPlanFinal = document.getElementById('selected-plan-final');
    const monthlyPremium = document.getElementById('monthly-premium');
    
    if (submissionDate) {
      const today = new Date();
      submissionDate.textContent = today.toLocaleDateString('de-DE');
    }
    
    if (selectedPlanFinal) {
      selectedPlanFinal.textContent = getPlanName(AppState.formData.selectedPlan);
    }
    
    if (monthlyPremium) {
      const price = planPricing[AppState.formData.selectedPlan]?.monthly || 0;
      monthlyPremium.textContent = `${price.toFixed(2)} €`;
    }
  }

  // Validation Functions

  function validateStep1() {
    let isValid = true;
    
    // PLZ validation
    if (!AppState.formData.plz || !plzCityMap[AppState.formData.plz]) {
      showFieldError(document.getElementById('plz'), 'plzError');
      isValid = false;
    }
    
    // Birth date validation
    if (!AppState.formData.geburtsdatum) {
      showFieldError(document.getElementById('geburtsdatum'), 'geburtsdatumError');
      isValid = false;
    } else {
      const birthDate = new Date(AppState.formData.geburtsdatum);
      const today = new Date();
      if (birthDate > today) {
        showFieldError(document.getElementById('geburtsdatum'), 'geburtsdatumFutureError');
        isValid = false;
      }
    }
    
    // Neutered validation
    if (!AppState.formData.kastriert) {
      showFieldError(document.querySelector('input[name="kastriert"]'), 'kastriertError');
      isValid = false;
    }
    
    // Housing validation
    if (!AppState.formData.haltung) {
      showFieldError(document.querySelector('input[name="haltung"]'), 'haltungError');
      isValid = false;
    }
    
    // Health problems validation
    if (!AppState.formData.gesundheitsprobleme) {
      showFieldError(document.querySelector('input[name="gesundheitsprobleme"]'), 'gesundheitsproblemeError');
      isValid = false;
    }
    
    return isValid;
  }

  function validateStep3() {
    const requiredFields = ['anrede', 'vorname', 'nachname', 'geburtsdatum_person', 'strasse', 'plz_person', 'ort', 'email', 'iban', 'kontoinhaber'];
    const requiredCheckboxes = ['datenschutz', 'agb', 'sepa_mandat'];
    
    let isValid = true;
    
    // Validate required fields
    requiredFields.forEach(fieldName => {
      const field = document.getElementById(fieldName);
      if (field && !AppState.formData[fieldName]) {
        field.style.borderColor = '#dc3545';
        isValid = false;
      } else if (field) {
        field.style.borderColor = '';
      }
    });
    
    // Validate required checkboxes
    requiredCheckboxes.forEach(checkboxName => {
      if (!AppState.formData[checkboxName]) {
        isValid = false;
      }
    });
    
    return isValid;
  }

  function validateBirthDate() {
    const geburtsdatumInput = document.getElementById("geburtsdatum");
    const birthDate = new Date(AppState.formData.geburtsdatum);
    const today = new Date();
    
    clearFieldError(geburtsdatumInput, "geburtsdatum");
    
    if (birthDate > today) {
      showFieldError(geburtsdatumInput, "geburtsdatumFutureError");
      return false;
    }
    
    return true;
  }

  function updateSubmitButton() {
    const submitButton = document.getElementById("berechnenButton");
    if (!submitButton) return;
    
    const hasBasicInfo = AppState.formData.plz && 
                        plzCityMap[AppState.formData.plz] &&
                        AppState.formData.tierKategorie &&
                        AppState.formData.geburtsdatum &&
                        AppState.formData.kastriert &&
                        AppState.formData.haltung &&
                        AppState.formData.gesundheitsprobleme;
    
    if (hasBasicInfo) {
      submitButton.disabled = false;
      submitButton.style.opacity = "1";
      submitButton.style.cursor = "pointer";
    } else {
      submitButton.disabled = true;
      submitButton.style.opacity = "0.6";
      submitButton.style.cursor = "not-allowed";
    }
  }

  function showFieldError(field, errorId) {
    const errorBox = document.getElementById(errorId);
    if (errorBox) {
      errorBox.classList.add("show");
    }
    
    if (field) {
      const parentElement = field.closest(".form-question, .date-input-container, .inline-form");
      if (parentElement) {
        parentElement.classList.add("field-error");
      }
    }
  }

  function clearFieldError(field, fieldName) {
    let errorId = "";
    
    switch (fieldName) {
      case "plz":
        errorId = "plzError";
        break;
      case "geburtsdatum":
        const geburtsdatumError = document.getElementById("geburtsdatumError");
        const geburtsdatumFutureError = document.getElementById("geburtsdatumFutureError");
        if (geburtsdatumError) geburtsdatumError.classList.remove("show");
        if (geburtsdatumFutureError) geburtsdatumFutureError.classList.remove("show");
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
    }
    
    if (errorId) {
      const errorBox = document.getElementById(errorId);
      if (errorBox) {
        errorBox.classList.remove("show");
      }
      
      if (field) {
        const parentElement = field.closest(".form-question, .date-input-container, .inline-form");
        if (parentElement) {
          parentElement.classList.remove("field-error");
        }
      }
    }
  }

  // Utility Functions

  function getPetTypeText(type) {
    switch(type) {
      case 'katze': return 'Katze';
      case 'hund': return 'Hund';
      case 'pferd': return 'Pferd';
      default: return type || 'Nicht angegeben';
    }
  }

  function getPlanName(plan) {
    switch(plan) {
      case 'basis': return 'Basis Tarif';
      case 'smart': return 'Smart Tarif';
      case 'komfort': return 'Komfort Tarif';
      default: return 'Nicht gewählt';
    }
  }

  function getPaymentFrequencyText(frequency) {
    switch(frequency) {
      case 'monthly': return 'Monatlich';
      case 'quarterly': return 'Vierteljährlich';
      case 'semi-annually': return 'Halbjährlich';
      case 'yearly': return 'Jährlich';
      default: return frequency;
    }
  }

  function submitApplication() {
    // Simulate form submission
    console.log('Application submitted:', AppState.formData);
    
    // Generate application number
    const applicationNumber = 'TKV-' + new Date().getFullYear() + '-' + 
                             String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    
    // Store submission data
    AppState.formData.applicationNumber = applicationNumber;
    AppState.formData.submissionTime = new Date().toISOString();
    
    // Go to success page
    goToStep(4);
  }

  // Global functions for buttons
  window.restartApplication = function() {
    // Reset application state
    AppState.currentStep = 1;
    AppState.formData = {
      plz: '', city: '', tierKategorie: 'katze', geschlecht: 'maennlich', rasse: '',
      geburtsdatum: '', kastriert: '', haltung: '', gesundheitsprobleme: '',
      behandlungen: [], anzahl_operationen: 1, selectedPlan: '', deductible: '20',
      paymentFrequency: 'monthly', anrede: '', titel: '', vorname: '', nachname: '',
      geburtsdatum_person: '', strasse: '', plz_person: '', ort: '', telefon: '',
      email: '', iban: '', kontoinhaber: '', datenschutz: false, agb: false, sepa_mandat: false
    };
    
    // Reset all forms
    document.querySelectorAll('form').forEach(form => form.reset());
    
    // Go to first step
    goToStep(1);
  };

  // Initialize all steps
  initializeStep1();
  initializeStep2();
  initializeStep3();
  
  // Initialize first step
  goToStep(1);
});