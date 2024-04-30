const express = require('express');
const bookRouter = express.Router();
const bookController = require('../controllers/bookController');

bookRouter.post('/', bookController.createBook);
bookRouter.get('/', bookController.getBooks);
bookRouter.get('/:id', bookController.getBookById);
bookRouter.get('/isbn/:isbn', bookController.getBookByISBN);
bookRouter.get('/genre/:genre', bookController.getBooksByGenre);
bookRouter.get('/author/:author', bookController.getBooksByAuthor);
bookRouter.get('/name/:name', bookController.getBooksByName);
bookRouter.get('/date/:startDate/:endDate', bookController.getBooksByDate);
bookRouter.get('/editorial/:editorial', bookController.getBooksByEditorial);
bookRouter.patch('/:id', bookController.updateBook);
bookRouter.delete('/:id', bookController.deleteBook);

module.exports = bookRouter;