// Pet Health Insurance Form JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const form = document.getElementById('insuranceForm');
    const plzInput = document.getElementById('plz');
    const gesundheitsproblemeRadios = document.querySelectorAll('input[name="gesundheitsprobleme"]');
    const behandlungsFrage = document.getElementById('behandlungsFrage');
    const krankheitenListe = document.getElementById('krankheitenListe');
    const submitButton = document.getElementById('berechnenButton');
    
    // Treatment checkboxes
    const keinBesuchCheckbox = document.getElementById('neue_kein_besuch');
    const heilbehandlungCheckbox = document.getElementById('neue_heilbehandlung');
    const operationCheckbox = document.getElementById('neue_operation');
    const operationAnzahl = document.getElementById('operationAnzahl');

    // German postal code to city mapping (sample)
    const plzCityMap = {
        '01067': 'Dresden',
        '10115': 'Berlin', 
        '20095': 'Hamburg',
        '80331': 'München',
        '50667': 'Köln',
        '60311': 'Frankfurt am Main',
        '70173': 'Stuttgart',
        '40213': 'Düsseldorf'
    };

    // PLZ input validation and city display
    if (plzInput) {
        plzInput.addEventListener('input', function() {
            const plz = this.value;
            if (plz.length === 5 && plzCityMap[plz]) {
                // Could display city name here if needed
                console.log('Valid PLZ for: ' + plzCityMap[plz]);
            }
        });
    }

    // Handle health problems radio button change
    gesundheitsproblemeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'ja' && behandlungsFrage) {
                behandlungsFrage.style.display = 'block';
                // Also show the disease list
                if (krankheitenListe) {
                    krankheitenListe.style.display = 'block';
                }
            } else if (behandlungsFrage) {
                behandlungsFrage.style.display = 'none';
                // Hide the disease list
                if (krankheitenListe) {
                    krankheitenListe.style.display = 'none';
                    // Reset disease list radio buttons
                    const diseaseRadios = document.querySelectorAll('input[name="spezielle_krankheiten"]');
                    diseaseRadios.forEach(radio => radio.checked = false);
                }
                // Reset all checkboxes when hiding the question
                const behandlungCheckboxes = document.querySelectorAll('input[name="neue_behandlung"]');
                behandlungCheckboxes.forEach(cb => {
                    cb.checked = false;
                    cb.disabled = false;
                });
                // Hide operation count
                if (operationAnzahl) {
                    operationAnzahl.style.display = 'none';
                }
                // Remove grayed styling
                document.querySelectorAll('.checkbox-option').forEach(option => {
                    option.classList.remove('grayed-option');
                });
            }
        });
    });

    // Handle treatment checkbox interactions
    if (keinBesuchCheckbox) {
        keinBesuchCheckbox.addEventListener('change', function() {
            if (this.checked) {
                // Disable and uncheck other options
                if (heilbehandlungCheckbox) {
                    heilbehandlungCheckbox.checked = false;
                    heilbehandlungCheckbox.disabled = true;
                    heilbehandlungCheckbox.parentElement.classList.add('grayed-option');
                }
                if (operationCheckbox) {
                    operationCheckbox.checked = false;
                    operationCheckbox.disabled = true;
                    operationCheckbox.parentElement.classList.add('grayed-option');
                }
                // Hide operation count
                if (operationAnzahl) {
                    operationAnzahl.style.display = 'none';
                }
            } else {
                // Re-enable other options
                if (heilbehandlungCheckbox) {
                    heilbehandlungCheckbox.disabled = false;
                    heilbehandlungCheckbox.parentElement.classList.remove('grayed-option');
                }
                if (operationCheckbox) {
                    operationCheckbox.disabled = false;
                    operationCheckbox.parentElement.classList.remove('grayed-option');
                }
            }
        });
    }

    // Handle operation checkbox
    if (operationCheckbox) {
        operationCheckbox.addEventListener('change', function() {
            if (this.checked) {
                if (operationAnzahl) {
                    operationAnzahl.style.display = 'block';
                }
            } else {
                if (operationAnzahl) {
                    operationAnzahl.style.display = 'none';
                }
            }
        });
    }

    // Prevent other checkboxes when "kein Besuch" is selected
    if (heilbehandlungCheckbox) {
        heilbehandlungCheckbox.addEventListener('change', function() {
            if (this.checked && keinBesuchCheckbox && keinBesuchCheckbox.checked) {
                keinBesuchCheckbox.checked = false;
                // Re-enable this checkbox
                this.disabled = false;
                this.parentElement.classList.remove('grayed-option');
            }
        });
    }

    // Form submission
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = {};
            
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }

            console.log('Form submitted with data:', data);
            
            // Show a simple alert for now
            alert('Vielen Dank! Ihre Anfrage wurde erfasst. Sie werden nun zu den Tarifen weitergeleitet.');
            
            // Here you would normally send the data to a server
            // or show a results page
        });
    }

    // Simple form validation
    function validateForm() {
        const requiredFields = [
            'plz',
            'tierKategorie', 
            'geschlecht',
            'rasse',
            'geburtsdatum',
            'kastriert',
            'haltung',
            'gesundheitsprobleme'
        ];

        let isValid = true;
        
        requiredFields.forEach(fieldName => {
            const field = document.querySelector(`[name="${fieldName}"]`);
            if (field && !field.value) {
                isValid = false;
            }
        });

        return isValid;
    }

    // Enable/disable submit button based on form completion
    function updateSubmitButton() {
        if (submitButton) {
            submitButton.disabled = !validateForm();
        }
    }

    // Add change listeners to form fields
    const formFields = form.querySelectorAll('input, select');
    formFields.forEach(field => {
        field.addEventListener('change', updateSubmitButton);
        field.addEventListener('input', updateSubmitButton);
    });

    // Number input +/- button functionality
    const increaseBtn = document.getElementById('increaseBtn');
    const decreaseBtn = document.getElementById('decreaseBtn');
    const numberInput = document.getElementById('anzahl_operationen');

    if (increaseBtn && decreaseBtn && numberInput) {
        increaseBtn.addEventListener('click', function() {
            let currentValue = parseInt(numberInput.value) || 1;
            numberInput.value = currentValue + 1;
            updateSubmitButton();
        });

        decreaseBtn.addEventListener('click', function() {
            let currentValue = parseInt(numberInput.value) || 1;
            if (currentValue > 1) {
                numberInput.value = currentValue - 1;
                updateSubmitButton();
            }
        });

        // Ensure minimum value is 1
        numberInput.addEventListener('input', function() {
            if (this.value < 1) {
                this.value = 1;
            }
            updateSubmitButton();
        });
    }

    // Initial button state
    updateSubmitButton();
});