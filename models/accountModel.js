import mongoose from "mongoose";
import bcrypt from "bcrypt";

const accountSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "please add a name"],
        match: [/^(?!\d+$).{1,}$/, "Name must not be only numbers"]
    },
    email: {  
        type: String,
        required: [true, "Please add an email"],
        unique: true,
        trim: true,
        match: [
            /^(?!\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Please enter a valid email"
        ]
    },
    password:  {
        type: String,
        required: [true, "please add a password"],
        minLength: [6, "Password must be up to 6 characters"],
    },

    account: {
        type: String,
        required: [true, "please enter your account"],
    },
    accountno: {
        type: String,
    },
},
{
    timestamps: true,
});

// Encrypt password before saving to DB
accountSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        return next();
        
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
});

export const Account = mongoose.model("Account", accountSchema);
