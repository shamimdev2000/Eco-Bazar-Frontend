import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { Toaster } from "react-hot-toast";

// Layout elements
import { Topbar } from "./components/layout/Topbar";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";

// Pages
import { Home } from "./pages/Home";
import { Shop } from "./pages/Shop";
import { ProductDetails } from "./pages/ProductDetails";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { Login } from "./pages/Login";
import { Account } from "./pages/Account";
import { Wishlist } from "./pages/Wishlist";
import { Compare } from "./pages/Compare";
import { TrackOrder } from "./pages/TrackOrder";
import { Blog } from "./pages/Blog";
import { Contact } from "./pages/Contact";

// Helper: Force window scroll to top on page navigations
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollToTop />
        
        {/* Main Flex Container for Sticky Footer Layout */}
        <div className="flex flex-col min-h-screen bg-gray-50/20 antialiased font-sans">
          
          <Topbar />
          <Navbar />

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/account/*" element={<Account />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/track" element={<TrackOrder />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Fallback to index */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>

          <Footer />

          {/* Toast notifications portal */}
          <Toaster 
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#0c3325", // brand-900 organic pine green
                color: "#f4fcf6",      // brand-50 soft organic white
                fontSize: "11px",
                fontWeight: "600",
                borderRadius: "12px",
                border: "1px solid #1c4b3a",
                padding: "10px 16px",
              },
              success: {
                iconTheme: {
                  primary: "#60d394", // accent-400 vivid organic mint
                  secondary: "#0c3325",
                },
              },
            }}
          />

        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
