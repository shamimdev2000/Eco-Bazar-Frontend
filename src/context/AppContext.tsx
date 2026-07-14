import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, Category, CartItem, Order, User, Address } from "../types";
import { authApi, cartApi, wishlistApi, categoriesApi, ordersApi } from "../services/api";
import { toast } from "react-hot-toast";

interface AppContextType {
  // Auth
  user: User | null;
  token: string | null;
  login: (credentials: any) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  addAddress: (addr: Omit<Address, "id" | "isDefault">) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;

  // Categories
  categories: Category[];
  loadingCategories: boolean;

  // Cart
  cart: CartItem[];
  loadingCart: boolean;
  addToCart: (productId: string, quantity?: number, silent?: boolean) => Promise<void>;
  updateCartQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  cartSubtotal: number;
  cartCount: number;

  // Wishlist
  wishlist: Product[];
  loadingWishlist: boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;

  // Compare
  compareList: Product[];
  toggleCompare: (product: Product) => void;
  isInCompare: (productId: string) => boolean;

  // Orders
  orders: Order[];
  loadingOrders: boolean;
  fetchOrders: () => Promise<void>;
  createOrder: (orderData: any) => Promise<Order | null>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("org_grocery_token"));

  // Domain States
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loadingCart, setLoadingCart] = useState(false);

  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  const [compareList, setCompareList] = useState<Product[]>([]);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Load Initial Metadata on Mount
  useEffect(() => {
    const initApp = async () => {
      setLoadingCategories(true);
      try {
        const cats = await categoriesApi.getAll();
        setCategories(cats);
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setLoadingCategories(false);
      }

      // If token exists, load user profile, cart, and wishlist
      if (token) {
        try {
          const profile = await authApi.getProfile();
          setUser(profile);
          
          setLoadingCart(true);
          const activeCart = await cartApi.get();
          setCart(activeCart);
          
          setLoadingWishlist(true);
          const activeWishlist = await wishlistApi.get();
          setWishlist(activeWishlist);
          
          await fetchOrders();
        } catch (err) {
          console.error("Token expired or invalid:", err);
          logout();
        } finally {
          setLoadingCart(false);
          setLoadingWishlist(false);
        }
      } else {
        // Guest mode can load some empty defaults or anonymous cart in real production,
        // here we synchronize empty defaults on fresh mount
        setCart([]);
        setWishlist([]);
      }
    };

    initApp();
  }, [token]);

  // Auth Operations
  const login = async (credentials: any) => {
    try {
      const res = await authApi.login(credentials);
      localStorage.setItem("org_grocery_token", res.token);
      setToken(res.token);
      setUser(res.user);
      toast.success(`Welcome back, ${res.user.fullName}!`);
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.error || "Invalid credentials";
      toast.error(msg);
      return false;
    }
  };

  const register = async (userData: any) => {
    try {
      const res = await authApi.register(userData);
      localStorage.setItem("org_grocery_token", res.token);
      setToken(res.token);
      setUser(res.user);
      toast.success("Account created successfully!");
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.error || "Registration failed";
      toast.error(msg);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("org_grocery_token");
    setToken(null);
    setUser(null);
    setCart([]);
    setWishlist([]);
    setOrders([]);
    toast.success("Logged out successfully");
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const updated = await authApi.updateProfile(data);
      setUser(updated);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  const addAddress = async (addr: Omit<Address, "id" | "isDefault">) => {
    try {
      const updatedAddresses = await authApi.addAddress(addr);
      if (user) {
        setUser({ ...user, addresses: updatedAddresses });
      }
      toast.success("Address added successfully!");
    } catch (err) {
      toast.error("Failed to add address");
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      const updatedAddresses = await authApi.deleteAddress(id);
      if (user) {
        setUser({ ...user, addresses: updatedAddresses });
      }
      toast.success("Address deleted successfully");
    } catch (err) {
      toast.error("Failed to delete address");
    }
  };

  // Cart Operations
  const addToCart = async (productId: string, quantity: number = 1, silent: boolean = false) => {
    // Require logged in user for cart persistence
    if (!token) {
      toast.error("Please login to manage your shopping cart");
      return;
    }
    try {
      setLoadingCart(true);
      const updatedCart = await cartApi.add(productId, quantity);
      setCart(updatedCart);
      if (!silent) {
        toast.success("Added to shopping cart!");
      }
    } catch (err) {
      toast.error("Failed to add product to cart");
    } finally {
      setLoadingCart(false);
    }
  };

  const updateCartQuantity = async (cartItemId: string, quantity: number) => {
    try {
      const updatedCart = await cartApi.update(cartItemId, quantity);
      setCart(updatedCart);
    } catch (err) {
      toast.error("Failed to update quantity");
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      const updatedCart = await cartApi.remove(cartItemId);
      setCart(updatedCart);
      toast.success("Removed from shopping cart");
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  const clearCart = async () => {
    try {
      const updatedCart = await cartApi.clear();
      setCart(updatedCart);
    } catch (err) {
      toast.error("Failed to clear cart");
    }
  };

  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Wishlist Operations
  const toggleWishlist = async (productId: string) => {
    if (!token) {
      toast.error("Please login to manage your wishlist");
      return;
    }
    try {
      setLoadingWishlist(true);
      const res = await wishlistApi.toggle(productId);
      setWishlist(res.wishlist);
      if (res.added) {
        toast.success("Added to wishlist!");
      } else {
        toast.success("Removed from wishlist");
      }
    } catch (err) {
      toast.error("Failed to update wishlist");
    } finally {
      setLoadingWishlist(false);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(p => p.id === productId);
  };

  // Compare Operations (Stored Client-Side)
  const toggleCompare = (product: Product) => {
    const exists = compareList.some(p => p.id === product.id);
    if (exists) {
      setCompareList(compareList.filter(p => p.id !== product.id));
      toast.success("Removed from comparison list");
    } else {
      if (compareList.length >= 4) {
        toast.error("You can compare up to 4 products at a time");
        return;
      }
      setCompareList([...compareList, product]);
      toast.success("Added to comparison list!");
    }
  };

  const isInCompare = (productId: string) => {
    return compareList.some(p => p.id === productId);
  };

  // Orders Operations
  const fetchOrders = async () => {
    if (!token) return;
    setLoadingOrders(true);
    try {
      const ords = await ordersApi.getAll();
      setOrders(ords);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const createOrder = async (orderData: any) => {
    try {
      const newOrd = await ordersApi.create(orderData);
      setOrders([newOrd, ...orders]);
      setCart([]); // Cart is auto cleared by backend
      toast.success("Order placed successfully!");
      return newOrd;
    } catch (err) {
      toast.error("Failed to place order. Try again.");
      return null;
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        deleteAddress,

        categories,
        loadingCategories,

        cart,
        loadingCart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartCount,

        wishlist,
        loadingWishlist,
        toggleWishlist,
        isInWishlist,

        compareList,
        toggleCompare,
        isInCompare,

        orders,
        loadingOrders,
        fetchOrders,
        createOrder,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
