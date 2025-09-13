import React, { createContext, useContext, useState, useEffect } from 'react';

const MenuContext = createContext();

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};

export const MenuProvider = ({ children }) => {
  const [menu, setMenu] = useState([]);

  // Initialize with sample menu data including images
  useEffect(() => {
    const sampleMenu = [
      {
        _id: '1',
        name: 'Chicken Biryani',
        description: 'Aromatic basmati rice with tender chicken pieces and traditional spices',
        price: 120,
        category: 'Main Course',
        available: true,
        image: 'https://images.unsplash.com/photo-1563379091339-03246963d96a?w=400&h=300&fit=crop',
        preparationTime: 15,
        ingredients: ['Basmati Rice', 'Chicken', 'Spices', 'Yogurt', 'Onions']
      },
      {
        _id: '2',
        name: 'Veg Thali',
        description: 'Complete vegetarian meal with dal, sabzi, roti, rice, and pickle',
        price: 80,
        category: 'Main Course',
        available: true,
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
        preparationTime: 10,
        ingredients: ['Dal', 'Vegetables', 'Roti', 'Rice', 'Pickle']
      },
      {
        _id: '3',
        name: 'Masala Dosa',
        description: 'Crispy South Indian crepe filled with spiced potato filling',
        price: 60,
        category: 'Breakfast',
        available: true,
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
        preparationTime: 12,
        ingredients: ['Rice Batter', 'Potatoes', 'Spices', 'Curry Leaves']
      },
      {
        _id: '4',
        name: 'Paneer Butter Masala',
        description: 'Rich and creamy paneer curry with butter and aromatic spices',
        price: 100,
        category: 'Main Course',
        available: true,
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
        preparationTime: 18,
        ingredients: ['Paneer', 'Tomatoes', 'Cream', 'Butter', 'Spices']
      },
      {
        _id: '5',
        name: 'Cold Coffee',
        description: 'Refreshing iced coffee with milk and sugar',
        price: 40,
        category: 'Beverages',
        available: true,
        image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop',
        preparationTime: 5,
        ingredients: ['Coffee', 'Milk', 'Sugar', 'Ice']
      },
      {
        _id: '6',
        name: 'Samosa Chat',
        description: 'Crispy samosas topped with chutneys, yogurt, and spices',
        price: 50,
        category: 'Snacks',
        available: true,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
        preparationTime: 8,
        ingredients: ['Samosa', 'Chutneys', 'Yogurt', 'Onions', 'Spices']
      },
      {
        _id: '7',
        name: 'Rajma Rice',
        description: 'Kidney beans curry served with steamed basmati rice',
        price: 70,
        category: 'Main Course',
        available: true,
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
        preparationTime: 12,
        ingredients: ['Rajma', 'Rice', 'Onions', 'Tomatoes', 'Spices']
      },
      {
        _id: '8',
        name: 'Mango Lassi',
        description: 'Sweet and creamy mango yogurt drink',
        price: 35,
        category: 'Beverages',
        available: true,
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
        preparationTime: 3,
        ingredients: ['Mango', 'Yogurt', 'Sugar', 'Cardamom']
      },
      {
        _id: '9',
        name: 'Chole Bhature',
        description: 'Spicy chickpea curry with fluffy deep-fried bread',
        price: 90,
        category: 'Main Course',
        available: true,
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
        preparationTime: 15,
        ingredients: ['Chickpeas', 'Flour', 'Spices', 'Oil', 'Onions']
      },
      {
        _id: '10',
        name: 'Gulab Jamun',
        description: 'Sweet milk dumplings soaked in sugar syrup',
        price: 30,
        category: 'Desserts',
        available: true,
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
        preparationTime: 5,
        ingredients: ['Milk Powder', 'Sugar', 'Cardamom', 'Rose Water']
      }
    ];
    setMenu(sampleMenu);
  }, []);

  const addMenuItem = (itemData) => {
    const newItem = {
      _id: `item_${Date.now()}`,
      ...itemData,
      available: true,
    };
    setMenu(prev => [...prev, newItem]);
    return newItem;
  };

  const updateMenuItem = (itemId, updates) => {
    setMenu(prev => prev.map(item => 
      item._id === itemId 
        ? { ...item, ...updates }
        : item
    ));
  };

  const toggleAvailability = (itemId) => {
    setMenu(prev => prev.map(item => 
      item._id === itemId 
        ? { ...item, available: !item.available }
        : item
    ));
  };

  const deleteMenuItem = (itemId) => {
    setMenu(prev => prev.filter(item => item._id !== itemId));
  };

  const getCategories = () => {
    const categories = [...new Set(menu.map(item => item.category))];
    return categories.sort();
  };

  const getMenuByCategory = (category) => {
    if (category === 'All') return menu;
    return menu.filter(item => item.category === category);
  };

  const getAvailableMenu = () => {
    return menu.filter(item => item.available);
  };

  const value = {
    menu,
    addMenuItem,
    updateMenuItem,
    toggleAvailability,
    deleteMenuItem,
    getCategories,
    getMenuByCategory,
    getAvailableMenu,
  };

  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  );
};
