import express from "express";
import { cancelOrder, getQuote, listOrder, newOrder, updateOrder } from "../controllers/orderController.js";

const orderRouter = express.Router(); 

orderRouter.post("/", newOrder)
orderRouter.post("/quote", getQuote)
orderRouter.get("/", listOrder)
orderRouter.post("/:orderId", cancelOrder)
orderRouter.put("/:orderId", updateOrder)

export default orderRouter;