import { Expense, Goal, } from "../models/models";
import { createRow, createGoalCard } from "../MainPage";
import { userEmails, categoryProgress, totalSavingsdisplay } from "../MainPage";

export class ExpenseRepository {

  

    public localStorageKey = "expenses";
    public expenses: Expense[] = [];
    public savings: number = 0;
    public foodsum: number = 10;
    public educationsum: number = 10;
    public medicinesum: number = 0;
    public otherssum: number = 0;
    public totalIncomes: number = 0;
  
    constructor() {
      this.expenses = this.ExpensesLocalStorage();
    }

    public getFoodSum(): number {
      return this.foodsum;
    }
  
    public getEducationSum(): number {
      return this.educationsum;
    }
  
    public getMedicineSum(): number {
      return this.medicinesum;
    }
  
    public getOthersSum(): number {
      return this.otherssum;
    }
  
    public getTotalIncomes(): number {
      return this.totalIncomes;
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
      this.renderTransactions();
      console.log("Transaction added:", expense);
    }
  
    public deleteTransaction(expense: Expense): void {
      this.expenses = this.expenses.filter((e) => e.id !== expense.id);
      this.saveExpensesToLocalStorage();
      console.log("Transaction deleted:", expense);
      this.renderTransactions();
      window.location.reload();
    }
  
    public editTransaction(id: number, updatedExpense: Expense): void {
      const index = this.expenses.findIndex((expense) => expense.id === id);
      if (index !== -1) {
        this.expenses[index] = updatedExpense;
        this.saveExpensesToLocalStorage();
        this.renderTransactions();
        console.log("Transaction updated:", this.expenses[index]);
      } else {
        console.log("Transaction not found.");
      }
    }
  
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
  
      this.expenses.forEach(
        (transaction: {
          email: string;
          transactionType: string;
          amount: number;
        }) => {
          if (transaction.email === userEmails) {
            if (transaction.transactionType === "Income") {
              incomeSum += transaction.amount;
            } else if (transaction.transactionType === "Expense") {
              expenseSum += transaction.amount;
            }
          }
        }
      );
  
      const totalIncome = document.getElementById(
        "total-income-display"
      ) as HTMLElement;
      const totalExpense = document.getElementById(
        "total-expenses-display"
      ) as HTMLElement;
      const remainingBalance = document.getElementById(
        "remaining-balance-display"
      ) as HTMLElement;
  
      expenseSum += this.savings;
      this.totalIncomes = incomeSum;
      totalIncome.innerText = `$${incomeSum.toFixed(2)}`;
      totalExpense.innerText = `$${expenseSum.toFixed(2)}`;
  
      const remaining = incomeSum - expenseSum;
      remainingBalance.innerText = `$${remaining.toFixed(2)}`;
      this.calculateSelectedExpense();
  
    }

    calculateSelectedExpense(): void {
      this.foodsum = 10;
      this.educationsum = 0;
      this.medicinesum = 0;
      this.otherssum = 0;

      this.expenses.forEach((transaction)=>{
        if(transaction.category === 'food'){
          this.foodsum += transaction.amount;
        }
        else if(transaction.category === 'education'){
          this.educationsum += transaction.amount;
        }
        else if(transaction.category === 'medicine'){
          this.medicinesum += transaction.amount
        }
        else{
          this.otherssum += transaction.amount;
        }
      })
      
    }
  
    expenseCategories(): void {
      let incomeSums = 0;
      let expenseSums = 0;
      let categoryValue = categoryProgress.value;
  
      let res = this.expenses.some(
        (transaction) => transaction.email === userEmails && transaction.transactionType === 'Expense'
      );
      // console.log(res);
  
      if (!res) {
        alert("Add transactions to view the statistics.");
      } else {
        this.expenses.forEach((transaction) => {
          if (transaction.email === userEmails) {
            if (transaction.transactionType === "Income") {
              incomeSums +=
                typeof transaction.amount === "string"
                  ? parseFloat(transaction.amount)
                  : transaction.amount;
            } else if (transaction.transactionType === "Expense") {
              if(categoryValue === 'savings'){
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
        } else if (percentage > 100) {
          percentage = 100;
        }
  
        let progressBar = document.getElementById("progress") as HTMLElement;
        let progressText = document.getElementById(
          "progress-text"
        ) as HTMLElement;
  
        if (progressBar && progressText) {
          progressBar.style.width = `${percentage}%`;
          progressText.innerText = `${percentage.toFixed(
            2
          )}% of amount for ${categoryValue}`;
        }
      }
    }
  }

  const expenseRepo = new ExpenseRepository();


  export class GoalRepository {
    public localstoragegoalKey = "goals";
    public goals: Goal[] = [];
    public totalSavings: number = 0;
  
    constructor() {
      this.goals = this.GoalsLocalStorage();
    }
  
    public GoalsLocalStorage(): Goal[] {
      const storedGoal = localStorage.getItem(this.localstoragegoalKey);
      return storedGoal ? JSON.parse(storedGoal) : [];
    }
  
    public saveGoalsToLocalStorage(): void {
      localStorage.setItem(this.localstoragegoalKey, JSON.stringify(this.goals));
    }
  
    public addGoals(goal: Goal): void {
      this.goals.push(goal);
      this.saveGoalsToLocalStorage();
      this.renderGoals();
      this.calculateSavings();
      window.location.reload();
      console.log("Goal Added:", goal);
    }
  
    public deleteGoals(goalID: number): void {
      this.goals = this.goals.filter(
        (deleteGoal) => deleteGoal.goalId !== goalID
      );
      console.log(this.goals);
      this.saveGoalsToLocalStorage();
      console.log("Goal Deleted:", goalID);
      this.renderGoals();
      this.calculateSavings();
      window.location.reload();
    }
  
    public editGoal(
      goalID: number | null,
      editName: string,
      editAmount: number
    ): void {
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
  
    public renderGoals(): void {
      const goalsContainer = document.getElementById(
        "goals-container"
      ) as HTMLDivElement;
  
      goalsContainer.innerHTML = "";
  
      this.goals.forEach((goal) => {
        if (goal.goalEmail === userEmails) {
          createGoalCard(goal);
        }
      });
    }
  
    public calculateSavings(): void {
      this.goals.forEach((goal) => {
        if (goal.goalEmail === userEmails) {
          this.totalSavings += goal.goalContribution;
        }
      });
  
      expenseRepo.savings = this.totalSavings;
      expenseRepo.calculateTotals();
  
      totalSavingsdisplay.innerText = `Total Savings: ${this.totalSavings}.`;
    }
  }



