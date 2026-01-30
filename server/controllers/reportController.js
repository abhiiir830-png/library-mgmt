const Issue = require('../models/Issue');
const Book = require('../models/Book');
const User = require('../models/User');

// Get overdue books (Librarian/Admin)
const getOverdueBooks = async (req, res) => {
  try {
    const now = new Date();
    
    // Find all issued/overdue books
    let issues = await Issue.find({
      status: { $in: ['Issued', 'Overdue'] },
    })
      .populate('bookId', 'title author isbn')
      .populate('userId', 'name email role')
      .sort({ dueDate: 1 });

    // Check and update overdue status
    const overdueIssues = [];
    for (let issue of issues) {
      if (issue.dueDate < now && issue.status !== 'Overdue') {
        issue.status = 'Overdue';
        await issue.save();
      }
      if (issue.status === 'Overdue') {
        overdueIssues.push(issue);
      }
    }

    res.json({
      success: true,
      count: overdueIssues.length,
      data: overdueIssues,
    });
  } catch (error) {
    console.error('Get overdue books error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get system analytics (Admin only)
const getAnalytics = async (req, res) => {
  try {
    // Total counts
    const totalBooks = await Book.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalIssues = await Issue.countDocuments();

    // Books statistics
    const availableBooks = await Book.aggregate([
      { $group: { _id: null, total: { $sum: '$availableCopies' } } },
    ]);
    const totalAvailableCopies = availableBooks[0]?.total || 0;

    // User statistics by role
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);

    // Issue statistics
    const issuesByStatus = await Issue.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Recent issues (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentIssues = await Issue.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Most popular books (most issued)
    const popularBooks = await Issue.aggregate([
      { $match: { status: { $in: ['Issued', 'Returned'] } } },
      { $group: { _id: '$bookId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: '_id',
          as: 'book',
        },
      },
      { $unwind: '$book' },
      {
        $project: {
          title: '$book.title',
          author: '$book.author',
          count: 1,
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalBooks,
          totalUsers,
          totalIssues,
          totalAvailableCopies,
          recentIssues,
        },
        usersByRole: usersByRole.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        issuesByStatus: issuesByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        popularBooks,
      },
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getOverdueBooks,
  getAnalytics,
};
