import express from 'express';
import Book from '../models/Book.js';
import BookBorrow from '../models/BookBorrow.js';
import User from '../models/user.js';
import { authenticateToken as auth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get all books with search and filter
router.get('/books', auth, async (req, res) => {
  try {
    const { search, category, available } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (available === 'true') {
      query.availableCopies = { $gt: 0 };
    }

    const books = await Book.find(query)
      .populate('addedBy', 'name email')
      .sort({ title: 1 });

    res.json({ success: true, books });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Add new book (Admin only)
router.post('/books', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const bookData = {
      ...req.body,
      addedBy: req.user.id,
      availableCopies: req.body.totalCopies
    };

    const book = new Book(bookData);
    await book.save();

    const populatedBook = await Book.findById(book._id).populate('addedBy', 'name email');
    res.status(201).json({ success: true, book: populatedBook });
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Borrow a book
router.post('/borrow', auth, async (req, res) => {
  try {
    const { bookId } = req.body;

    // Check if book exists and is available
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ success: false, message: 'Book not available' });
    }

    // Check if user already has this book
    const existingBorrow = await BookBorrow.findOne({
      book: bookId,
      borrower: req.user.id,
      status: { $in: ['borrowed', 'overdue'] }
    });

    if (existingBorrow) {
      return res.status(400).json({ success: false, message: 'You already have this book' });
    }

    // Check borrowing limits
    const activeBorrows = await BookBorrow.countDocuments({
      borrower: req.user.id,
      status: { $in: ['borrowed', 'overdue'] }
    });

    const maxBooks = req.user.role === 'faculty' ? 10 : 5;
    if (activeBorrows >= maxBooks) {
      return res.status(400).json({ 
        success: false, 
        message: `Maximum ${maxBooks} books allowed` 
      });
    }

    // Calculate due date (14 days for faculty, 7 days for students)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + (req.user.role === 'faculty' ? 14 : 7));

    // Create borrow record
    const borrow = new BookBorrow({
      book: bookId,
      borrower: req.user.id,
      borrowerType: req.user.role,
      dueDate,
      issuedBy: req.user.id // In real system, this would be librarian
    });

    await borrow.save();

    // Update book availability
    book.availableCopies -= 1;
    await book.save();

    const populatedBorrow = await BookBorrow.findById(borrow._id)
      .populate('book', 'title author isbn')
      .populate('borrower', 'name email role');

    res.status(201).json({ success: true, borrow: populatedBorrow });
  } catch (error) {
    console.error('Error borrowing book:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Return a book
router.post('/return', auth, async (req, res) => {
  try {
    const { borrowId } = req.body;

    const borrow = await BookBorrow.findById(borrowId)
      .populate('book')
      .populate('borrower', 'name email role');

    if (!borrow) {
      return res.status(404).json({ success: false, message: 'Borrow record not found' });
    }

    if (borrow.borrower._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    if (borrow.status === 'returned') {
      return res.status(400).json({ success: false, message: 'Book already returned' });
    }

    // Calculate final fine
    borrow.calculateFine();
    borrow.returnDate = new Date();
    borrow.status = 'returned';
    await borrow.save();

    // Update book availability
    const book = await Book.findById(borrow.book._id);
    book.availableCopies += 1;
    await book.save();

    res.json({ success: true, borrow, fine: borrow.fine.totalAmount });
  } catch (error) {
    console.error('Error returning book:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get user's borrowed books
router.get('/my-books', auth, async (req, res) => {
  try {
    const borrows = await BookBorrow.find({ borrower: req.user.id })
      .populate('book', 'title author isbn category')
      .sort({ borrowDate: -1 });

    // Update status and calculate fines for each borrow
    for (let borrow of borrows) {
      if (borrow.status !== 'returned') {
        borrow.calculateFine();
        await borrow.save();
      }
    }

    res.json({ success: true, borrows });
  } catch (error) {
    console.error('Error fetching user books:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Pay fine
router.post('/pay-fine', auth, async (req, res) => {
  try {
    const { borrowId, paymentMethod } = req.body;

    const borrow = await BookBorrow.findById(borrowId)
      .populate('book', 'title author')
      .populate('borrower', 'name email');

    if (!borrow) {
      return res.status(404).json({ success: false, message: 'Borrow record not found' });
    }

    if (borrow.borrower._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    if (borrow.fine.isPaid) {
      return res.status(400).json({ success: false, message: 'Fine already paid' });
    }

    // Calculate current fine (including late fees)
    borrow.calculateFine();

    // Process payment (simulate payment processing)
    borrow.fine.isPaid = true;
    borrow.fine.paidAt = new Date();
    await borrow.save();

    res.json({ 
      success: true, 
      message: 'Fine paid successfully',
      amount: borrow.fine.totalAmount,
      paymentMethod
    });
  } catch (error) {
    console.error('Error paying fine:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin: Get all borrows with statistics
router.get('/admin/borrows', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const { status, borrowerType } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (borrowerType && borrowerType !== 'all') {
      query.borrowerType = borrowerType;
    }

    const borrows = await BookBorrow.find(query)
      .populate('book', 'title author isbn')
      .populate('borrower', 'name email role')
      .sort({ borrowDate: -1 });

    // Update status and calculate fines
    for (let borrow of borrows) {
      if (borrow.status !== 'returned') {
        borrow.calculateFine();
        await borrow.save();
      }
    }

    // Calculate statistics
    const stats = {
      totalBorrows: await BookBorrow.countDocuments(),
      activeBorrows: await BookBorrow.countDocuments({ status: { $in: ['borrowed', 'overdue'] } }),
      overdueBorrows: await BookBorrow.countDocuments({ status: 'overdue' }),
      totalFines: await BookBorrow.aggregate([
        { $match: { 'fine.totalAmount': { $gt: 0 } } },
        { $group: { _id: null, total: { $sum: '$fine.totalAmount' } } }
      ]),
      paidFines: await BookBorrow.aggregate([
        { $match: { 'fine.isPaid': true } },
        { $group: { _id: null, total: { $sum: '$fine.totalAmount' } } }
      ]),
      unpaidFines: await BookBorrow.aggregate([
        { $match: { 'fine.isPaid': false, 'fine.totalAmount': { $gt: 0 } } },
        { $group: { _id: null, total: { $sum: '$fine.totalAmount' } } }
      ])
    };

    res.json({ success: true, borrows, stats });
  } catch (error) {
    console.error('Error fetching admin borrows:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Renew book
router.post('/renew', auth, async (req, res) => {
  try {
    const { borrowId } = req.body;

    const borrow = await BookBorrow.findById(borrowId)
      .populate('book', 'title author');

    if (!borrow) {
      return res.status(404).json({ success: false, message: 'Borrow record not found' });
    }

    if (borrow.borrower.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    if (borrow.status === 'returned') {
      return res.status(400).json({ success: false, message: 'Book already returned' });
    }

    if (borrow.renewalCount >= 2) {
      return res.status(400).json({ success: false, message: 'Maximum renewals exceeded' });
    }

    if (borrow.fine.totalAmount > 0 && !borrow.fine.isPaid) {
      return res.status(400).json({ success: false, message: 'Please pay pending fine before renewal' });
    }

    // Extend due date
    const newDueDate = new Date(borrow.dueDate);
    newDueDate.setDate(newDueDate.getDate() + (req.user.role === 'faculty' ? 14 : 7));
    
    borrow.dueDate = newDueDate;
    borrow.renewalCount += 1;
    borrow.status = 'borrowed';
    await borrow.save();

    res.json({ success: true, borrow, newDueDate });
  } catch (error) {
    console.error('Error renewing book:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
