import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [allOrders, setAllOrders] = useState([]);
  const [orderIdCounter, setOrderIdCounter] = useState(1000);

  // Initialize with sample orders
  useEffect(() => {
    const currentDate = new Date();
    const sampleOrders = [
      {
        _id: 'order_001',
        items: [
          { itemId: '1', name: 'Chicken Biryani', quantity: 1, price: 120 },
          { itemId: '5', name: 'Cold Coffee', quantity: 1, price: 40 }
        ],
        total: 160,
        paymentMethod: 'wallet',
        customerName: 'Arjun Sharma',
        studentId: 'CS2021001',
        customerRole: 'student',
        status: 'pending',
        orderTime: new Date(currentDate.getTime() - 5 * 60 * 1000).toISOString(),
        estimatedTime: 15,
        customerPhone: '+91 9876543210',
        specialInstructions: 'Less spicy please'
      },
      {
        _id: 'order_002',
        items: [
          { itemId: '2', name: 'Veg Thali', quantity: 2, price: 80 },
          { itemId: '8', name: 'Mango Lassi', quantity: 2, price: 35 }
        ],
        total: 230,
        paymentMethod: 'upi',
        customerName: 'Priya Patel',
        studentId: 'CS2021002',
        customerRole: 'student',
        status: 'preparing',
        orderTime: new Date(currentDate.getTime() - 12 * 60 * 1000).toISOString(),
        estimatedTime: 10,
        customerPhone: '+91 9876543211',
        specialInstructions: 'Extra pickle'
      },
      {
        _id: 'order_003',
        items: [
          { itemId: '4', name: 'Paneer Butter Masala', quantity: 1, price: 100 },
          { itemId: '7', name: 'Rajma Rice', quantity: 1, price: 70 },
          { itemId: '10', name: 'Gulab Jamun', quantity: 2, price: 30 }
        ],
        total: 230,
        paymentMethod: 'cash',
        customerName: 'Dr. Rajesh Kumar',
        studentId: 'FAC001',
        customerRole: 'faculty',
        status: 'ready',
        orderTime: new Date(currentDate.getTime() - 18 * 60 * 1000).toISOString(),
        estimatedTime: 20,
        customerPhone: '+91 9876543212',
        specialInstructions: 'Pack separately'
      },
      {
        _id: 'order_004',
        items: [
          { itemId: '6', name: 'Samosa Chat', quantity: 4, price: 50 },
          { itemId: '5', name: 'Cold Coffee', quantity: 3, price: 40 }
        ],
        total: 320,
        paymentMethod: 'wallet',
        customerName: 'Sneha Reddy',
        studentId: 'CS2021003',
        customerRole: 'student',
        status: 'pending',
        orderTime: new Date(currentDate.getTime() - 3 * 60 * 1000).toISOString(),
        estimatedTime: 8,
        customerPhone: '+91 9876543213',
        specialInstructions: 'Extra chutneys'
      },
      {
        _id: 'order_005',
        items: [
          { itemId: '9', name: 'Chole Bhature', quantity: 2, price: 90 },
          { itemId: '8', name: 'Mango Lassi', quantity: 2, price: 35 }
        ],
        total: 250,
        paymentMethod: 'upi',
        customerName: 'Vikram Singh',
        studentId: 'CS2021004',
        customerRole: 'student',
        status: 'preparing',
        orderTime: new Date(currentDate.getTime() - 8 * 60 * 1000).toISOString(),
        estimatedTime: 15,
        customerPhone: '+91 9876543214',
        specialInstructions: 'Medium spice level'
      },
      {
        _id: 'order_006',
        items: [
          { itemId: '1', name: 'Chicken Biryani', quantity: 2, price: 120 },
          { itemId: '4', name: 'Paneer Butter Masala', quantity: 1, price: 100 }
        ],
        total: 340,
        paymentMethod: 'cash',
        customerName: 'Prof. Meera Joshi',
        studentId: 'FAC002',
        customerRole: 'faculty',
        status: 'completed',
        orderTime: new Date(currentDate.getTime() - 45 * 60 * 1000).toISOString(),
        estimatedTime: 25,
        customerPhone: '+91 9876543216',
        specialInstructions: 'Faculty order - priority'
      },
      {
        _id: 'order_007',
        items: [
          { itemId: '2', name: 'Veg Thali', quantity: 1, price: 80 },
          { itemId: '6', name: 'Samosa Chat', quantity: 2, price: 50 },
          { itemId: '8', name: 'Mango Lassi', quantity: 1, price: 35 }
        ],
        total: 215,
        paymentMethod: 'upi',
        customerName: 'Rahul Gupta',
        studentId: 'CS2021006',
        customerRole: 'student',
        status: 'ready',
        orderTime: new Date(currentDate.getTime() - 20 * 60 * 1000).toISOString(),
        estimatedTime: 15,
        customerPhone: '+91 9876543217',
        specialInstructions: 'No onions in thali'
      },
      {
        _id: 'order_008',
        items: [
          { itemId: '7', name: 'Rajma Rice', quantity: 2, price: 70 },
          { itemId: '10', name: 'Gulab Jamun', quantity: 4, price: 30 }
        ],
        total: 260,
        paymentMethod: 'wallet',
        customerName: 'Kavya Nair',
        studentId: 'CS2021007',
        customerRole: 'student',
        status: 'preparing',
        orderTime: new Date(currentDate.getTime() - 10 * 60 * 1000).toISOString(),
        estimatedTime: 12,
        customerPhone: '+91 9876543218',
        specialInstructions: 'Warm gulab jamun'
      },
      {
        _id: 'order_009',
        items: [
          { itemId: '3', name: 'Masala Dosa', quantity: 1, price: 60 },
          { itemId: '9', name: 'Chole Bhature', quantity: 1, price: 90 },
          { itemId: '5', name: 'Cold Coffee', quantity: 2, price: 40 }
        ],
        total: 230,
        paymentMethod: 'cash',
        customerName: 'Amit Verma',
        studentId: 'CS2021008',
        customerRole: 'student',
        status: 'pending',
        orderTime: new Date(currentDate.getTime() - 1 * 60 * 1000).toISOString(),
        estimatedTime: 18,
        customerPhone: '+91 9876543219',
        specialInstructions: 'Fresh order - just placed'
      },
      {
        _id: 'order_010',
        items: [
          { itemId: '1', name: 'Chicken Biryani', quantity: 3, price: 120 },
          { itemId: '8', name: 'Mango Lassi', quantity: 3, price: 35 }
        ],
        total: 465,
        paymentMethod: 'upi',
        customerName: 'Deepak Yadav',
        studentId: 'CS2021009',
        customerRole: 'student',
        status: 'completed',
        orderTime: new Date(currentDate.getTime() - 90 * 60 * 1000).toISOString(),
        estimatedTime: 20,
        customerPhone: '+91 9876543220',
        specialInstructions: 'Large order for group'
      },
      {
        _id: 'order_011',
        items: [
          { itemId: '2', name: 'Veg Thali', quantity: 1, price: 80 },
          { itemId: '4', name: 'Paneer Butter Masala', quantity: 1, price: 100 }
        ],
        total: 180,
        paymentMethod: 'wallet',
        customerName: 'Ritu Sharma',
        studentId: 'CS2021010',
        customerRole: 'student',
        status: 'ready',
        orderTime: new Date(currentDate.getTime() - 25 * 60 * 1000).toISOString(),
        estimatedTime: 15,
        customerPhone: '+91 9876543221',
        specialInstructions: 'Vegetarian combo'
      },
      {
        _id: 'order_012',
        items: [
          { itemId: '1', name: 'Chicken Biryani', quantity: 2, price: 120 },
          { itemId: '5', name: 'Cold Coffee', quantity: 2, price: 40 }
        ],
        total: 320,
        paymentMethod: 'cash',
        customerName: 'Admin User',
        studentId: 'ADM001',
        customerRole: 'admin',
        status: 'pending',
        orderTime: new Date(currentDate.getTime() - 2 * 60 * 1000).toISOString(),
        estimatedTime: 15,
        customerPhone: '+91 9876543222',
        specialInstructions: 'Admin order - priority'
      }
    ];
    setAllOrders(sampleOrders);
    setOrderIdCounter(1013);
  }, []);

  const createOrder = (orderData) => {
    const newOrder = {
      _id: `order_${orderIdCounter}`,
      ...orderData,
      orderTime: new Date().toISOString(),
      estimatedTime: Math.floor(Math.random() * 20) + 10,
    };
    
    setAllOrders(prev => [newOrder, ...prev]);
    setOrderIdCounter(prev => prev + 1);
    
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setAllOrders(prev => prev.map(order => 
      order._id === orderId 
        ? { ...order, status: newStatus }
        : order
    ));
  };

  const getOrdersByUser = (userId, userRole) => {
    return allOrders.filter(order => 
      order.studentId === userId || 
      (userRole === 'canteen_staff' && order.status !== 'completed')
    );
  };

  const getAllOrders = () => allOrders;

  const getOrdersByStatus = (status) => {
    return allOrders.filter(order => order.status === status);
  };

  const value = {
    allOrders,
    createOrder,
    updateOrderStatus,
    getOrdersByUser,
    getAllOrders,
    getOrdersByStatus,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};
