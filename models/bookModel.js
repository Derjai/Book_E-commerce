const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    isbn: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    genre: { type: String, required: true },
    author: { type: String, required: true },
    publishedOn: { type: Date, required: true },
    editorial: { type: String, required: true },
    cost: { type: Number, required: true },
    owner: { type: Number, required: true },
    deletedOn: {type: Date, required: false}
}, { timestamps: true });

const Book = mongoose.model('Books', bookSchema);

module.exports = Book;