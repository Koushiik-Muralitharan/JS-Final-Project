"use strict";
// Ensure localStorage is initialized with an empty array if not present
if (!localStorage.getItem("UserArray")) {
    localStorage.setItem("UserArray", "[]");
}
// Parse the UserArray from localStorage
let UserArray = JSON.parse(localStorage.getItem("UserArray") || "[]");
class User {
    // status: string = "out";
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.loggedStatus = "out";
    }
    checkIfUserExists() {
        return UserArray.some(user => user.email === this.email);
    }
    addUser() {
        let result = this.checkIfUserExists();
        if (result) {
            const confirmPasswordError = document.getElementById('confirm-password-error');
            confirmPasswordError.innerText = "User with this email already exists.";
            return;
        }
        UserArray.push(this);
        localStorage.setItem("UserArray", JSON.stringify(UserArray));
        window.location.href = "SignIn.htm";
    }
}
// Retrieve elements by ID and type cast them
const userName = document.getElementById('name');
const userEmail = document.getElementById('email');
const userPasscode = document.getElementById('password');
const userConfirmPasscode = document.getElementById('confirm-password');
const UserSubmitbutton = document.getElementById('submit-button');
const confirmPasswordError = document.getElementById('confirm-password-error');
const PasswordError = document.getElementById('password-error');
const emailError = document.getElementById('email-error');
const nameError = document.getElementById('name-error');
let isValid = true;
userName.onblur = function () {
    if (userName.value === "") {
        nameError.innerText = 'The name field is empty.*';
        isValid = false;
    }
    else if (!isNaN(Number(userName.value))) {
        nameError.innerText = 'Please enter a valid name.*';
        isValid = false;
    }
    else {
        nameError.innerText = '';
        isValid = true;
    }
};
userEmail.onblur = function () {
    if (userEmail.value === "") {
        emailError.innerText = 'The email field is empty.*';
        isValid = false;
    }
    else {
        emailError.innerText = '';
        isValid = true;
    }
};
userPasscode.onblur = function () {
    if (userPasscode.value === "") {
        PasswordError.innerText = 'The password field is empty.*';
        isValid = false;
    }
    else {
        PasswordError.innerText = '';
        isValid = true;
    }
};
userConfirmPasscode.onblur = function () {
    if (userConfirmPasscode.value === "") {
        confirmPasswordError.innerText = 'The confirm password field is empty.*';
        isValid = false;
    }
    else {
        confirmPasswordError.innerText = '';
        isValid = true;
    }
};
UserSubmitbutton.onclick = function (event) {
    event.preventDefault();
    if (isValid) {
        let usersName = userName.value;
        let usersEmail = userEmail.value;
        let usersPasscode = userPasscode.value;
        let usersConfirmPasscode = userConfirmPasscode.value;
        if (usersPasscode === usersConfirmPasscode) {
            let newUser = new User(usersName, usersEmail, usersPasscode);
            newUser.addUser();
        }
        else {
            confirmPasswordError.innerText = 'The confirm passcode must match the passcode.*';
            return;
        }
    }
    else {
        confirmPasswordError.innerText = "Ensure the fields are valid before submit.*";
    }
};
