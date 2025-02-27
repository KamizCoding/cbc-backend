import express from "express";
import { addReview, listReviews } from "../controllers/reviewController";


const reviewRouter = express.Router(); 

reviewRouter.post("/", addReview)

reviewRouter.get("/", listReviews)


export default orderRouter;