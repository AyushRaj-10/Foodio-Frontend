import React, { useState, useEffect, useCallback, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  User,
  Menu as MenuIcon,
  X,
  ChefHat,
  Bell,
  Heart,
  MapPin,
} from "lucide-react";
import GlassCard from "./GlassCard";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import FoodioMap from "./FoodMap";

const Navbar = () => {
  const { user, logout } = useContext(AppContext);
  const navigate = useNavigate();

  // States
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(3);
  const [notificationCount, setNotificationCount] = useState(2);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Scroll handler
  const handleScroll = useCallback(() => {
    const scrolled = window.scrollY > 20;
    if (scrolled !== isScrolled) setIsScrolled(scrolled);
  }, [isScrolled]);

  useEffect(() => {
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", throttledScroll);
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [handleScroll]);

  // Click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest(".mobile-menu-container")) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobileMenuOpen]);

  // FINAL CLEAN NAV ITEMS
  const navItems = [
    { label: "Home", onClick: () => navigate("/") },
    { label: "Menu", onClick: () => navigate("/menu") },
    { label: "Offers", onClick: () => navigate("/offer"), badge: "New" },
    { label: "Track Order", onClick: () => setIsMapOpen(true) },
  ];

  // Animations
  const mobileMenuVariants = {
    closed: { opacity: 0, height: 0 },
    open: { opacity: 1, height: "auto" },
  };

  const searchVariants = {
    closed: { width: 0, opacity: 0 },
    open: { width: "300px", opacity: 1 },
  };

  return (
    <>
      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 ${
          isScrolled ? "py-2" : "py-4"
        } transition-all`}
      >
        <div className="mx-auto max-w-7xl px-4">
          <GlassCard
            className={`px-6 py-4 transition-all ${
              isScrolled
                ? "bg-white/25 backdrop-blur-3xl shadow-3xl"
                : "bg-white/10"
            }`}
            hover={false}
          >
            <div className="flex justify-between items-center">

              {/* Logo */}
              <motion.div
                className="flex items-center gap-3 cursor-pointer group"
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate("/")}
              >
                <div className="relative">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 flex items-center justify-center shadow-lg">
                    <img src="/LogoFoodio.png" alt="Foodio Logo" />
                  </div>
                </div>
                <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600">
                  Foodio
                </span>
              </motion.div>

             


              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-8">
                {navItems.map((item, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="relative text-gray-800 hover:text-red-600 transition"
                    onClick={item.onClick}
                  >
                    {item.label}
                    {item.badge && (
                      <span className="absolute -top-2 -right-6 text-xs bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">

                {/* Search */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setIsSearchOpen(true)}
                  className="hidden md:flex p-3 rounded-2xl hover:bg-white/20"
                >
                  <Search className="h-5 w-5" />
                </motion.button>

                {/* Cart */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate("/cart")}
                  className="p-3 rounded-2xl hover:bg-white/20"
                >
                  <ShoppingCart className="h-5 w-5" />
                </motion.button>

                {/* Auth */}
                {!user ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="hidden md:block px-6 py-2 text-gray-800 hover:text-red-600"
                      onClick={() => navigate("/login")}
                    >
                      Login
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white font-bold"
                      onClick={() => navigate("/register")}
                    >
                      Sign Up
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="px-6 py-3 rounded-2xl bg-red-500 text-white font-bold"
                    onClick={async () => {
                      await logout();
                      navigate("/login");
                    }}
                  >
                    Logout
                  </motion.button>
                )}

                {/* Mobile Menu Toggle */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 rounded-xl hover:bg-white/20 mobile-menu-container"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <MenuIcon className="h-6 w-6" />
                  )}
                </motion.button>
              </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={mobileMenuVariants}
                  className="lg:hidden overflow-hidden mobile-menu-container"
                >
                  <div className="mt-4 py-4">

                    {navItems.map((item, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ x: 5 }}
                        className="w-full text-left py-3 px-4 rounded-xl hover:bg-white/10 text-gray-800"
                        onClick={() => {
                          item.onClick();
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        {item.label}
                      </motion.button>
                    ))}

                    {/* ADDITIONAL MOBILE LINKS */}
                    <div className="mt-4 pt-4 border-t border-white/20 space-y-3">

                      <button
                        className="flex items-center gap-3 py-3 px-4 w-full text-gray-800 hover:text-red-600 hover:bg-white/10 rounded-xl"
                        onClick={() => {
                          navigate("/profile");
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <User className="h-5 w-5" />
                        My Account
                      </button>

                      <button
                        className="flex items-center gap-3 py-3 px-4 w-full text-gray-800 hover:text-red-600 hover:bg-white/10 rounded-xl"
                        onClick={() => {
                          setIsMapOpen(true);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <MapPin className="h-5 w-5" />
                        Track Order (Map)
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        </div>
      </motion.nav>

      {/* MAP MODAL */}
      <AnimatePresence>
        {isMapOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setIsMapOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl p-4 w-[90%] max-w-3xl h-[70%]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-2xl font-bold text-gray-800">Track Your Order</h2>
                <button
                  onClick={() => setIsMapOpen(false)}
                  className="p-2 rounded-xl hover:bg-white/20"
                >
                  <X className="h-6 w-6 text-gray-700" />
                </button>
              </div>

              <div className="w-full h-full rounded-2xl overflow-hidden">
                <FoodioMap />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEARCH OVERLAY */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsSearchOpen(false)}
          >
            <div className="flex items-start justify-center pt-32">
              <motion.div
                variants={searchVariants}
                initial="closed"
                animate="open"
                exit="closed"
                onClick={(e) => e.stopPropagation()}
              >
                <GlassCard className="p-2" hover={false}>
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="Search restaurants, dishes, cuisines..."
                      className="flex-1 px-6 py-4 bg-transparent text-gray-800 placeholder-gray-500 text-lg focus:outline-none"
                      autoFocus
                    />
                    <button className="px-6 py-4 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold">
                      <Search className="h-5 w-5" />
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
