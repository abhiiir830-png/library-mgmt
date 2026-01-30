const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Book = require('../models/Book');
const connectDB = require('../config/db');

// Load environment variables
dotenv.config();

// Sample books data
const sampleBooks = [
  {
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    isbn: '9780262033848',
    category: 'Computer Science',
    publisher: 'MIT Press',
    totalCopies: 5,
    availableCopies: 3,
    shelfLocation: 'CS-A1',
  },
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    isbn: '9780132350884',
    category: 'Software Engineering',
    publisher: 'Prentice Hall',
    totalCopies: 4,
    availableCopies: 2,
    shelfLocation: 'SE-B2',
  },
  {
    title: 'The Design of Everyday Things',
    author: 'Don Norman',
    isbn: '9780465050659',
    category: 'Design',
    publisher: 'Basic Books',
    totalCopies: 3,
    availableCopies: 1,
    shelfLocation: 'DES-C3',
  },
  {
    title: 'Database System Concepts',
    author: 'Abraham Silberschatz',
    isbn: '9780078022159',
    category: 'Computer Science',
    publisher: 'McGraw-Hill',
    totalCopies: 6,
    availableCopies: 4,
    shelfLocation: 'CS-A2',
  },
  {
    title: 'Operating System Concepts',
    author: 'Abraham Silberschatz',
    isbn: '9781118063330',
    category: 'Computer Science',
    publisher: 'Wiley',
    totalCopies: 5,
    availableCopies: 3,
    shelfLocation: 'CS-A3',
  },
  {
    title: 'Artificial Intelligence: A Modern Approach',
    author: 'Stuart Russell',
    isbn: '9780136042594',
    category: 'Artificial Intelligence',
    publisher: 'Prentice Hall',
    totalCopies: 4,
    availableCopies: 2,
    shelfLocation: 'AI-D1',
  },
  {
    title: 'Computer Networks',
    author: 'Andrew S. Tanenbaum',
    isbn: '9780132126953',
    category: 'Computer Science',
    publisher: 'Prentice Hall',
    totalCopies: 5,
    availableCopies: 3,
    shelfLocation: 'CS-A4',
  },
  {
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt',
    isbn: '9780201616224',
    category: 'Software Engineering',
    publisher: 'Addison-Wesley',
    totalCopies: 4,
    availableCopies: 2,
    shelfLocation: 'SE-B3',
  },
  {
    title: 'Structure and Interpretation of Computer Programs',
    author: 'Harold Abelson',
    isbn: '9780262510875',
    category: 'Computer Science',
    publisher: 'MIT Press',
    totalCopies: 3,
    availableCopies: 1,
    shelfLocation: 'CS-A5',
  },
  {
    title: 'Machine Learning: A Probabilistic Perspective',
    author: 'Kevin P. Murphy',
    isbn: '9780262018029',
    category: 'Machine Learning',
    publisher: 'MIT Press',
    totalCopies: 4,
    availableCopies: 2,
    shelfLocation: 'ML-E1',
  },
  {
    title: 'Deep Learning',
    author: 'Ian Goodfellow',
    isbn: '9780262035613',
    category: 'Machine Learning',
    publisher: 'MIT Press',
    totalCopies: 3,
    availableCopies: 1,
    shelfLocation: 'ML-E2',
  },
  {
    title: 'Data Structures and Algorithms in Python',
    author: 'Michael T. Goodrich',
    isbn: '9781118290279',
    category: 'Computer Science',
    publisher: 'Wiley',
    totalCopies: 5,
    availableCopies: 3,
    shelfLocation: 'CS-A6',
  },
  {
    title: 'System Design Interview',
    author: 'Alex Xu',
    isbn: '9781736049116',
    category: 'Software Engineering',
    publisher: 'ByteByteGo',
    totalCopies: 4,
    availableCopies: 2,
    shelfLocation: 'SE-B4',
  },
  {
    title: 'Refactoring',
    author: 'Martin Fowler',
    isbn: '9780134757599',
    category: 'Software Engineering',
    publisher: 'Addison-Wesley',
    totalCopies: 3,
    availableCopies: 1,
    shelfLocation: 'SE-B5',
  },
  {
    title: 'You Don\'t Know JS',
    author: 'Kyle Simpson',
    isbn: '9781491924464',
    category: 'Web Development',
    publisher: 'O\'Reilly Media',
    totalCopies: 5,
    availableCopies: 3,
    shelfLocation: 'WEB-F1',
  },
];

// Sample users data
const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@library.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'Librarian One',
    email: 'librarian@library.com',
    password: 'librarian123',
    role: 'librarian',
  },
  {
    name: 'John Student',
    email: 'student@library.com',
    password: 'student123',
    role: 'student',
  },
  {
    name: 'Jane Faculty',
    email: 'faculty@library.com',
    password: 'faculty123',
    role: 'faculty',
  },
  {
    name: 'Bob Student',
    email: 'bob@library.com',
    password: 'student123',
    role: 'student',
  },
  {
    name: 'Alice Faculty',
    email: 'alice@library.com',
    password: 'faculty123',
    role: 'faculty',
  },
];

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Book.deleteMany({});

    // Create users
    console.log('Creating users...');
    const hashedUsers = await Promise.all(
      sampleUsers.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return {
          ...user,
          password: hashedPassword,
        };
      })
    );
    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`✓ Created ${createdUsers.length} users`);

    // Create books
    console.log('Creating books...');
    const createdBooks = await Book.insertMany(sampleBooks);
    console.log(`✓ Created ${createdBooks.length} books`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Test Accounts:');
    console.log('Admin: admin@library.com / admin123');
    console.log('Librarian: librarian@library.com / librarian123');
    console.log('Student: student@library.com / student123');
    console.log('Faculty: faculty@library.com / faculty123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed
seedDatabase();
