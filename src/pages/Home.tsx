import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Product } from "../types";
import { productsApi } from "../services/api";
import { ProductCard } from "../components/product/ProductCard";
import { Rating } from "../components/common/Rating";
import { 
  Truck, 
  ShieldCheck, 
  Sprout, 
  Headphones, 
  ArrowRight, 
  ShoppingBag,
  Star,
  Quote,
  RotateCcw,
  Heart,
  Eye,
  Instagram,
  Facebook,
  Twitter
} from "lucide-react";
import { motion } from "motion/react";

export const Home: React.FC = () => {
  const { categories, addToCart, toggleWishlist, isInWishlist } = useApp();
  const navigate = useNavigate();

  const [featuredProds, setFeaturedProds] = useState<Product[]>([]);
  const [hotDeals, setHotDeals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Hero Slider State
  const [activeSlide, setActiveSlide] = useState(0);

  // Live ticking countdown timer for Hot Deals & Promo Banners
  const [timeLeft, setTimeLeft] = useState({ days: 1, hours: 23, minutes: 34, seconds: 57 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        } else {
          return { days: 1, hours: 23, minutes: 34, seconds: 57 }; // reset
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const slides = [
    {
      title: "Fresh & Healthy Organic Food",
      subtitle: "SUMMER SALE",
      tagline: "Sale up to 30% OFF",
      description: "Free shipping on all your order. Get clean, chemical-free greens and hand-picked fruits straight to your table daily.",
      cta: "Shop Now",
      link: "/shop",
      bg: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80", // vibrant fresh organic pile
      avatar: "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=600&q=80" // farmer woman
    },
    {
      title: "100% Raw & Natural Honey",
      subtitle: "LIMITED OFFER",
      tagline: "Up to 25% OFF",
      description: "Directly from PNW wild honeycombs. Rich in essential minerals, enzymes, and packed with pure love.",
      cta: "Browse Pantry",
      link: "/shop?category=pantry",
      bg: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1200&q=80", // Honey jar
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80" // smiling chef
    }
  ];

  const popularCategoryList = [
    { id: "fruits-veg", name: "Fresh Fruit", image: "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?auto=format&fit=crop&w=150&q=80" },
    { id: "fruits-veg", name: "Fresh Vegetables", image: "https://images.unsplash.com/photo-1566385101042-1a010c129fa6?auto=format&fit=crop&w=150&q=80", active: true },
    { id: "pantry", name: "Meat & Fish", image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=150&q=80" },
    { id: "pantry", name: "Snacks", image: "https://images.unsplash.com/photo-1599490659213-e2b9527b0876?auto=format&fit=crop&w=150&q=80" },
    { id: "beverages", name: "Beverages", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=150&q=80" },
    { id: "pantry", name: "Beauty & Health", image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=150&q=80" },
    { id: "bakery", name: "Bread & Bakery", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=150&q=80" },
    { id: "bakery", name: "Baking Needs", image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=150&q=80" },
    { id: "pantry", name: "Cooking", image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=150&q=80" },
    { id: "pantry", name: "Diabetic Food", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=150&q=80" },
    { id: "pantry", name: "Dish Detergents", image: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=150&q=80" },
    { id: "pantry", name: "Oil", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=150&q=80" }
  ];

  useEffect(() => {
    const fetchHomeProducts = async () => {
      setLoading(true);
      try {
        const featured = await productsApi.getAll({ isFeatured: true });
        setFeaturedProds(featured);

        const hot = await productsApi.getAll({ isHotDeal: true });
        setHotDeals(hot);

        const best = await productsApi.getAll({ isBestSeller: true });
        setBestSellers(best);
      } catch (err) {
        console.error("Failed to load products for homepage:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeProducts();

    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 8500);
    return () => clearInterval(interval);
  }, []);

  // Format Helper for numbers
  const pad = (num: number) => String(num).padStart(2, "0");

  return (
    <div id="home-page" className="pb-16 bg-[#FFFFFF]">
      
      {/* 1. HERO GRID SECTION */}
      <section className="container-custom pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Slider (2/3 width) */}
          <div className="lg:col-span-8 relative h-[380px] md:h-[460px] overflow-hidden rounded-2xl bg-brand-50 border border-brand-100/30">
            {slides.map((slide, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-1000 flex items-center justify-between px-6 md:px-14 ${
                  activeSlide === idx ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
              >
                {/* Left Side: Content */}
                <div className="max-w-md z-10 space-y-4">
                  <span className="text-xs uppercase font-extrabold tracking-widest text-brand-500 font-mono">
                    {slide.subtitle}
                  </span>
                  <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight leading-tight text-gray-900">
                    {slide.title}
                  </h1>
                  <div className="flex items-center space-x-2.5">
                    <span className="text-sm text-gray-500">Starting at</span>
                    <span className="text-lg font-bold text-accent-500 bg-accent-100/50 px-3 py-1 rounded-lg">
                      {slide.tagline}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-500 leading-relaxed max-w-sm">
                    {slide.description}
                  </p>
                  <div className="pt-2">
                    <Link
                      to={slide.link}
                      className="bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm px-7 py-3 rounded-full shadow-md shadow-brand-500/15 transition-all duration-300 inline-flex items-center space-x-2 cursor-pointer"
                    >
                      <span>{slide.cta}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Right Side: Avatar Circle */}
                <div className="hidden md:flex relative w-64 h-64 lg:w-80 lg:h-80 shrink-0 items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-brand-100/50 scale-105" />
                  <img
                    src={slide.avatar}
                    alt="Organic Farmer"
                    referrerPolicy="no-referrer"
                    className="w-11/12 h-11/12 object-cover rounded-full border-4 border-white shadow-lg relative z-10"
                  />
                </div>
              </div>
            ))}

            {/* Slide Navigation Dots */}
            <div className="absolute bottom-6 left-6 md:left-14 flex space-x-2 z-20">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activeSlide === idx ? "bg-brand-500 w-6" : "bg-brand-300/60"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right Two Banners (1/3 width) */}
          <div className="lg:col-span-4 flex flex-col gap-6 justify-between">
            
            {/* Top Side Banner */}
            <div className="bg-[#F7F2EB] rounded-2xl p-6 flex items-center justify-between relative overflow-hidden h-[178px] md:h-[218px] border border-gray-150/50 hover-lift group">
              <div className="space-y-2 z-10 max-w-[180px]">
                <span className="text-[10px] font-extrabold tracking-widest text-gray-800 uppercase block font-mono">
                  Summer Sale
                </span>
                <h3 className="text-xl font-black text-gray-900 leading-snug">
                  75% OFF
                </h3>
                <p className="text-xs text-gray-500">
                  Only Fruit & Vegetable
                </p>
                <Link to="/shop" className="text-brand-500 font-bold text-xs flex items-center space-x-1 hover:text-brand-600 transition-standard">
                  <span>Shop Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <img
                src="https://images.unsplash.com/photo-1610397613050-3ee965f37750?auto=format&fit=crop&w=250&q=80"
                alt="Fruit bowl"
                referrerPolicy="no-referrer"
                className="absolute right-2 bottom-2 w-32 h-32 object-contain group-hover:scale-105 transition-transform duration-550"
              />
            </div>

            {/* Bottom Side Banner */}
            <div className="bg-brand-900 rounded-2xl p-6 flex items-center justify-between relative overflow-hidden h-[178px] md:h-[218px] border border-brand-850 hover-lift group">
              {/* Overlay with dark leaves bg pattern */}
              <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-15 pointer-events-none" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80')" }} />
              
              <div className="space-y-2 z-10 max-w-[180px]">
                <span className="text-[10px] font-extrabold tracking-widest text-[#FF8A00] uppercase block font-mono">
                  Best Deal
                </span>
                <h3 className="text-base font-black text-white leading-snug">
                  Special Products Deal of the Month
                </h3>
                <Link to="/shop" className="text-brand-400 font-bold text-xs flex items-center space-x-1 hover:text-brand-300 transition-standard">
                  <span>Shop Now</span>
                  <ArrowRight className="w-3.5 h-3.5 text-brand-400" />
                </Link>
              </div>
              <img
                src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=250&q=80"
                alt="Veggies box"
                referrerPolicy="no-referrer"
                className="absolute right-2 bottom-2 w-32 h-32 object-contain rounded-full group-hover:scale-105 transition-transform duration-550"
              />
            </div>

          </div>

        </div>
      </section>

      {/* 2. PROMISES / COMPACT FEATURES BAR */}
      <section className="container-custom pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-white border border-gray-100 rounded-xl p-6 shadow-xs">
          
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-brand-50 text-brand-500 rounded-full shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-sm">Free Shipping</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Free shipping on all your order</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 bg-brand-50 text-brand-500 rounded-full shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-sm">Customer Support 24/7</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Instant access to Support</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 bg-brand-50 text-brand-500 rounded-full shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-sm">100% Secure Payment</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">We ensure your money is safe</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 bg-brand-50 text-brand-500 rounded-full shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-sm">Money-Back Guarantee</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">30 Days Money-Back Guarantee</p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. POPULAR CATEGORIES */}
      <section className="py-12">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Popular Categories</h2>
            <Link to="/shop" className="text-brand-500 hover:text-brand-600 font-bold text-xs flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {popularCategoryList.map((cat, idx) => (
              <div
                key={idx}
                onClick={() => navigate(`/shop?category=${cat.id}`)}
                className={`bg-white border rounded-xl p-4 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center space-y-3 hover-lift ${
                  cat.active 
                    ? "border-brand-500 shadow-md shadow-brand-500/5 ring-1 ring-brand-500" 
                    : "border-gray-100 hover:border-brand-300"
                }`}
              >
                <div className="w-20 h-20 overflow-hidden rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover hover:scale-108 transition-standard"
                  />
                </div>
                <h4 className={`font-bold text-xs ${cat.active ? "text-brand-600" : "text-gray-700"} line-clamp-1`}>
                  {cat.name}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. POPULAR PRODUCTS */}
      <section className="py-8 border-t border-gray-100">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Popular Products</h2>
            <Link to="/shop" className="text-brand-500 hover:text-brand-600 font-bold text-xs flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
              {Array.from({ length: 10 }).map((_, idx) => (
                <div key={idx} className="h-80 bg-gray-50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
              {/* Combine collections to form 10 popular products */}
              {[...featuredProds, ...bestSellers].slice(0, 10).map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. PROMOTIONAL THREE BANNER BLOCK */}
      <section className="py-10">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Banner 1: Countdown Sale */}
            <div className="relative rounded-2xl p-6 overflow-hidden h-[340px] flex flex-col justify-between border border-gray-100 bg-[#E8F3FA] group shadow-xs">
              <div className="space-y-2 z-10">
                <span className="text-[10px] font-extrabold text-[#2C742F] tracking-widest uppercase block font-mono">
                  Best Deals
                </span>
                <h3 className="text-2xl font-black text-gray-900 leading-tight">
                  Sale of the Month
                </h3>
                
                {/* Live Ticker Boxes */}
                <div className="flex items-center space-x-2 pt-1">
                  <div className="text-center bg-white px-2.5 py-1.5 rounded-lg border border-gray-100 shadow-xs">
                    <span className="text-sm font-bold text-gray-800 font-mono block leading-none">{pad(timeLeft.days)}</span>
                    <span className="text-[8px] uppercase tracking-wider text-gray-400">Days</span>
                  </div>
                  <span className="text-gray-400 font-bold">:</span>
                  <div className="text-center bg-white px-2.5 py-1.5 rounded-lg border border-gray-100 shadow-xs">
                    <span className="text-sm font-bold text-gray-800 font-mono block leading-none">{pad(timeLeft.hours)}</span>
                    <span className="text-[8px] uppercase tracking-wider text-gray-400">Hrs</span>
                  </div>
                  <span className="text-gray-400 font-bold">:</span>
                  <div className="text-center bg-white px-2.5 py-1.5 rounded-lg border border-gray-100 shadow-xs">
                    <span className="text-sm font-bold text-gray-800 font-mono block leading-none">{pad(timeLeft.minutes)}</span>
                    <span className="text-[8px] uppercase tracking-wider text-gray-400">Mins</span>
                  </div>
                  <span className="text-gray-400 font-bold">:</span>
                  <div className="text-center bg-white px-2.5 py-1.5 rounded-lg border border-gray-100 shadow-xs">
                    <span className="text-sm font-bold text-gray-800 font-mono block leading-none">{pad(timeLeft.seconds)}</span>
                    <span className="text-[8px] uppercase tracking-wider text-gray-400">Secs</span>
                  </div>
                </div>

                <div className="pt-3">
                  <Link to="/shop" className="bg-white hover:bg-brand-500 text-brand-600 hover:text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-xs transition-all inline-flex items-center space-x-1.5 border border-brand-200">
                    <span>Shop Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Veggies decorative background overlay */}
              <img
                src="https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=350&q=80"
                alt="fresh greens"
                referrerPolicy="no-referrer"
                className="absolute right-0 bottom-0 w-11/12 h-1/2 object-contain pointer-events-none group-hover:scale-105 transition-transform duration-550 opacity-90"
              />
            </div>

            {/* Banner 2: Meat Promotion */}
            <div className="relative rounded-2xl p-6 overflow-hidden h-[340px] flex flex-col justify-between border border-gray-100 bg-[#FCF3F2] group shadow-xs">
              <div className="space-y-2 z-10">
                <span className="text-[10px] font-extrabold text-[#D55C5C] tracking-widest uppercase block font-mono">
                  85% Fat Free
                </span>
                <h3 className="text-2xl font-black text-gray-900 leading-tight">
                  Low-Fat Meat
                </h3>
                <div className="flex items-baseline space-x-1">
                  <span className="text-xs text-gray-500">Started at</span>
                  <span className="text-base font-extrabold text-[#D55C5C] font-mono">$79.99</span>
                </div>

                <div className="pt-3">
                  <Link to="/shop?category=pantry" className="bg-white hover:bg-brand-500 text-brand-600 hover:text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-xs transition-all inline-flex items-center space-x-1.5 border border-gray-150">
                    <span>Shop Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Meat products Unsplash decorative background */}
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=350&q=80"
                alt="raw meat"
                referrerPolicy="no-referrer"
                className="absolute right-0 bottom-0 w-full h-1/2 object-cover pointer-events-none group-hover:scale-105 transition-transform duration-550"
              />
            </div>

            {/* Banner 3: Fruit Promotion */}
            <div className="relative rounded-2xl p-6 overflow-hidden h-[340px] flex flex-col justify-between border border-gray-100 bg-[#FFF9E6] group shadow-xs">
              <div className="space-y-2 z-10">
                <span className="text-[10px] font-extrabold text-accent-500 tracking-widest uppercase block font-mono">
                  Summer Sale
                </span>
                <h3 className="text-2xl font-black text-gray-900 leading-tight">
                  100% Fresh Fruit
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Up to</span>
                  <span className="text-xs font-black bg-[#FF8A00] text-white px-2.5 py-1 rounded-md font-mono leading-none">64% OFF</span>
                </div>

                <div className="pt-3">
                  <Link to="/shop" className="bg-white hover:bg-brand-500 text-brand-600 hover:text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-xs transition-all inline-flex items-center space-x-1.5 border border-amber-200">
                    <span>Shop Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Citrus fruit plate beautiful decorative background */}
              <img
                src="https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?auto=format&fit=crop&w=350&q=80"
                alt="fresh organic fruit"
                referrerPolicy="no-referrer"
                className="absolute right-0 bottom-0 w-full h-1/2 object-cover pointer-events-none group-hover:scale-105 transition-transform duration-550"
              />
            </div>

          </div>
        </div>
      </section>

      {/* 6. HOT DEALS SECTION */}
      <section className="py-12 bg-[#F9F9F9] border-y border-gray-100">
        <div className="container-custom">
          
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Hot Deals</h2>
            <Link to="/shop" className="text-brand-500 hover:text-brand-600 font-bold text-xs flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Big Highlight Box: Chinese cabbage */}
            <div className="lg:col-span-4 bg-white border border-[#00B207] rounded-2xl p-6 shadow-sm flex flex-col justify-between relative group">
              <div className="absolute top-4 left-4 z-10 flex flex-col space-y-1">
                <span className="bg-[#EA5353] text-white text-[10px] font-extrabold px-3 py-1 rounded-md uppercase tracking-wider font-mono">
                  Sale 50%
                </span>
                <span className="bg-brand-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-md uppercase tracking-wider font-mono">
                  Best Sale
                </span>
              </div>

              {/* Product Thumbnail image */}
              <div className="relative aspect-video w-full flex items-center justify-center overflow-hidden mb-4 rounded-xl mt-6">
                <img
                  src="https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=400&q=80" // High quality Chinese cabbage or bok choy
                  alt="Chinese cabbage"
                  referrerPolicy="no-referrer"
                  className="max-h-48 object-contain group-hover:scale-105 transition-transform duration-550"
                />

                {/* Left floating interactive icons */}
                <div className="absolute left-3.5 bottom-3.5 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-9 h-9 rounded-full bg-white text-gray-600 hover:text-red-500 shadow-md flex items-center justify-center transition-standard">
                    <Heart className="w-4.5 h-4.5" />
                  </button>
                  <button onClick={() => navigate(`/product/prod-2`)} className="w-9 h-9 rounded-full bg-white text-gray-600 hover:text-brand-500 shadow-md flex items-center justify-center transition-standard">
                    <Eye className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>

              {/* Content metadata */}
              <div className="text-center space-y-2 mb-4">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-500 transition-standard">
                  Chinese cabbage
                </h3>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-[#EA5353] font-bold font-mono text-lg">$12.00</span>
                  <span className="text-gray-400 line-through font-mono text-sm">$24.00</span>
                </div>
                
                {/* Custom Ratings stars */}
                <div className="flex items-center justify-center space-x-1.5 text-xs text-gray-400">
                  <div className="flex text-accent-500">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill="currentColor" strokeWidth={0} />)}
                  </div>
                  <span>(524 Feedback)</span>
                </div>
              </div>

              {/* Hurry up! timer block */}
              <div className="border-t border-gray-100 pt-4 text-center space-y-3">
                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">
                  Hurry up! Offer ends in:
                </span>
                
                {/* Large countdown boxes */}
                <div className="flex items-center justify-center space-x-4">
                  <div className="text-center">
                    <span className="text-2xl font-black text-gray-800 font-mono block leading-none">{pad(timeLeft.days)}</span>
                    <span className="text-[9px] uppercase tracking-wider text-gray-400">Days</span>
                  </div>
                  <span className="text-gray-300 font-bold text-xl">:</span>
                  <div className="text-center">
                    <span className="text-2xl font-black text-gray-800 font-mono block leading-none">{pad(timeLeft.hours)}</span>
                    <span className="text-[9px] uppercase tracking-wider text-gray-400">Hours</span>
                  </div>
                  <span className="text-gray-300 font-bold text-xl">:</span>
                  <div className="text-center">
                    <span className="text-2xl font-black text-gray-800 font-mono block leading-none">{pad(timeLeft.minutes)}</span>
                    <span className="text-[9px] uppercase tracking-wider text-gray-400">Mins</span>
                  </div>
                  <span className="text-gray-300 font-bold text-xl">:</span>
                  <div className="text-center">
                    <span className="text-2xl font-black text-gray-800 font-mono block leading-none">{pad(timeLeft.seconds)}</span>
                    <span className="text-[9px] uppercase tracking-wider text-gray-400">Secs</span>
                  </div>
                </div>

                {/* Big full-width add to cart green bar */}
                <button 
                  onClick={() => addToCart("prod-2", 1)}
                  className="w-full bg-[#00B207] hover:bg-[#2C742F] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 mt-4 shadow-sm cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5 text-white" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>

            {/* Right Grid: Small Hot Sale Products (8 Cards) */}
            <div className="lg:col-span-8">
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
                  {Array.from({ length: 8 }).map((_, idx) => (
                    <div key={idx} className="h-72 bg-gray-100 rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Fill 8 spaces with hot deals or other items */}
                  {[...hotDeals, ...featuredProds, ...bestSellers].slice(1, 9).map((prod) => (
                    <ProductCard key={prod.id} product={prod} />
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* 7. WIDE PROMO BANNER */}
      <section className="container-custom pt-12 pb-6">
        <div className="relative rounded-2xl overflow-hidden h-[300px] flex items-center bg-brand-900 border border-brand-850 shadow-md group">
          {/* Cover background image of fresh cabbage/herbs */}
          <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30 pointer-events-none" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80')" }} />
          
          <div className="relative z-10 p-8 md:p-16 max-w-xl space-y-4 text-white">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#FF8A00] font-mono">
              Summer Sale
            </span>
            <h2 className="text-3xl md:text-5xl font-black font-display tracking-tight leading-tight">
              <span className="text-[#00B207]">37%</span> OFF
            </h2>
            <p className="text-xs md:text-sm text-gray-300 max-w-sm leading-relaxed">
              Free on all your order, Free Shipping and 30 days money-back guarantee. Direct from organic fields.
            </p>
            <div className="pt-2">
              <Link to="/shop" className="bg-[#00B207] hover:bg-[#2C742F] text-white font-bold text-xs px-8 py-3.5 rounded-full shadow-md transition-all inline-flex items-center space-x-2">
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FEATURED PRODUCTS */}
      <section className="py-12">
        <div className="container-custom">
          
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <Link to="/shop" className="text-brand-500 hover:text-brand-600 font-bold text-xs flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 animate-pulse">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="h-80 bg-gray-50 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
              {featuredProds.slice(0, 5).map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* 9. LATEST NEWS (BLOGS) */}
      <section className="py-12 border-t border-gray-100">
        <div className="container-custom">
          
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">Latest News</h2>
            <Link to="/blog" className="text-brand-500 hover:text-brand-600 font-bold text-xs flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Blog Card 1 */}
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden hover-lift shadow-xs group">
              <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=500&q=80"
                  alt="Organic news"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-550"
                />
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg text-center border border-gray-100 shadow-sm">
                  <span className="text-sm font-black text-gray-800 font-mono block leading-none">18</span>
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Nov</span>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center space-x-4 text-[11px] text-gray-400 font-semibold font-mono">
                  <span className="text-brand-600 font-bold">Food</span>
                  <span>•</span>
                  <span>By Admin</span>
                  <span>•</span>
                  <span>65 Comments</span>
                </div>
                <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-brand-500 transition-standard line-clamp-2">
                  Curabitur porttitor orci eget neque accumsan venenatis. Nunc fermentum.
                </h3>
                <Link to="/blog" className="text-brand-500 font-extrabold text-xs inline-flex items-center space-x-1 group-hover:text-brand-600 transition-standard">
                  <span>Read More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Blog Card 2 */}
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden hover-lift shadow-xs group">
              <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1543083503-4c924ebf1bec?auto=format&fit=crop&w=500&q=80"
                  alt="Diet tips"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-550"
                />
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg text-center border border-gray-100 shadow-sm">
                  <span className="text-sm font-black text-gray-800 font-mono block leading-none">29</span>
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Jan</span>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center space-x-4 text-[11px] text-gray-400 font-semibold font-mono">
                  <span className="text-brand-600 font-bold">Food</span>
                  <span>•</span>
                  <span>By Admin</span>
                  <span>•</span>
                  <span>65 Comments</span>
                </div>
                <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-brand-500 transition-standard line-clamp-2">
                  Eget lobortis lorem lacinia. Vivamus pharetra semper, congue nec.
                </h3>
                <Link to="/blog" className="text-brand-500 font-extrabold text-xs inline-flex items-center space-x-1 group-hover:text-brand-600 transition-standard">
                  <span>Read More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Blog Card 3 */}
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden hover-lift shadow-xs group">
              <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=500&q=80"
                  alt="Superfood mix"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-550"
                />
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg text-center border border-gray-100 shadow-sm">
                  <span className="text-sm font-black text-gray-800 font-mono block leading-none">21</span>
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Feb</span>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center space-x-4 text-[11px] text-gray-400 font-semibold font-mono">
                  <span className="text-brand-600 font-bold">Food</span>
                  <span>•</span>
                  <span>By Admin</span>
                  <span>•</span>
                  <span>65 Comments</span>
                </div>
                <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-brand-500 transition-standard line-clamp-2">
                  Maecenas blandit risus elementum mauris malesuada, congue lorem.
                </h3>
                <Link to="/blog" className="text-brand-500 font-extrabold text-xs inline-flex items-center space-x-1 group-hover:text-brand-600 transition-standard">
                  <span>Read More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 10. CLIENT TESTIMONIALS */}
      <section className="py-16 bg-[#F2F9F3]/60 border-t border-gray-100">
        <div className="container-custom">
          
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">Client Testimonials</h2>
            
            {/* Arrows UI matching Figma */}
            <div className="flex items-center space-x-2">
              <button className="w-10 h-10 rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-brand-500 hover:text-white flex items-center justify-center transition-standard shadow-xs">
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
              <button className="w-10 h-10 rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-brand-500 hover:text-white flex items-center justify-center transition-standard shadow-xs">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Testimonial boxes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Box 1 */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 relative shadow-xs">
              <Quote className="text-brand-500 fill-brand-500/10 w-10 h-10 mb-4" />
              <p className="text-xs text-gray-500 leading-relaxed italic">
                "Pellentesque eu nibh eget mauris congue mattis mattis nec tellus. Phasellus imperdiet elit eu magna dictum, bibendum cursus velit sodales. Donec sed neque eget."
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-gray-50 pt-4">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                    alt="user"
                    className="w-10 h-10 rounded-full object-cover border border-gray-100"
                  />
                  <div>
                    <h4 className="font-bold text-gray-800 text-xs">Robert Fox</h4>
                    <p className="text-[10px] text-gray-400">Customer</p>
                  </div>
                </div>
                {/* Rating */}
                <div className="flex text-accent-500">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={11} fill="currentColor" strokeWidth={0} />)}
                </div>
              </div>
            </div>

            {/* Box 2 */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 relative shadow-xs">
              <Quote className="text-brand-500 fill-brand-500/10 w-10 h-10 mb-4" />
              <p className="text-xs text-gray-500 leading-relaxed italic">
                "Pellentesque eu nibh eget mauris congue mattis mattis nec tellus. Phasellus imperdiet elit eu magna dictum, bibendum cursus velit sodales. Donec sed neque eget."
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-gray-50 pt-4">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                    alt="user"
                    className="w-10 h-10 rounded-full object-cover border border-gray-100"
                  />
                  <div>
                    <h4 className="font-bold text-gray-800 text-xs">Dianne Russell</h4>
                    <p className="text-[10px] text-gray-400">Customer</p>
                  </div>
                </div>
                {/* Rating */}
                <div className="flex text-accent-500">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={11} fill="currentColor" strokeWidth={0} />)}
                </div>
              </div>
            </div>

            {/* Box 3 */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 relative shadow-xs">
              <Quote className="text-brand-500 fill-brand-500/10 w-10 h-10 mb-4" />
              <p className="text-xs text-gray-500 leading-relaxed italic">
                "Pellentesque eu nibh eget mauris congue mattis mattis nec tellus. Phasellus imperdiet elit eu magna dictum, bibendum cursus velit sodales. Donec sed neque eget."
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-gray-50 pt-4">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80"
                    alt="user"
                    className="w-10 h-10 rounded-full object-cover border border-gray-100"
                  />
                  <div>
                    <h4 className="font-bold text-gray-800 text-xs">Eleanor Pena</h4>
                    <p className="text-[10px] text-gray-400">Customer</p>
                  </div>
                </div>
                {/* Rating */}
                <div className="flex text-accent-500">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={11} fill="currentColor" strokeWidth={0} />)}
                </div>
              </div>
            </div>

          </div>

          {/* Grayscale partners line */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 items-center justify-items-center opacity-30 filter grayscale mt-14 pt-8 border-t border-gray-150/40">
            <span className="font-sans text-xl font-black tracking-widest lowercase">steps</span>
            <span className="font-sans text-2xl font-black tracking-wider uppercase">mango</span>
            <span className="font-serif text-xl font-bold tracking-tight lowercase italic">food</span>
            <span className="font-sans text-xl font-extrabold tracking-widest uppercase">food_group</span>
            <span className="font-sans text-base font-bold uppercase border border-current px-2 py-0.5">book-off</span>
            <span className="font-sans text-lg font-black tracking-wide">G Series</span>
          </div>

        </div>
      </section>

      {/* 11. INSTAGRAM FEED */}
      <section className="py-12 bg-[#FFFFFF]">
        <div className="container-custom">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-8">Follow us on Instagram</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=300&q=80", // chinese cabbage
              "https://images.unsplash.com/photo-1566385101042-1a010c129fa6?auto=format&fit=crop&w=300&q=80", // vegetables leaf
              "https://images.unsplash.com/photo-1610397613050-3ee965f37750?auto=format&fit=crop&w=300&q=80", // red tomatoes
              "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80", // green leaf lettuce
              "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?auto=format&fit=crop&w=300&q=80", // citrus lemons
              "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=300&q=80"  // blueberries fresh water splash
            ].map((imgUrl, index) => (
              <div key={index} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-100 cursor-pointer shadow-xs">
                <img
                  src={imgUrl}
                  alt="instagram feed"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-108 transition-all duration-550 ease-out"
                />
                
                {/* Hover semi-transparent overlay with Instagram icon */}
                <div className="absolute inset-0 bg-[#00B207]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white text-brand-600 flex items-center justify-center shadow-md">
                    <Instagram className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
