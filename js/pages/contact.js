import { validateForm, rules } from "./../modules/validationMethods.js";
import { isCompany } from "./../modules/utils.js";


$(document).ready(function() {
    // Handle service type change, show notes for work
    const serviceTypeField = $("select[id=service_type]");
    serviceTypeField.change(function(e) {
        const field = $(this);
        const serviceTypeValue = field.val();

        // Hide all existing notes
        field.parent().find("[id$=_service_type]").hide();

        // Show notes for this value
        const notesToShow = $(`#${serviceTypeValue}_service_type`);
        if(notesToShow) {
            notesToShow.show();
        }
    });

    // Handle individual type change, show additional fields for company
    const individualTypeCheck = $("input[name=individual_type]");
    individualTypeCheck.change(function() {
        const value = $(this).val();
        const companyData = $("#contact-us-company-data");
        if(isCompany(value)) {
            companyData.show();
        } else {
            companyData.hide();
        }
    });

    // Handle form "submit"
    $("#contact-us-button").click(validateContactUsForm);
});

/**
 * Get field validation rules
 * @returns Object
 */
function getValidationRules() {
    const serviceTypeOptions = ['work', 'careers', 'support', 'complaint', 'other'];
    const individualTypeOptions = ['individual', 'company'];
    let result = {
        'service_type': [rules.required(), rules.in(serviceTypeOptions)],
        'individual_type': [rules.required(), rules.in(individualTypeOptions)],
        'first_name': [rules.required(), rules.string()],
        'last_name': [rules.required(), rules.string()],
        'phone_number': [rules.required(), rules.string()],
        'email': [rules.required(), rules.email()],
        'message': [rules.required(), rules.string()],
    };
    const individualTypeCheck = $("input[name=individual_type]:checked");
    if(isCompany(individualTypeCheck.val())) {
        result = {
            ...result,
            'company_name': [rules.required(), rules.string()],
            'pib': [rules.required(), rules.string()],
        }
    }
    return result;
}

function getValidationMessages() {
    const requiredString = {
        required: "Ovo polje je obavezno",
        string: "Ovo polje mora biti u formatu teksta",
    };

    return {
        service_type: {
            required: "Ovo polje je obavezno",
            in: "Izabrana vrednost nije validna",
        },
        individual_type: {
            required: "Ovo polje je obavezno",
            in: "Izabrana vrednost nije validna",
        },
        first_name: requiredString,
        last_name: requiredString,
        phone_number: requiredString,
        email: {
            required: "Ovo polje je obavezno",
            email: "Ovo polje mora biti u formatu email-a",
        },
        message: requiredString,
        company_name: requiredString,
        pib: requiredString,
    };
};

/**
 * Get readable value of the field (option text for select, label text for radio)
 * @param {HTMLElement} field
 * @returns string
 */
function getReadableValue(field) {
    if(field.tagName === 'SELECT') {
        return field.options[field.selectedIndex].text;
    }
    if(field.type === 'radio' || field.type === 'checkbox') {
        const label = field.closest('label');
        if(label) {
            return label.innerText.trim();
        }
    }
    return field.value;
}

/**
 * Alter the page to show valid response after form "submission"
 * @param {*} formData
 */
function showValidResponse(formData) {
    const success = $("#contact-form-success");
    const seenLabels = {};
    formData.forEach(field => {
        let label = field.getAttribute('placeholder'); // Firstly look for label in placeholder
        if(!label) { // Look for label in custom 'data-placeholder' attribute
            label = field.getAttribute('data-placeholder');
        }
        const value = getReadableValue(field);
        if(!seenLabels[label]) { // If this label was not already shown, show it
            seenLabels[label] = true;
            success.append($("<p>").text(`${label}: ${value}`));
        }
    });

    const todaysDate = new Date();
    const monthNames = [
        'januar', 'februar', 'mart', 'april', 'maj', 'jun', 'jul', 'avgust', 'septembar', 'oktobar', 'novembar', 'decembar'
    ];
    const day = (todaysDate.getDate() < 10 ? '0' : '') + todaysDate.getDate();
    const month = todaysDate.getMonth();
    const monthText = monthNames[month]; // We can do this as 'getMonth' returns month index starting from 0
    const year = todaysDate.getFullYear();
    const hour = (todaysDate.getHours() < 10 ? '0' : '') + todaysDate.getHours();
    const minutes = (todaysDate.getMinutes() < 10 ? '0' : '') + todaysDate.getMinutes();

    success.append(`<p><strong>Prosleđeno dana: ${day}. ${monthText} ${year}. u ${hour}:${minutes}</strong></p>`);

    success.slideDown();
}

function validateContactUsForm() {
    const form = $("#contact-form");

    // Converts the form to html dom element, as validator works with pure html elements
    const { formData, formIsValid } = validateForm(form[0], getValidationRules(), getValidationMessages());

    // If form is valid after all fields have been processed, show the response
    if(formIsValid) {
        form.slideUp(); // Hides the form
        showValidResponse(formData); // Shows the response
    }
}
