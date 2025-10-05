// Standalone form handler without module dependencies
console.log('Form handler loaded');

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
      
      // Simulate form submission delay
      setTimeout(() => {
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
      }, 2000);
    } else {
      console.log('Application Data:', applicationData);
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