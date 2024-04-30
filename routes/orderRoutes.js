const express = require('express');
const orderRouter = express.Router();
const orderController = require('../controllers/orderController');

orderRouter.post('/', orderController.createOrder);
orderRouter.get('/', orderController.getOrders);
orderRouter.get('/:id', orderController.getOrderById);
orderRouter.get('/status/:status', orderController.getOrdersByStatus);
orderRouter.get('/date/:startDate/:endDate', orderController.getOrdersByDate);
orderRouter.patch('/:id', orderController.updateOrder);
orderRouter.delete('/:id', orderController.deleteOrder);

module.exports = orderRouter;