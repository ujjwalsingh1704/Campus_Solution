import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, ArrowUpRight, ArrowDownLeft, Wallet as WalletIcon, IndianRupee, Smartphone, Building, Coffee, BookOpen, Calendar, X, History } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

const Wallet = () => {
  const { user } = useAuth();
  const { balance, transactions, topUpWallet, loading } = useWallet();

  // Role-specific wallet information
  const getWalletInfo = () => {
    switch (user?.role) {
      case 'student':
        return {
          title: 'Student Wallet',
          description: 'Manage your campus expenses and payments',
          allowedTransactions: ['Canteen purchases', 'Library fines', 'Event registrations', 'Printing services']
        };
      case 'faculty':
        return {
          title: 'Faculty Wallet',
          description: 'Professional expenses and allowances',
          allowedTransactions: ['Conference fees', 'Research materials', 'Professional development', 'Office supplies']
        };
      case 'admin':
        return {
          title: 'Administrative Wallet',
          description: 'Institutional budget and expense management',
          allowedTransactions: ['Event organization', 'Office supplies', 'Infrastructure', 'Staff expenses']
        };
      default:
        return {
          title: 'Campus Wallet',
          description: 'Manage your campus finances',
          allowedTransactions: ['General expenses']
        };
    }
  };

  const walletInfo = getWalletInfo();
  
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  // Sample transactions if none exist
  const sampleTransactions = [
    {
      _id: 'txn1',
      type: 'topup',
      amount: 1000,
      description: 'Wallet Top-up via UPI',
      category: 'topup',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed'
    },
    {
      _id: 'txn2',
      type: 'payment',
      amount: -150,
      description: 'Canteen - Lunch',
      category: 'food',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed'
    },
    {
      _id: 'txn3',
      type: 'payment',
      amount: -50,
      description: 'Library Fine',
      category: 'academic',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed'
    },
    {
      _id: 'txn4',
      type: 'topup',
      amount: 500,
      description: 'Wallet Top-up via Card',
      category: 'topup',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed'
    }
  ];

  const displayTransactions = transactions.length > 0 ? transactions : sampleTransactions;

  const getCategoryIcon = (category) => {
    const icons = {
      food: Coffee,
      academic: BookOpen,
      events: Calendar,
      topup: Plus
    };
    return icons[category] || IndianRupee;
  };

  const getCategoryColor = (category) => {
    const colors = {
      food: 'text-orange-400',
      academic: 'text-blue-400',
      events: 'text-purple-400',
      topup: 'text-green-400'
    };
    return colors[category] || 'text-gray-400';
  };

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: Smartphone, description: 'PhonePe, GPay, Paytm' },
    { id: 'card', name: 'Debit/Credit Card', icon: CreditCard, description: 'Visa, Mastercard' },
    { id: 'netbanking', name: 'Net Banking', icon: Building, description: 'All major banks' }
  ];

  const quickAmounts = [100, 200, 500, 1000];

  const handleTopUp = async () => {
    if (!topUpAmount || topUpAmount <= 0) return;
    
    setIsProcessing(true);
    try {
      const paymentMethodName = paymentMethods.find(p => p.id === selectedPaymentMethod)?.name || 'Unknown';
      await topUpWallet(parseInt(topUpAmount), paymentMethodName);
      
      setTopUpAmount('');
      setShowTopUp(false);
      alert(`Successfully topped up ₹${topUpAmount} via ${paymentMethodName}`);
    } catch (error) {
      console.error('Top-up failed:', error);
      alert('Top-up failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{walletInfo.title}</h1>
              <p className="text-emerald-100">{walletInfo.description}</p>
              <div className="mt-3">
                <p className="text-emerald-200 text-sm font-medium mb-1">Allowed Transactions:</p>
                <div className="flex flex-wrap gap-2">
                  {walletInfo.allowedTransactions.map((transaction, index) => (
                    <span key={index} className="bg-emerald-500/30 text-emerald-100 px-2 py-1 rounded text-xs">
                      {transaction}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <WalletIcon className="text-emerald-200" size={48} />
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-blue-100 text-sm mb-2">Available Balance</p>
              <p className="text-4xl font-bold text-white">₹{balance.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm">Last Updated</p>
              <p className="text-blue-200 text-sm">{new Date().toLocaleTimeString()}</p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={() => setShowTopUp(true)}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add Money</span>
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2">
              <History size={20} />
              <span>View All</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Coffee className="text-orange-400" size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Food & Dining</p>
                <p className="text-2xl font-bold text-white">₹450</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <BookOpen className="text-blue-400" size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Academic</p>
                <p className="text-2xl font-bold text-white">₹200</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Plus className="text-green-400" size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Top-ups</p>
                <p className="text-2xl font-bold text-white">₹1,500</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Transactions</h2>
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              View All Transactions
            </button>
          </div>
          
          {displayTransactions.length > 0 ? (
            <div className="space-y-4">
              {displayTransactions.slice(0, 5).map((transaction) => {
                const IconComponent = getCategoryIcon(transaction.category);
                const isDebit = transaction.type === 'payment';
                const categoryColor = getCategoryColor(transaction.category);
                
                return (
                  <div key={transaction._id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${isDebit ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
                        <IconComponent className={`${isDebit ? 'text-red-400' : 'text-green-400'}`} size={20} />
                      </div>
                      <div>
                        <p className="text-white font-medium">{transaction.description}</p>
                        <div className="flex items-center space-x-2 text-sm">
                          <span className={`${categoryColor} capitalize`}>{transaction.category}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-400">{formatDate(transaction.timestamp)}</span>
                          <span className="text-gray-500">{formatTime(transaction.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-lg ${isDebit ? 'text-red-400' : 'text-green-400'}`}>
                        {isDebit ? '-' : '+'}₹{Math.abs(transaction.amount).toLocaleString()}
                      </p>
                      <p className="text-gray-400 text-sm capitalize">{transaction.status}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <History className="mx-auto text-gray-500 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-white mb-2">No Transactions Yet</h3>
              <p className="text-gray-400 mb-4">Your transaction history will appear here</p>
              <button
                onClick={() => setShowTopUp(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Add Money to Get Started
              </button>
            </div>
          )}
        </div>

        {/* Top-up Modal */}
        {showTopUp && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Add Money to Wallet</h3>
                <button
                  onClick={() => setShowTopUp(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              {/* Amount Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="number"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="mb-6">
                <p className="text-sm text-gray-300 mb-3">Quick Amounts</p>
                <div className="grid grid-cols-4 gap-2">
                  {quickAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setTopUpAmount(amount.toString())}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        topUpAmount === amount.toString()
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 hover:bg-gray-600 text-white'
                      }`}
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <p className="text-sm text-gray-300 mb-3">Payment Method</p>
                <div className="space-y-2">
                  {paymentMethods.map((method) => (
                    <label key={method.id} className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedPaymentMethod === method.id ? 'bg-blue-600/20 border border-blue-500' : 'bg-gray-700 hover:bg-gray-600'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={selectedPaymentMethod === method.id}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        className="text-blue-500"
                      />
                      <method.icon className="text-gray-300" size={20} />
                      <div>
                        <p className="text-white font-medium">{method.name}</p>
                        <p className="text-gray-400 text-sm">{method.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowTopUp(false)}
                  className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTopUp}
                  disabled={!topUpAmount || topUpAmount <= 0 || isProcessing}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Add ₹{topUpAmount || 0}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Wallet;