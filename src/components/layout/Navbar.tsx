import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { 
  Search, 
  Heart, 
  ShoppingCart, 
  GitCompare, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  Trash2, 
  LogOut, 
  Grid,
  MapPin,
  Leaf
} from "lucide-react";
import * as Icons from "lucide-react";

export const Navbar: React.FC = () => {
  const { 
    user, 
    logout, 
    cart, 
    cartSubtotal, 
    cartCount, 
    wishlist, 
    compareList, 
    categories,
    removeFromCart,
    updateCartQuantity
  } = useApp();

  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [showCategories, setShowCategories] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleCategoryClick = (catId: string) => {
    navigate(`/shop?category=${catId}`);
    setShowCategories(false);
  };

  const renderIcon = (iconName: string, className = "w-4 h-4") => {
    const IconComp = (Icons as any)[iconName] || Leaf;
    return <IconComp className={className} />;
  };

  return (
    <>
      {/* Header Container */}
      <header id="main-header" className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100 transition-all duration-300">
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <Link id="header-logo" to="/" className="flex items-center space-x-2 shrink-0 group">
              <Leaf className="w-8 h-8 text-brand-500 fill-brand-500/10 group-hover:scale-110 transition-standard" />
              <span className="text-2xl font-bold font-display tracking-tight text-[#1A1A1A] block leading-none">
                Ecobazar
              </span>
            </Link>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xl mx-12 items-center relative w-full">
              <div className="relative w-full flex items-center">
                <div className="absolute left-3.5 text-gray-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border border-gray-200 border-r-0 rounded-l-md py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all placeholder-gray-400"
                />
                <button type="submit" className="bg-brand-500 text-white hover:bg-brand-600 px-6 py-[11px] text-sm font-semibold rounded-r-md transition-standard border border-brand-500 cursor-pointer">
                  Search
                </button>
              </div>
            </form>

            {/* Action Group */}
            <div className="flex items-center space-x-1 sm:space-x-4">
              
              {/* Wishlist Button */}
              <Link to="/wishlist" className="relative p-2.5 text-gray-800 hover:text-brand-500 hover:bg-brand-50 rounded-full transition-standard" title="Wishlist">
                <Heart className="w-6 h-6" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold font-mono">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Divider */}
              <div className="h-6 w-[1px] bg-gray-200 hidden sm:block" />

              {/* Cart Drawer Button */}
              <button 
                onClick={() => setShowCartDrawer(true)} 
                className="relative p-2.5 text-gray-800 hover:text-brand-500 hover:bg-brand-50 rounded-full transition-standard flex items-center space-x-3 text-left" 
                title="Shopping Cart"
              >
                <div className="relative">
                  <ShoppingCart className="w-6 h-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-brand-600 text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold font-mono">
                      {cartCount}
                    </span>
                  )}
                </div>
                <div className="hidden xl:flex flex-col text-left leading-tight">
                  <span className="text-[10px] text-gray-400">Shopping cart:</span>
                  <span className="text-xs font-bold text-gray-800">${cartSubtotal.toFixed(2)}</span>
                </div>
              </button>

              {/* Account Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                  className="flex items-center space-x-1 p-2.5 text-gray-600 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-standard"
                >
                  <User className="w-5.5 h-5.5" />
                </button>
                {showAccountDropdown && (
                  <div className="absolute right-0 mt-2.5 w-52 bg-white rounded-xl shadow-lg py-2 border border-gray-100 z-50 text-sm">
                    {user ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-50">
                          <p className="font-semibold text-gray-800 text-xs truncate">{user.fullName}</p>
                          <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                        </div>
                        <Link to="/account" onClick={() => setShowAccountDropdown(false)} className="block px-4 py-2 text-gray-600 hover:bg-brand-50 hover:text-brand-700 transition-standard">
                          My Dashboard
                        </Link>
                        <Link to="/account/orders" onClick={() => setShowAccountDropdown(false)} className="block px-4 py-2 text-gray-600 hover:bg-brand-50 hover:text-brand-700 transition-standard">
                          My Orders
                        </Link>
                        <Link to="/account/addresses" onClick={() => setShowAccountDropdown(false)} className="block px-4 py-2 text-gray-600 hover:bg-brand-50 hover:text-brand-700 transition-standard">
                          My Addresses
                        </Link>
                        <button 
                          onClick={() => { setShowAccountDropdown(false); logout(); }}
                          className="w-full text-left flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-standard border-t border-gray-50 mt-1"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" onClick={() => setShowAccountDropdown(false)} className="block px-4 py-2 text-gray-600 hover:bg-brand-50 hover:text-brand-700 transition-standard">
                          Login
                        </Link>
                        <Link to="/register" onClick={() => setShowAccountDropdown(false)} className="block px-4 py-2 text-gray-600 hover:bg-brand-50 hover:text-brand-700 transition-standard">
                          Register Account
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile menu hamburger */}
              <button 
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2.5 text-gray-600 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-standard"
              >
                {showMobileMenu ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
              </button>

            </div>
          </div>
        </div>

        {/* Sub-Header: Categories & Navigation links */}
        <div className="border-b border-gray-100 hidden lg:block bg-white py-3">
          <div className="container-custom flex justify-between items-center h-10">
            
            {/* Category Dropdown Toggle & Nav Links */}
            <div className="flex items-center space-x-10">
              
              <div className="relative">
                <button 
                  onClick={() => setShowCategories(!showCategories)}
                  className="bg-brand-200 text-brand-600 px-4 py-2 flex items-center space-x-2 font-display font-semibold text-sm rounded-lg hover:bg-brand-300 transition-standard cursor-pointer"
                >
                  <Grid className="w-4 h-4" />
                  <span>Browse Categories</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showCategories ? "rotate-180" : ""}`} />
                </button>

                {showCategories && (
                  <div className="absolute left-0 w-64 bg-white shadow-xl border border-gray-100 rounded-b-xl py-3 z-50 mt-1">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.id)}
                        className="w-full text-left flex items-center justify-between px-5 py-2.5 hover:bg-brand-50 text-gray-600 hover:text-brand-700 text-sm transition-standard"
                      >
                        <div className="flex items-center space-x-3">
                          {renderIcon(cat.icon, "w-4 h-4 text-brand-600")}
                          <span>{cat.name}</span>
                        </div>
                        <span className="text-xs bg-gray-150 text-gray-400 py-0.5 px-2 rounded-full font-mono font-bold">
                          {cat.count}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Main Navigation links integrated here */}
              <nav className="flex items-center space-x-8 text-sm font-medium text-gray-600">
                <Link to="/" className={`hover:text-brand-600 transition-standard py-1 ${location.pathname === "/" ? "text-brand-600 border-b-2 border-brand-600 font-bold" : ""}`}>
                  Home
                </Link>
                <Link to="/shop" className={`hover:text-brand-600 transition-standard py-1 ${location.pathname === "/shop" ? "text-brand-600 border-b-2 border-brand-600 font-bold" : ""}`}>
                  Shop
                </Link>
                <Link to="/blog" className={`hover:text-brand-600 transition-standard py-1 ${location.pathname === "/blog" ? "text-brand-600 border-b-2 border-brand-600 font-bold" : ""}`}>
                  Blog
                </Link>
                <Link to="/contact" className={`hover:text-brand-600 transition-standard py-1 ${location.pathname === "/contact" ? "text-brand-600 border-b-2 border-brand-600 font-bold" : ""}`}>
                  Contact
                </Link>
              </nav>

            </div>

            {/* Hotline number matching the Design HTML */}
            <div className="flex items-center space-x-2 text-brand-500 font-bold text-sm">
              <Icons.PhoneCall className="w-4 h-4 text-brand-500" />
              <span>+1 (800) 444-5555</span>
            </div>

          </div>
        </div>
      </header>

      {/* Slide-out Mobile Navigation Sidebar */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden transition-opacity duration-300">
          <div className="absolute top-0 right-0 w-72 h-full bg-white shadow-2xl flex flex-col p-6 z-50">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <span className="font-bold text-gray-800">Menu Navigation</span>
              <button onClick={() => setShowMobileMenu(false)} className="p-1.5 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="relative mb-6">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-200 text-sm"
              />
              <button type="submit" className="absolute right-3 top-2 text-gray-400">
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Navigation links */}
            <nav className="flex flex-col space-y-4 text-sm font-medium text-gray-600 mb-8">
              <Link to="/" onClick={() => setShowMobileMenu(false)} className="hover:text-brand-600 py-1.5">Home</Link>
              <Link to="/shop" onClick={() => setShowMobileMenu(false)} className="hover:text-brand-600 py-1.5">Shop All Products</Link>
              <Link to="/about" onClick={() => setShowMobileMenu(false)} className="hover:text-brand-600 py-1.5">About Us</Link>
              <Link to="/blog" onClick={() => setShowMobileMenu(false)} className="hover:text-brand-600 py-1.5">Fresh Blogs</Link>
              <Link to="/faq" onClick={() => setShowMobileMenu(false)} className="hover:text-brand-600 py-1.5">Help Center & FAQ</Link>
              <Link to="/contact" onClick={() => setShowMobileMenu(false)} className="hover:text-brand-600 py-1.5">Get in Touch</Link>
            </nav>

            {/* Mobile Category Sidebar Header */}
            <div className="font-bold text-xs uppercase text-gray-400 tracking-wider mb-3">Categories</div>
            <div className="flex flex-col space-y-2 max-h-48 overflow-y-auto mb-6 pr-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { handleCategoryClick(cat.id); setShowMobileMenu(false); }}
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-brand-600 py-1"
                >
                  {renderIcon(cat.icon, "w-4 h-4 text-brand-600")}
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            {user ? (
              <div className="border-t border-gray-100 pt-4 mt-auto">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                    {user.fullName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{user.fullName}</p>
                    <p className="text-[10px] text-gray-400">{user.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setShowMobileMenu(false); logout(); }}
                  className="w-full bg-red-50 text-red-600 py-2 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="border-t border-gray-100 pt-4 mt-auto flex space-x-3">
                <Link to="/login" onClick={() => setShowMobileMenu(false)} className="flex-1 bg-gray-100 text-gray-700 text-center py-2 rounded-lg text-xs font-semibold">
                  Login
                </Link>
                <Link to="/register" onClick={() => setShowMobileMenu(false)} className="flex-1 bg-brand-600 text-white text-center py-2 rounded-lg text-xs font-semibold">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Slide-out Cart Drawer Overlay */}
      {showCartDrawer && (
        <div className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300">
          <div className="absolute top-0 right-0 w-full max-w-md h-full bg-white shadow-2xl flex flex-col z-50">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-brand-900 text-white">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-brand-500" />
                <span className="font-display font-bold text-lg">My Shopping Cart ({cartCount})</span>
              </div>
              <button 
                onClick={() => setShowCartDrawer(false)} 
                className="p-1 rounded-full hover:bg-brand-800 text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body - Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center text-brand-500">
                    <ShoppingCart className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-gray-800">Your cart is empty</h3>
                    <p className="text-sm text-gray-400 mt-1">Add organic products to start your healthy delivery!</p>
                  </div>
                  <button 
                    onClick={() => { setShowCartDrawer(false); navigate("/shop"); }}
                    className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-standard shadow-sm"
                  >
                    Shop Our Products
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex items-center space-x-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-lg object-cover shrink-0 border border-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-800 truncate hover:text-brand-600 transition-standard">
                        <Link to={`/product/${item.product.id}`} onClick={() => setShowCartDrawer(false)}>
                          {item.product.name}
                        </Link>
                      </h4>
                      <p className="text-xs text-gray-400 font-mono">{item.product.unit}</p>
                      
                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-gray-200 rounded-full py-0.5 px-1.5 scale-90 -ml-2 bg-white">
                          <button 
                            disabled={item.quantity <= 1}
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-brand-600 disabled:opacity-30"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-xs font-semibold text-gray-700">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-brand-600"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm font-bold text-brand-700 font-mono">${(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-standard shrink-0"
                      title="Remove product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer - Totals & Action */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-4">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-mono">${cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Shipping Fee</span>
                    <span className="text-brand-600 font-semibold">FREE (Pasture Saver)</span>
                  </div>
                  <div className="border-t border-gray-200 my-2 pt-2 flex justify-between text-base font-bold text-gray-900">
                    <span>Grand Total</span>
                    <span className="text-brand-700 font-mono">${cartSubtotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button 
                    onClick={() => { setShowCartDrawer(false); navigate("/cart"); }}
                    className="flex-1 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold py-3 rounded-xl text-center transition-standard"
                  >
                    View Cart Details
                  </button>
                  <button 
                    onClick={() => { setShowCartDrawer(false); navigate("/checkout"); }}
                    className="flex-1 bg-brand-600 text-white hover:bg-brand-700 text-xs font-bold py-3 rounded-xl text-center shadow-md shadow-brand-100 transition-standard"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
