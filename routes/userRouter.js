import express from "express";
import { delUser, listUser, newUser, userLogin} from "../controllers/userController.js";

//Create studentRouter
const userRouter = express.Router();

userRouter.post('/', newUser)

userRouter.post('/login', userLogin)

userRouter.get('',listUser)

userRouter.delete('',delUser)

export default userRouter;