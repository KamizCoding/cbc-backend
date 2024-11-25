import express from "express";
import { newUser, userLogin} from "../controllers/userController.js";

//Create studentRouter
const userRouter = express.Router();

userRouter.post('/', newUser)

userRouter.post('/login', userLogin)


export default userRouter;