import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { foodAPI } from '../utils/api';
import { Coffee, Clock, CheckCircle, XCircle, AlertCircle, IndianRupee } from 'lucide-react';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Restrict access to canteen staff only
  if (user?.role !== 'canteen_staff') {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Access Restricted</h2>
            <p className="text-gray-400">This page is only accessible to canteen staff members.</p>
          </div>
        </div>
      </Layout>
    );
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await foodAPI.getOrders();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Mock data for demo
      setOrders([
        {
          _id: '1',
          orderNumber: 'ORD-001',
          customer: {
            name: 'John Doe',
            studentId: '2023001',
            email: 'john@example.com',
          },
          items: [
            { name: 'Veg Burger', quantity: 2, price: 80 },
            { name: 'Masala Chai', quantity: 1, price: 20 },
          ],
          total: 180,
          status: 'pending',
          orderTime: '2024-03-10T10:30:00Z',
          estimatedTime: 15,
          paymentStatus: 'paid',
        },
        {
          _id: '2',
          orderNumber: 'ORD-002',
          customer: {
            name: 'Jane Smith',
            studentId: '2023002',
            email: 'jane@example.com',
          },
          items: [
            { name: 'Chicken Sandwich', quantity: 1, price: 120 },
            { name: 'Fresh Juice', quantity: 1, price: 40 },
          ],
          total: 160,
          status: 'preparing',
          orderTime: '2024-03-10T10:45:00Z',
          estimatedTime: 10,
          paymentStatus: 'paid',
        },
        {
          _id: '3',
          orderNumber: 'ORD-003',
          customer: {
            name: 'Mike Johnson',
            studentId: '2023003',
            email: 'mike@example.com',
          },
          items: [
            { name: 'Pasta', quantity: 1, price: 100 },
            { name: 'Samosa', quantity: 3, price: 15 },
          ],
          total: 145,
          status: 'ready',
          orderTime: '2024-03-10T11:00:00Z',
          paymentStatus: 'paid',
        },
        {
          _id: '4',
          orderNumber: 'ORD-004',
          customer: {
            name: 'Sarah Wilson',
            studentId: '2023004',
            email: 'sarah@example.com',
          },
          items: [
            { name: 'Veg Burger', quantity: 1, price: 80 },
          ],
          total: 80,
          status: 'completed',
          orderTime: '2024-03-10T09:15:00Z',
          paymentStatus: 'paid',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await foodAPI.updateOrderStatus(orderId, newStatus);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      // Update locally for demo
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-600';
      case 'preparing': return 'bg-blue-600';
      case 'ready': return 'bg-green-600';
      case 'completed': return 'bg-gray-600';
      case 'cancelled': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <AlertCircle size={16} />;
      case 'preparing': return <Clock size={16} />;
      case 'ready': return <CheckCircle size={16} />;
      case 'completed': return <CheckCircle size={16} />;
      case 'cancelled': return <XCircle size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    completed: orders.filter(o => o.status === 'completed').length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Order Management</h1>
          <p className="text-gray-400">Monitor and manage all canteen orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Orders</p>
                <p className="text-xl font-bold text-white">{orderStats.total}</p>
              </div>
              <Coffee className="text-blue-500" size={24} />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-xl font-bold text-yellow-400">{orderStats.pending}</p>
              </div>
              <AlertCircle className="text-yellow-500" size={24} />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Preparing</p>
                <p className="text-xl font-bold text-blue-400">{orderStats.preparing}</p>
              </div>
              <Clock className="text-blue-500" size={24} />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Ready</p>
                <p className="text-xl font-bold text-green-400">{orderStats.ready}</p>
              </div>
              <CheckCircle className="text-green-500" size={24} />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-xl font-bold text-gray-400">{orderStats.completed}</p>
              </div>
              <CheckCircle className="text-gray-500" size={24} />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Revenue</p>
                <p className="text-xl font-bold text-green-400">₹{orderStats.totalRevenue}</p>
              </div>
              <IndianRupee className="text-green-500" size={24} />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-4 border-b border-gray-700">
          {['all', 'pending', 'preparing', 'ready', 'completed'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`pb-2 px-1 capitalize ${
                filter === status 
                  ? 'text-blue-400 border-b-2 border-blue-400' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {status} {status !== 'all' && `(${orderStats[status]})`}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Coffee size={48} className="mx-auto text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No orders found</h3>
              <p className="text-gray-400">
                {filter === 'all' ? 'No orders have been placed yet.' : `No ${filter} orders found.`}
              </p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <div key={order._id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Order #{order.orderNumber}</h3>
                    <div className="text-gray-400 text-sm space-y-1">
                      <p>Customer: {order.customer.name} ({order.customer.studentId})</p>
                      <p>Email: {order.customer.email}</p>
                      <p>Ordered: {new Date(order.orderTime).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm text-white flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </span>
                    {order.estimatedTime && (order.status === 'pending' || order.status === 'preparing') && (
                      <p className="text-gray-400 text-sm mt-1">
                        ETA: ~{order.estimatedTime} mins
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-gray-700 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-white mb-2">Order Items:</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-300">{item.quantity}x {item.name}</span>
                        <span className="text-white">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-600 pt-2 mt-2">
                    <div className="flex justify-between font-medium">
                      <span className="text-white">Total</span>
                      <span className="text-green-400">₹{order.total}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  {order.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(order._id, 'preparing')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        Start Preparing
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        Cancel Order
                      </button>
                    </>
                  )}
                  
                  {order.status === 'preparing' && (
                    <button
                      onClick={() => handleStatusUpdate(order._id, 'ready')}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      Mark as Ready
                    </button>
                  )}
                  
                  {order.status === 'ready' && (
                    <button
                      onClick={() => handleStatusUpdate(order._id, 'completed')}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      Mark as Completed
                    </button>
                  )}
                </div>

                {/* Payment Status */}
                <div className="mt-4 text-xs text-gray-400">
                  Payment Status: 
                  <span className={`ml-1 ${order.paymentStatus === 'paid' ? 'text-green-400' : 'text-red-400'}`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
