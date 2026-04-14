// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Get DOM elements
const stateInput = document.getElementById('state-input');
const fetchButton = document.getElementById('fetch-alerts');
const alertsDisplay = document.getElementById('alerts-display');
const errorMessage = document.getElementById('error-message');
const loadingSpinner = document.getElementById('loading-spinner');

// Function to show loading spinner
function showLoadingSpinner() {
  loadingSpinner.style.display = 'block';
}

// Function to hide loading spinner
function hideLoadingSpinner() {
  loadingSpinner.style.display = 'none';
}

// Function to display error with styling
function displayError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add('error');
  errorMessage.classList.remove('hidden');
}

// Function to clear error
function clearError() {
  errorMessage.textContent = '';
  errorMessage.classList.remove('error');
  errorMessage.classList.add('hidden');
}

// Function to validate input
function isValidStateAbbr(abbr) {
  return /^[A-Z]{2}$/.test(abbr);
}

// Add event listener to button
fetchButton.addEventListener('click', async () => {
  const state = stateInput.value.trim().toUpperCase();
  
  // Input validation
  if (!isValidStateAbbr(state)) {
    displayError('Please enter a valid 2-letter state abbreviation.');
    return;
  }
  
  // Clear input
  stateInput.value = '';
  
  // Show loading spinner
  showLoadingSpinner();
  
  try {
    // Fetch data
    const response = await fetch(`${weatherApi}${state}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Clear previous alerts
    alertsDisplay.innerHTML = '';
    
    // Display summary
    const alertCount = data.features.length;
    const summary = document.createElement('p');
    summary.textContent = `${data.title}: ${alertCount}`;
    alertsDisplay.appendChild(summary);
    
    // Display headlines
    if (alertCount > 0) {
      const list = document.createElement('ul');
      data.features.forEach(feature => {
        const item = document.createElement('li');
        item.textContent = feature.properties.headline;
        list.appendChild(item);
      });
      alertsDisplay.appendChild(list);
    }
    
    // Clear error
    clearError();
    
  } catch (error) {
    // Display error
    displayError(error.message);
    
    // Clear alerts
    alertsDisplay.innerHTML = '';
  } finally {
    // Hide loading spinner
    hideLoadingSpinner();
  }
});