const BURL = "https://larroude.com/a/s";
const User_Update_URL=`${BURL}/users/update_customer`

function showTab(tabId) {
  document.querySelector('.waiting').style.display = "none";
    const tabs = document.querySelectorAll('.tab-content');
    const tab_button = document.querySelectorAll('.tab-button');
    const clickedbutton = document.querySelector(`[data-tab="${tabId}"]`);
    tabs.forEach((tab,key) => {
        tab.classList.remove('active');
        tab_button[key].classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
    
    clickedbutton.classList.add('active');
    localStorage.setItem('activeTab', tabId);
}

// Event listener for tab buttons
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');
        showTab(tabId);
    });
});
// Function to share content
function setupShare() {
  
  // Loop through each element and add a click event listener
    document.addEventListener('click', async function (event) {
      if (event.target && event.target.classList.contains('share')) {
        
      // Get data attributes from the span
      const url = event.target.getAttribute('data-url');

      // Check if the Web Share API is supported
      if (navigator.share) {
        
        // Use the Web Share API to share the content
       try{ 
         await navigator.share({
          title: "Larroude Product",
          text: "Share this product",
          url: url
        })
      }catch(err){
         
      }
      } else {
        // Fallback for browsers that do not support the Web Share API
        alert(`Share this link: ${url}`);
      }
      }
    });
}
// Check local storage on page load and show the last active tab
document.addEventListener('DOMContentLoaded', function() {
    const activeTab = localStorage.getItem('activeTab') || 'Tab1'; // Default to 'tab1'
    showTab(activeTab);
    setupShare();
});


async function fetchCreditAndAppend(url) {
  try {
    // Fetch data from the API
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    // Parse the JSON data
    const data = await response.json();
    document.querySelector('.amount').innerHTML=data.amount;
    document.querySelector('.pending_amount').innerHTML=data.pending_amount;
  }catch (error) {
    console.error('Error:', error);
  }
}



// Optimized function to fetch data and append it to the DOM
async function fetchDataAndAppend(url, containerId) {
  try {
    // Fetch data from the API
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    // Parse the JSON data
    const data = await response.json();

    // Get the container where data will be appended
    const container = document.getElementById(containerId);
    let htmlContent = '';
    // Loop through the data and create elements
    if(data.length === 0){
      container.innerHTML=`<h3 class="lar-col-12 center title-3">You did not claimed any QR code yet!</h3>`;
      return;
    }
    
    data.forEach(item => {
      let title_handle;
      if(item.title != '' || item.title != null){
        title_handle=item.title;
      }else{
        title_handle=item.handle;
      }
      htmlContent +=`
      <div class="lar-col-6 lar-col-sm-12">
      <div class="card">
        <div class="qrcode-title">
        <a class="title-3 truncate" target="_blank" href="https://qr.larroude.com/t/${item.qr_id}">${title_handle}</a>
        </div>
        <span class="light-gray">Scanned:${item.scanned}</span>
        <span class="right share pointer share-button-qr button button--primary" data-url="https://qr.larroude.com/t/${item.qr_id}">Share QR</span>
      </div>
      </div>
      `;
    });
    container.innerHTML = htmlContent;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example usage
if (window.shopifyCustomerId) {
fetchCreditAndAppend(`${BURL}/users/users_total_credits?shopify_user_id=${window.shopifyCustomerId}`);
fetchDataAndAppend(`${BURL}/test/get_test_qr?user_id=${window.shopifyCustomerId}`, 'qrcodes-container');
}

function toggleAriaControls(t) {
    let e = document.getElementById(t.getAttribute("aria-controls"));
    if (!e) {
        console.error(`No element found with ID "${t.getAttribute("aria-controls")}".`);
        return
    }
    let r = "true" === t.getAttribute("aria-expanded");
    t.setAttribute("aria-expanded", !r), e.hidden = r
}

document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("click", t => {
        let e = t.target.closest("[aria-controls][aria-expanded]");
        e && toggleAriaControls(e)
    }), document.addEventListener("keydown", t => {
        let e = t.target.closest("[aria-controls][aria-expanded]");
        e && ("Enter" === t.key || " " === t.key) && (t.preventDefault(), toggleAriaControls(e))
    })
});





