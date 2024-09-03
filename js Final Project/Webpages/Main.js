
//User transaction array part

if (!localStorage.getItem("UserTransactionsArray")) {
  localStorage.setItem("UserTransactionsArray", "[]");
}
let UserTransactionsArray = JSON.parse(
  localStorage.getItem("UserTransactionsArray")
);


if(!localStorage.getItem("UserBalance")){
  localStorage.setItem("UserBalance","0");
}

let UserBalance = parseFloat(JSON.parse(localStorage.getItem("UserBalance")));


if(!localStorage.getItem("goalBalance")){
  localStorage.setItem("goalBalance","0");
}

let goalBalance = parseFloat(JSON.parse(localStorage.getItem("goalBalance")));



function closeModal() {
  document.getElementById("contribution-modal").style.display = "none";
}

function openGoalModal() {
  document.getElementById("add-goal-modal").style.display = "flex";
}

function closeGoalModal() {
  document.getElementById("add-goal-modal").style.display = "none";
}

// Change the contents inside the select category based on the select transaction type.

var transactionType = document.getElementById("transaction-type");
var category = document.getElementById("category");

var transactionTypeProgress = document.getElementById('transaction-type-progress');
var categoryProgress = document.getElementById('category-progress');


const incomeCategories = [
  { value: "salary", text: "Salary" },
  { value: "investment", text: "Investment" },
  { value: "other", text: "Other Income" },
];

const expenseCategories = [
  { value: "food", text: "Food" },
  { value: "education", text: "Education" },
  { value: "medicine", text: "Medicine" },
  { value: "others", text: "Others" },
];

function updateCategoryOptions() {
  category.innerHTML = "";
  let selectedCategories =
    transactionType.value === "Income" ? incomeCategories : expenseCategories;
  selectedCategories.forEach((categories) => {
    const option = document.createElement("option");
    option.value = categories.value;
    option.textContent = categories.text;
    category.appendChild(option);
  });
}

transactionType.onchange = function () {
  updateCategoryOptions();
};

// i have used this to run the scripts on the page after the page is loaded.
window.onload = function () {
  updateCategoryOptions();
  addexpense.display();
  addexpense.calculateTotals();
  goal.displayGoal();
  start();   
  completedColor();
};



completedColor = function() {
  
  let completedGoals = JSON.parse(localStorage.getItem('completedGoals')) || [];

  completedGoals.forEach(goalId => {
    let goalContainer = document.getElementById(`goal-container-${goalId}`);
    
    if (goalContainer) {
      goalContainer.style.backgroundColor = "#32CD32";
    }
  });
};


var actualSum;
start = function(){
  actualSum = parseFloat(UserBalance) - parseFloat(goalBalance);
  remainingBalance.innerText = `$${actualSum.toFixed(2)}`;
}

// Log out part

let UserArray = JSON.parse(localStorage.getItem("UserArray"));
let profileName = document.getElementById("profile-name");
let logoutIcon = document.getElementById("logout-icon");

let userAccount = UserArray.find((user) => user.loggedStatus === "in");
profileName.innerText = userAccount.name;
var userNames = userAccount.name;
var userEmail = userAccount.email;
console.log(userEmail);
logoutIcon.onclick = function () {
  UserArray.forEach((user) => {
    if (
      user.loggedStatus === "in" &&
      user.name === userAccount.name &&
      user.email === userAccount.email
    ) {
      user.loggedStatus = "out";
     
    }
  });
  remainingBalance.innerText="";
  localStorage.setItem("UserArray", JSON.stringify(UserArray));
  window.location.href = "SignIn.htm";
};

//table part

var tableBody = document.getElementById("transaction-body");
var remaining = 0;
class AddingExpense {
  constructor(id, email, transactionType, category, amount, date) {
    this.id = id;
    this.email = email;
    this.transactionType = transactionType;
    this.category = category;
    this.amount = amount;
    this.date = date;
  }

