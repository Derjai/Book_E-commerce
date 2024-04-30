const Order = require('../models/orderModel');
const Book = require('../models/bookModel');

exports.createOrder = async (req, res, next) => {
    try {
        const { books, addressee} = req.body;
        if(!Array.isArray(books) || books.length === 0) {
            return res.status(400).send("Books must be an array with at least one element");
        }
        
        const fetchedBooks = await Book.find({ _id: { $in: books } });
        if (fetchedBooks.length !== books.length) {
            return res.status(404).send("One or more books not found");
        }
        const total = fetchedBooks.reduce((sum, book) => sum + Number(book.cost), 0);
        if (!addressee) {
            return res.status(400).send("User information is missing or incomplete");
        }
        const order = new Order({...req.body,
        total,
        details: fetchedBooks.map(book=>book._id),
        date: new Date(),
        addressee,
        sender: fetchedBooks[0].owner
        });
        await order.save();
        res.status(201).send(order);
    } catch (error) {
        next(error);
    }
};

exports.getOrders = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, id, sender, addressee, status, startDate, endDate } = req.query;
        const skip = (page - 1) * limit;

        const query = {deletedOn: null};
        if (id) query.id = id;
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
        const order = await Order.findOne({_id: id, deletedOn: null});
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
        const orders = await Order.find({ status: status, deletedOn: null});
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
        const orders = await Order.find({ date: { $gte: startDate, $lte: endDate }, deletedOn: null});
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
        const order = await Order.findOne({_id: id, deletedOn: null});
        if (!order) {
            return res.status(404).send("Order not found with that ID");
        }
        order.status = req.body.status;
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
        order.deletedOn = new Date();
        await order.save();
        res.status(200).send(order);
    } catch (error) {
        next(error);
    }
};