document.addEventListener("DOMContentLoaded", function() {
    function submitForm(formId, resultDivId) {
        const form = document.getElementById(formId);
        const resultDiv = document.getElementById(resultDivId);
        const submitButton = form.querySelector('button');
        
        if (!form || !resultDiv || !submitButton) {
            console.error("Form, result div, or submit button not found!");
            return;
        }

        form.addEventListener('submit', function(e) {
            e.preventDefault();  // Prevent form from submitting the traditional way

            // Disable the submit button and change its text
            submitButton.disabled = true;
            submitButton.innerText = "Wait...";

            const formData = new FormData(form);
            const jsonObject = {};
            formData.forEach((value, key) => {
                jsonObject[key] = value;
            });

            // Send the form data via Fetch API
            fetch(form.action, {
                method: form.method,
                 headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonObject)
            })
            .then(response => response.json())
            .then(data => {
                // Set the response inside the result div
                resultDiv.innerHTML = data.message;
                resultDiv.hidden=false;
                

            })
            .catch(error => {
                // Handle errors
                resultDiv.innerHTML = "An error occurred: " + error;
            }).finally(() => {
              // Re-enable the button after receiving the response
              submitButton.disabled=false;
              submitButton.innerHTML='Update';
          });
        });
    }

    // Example of usage: Adjust 'myForm' and 'resultDiv' with your actual form and div IDs
    submitForm('user-update-form', 'details-update-message');
    submitForm('password-update-form', 'password-update-message');

  
  



const delforms = document.querySelectorAll('form[id^="deleteadd"]');

// Iterate over the selected forms and attach a submit event listener to each
delforms.forEach((form) => {
    form.addEventListener('submit', function(event) {
        
        // Prevent the default form submission
            event.preventDefault();
            let buttonSubmit=event.submitter;
            buttonSubmit.disabled = true;
            buttonSubmit.innerText = "Wait...";
            let AddId=form.getAttribute('data-add-id');
            let removable = document.querySelector(`.toremove-${AddId}`);
            const formData = new FormData(form);
            
            if (confirm('Are you sure you want to delete this address?')) {
            // Send the form data via Fetch API
              fetch(`/account/addresses/${AddId}`, {
                  method: 'POST',
                  body: formData,
                  headers: {
                    'X-Requested-With': 'XMLHttpRequest', // To mark this as an AJAX request
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
                  }
                })
            .then(response => {
          if (response.ok) {
            // Successfully deleted, remove the address from the DOM or show a message
            document.getElementById('add-delete-message').hidden=false;
            document.getElementById('add-delete-message').innerText = 'Address deleted successfully.';
            // Optionally, you can remove the address from the page
            removable.remove();
          } else {
            throw new Error('Failed to delete address.');
          }
        })
        .catch(error => {
           console.log(error.message);
        });
            }
    });
});
});


document.getElementById('add-address-forms').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the default form submission

    // Get the form element and its data
    const address_form = document.getElementById('add-address-forms');
    const formData = new FormData(address_form);
  let add_delete_message = document.getElementById('address-add-message');
  const Address_Add_Button = address_form.querySelector('button');
            Address_Add_Button.disabled = true;
            Address_Add_Button.innerText = "Wait...";
    // Perform AJAX request to submit the form
    fetch(address_form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'X-Requested-With': 'XMLHttpRequest', // To mark this as an AJAX request
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      }
    })
    .then(response => {
      if (response.ok) {
        // Address successfully added, show a success message or update the DOM
        add_delete_message.hidden=false;
        add_delete_message.innerText = 'Address added successfully.';
        address_form.reset(); // Reset form after successful submission
        Address_Add_Button.disabled = false;
          Address_Add_Button.innerText = "Add";
      } else {
        // Handle error response
        return response.text().then(errorText => { 
          throw new Error(errorText);
        });
      }
    })
    .catch(error => {

    });
  });


const modal = document.querySelector('.modal');
    const closeButtons = document.querySelectorAll('.close-button');
    const openModalButtons = document.querySelectorAll('.open-modal-button');

    // Function to open the modal with dynamic content
    function openModal() {
        modal.style.display = 'block'; // Show modal
    }

    // Add event listeners to open modal buttons
    openModalButtons.forEach(button => {
        let modalid = button.getAttribute('data-modal-id');
        let open_model=document.getElementById(modalid);
        button.addEventListener('click', () => {
            open_model.style.display = 'block';
        });
    });
closeButtons.forEach(button => {
         let modalid = button.getAttribute('id');
        let close_model=document.getElementById(modalid);
    // Close the modal when the close button is clicked
    button.addEventListener('click', () => {
      
        close_model.style.display = 'none';
    });
});

    // Close modal when clicking outside of modal content
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });



const delforms = document.querySelectorAll('form[id^="update-address-forms"]');

// Iterate over the selected forms and attach a submit event listener to each
delforms.forEach((form) => {
    form.addEventListener('submit', function(event) {
        
        // Prevent the default form submission
            event.preventDefault();
            let buttonSubmit=event.submitter;
            
            buttonSubmit.disabled = true;
            buttonSubmit.innerText = "Wait...";
            
            let add_update_message = buttonSubmit.getAttribute('data-update-message');
            let final
            let AddId=form.getAttribute('update-add-id');
            const formData = new FormData(form);
            
           
            // Send the form data via Fetch API
              fetch(`/account/addresses/${AddId}`, {
                  method: 'POST',
                  body: formData,
                  headers: {
                    'X-Requested-With': 'XMLHttpRequest', // To mark this as an AJAX request
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
                  }
                })
            .then(response => {
          if (response.ok) {
            // Successfully deleted, remove the address from the DOM or show a message
            document.getElementById(add_update_message).hidden=false;
            document.getElementById(add_update_message).innerText = 'Address updated successfully.';
            buttonSubmit.disabled = false;
            buttonSubmit.innerText = "Update";
            // Optionally, you can remove the address from the page
          } else {
            throw new Error('Failed to delete address.');
          }
        })
        .catch(error => {
           console.log(error.message);
        });
            
    });
});