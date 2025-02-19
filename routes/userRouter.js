import express from "express";
import { blockUser, delUser, getUser, googleLogin, listUser, newUser, userLogin} from "../controllers/userController.js";

//Create studentRouter
const userRouter = express.Router();

userRouter.post('/', newUser)

userRouter.post('/login', userLogin)

userRouter.get('/userdetail',getUser) 

userRouter.get('',listUser)

userRouter.delete('',delUser)

userRouter.post("/google", googleLogin)

userRouter.put("/", blockUser)

export default userRouter;