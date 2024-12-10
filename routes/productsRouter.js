import express from "express";
import { listProducts, newProducts, delProducts, listProductsByName, updateProducts } from "../controllers/productsController.js";

//Create studentRouter
const productsRouter = express.Router();

productsRouter.get('/', listProducts)

productsRouter.get('/:name', listProductsByName)

productsRouter.post('/', newProducts)

productsRouter.delete('/:productId', delProducts)

productsRouter.post('/update/:productId', updateProducts)


export default productsRouter;