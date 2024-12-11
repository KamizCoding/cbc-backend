import express from "express";
import { cancelOrder, listOrder, newOrder } from "../controllers/orderController.js";

const orderRouter = express.Router(); 

orderRouter.post("/", newOrder)
orderRouter.get("/", listOrder)
orderRouter.post("/:orderId", cancelOrder)

export default orderRouter;