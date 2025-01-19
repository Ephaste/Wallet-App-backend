import mongoose from "mongoose";

const expensesSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "please add a name"],
  },
  amount: {
    type: String,
  },
  byAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: false,
  },
  description: {
    type: String,
  }
},
{
    timestamps: true,
});

export const Expense = mongoose.model("Expense", expensesSchema);
