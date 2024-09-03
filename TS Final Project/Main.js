"use strict";
// Get the UserArray from localStorage and parse it
let UserAccountArray = JSON.parse(localStorage.getItem("UserArray") || "[]");
// Get HTML elements
let profileName = document.getElementById("profile-name");
let logoutIcon = document.getElementById("logout-icon");
let remainingBalance = document.getElementById("remaining-balance-display");
// Find the logged-in user
let userAccount = UserAccountArray.find((user) => user.loggedStatus === "in");
// If the logged-in user is found, display their name
if (userAccount) {
    profileName.innerText = userAccount.name;
    var userNames = userAccount.name;
    var userEmails = userAccount.email;
    console.log(userEmails);
}
else {
    console.error("No user is logged in.");
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
// Get the elements from the DOM and define their types
const transactionType = document.getElementById("transaction-type");
const categoryType = document.getElementById("category");
// Define arrays of categories for income and expenses
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
// Function to update the category options based on transaction type
function updatecategoryOptions() {
    categoryType.innerHTML = ""; // Clear existing options
    const selectedCategories = transactionType.value === "Income" ? incomeCategories : expenseCategories;
    selectedCategories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.value;
        option.textContent = category.text;
        categoryType.appendChild(option);
    });
}
// Attach the event handler to the transaction type dropdown
transactionType.onchange = function () {
    updatecategoryOptions();
};
window.onload = function () {
    updatecategoryOptions();
    expenseRepo.renderTransactions();
    expenseRepo.calculateTotals();
};
class ExpenseRepository {
    constructor() {
        this.localStorageKey = "expenses";
        this.expenses = [];
        this.expenses = this.ExpensesLocalStorage();
    }
    ExpensesLocalStorage() {
        const storedExpenses = localStorage.getItem(this.localStorageKey);
        return storedExpenses ? JSON.parse(storedExpenses) : [];
    }
    saveExpensesToLocalStorage() {
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.expenses));
    }
    addTransaction(expense) {
        this.expenses.push(expense);
        this.saveExpensesToLocalStorage();
        expenseRepo.renderTransactions();
        console.log("Transaction added:", expense);
    }
    deleteTransaction(expense) {
        this.expenses = this.expenses.filter((e) => e.id !== expense.id);
        this.saveExpensesToLocalStorage();
        console.log("Transaction deleted:", expense);
        this.renderTransactions(); // Re-render the table after deletion
    }
    editTransaction(id, updatedExpense) {
        const index = this.expenses.findIndex((expense) => expense.id === id);
        if (index !== -1) {
            this.expenses[index] = Object.assign(Object.assign({}, this.expenses[index]), updatedExpense);
            this.saveExpensesToLocalStorage();
            this.renderTransactions();
            console.log("Transaction updated:", this.expenses[index]);
        }
        else {
            console.log("Transaction not found.");
        }
    }
    // Method to re-render the table after deletion
    renderTransactions() {
        const tableBody = document.getElementById("transaction-body");
        tableBody.innerHTML = "";
        this.expenses.forEach((expense) => {
            if (expense.email === userEmails) {
                createRow(expense);
            }
        });
    }
    calculateTotals() {
        let incomeSum = 0;
        let expenseSum = 0;
        // Assuming UserTransactionsArray and userEmail are already defined and of proper types
        this.expenses.forEach((transaction) => {
            if (transaction.email === userEmails) {
                if (transaction.transactionType === "Income") {
                    incomeSum += transaction.amount; // No need for parseFloat since amount is a number
                }
                else if (transaction.transactionType === "Expense") {
                    expenseSum += transaction.amount;
                }
            }
        });
        // Assuming totalIncome, totalExpense, and remainingBalance are properly typed HTML elements
        const totalIncome = document.getElementById("total-income-display");
        const totalExpense = document.getElementById("total-expenses-display");
        const remainingBalance = document.getElementById("remaining-balance-display");
        totalIncome.innerText = `$${incomeSum.toFixed(2)}`;
        totalExpense.innerText = `$${expenseSum.toFixed(2)}`;
        const remaining = incomeSum - expenseSum;
        remainingBalance.innerText = `$${remaining.toFixed(2)}`;
        // Store the remaining balance in localStorage
        localStorage.setItem("UserBalance", JSON.stringify(remaining));
    }
    expenseCategories() {
        //var categoryProgress = document.getElementById('category-progress');
        let incomeSums = 0;
        let expenseSums = 0;
        let categoryValue = categoryProgress.value;
        // Check if the user has any transactions
        let res = this.expenses.some((transaction) => transaction.email === userEmails);
        console.log(res);
        if (!res) {
            alert("Add transactions to view the statistics.");
        }
        else {
            // Iterate through the transactions
            this.expenses.forEach((transaction) => {
                if (transaction.email === userEmails) {
                    if (transaction.transactionType === "Income") {
                        // Sum all income (handle both string and number)
                        incomeSums += typeof transaction.amount === 'string' ? parseFloat(transaction.amount) : transaction.amount;
                    }
                    else if (transaction.transactionType === "Expense") {
                        // Sum the expenses for the selected category
                        if (transaction.category === categoryValue) {
                            expenseSums += typeof transaction.amount === 'string' ? parseFloat(transaction.amount) : transaction.amount;
                        }
                    }
                }
            });
            // Calculate the percentage of expenses
            let percentage = (expenseSums / incomeSums) * 100;
            if (isNaN(percentage) || percentage < 0) {
                percentage = 0;
            }
            else if (percentage > 100) {
                percentage = 100;
            }
            // Update the progress bar and progress text
            let progressBar = document.getElementById('progress');
            let progressText = document.getElementById('progress-text');
            if (progressBar && progressText) {
                progressBar.style.width = `${percentage}%`;
                progressText.innerText = `${percentage.toFixed(2)}% of amount for ${categoryValue}`;
            }
        }
    }
}
// Initialize repository
const expenseRepo = new ExpenseRepository();
// Get the input elements
const transactionTypeElement = document.getElementById("transaction-type");
const categoryElement = document.getElementById("category");
const amountFieldElement = document.getElementById("amount-field");
const dateFieldElement = document.getElementById("date-field");
const addButtonElement = document.getElementById("expense-add-submit-button");
// Get the error display elements
const amountErrorElement = document.getElementById("amount-error");
const dateErrorElement = document.getElementById("date-error");
const mainErrorElement = document.getElementById("display-main-errors");
let isValidate = false;
let editingExpenseId = null;
// Amount Validation
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
// Function to validate the date
function validateDate() {
    const selectedDate = new Date(dateFieldElement.value);
    const today = new Date();
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return selectedDate >= firstDayOfMonth && selectedDate <= today;
}
// Add Expense Form Validation for the Date field
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
// Function to create and append rows in the table
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
        // Populate form with expense data for editing
        transactionTypeElement.value = Usertransactions.transactionType;
        categoryElement.value = Usertransactions.category;
        amountFieldElement.value = Usertransactions.amount.toString();
        dateFieldElement.value = Usertransactions.date;
        editingExpenseId = Usertransactions.id; // Set the ID of the expense being edited
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
var calculatePercentage = document.getElementById('percentage-calculator');
var categoryProgress = document.getElementById('category-progress');
calculatePercentage.onclick = function (e) {
    e.preventDefault();
    expenseRepo.expenseCategories();
};
addButtonElement.onclick = function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();
    if (isValidate) {
        // Re-validate all fields upon submission
        let isFormValid = true;
        // Amount validation
        const amount = parseFloat(amountFieldElement.value);
        if (isNaN(amount) || amount <= 0) {
            amountErrorElement.innerText = 'Please enter a valid amount.';
            isFormValid = false;
        }
        else {
            amountErrorElement.innerText = '';
        }
        // Date validation
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
        // Check if the entire form is valid before proceeding
        if (isFormValid) {
            // Gather form data
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
                    //   displayMainErrors.innerText =
                    //     "This expense exceeds your remaining balance.";
                    console.log("This expense exceeds your remaining balance.");
                    return;
                }
            }
            if (editingExpenseId !== null) {
                // Edit the existing expense
                expenseRepo.editTransaction(editingExpenseId, newExpense);
                editingExpenseId = null; // Reset editing ID
            }
            else {
                // Add a new transaction
                expenseRepo.addTransaction(newExpense);
                clearFormFields();
            }
            window.location.reload();
            console.log("Form is valid. Transaction added.");
        }
        else {
            console.log('Form validation failed.');
        }
    }
    else {
        console.log("Form validation failed.");
    }
};
