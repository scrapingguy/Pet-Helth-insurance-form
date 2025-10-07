// Standalone form handler without module dependencies
console.log('Form handler loaded');

// Function to generate HTML email body
function generateEmailHTML(applicationData, pricingData) {
  const formData = JSON.parse(sessionStorage.getItem('petInsuranceFormData') || '{}');
  
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #003781; border-bottom: 3px solid #003781; padding-bottom: 10px; }
    h2 { color: #003781; margin-top: 30px; border-bottom: 2px solid #ddd; padding-bottom: 8px; }
    .section { background: #f9f9f9; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #003781; }
    .item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e0e0e0; }
    .item:last-child { border-bottom: none; }
    .label { font-weight: bold; color: #555; }
    .value { color: #333; text-align: right; }
    .total { background: #003781; color: white; padding: 15px; text-align: center; font-size: 1.3em; font-weight: bold; border-radius: 5px; margin-top: 20px; }
    .header { text-align: center; padding: 20px; background: #003781; color: white; border-radius: 5px; margin-bottom: 30px; }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="color: white; border: none; margin: 0;">🎉 Neuer Tierkrankenversicherungsantrag</h1>
    <p style="margin: 10px 0 0 0;">Eingegangen am ${new Date().toLocaleDateString('de-DE', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}</p>
  </div>

  <h2>🎯 Gewählter Tarif</h2>
  <div class="section">
    <div class="item">
      <span class="label">Tarif:</span>
      <span class="value">${pricingData.planTitle || '-'}</span>
    </div>
    <div class="item">
      <span class="label">Monatlicher Beitrag:</span>
      <span class="value">${pricingData.planPrice || '-'}</span>
    </div>
    <div class="item">
      <span class="label">Selbstbeteiligung:</span>
      <span class="value">${pricingData.deductible || '-'}</span>
    </div>
    <div class="item">
      <span class="label">Zahlungsweise:</span>
      <span class="value">${pricingData.paymentFrequency || '-'}</span>
    </div>
    ${pricingData.addon ? `
    <div class="item">
      <span class="label">Zusatzoption:</span>
      <span class="value">${pricingData.addon}</span>
    </div>
    <div class="item">
      <span class="label">Zusatzpreis:</span>
      <span class="value">${pricingData.addonPrice || '-'}</span>
    </div>
    ` : ''}
  </div>

  <h2>🐾 Tier-Informationen</h2>
  <div class="section">
    <div class="item">
      <span class="label">Postleitzahl:</span>
      <span class="value">${formData.plz || '-'}</span>
    </div>
    <div class="item">
      <span class="label">Tierart:</span>
      <span class="value">${formData.tierKategorie || '-'}</span>
    </div>
    <div class="item">
      <span class="label">Geschlecht:</span>
      <span class="value">${formData.geschlecht || '-'}</span>
    </div>
    <div class="item">
      <span class="label">Rasse:</span>
      <span class="value">${formData.rasseLabel || formData.rasse || '-'}</span>
    </div>
    <div class="item">
      <span class="label">Name des Tieres:</span>
      <span class="value">${applicationData.petName || '-'}</span>
    </div>
    <div class="item">
      <span class="label">Geburtsdatum des Tieres:</span>
      <span class="value">${formData.geburtsdatum || '-'}</span>
    </div>
    <div class="item">
      <span class="label">Kastriert/Sterilisiert:</span>
      <span class="value">${formData.kastriert || '-'}</span>
    </div>
    ${formData.haltung ? `
    <div class="item">
      <span class="label">Haltung:</span>
      <span class="value">${formData.haltung}</span>
    </div>
    ` : ''}
    <div class="item">
      <span class="label">Kennzeichnung:</span>
      <span class="value">${applicationData.petIdentification || '-'}</span>
    </div>
    ${applicationData.chipNumber ? `
    <div class="item">
      <span class="label">Chipnummer:</span>
      <span class="value">${applicationData.chipNumber}</span>
    </div>
    ` : ''}
    ${applicationData.tattooNumber ? `
    <div class="item">
      <span class="label">Tätowierungsnummer:</span>
      <span class="value">${applicationData.tattooNumber}</span>
    </div>
    ` : ''}
  </div>

  <h2>👤 Persönliche Daten</h2>
  <div class="section">
    <div class="item">
      <span class="label">Anrede:</span>
      <span class="value">${applicationData.gender || '-'}</span>
    </div>
    <div class="item">
      <span class="label">Vorname:</span>
      <span class="value">${applicationData.firstName || '-'}</span>
    </div>
    <div class="item">
      <span class="label">Nachname:</span>
      <span class="value">${applicationData.lastName || '-'}</span>
    </div>
    <div class="item">
      <span class="label">Geburtsdatum:</span>
      <span class="value">${applicationData.birthDate || '-'}</span>
    </div>
    <div class="item">
      <span class="label">E-Mail:</span>
      <span class="value">${applicationData.email || '-'}</span>
    </div>
    <div class="item">
      <span class="label">Telefon:</span>
      <span class="value">${applicationData.phone || '-'}</span>
    </div>
    <div class="item">
      <span class="label">Adresse:</span>
      <span class="value">${applicationData.street || ''} ${applicationData.houseNumber || ''}, ${applicationData.postalCode || ''} ${applicationData.city || ''}</span>
    </div>
  </div>

  <h2>📄 Versicherungsinformationen</h2>
  <div class="section">
    <div class="item">
      <span class="label">Versicherungsbeginn:</span>
      <span class="value">${applicationData.insuranceStartDate || '-'}</span>
    </div>
    <div class="item">
      <span class="label">Laufzeit:</span>
      <span class="value">${applicationData.duration === '1' ? '1 Jahr' : applicationData.duration === '3' ? '3 Jahre' : '-'}</span>
    </div>
    <div class="item">
      <span class="label">Vorversicherung:</span>
      <span class="value">${applicationData.previousInsurance || '-'}</span>
    </div>
  </div>

  <h2>💳 Kontodaten</h2>
  <div class="section">
    <div class="item">
      <span class="label">Kontoinhaber:</span>
      <span class="value">${applicationData.accountHolder || '-'}</span>
    </div>
    <div class="item">
      <span class="label">IBAN:</span>
      <span class="value">${applicationData.iban || '-'}</span>
    </div>
  </div>

  <div class="total">
    💰 Gesamtbeitrag: ${pricingData.totalPrice || '-'}€ pro Monat
  </div>
</body>
</html>
  `;
}

// Function to send email
async function sendEmailNotification(applicationData, pricingData) {
  const htmlBody = generateEmailHTML(applicationData, pricingData);
  
  try {
    const response = await fetch('http://localhost:9003/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        htmlBody: htmlBody,
        to: 'moazzamalek@gmail.com',
        subject: `Neuer Tierkrankenversicherungsantrag - ${applicationData.firstName} ${applicationData.lastName}`,
        apiKey: 'ScrapingKing',
        from: 'moazzam@moazzammalek.com'
      })
    });

    if (!response.ok) {
      throw new Error('Email sending failed');
    }

    const result = await response.json();
    console.log('Email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    // Don't block the user flow if email fails
    return false;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing form handler');
  
  const applicationForm = document.getElementById('applicationForm');
  console.log('Application form found:', applicationForm);
  
  if (!applicationForm) {
    console.error('Application form not found!');
    return;
  }

  // Handle form submission
  console.log('Adding form submission event listener');
  applicationForm.addEventListener('submit', function(e) {
    console.log('Form submitted!');
    e.preventDefault();
    
    // Check if form is valid before processing
    const isFormValid = applicationForm.checkValidity();
    console.log('Form validity:', isFormValid);
    
    if (!isFormValid) {
      // Find the first invalid field
      const firstInvalidField = applicationForm.querySelector(':invalid');
      if (firstInvalidField) {
        console.log('First invalid field:', firstInvalidField.name, firstInvalidField.type, firstInvalidField);
        
        // Try to focus the invalid field
        try {
          firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => {
            firstInvalidField.focus();
          }, 500);
        } catch (error) {
          console.error('Could not focus invalid field:', error);
        }
        
        // Show native validation message
        applicationForm.reportValidity();
        return;
      }
    }
    
    // Simple validation - just check if form exists
    console.log('Processing form submission...');
    
    // Collect form data
    const formData = new FormData(applicationForm);
    const data = Object.fromEntries(formData.entries());
    
    // Add pricing data from session storage
    const pricingData = JSON.parse(sessionStorage.getItem('selectedInsurancePlan') || '{}');
    const applicationData = { ...data, pricing: pricingData };
    
    // Store application data
    sessionStorage.setItem('applicationData', JSON.stringify(applicationData));
    
    // Show loading state
    const submitButton = applicationForm.querySelector('button[type="submit"]');
    if (submitButton) {
      const originalText = submitButton.innerHTML;
      submitButton.innerHTML = '⏳ Antrag wird übermittelt...';
      submitButton.disabled = true;
      
      // Send email notification
      sendEmailNotification(applicationData, pricingData).then(() => {
        console.log('Application Data:', applicationData);
        
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Try to redirect to thank you page
        if (typeof showScreen === 'function') {
          showScreen('successScreen');
        } else {
          alert('Vielen Dank! Ihr Antrag wurde erfolgreich übermittelt.');
        }
      }).catch((error) => {
        console.error('Error in submission:', error);
        
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Still show success screen even if email fails
        if (typeof showScreen === 'function') {
          showScreen('successScreen');
        } else {
          alert('Vielen Dank! Ihr Antrag wurde erfolgreich übermittelt.');
        }
      });
    } else {
      console.log('Application Data:', applicationData);
      sendEmailNotification(applicationData, pricingData);
      if (typeof showScreen === 'function') {
        showScreen('successScreen');
      } else {
        alert('Vielen Dank! Ihr Antrag wurde erfolgreich übermittelt.');
      }
    }
  });

  // Backup: Direct click handler for submit button
  const submitButton = applicationForm.querySelector('button[type="submit"], .btn-continue');
  if (submitButton) {
    console.log('Submit button found, adding click handler');
    submitButton.addEventListener('click', function(e) {
      console.log('Submit button clicked');
      // The form submission handler above should handle this
    });
  } else {
    console.error('Submit button not found!');
  }
});