  addTransaction() {
    UserTransactionsArray.push({
      id: this.id,
      email: this.email,
      transactionType: this.transactionType,
      category: this.category,
      amount: this.amount,
      date: this.date,
    });
    localStorage.setItem(
      "UserTransactionsArray",
      JSON.stringify(UserTransactionsArray)
    );

    this.display();
    this.calculateTotals();
  }

  deleteTransaction(Usertransactions) {
    UserTransactionsArray = UserTransactionsArray.filter(
      (transaction) => transaction.id != Usertransactions.id
    );

    localStorage.setItem(
      "UserTransactionsArray",
      JSON.stringify(UserTransactionsArray)
    );
    this.display();
    this.calculateTotals();
  }

  display() {
    tableBody.innerHTML = "";

    UserTransactionsArray.forEach((transactions) => {
      if (transactions.email === userEmail) {
        createRow(transactions);
      }
    });
  }
  calculateTotals() {
    let incomeSum = 0;
    let expenseSum = 0;

    UserTransactionsArray.forEach((transaction) => {
      if (transaction.email === userEmail) {
        if (transaction.transactionType === "Income") {
          incomeSum += parseFloat(transaction.amount);
        } else if (transaction.transactionType === "Expense") {
          expenseSum += parseFloat(transaction.amount);
        }
      }
    });

    totalIncome.innerText = `$${incomeSum.toFixed(2)}`;
    totalExpense.innerText = `$${expenseSum.toFixed(2)}`;
    remaining = incomeSum - expenseSum;
    remainingBalance.innerText = `$${remaining.toFixed(2)}`;

    localStorage.setItem("UserBalance", JSON.stringify(remaining));
  }

  expenseCategories(){
    let incomeSums = 0;
    let expenseSums = 0;
    let categoryValue = categoryProgress.value;
    let res = UserTransactionsArray.some((transaction) => transaction.email === userEmail);
    console.log(res);
    if(!res){
      alert("add transactions to view the statistics..");
    }else{

    
    UserTransactionsArray.forEach((transaction) => {
      if (transaction.email === userEmail) {
        if (transaction.transactionType === "Income") {
          incomeSums += parseFloat(transaction.amount);
        } else if (transaction.transactionType === "Expense") {
          
          if(transaction.category === categoryValue){
            expenseSums += parseFloat(transaction.amount);
          }
        }
      }
    });

  let percentage = (expenseSums / incomeSums) * 100;

  if (isNaN(percentage) || percentage < 0) {
    percentage = 0;
  } else if (percentage > 100) {
    percentage = 100;
  }

  let progressBar = document.getElementById('progress');
  let progressText = document.getElementById('progress-text');
  
  progressBar.style.width = `${percentage}%`;
  progressText.innerText = `${percentage.toFixed(2)}% of amount for ${categoryValue}`;

  }
}
}

var addexpense = new AddingExpense();

addexpense.display();

//row template

function createRow(Usertransactions) {

  let row = document.createElement("tr");

  let dateCell = document.createElement("td");
  dateCell.innerText = Usertransactions.date;
  row.appendChild(dateCell);

  let categoryCell = document.createElement("td");
  categoryCell.innerText = Usertransactions.category;
  row.appendChild(categoryCell);

  let amountCell = document.createElement("td");
  amountCell.innerText = Usertransactions.amount;
  row.appendChild(amountCell);

  let deleteCell = document.createElement("td");
  let deleteButton = document.createElement("button");
  deleteButton.onclick = function () {
    addexpense.deleteTransaction(Usertransactions);
  };
  deleteButton.innerText = "Delete";
  deleteButton.classList.add("transaction-delete-button");
  deleteCell.appendChild(deleteButton);
  row.appendChild(deleteCell);

  tableBody.appendChild(row);
}

