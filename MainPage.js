"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.totalSavingsdisplay = exports.categoryProgress = exports.userEmails = exports.userNames = void 0;
exports.createRow = createRow;
exports.createGoalCard = createGoalCard;
const services_1 = require("./services/services");
const chart_js_1 = require("chart.js");
let UserAccountArray = JSON.parse(localStorage.getItem("UserArray") || "[]");
let profileName = document.getElementById("profile-name");
let logoutIcon = document.getElementById("logout-icon");
let remainingBalance = document.getElementById("remaining-balance-display");
// Find the user with login status in
let userAccount = UserAccountArray.find((user) => user.loggedStatus === "in");
if (userAccount) {
    profileName.innerText = userAccount.name;
    var userNames = userAccount.name;
    exports.userNames = userNames;
    var userEmails = userAccount.email;
    exports.userEmails = userEmails;
    console.log(userEmails);
}
else {
    console.error("No user is logged in.");
    // window.location.href = "SignIn.htm";
}
// Logout functionality
logoutIcon.onclick = function () {
    UserAccountArray.forEach((user) => {
        if (user.loggedStatus === "in" &&
            user.name === (userAccount === null || userAccount === void 0 ? void 0 : userAccount.name) &&
            user.email === (userAccount === null || userAccount === void 0 ? void 0 : userAccount.email)) {
            user.loggedStatus = "out";
        }
    });
    localStorage.setItem("UserArray", JSON.stringify(UserAccountArray));
    window.location.href = "SignIn.htm";
};
const transactionType = document.getElementById("transaction-type");
const categoryType = document.getElementById("category");
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
function updatecategoryOptions() {
    categoryType.innerHTML = "";
    const selectedCategories = transactionType.value === "Income" ? incomeCategories : expenseCategories;
    selectedCategories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.value;
        option.textContent = category.text;
        categoryType.appendChild(option);
    });
}
transactionType.onchange = function () {
    updatecategoryOptions();
};
window.onload = function () {
    updatecategoryOptions();
    expenseRepo.renderTransactions();
    goalRepo.renderGoals();
    expenseRepo.calculateTotals();
    expenseRepo.calculateSelectedExpense();
    goalRepo.calculateSavings();
};
const expenseRepo = new services_1.ExpenseRepository();
const transactionTypeElement = document.getElementById("transaction-type");
const categoryElement = document.getElementById("category");
const amountFieldElement = document.getElementById("amount-field");
const dateFieldElement = document.getElementById("date-field");
const addButtonElement = document.getElementById("expense-add-submit-button");
const amountErrorElement = document.getElementById("amount-error");
const dateErrorElement = document.getElementById("date-error");
const displayMainErrors = document.getElementById("display-main-errors");
// Validation Part
let isValidate = false;
let editingExpenseId = null;
amountFieldElement.onblur = function () {
    const amount = parseFloat(amountFieldElement.value);
    if (isNaN(amount) || amount <= 0) {
        amountErrorElement.innerText = "Please enter a valid amount.";
        isValidate = false;
    }
    else {
        amountErrorElement.innerText = "";
        isValidate = true;
    }
};
function validateDate() {
    const selectedDate = new Date(dateFieldElement.value);
    const today = new Date();
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return selectedDate >= firstDayOfMonth && selectedDate <= today;
}
dateFieldElement.onblur = function () {
    if (dateFieldElement.value === "") {
        dateErrorElement.innerText = "Please choose a date.*";
        isValidate = false;
    }
    else if (!validateDate()) {
        dateErrorElement.innerText = "Please select a date within this month.*";
        isValidate = false;
    }
    else {
        dateErrorElement.innerText = "";
        isValidate = true;
    }
};
// Function to create transaction rows in the table
function createRow(Usertransactions) {
    const tableBody = document.getElementById("transaction-body");
    let row = document.createElement("tr");
    let dateCell = document.createElement("td");
    dateCell.innerText = Usertransactions.date;
    row.appendChild(dateCell);
    let categoryCell = document.createElement("td");
    categoryCell.innerText = Usertransactions.category;
    row.appendChild(categoryCell);
    let amountCell = document.createElement("td");
    amountCell.innerText = Usertransactions.amount.toString();
    row.appendChild(amountCell);
    let deleteCell = document.createElement("td");
    let deleteButton = document.createElement("button");
    deleteButton.onclick = function () {
        expenseRepo.deleteTransaction(Usertransactions);
    };
    deleteButton.innerText = "Delete";
    deleteButton.classList.add("transaction-delete-button");
    deleteCell.appendChild(deleteButton);
    row.appendChild(deleteCell);
    let editCell = document.createElement("td");
    let editButton = document.createElement("button");
    editButton.onclick = function () {
        transactionTypeElement.value = Usertransactions.transactionType;
        updatecategoryOptions();
        categoryElement.value = Usertransactions.category;
        amountFieldElement.value = Usertransactions.amount.toString();
        dateFieldElement.value = Usertransactions.date;
        editingExpenseId = Usertransactions.id;
    };
    editButton.innerText = "Edit";
    editButton.classList.add("transaction-edit-button");
    editCell.appendChild(editButton);
    row.appendChild(editCell);
    tableBody.appendChild(row);
}
function clearFormFields() {
    transactionTypeElement.value = "";
    categoryElement.value = "";
    amountFieldElement.value = "";
    dateFieldElement.value = "";
}
//Find Percentage;
var calculatePercentage = document.getElementById("percentage-calculator");
var categoryProgress = document.getElementById("category-progress");
exports.categoryProgress = categoryProgress;
calculatePercentage.onclick = function (e) {
    e.preventDefault();
    expenseRepo.expenseCategories();
};
addButtonElement.onclick = function (event) {
    event.preventDefault();
    if (isValidate) {
        let isFormValid = true;
        const amount = parseFloat(amountFieldElement.value);
        if (isNaN(amount) || amount <= 0) {
            amountErrorElement.innerText = "Please enter a valid amount.";
            isFormValid = false;
        }
        else {
            amountErrorElement.innerText = "";
        }
        if (dateFieldElement.value === "") {
            dateErrorElement.innerText = "Please choose a date.*";
            isFormValid = false;
        }
        else if (!validateDate()) {
            dateErrorElement.innerText = "Please select a date within this month.*";
            isFormValid = false;
        }
        else {
            dateErrorElement.innerText = "";
        }
        if (isFormValid) {
            const newExpense = {
                id: editingExpenseId !== null
                    ? editingExpenseId
                    : Math.floor(Math.random() * 90) + 10,
                email: userEmails,
                transactionType: transactionTypeElement.value,
                category: categoryElement.value,
                amount: parseFloat(amountFieldElement.value),
                date: dateFieldElement.value,
            };
            if (transactionTypeElement.value === "Expense") {
                let currentRemainingBalance = parseFloat(remainingBalance.innerText.replace("$", ""));
                if (amount > currentRemainingBalance) {
                    displayMainErrors.innerText =
                        "This expense exceeds your remaining balance.";
                    console.log("This expense exceeds your remaining balance.");
                    return;
                }
            }
            if (editingExpenseId !== null) {
                expenseRepo.editTransaction(editingExpenseId, newExpense);
                editingExpenseId = null;
            }
            else {
                expenseRepo.addTransaction(newExpense);
                clearFormFields();
            }
            window.location.reload();
            console.log("Form is valid. Transaction added.");
        }
        else {
            console.log("Form validation failed.");
        }
    }
    else {
        displayMainErrors.innerText =
            "please fill all the fields.*";
        console.log("Form validation failed.");
    }
};
// Savings and goal part starting
// Modals part
var editGoalCloseButton = document.getElementById('close-btn-cross');
editGoalCloseButton.onclick = function () {
    closeEditGoalModal();
};
var editGoalCancelButton = document.getElementById('edit-goal-cancel-button');
editGoalCancelButton.onclick = function () {
    closeGoalModal();
};
var contributionClosePopup = document.getElementById('contribution-close-popup');
contributionClosePopup.onclick = function () {
    closeModal();
};
var contributionCancelButton = document.getElementById('contibution-cancel-button');
contributionCancelButton.onclick = function () {
    closeModal();
};
var addGoalPopUpCancel = document.getElementById('add-goal-popup');
addGoalPopUpCancel.onclick = function () {
    closeGoalModal();
};
var addGoalPopUpclose = document.getElementById('add-goal-close-button');
addGoalPopUpclose.onclick = function () {
    closeGoalModal();
};
var addgoals = document.getElementById('add-goals');
addgoals.onclick = function () {
    openGoalModal();
};
function closeModal() {
    let contributionModal = document.getElementById("contribution-modal");
    contributionModal.style.display = "none";
}
function openGoalModal() {
    let openAddGoalModal = document.getElementById("add-goal-modal");
    openAddGoalModal.style.display = "flex";
}
let editGoalID = null;
function editGoalModal(goalID, goalName, goalAmount) {
    let editGoalModal = document.getElementById("edit-goal-modal");
    let editGoalNameField = document.getElementById('edit-goal-name');
    let editGoalAmountField = document.getElementById('edit-goal-amount');
    console.log(goalName);
    editGoalNameField.value = goalName;
    editGoalAmountField.value = goalAmount.toString();
    editGoalModal.style.display = "flex";
    editGoalID = goalID;
    //console.log(editGoalID);
}
function closeEditGoalModal() {
    let editGoalMoal = document.getElementById("edit-goal-modal");
    editGoalMoal.style.display = "none";
}
function closeGoalModal() {
    let closeAddGoalModal = document.getElementById("add-goal-modal");
    closeAddGoalModal.style.display = "none";
}
let currentGoalID = null;
function openModal(goalName, currentContribution, goalAmount, goalID) {
    const openContributionModel = document.getElementById("contribution-modal");
    openContributionModel.style.display = "flex";
    let contributionStatus = document.getElementById("contribution-status");
    let goalAmountStatus = document.getElementById("goal-amount-status");
    let goalHeading = document.getElementById("goal-heading");
    contributionStatus.innerText = `${currentContribution}`;
    goalAmountStatus.innerText = `${goalAmount}`;
    goalHeading.innerText = goalName;
    currentGoalID = goalID;
}
const goalRepo = new services_1.GoalRepository();
function createGoalCard(goal) {
    const goalCard = document.createElement("div");
    goalCard.classList.add("goal-card");
    goalCard.id = `goal-container-${goal.goalId}`;
    console.log(goalCard.id);
    if (goal.goalStatus === "yes") {
        goalCard.style.backgroundColor = "#32CD32";
    }
    // Create and append the goal name
    const goalName = document.createElement("h3");
    goalName.textContent = goal.goalName;
    goalCard.appendChild(goalName);
    // Create and append the progress bar
    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");
    const progress = document.createElement("div");
    progress.classList.add("progress");
    progress.style.width = `${Math.min((goal.goalContribution / goal.goalAmount) * 100, 100)}%`;
    progressBar.appendChild(progress);
    goalCard.appendChild(progressBar);
    // Create and append the contribution percentage
    const contribution = document.createElement("div");
    contribution.classList.add("contribution");
    const contributionSpan = document.createElement("span");
    contributionSpan.textContent = `${Math.min(parseFloat(((goal.goalContribution / goal.goalAmount) * 100).toFixed(1)), 100)}% achieved`;
    contribution.appendChild(contributionSpan);
    goalCard.appendChild(contribution);
    // Create and append buttons
    const arrangeButtons = document.createElement("div");
    arrangeButtons.classList.add("arrange-buttons");
    // Create and append contribute button
    const contributeBtn = document.createElement("button");
    contributeBtn.classList.add("contribute-btn");
    contributeBtn.textContent = "+";
    contributeBtn.onclick = function () {
        openModal(goal.goalName, goal.goalContribution, goal.goalAmount, goal.goalId);
    };
    arrangeButtons.appendChild(contributeBtn);
    // Create and append delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-goal-btn");
    deleteBtn.textContent = "-";
    deleteBtn.onclick = function () {
        goalRepo.deleteGoals(goal.goalId);
    };
    arrangeButtons.appendChild(deleteBtn);
    // Create and append edit button
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-goal-btn");
    editBtn.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
    editBtn.onclick = function () {
        editGoalModal(goal.goalId, goal.goalName, goal.goalAmount);
    };
    arrangeButtons.appendChild(editBtn);
    goalCard.appendChild(arrangeButtons);
    // Append the goalCard to the goals container
    const goalsContainer = document.getElementById("goals-container");
    goalsContainer.appendChild(goalCard);
}
var totalSavingsdisplay = document.getElementById("total-savings");
exports.totalSavingsdisplay = totalSavingsdisplay;
let goalNameInput = document.getElementById("goal-name");
let goalAmountInput = document.getElementById("goal-amount");
let goalContributionInput = document.getElementById("current-contribution");
let goalNameError = document.getElementById("goal-name-error");
let goalAmountError = document.getElementById("goal-amount-error");
let goalContributionError = document.getElementById("goal-contribution-error");
let goalErrors = document.getElementById("add-goal-main-errors");
let goalFormButton = document.getElementById("goal-submit-button");
let canProceed = false;
goalNameInput.onblur = function () {
    if (goalNameInput.value === "") {
        goalNameError.innerText = "the name field is empty.";
        canProceed = false;
    }
    else {
        goalNameError.innerText = "";
        canProceed = true;
    }
};
goalAmountInput.onblur = function () {
    if (goalAmountInput.value === "") {
        goalAmountError.innerText = "please enter a amount.*";
        canProceed = false;
    }
    else if (isNaN(parseFloat(goalAmountInput.value)) ||
        parseFloat(goalAmountInput.value) <= 0) {
        goalAmountError.innerText = "please enter a valid amount.*";
        canProceed = false;
    }
    else {
        goalAmountError.innerText = "";
        canProceed = true;
    }
};
goalContributionInput.onblur = function () {
    if (goalContributionInput.value === "") {
        goalContributionError.innerText = "please enter a amount.*";
        canProceed = false;
    }
    else if (isNaN(parseFloat(goalAmountInput.value)) ||
        parseFloat(goalAmountInput.value) <= 0) {
        goalContributionError.innerText = "please enter a valid amount.*";
        canProceed = false;
    }
    else {
        goalContributionError.innerText = "";
        canProceed = true;
    }
};
goalFormButton.onclick = function (e) {
    e.preventDefault();
    let currentRemainingBalance = parseFloat(remainingBalance.innerText.replace("$", ""));
    const remainingStatus = currentRemainingBalance;
    const userGoalName = goalNameInput.value;
    const userGoalAmount = parseInt(goalAmountInput.value);
    const userGoalContribution = parseInt(goalContributionInput.value);
    const userGoalId = Math.floor(Math.random() * 90) + 10;
    if (canProceed) {
        goalErrors.innerText = "";
        if (userGoalAmount > userGoalContribution) {
            goalErrors.innerText = "";
        }
        else {
            goalErrors.innerText = "Enter a valid contribution.";
            return;
        }
        if (!(userGoalContribution < remainingStatus)) {
            console.log(remainingStatus);
            goalErrors.innerText = "Limited Balance.";
            return;
        }
        const userGoal = {
            goalId: userGoalId,
            goalEmail: userEmails,
            goalName: userGoalName,
            goalAmount: userGoalAmount,
            goalContribution: userGoalContribution,
            goalStatus: "not",
        };
        goalRepo.addGoals(userGoal);
    }
    else {
        goalErrors.innerText = "Check the fields before you submit.";
    }
};
var editGoalNamefield = document.getElementById("edit-goal-name");
var editGoalAmountfield = document.getElementById("edit-goal-amount");
var editNameError = document.getElementById("edit-goal-name-error");
var editAmountError = document.getElementById("edit-goal-amount-error");
var editMainErrors = document.getElementById("edit-goal-main-errors");
var editGoalButton = document.getElementById("goal-edit-button");
let proceed = false;
editGoalNamefield.onblur = function () {
    if (editGoalNamefield.value === "") {
        editNameError.innerText = "please enter a goal name.*";
        proceed = false;
    }
    else if (!isNaN(parseFloat(editGoalNamefield.value))) {
        editNameError.innerText = "please enter a valid Name.";
        proceed = false;
    }
    else {
        proceed = true;
    }
};
editGoalAmountfield.onblur = function () {
    if (editGoalAmountfield.value === "") {
        editAmountError.innerText = "enter a valid number.";
        proceed = false;
    }
    else if (parseFloat(editGoalAmountfield.value) <= 0) {
        editAmountError.innerText = "enter a valid number.";
        proceed = false;
    }
    else {
        proceed = true;
    }
};
editGoalButton.onclick = function (event) {
    event.preventDefault();
    const goalID = editGoalID;
    const editName = editGoalNamefield.value;
    const editAmount = parseFloat(editGoalAmountfield.value);
    if (proceed) {
        editMainErrors.innerText = "";
        goalRepo.editGoal(goalID, editName, editAmount);
    }
    else {
        editMainErrors.innerText = "Complete the fields to submit.*";
        return;
    }
};
var addContribution = document.getElementById("goal-contribution-submit-button");
var contributionAmountInput = document.getElementById("contribution-amount");
var addContributionError = document.getElementById("add-contribution-error");
let mayProceed = false;
contributionAmountInput.onblur = function () {
    let currentRemainingBalance = parseFloat(remainingBalance.innerText.replace("$", ""));
    const remainingStatus = currentRemainingBalance;
    if (contributionAmountInput.value === "") {
        addContributionError.innerText = "enter amount to contribute.*";
        mayProceed = false;
    }
    else if (isNaN(parseFloat(contributionAmountInput.value)) ||
        parseFloat(contributionAmountInput.value) <= 0) {
        addContributionError.innerText = "enter a valid amount.*";
        mayProceed = false;
    }
    else if (parseFloat(contributionAmountInput.value) > remainingStatus) {
        addContributionError.innerText = "Limited Balance.";
        console.log(remainingStatus);
        mayProceed = false;
    }
    else {
        addContributionError.innerText = "";
        mayProceed = true;
    }
};
addContribution.onclick = function (event) {
    event.preventDefault();
    let smallContribute = parseFloat(contributionAmountInput.value);
    const goalID = currentGoalID;
    console.log(goalID);
    if (mayProceed) {
        const userGoal = goalRepo.goals.filter((goal) => goal.goalId === currentGoalID);
        userGoal.forEach((goal) => {
            if (goal.goalAmount === goal.goalContribution) {
                addContributionError.innerText = "Already reached the goal.*";
                return;
            }
            else {
                var temp = 0;
                if (goal.goalId === currentGoalID &&
                    goal.goalEmail === userEmails &&
                    goal.goalStatus !== "yes") {
                    temp = goal.goalContribution + smallContribute;
                }
                if (!(temp <= goal.goalAmount && goal.goalId === currentGoalID)) {
                    console.log(temp);
                    addContributionError.innerText = "this contribution will exceed the goal.";
                    return;
                }
                else {
                    goal.goalContribution += smallContribute;
                }
                if (goal.goalContribution === goal.goalAmount &&
                    goal.goalStatus !== "yes") {
                    goal.goalStatus = "yes";
                    //alert('your goal is completed successfully.');
                    closeModal();
                    var goalCompletionPopup = document.getElementById("goal-completion-popup");
                    var completedGoalName = document.getElementById("completed-goal-name");
                    var closePopup = document.getElementById("close-popup");
                    var userNameElement = document.getElementById("user-name");
                    userNameElement.innerText = userNames;
                    completedGoalName.innerText = goal.goalName;
                    goalCompletionPopup.style.display = "block";
                }
            }
        });
        setTimeout(() => {
            goalRepo.saveGoalsToLocalStorage();
            goalRepo.renderGoals();
            window.location.reload();
            goalRepo.calculateSavings();
        }, 5000);
    }
};
const themeToggle = document.getElementById("theme-toggle");
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.checked = true;
}
else {
    document.body.classList.remove("dark-mode");
    themeToggle.checked = false;
}
themeToggle.onchange = function () {
    if (themeToggle.checked) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
    }
    else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
    }
};
console.log(expenseRepo.getFoodSum());
console.log(expenseRepo.otherssum);
// Register the necessary components
chart_js_1.Chart.register(chart_js_1.PieController, chart_js_1.ArcElement, chart_js_1.Title, chart_js_1.Legend, chart_js_1.Tooltip);
// Get the canvas element
const canvas = document.getElementById('myChart');
if (canvas) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
        // Define data and configuration for the pie chart
        const data = {
            labels: ["Food", "Education", "Medicine", "others"],
            datasets: [{
                    backgroundColor: ["#b91d47", "#00aba9", "#2b5797", "#e8c3b9", "#1e7145"],
                    data: [((expenseRepo.foodsum / expenseRepo.totalIncomes) * 100), ((expenseRepo.educationsum / expenseRepo.totalIncomes) * 100), ((expenseRepo.medicinesum / expenseRepo.totalIncomes) * 100), ((expenseRepo.otherssum / expenseRepo.totalIncomes) * 100)]
                }]
        };
        const config = {
            type: 'pie',
            data: data,
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Expense Statistics'
                    },
                    Legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        };
        // Create and render the pie chart
        new chart_js_1.Chart(ctx, config);
    }
    else {
        console.error('2D context not available.');
    }
}
else {
    console.error("Canvas element with ID 'myChart' not found.");
}
