import React, { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";
import { AppContext } from "./AppContext";

const url = import.meta.env.VITE_API_URL;
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AppContext);
  const [cart, setCart] = useState([]);
  const userId = user?._id || user?.id;

  // Fetch cart from backend
  const fetchCart = async () => {
    if (!userId) return;
  
    try {
      const res = await axios.get(`${url}/cart/${userId}`);
      if (res.data.success) setCart(res.data.cartItems);
      else setCart([]);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };
  

  useEffect(() => {
    if (user?._id) fetchCart();
  }, [user]);

  const addToCart = async (food, quantity = 1) => {
    if (!food?._id || !userId) {
      console.log("Blocked addToCart", { food, user });
      return;
    }
    
  
    try {
      console.log("ADD TO CART CLICKED", {
        userId: user._id,
        foodId: food._id,
      });
  
      await axios.post(`${url}/cart`, {
        user: userId,
        food: food._id,
        quantity,
      });
  
      await fetchCart();
    } catch (err) {
      console.error("Error adding to cart:", err.response?.data || err);
    }
  };
  
  

  const removeFromCart = async (foodId) => {
    try {
      // Find the item in the current cart
      const item = cart.find(
        (c) => (typeof c.food === "string" ? c.food : c.food._id) === foodId
      );
  
      if (!item) return;
  
      if (item.quantity > 1) {
        // Decrease quantity by 1
        await axios.put(`${url}/cart`, {
          user: userId,
          food: foodId,
          quantity: item.quantity - 1,
        });
      } else {
        // Remove the item completely
        await axios.delete(`${url}/cart`, {
          data: { user: userId, food: foodId },
        });
      }
  
      // Refresh local cart state
      await fetchCart();
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };
  

  const getCart = async (userId) => {
    try {
      const res = await axios.get(`${url}/cart/${userId}`);
      console.log(res)

      if (res.data.success) {
        setCart(res.data.cartItems);
      } else {
        setCart([]);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, getCart , fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