var totalIncome = document.getElementById("total-income-display");
var totalExpense = document.getElementById("total-expenses-display");
var remainingBalance = document.getElementById("remaining-balance-display");
var amount = document.getElementById("amount-field");
var date = document.getElementById("date-field");
var addExpenseButton = document.getElementById("expense-add-submit-button");
var amountError = document.getElementById("amount-error");
var dateError = document.getElementById("date-error");

var isValid = false;

amount.onblur = function () {
  if (amount.value === "") {
    amountError.innerText = "please enter a amount.*";
    isValid = false;
  } else if (isNaN(amount.value) || amount.value <= 0) {
    amountError.innerText = "please enter a valid amount.*";
    isValid = false;
  } else {
    amountError.innerText = "";
    isValid = true;
  }
};

//Date Validation function()
function validateDate() {
  var selectedDate = new Date(date.value);
  var today = new Date();
  selectedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  var firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  if (selectedDate < firstDayOfMonth || selectedDate > today) {
    return false;
  } else {
    return true;
  }
}

//Add Expense Form Validation
date.onblur = function () {
  if (date.value === "") {
    dateError.innerText = "please choose a date.*";
    isValid = false;
  } else if (!validateDate()) {
    dateError.innerText = "Please select a date within this month.*";
    isValid = false;
  } else {
    dateError.innerText = "";
    isValid = true;
  }
};

//Find Percentage;

var calculatePercentage = document.getElementById('percentage-calculator');

calculatePercentage.onclick = function (e){
  e.preventDefault();
  addexpense.expenseCategories();
}



//Add Expense Submit Form button event

var displayMainErrors = document.getElementById("display-main-errors");

addExpenseButton.onclick = function (e) {
  e.preventDefault();
  displayMainErrors.innerText = "";
  if (isValid) {
    let userTransactionType = transactionType.value;
    let userCategory = category.value;
    let userAmount = amount.value;
    let userDate = date.value;
    let tranactionId = Math.floor(Math.random() * 90) + 10;

    if (userTransactionType === "Expense") {
      let currentRemainingBalance = parseFloat(
        remainingBalance.innerText.replace("$", "")
      );

      if (userAmount > currentRemainingBalance) {
        displayMainErrors.innerText =
          "This expense exceeds your remaining balance.";
        return; 
      }
    }

    let userTransaction = new AddingExpense(
      tranactionId,
      userEmail,
      userTransactionType,
      userCategory,
      userAmount,
      userDate
    );
    userTransaction.addTransaction();
    amount.value = "";
    date.value = "";


    localStorage.setItem("UserBalance", JSON.stringify(remaining));
    window.location.reload();
  } else {
    displayMainErrors.innerText = "please check the form before you submit.*";
  }
};



//Savings Part

//user goal array part
if (!localStorage.getItem("UserGoalArray")) {
  localStorage.setItem("UserGoalArray", "[]");
}
let UserGoalArray = JSON.parse(localStorage.getItem("UserGoalArray"));


var goalsContainer = document.getElementById("goals-container");

class AddGoal {
  constructor(goalId, goalEmail, goalName, goalAmount, currentContribution) {
    this.goalId = goalId;
    this.goalEmail = goalEmail;
    this.goalName = goalName;
    this.goalAmount = goalAmount;
    this.currentContribution = currentContribution;
  }

  addGoal() {
    UserGoalArray.push({
      goalId: this.goalId,
      goalEmail: this.goalEmail,
      goalName: this.goalName,
      goalAmount: this.goalAmount,
      currentContribution: this.currentContribution,
    });

    localStorage.setItem("UserGoalArray", JSON.stringify(UserGoalArray));  

    this.displayGoal();
  }

  displayGoal() {
    goalsContainer.innerHTML = "";
    
    UserGoalArray.forEach((goal) => {
      if (goal.goalEmail === userEmail) {
        createGoalCard(goal);
      }
    });
    let currentBalance =0;

    UserGoalArray.forEach((goal)=>{
     if(goal.goalEmail === userEmail){
      currentBalance += parseFloat(goal.currentContribution);
     }
    })
    localStorage.setItem("goalBalance", JSON.stringify(currentBalance));
  }
}

