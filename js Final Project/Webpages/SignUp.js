// localStorage.clear();
//user array creation
if(!localStorage.getItem("UserArray"))
{
    localStorage.setItem("UserArray","[]");
}
let UserArray = JSON.parse(localStorage.getItem("UserArray"));

class User{
    status = "out";
    constructor (name, email, password){
        this.name = name;
        this.email = email;
        this.password = password;
        this.loggedStatus = this.status;
    }

    checkIfUserExists() {
        return UserArray.some(user => user.email === this.email); 
    }

    addUser(){
        let result = this.checkIfUserExists();

        if (result) {
            alert("User with this email already exists!");
            return;
        }

        UserArray.push(this); 
        localStorage.setItem("UserArray", JSON.stringify(UserArray)); 
        console.log("User added successfully:", UserArray);

    }
}

let user = new User();

var userName = document.getElementById('name');
var userEmail = document.getElementById('email');
var userPasscode = document.getElementById('password');
var userConfirmPasscode = document.getElementById('confirm-password');
var UserSubmitbutton = document.getElementById('submit-button');
var confirmPasswordError = document.getElementById('confirm-password-error');
var PasswordError = document.getElementById('password-error');
var emailError = document.getElementById('email-error');
var nameError = document.getElementById('name-error');

var isValid = true;
userName.onblur = function(){
    if(userName.value === ""){
        nameError.innerText = 'the name field is empty.*';
        isValid = false;
    }
    else if(!isNaN(userName.value)){
        nameError.innerText = 'Please enter a valid name.*';
        isValid = false;
    }else{
        nameError.innerText='';
        isValid = true;
    }
}

userEmail.onblur = function(){
    if(userEmail.value === ""){
        emailError.innerText = 'the email field is empty.*';
        isValid = false;
    }
   else{
        emailError.innerText='';
        isValid = true;
    }
}

userPasscode.onblur = function(){
    if(userPasscode.value === ""){
        PasswordError.innerText = 'the password field is empty.*';
        isValid = false;
    }
   else{
        PasswordError.innerText='';
        isValid = true;
    }
}

userConfirmPasscode.onblur = function(){
    if(userConfirmPasscode.value === ""){
        confirmPasswordError.innerText = 'the confirm password field is empty.*';
        isValid = false;
    }
   else{
        confirmPasswordError.innerText='';
        isValid = true;
    }
}

UserSubmitbutton.onclick = function(event){
    event.preventDefault();
    if(isValid){
        let usersName = userName.value;
        let usersEmail = userEmail.value;
        let usersPasscode = userPasscode.value;
        let usersConfirmPasscode = userConfirmPasscode.value;

        if(usersPasscode === usersConfirmPasscode){
            let newUser = new User(usersName, usersEmail, usersPasscode);
            newUser.addUser();
        }else{
             confirmPasswordError.innerText='The confirm passcode same as passcode.*'
             return;
        }
    }else{
        confirmPasswordError.innerText="Ensure the fields are valid before submit.*"
    }

    
     
}