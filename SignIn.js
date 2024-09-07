"use strict";
// Retrieve elements by ID and type cast them
const emailId = document.getElementById('email');
const password = document.getElementById('password');
const displayError = document.getElementById('display-error');
const loginButton = document.getElementById('login-button');
const emailErrors = document.getElementById('email-error');
const passcodeError = document.getElementById('passcode-error');
let UserArrays = [];
if (!localStorage.getItem("UserArray")) {
    displayError.innerText = "Please sign up to login.*";
}
else {
    UserArrays = JSON.parse(localStorage.getItem("UserArray") || "[]");
}
let isValids = true;
emailId.onblur = function () {
    if (emailId.value === "") {
        emailErrors.innerText = "Enter the email.*";
        isValids = false;
    }
    else {
        emailErrors.innerText = "";
        isValids = true;
    }
};
password.onblur = function () {
    if (password.value === "") {
        passcodeError.innerText = "Enter the password.*";
        isValids = false;
    }
    else {
        passcodeError.innerText = "";
        isValids = true;
    }
};
function checkIfUserExists(email) {
    return UserArrays.some(user => user.email === email);
}
loginButton.onclick = function (event) {
    event.preventDefault();
    if (!isValids) {
        displayError.innerText = "Please fill in all required fields.*";
        return;
    }
    const emailValue = emailId.value;
    const passwordValue = password.value;
    if (checkIfUserExists(emailValue)) {
        emailId.value = "";
        password.value = "";
        const userExists = UserArrays.some(user => user.email === emailValue && user.password === passwordValue);
        UserArrays.forEach((user) => {
            if (user.email === emailValue && user.password === passwordValue) {
                user.loggedStatus = "in";
            }
        });
        localStorage.setItem('UserArray', JSON.stringify(UserArrays));
        if (userExists) {
            window.location.href = "Main.htm";
        }
        else {
            displayError.innerText = "Invalid email or password.*";
        }
    }
    else {
        displayError.innerText = "User does not exist. Please sign up.*";
    }
};
