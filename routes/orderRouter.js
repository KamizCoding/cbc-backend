import express from "express";
import { listOrder, newOrder } from "../controllers/orderController.js";

const orderRouter = express.Router(); 

orderRouter.post("/", newOrder)
orderRouter.get("/", listOrder)

export default orderRouter;