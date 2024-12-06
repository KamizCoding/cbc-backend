import Order from "../models/order.js"
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
        newOrderData.orderId = orderId
        newOrderData.email = req.user.email

        const order = new Order(newOrderData)

        await order.save()

        res.json({
            message : "The order was succesfully created"
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
            message : "he order lis could not be generated due to an error " + error
        })
    }
}