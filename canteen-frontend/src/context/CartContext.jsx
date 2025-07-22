import React, { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Memoized functions for better performance
  const addToCart = useCallback((foodItem) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => (item.food_id || item._id) === (foodItem.food_id || foodItem._id));
      if (existing) {
        return prev.map((item) =>
          (item.food_id || item._id) === (foodItem.food_id || foodItem._id)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...foodItem, quantity: 1 }];
      }
    });
  }, []);

  const updateCartQuantity = useCallback((id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          (item.food_id || item._id) === id
            ? { ...item, quantity }
            : item
        )
      );
    }
  }, []);

  const removeFromCart = useCallback((id) => {
    setCartItems((prev) => prev.filter((item) => (item.food_id || item._id) !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => {
      const price = typeof item.price === 'object' ? 
        parseFloat(item.price.$numberDecimal || 0) : 
        parseFloat(item.price || 0);
      return total + (price * item.quantity);
    }, 0);
  }, [cartItems]);

  const getItemQuantity = useCallback((id) => {
    const item = cartItems.find((item) => (item.food_id || item._id) === id);
    return item ? item.quantity : 0;
  }, [cartItems]);

  // Helper function to check if item exists in cart
  const isInCart = useCallback((id) => {
    return cartItems.some((item) => (item.food_id || item._id) === id);
  }, [cartItems]);

  const value = {
    cartItems, 
    addToCart, 
    updateCartQuantity,
    removeFromCart, 
    clearCart,
    getTotalItems,
    getTotalPrice,
    getItemQuantity,
    isInCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};