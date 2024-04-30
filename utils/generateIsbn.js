function generateISBN() {
    const prefix = '978';
    const randomDigits = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
    const isbn = prefix + randomDigits;
    return isbn;
  }

module.exports = generateISBN;