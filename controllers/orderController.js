const Order = require('../models/orderModel');
const Book = require('../models/bookModel');
const { deleteBook } = require('./bookController');
const mongoose = require('mongoose');

exports.createOrder = async (req, res, next) => {
    try {
        const {books} = req.body;
        if(!Array.isArray(books) || books.length === 0) {
            return res.status(400).send("Books must be an array with at least one element");
        }
        const fetchedBooks = await Book.find({ _id: { $in: books } });
        if (fetchedBooks.length !== books.length) {
            return res.status(404).send("One or more books not found");
        }
        const total = fetchedBooks.reduce((sum, book) => sum + Number(book.cost), 0);
        const addressee = req.user._id;
        if(fetchedBooks[0].owner.toString() === addressee) {
            return res.status(400).send("You can't order your own books");
        }
        const order = new Order({...req.body,
        total,
        details: fetchedBooks.map(book => mongoose.Types.ObjectId.isValid(book._id) ? book._id.toString() : null),
        date: new Date(),
        addressee,
        sender: fetchedBooks[0].owner
        });
        if (!Array.isArray(order.details)) {
            return res.status(400).send("order.details must be an array");
        }
        for (let i = 0; i < order.details.length; i++) {
            if (!mongoose.Types.ObjectId.isValid(order.details[i])) {
                return res.status(400).send(`Invalid book ID in order details: ${order.details[i]}`);
            }
        }
        await order.save();
        res.status(201).send(order);
    } catch (error) {
        next(error);
    }
};

exports.getOrders = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, sender, addressee, status, startDate, endDate } = req.query;
        const skip = (page - 1) * limit;
        const userId = req.user._id;
        const query = {deletedOn: null, $or : [{sender: userId}, {addressee: userId}]};
        if (sender) query.sender = sender;
        if (addressee) query.addressee = addressee;
        if (status) query.status = status;
        if (startDate && endDate) query.date = { $gte: startDate, $lte: endDate };

        const orders = await Order.find(query).limit(parseInt(limit)).skip(parseInt(skip));
        if (!orders) {
            return res.status(404).send("There are no orders found");
        }
        res.status(200).send(orders);
    } catch (error) {
        next(error);
    }
};

exports.getOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const order = await Order.findOne({_id: id, deletedOn: null, or : [{sender: userId}, {addressee: userId}]});
        if (!order) {
            return res.status(404).send("Order not found with that ID", id);
        }
        res.status(200).send(order);
    } catch (error) {
        next(error);
    }
};

exports.getOrdersByStatus = async (req, res, next) => {
    try {
        const { status } = req.params;
        const userId = req.user._id;
        const orders = await Order.find({ status: status, deletedOn: null, or : [{sender: userId}, {addressee: userId}]});
        if (!orders) {
            return res.status(404).send("There are no orders with that status", status);
        }
        res.status(200).send(orders);
    } catch (error) {
        next(error);
    }
};

exports.getOrdersByDate = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.params;
        const userId = req.user._id;
        const orders = await Order.find({ date: { $gte: startDate, $lte: endDate }, deletedOn: null, or : [{sender: userId}, {addressee: userId}]});
        if (!orders) {
            return res.status(404).send("There are no orders between those dates", startDate, endDate);
        }
        res.status(200).send(orders);
    } catch (error) {
        next(error);
    }
};

exports.updateOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userId = req.user._id;
        const order = await Order.findOne({_id: id, deletedOn: null});
        if (!order) {
            return res.status(404).send("Order not found with that ID");
        }

        if(order.sender.toString()===userId){
            if(status !== 'Cancelled'){
                return res.status(403).send("As a sender, you can only cancel the order");
            }
        } else if (order.addressee.toString()===userId){
            if(status !== 'Canceled' && status !== 'Completed'){
                return res.status(403).send("As an addressee, you can only mark the order as delivered or cancel it");
            }
        } else {
            return res.status(403).send("You can't update this order");
        }

        if(status === 'Completed'){
            for (let bookId of order.details){
                await deleteBook(bookId);
            }
        }
        order.status = status;
        await order.save();
        res.status(200).send(order);
    } catch (error) {
        next(error);
    }
};

exports.deleteOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await Order.findOne({_id: id, deletedOn: null});
        if (!order) {
            return res.status(404).send("Order not found with that ID");
        }
        if (req.user._id !== order.sender.toString() && req.user._id !== order.addressee.toString()) {
            return res.status(403).send("You can't delete this order");
        }
        order.deletedOn = new Date();
        await order.save();
        res.status(200).send(order);
    } catch (error) {
        next(error);
    }
};