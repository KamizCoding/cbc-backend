import express from "express";
import { listStudents, newStudent, delStudent } from "../controllers/studentController.js";

//Create studentRouter
const studentRouter = express.Router();

studentRouter.get('/', listStudents)

studentRouter.post('/', newStudent)

studentRouter.delete('/', delStudent)


export default studentRouter;