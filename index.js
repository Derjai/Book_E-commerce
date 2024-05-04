require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();


const usersRoutes = require('./routes/userRoutes');
const booksRoutes = require('./routes/bookRoutes');
const ordersRoutes = require('./routes/orderRoutes');

app.use(cors());
app.use(bodyParser.json());

app.use('/users', usersRoutes);
app.use('/books', booksRoutes);
app.use('/orders', ordersRoutes);

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).send('An error occurred. Please try again later.');
});

connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});