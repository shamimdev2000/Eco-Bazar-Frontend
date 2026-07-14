import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Breadcrumb } from "../components/common/Breadcrumb";
import { Empty } from "../components/common/Empty";
import { ProductCard } from "../components/product/ProductCard";
import { Heart } from "lucide-react";

export const Wishlist: React.FC = () => {
  const { wishlist, loadingWishlist } = useApp();
  const navigate = useNavigate();

  return (
    <div id="wishlist-page" className="bg-gray-50/50 pb-16">
      
      <Breadcrumb items={[{ label: "My Wishlist" }]} />

      <div className="container-custom pt-8">
        <h1 className="text-2xl font-bold font-display text-gray-900 mb-8 flex items-center space-x-2">
          <Heart className="w-6 h-6 text-red-500 fill-red-500" />
          <span>My Saved Wishlist</span>
        </h1>

        {loadingWishlist ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-gray-400 font-mono">Loading saved goods...</p>
          </div>
        ) : wishlist.length === 0 ? (
          <Empty
            title="Your Wishlist is Empty"
            description="Keep tabs on organic honey, sourdough bread, or fresh spinach by clicking the heart button on product cards."
            actionText="Go Shopping"
            onAction={() => navigate("/shop")}
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
