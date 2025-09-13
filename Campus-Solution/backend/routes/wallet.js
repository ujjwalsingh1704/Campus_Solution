import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import User from '../models/user.js';

const router = express.Router();

// Get wallet balance
router.get('/balance', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('walletBalance');
    res.json({ balance: user.walletBalance || 0 });
  } catch (error) {
    console.error('Get wallet balance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get transaction history
router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    // For demo purposes, return mock transactions
    // In production, you'd have a separate Transaction model
    const mockTransactions = [
      {
        id: '1',
        type: 'credit',
        amount: 500,
        description: 'Wallet top-up',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'completed'
      },
      {
        id: '2',
        type: 'debit',
        amount: 150,
        description: 'Food order - Burger Combo',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'completed'
      },
      {
        id: '3',
        type: 'credit',
        amount: 1000,
        description: 'Wallet top-up',
        date: new Date().toISOString(),
        status: 'completed'
      }
    ];

    res.json(mockTransactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Top up wallet
router.post('/topup', authenticateToken, async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    if (amount > 10000) {
      return res.status(400).json({ message: 'Maximum top-up amount is ₹10,000' });
    }

    // In production, integrate with actual payment gateway
    // For demo, simulate successful payment
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { walletBalance: amount } },
      { new: true }
    );

    res.json({
      message: 'Wallet topped up successfully',
      newBalance: user.walletBalance,
      transaction: {
        id: Date.now().toString(),
        type: 'credit',
        amount,
        description: `Wallet top-up via ${paymentMethod}`,
        date: new Date().toISOString(),
        status: 'completed'
      }
    });
  } catch (error) {
    console.error('Wallet top-up error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Process payment
router.post('/payment', authenticateToken, async (req, res) => {
  try {
    const { amount, description } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const user = await User.findById(req.user._id);
    
    if (user.walletBalance < amount) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    // Deduct amount from wallet
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { walletBalance: -amount } },
      { new: true }
    );

    res.json({
      message: 'Payment processed successfully',
      newBalance: updatedUser.walletBalance,
      transaction: {
        id: Date.now().toString(),
        type: 'debit',
        amount,
        description: description || 'Payment',
        date: new Date().toISOString(),
        status: 'completed'
      }
    });
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
