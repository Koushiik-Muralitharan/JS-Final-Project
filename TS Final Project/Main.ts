// Get the UserArray from localStorage and parse it
let UserAccountArray: { name: string; email: string; loggedStatus: string }[] =
  JSON.parse(localStorage.getItem("UserArray") || "[]");

// Get HTML elements
let profileName = document.getElementById("profile-name") as HTMLElement;
let logoutIcon = document.getElementById("logout-icon") as HTMLElement;
let remainingBalance = document.getElementById(
  "remaining-balance-display"
) as HTMLElement;

// Find the logged-in user
let userAccount = UserAccountArray.find((user) => user.loggedStatus === "in");

// If the logged-in user is found, display their name
if (userAccount) {
  profileName.innerText = userAccount.name;
  var userNames = userAccount.name;
  var userEmails = userAccount.email;
  console.log(userEmails);
} else {
  console.error("No user is logged in.");
}

// Logout functionality
logoutIcon.onclick = function () {
  UserAccountArray.forEach((user) => {
    if (
      user.loggedStatus === "in" &&
      user.name === userAccount?.name &&
      user.email === userAccount?.email
    ) {
      user.loggedStatus = "out";
    }
  });

  localStorage.setItem("UserArray", JSON.stringify(UserAccountArray));
  window.location.href = "SignIn.htm";
};

// Get the elements from the DOM and define their types
const transactionType = document.getElementById(
  "transaction-type"
) as HTMLSelectElement;
const categoryType = document.getElementById("category") as HTMLSelectElement;

// Define the types for category objects
interface category {
  value: string;
  text: string;
}

// Define arrays of categories for income and expenses
const incomeCategories: category[] = [
  { value: "salary", text: "Salary" },
  { value: "investment", text: "Investment" },
  { value: "other", text: "Other Income" },
];

const expenseCategories: category[] = [
  { value: "food", text: "Food" },
  { value: "education", text: "Education" },
  { value: "medicine", text: "Medicine" },
  { value: "others", text: "Others" },
];

