
// The validateRegistrationForm(formValues) function accepts the formValues
//     JSON object as a parameter
// The validateRegistrationForm() function will return both the isValid variable and 
//      the result object as properties of another object
// The result object contains the validation status (true or false) of each of the form inputs
//      which checks if the form is valid.
// The form is only valid if all the properties of the result object are true. To check the
//      properties of the result object we need to use a for/in loop.

export default function validateRegistrationForm(formValues) {

    const result = {
        username: validateUsername(formValues.username),
        email: validateEmail(formValues.email),
        phone: validatePhone(formValues.phone),
        age: validateAge(formValues.age),
        profession: validateProfession(formValues.profession),
        experience: validateExperience(formValues.experience),
    };

// The for/in loop iterates over the properties of the object. Since all the properties of the result object need to be true, 
//      create a variable called isValid withe the initial value true. Then, iterate over all the properties of the result and
//      then && ( AND ) the values with the isValid variable.
// Because we are using a for/in loop, the property name is stored in the variable field so we need to use bracket notation
//      to access the property
// The isValid variable will only be true if all the properties of the result object are true.
    let field, isValid = true;
    for(field in result) {
        isValid = isValid && result[field];
    }

    return { isValid, result };
}


//  validateUsername(name) checks to see if the
//     length of the name is less than 3
function validateUsername(name) {
    return name.length > 3;
}

// validateEmail(email) uses regular expression to make sure value matches
//      a specific format
// test() is a method that indicates whether or not a pattern exists in a searched string,
//      in our case we are checking if the emailRegex is found in the email parameter.
function validateEmail(email) {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\ [\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
}

// validatePhone(phone) checks whether the phone number value
//      matches the format XXX-XXX-XXXX

function validatePhone(phone) {
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return phoneRegex.test(phone);
}

function validateAge(age) {
    return age >= 10 && age <= 25;
  }

// validateProfession checks that the value checked is one of the accepted values
// We put the accepted values into an array and store it in a variable called acceptedValue
// Then we return the index of the value using indexOf(profession).
// In the acceptedValues.indexOf(profession), indexOf() accepts an array element as a paramter
//      and returns the index of the element within the acceptedValues array. However, if the element is not
//      present in the array, it returns -1, so we can use that to check whether the value of profession
//      is one of the accepted values by finding its index within the array and checking if its bigger than -1.
function validateProfession(profession) {
    const acceptedValues = ['school','college','trainee','employee'];
    return acceptedValues.indexOf(profession) > -1;
}

// to validate experience, the values of the experience radio buttons are 1, 2, and 3. 
//      So, experience should be a number between 0-4:
function validateExperience(experience) {
    return experience > 0 && experience < 4;
}