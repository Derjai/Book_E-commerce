const express = require('express');
const orderRouter = express.Router();
const orderController = require('../controllers/orderController');
const authenticateToken = require('../utils/auth');

orderRouter.post('/', authenticateToken,orderController.createOrder);
orderRouter.get('/', authenticateToken,orderController.getOrders);
orderRouter.get('/:id',authenticateToken, orderController.getOrderById);
orderRouter.get('/status/:status',authenticateToken, orderController.getOrdersByStatus);
orderRouter.get('/date/:startDate/:endDate',authenticateToken, orderController.getOrdersByDate);
orderRouter.patch('/:id',authenticateToken, orderController.updateOrder);
orderRouter.delete('/:id', authenticateToken,orderController.deleteOrder);

module.exports = orderRouter;