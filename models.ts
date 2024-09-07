export interface Expense {
    id: number;
    email: string;
    transactionType: string;
    category: string;
    amount: number;
    date: string;
  }

export  interface Goal {
    goalId: number;
    goalEmail: string;
    goalName: string;
    goalAmount: number;
    goalContribution: number;
    goalStatus: string;
  }

export interface User {
  name: string;
  email: string;
  password: string;
  loggedStatus: string;
}