let goal = new AddGoal();
goal.displayGoal();



deleteGoal = function (goalId) {

 window.location.reload();

  UserGoalArray = UserGoalArray.filter((goal) => goal.goalId !== goalId);

  localStorage.setItem("UserGoalArray", JSON.stringify(UserGoalArray));

  goal.displayGoal();
};

let goalHeading = document.getElementById('goal-heading');
let contributionStatus = document.getElementById('contribution-status');
let goalAmountStatus = document.getElementById('goal-amount-status');
let balanceAmount = document.getElementById('Balance-amount-status');


openModal = function (goalName,currentContribution, goalAmount, remainingBalance) {
  document.getElementById("contribution-modal").style.display = "flex";
  // balanceAmount.innerText = remainingBalance ;
  contributionStatus.innerText = currentContribution;
  goalAmountStatus.innerText = goalAmount
  goalHeading.innerText= goalName;
}


function createGoalCard(goal) {
  let goalCard = document.createElement("div");
  
  goalCard.classList.add("goal-card");
  goalCard.id = `goal-container-${goal.goalId}`;
  console.log(goalCard.id);

  goalCard.innerHTML = `
      <h3>${goal.goalName}</h3>
      <div class="progress-bar">
        <div class="progress" style="width: ${Math.min(
          (goal.currentContribution / goal.goalAmount) * 100,
          100
        )}%"></div>
      </div>
      <div class="contribution">
       <span>${Math.min(
         ((goal.currentContribution / goal.goalAmount) * 100).toFixed(1),
         100
       )}% achieved</span>
      <div> 
            <button class="contribute-btn" onclick="openModal('${goal.goalName}','${goal.currentContribution}','${goal.goalAmount}','${remaining}')">+</button>
        <button class="delete-goal-btn" onclick="deleteGoal(${
          goal.goalId
        })">-</button>
      </div>     
      </div>
    `;

  goalsContainer.appendChild(goalCard);
}

let goalNameInput = document.getElementById("goal-name");
let goalAmountInput = document.getElementById("goal-amount");
let goalContributionInput = document.getElementById("current-contribution");
let goalNameError = document.getElementById("goal-name-error");
let goalAmountError = document.getElementById("goal-amount-error");
let goalContributionError = document.getElementById("goal-contribution-error");
let goalFormButton = document.getElementById("goal-submit-button");
let goalErrors = document.getElementById('add-goal-main-errors');
let canProceed = false;

goalNameInput.onblur = function () {
  if (goalNameInput.value === "") {
    goalNameError.innerText = "the name field is empty.";
    canProceed = false;
  } else {
    goalNameError.innerText = "";
    canProceed = true;
  }
};

goalAmountInput.onblur = function () {
  if (goalAmountInput.value === "") {
    goalAmountError.innerText = "please enter a amount.*";
    canProceed = false;
  } else if (isNaN(goalAmountInput.value) || goalAmountInput.value <= 0) {
    goalAmountError.innerText = "please enter a valid amount.*";
    canProceed = false;
  } else {
    goalAmountError.innerText = "";
    canProceed = true;
  }
};

goalContributionInput.onblur = function () {
  if (goalContributionInput.value === "") {
    goalContributionError.innerText = "please enter a amount.*";
    canProceed = false;
  } else if (
    isNaN(goalContributionInput.value) ||
    goalContributionInput.value <= 0
  ) {
    goalContributionError.innerText = "please enter a valid amount.*";
    canProceed = false;
  }else if(goalContributionInput.value> actualSum){
    goalContributionError.innerText = "Limited Balance.*";
    canProceed = false;
  } else {
    goalContributionError.innerText = "";
    canProceed = true;
  }
};

