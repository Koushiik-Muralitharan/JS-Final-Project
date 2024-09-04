// Ensure localStorage is initialized with an empty array if not present
if (!localStorage.getItem("UserArray")) {
    localStorage.setItem("UserArray", "[]");
}

// Parse the UserArray from localStorage
let UserArray: User[] = JSON.parse(localStorage.getItem("UserArray") || "[]");

class User {
    name: string;
    email: string;
    password: string;
    loggedStatus: string;

    status: string = "out";

    constructor(name: string, email: string, password: string) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.loggedStatus = this.status;
    }

    checkIfUserExists(): boolean {
        return UserArray.some(user => user.email === this.email);
    }

    addUser(): void {
        let result = this.checkIfUserExists();

        if (result) {
            const confirmPasswordError = document.getElementById('confirm-password-error') as HTMLElement;
            confirmPasswordError.innerText = "User with this email already exists.";
            return;
        }

        UserArray.push(this);
        localStorage.setItem("UserArray", JSON.stringify(UserArray));

        window.location.href = "SignIn.htm";
    }
}

// Retrieve elements by ID and type cast them
const userName = document.getElementById('name') as HTMLInputElement;
const userEmail = document.getElementById('email') as HTMLInputElement;
const userPasscode = document.getElementById('password') as HTMLInputElement;
const userConfirmPasscode = document.getElementById('confirm-password') as HTMLInputElement;
const UserSubmitbutton = document.getElementById('submit-button') as HTMLButtonElement;
const confirmPasswordError = document.getElementById('confirm-password-error') as HTMLElement;
const PasswordError = document.getElementById('password-error') as HTMLElement;
const emailError = document.getElementById('email-error') as HTMLElement;
const nameError = document.getElementById('name-error') as HTMLElement;

let isValid = true;

userName.onblur = function() {
    if (userName.value === "") {
        nameError.innerText = 'The name field is empty.*';
        isValid = false;
    } else if (!isNaN(Number(userName.value))) {
        nameError.innerText = 'Please enter a valid name.*';
        isValid = false;
    } else {
        nameError.innerText = '';
        isValid = true;
    }
}

userEmail.onblur = function() {
    if (userEmail.value === "") {
        emailError.innerText = 'The email field is empty.*';
        isValid = false;
    } else {
        emailError.innerText = '';
        isValid = true;
    }
}

userPasscode.onblur = function() {
    if (userPasscode.value === "") {
        PasswordError.innerText = 'The password field is empty.*';
        isValid = false;
    } else {
        PasswordError.innerText = '';
        isValid = true;
    }
}

userConfirmPasscode.onblur = function() {
    if (userConfirmPasscode.value === "") {
        confirmPasswordError.innerText = 'The confirm password field is empty.*';
        isValid = false;
    } else {
        confirmPasswordError.innerText = '';
        isValid = true;
    }
}

UserSubmitbutton.onclick = function(event: Event) {
    event.preventDefault();

    if (isValid) {
        let usersName = userName.value;
        let usersEmail = userEmail.value;
        let usersPasscode = userPasscode.value;
        let usersConfirmPasscode = userConfirmPasscode.value;

        if (usersPasscode === usersConfirmPasscode) {
            let newUser = new User(usersName, usersEmail, usersPasscode);
            newUser.addUser();
        } else {
            confirmPasswordError.innerText = 'The confirm passcode must match the passcode.*';
            return;
        }
    } else {
        confirmPasswordError.innerText = "Ensure the fields are valid before submit.*";
    }
}
