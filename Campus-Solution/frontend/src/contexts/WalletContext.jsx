import React, { createContext, useContext, useState, useEffect } from 'react';
import { walletAPI } from '../utils/api';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [balance, setBalance] = useState(2500);
  const [transactions, setTransactions] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

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
      setBalance(balanceData.balance);
      setTransactions(transactionsData.transactions);
    } catch (error) {
      // Fallback to sample data
      const sampleTransactions = [
        {
          _id: 'txn1',
          type: 'topup',
          amount: 1000,
          description: 'Wallet Top-up via UPI',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed'
        },
        {
          _id: 'txn2',
          type: 'payment',
          amount: -120,
          description: 'Canteen Order - Chicken Biryani',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed'
        },
        {
          _id: 'txn3',
          type: 'topup',
          amount: 2000,
          description: 'Wallet Top-up via Card',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed'
        }
      ];
      setTransactions(sampleTransactions);
    }
  };

  const processPayment = async (amount, description, category = 'general') => {
    if (balance < amount) {
      throw new Error('Insufficient balance');
    }

    setLoading(true);
    try {
      // Try API call first
      await walletAPI.processPayment(amount, description);
      
      // Update local state
      const newBalance = balance - amount;
      setBalance(newBalance);
      
      const newTransaction = {
        _id: `txn_${Date.now()}`,
        type: 'payment',
        amount: -amount,
        description: description,
        category: category,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      
      return { success: true, newBalance, transaction: newTransaction };
    } catch (error) {
      // Fallback: Update locally for demo
      const newBalance = balance - amount;
      setBalance(newBalance);
      
      const newTransaction = {
        _id: `txn_${Date.now()}`,
        type: 'payment',
        amount: -amount,
        description: description,
        category: category,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      
      return { success: true, newBalance, transaction: newTransaction };
    } finally {
      setLoading(false);
    }
  };

  const topUpWallet = async (amount, paymentMethod) => {
    setLoading(true);
    try {
      await walletAPI.topUp(amount, paymentMethod);
      
      const newBalance = balance + amount;
      setBalance(newBalance);
      
      const newTransaction = {
        _id: `txn_${Date.now()}`,
        type: 'topup',
        amount: amount,
        description: `Wallet Top-up via ${paymentMethod}`,
        category: 'topup',
        timestamp: new Date().toISOString(),
        status: 'completed'
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      
      return { success: true, newBalance, transaction: newTransaction };
    } catch (error) {
      // Fallback: Update locally for demo
      const newBalance = balance + amount;
      setBalance(newBalance);
      
      const newTransaction = {
        _id: `txn_${Date.now()}`,
        type: 'topup',
        amount: amount,
        description: `Wallet Top-up via ${paymentMethod}`,
        category: 'topup',
        timestamp: new Date().toISOString(),
        status: 'completed'
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      
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
