import express from "express";
import { registerAccount, loginAccount,getAllAccounts,logout} from "../controllers/accountController.js";
import protect from "../middleWare/authMiddleware.js";
import { verifyToken } from "../middleWare/verifyToken.js";

const accountRouter = express.Router();
accountRouter.post("/register",registerAccount);
accountRouter.post("/login",loginAccount);
accountRouter.get("/getallaccounts",getAllAccounts);
// accountRouter.put("/updateuser/:id",updateUser, verifyToken);
// accountRouter.get("/getuserbyid/:id",getById, verifyToken);
 accountRouter.get("/logout",logout);

// userRouter.get("/getuser",protect,getUser);
// userRouter.get("/loggedin",loginStatus);
// userRouter.patch("/updateuser",protect,updateUser);
// userRouter.patch("/changepassword",protect,changePassword);
// userRouter.post("/forgotpassword",forgotPassword);


 

export default accountRouter;