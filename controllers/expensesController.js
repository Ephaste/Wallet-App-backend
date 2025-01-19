import { Expense } from "../models/expensesModel.js";
import { verifyToken } from "../middleWare/verifyToken.js";
import { Income } from "../models/incomeModel.js";
import { Account } from "../models/accountModel.js";

export const Spend = async (req, res) => {
  try {
    verifyToken(req, res, async () => {
      const expenseData = req.body;
      const userId = req.userId;

      console.log("User ID from token:", userId);
      console.log("Request body:", req.body);

      // Find the logged-in user's account
      const account = await Account.findById(userId);
      if (!account) {
        return res.status(400).json({ error: "Account not found." });
      }

      console.log("Account found:", account);

      // Calculate total income for the account
      const totalIncome = await Income.aggregate([
        { $match: { byAccount: account._id } },
        { $group: { _id: null, totalAmount: { $sum: { $toDouble: "$amount" } } } },
      ]);

      const incomeAmount = totalIncome.length > 0 ? totalIncome[0].totalAmount : 0;
      console.log("Total income for account:", incomeAmount);

      // Calculate total expenses for the account
      const totalExpenses = await Expense.aggregate([
        { $match: { byAccount: account._id } },
        { $group: { _id: null, totalAmount: { $sum: { $toDouble: "$amount" } } } },
      ]);

      const expenseAmount = totalExpenses.length > 0 ? totalExpenses[0].totalAmount : 0;
      console.log("Total expenses for account:", expenseAmount);

      // Check if the new expense exceeds 80% of total income
      const newExpenseAmount = parseFloat(expenseData.amount);
      const maxAllowedExpense = incomeAmount * 0.8;

      if (expenseAmount + newExpenseAmount > maxAllowedExpense) {
        return res.status(400).json({
          error: `Expense limit exceeded. You can only spend up to 80% of your total income (${maxAllowedExpense.toFixed(
            2
          )}).`,
        });
      }

      // Save the expense
      const newExpense = await Expense.create({
        name: expenseData.name,
        amount: newExpenseAmount.toFixed(2),
        byAccount: account._id,
        description: expenseData.description,
      });

      res.status(201).json({ message: "Expense recorded successfully!", expense: newExpense });
    });
  } catch (error) {
    console.error("Error recording expense:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//Geting the total expenses
export const getTotalExpenses = async (req, res) => {
    try {
      verifyToken(req, res, async () => {
        const userId = req.userId; // Retrieved from the token
  
        // Fetch the logged-in user's account details
        const userAccount = await Account.findById(userId);
        if (!userAccount) {
          return res.status(404).json({ error: "Account not found. Please log in again." });
        }
  
        // Fetch all expenses associated with the user's account
        const totalExpenses = await Expense.aggregate([
          { $match: { byAccount: userAccount._id } },
          { $group: { _id: null, totalAmount: { $sum: { $toDouble: "$amount" } } } },
        ]);
  
        // Calculate the total expense amount
        const expenseAmount = totalExpenses.length > 0 ? totalExpenses[0].totalAmount : 0;
  
        // Respond with the total expenses
        res.status(200).json({
          message: "Total expenses retrieved successfully",
          totalExpenses: expenseAmount,
        });
      });
    } catch (error) {
      console.error("Error fetching total expenses:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  


// Getting all expenses
// Get All Expenses data
export const getAllExpenses = async (req, res) => {
    try {
      let allExpenses = await Expense.find({});
      res.status(200).json(allExpenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
