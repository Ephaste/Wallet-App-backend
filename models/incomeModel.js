
import mongoose from "mongoose";
const incomeSchema = mongoose.Schema({
name: {
        type: String,
        required: [true, "please add a name"]
    },
amount:{
    type: String,
    // minLength: [10, "Id mus be over 10 charcters"],
    // maxLength: [30, "Password must be more than 30 characters"],
},
description:{
    type: String,
    required: false

},
byAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: false,
  }
},
);
export const Income = mongoose.model("Income", incomeSchema);