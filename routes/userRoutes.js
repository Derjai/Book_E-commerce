const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../utils/auth');

userRouter.post('/', userController.createUser);
userRouter.get('/:id', userController.getUserById);
userRouter.patch('/:id',authenticateToken, userController.updateUser);
userRouter.delete('/:id',authenticateToken, userController.deleteUser);
userRouter.post('/login', userController.login);

module.exports = userRouter;