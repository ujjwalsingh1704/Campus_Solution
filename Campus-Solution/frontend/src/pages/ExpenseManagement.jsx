import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';
import Layout from '../components/Layout';
import { 
  Plus, 
  CheckCircle, 
  XCircle, 
  IndianRupee, 
  FileText, 
  Calendar,
  Filter,
  Search,
  Upload,
  Download
} from 'lucide-react';

const ExpenseManagement = () => {
  const { user } = useAuth();
  const { expenses, addExpense, approveExpense, rejectExpense, getExpenseStats } = useWallet();
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: 'office',
    receipt: null
  });

  const categories = [
    'office', 'professional', 'travel', 'entertainment', 'equipment', 'other'
  ];

  const stats = getExpenseStats();

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'approved' && expense.approved) ||
      (filterStatus === 'pending' && !expense.approved);
    const matchesCategory = filterCategory === 'all' || expense.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    const expenseData = {
      ...formData,
      amount: parseFloat(formData.amount),
      submittedBy: user.role,
      submittedByName: user.name
    };

    try {
      const newExpense = await addExpense(expenseData);
      if (newExpense) {
        setFormData({ amount: '', description: '', category: 'office', receipt: null });
        setShowAddForm(false);
        alert('Expense submitted successfully!');
      }
    } catch (error) {
      console.error('Error submitting expense:', error);
      alert('Failed to submit expense. Please try again.');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, receipt: file.name });
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      office: 'bg-blue-600/20 text-blue-400 border-blue-600/50',
      professional: 'bg-green-600/20 text-green-400 border-green-600/50',
      travel: 'bg-purple-600/20 text-purple-400 border-purple-600/50',
      entertainment: 'bg-orange-600/20 text-orange-400 border-orange-600/50',
      equipment: 'bg-red-600/20 text-red-400 border-red-600/50',
      other: 'bg-gray-600/20 text-gray-400 border-gray-600/50'
    };
    return colors[category] || colors.other;
  };

  const getStatusColor = (approved) => {
    return approved 
      ? 'bg-green-600/20 text-green-400 border-green-600/50'
      : 'bg-yellow-600/20 text-yellow-400 border-yellow-600/50';
  };

  if (user?.role !== 'admin' && user?.role !== 'faculty') {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <XCircle size={48} className="mx-auto text-red-400 mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
            <p className="text-gray-400">Only admin and faculty can access expense management.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Expense Management</h1>
            <p className="text-gray-400">Track and manage your expenses</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Expense</span>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card-modern p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Expenses</p>
                <p className="text-2xl font-bold text-white">₹{stats.totalExpenses}</p>
              </div>
              <IndianRupee className="text-blue-400" size={24} />
            </div>
          </div>

          <div className="card-modern p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Approved</p>
                <p className="text-2xl font-bold text-white">₹{stats.totalApproved}</p>
                <p className="text-green-400 text-sm">{stats.approvedCount} items</p>
              </div>
              <CheckCircle className="text-green-400" size={24} />
            </div>
          </div>

          <div className="card-modern p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-white">₹{stats.totalPending}</p>
                <p className="text-yellow-400 text-sm">{stats.pendingCount} items</p>
              </div>
              <XCircle className="text-yellow-400" size={24} />
            </div>
          </div>

          <div className="card-modern p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">This Month</p>
                <p className="text-2xl font-bold text-white">₹{stats.totalExpenses}</p>
                <p className="text-blue-400 text-sm">All time</p>
              </div>
              <Calendar className="text-blue-400" size={24} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card-modern p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-modern w-full pl-10"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-modern w-full"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </select>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input-modern w-full"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Expense Form */}
        {showAddForm && (
          <div className="card-modern p-6">
            <h2 className="text-xl font-bold text-white mb-4">Add New Expense</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Amount (₹) *</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="input-modern w-full"
                    placeholder="0.00"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="input-modern w-full"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="input-modern w-full"
                  rows="3"
                  placeholder="Describe the expense..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Receipt (Optional)</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    id="receipt-upload"
                  />
                  <label
                    htmlFor="receipt-upload"
                    className="btn-secondary flex items-center space-x-2 cursor-pointer"
                  >
                    <Upload size={16} />
                    <span>Upload Receipt</span>
                  </label>
                  {formData.receipt && (
                    <span className="text-green-400 text-sm">{formData.receipt}</span>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button type="submit" className="btn-primary">
                  Submit Expense
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Expenses List */}
        <div className="space-y-4">
          {filteredExpenses.map(expense => (
            <div key={expense._id} className="card-modern p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{expense.description}</h3>
                  <p className="text-gray-400 text-sm">Submitted by {expense.submittedByName || expense.submittedBy}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-white">₹{expense.amount}</p>
                  <p className="text-gray-400 text-sm">{new Date(expense.date).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <span className={`status-badge ${getCategoryColor(expense.category)}`}>
                    {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
                  </span>
                  <span className={`status-badge ${getStatusColor(expense.approved)}`}>
                    {expense.approved ? 'Approved' : 'Pending'}
                  </span>
                </div>
                
                {user?.role === 'admin' && !expense.approved && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => approveExpense(expense._id)}
                      className="btn-primary text-sm px-3 py-1"
                    >
                      <CheckCircle size={16} className="mr-1" />
                      Approve
                    </button>
                    <button
                      onClick={() => rejectExpense(expense._id)}
                      className="btn-secondary text-sm px-3 py-1"
                    >
                      <XCircle size={16} className="mr-1" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
              
              {expense.receipt && (
                <div className="mt-4 pt-4 border-t border-gray-600/50">
                  <div className="flex items-center space-x-2 text-blue-400">
                    <FileText size={16} />
                    <span className="text-sm">{expense.receipt}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredExpenses.length === 0 && (
          <div className="text-center py-12">
            <IndianRupee size={48} className="mx-auto text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Expenses Found</h3>
            <p className="text-gray-400">
              {searchTerm || filterStatus !== 'all' || filterCategory !== 'all'
                ? 'No expenses match your current filters.'
                : 'Submit your first expense to get started.'
              }
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ExpenseManagement;
