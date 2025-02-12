import Order from "../models/order.js";
import Products from "../models/products.js";
import { isAdmin, isCustomer } from "./userController.js";

export async function newOrder(req, res) {
  if (!isCustomer) {
    res.json({
      message: "Please login as a customer to generate an order",
    });
  }

  try {
    const latestOrder = await Order.find().sort({ date: -1 }).limit(1);

    let orderId;

    if (latestOrder.length == 0) {
      orderId = "CBC0001";
    } else {
      const currentOrderId = latestOrder[0].orderId;

      const numberString = currentOrderId.replace("CBC", "");

      const number = parseInt(numberString);

      const newNumber = (number + 1).toString().padStart(4, "0");

      orderId = "CBC" + newNumber;
    }

    const newOrderData = req.body;

    const newProductArray = [];

    for (let i = 0; i < newOrderData.orderedItems.length; i++) {
      const { productId, quantity } = newOrderData.orderedItems[i];
      const product = await Products.findOne({ productId });

      if (product == null) {
        res.json({
          message:
            "the product referring to id " +
            newOrderData.orderedItems[i].productId +
            " was not found",
        });
        return;
      }

      product.stock -= quantity;
      await product.save();

      const productImage =
        product.images && product.images[0]
          ? product.images[0]
          : "https://www.google.com/url?sa=i&url=https%3A%2F%2Ficonmonstr.com%2Fproduct-3-svg%2F&psig=AOvVaw2SWPd8pBJ9yybxvTNGiG3f&ust=1733981616869000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCOCgt4X_nooDFQAAAAAdAAAAABAE";

      newProductArray[i] = {
        name: product.productName,
        price: product.lastPrice,
        quantity: newOrderData.orderedItems[i].quantity,
        image: productImage,
      };
    }

    newOrderData.orderedItems = newProductArray;

    newOrderData.orderId = orderId;
    newOrderData.email = req.user.email;

    const order = new Order(newOrderData);

    const savedOrder = await order.save();

    res.json({
      message: "The order was succesfully created",
      order: savedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function listOrder(req, res) {
  try {
    if (isCustomer(req)) {
      const orderList = await Order.find({ email: req.user.email });

      res.json({
        list: orderList,
      });
      return
    } else if (isAdmin(req)){
        const orderList = await Order.find({ });

        res.json({
            list: orderList,
          });
          return
    } else {
        res.json({
            message: "Please login to view orders"
        })
    }
    
  } catch (error) {
    res.json({
      message: "The order list could not be generated due to an error " + error,
    });
  }
}

export async function cancelOrder(req, res) {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId, email: req.user.email });

    if (!order) {
      res.json({
        message: `The order with id ${orderId} was not found`,
      });
      return;
    }

    if (order.status == "cancelled") {
      res.json({
        message: `The order with id ${orderId} is already cancelled`,
      });
      return;
    }

    if (order.status == "shipped" || order.status == "completed") {
      res.json({
        message: `The order with id ${orderId} is already shipped/completed`,
      });
      return;
    }

    order.status = "cancelled";
    await order.save();

    res.json({
      message: `The order with id ${orderId} has been succesfully cancelled`,
    });
  } catch (error) {
    res.json({
      message: "The order was not cancelled due to an error" + error,
    });
  }
}

export async function getQuote(req, res) {
  try {
    const newOrderData = req.body;

    const newProductArray = [];

    let total = 0;
    let labeledTotal = 0;

    for (let i = 0; i < newOrderData.orderedItems.length; i++) {
      const { productId, quantity } = newOrderData.orderedItems[i];
      const product = await Products.findOne({ productId });

      if (product == null) {
        res.json({
          message:
            "the product referring to id " +
            newOrderData.orderedItems[i].productId +
            " was not found",
        });
        return;
      }

      product.stock -= quantity;
      await product.save();

      const productImage =
        product.images && product.images[0]
          ? product.images[0]
          : "https://www.google.com/url?sa=i&url=https%3A%2F%2Ficonmonstr.com%2Fproduct-3-svg%2F&psig=AOvVaw2SWPd8pBJ9yybxvTNGiG3f&ust=1733981616869000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCOCgt4X_nooDFQAAAAAdAAAAABAE";

      labeledTotal += product.price * newOrderData.orderedItems[i].quantity;
      total += product.lastPrice * newOrderData.orderedItems[i].quantity;

      newProductArray[i] = {
        name: product.productName,
        price: product.lastPrice,
        labeledPrice: product.price,
        quantity: newOrderData.orderedItems[i].quantity,
        image: productImage,
      };
    }

    newOrderData.orderedItems = newProductArray;
    newOrderData.total = total;

    res.json({
      orderedItems: newProductArray,
      total: total,
      labeledTotal: labeledTotal,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}
