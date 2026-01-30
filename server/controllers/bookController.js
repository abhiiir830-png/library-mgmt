const Book = require('../models/Book');

// Get all books (with search and filter)
const getBooks = async (req, res) => {
  try {
    const { search, category } = req.query;
    
    // Build query
    const query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }
    
    const books = await Book.find(query).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single book by ID
const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.json({
      success: true,
      data: book,
    });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new book (Admin only)
const createBook = async (req, res) => {
  try {
    const { title, author, isbn, category, publisher, totalCopies, shelfLocation } = req.body;
    
    // Validation
    if (!title || !author || !isbn || !category || !publisher || !totalCopies || !shelfLocation) {
      return res.status(400).json({ 
        message: 'Please provide all required fields: title, author, isbn, category, publisher, totalCopies, shelfLocation' 
      });
    }
    
    // Check if ISBN already exists
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({ message: 'Book with this ISBN already exists' });
    }
    
    // Create book
    const book = await Book.create({
      title,
      author,
      isbn,
      category,
      publisher,
      totalCopies: parseInt(totalCopies),
      availableCopies: parseInt(totalCopies), // Initially all copies are available
      shelfLocation,
    });
    
    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: book,
    });
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update book (Admin only)
const updateBook = async (req, res) => {
  try {
    const { title, author, isbn, category, publisher, totalCopies, availableCopies, shelfLocation } = req.body;
    
    let book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Check if ISBN is being changed and if it conflicts with another book
    if (isbn && isbn !== book.isbn) {
      const existingBook = await Book.findOne({ isbn });
      if (existingBook) {
        return res.status(400).json({ message: 'Book with this ISBN already exists' });
      }
    }
    
    // Update fields
    if (title) book.title = title;
    if (author) book.author = author;
    if (isbn) book.isbn = isbn;
    if (category) book.category = category;
    if (publisher) book.publisher = publisher;
    if (totalCopies !== undefined) {
      book.totalCopies = parseInt(totalCopies);
      // If totalCopies changes, adjust availableCopies accordingly
      if (availableCopies === undefined) {
        const difference = parseInt(totalCopies) - book.totalCopies;
        book.availableCopies = Math.max(0, book.availableCopies + difference);
      }
    }
    if (availableCopies !== undefined) book.availableCopies = parseInt(availableCopies);
    if (shelfLocation) book.shelfLocation = shelfLocation;
    
    // Ensure availableCopies doesn't exceed totalCopies
    if (book.availableCopies > book.totalCopies) {
      book.availableCopies = book.totalCopies;
    }
    
    await book.save();
    
    res.json({
      success: true,
      message: 'Book updated successfully',
      data: book,
    });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete book (Admin only)
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    await Book.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Book deleted successfully',
    });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
};
