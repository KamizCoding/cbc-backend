import Order from "../models/order.js"
import Products from "../models/products.js"
import { isCustomer } from "./userController.js"

export async function newOrder(req,res){

    if(!isCustomer){
        res.json({
            message : "Please login as a customer to generate an order"
        })
    }

    try {
        const latestOrder = await Order.find().sort
        ({date : -1}).limit(1)

        let orderId

        if(latestOrder.length == 0){
            orderId = "CBC0001"
        }else{
            const currentOrderId = latestOrder[0].orderId

            const numberString = currentOrderId.replace("CBC","")

            const number = parseInt(numberString)

            const newNumber = (number + 1).toString().padStart(4, "0") 

            orderId  = "CBC" + newNumber
        }

        const newOrderData = req.body

        const newProductArray = []

        for(let i=0;i<newOrderData.orderedItems.length;i++){
            const product = await Products.findOne({
                productId : newOrderData.orderedItems[i].productId
            })

            if(product == null){
                res.json({
                    message : "the product referring to id "+newOrderData.orderedItems[i].productId+" was not found"
                })
                return
            }

            const productImage = product.images && product.images[0] ? product.images[0] : "https://www.google.com/url?sa=i&url=https%3A%2F%2Ficonmonstr.com%2Fproduct-3-svg%2F&psig=AOvVaw2SWPd8pBJ9yybxvTNGiG3f&ust=1733981616869000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCOCgt4X_nooDFQAAAAAdAAAAABAE";

            newProductArray[i] = {
                name : product.productName,
                price : product.price,
                quantity : newOrderData.orderedItems[i].quantity,
                image : productImage
            }    
        }

        newOrderData.orderedItems = newProductArray
                
        newOrderData.orderId = orderId
        newOrderData.email = req.user.email

        const order = new Order(newOrderData)

        await order.save()

        res.json({
            message : "The order was succesfully created",
            order: {
                orderId: order.orderId,
                email: order.email,
                orderedItems: order.orderedItems,
                totalAmount: order.orderedItems.reduce((total, item) => total + item.price * item.quantity, 0),
                orderDate: order.date || new Date().toISOString(),
            }
        })

    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }
}

export async function listOrder(req,res){
    try {
        const orderList = await Order.find({email : req.user.email})

        res.json({
            list : orderList
        })
    } catch (error) {
        res.json({
            message : "The order list could not be generated due to an error " + error
        })
    }
}