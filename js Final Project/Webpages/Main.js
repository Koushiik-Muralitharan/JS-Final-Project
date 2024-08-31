function openModal() {
    document.getElementById("contribution-modal").style.display = "flex";
  }

  function closeModal() {
    document.getElementById("contribution-modal").style.display = "none";
  }

  function openGoalModal() {
    document.getElementById("add-goal-modal").style.display = "flex";
  }

  function closeGoalModal() {
    document.getElementById("add-goal-modal").style.display = "none";
  }

  let UserArray = JSON.parse(localStorage.getItem("UserArray"));

  let profileName = document.getElementById('profile-name');
  let logoutIcon = document.getElementById("logout-icon");

  let userAccount = UserArray.find(user => user.loggedStatus === "in");

  profileName.innerText = userAccount.name;

  logoutIcon.onclick = function (){
    // alert("Hi I am Koushiik Muralitharan")
    UserArray.forEach((user) => {
      if(user.loggedStatus === "in" && user.name === userAccount.name && user.email === userAccount.email){
            user.loggedStatus = "out";
      }
  }); 
  localStorage.setItem('UserArray', JSON.stringify(UserArray));
  window.location.href="SignIn.htm"
  }

  class AddExpense{
    constructor(email, transactionType, category, amount, date){
      this.email = email;
      this.transactionType = transactionType;
      this.category = category;
    }
  }
  