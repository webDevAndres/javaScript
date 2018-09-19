import './general';
import validateRegistrationForm from './services/formValidation/validateRegistrationForm';
import apiCall from './services/api/apiCall'; // imports apiCall
import toastr from 'toastr'; //imports toastr
import '../../node_modules/toastr/toastr.less'; // imports styles


// create a class called home
class Home {
    constructor() {
        // Now, we can easily identify variables having references to DOM elements from other variables.
        this.$form = document.querySelector('#registrationForm');
        this.$username = document.querySelector('#username');
        this.$email = document.querySelector('#email');
        this.$phone = document.querySelector('#phone');
        this.$age = document.querySelector('#age');
        this.$profession = document.querySelector('#profession');
        this.$experience = document.querySelector('#experience');
        this.$comment = document.querySelector('#comment');
        this.$submit = document.querySelector('#submit');
        this.$loadingIndicator = document.querySelector('#loadingIndicator');

        // This will attach an event listener to the form and will call the onFormSubmit() method 
        this.$form.addEventListener('submit', event => {
            this.onFormSubmit(event);
        });

    }


    // getFormValues() returns the values of the form fields as a JSON object
    // experience: parseInt(document.querySelector('input[name="experience"]:checked').value)
    //      converts the value of the checked checkbox to an integer so it can be validated.
    getFormValues() {
        return {
            username: this.$username.value,
            email: this.$email.value,
            phone: this.$phone.value,
            age: this.$age.value,
            profession: this.$profession.value,
            experience: parseInt(document.querySelector('input[name="experience"]:checked').value),
            comment: this.$comment.value,
        };
    }

    // event.preventDefault() prevents the page from being submitted
    // We also need to create a variable that will store the values of the form fields
    // The formStatus object stores the returned value of validateRegistrationForm() module with formValues
    //      as its paramter.
    // The if statement checks whether the form is valid, then if it is true it calls the method
    //      clearErrors() to clear all the error highlights in the UI ( form ). Then the submitForm(formValues)
    //      method is called to submit the form.
    // if the statement is false (else), the clearErrors() method is called to clear the form and then
    //      calls the highlightErrors(formStatus.result) method with with formStatus.result as paramters.
    //      formStatus.result contains the validation details of the individual fields as a parameter
    //      to highlight the fields that have errors.
    onFormSubmit(event) {
        event.preventDefault();
        const formValues = this.getFormValues();
        const formStatus = validateRegistrationForm(formValues);

        if (formStatus.isValid) {
            this.clearErrors();
            this.submitForm(formValues);
        }
        else {
            this.clearErrors();
            this.highlightErrors(formStatus.result);
        }
    }

    // removes the has-error class from the aprent div of the input field
    clearErrors() {
        this.$username.parentElement.classList.remove('has-error');
        this.$phone.parentElement.classList.remove('has-error');
        this.$email.parentElement.classList.remove('has-error');
        this.$age.parentElement.classList.remove('has-error');
        this.$profession.parentElement.classList.remove('has-error');
        this.$profession.parentElement.classList.remove('has-error');
        this.$experience.parentElement.classList.remove('has-error');
    }



    // in submit form we will hide the submit button and display the loading indicator. 
    submitForm(formValues) {
        this.$submit.classList.add('hidden');
        this.$loadingIndicator.classList.remove('hidden');

        // since apiCall() returns a promise, we are using a promse.then().catch() chain so that
        //  when the registration is a success, toastr will show a success toast in the top-right corner
        //      of the page with the message sent by the server.
        //  if there is a problem it will show an error toast.
        // We also need to clear the form using the this.resetForm() method.
        apiCall('registration', formValues, 'POST')
            .then(response => {
                this.$submit.classList.remove('hidden');
                this.$loadingIndicator.classList.add('hidden');
                toastr.success(response.message);
                this.resetForm(); // For clearing the form
            })
            .catch(() => {
                this.$submit.classList.remove('hidden');
                this.$loadingIndicator.classList.add('hidden');
                toastr.error('Error!');
            });
    }

        // if the result is false, meaning it didn't pass validation, the !(not)
    //      will return true for a false statement and procede with the if statement.
    // an easier way to read it is, if this is NOT true do this.
    highlightErrors(result) {
        // console.log(!result.username);
        if (!result.username) {
            this.$username.parentElement.classList.add('has-error');
        }

        if (!result.phone) {
            this.$phone.parentElement.classList.add('has-error');
        }
        if (!result.email) {
            this.$email.parentElement.classList.add('has-error');
        }
        if (!result.age) {
            this.$age.parentElement.classList.add('has-error');
        }
        if (!result.profession) {
            this.$profession.parentElement.classList.add('has-error');
        }
        if (!result.experience) {
            this.$experience.parentElement.classList.add('has-error');
        }

    }

    resetForm() {
        this.$username.value = '';
        this.$email.value = '';
        this.$phone.value = '';
        this.$age.value = '';
        this.$profession.value = 'school';
        this.$experience.checked = true;
        this.$comment.value = '';
    }




} //end of class


// create a new instance of the class when the window loads
window.addEventListener('load', () => {
    new Home();
});
