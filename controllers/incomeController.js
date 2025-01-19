import { Income } from "../models/incomeModel.js";
import { Account } from "../models/accountModel.js";
import { verifyToken } from "../middleWare/verifyToken.js";

// Record income and track its associated account
export const makeIncome = async (req, res) => {
  try {
    verifyToken(req, res, async () => {
      const { name, amount, description } = req.body;
      const userId = req.userId; // Retrieved from the token

      // Validate required fields
      if (!name || !amount || !description) {
        return res.status(400).json({ error: "Please provide name, amount, and description" });
      }

      // Ensure amount is a valid number
      const amountNumber = parseFloat(amount);
      if (isNaN(amountNumber)) {
        return res.status(400).json({ error: "Amount must be a valid number" });
      }

      // Fetch the logged-in user's account details
      const userAccount = await Account.findById(userId);
      if (!userAccount) {
        return res.status(404).json({ error: "Account not found. Please log in again." });
      }

      // Create a new income record associated with the user's account
      const newIncome = new Income({
        name,
        amount: amountNumber,
        description,
        byAccount: userAccount._id, // Reference the user's account
      });

      await newIncome.save();

      // Respond with the created income record
      res.status(201).json({
        message: "Income recorded successfully",
        income: newIncome,
      });
    });
  } catch (error) {
    console.error("Error recording income:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
//Getting total income for incomes
export const getTotalIncome = async (req, res) => {
  try {
    // Verify the token and extract the userId
    verifyToken(req, res, async () => {
      const userId = req.userId; // Retrieved from the token
      console.log("Token User ID:", userId);

      // Validate that the account exists for the userId
      const userAccount = await Account.findById(userId);
      if (!userAccount) {
        return res.status(404).json({
          error: "Account not found. Please log in again.",
        });
      }

      console.log("User Account Found:", userAccount);

      // Aggregate total income based on the byAccount field
      const totalIncome = await Income.aggregate([
        { $match: { byAccount: userAccount._id } }, // Match income for the user's account
        { $group: { _id: null, totalAmount: { $sum: { $toDouble: "$amount" } } } }, // Sum the `amount` field
      ]);

      // Extract the total income amount
      const incomeAmount = totalIncome.length > 0 ? totalIncome[0].totalAmount : 0;
      console.log("Calculated Total Income:", incomeAmount);

      // Respond with the total income
      res.status(200).json({
        message: "Total income retrieved successfully",
        totalIncome: incomeAmount,
      });
    });
  } catch (error) {
    console.error("Error fetching total income:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Fetch all income data
export const getAllIncome = async (req, res) => {
  try {
    // Fetch all income records from the Income collection
    const allIncome = await Income.find({});
    
    // Return the fetched data
    res.status(200).json(allIncome);
  } catch (error) {
    console.error("Error fetching income records:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// // Getting only funds made by a particular user
// export const getFundsForUser = async (req, res) => {
//   try {
//     verifyToken(req, res, async () => {
//       const userId = req.userId;
//       const userFunds = await Fund.find({ fundOwner: userId }).populate('fundOwner');
//       res.status(200).json(userFunds);
//     });
//   } catch (error) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// // GET BY ID
// export const getbyId = async (req, res) => {
//   const fundId = req.params.id;

//   try {
//     const fund = await Fund.findById(fundId);

//     if (!fund) {
//       return res.status(404).json({ error: "Fund not found" });
//     }

//     res.status(200).json(fund);
//   } catch (error) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// //UPDATE A SAVING


// export const updateSaving = async (req, res) => {
//   const savingId = req.params.id; // Assuming the ID is passed as a URL parameter
//   const updatedData = req.body;

//   try {
//     const foundSaving= await Fund.findById(savingId);

//     if (!foundSaving) {
//       return res.status(404).json({ error: "saving is not found" });
//     }

//     // Update the foundCase object with the provided data
//     Object.assign(foundSaving, updatedData);

//     // Save the updated case
//     const updatedSaving = await foundSaving.save();

//     res.status(200).json(updatedSaving);
//   } catch (error) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// };