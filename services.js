"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalRepository = exports.ExpenseRepository = void 0;
const MainPage_1 = require("../MainPage");
const MainPage_2 = require("../MainPage");
class ExpenseRepository {
    constructor() {
        this.localStorageKey = "expenses";
        this.expenses = [];
        this.savings = 0;
        this.foodsum = 0;
        this.educationsum = 0;
        this.medicinesum = 0;
        this.otherssum = 0;
        this.totalIncomes = 0;
        this.expenses = this.ExpensesLocalStorage();
    }
    getFoodSum() {
        return this.foodsum;
    }
    getEducationSum() {
        return this.educationsum;
    }
    getMedicineSum() {
        return this.medicinesum;
    }
    getOthersSum() {
        return this.otherssum;
    }
    getTotalIncomes() {
        return this.totalIncomes;
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
        this.renderTransactions();
        console.log("Transaction added:", expense);
    }
    deleteTransaction(expense) {
        this.expenses = this.expenses.filter((e) => e.id !== expense.id);
        this.saveExpensesToLocalStorage();
        console.log("Transaction deleted:", expense);
        this.renderTransactions();
        window.location.reload();
    }
    editTransaction(id, updatedExpense) {
        const index = this.expenses.findIndex((expense) => expense.id === id);
        if (index !== -1) {
            this.expenses[index] = updatedExpense;
            this.saveExpensesToLocalStorage();
            this.renderTransactions();
            console.log("Transaction updated:", this.expenses[index]);
        }
        else {
            console.log("Transaction not found.");
        }
    }
    renderTransactions() {
        const tableBody = document.getElementById("transaction-body");
        tableBody.innerHTML = "";
        this.expenses.forEach((expense) => {
            if (expense.email === MainPage_2.userEmails) {
                (0, MainPage_1.createRow)(expense);
            }
        });
    }
    calculateTotals() {
        let incomeSum = 0;
        let expenseSum = 0;
        this.expenses.forEach((transaction) => {
            if (transaction.email === MainPage_2.userEmails) {
                if (transaction.transactionType === "Income") {
                    incomeSum += transaction.amount;
                }
                else if (transaction.transactionType === "Expense") {
                    expenseSum += transaction.amount;
                }
            }
        });
        const totalIncome = document.getElementById("total-income-display");
        const totalExpense = document.getElementById("total-expenses-display");
        const remainingBalance = document.getElementById("remaining-balance-display");
        expenseSum += this.savings;
        this.totalIncomes = incomeSum;
        totalIncome.innerText = `$${incomeSum.toFixed(2)}`;
        totalExpense.innerText = `$${expenseSum.toFixed(2)}`;
        const remaining = incomeSum - expenseSum;
        remainingBalance.innerText = `$${remaining.toFixed(2)}`;
        this.calculateSelectedExpense();
    }
    calculateSelectedExpense() {
        this.foodsum = 10;
        this.educationsum = 0;
        this.medicinesum = 0;
        this.otherssum = 0;
        this.expenses.forEach((transaction) => {
            if (transaction.category === 'food') {
                this.foodsum += transaction.amount;
            }
            else if (transaction.category === 'education') {
                this.educationsum += transaction.amount;
            }
            else if (transaction.category === 'medicine') {
                this.medicinesum += transaction.amount;
            }
            else {
                this.otherssum += transaction.amount;
            }
        });
    }
    expenseCategories() {
        let incomeSums = 0;
        let expenseSums = 0;
        let categoryValue = MainPage_2.categoryProgress.value;
        let res = this.expenses.some((transaction) => transaction.email === MainPage_2.userEmails && transaction.transactionType === 'Expense');
        // console.log(res);
        if (!res) {
            alert("Add transactions to view the statistics.");
        }
        else {
            this.expenses.forEach((transaction) => {
                if (transaction.email === MainPage_2.userEmails) {
                    if (transaction.transactionType === "Income") {
                        incomeSums +=
                            typeof transaction.amount === "string"
                                ? parseFloat(transaction.amount)
                                : transaction.amount;
                    }
                    else if (transaction.transactionType === "Expense") {
                        if (categoryValue === 'savings') {
                            expenseSums = this.savings;
                            console.log(this.savings);
                        }
                        else {
                            if (transaction.category === categoryValue) {
                                expenseSums +=
                                    typeof transaction.amount === "string"
                                        ? parseFloat(transaction.amount)
                                        : transaction.amount;
                            }
                        }
                    }
                }
            });
            let percentage = (expenseSums / incomeSums) * 100;
            if (isNaN(percentage) || percentage < 0) {
                percentage = 0;
            }
            else if (percentage > 100) {
                percentage = 100;
            }
            let progressBar = document.getElementById("progress");
            let progressText = document.getElementById("progress-text");
            if (progressBar && progressText) {
                progressBar.style.width = `${percentage}%`;
                progressText.innerText = `${percentage.toFixed(2)}% of amount for ${categoryValue}`;
            }
        }
    }
}
exports.ExpenseRepository = ExpenseRepository;
const expenseRepo = new ExpenseRepository();
class GoalRepository {
    constructor() {
        this.localstoragegoalKey = "goals";
        this.goals = [];
        this.totalSavings = 0;
        this.goals = this.GoalsLocalStorage();
    }
    GoalsLocalStorage() {
        const storedGoal = localStorage.getItem(this.localstoragegoalKey);
        return storedGoal ? JSON.parse(storedGoal) : [];
    }
    saveGoalsToLocalStorage() {
        localStorage.setItem(this.localstoragegoalKey, JSON.stringify(this.goals));
    }
    addGoals(goal) {
        this.goals.push(goal);
        this.saveGoalsToLocalStorage();
        this.renderGoals();
        this.calculateSavings();
        window.location.reload();
        console.log("Goal Added:", goal);
    }
    deleteGoals(goalID) {
        this.goals = this.goals.filter((deleteGoal) => deleteGoal.goalId !== goalID);
        console.log(this.goals);
        this.saveGoalsToLocalStorage();
        console.log("Goal Deleted:", goalID);
        this.renderGoals();
        this.calculateSavings();
        window.location.reload();
    }
    editGoal(goalID, editName, editAmount) {
        this.goals.forEach((goal) => {
            if (goal.goalId === goalID) {
                goal.goalName = editName;
                goal.goalAmount = editAmount;
            }
        });
        this.saveGoalsToLocalStorage();
        this.renderGoals();
        this.calculateSavings();
    }
    renderGoals() {
        const goalsContainer = document.getElementById("goals-container");
        goalsContainer.innerHTML = "";
        this.goals.forEach((goal) => {
            if (goal.goalEmail === MainPage_2.userEmails) {
                (0, MainPage_1.createGoalCard)(goal);
            }
        });
    }
    calculateSavings() {
        this.goals.forEach((goal) => {
            if (goal.goalEmail === MainPage_2.userEmails) {
                this.totalSavings += goal.goalContribution;
            }
        });
        expenseRepo.savings = this.totalSavings;
        expenseRepo.calculateTotals();
        MainPage_2.totalSavingsdisplay.innerText = `Total Savings: ${this.totalSavings}.`;
    }
}
exports.GoalRepository = GoalRepository;
