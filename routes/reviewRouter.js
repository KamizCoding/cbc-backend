import express from "express";
import { addReview, listReviews, updateReview } from "../controllers/reviewController.js";


const reviewRouter = express.Router(); 

reviewRouter.post("/", addReview)

reviewRouter.get("/", listReviews)

reviewRouter.post("/update", updateReview)

export default reviewRouter;