goalFormButton.onclick = function (e) {
  e.preventDefault();
  var remainingStatus = remaining;
  if (canProceed) {
    goalErrors.innerText="";
    let userGoalEmail = userEmail;
    let userGoalName = goalNameInput.value;
    let userGoalAmount = goalAmountInput.value;
    let userGoalContribution = goalContributionInput.value;
    let userGoalId = Math.floor(Math.random() * 90) + 10;

    if(parseInt(userGoalAmount) > parseInt(userGoalContribution)){
      goalErrors.innerText='';
      
    }else{
       goalErrors.innerText='enter a valid contribution.';
       return;
      
    }
    if(!(parseInt(userGoalContribution) < remainingStatus)){
      goalErrors.innerText='Limited Balance.';
      return;
    }
    let usergoal = new AddGoal(
      userGoalId,
      userGoalEmail,
      userGoalName,
      userGoalAmount,
      userGoalContribution
    );
     usergoal.addGoal();
  }else{
    goalErrors.innerText = 'Check the fields before you submit.';

  }
};


var addContribution = document.getElementById('goal-contribution-submit-button');
var contributionAmountInput = document.getElementById('contribution-amount');
var addContributionError = document.getElementById('add-contribution-error');

var goalCompletionPopup = document.getElementById('goal-completion-popup');
var completedGoalName = document.getElementById('completed-goal-name');
var closePopup = document.getElementById('close-popup');
var userNameElement = document.getElementById('user-name');



let mayProceed =false;


contributionAmountInput.onblur = function(){
  if(contributionAmountInput.value === ""){
    addContributionError.innerText = "enter amount to contribute.*";
    mayProceed = false;
  }
  else if(isNaN(contributionAmountInput.value) ||
  contributionAmountInput.value <= 0){
    addContributionError.innerText = "enter a valid amount.*";
    mayProceed = false;
  }else if(contributionAmountInput.value> actualSum){
    addContributionError.innerText = "Limited Balance.";
    console.log(actualSum);
    mayProceed = false;
  }else{
    addContributionError.innerText = "";
    mayProceed = true;
  }
}
var goalContainer;
addContribution.onclick = function (event){
  event.preventDefault();

  if(mayProceed){

    let contributionAmount = contributionAmountInput.value;

    UserGoalArray.forEach((goal) => {
      if (goal.goalName === goalHeading.innerText && goal.goalEmail === userEmail && !(goal.goalAmount<=goal.currentContribution)) {
        goal.currentContribution = parseInt(goal.currentContribution) + parseInt(contributionAmount);
        
        if (goal.currentContribution >= goal.goalAmount) {
          goal.currentContribution = goal.goalAmount; 

          let completedGoals = JSON.parse(localStorage.getItem('completedGoals')) || [];
          if (!completedGoals.includes(goal.goalId)) {
            completedGoals.push(goal.goalId);
            localStorage.setItem('completedGoals', JSON.stringify(completedGoals));
          }
         
          userNameElement.innerText = userNames;
          completedGoalName.innerText = goal.goalName;
          goalCompletionPopup.style.display = "block";        

          let goalContainer = document.getElementById(`goal-container-${goal.goalId}`);
          
          if (goalContainer) {
            goalContainer.style.backgroundColor = " #32CD32";
          } else {
            console.log("Goal container not found ");
          }
          
         }//else{
        //   window.location.reload();
        // }
        
        localStorage.setItem("UserGoalArray", JSON.stringify(UserGoalArray));
        window.location.reload();
      }
    });

    document.getElementById("contribution-modal").style.display = "none";

  }

}


closePopup.onclick = function() {
  goalCompletionPopup.style.display = "none";
  window.location.reload();
};



//  the toggle 
const themeToggle = document.getElementById('theme-toggle');

if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
  themeToggle.checked = true;
} else {
  document.body.classList.remove('dark-mode');
  themeToggle.checked = false;
}


themeToggle.onchange =  function () {
  if (this.checked) {
    document.body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark'); 
  } else {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light'); 
  }
}
