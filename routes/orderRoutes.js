const express = require('express');
const orderRouter = express.Router();
const orderController = require('../controllers/orderController');
const authenticateToken = require('../utils/auth');

orderRouter.post('/', authenticateToken,orderController.createOrder);
orderRouter.get('/', orderController.getOrders);
orderRouter.get('/:id', orderController.getOrderById);
orderRouter.get('/status/:status', orderController.getOrdersByStatus);
orderRouter.get('/date/:startDate/:endDate', orderController.getOrdersByDate);
orderRouter.patch('/:id',authenticateToken, orderController.updateOrder);
orderRouter.delete('/:id', authenticateToken,orderController.deleteOrder);

module.exports = orderRouter;