const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['Pending', 'Issued', 'Returned', 'Overdue'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

const Issue = mongoose.model('Issue', issueSchema);

module.exports = Issue;
