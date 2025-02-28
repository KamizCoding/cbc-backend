import express from "express";
import { addReview, listReviews } from "../controllers/reviewController.js";


const reviewRouter = express.Router(); 

reviewRouter.post("/", addReview)

reviewRouter.get("/", listReviews)


export default reviewRouter;