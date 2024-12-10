import express from "express";
import { listProducts, newProducts, delProducts, listProductsByName } from "../controllers/productsController.js";

//Create studentRouter
const productsRouter = express.Router();

productsRouter.get('/', listProducts)

productsRouter.get('/:name', listProductsByName)

productsRouter.post('/', newProducts)

productsRouter.delete('/:productId', delProducts)


export default productsRouter;