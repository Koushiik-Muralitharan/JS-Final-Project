
var emailId = document.getElementById('email');
var password = document.getElementById('password');
var displayError = document.getElementById('display-error');
var loginButton = document.getElementById('login-button');
var emailError = document.getElementById('email-error');
var passcodeError = document.getElementById('passcode-error');

if (!localStorage.getItem("UserArray")) {
    displayError.innerText = "Please sign up to login.*";
} else {
    var UserArray = JSON.parse(localStorage.getItem("UserArray"));
}


var isValid = true;


emailId.onblur = function() {
    if (emailId.value === "") {
        emailError.innerText = "Enter the email.*";
        isValid = false;
    } else {
        emailError.innerText = ""; 
        isValid = true;
    }
};

password.onblur = function() {
    if (password.value === "") {
        passcodeError.innerText = "Enter the password.*";
        isValid = false;
    } else {
        passcodeError.innerText = ""; 
        isValid = true;
    }
};

function checkIfUserExists(email) {
    return UserArray.some(user => user.email === email);
}


loginButton.onclick = function(event) {
    event.preventDefault(); 

    if (!isValid) {
        displayError.innerText = "Please fill in all required fields.*";
        return;
    }

    let emailValue = emailId.value;
    let passwordValue = password.value;

    if (checkIfUserExists(emailValue)) {

         emailId.value="";
         password.value="";
        
        let userExists = UserArray.some(user => user.email === emailValue && user.password === passwordValue);
        UserArray.forEach((user) => {
            if(user.email === emailValue && user.password === passwordValue){
                  user.loggedStatus = "in";
            }
        }); 
        localStorage.setItem('UserArray', JSON.stringify(UserArray));
        if (userExists) {
            window.location.href = "MainPage.htm"; 
        } else {
            displayError.innerText = "Invalid email or password.*"; 
        }
    } else {
        displayError.innerText = "User does not exist. Please sign up.*"; 
    }
};
