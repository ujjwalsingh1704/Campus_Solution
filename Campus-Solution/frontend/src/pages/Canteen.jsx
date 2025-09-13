import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';
import { useOrders } from '../contexts/OrderContext';
import { useMenu } from '../contexts/MenuContext';
import { foodAPI } from '../utils/api';
import Layout from '../components/Layout';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Clock, 
  User, 
  CreditCard, 
  Smartphone, 
  IndianRupee,
  Filter,
  Search,
  Star,
  Leaf,
  Wallet,
  Coffee,
  CheckCircle,
  XCircle
} from 'lucide-react';

const Canteen = () => {
  const { user } = useAuth();
  const { balance, processPayment } = useWallet();
  const { allOrders, createOrder, updateOrderStatus, getOrdersByUser } = useOrders();
  const { menu, addMenuItem, updateMenuItem, toggleAvailability, getCategories } = useMenu();
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(
    user?.role === 'canteen_staff' ? 'manage-orders' : 'menu'
  );
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [showPayment, setShowPayment] = useState(false);
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [newItemForm, setNewItemForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Main Course',
    preparationTime: '',
    ingredients: '',
    image: ''
  });

  useEffect(() => {
    // Get user-specific orders from shared context
    if (user) {
      const userOrders = getOrdersByUser(user.studentId || user.employeeId, user.role);
      setOrders(userOrders);
    }
  }, [user, allOrders]);

  const handleAddMenuItem = () => {
    if (!newItemForm.name || !newItemForm.price || !newItemForm.description) {
      alert('Please fill in all required fields');
      return;
    }

    const itemData = {
      name: newItemForm.name,
      description: newItemForm.description,
      price: parseFloat(newItemForm.price),
      category: newItemForm.category,
      preparationTime: parseInt(newItemForm.preparationTime) || 10,
      ingredients: newItemForm.ingredients.split(',').map(ing => ing.trim()).filter(ing => ing),
      image: newItemForm.image || 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop'
    };

    addMenuItem(itemData);
    setNewItemForm({
      name: '',
      description: '',
      price: '',
      category: 'Main Course',
      preparationTime: '',
      ingredients: '',
      image: ''
    });
    setShowAddItemForm(false);
    alert('Menu item added successfully!');
  };

  const handleUpdateMenuItem = (itemId, updates) => {
    updateMenuItem(itemId, updates);
    alert('Menu item updated successfully!');
  };


  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await foodAPI.updateOrderStatus(orderId, newStatus);
      alert('Order status updated successfully!');
    } catch (error) {
      console.error('Error updating order status:', error);
      // Fallback: Update status using shared context
      updateOrderStatus(orderId, newStatus);
      alert(`Order status updated to "${newStatus}" successfully!`);
    }
  };

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem._id === item._id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem._id === item._id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    const existingItem = cart.find(cartItem => cartItem._id === itemId);
    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map(cartItem => 
        cartItem._id === itemId 
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      ));
    } else {
      setCart(cart.filter(cartItem => cartItem._id !== itemId));
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    
    const orderTotal = getCartTotal();
    
    try {
      // Handle wallet payment
      if (paymentMethod === 'wallet') {
        if (balance < orderTotal) {
          alert(`Insufficient wallet balance. Current balance: ₹${balance}, Required: ₹${orderTotal}`);
          return;
        }
        
        // Process wallet payment
        await processPayment(orderTotal, `Canteen Order - ${cart.map(item => item.name).join(', ')}`, 'canteen');
      }
      
      const apiOrderData = {
        items: cart.map(item => ({
          itemId: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total: orderTotal,
        paymentMethod: paymentMethod,
        customerName: user?.name || 'Guest',
        studentId: user?.studentId || user?.employeeId || 'N/A',
      };
      
      try {
        await foodAPI.createOrder(apiOrderData);
      } catch (apiError) {
        // API failed, continue with local order creation
      }
      
      // Create order using shared context
      const orderData = {
        items: cart.map(item => ({
          itemId: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total: orderTotal,
        paymentMethod: paymentMethod,
        customerName: user?.name || 'Guest',
        studentId: user?.studentId || user?.employeeId || 'N/A',
        customerRole: user?.role || 'guest',
        status: 'pending',
        customerPhone: user?.phone || '+91 0000000000',
        specialInstructions: '',
      };
      
      const newOrder = createOrder(orderData);
      
      // Clear cart and show success
      setCart([]);
      setActiveTab('orders');
      
      const successMessage = paymentMethod === 'wallet' 
        ? `Order placed successfully via wallet! Order #${newOrder._id.slice(-6)} - Estimated time: ${newOrder.estimatedTime} minutes. Remaining balance: ₹${balance - orderTotal}`
        : `Order placed successfully! Order #${newOrder._id.slice(-6)} - Estimated time: ${newOrder.estimatedTime} minutes`;
      
      alert(successMessage);
      
    } catch (error) {
      if (error.message === 'Insufficient balance') {
        alert(`Insufficient wallet balance. Current balance: ₹${balance}, Required: ₹${orderTotal}`);
      } else {
        alert('Error placing order: ' + error.message);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-600';
      case 'preparing': return 'bg-blue-600';
      case 'ready': return 'bg-green-600';
      case 'completed': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  const categories = ['All', ...getCategories()];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredMenu = selectedCategory === 'All' 
    ? menu 
    : menu.filter(item => item.category === selectedCategory);

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
      <div className="space-y-8 animate-slide-up">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Campus Canteen
            </h1>
            <p className="text-gray-300 text-lg">Order delicious food from campus canteen</p>
          </div>
          {cart.length > 0 && (
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg">
              <ShoppingCart size={20} />
              <span className="font-semibold">{cart.length} items - ₹{getCartTotal()}</span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 bg-gray-800/50 p-2 rounded-xl">
          {(user?.role === 'student' || user?.role === 'faculty' || user?.role === 'admin') && (
            <>
              <button
                onClick={() => setActiveTab('menu')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === 'menu' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                📋 Menu
              </button>
              <button
                onClick={() => setActiveTab('cart')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === 'cart' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                🛒 Cart ({cart.length})
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === 'orders' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                📦 My Orders
              </button>
            </>
          )}
          {user?.role === 'canteen_staff' && (
            <>
              <button
                onClick={() => setActiveTab('menu')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === 'menu' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                📋 Menu
              </button>
              <button
                onClick={() => setActiveTab('manage-orders')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === 'manage-orders' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                ⚙️ Manage Orders
              </button>
              <button
                onClick={() => setActiveTab('menu-management')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === 'menu-management' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                Menu Management
              </button>
            </>
          )}
        </div>

        {/* Menu Tab */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            {/* Category Filter */}
            <div className="flex space-x-4">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMenu.map(item => (
                <div key={item._id} className="card-modern card-hover p-6">
                  <div className="aspect-w-16 aspect-h-12 mb-4">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop';
                      }}
                    />
                  </div>
                  
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                    <span className="text-lg font-bold text-green-400">₹{item.price}</span>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4">{item.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-1 rounded-full text-xs capitalize ${
                      item.available ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                      {item.available ? 'Available' : 'Out of Stock'}
                    </span>
                    
                    <div className="flex items-center space-x-2">
                      {cart.find(cartItem => cartItem._id === item._id) ? (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="text-white font-bold min-w-[2rem] text-center">
                            {cart.find(cartItem => cartItem._id === item._id)?.quantity || 0}
                          </span>
                          <button
                            onClick={() => addToCart(item)}
                            disabled={!item.available}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item)}
                          disabled={!item.available}
                          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                        >
                          <Plus size={16} />
                          <span>Add</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cart Tab */}
        {activeTab === 'cart' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">Your Cart</h2>
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart size={48} className="mx-auto text-gray-500 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Your cart is empty</h3>
                  <p className="text-gray-400">Add some delicious items from the menu!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item._id} className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center">
                          <Coffee size={24} className="text-gray-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{item.name}</h3>
                          <p className="text-gray-400 text-sm">{item.category}</p>
                          <p className="text-green-400 font-bold">₹{item.price} each</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="text-white font-bold min-w-[3rem] text-center text-lg">{item.quantity}</span>
                        <button
                          onClick={() => addToCart(item)}
                          className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                        <div className="ml-4 text-right">
                          <p className="text-white font-bold">₹{item.price * item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t border-gray-600 pt-6">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-2xl font-bold text-white">Total: ₹{getCartTotal()}</span>
                      <div className="text-gray-400 text-sm">
                        {cart.reduce((sum, item) => sum + item.quantity, 0)} items
                      </div>
                    </div>
                    
                    {/* Payment Method Selection */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-3">Payment Method</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <button
                          onClick={() => setPaymentMethod('wallet')}
                          className={`p-4 rounded-lg border-2 transition-colors ${
                            paymentMethod === 'wallet'
                              ? 'border-blue-500 bg-blue-600/20 text-blue-400'
                              : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                          }`}
                        >
                          <div className="text-center">
                            <IndianRupee size={24} className="mx-auto mb-2" />
                            <p className="font-medium">Campus Wallet</p>
                            <p className="text-sm opacity-75">Balance: ₹1,250</p>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => setPaymentMethod('upi')}
                          className={`p-4 rounded-lg border-2 transition-colors ${
                            paymentMethod === 'upi'
                              ? 'border-blue-500 bg-blue-600/20 text-blue-400'
                              : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                          }`}
                        >
                          <div className="text-center">
                            <ShoppingCart size={24} className="mx-auto mb-2" />
                            <p className="font-medium">UPI Payment</p>
                            <p className="text-sm opacity-75">PhonePe/GPay</p>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => setPaymentMethod('cash')}
                          className={`p-4 rounded-lg border-2 transition-colors ${
                            paymentMethod === 'cash'
                              ? 'border-blue-500 bg-blue-600/20 text-blue-400'
                              : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                          }`}
                        >
                          <div className="text-center">
                            <Coffee size={24} className="mx-auto mb-2" />
                            <p className="font-medium">Cash Payment</p>
                            <p className="text-sm opacity-75">Pay at counter</p>
                          </div>
                        </button>
                      </div>
                    </div>
                    
                    <button
                      onClick={handlePlaceOrder}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-medium text-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart size={20} />
                      <span>Place Order - ₹{getCartTotal()}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* My Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">My Orders</h2>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Clock size={48} className="mx-auto text-gray-500 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No orders yet</h3>
                  <p className="text-gray-400">Your orders will appear here once you place them</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order._id} className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white">Order #{order._id}</h3>
                          <p className="text-gray-400 text-sm">
                            {new Date(order.orderTime).toLocaleString()}
                          </p>
                          {order.estimatedTime && order.status !== 'completed' && (
                            <p className="text-blue-400 text-sm">
                              Estimated time: {order.estimatedTime} minutes
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-sm text-white ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                          <p className="text-green-400 font-bold mt-1">₹{order.total}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <h4 className="font-medium text-white">Items:</h4>
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm bg-gray-800 p-2 rounded">
                            <span className="text-gray-300">{item.quantity}x {item.name}</span>
                            <span className="text-white">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                      
                      {order.status === 'ready' && (
                        <div className="bg-green-600/20 border border-green-600 rounded-lg p-3">
                          <p className="text-green-400 font-medium">Your order is ready for pickup!</p>
                          <p className="text-green-300 text-sm">Please collect from the canteen counter</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Canteen Staff - Manage Orders Tab */}
        {activeTab === 'manage-orders' && user?.role === 'canteen_staff' && (
          <div className="space-y-6">
            {/* Dynamic Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-300 text-sm">Total Orders</p>
                    <p className="text-2xl font-bold text-white">{allOrders.length}</p>
                    <p className="text-green-400 text-sm flex items-center mt-1">
                      <Clock size={16} className="mr-1" />
                      {allOrders.filter(o => new Date(o.orderTime) > new Date(Date.now() - 24*60*60*1000)).length} today
                    </p>
                  </div>
                  <div className="bg-blue-600 p-3 rounded-lg">
                    <ShoppingCart className="text-white" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-300 text-sm">Total Revenue</p>
                    <p className="text-2xl font-bold text-white">₹{allOrders.reduce((sum, order) => sum + order.total, 0)}</p>
                    <p className="text-green-400 text-sm flex items-center mt-1">
                      <IndianRupee size={16} className="mr-1" />
                      ₹{allOrders.filter(o => new Date(o.orderTime) > new Date(Date.now() - 24*60*60*1000)).reduce((sum, order) => sum + order.total, 0)} today
                    </p>
                  </div>
                  <div className="bg-green-600 p-3 rounded-lg">
                    <IndianRupee className="text-white" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-300 text-sm">Pending Orders</p>
                    <p className="text-2xl font-bold text-white">{allOrders.filter(o => o.status === 'pending').length}</p>
                    <p className="text-yellow-400 text-sm flex items-center mt-1">
                      <Clock size={16} className="mr-1" />
                      Need attention
                    </p>
                  </div>
                  <div className="bg-yellow-600 p-3 rounded-lg">
                    <Clock className="text-white" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-300 text-sm">Avg Order Value</p>
                    <p className="text-2xl font-bold text-white">
                      ₹{allOrders.length > 0 ? Math.round(allOrders.reduce((sum, order) => sum + order.total, 0) / allOrders.length) : 0}
                    </p>
                    <p className="text-blue-400 text-sm flex items-center mt-1">
                      <Coffee size={16} className="mr-1" />
                      Per order
                    </p>
                  </div>
                  <div className="bg-purple-600 p-3 rounded-lg">
                    <Coffee className="text-white" size={24} />
                  </div>
                </div>
              </div>
            </div>

            <div className="card-modern p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                ⚙️ Order Management
              </h2>
              {allOrders.filter(order => order.status !== 'completed').length === 0 ? (
                <div className="text-center py-12">
                  <Clock size={48} className="mx-auto text-gray-500 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No active orders</h3>
                  <p className="text-gray-400">Orders from students, faculty, and admin will appear here when they place them</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {allOrders.filter(order => order.status !== 'completed').map(order => (
                    <div key={order._id} className="card-modern card-hover p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white">Order #{order._id}</h3>
                          <div className="flex items-center space-x-4 mt-2">
                            <p className="text-gray-300">{order.customerName}</p>
                            <span className={`status-badge ${
                              order.customerRole === 'student' ? 'status-pending' :
                              order.customerRole === 'faculty' ? 'status-approved' :
                              order.customerRole === 'admin' ? 'status-approved' : 'status-pending'
                            }`}>
                              {order.customerRole}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm mt-1">
                            {new Date(order.orderTime).toLocaleString()}
                          </p>
                          {order.customerPhone && (
                            <p className="text-gray-400 text-sm">Phone: {order.customerPhone}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className={`status-badge ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                          <p className="text-green-400 font-bold mt-2 text-lg">₹{order.total}</p>
                          {order.estimatedTime && (
                            <p className="text-blue-400 text-sm">Est. {order.estimatedTime} min</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-300">{item.quantity}x {item.name}</span>
                            <span className="text-white">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex space-x-3">
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order._id, 'preparing')}
                            className="btn-primary text-sm py-2 px-4"
                          >
                            Start Preparing
                          </button>
                        )}
                        {order.status === 'preparing' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order._id, 'ready')}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
                          >
                            Mark Ready
                          </button>
                        )}
                        {order.status === 'ready' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order._id, 'completed')}
                            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
                          >
                            Complete Order
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Canteen Staff - Menu Management Tab */}
        {activeTab === 'menu-management' && user?.role === 'canteen_staff' && (
          <div className="space-y-6">
            <div className="card-modern p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  Menu Management
                </h2>
                <button
                  onClick={() => setShowAddItemForm(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus size={20} />
                  <span>Add New Item</span>
                </button>
              </div>
              
              {/* Menu Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-300 text-sm">Total Items</p>
                      <p className="text-2xl font-bold text-white">{menu.length}</p>
                    </div>
                    <Coffee className="text-blue-400" size={24} />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-300 text-sm">Available</p>
                      <p className="text-2xl font-bold text-white">{menu.filter(item => item.available).length}</p>
                    </div>
                    <CheckCircle className="text-green-400" size={24} />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-500/30 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-300 text-sm">Out of Stock</p>
                      <p className="text-2xl font-bold text-white">{menu.filter(item => !item.available).length}</p>
                    </div>
                    <XCircle className="text-red-400" size={24} />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-300 text-sm">Categories</p>
                      <p className="text-2xl font-bold text-white">{new Set(menu.map(item => item.category)).size}</p>
                    </div>
                    <Filter className="text-yellow-400" size={24} />
                  </div>
                </div>
              </div>

              {/* Add New Item Form */}
              {showAddItemForm && (
                <div className="bg-gray-800/50 rounded-xl p-6 mb-8 border border-gray-600/50">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    ➕ Add New Menu Item
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Item Name *</label>
                      <input
                        type="text"
                        value={newItemForm.name}
                        onChange={(e) => setNewItemForm({...newItemForm, name: e.target.value})}
                        className="input-modern w-full"
                        placeholder="e.g., Burger Chicken"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Price (₹) *</label>
                      <input
                        type="number"
                        value={newItemForm.price}
                        onChange={(e) => setNewItemForm({...newItemForm, price: e.target.value})}
                        className="input-modern w-full"
                        placeholder="e.g., 150"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                      <select
                        value={newItemForm.category}
                        onChange={(e) => setNewItemForm({...newItemForm, category: e.target.value})}
                        className="input-modern w-full"
                      >
                        <option value="Main Course">Main Course</option>
                        <option value="Snacks">Snacks</option>
                        <option value="Beverages">Beverages</option>
                        <option value="Breakfast">Breakfast</option>
                        <option value="Desserts">Desserts</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Preparation Time (minutes)</label>
                      <input
                        type="number"
                        value={newItemForm.preparationTime}
                        onChange={(e) => setNewItemForm({...newItemForm, preparationTime: e.target.value})}
                        className="input-modern w-full"
                        placeholder="e.g., 15"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                      <textarea
                        value={newItemForm.description}
                        onChange={(e) => setNewItemForm({...newItemForm, description: e.target.value})}
                        className="input-modern w-full"
                        rows="3"
                        placeholder="Describe the dish..."
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Ingredients (comma-separated)</label>
                      <input
                        type="text"
                        value={newItemForm.ingredients}
                        onChange={(e) => setNewItemForm({...newItemForm, ingredients: e.target.value})}
                        className="input-modern w-full"
                        placeholder="e.g., Chicken, Onions, Tomatoes, Spices"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Image URL (optional)</label>
                      <input
                        type="url"
                        value={newItemForm.image}
                        onChange={(e) => setNewItemForm({...newItemForm, image: e.target.value})}
                        className="input-modern w-full"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-4 mt-6">
                    <button
                      onClick={handleAddMenuItem}
                      className="btn-primary"
                    >
                      Add Item
                    </button>
                    <button
                      onClick={() => setShowAddItemForm(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Menu Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menu.map(item => (
                  <div key={item._id} className="card-modern card-hover p-6">
                    <div className="aspect-w-16 aspect-h-12 mb-4">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop';
                        }}
                      />
                    </div>
                    
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-white text-lg">{item.name}</h3>
                      <span className="text-green-400 font-bold text-lg">₹{item.price}</span>
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-4">{item.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">Category:</span>
                        <span className="text-blue-400 text-sm font-medium">{item.category}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">Prep Time:</span>
                        <span className="text-yellow-400 text-sm font-medium">{item.preparationTime} min</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">Status:</span>
                        <span className={`status-badge ${
                          item.available ? 'status-approved' : 'status-rejected'
                      }`}>
                        {item.available ? 'Available' : 'Out of Stock'}
                      </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-600/50 space-y-3">
                      <button
                        onClick={() => toggleAvailability(item._id)}
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                          item.available 
                            ? 'bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30' 
                            : 'bg-green-600/20 hover:bg-green-600/30 text-green-300 border border-green-500/30'
                        }`}
                      >
                        {item.available ? 'Mark as Unavailable' : 'Mark as Available'}
                      </button>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => handleUpdateMenuItem(item._id, { price: parseFloat(e.target.value) })}
                          className="input-modern text-sm py-1 px-2"
                          placeholder="Price"
                        />
                        <input
                          type="number"
                          value={item.preparationTime}
                          onChange={(e) => handleUpdateMenuItem(item._id, { preparationTime: parseInt(e.target.value) })}
                          className="input-modern text-sm py-1 px-2"
                          placeholder="Prep time"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {menu.length === 0 && (
                <div className="text-center py-12">
                  <Coffee size={48} className="mx-auto text-gray-500 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Menu Items</h3>
                  <p className="text-gray-400">Menu items will appear here once they are loaded.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Canteen;
