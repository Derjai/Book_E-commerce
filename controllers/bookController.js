const Book = require('../models/bookModel');
const generateISBN = require('../utils/generateISBN');

exports.createBook = async (req, res, next) => {
    try {
        const isbn = generateISBN();
        const book = new Book(req.body);

        if(!book.name || typeof book.name !== 'string') {
            return res.status(400).send("Book name is required");
        }
        if(!book.genre || typeof book.genre !== 'string') {
            return res.status(400).send("Book genre is required");
        }
        if(!book.author || typeof book.author !== 'string') {
            return res.status(400).send("Book author is required");
        }
        if(!book.publishedOn || typeof book.publishedOn !== 'string' || isNaN(Date.parse(book.publishedOn))) {
            return res.status(400).send("Book release date is required");
        }
        if(!book.editorial || typeof book.editorial !== 'string') {
            return res.status(400).send("Book editorial is required");
        }
        if(!book.cost || typeof book.cost !== 'number') {
            return res.status(400).send("Book cost is required");
        }
        book.owner = req.user._id;
        book.isbn = isbn;
        await book.save();
        res.status(201).send(book);
    } catch (error) {
        next(error);
    }};

exports.getBooks = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, genre, author, bookName, startDate, endDate, editorial} = req.query;
        const skip = (page - 1) * limit;

        const query = {deletedOn: null};
        if (genre) query.genre = genre;
        if (author) query.author = author;
        if (bookName) query.name = bookName;
        if (startDate && endDate) query.releaseDate = { $gte: startDate, $lte: endDate };
        if (editorial) query.editorial = editorial;

        const books = await Book.find(query).limit(parseInt(limit)).skip(parseInt(skip));
        if (!books) {
            return res.status(404).send("There are no books found");
        }
        res.status(200).send(books);
    } catch (error) {
        next(error);
    }};

exports.getBookById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const book = await Book.findOne({_id: id, deletedOn: null});
        if (!book) {
            return res.status(404).send("Book not found with that ID", id);
        }
        res.status(200).send(book);
    } catch (error) {
        next(error);
    }};

exports.getBookByISBN = async (req, res, next) => {
    try {
        const { isbn } = req.params;
        const book = await Book.findOne({ isbn: isbn, deletedOn: null});
        if (!book) {
            return res.status(404).send("Book not found with that ISBN", isbn);
        }
        res.status(200).send(book);
    } catch (error) {
        next(error);
    }};

exports.getBooksByGenre = async (req, res, next) => {
    try {
        const { genre } = req.params;
        const books = await Book.find({ genre: genre, deletedOn: null});
        if (!books) {
            return res.status(404).send("There are no books with that genre" ,genre);
        }
        res.status(200).send(books);
    }
    catch (error) {
        next(error);
    }};

exports.getBooksByAuthor = async (req, res, next) => {
    try {
        const { author } = req.params;
        const books = await Book.find({ author: author, deletedOn: null});
        if (!books) {
            return res.status(404).send("There are no books by that author", author);
        }
        res.status(200).send(books);
    } catch (error) {
        next(error);
    }};

exports.getBooksByName = async (req, res, next) => {
    try {
        const { name } = req.params;
        const books = await Book.find({ name: name, deletedOn: null});
        if (!books) {
            return res.status(404).send("There are no books with that name", name);
        }
        res.status(200).send(books);
    } catch (error) {
        next(error);
    }};

exports.getBooksByDate = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.params;
        const books = await Book.find({ publishedOn: { $gte: startDate, $lte: endDate }, deletedOn: null});
        if (!books) {
            return res.status(404).send("There are no books in that date range", startDate, endDate);
        }
        res.status(200).send(books);
    } catch (error) {
        next(error);
    }};

exports.getBooksByEditorial = async (req, res, next) => {
    try {
        const { editorial } = req.params;
        const books = await Book.find({ editorial: editorial, deletedOn: null});
        if (!books) {
            return res.status(404).send("There are no books from that editorial", editorial);
        }
        res.status(200).send(books);
    } catch (error) {
        next(error);
    }};

exports.updateBook = async (req, res, next) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).send("Book not found with that ID", id);
        }
        if (req.user._id !== book.owner.toString()) {
            return res.status(403).send("You are not authorized to update this book");
        }
        const updates = Object.keys(req.body);
        updates.forEach(update => book[update] = req.body[update]);
        await book.save();
        res.status(200).send(book);
    } catch (error) {
        next(error);
    }};

exports.deleteBook = async (req, res, next) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).send("Book not found with that ID", id);
        }
        if (req.user._id !== book.owner.toString()) {
            return res.status(403).send("You are not authorized to delete this book");
        }
        book.deletedOn = new Date();
        await book.save();
        res.status(200).send({message: "Book deleted successfully"});
    } catch (error) {
        next(error);
    }}; 