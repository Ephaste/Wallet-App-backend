import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import morgan from "morgan";
import accountRouter from "./routes/accountRoute.js";
import expensesRouter from "./routes/expensesRoute.js";
import incomeRouter from "./routes/incomeRoute.js";
import errorHandler from "./middleWare/errorMiddleware.js";
import cookieParser from 'cookie-parser';
import payRouter from "./routes/paidRoute.js";
import { __dirname } from "./dirname.js"; // Import the helper function
import path from "path";
import payPackRouter from "./routes/paypack.js";
// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname(import.meta.url), 'uploads')));

// Routes Middleware
app.use("/api/accounts", accountRouter);
 app.use("/api/expenses", expensesRouter);
 app.use("/api/income", incomeRouter);
// app.use("/api/contact", contactRouter);
// app.use("/api/payment", payRouter);
// app.use("/api/paypack", payPackRouter);

// Root Route
app.get("/", (req, res) => {
  res.send("HOME PAGE");
});

// Error Middleware
app.use(errorHandler);

// Connect to MongoDB and start the server
const port = process.env.PORT || 5000;
const dbConnection = process.env.DB_CONNECTION_PROD;

mongoose.connect(dbConnection, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database connected");
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
