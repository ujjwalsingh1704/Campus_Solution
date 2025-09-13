import React, { createContext, useContext, useState, useEffect } from 'react';
import { walletAPI } from '../utils/api';
import { useAuth } from './AuthContext';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const { user } = useAuth();
  const [walletData, setWalletData] = useState({
    student: { balance: 1500, transactions: [] },
    faculty: { balance: 5000, transactions: [] },
    admin: { balance: 10000, transactions: [] }
  });
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get current user's wallet data
  const getCurrentWallet = () => {
    const role = user?.role || 'student';
    return walletData[role] || { balance: 0, transactions: [] };
  };

  const balance = getCurrentWallet().balance;
  const transactions = getCurrentWallet().transactions;

  // Initialize wallet data
  useEffect(() => {
    fetchWalletData();
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      // Try to fetch from API
      const response = await fetch('/api/expenses');
      if (response.ok) {
        const data = await response.json();
        setExpenses(data.expenses || []);
      }
    } catch (error) {
      // Fallback to sample expenses for admin/faculty
      const sampleExpenses = [
        {
          _id: 'exp1',
          amount: 150,
          description: 'Office supplies',
          category: 'office',
          date: new Date().toISOString(),
          approved: true,
          receipt: 'receipt_001.pdf',
          submittedBy: 'admin'
        },
        {
          _id: 'exp2',
          amount: 300,
          description: 'Conference registration',
          category: 'professional',
          date: new Date().toISOString(),
          approved: false,
          receipt: 'receipt_002.pdf',
          submittedBy: 'faculty'
        },
        {
          _id: 'exp3',
          amount: 75,
          description: 'Team lunch',
          category: 'entertainment',
          date: new Date().toISOString(),
          approved: true,
          receipt: 'receipt_003.pdf',
          submittedBy: 'admin'
        }
      ];
      setExpenses(sampleExpenses);
    }
  };

  const fetchWalletData = async () => {
    try {
      const [balanceData, transactionsData] = await Promise.all([
        walletAPI.getBalance(),
        walletAPI.getTransactions()
      ]);
      const role = user?.role || 'student';
      setWalletData(prev => ({
        ...prev,
        [role]: {
          balance: balanceData.balance,
          transactions: transactionsData.transactions
        }
      }));
    } catch (error) {
      // Fallback to role-specific sample data
      const sampleWalletData = {
        student: {
          balance: 1500,
          transactions: [
            {
              _id: 'txn_s1',
              type: 'topup',
              amount: 500,
              description: 'Wallet Top-up via UPI',
              timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'completed'
            },
            {
              _id: 'txn_s2',
              type: 'payment',
              amount: -80,
              description: 'Canteen - Lunch',
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'completed'
            },
            {
              _id: 'txn_s3',
              type: 'payment',
              amount: -25,
              description: 'Library Fine Payment',
              timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'completed'
            }
          ]
        },
        faculty: {
          balance: 5000,
          transactions: [
            {
              _id: 'txn_f1',
              type: 'topup',
              amount: 3000,
              description: 'Monthly Faculty Allowance',
              timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'completed'
            },
            {
              _id: 'txn_f2',
              type: 'payment',
              amount: -200,
              description: 'Conference Registration',
              timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'completed'
            },
            {
              _id: 'txn_f3',
              type: 'payment',
              amount: -150,
              description: 'Research Materials',
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'completed'
            }
          ]
        },
        admin: {
          balance: 10000,
          transactions: [
            {
              _id: 'txn_a1',
              type: 'topup',
              amount: 5000,
              description: 'Administrative Budget Allocation',
              timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'completed'
            },
            {
              _id: 'txn_a2',
              type: 'payment',
              amount: -500,
              description: 'Office Supplies Purchase',
              timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'completed'
            },
            {
              _id: 'txn_a3',
              type: 'payment',
              amount: -300,
              description: 'Event Organization Expenses',
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'completed'
            }
          ]
        }
      };
      setWalletData(sampleWalletData);
    }
  };

  const processPayment = async (amount, description, category = 'general') => {
    const currentWallet = getCurrentWallet();
    if (currentWallet.balance < amount) {
      throw new Error('Insufficient balance');
    }

    setLoading(true);
    try {
      // Try API call first
      await walletAPI.processPayment(amount, description);
      
      // Update local state for current user's role
      const role = user?.role || 'student';
      const newBalance = currentWallet.balance - amount;
      
      const newTransaction = {
        _id: `txn_${Date.now()}`,
        type: 'payment',
        amount: -amount,
        description: description,
        category: category,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };
      
      setWalletData(prev => ({
        ...prev,
        [role]: {
          balance: newBalance,
          transactions: [newTransaction, ...prev[role].transactions]
        }
      }));
      
      return { success: true, newBalance, transaction: newTransaction };
    } catch (error) {
      // Fallback: Update locally for demo
      const role = user?.role || 'student';
      const newBalance = currentWallet.balance - amount;
      
      const newTransaction = {
        _id: `txn_${Date.now()}`,
        type: 'payment',
        amount: -amount,
        description: description,
        category: category,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };
      
      setWalletData(prev => ({
        ...prev,
        [role]: {
          balance: newBalance,
          transactions: [newTransaction, ...prev[role].transactions]
        }
      }));
      
      return { success: true, newBalance, transaction: newTransaction };
    } finally {
      setLoading(false);
    }
  };

  const topUpWallet = async (amount, paymentMethod) => {
    setLoading(true);
    try {
      await walletAPI.topUp(amount, paymentMethod);
      
      const role = user?.role || 'student';
      const currentWallet = getCurrentWallet();
      const newBalance = currentWallet.balance + amount;
      
      const newTransaction = {
        _id: `txn_${Date.now()}`,
        type: 'topup',
        amount: amount,
        description: `Wallet Top-up via ${paymentMethod}`,
        category: 'topup',
        timestamp: new Date().toISOString(),
        status: 'completed'
      };
      
      setWalletData(prev => ({
        ...prev,
        [role]: {
          balance: newBalance,
          transactions: [newTransaction, ...prev[role].transactions]
        }
      }));
      
      return { success: true, newBalance, transaction: newTransaction };
    } catch (error) {
      // Fallback: Update locally for demo
      const role = user?.role || 'student';
      const currentWallet = getCurrentWallet();
      const newBalance = currentWallet.balance + amount;
      
      const newTransaction = {
        _id: `txn_${Date.now()}`,
        type: 'topup',
        amount: amount,
        description: `Wallet Top-up via ${paymentMethod}`,
        category: 'topup',
        timestamp: new Date().toISOString(),
        status: 'completed'
      };
      
      setWalletData(prev => ({
        ...prev,
        [role]: {
          balance: newBalance,
          transactions: [newTransaction, ...prev[role].transactions]
        }
      }));
      
      return { success: true, newBalance, transaction: newTransaction };
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expenseData) => {
    try {
      // Try API call first
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData)
      });
      
      if (response.ok) {
        const newExpense = await response.json();
        setExpenses(prev => [newExpense, ...prev]);
        return newExpense;
      }
    } catch (error) {
      // Fallback: Add locally
      const newExpense = {
        _id: `exp_${Date.now()}`,
        ...expenseData,
        date: new Date().toISOString(),
        approved: false
      };
      setExpenses(prev => [newExpense, ...prev]);
      return newExpense;
    }
  };

  const approveExpense = async (expenseId) => {
    try {
      const response = await fetch(`/api/expenses/${expenseId}/approve`, {
        method: 'PATCH'
      });
      
      if (response.ok) {
        setExpenses(prev => prev.map(expense => 
          expense._id === expenseId 
            ? { ...expense, approved: true }
            : expense
        ));
        alert('Expense approved successfully!');
      } else {
        throw new Error('Failed to approve expense');
      }
    } catch (error) {
      console.error('Error approving expense:', error);
      // Fallback: Update locally
      setExpenses(prev => prev.map(expense => 
        expense._id === expenseId 
          ? { ...expense, approved: true }
          : expense
      ));
      alert('Expense approved successfully! (Demo mode)');
    }
  };

  const rejectExpense = async (expenseId) => {
    try {
      const response = await fetch(`/api/expenses/${expenseId}/reject`, {
        method: 'PATCH'
      });
      
      if (response.ok) {
        setExpenses(prev => prev.map(expense => 
          expense._id === expenseId 
            ? { ...expense, approved: false }
            : expense
        ));
        alert('Expense rejected successfully!');
      } else {
        throw new Error('Failed to reject expense');
      }
    } catch (error) {
      console.error('Error rejecting expense:', error);
      // Fallback: Update locally
      setExpenses(prev => prev.map(expense => 
        expense._id === expenseId 
          ? { ...expense, approved: false }
          : expense
      ));
      alert('Expense rejected successfully! (Demo mode)');
    }
  };

  const getExpenseStats = () => {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const approvedExpenses = expenses.filter(expense => expense.approved);
    const pendingExpenses = expenses.filter(expense => !expense.approved);
    const totalApproved = approvedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalPending = pendingExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    return {
      totalExpenses,
      totalApproved,
      totalPending,
      approvedCount: approvedExpenses.length,
      pendingCount: pendingExpenses.length
    };
  };

  const value = {
    balance,
    transactions,
    expenses,
    loading,
    processPayment,
    topUpWallet,
    fetchWalletData,
    addExpense,
    approveExpense,
    rejectExpense,
    getExpenseStats
  };


  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
