
import express  from "express";
const incomeRouter = express.Router();

import {makeIncome, getTotalIncome, getAllIncome}from "../controllers/incomeController.js"
import { verifyToken } from "../middleWare/verifyToken.js";


//usersRouter.use(verifyToken);
incomeRouter.get("/getallincome", getAllIncome);
incomeRouter.post("/makeincome", makeIncome);
incomeRouter.get("/gettotalincome", getTotalIncome)
//fundsRouter.get("/getById/:id", getbyId);
// fundsRouter.put("/updatesaving/:id",updateSaving, verifyToken);

export default incomeRouter;
            