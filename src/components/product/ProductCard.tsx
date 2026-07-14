import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Product } from "../../types";
import { Rating } from "../common/Rating";
import { Heart, GitCompare, Eye, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, toggleCompare, isInCompare } = useApp();
  const navigate = useNavigate();

  const isFav = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className="group relative bg-white border border-gray-100 rounded-2xl p-4 flex flex-col justify-between hover-lift overflow-hidden shadow-sm hover:border-brand-500"
    >
      {/* Badges Overlay */}
      <div className="absolute top-3.5 left-3.5 z-10 flex flex-col space-y-1">
        {product.discount > 0 && (
          <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
            {product.discount}% Off
          </span>
        )}
        {product.bestSeller && (
          <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
            Bestseller
          </span>
        )}
        {product.hotDeal && (
          <span className="bg-brand-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
            Hot Deal
          </span>
        )}
      </div>

      {/* Image & Quick Action Popups */}
      <div className="relative aspect-square w-full rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden mb-4 border border-gray-50 shrink-0">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-11/12 h-11/12 object-contain group-hover:scale-108 transition-all duration-550 ease-out"
        />

        {/* Quick Actions Hover Rail */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
          {/* Wishlist */}
          <button
            onClick={() => toggleWishlist(product.id)}
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-standard ${
              isFav ? "bg-red-500 text-white hover:bg-red-650" : "bg-white text-gray-600 hover:text-red-500 hover:bg-red-50"
            }`}
            title="Add to Wishlist"
          >
            <Heart className="w-5 h-5" fill={isFav ? "currentColor" : "none"} />
          </button>

          {/* Quick Details View */}
          <button
            onClick={() => navigate(`/product/${product.id}`)}
            className="w-10 h-10 rounded-full bg-white text-gray-600 hover:text-brand-600 hover:bg-brand-50 flex items-center justify-center shadow-md transition-standard"
            title="Product Details"
          >
            <Eye className="w-5 h-5" />
          </button>

          {/* Compare */}
          <button
            onClick={() => toggleCompare(product)}
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-standard ${
              isCompared ? "bg-brand-600 text-white hover:bg-brand-700" : "bg-white text-gray-600 hover:text-brand-600 hover:bg-brand-50"
            }`}
            title="Add to Compare"
          >
            <GitCompare className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Unit Category Row */}
          <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 font-mono">
            <span>{product.brand}</span>
            <span>{product.unit}</span>
          </div>

          {/* Product Name */}
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-brand-600 transition-standard mb-1.5 leading-snug">
            <Link to={`/product/${product.id}`}>{product.name}</Link>
          </h3>

          {/* Star Ratings */}
          <div className="mb-3">
            <Rating rating={product.rating} reviewsCount={product.reviewsCount} size={13} />
          </div>
        </div>

        {/* Pricing and Cart Button */}
        <div>
          <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-gray-50">
            <div className="flex flex-col">
              {product.oldPrice > product.price && (
                <span className="text-[10px] text-gray-400 line-through font-mono font-medium leading-none">
                  ${product.oldPrice.toFixed(2)}
                </span>
              )}
              <span className="text-base font-bold text-brand-700 font-mono leading-tight">
                ${product.price.toFixed(2)}
              </span>
            </div>

            {/* Direct Cart Button */}
            {product.stock > 0 ? (
              <button
                onClick={() => addToCart(product.id, 1)}
                className="bg-brand-200 hover:bg-brand-600 text-brand-600 hover:text-white p-2.5 rounded-xl transition-all duration-300 ease-in-out shrink-0 cursor-pointer"
                title="Add to Cart"
              >
                <ShoppingBag className="w-4.5 h-4.5" />
              </button>
            ) : (
              <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider font-mono bg-red-50 px-2 py-1.5 rounded-lg">
                Sold Out
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
