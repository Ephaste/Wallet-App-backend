import asyncHandler from "express-async-handler";
import { Account } from "../models/accountModel.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import upload from '../middleWare/uploadMiddleware.js'; // Import the upload middleware

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Register User Account
export const registerAccount = asyncHandler(async (req, res, next) => {
   
       
        const { name, email, password, account, accountno,} = req.body;

        // Validation
        if (!email || !name || !password || !accountno || !account) {
            res.status(400);
            return res.json({ error: "Please fill in all required fields" });
        }
        if (password.length < 6) {
            res.status(400);
            return res.json({ error: "Password must be at least 6 characters" });
        }

        // Check if user account already exists
        const accountExist = await Account.findOne({ accountno });
        if (accountExist) {
            res.status(400);
            return res.json({ error: "The Account is already used" });
        }

        // Create a user
        const acccount = await Account.create({
            name,
            email,
            password,
            account,
            accountno
        });

        // Generate Token
        const token = generateToken(account._id);

        // Send HTTP-only cookie
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400), // 1 Day
            sameSite: "none",
            secure: true
        });

        if (account) {
            const { _id, name, email, account, accountno} = account;
            res.status(201).json({
                _id, name, email, account, accountno
            });
        } else {
            res.status(400);
            return res.json({ error: "Invalid user data" });
        }
    
});


// Login With account
export const loginAccount = asyncHandler(async (req, res) => {
    const { accountno, password } = req.body;

    // Validate request
    if (!accountno || !password) {
        return res.status(400).json({ message: "Please provide both account number and password" });
    }

    // Check if account exists
    const account = await Account.findOne({ accountno });
    if (!account) {
        return res.status(404).json({ message: "Account not found. Please register an account." });
    }

    // Check if password is correct
    const passwordIsCorrect = await bcrypt.compare(password, account.password);
    if (!passwordIsCorrect) {
        return res.status(401).json({ message: "Invalid account number or password" });
    }

    // Generate Token
    const token = generateToken(account._id);

    // Send HTTP-only cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 Day
        sameSite: "none",
        secure: true,
    });

    // Send successful response
    const { _id, name, email, account: userAccount, accountno: userAccountNo } = account;
    return res.status(200).json({
        message: "Login successful",
        token, // Including token in the response, if needed
        user: {
            _id,
            name,
            email,
            account: userAccount,
            accountno: userAccountNo,
        },
    });
});



// Get all accounts
export const getAllAccounts = asyncHandler(async (req, res) => {
    try {
        const allAccounts = await Account.find({}); // Query all accounts from the Account model
        res.status(200).json(allAccounts); // Respond with all accounts data
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});



// Logout the Account
export const logout = asyncHandler(async (req, res) => {
    // Send HTTP-only cookie 
    res.cookie("token", " ", {
        path: "/",
        httpOnly: true,
        expires: new Date(0),
        sameSite: "none",
        secure: true
    });
    // Set cache control headers to prevent caching
    res.set('Cache-Control', 'no-store');
    res.set('Pragma', 'no-cache');
    return res.status(200).json({ message: "Successfully logged out" });
});