// Function to update the category options based on transaction type
function updatecategoryOptions(): void {
  categoryType.innerHTML = ""; // Clear existing options
  const selectedCategories: category[] =
    transactionType.value === "Income" ? incomeCategories : expenseCategories;

  selectedCategories.forEach((category: category) => {
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

interface Expense {
  id: number;
  email: string;
  transactionType: string;
  category: string;
  amount: number;
  date: string;
}

class ExpenseRepository {
  public localStorageKey = "expenses";
  public expenses: Expense[] = [];

  constructor() {
    this.expenses = this.ExpensesLocalStorage();
  }

  public ExpensesLocalStorage(): Expense[] {
    const storedExpenses = localStorage.getItem(this.localStorageKey);
    return storedExpenses ? JSON.parse(storedExpenses) : [];
  }

  public saveExpensesToLocalStorage(): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.expenses));
  }

  public addTransaction(expense: Expense): void {
    this.expenses.push(expense);
    this.saveExpensesToLocalStorage();
    expenseRepo.renderTransactions();
    console.log("Transaction added:", expense);
    
  }

  public deleteTransaction(expense: Expense): void {
    this.expenses = this.expenses.filter((e) => e.id !== expense.id);
    this.saveExpensesToLocalStorage();
    console.log("Transaction deleted:", expense);
    this.renderTransactions(); // Re-render the table after deletion
  }

  public editTransaction(id: number, updatedExpense: Partial<Expense>): void {
    const index = this.expenses.findIndex((expense) => expense.id === id);
    if (index !== -1) {
      this.expenses[index] = { ...this.expenses[index], ...updatedExpense };
      this.saveExpensesToLocalStorage();
      this.renderTransactions();
      console.log("Transaction updated:", this.expenses[index]);
    } else {
      console.log("Transaction not found.");
    }
  }

  // Method to re-render the table after deletion
  public renderTransactions(): void {
    const tableBody = document.getElementById(
      "transaction-body"
    ) as HTMLTableSectionElement;
    tableBody.innerHTML = "";
    this.expenses.forEach((expense) => {
      if (expense.email === userEmails) {
        createRow(expense);
      }
    });
  }

  calculateTotals(): void {
    let incomeSum = 0;
    let expenseSum = 0;

    // Assuming UserTransactionsArray and userEmail are already defined and of proper types
    this.expenses.forEach(
      (transaction: {
        email: string;
        transactionType: string;
        amount: number;
      }) => {
        if (transaction.email === userEmails) {
          if (transaction.transactionType === "Income") {
            incomeSum += transaction.amount; // No need for parseFloat since amount is a number
          } else if (transaction.transactionType === "Expense") {
            expenseSum += transaction.amount;
          }
        }
      }
    );

    // Assuming totalIncome, totalExpense, and remainingBalance are properly typed HTML elements
    const totalIncome = document.getElementById("total-income-display") as HTMLElement;
    const totalExpense = document.getElementById(
      "total-expenses-display"
    ) as HTMLElement;
    const remainingBalance = document.getElementById(
      "remaining-balance-display"
    ) as HTMLElement;

    totalIncome.innerText = `$${incomeSum.toFixed(2)}`;
    totalExpense.innerText = `$${expenseSum.toFixed(2)}`;

    const remaining = incomeSum - expenseSum;
    remainingBalance.innerText = `$${remaining.toFixed(2)}`;

    // Store the remaining balance in localStorage
    localStorage.setItem("UserBalance", JSON.stringify(remaining));
  }

  expenseCategories(): void {
    //var categoryProgress = document.getElementById('category-progress');
    let incomeSums = 0;
    let expenseSums = 0;
    let categoryValue = categoryProgress.value;
  
    // Check if the user has any transactions
    let res = this.expenses.some((transaction) => transaction.email === userEmails);
    console.log(res);
  
    if (!res) {
      alert("Add transactions to view the statistics.");
    } else {
      // Iterate through the transactions
      this.expenses.forEach((transaction) => {
        if (transaction.email === userEmails) {
          if (transaction.transactionType === "Income") {
            // Sum all income (handle both string and number)
            incomeSums += typeof transaction.amount === 'string' ? parseFloat(transaction.amount) : transaction.amount;
          } else if (transaction.transactionType === "Expense") {
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
      } else if (percentage > 100) {
        percentage = 100;
      }
  
      // Update the progress bar and progress text
      let progressBar = document.getElementById('progress') as HTMLElement;
      let progressText = document.getElementById('progress-text') as HTMLElement;
  
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
const transactionTypeElement = document.getElementById(
  "transaction-type"
) as HTMLSelectElement;
const categoryElement = document.getElementById(
  "category"
) as HTMLSelectElement;
const amountFieldElement = document.getElementById(
  "amount-field"
) as HTMLInputElement;
const dateFieldElement = document.getElementById(
  "date-field"
) as HTMLInputElement;
const addButtonElement = document.getElementById(
  "expense-add-submit-button"
) as HTMLButtonElement;

// Get the error display elements
const amountErrorElement = document.getElementById(
  "amount-error"
) as HTMLSpanElement;
const dateErrorElement = document.getElementById(
  "date-error"
) as HTMLSpanElement;
const mainErrorElement = document.getElementById(
  "display-main-errors"
) as HTMLSpanElement;

let isValidate: boolean = false;
let editingExpenseId: number | null = null;
// Amount Validation
amountFieldElement.onblur = function () {
  const amount = parseFloat(amountFieldElement.value);
  if (isNaN(amount) || amount <= 0) {
    amountErrorElement.innerText = "Please enter a valid amount.";
    isValidate = false;
  } else {
    amountErrorElement.innerText = "";
    isValidate = true;
  }
};

// Function to validate the date
function validateDate(): boolean {
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
  } else if (!validateDate()) {
    dateErrorElement.innerText = "Please select a date within this month.*";
    isValidate = false;
  } else {
    dateErrorElement.innerText = "";
    isValidate = true;
  }
};

// Function to create and append rows in the table
function createRow(Usertransactions: Expense) {
  const tableBody = document.getElementById(
    "transaction-body"
  ) as HTMLTableSectionElement;

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

var calculatePercentage = document.getElementById('percentage-calculator') as HTMLButtonElement;
var categoryProgress = document.getElementById('category-progress') as HTMLSelectElement;
calculatePercentage.onclick = function (e){
  e.preventDefault();
  expenseRepo.expenseCategories();
}

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
   } else {
       amountErrorElement.innerText = ''; 
   }

   // Date validation
   if (dateFieldElement.value === "") {
       dateErrorElement.innerText = "Please choose a date.*";
       isFormValid = false;
   } else if (!validateDate()) {
       dateErrorElement.innerText = "Please select a date within this month.*";
       isFormValid = false;
   } else {
       dateErrorElement.innerText = "";
   }

   // Check if the entire form is valid before proceeding
   if(isFormValid){
     // Gather form data

    


     const newExpense: Expense = {
        id:
          editingExpenseId !== null
            ? editingExpenseId
            : Math.floor(Math.random() * 90) + 10,
        email: userEmails,
        transactionType: transactionTypeElement.value,
        category: categoryElement.value,
        amount: parseFloat(amountFieldElement.value),
        date: dateFieldElement.value,
      };

      if (transactionTypeElement.value === "Expense") {
        let currentRemainingBalance = parseFloat(
          remainingBalance.innerText.replace("$", "")
        );
  
        if (amount > currentRemainingBalance) {
        //   displayMainErrors.innerText =
        //     "This expense exceeds your remaining balance.";
        console.log("This expense exceeds your remaining balance.")
          return; 
        }
      }
  
      if (editingExpenseId !== null) {
        // Edit the existing expense
        expenseRepo.editTransaction(editingExpenseId, newExpense);
        editingExpenseId = null; // Reset editing ID
      } else {
        // Add a new transaction
        expenseRepo.addTransaction(newExpense);
        clearFormFields();
      }
      window.location.reload();
      console.log("Form is valid. Transaction added.");

   }else{
    console.log('Form validation failed.');
   }
  
   
  } else {
    console.log("Form validation failed.");
  }
};
