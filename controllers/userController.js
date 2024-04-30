const { each } = require('lodash');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res, next) => {
    try {
        const { userName, password } = req.body;
        if (!user.userName || typeof user.userName !== 'string') {
            return res.status(400).send("User name is required");
        }
        if (!user.password || typeof user.password !== 'string') {
            return res.status(400).send("User password is required");
        }
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);
        const user = new User({ userName, password:hash  });
        await user.save();
        res.status(201).send({_id: user._id, userName: user.userName});
    } catch (error) {
        next(error);
    }
};

exports.getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ _id: id, deletedOn: null });
        if (!user) {
            return res.status(404).send("User not found with that ID");
        }
        res.status(200).send(user);
    } catch (error) {
        next(error);
    }};

exports.updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ _id: id, deletedOn: null });
        if (!user) {
            return res.status(404).send("User not found with that ID");
        }
        const updates = Object.keys(req.body);
        updates.forEach(update => user[update] = req.body[update]);
        await user.save();
        res.status(200).send(user);
    } catch (error) {
        next(error);
    }};

exports.deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ _id: id, deletedOn: null });
        if (!user) {
            return res.status(404).send("User not found with that ID");
        }
        user.deletedOn = new Date();
        await user.save();
        res.status(200).send(user);
    } catch (error) {
        next(error);
    }};

exports.login = async (req, res, next) => {
    try {
        const { userName, password } = req.body;
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
    
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
    
        const token = jwt.sign({ userName: user.userName, userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ token: token });
        } catch (error) {
            next(error);
        }
    };