const Issue = require('../models/Issue');
const Book = require('../models/Book');
const User = require('../models/User');

// Request book issue
const requestIssue = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;

    // Validation
    if (!bookId) {
      return res.status(400).json({ message: 'Please provide bookId' });
    }

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if book is available
    if (book.availableCopies === 0) {
      return res.status(400).json({ message: 'Book is not available' });
    }

    // Check if user already has a pending or issued request for this book
    const existingIssue = await Issue.findOne({
      userId,
      bookId,
      status: { $in: ['Pending', 'Issued'] },
    });

    if (existingIssue) {
      return res.status(400).json({ 
        message: 'You already have a pending or active issue for this book' 
      });
    }

    // Calculate due date based on user role
    const user = await User.findById(userId);
    const issueDate = new Date();
    const dueDate = new Date();
    
    // Students: 14 days, Faculty: 30 days
    if (user.role === 'faculty') {
      dueDate.setDate(dueDate.getDate() + 30);
    } else {
      dueDate.setDate(dueDate.getDate() + 14);
    }

    // Create issue request
    const issue = await Issue.create({
      userId,
      bookId,
      issueDate,
      dueDate,
      status: 'Pending',
    });

    // Populate book and user details
    await issue.populate('bookId', 'title author isbn');
    await issue.populate('userId', 'name email role');

    res.status(201).json({
      success: true,
      message: 'Book issue request created successfully',
      data: issue,
    });
  } catch (error) {
    console.error('Request issue error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's own issues
const getMyIssues = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const issues = await Issue.find({ userId })
      .populate('bookId', 'title author isbn category')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    // Check for overdue books
    const now = new Date();
    for (let issue of issues) {
      if (issue.status === 'Issued' && issue.dueDate < now) {
        issue.status = 'Overdue';
        await issue.save();
      }
    }

    res.json({
      success: true,
      count: issues.length,
      data: issues,
    });
  } catch (error) {
    console.error('Get my issues error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all pending issues (Librarian only)
const getPendingIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ status: 'Pending' })
      .populate('bookId', 'title author isbn availableCopies')
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: issues.length,
      data: issues,
    });
  } catch (error) {
    console.error('Get pending issues error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Approve issue (Librarian only)
const approveIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('bookId')
      .populate('userId');

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    if (issue.status !== 'Pending') {
      return res.status(400).json({ message: 'Issue is not pending' });
    }

    const book = issue.bookId;
    
    // Check if book is still available
    if (book.availableCopies === 0) {
      return res.status(400).json({ message: 'Book is no longer available' });
    }

    // Update issue status
    issue.status = 'Issued';
    issue.issueDate = new Date();
    await issue.save();

    // Decrease available copies
    book.availableCopies -= 1;
    await book.save();

    await issue.populate('bookId', 'title author isbn');
    await issue.populate('userId', 'name email role');

    res.json({
      success: true,
      message: 'Issue approved successfully',
      data: issue,
    });
  } catch (error) {
    console.error('Approve issue error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reject issue (Librarian only)
const rejectIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    if (issue.status !== 'Pending') {
      return res.status(400).json({ message: 'Issue is not pending' });
    }

    // Delete the issue request
    await Issue.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Issue request rejected',
    });
  } catch (error) {
    console.error('Reject issue error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Return book
const returnBook = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('bookId')
      .populate('userId');

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    if (issue.status !== 'Issued' && issue.status !== 'Overdue') {
      return res.status(400).json({ message: 'Book is not currently issued' });
    }

    // Update issue
    issue.status = 'Returned';
    issue.returnDate = new Date();
    await issue.save();

    // Increase available copies
    const book = issue.bookId;
    book.availableCopies += 1;
    // Ensure availableCopies doesn't exceed totalCopies
    if (book.availableCopies > book.totalCopies) {
      book.availableCopies = book.totalCopies;
    }
    await book.save();

    await issue.populate('bookId', 'title author isbn');
    await issue.populate('userId', 'name email role');

    res.json({
      success: true,
      message: 'Book returned successfully',
      data: issue,
    });
  } catch (error) {
    console.error('Return book error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Renew book (Faculty only)
const renewBook = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('bookId')
      .populate('userId');

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Check if user is faculty
    if (issue.userId.role !== 'faculty') {
      return res.status(403).json({ message: 'Only faculty can renew books' });
    }

    if (issue.status !== 'Issued' && issue.status !== 'Overdue') {
      return res.status(400).json({ message: 'Book is not currently issued' });
    }

    // Extend due date by 30 days
    const newDueDate = new Date(issue.dueDate);
    newDueDate.setDate(newDueDate.getDate() + 30);
    
    issue.dueDate = newDueDate;
    issue.status = 'Issued'; // Reset from Overdue if it was overdue
    await issue.save();

    await issue.populate('bookId', 'title author isbn');
    await issue.populate('userId', 'name email role');

    res.json({
      success: true,
      message: 'Book renewed successfully',
      data: issue,
    });
  } catch (error) {
    console.error('Renew book error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  requestIssue,
  getMyIssues,
  getPendingIssues,
  approveIssue,
  rejectIssue,
  returnBook,
  renewBook,
};
