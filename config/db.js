const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/e_commerce')
        console.log('MongoDB Connected')
    } catch(error) {
        console.error('Error: ', error.message)
        process.exit(1)
    }
}

module.exports = connectDB;