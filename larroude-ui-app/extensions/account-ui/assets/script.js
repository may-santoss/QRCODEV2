  const URL_to_validate_qr  = `https://larroude.com/a/s/`;
  // Function to check if Shopify product form exists
  function productFormExists() {
    return document.querySelectorAll('form[action*="/cart/add"]').length > 0;
  }
  
    // Function to extract the value of 'qr_landing' from the URL path
    function getQRLandingFromPath() {
    const keyword = 'qr_landing'
    const currentUrl = new URL(window.location.href);
  
    if (currentUrl.pathname.includes(keyword) || currentUrl.search.includes(keyword)) {
        const match_val = currentUrl.href.match(/qr_landing-([a-zA-Z0-9]+)/);
    if(match_val){
            return  match_val[1];
        }
    }
    return null;
  }
  
    // Function to set a cookie
    function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }
  
    // Function to get a cookie by name
    function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
  
    // Function to delete a cookie
    function deleteCookie(name) {
        document.cookie = name + "=; Max-Age=-99999999;";
  }
  
    // Function to add or update a hidden input field in Shopify product form
    function addOrUpdateHiddenInput(inputName, inputValue) {
    var productForms = document.querySelectorAll('form[action*="/cart/add"]');
    productForms.forEach(function (form) {
        var hiddenInput = form.querySelector(`input[name="attributes[${inputName}]"]`);
  
    if (hiddenInput) {
        // If the hidden input exists, update its value
        hiddenInput.value = inputValue;
        } else {
        // If the hidden input does not exist, create and append it
        hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.name = `attributes[${inputName}]`;
    hiddenInput.value = inputValue;
    form.appendChild(hiddenInput);
        }
    });
  }
  
    // Function to check if the hidden input field exists in Shopify product form
    function hiddenInputExists(inputName) {
    var productForms = document.querySelectorAll('form[action*="/cart/add"]');
    for (var i = 0; i < productForms.length; i++) {
        if (productForms[i].querySelector(`input[name="attributes[${inputName}]"]`)) {
            return true;
        }
    }
    return false;
  }
  
    // Function to remove a hidden input field from Shopify product form
    function removeHiddenInput(inputName) {
    var productForms = document.querySelectorAll('form[action*="/cart/add"]');
    productForms.forEach(function (form) {
        var hiddenInput = form.querySelector(`input[name="attributes[${inputName}]"]`);
    if (hiddenInput) {
        form.removeChild(hiddenInput);
        }
    });
  }
  
    // Function to validate the qr_landing value via an API
    async function validateQRLanding(qrLanding) {
    try {
        const response = await fetch(URL_to_validate_qr);
  
    const data = await response.json();
    return data.status;  // Assuming API returns a 'valid' boolean field
    } catch (error) {
        console.error('Error validating qr_landing:', error);
    return false;
    }
  }
  
    // Main function execution
    async function handleQRReferralProcess() {
    // Check if Shopify product form exists
    if (!productFormExists()) {
        console.log('No Shopify product forms found.');
    return;
    }
  
    const qrLanding = getQRLandingFromPath();  // Get qr_landing from URL path
    const cookieName = "qr_referral";  // Name of the cookie to store qr_landing
    const hiddenInputName = "_qr_referral_attribute";  // Hidden input field name in Shopify forms
    const cookieDays = 30;  // Cookie expiration days
  
    // Get the existing cookie value (previous qr_landing)
    const existingCookieValue = getCookie(cookieName);
  
    // Handle the qr_landing if it's available in the URL path
    if (qrLanding) {
        // Only validate qr_landing if the cookie doesn't exist or the qr_landing has changed
        if (!existingCookieValue || existingCookieValue !== qrLanding) {
            const isValid = await validateQRLanding(qrLanding);
  
    if (isValid) {
        // If valid, set the cookie with qr_landing and update hidden input
        setCookie(cookieName, qrLanding, cookieDays);
  
    // Add or update the hidden input field in Shopify product forms
    addOrUpdateHiddenInput(hiddenInputName, qrLanding);
            } else {
        console.log('qr_landing validation failed.');
    return;
            }
        }
    }
  
    // If no qr_landing in URL path or the cookie doesn't exist, remove the hidden input field and cookie
    if (!getCookie(cookieName)) {
        removeHiddenInput(hiddenInputName);
    deleteCookie(cookieName);  // Optionally delete the cookie if no qr_landing is present
    }
  
    // If the cookie exists but the hidden input field does not, add it
    if (existingCookieValue && !hiddenInputExists(hiddenInputName)) {
        addOrUpdateHiddenInput(hiddenInputName, existingCookieValue);
    }
  }
  
  // Call this function wherever needed
  
  document.addEventListener('DOMContentLoaded', async () => {
    try {
        await handleQRReferralProcess();
    } catch (error) {
        console.error('Error during async operation:', error);
    }
  });
  function addOrUpdateHiddenInput_property(inputName, inputValue) {
    var productForms = document.querySelectorAll('form[action*="/cart/add"]');
    productForms.forEach(function (form) {
        var hiddenInput = form.querySelector(`input[name="properties[${inputName}]"]`);
  
        if (hiddenInput) {
            // If the hidden input exists, update its value
            hiddenInput.value = inputValue;
        } else {
            // If the hidden input does not exist, create and append it
            hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = `properties[${inputName}]`;
            hiddenInput.value = inputValue;
            form.appendChild(hiddenInput);
        }
    });
  }
  document.addEventListener('DOMContentLoaded', function () {
    const product_vendor_to_check = current_product.vendor;
    const product_vendor_to_type = current_product.type;
    const product_vendor_to_price = current_product.price;
  if (product_vendor_to_price > 10000 && product_vendor_to_type.includes("Shoes") && current_product.compare_at_price === null && (product_vendor_to_check == 'Larroudé' || product_vendor_to_check.includes('Larroudé'))) {
    addOrUpdateHiddenInput_property('_is_full_price', true);
  }
  });