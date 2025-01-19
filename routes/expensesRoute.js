
import express  from "express";
const expensesRouter = express.Router();

 import {Spend, getTotalExpenses, getAllExpenses}from "../controllers/expensesController.js";


expensesRouter.get("/getallexpenses", getAllExpenses);
 expensesRouter.post("/spend",Spend);
 expensesRouter.get("/gettotalexpenses", getTotalExpenses);
// loansRouter.put("/update/:id",e updateLoan, verifyToken);


 export default expensesRouter;
            