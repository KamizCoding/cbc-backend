import express from "express";
import { listProducts, newProducts, delProducts, listProductsByName } from "../controllers/productsController.js";

//Create studentRouter
const productsRouter = express.Router();

productsRouter.get('/', listProducts)

productsRouter.get('/filter', (req,res)=>{
    res.json({
        message : "This product is filtered"
    })
})

productsRouter.get('/:name', listProductsByName)

productsRouter.post('/', newProducts)

productsRouter.delete('/:name', delProducts)


export default productsRouter;