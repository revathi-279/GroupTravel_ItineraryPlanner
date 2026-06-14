import express from "express";
import {verifyToken} from "../middlewares/AuthMiddleware.js";
import {addExpense, deleteExpense, getAllExpenses, getExpenseSummary, updateExpense} from "../controllers/ExpenseController.js";

export const expenseApp = express.Router();

expenseApp.post("/add-expense",verifyToken,addExpense);
expenseApp.get("/get-expenses/:tripId",verifyToken,getAllExpenses);
expenseApp.patch("/update-expense",verifyToken,updateExpense);
expenseApp.delete("/delete-expense/:expenseId",verifyToken,deleteExpense);
expenseApp.get("/expense-summary/:tripId",verifyToken,getExpenseSummary
    
)