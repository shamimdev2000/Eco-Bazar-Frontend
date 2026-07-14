import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Product, Review } from "../types";
import { productsApi } from "../services/api";
import { Rating } from "../components/common/Rating";
import { Breadcrumb } from "../components/common/Breadcrumb";
import { ProductCard } from "../components/product/ProductCard";
import { 
  Heart, 
  GitCompare, 
  ShoppingCart, 
  Truck, 
  ShieldCheck, 
  MapPin, 
  Sprout, 
  Send 
} from "lucide-react";
import { toast } from "react-hot-toast";

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist, toggleCompare, isInCompare, categories } = useApp();

  // State
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "details" | "shipping" | "reviews">("desc");

  // Review Form State
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchProductDetails = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await productsApi.getById(id);
      setProduct(res.product);
      setRelatedProducts(res.related);
    } catch (err) {
      console.error("Failed to load product detail:", err);
      toast.error("Product not found");
      navigate("/shop");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
    // Scroll to top on id change
    window.scrollTo(0, 0);
    setQuantity(1);
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product.id, quantity);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !id) return;
    if (!reviewName.trim() || !reviewComment.trim()) {
      toast.error("Name and review details are required");
      return;
    }

    setSubmittingReview(true);
    try {
      const updatedProduct = await productsApi.addReview(id, {
        user: reviewName.trim(),
        rating: reviewRating,
        comment: reviewComment.trim()
      });
      setProduct(updatedProduct);
      toast.success("Review posted successfully!");
      
      // Clear form
      setReviewName("");
      setReviewRating(5);
      setReviewComment("");
    } catch (err) {
      toast.error("Failed to post review. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-16 text-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-gray-400 font-mono">Loading premium organic details...</p>
      </div>
    );
  }

  if (!product) return null;

  const isFav = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);
  const cat = categories.find(c => c.id === product.category);

  return (
    <div id="product-detail-page" className="bg-white pb-16">
      
      <Breadcrumb 
        items={[
          { label: "Shop", url: "/shop" },
          { label: cat ? cat.name : "Category", url: `/shop?category=${product.category}` },
          { label: product.name }
        ]} 
      />

      <div className="container-custom pt-10">
        
        {/* UPPER INFO BLOCKS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
          
          {/* A. Product Image with Hover Magnify effect */}
          <div className="bg-gray-50/50 border border-gray-100 rounded-3xl p-8 relative flex items-center justify-center overflow-hidden h-[340px] sm:h-[420px]">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="max-h-full max-w-full object-contain transition-transform duration-500 hover:scale-108 cursor-zoom-in"
            />
            {product.discount > 0 && (
              <span className="absolute top-5 left-5 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                {product.discount}% OFF
              </span>
            )}
          </div>

          {/* B. Product details side */}
          <div className="space-y-6">
            
            {/* Category / Sku row */}
            <div className="flex justify-between items-center text-xs font-semibold text-gray-450 uppercase font-mono tracking-wider">
              <span>{product.brand}</span>
              <span>SKU: {product.sku}</span>
            </div>

            {/* Title & Unit */}
            <div className="space-y-1.5">
              <h1 className="text-2xl md:text-3.5xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>
              <span className="inline-block bg-brand-50 text-brand-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                Unit Pack: {product.unit}
              </span>
            </div>

            {/* Ratings Summary */}
            <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
              <Rating rating={product.rating} size={15} />
              <span className="text-xs text-gray-500 font-medium">Verified customer reviews ({product.reviewsCount})</span>
            </div>

            {/* Prices & Stock */}
            <div className="flex items-center justify-between">
              <div className="flex items-baseline space-x-3">
                <span className="text-2xl md:text-3xl font-black text-brand-700 font-mono">
                  ${product.price.toFixed(2)}
                </span>
                {product.oldPrice > product.price && (
                  <span className="text-sm text-gray-400 line-through font-mono">
                    ${product.oldPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <div>
                {product.stock > 0 ? (
                  <span className="bg-brand-50 text-brand-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider font-mono">
                    In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="bg-red-50 text-red-500 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider font-mono">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Short description */}
            <p className="text-xs text-gray-500 leading-relaxed">
              {product.description}
            </p>

            {/* Key benefits list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600 font-semibold pt-2">
              {product.benefits.slice(0, 4).map((b, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Sprout className="w-4 h-4 text-brand-500" />
                  <span>{b}</span>
                </div>
              ))}
            </div>

            {/* Interactive Actions Grid */}
            <div className="pt-4 border-t border-gray-100 space-y-4">
              
              {product.stock > 0 && (
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-gray-200 rounded-xl py-1.5 px-3 bg-gray-50/50 shrink-0 self-start sm:self-auto">
                    <span className="text-xs text-gray-400 font-medium mr-4">Quantity:</span>
                    <button 
                      disabled={quantity <= 1}
                      onClick={() => setQuantity(quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-brand-600 font-bold disabled:opacity-30"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-bold font-mono text-gray-800">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-brand-600 font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart button */}
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-md shadow-brand-100 flex items-center justify-center space-x-2 transition-all duration-300"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Shopping Cart</span>
                  </button>
                </div>
              )}

              {/* Wishlist & Compare Buttons Row */}
              <div className="flex items-center space-x-4 pt-2 text-xs">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`flex items-center space-x-1.5 py-1.5 px-3.5 rounded-lg border transition-standard font-semibold ${
                    isFav 
                      ? "border-red-200 bg-red-50 text-red-600" 
                      : "border-gray-200 hover:bg-red-50 hover:text-red-600 text-gray-500"
                  }`}
                >
                  <Heart className="w-4 h-4" fill={isFav ? "currentColor" : "none"} />
                  <span>{isFav ? "On Wishlist" : "Add to Wishlist"}</span>
                </button>

                <button
                  onClick={() => toggleCompare(product)}
                  className={`flex items-center space-x-1.5 py-1.5 px-3.5 rounded-lg border transition-standard font-semibold ${
                    isCompared 
                      ? "border-brand-200 bg-brand-50 text-brand-600" 
                      : "border-gray-200 hover:bg-brand-50 hover:text-brand-600 text-gray-500"
                  }`}
                >
                  <GitCompare className="w-4 h-4" />
                  <span>{isCompared ? "Compared" : "Add to Compare"}</span>
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* BOTTOM DETAIL TABS */}
        <div className="mt-16 border-t border-gray-100 pt-10">
          
          {/* Navigation */}
          <div className="flex border-b border-gray-150 text-sm font-semibold text-gray-500 space-x-8 mb-8 overflow-x-auto pb-0.5">
            <button
              onClick={() => setActiveTab("desc")}
              className={`pb-3 border-b-2 transition-standard shrink-0 ${activeTab === "desc" ? "border-brand-600 text-brand-700" : "border-transparent hover:text-gray-800"}`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("details")}
              className={`pb-3 border-b-2 transition-standard shrink-0 ${activeTab === "details" ? "border-brand-600 text-brand-700" : "border-transparent hover:text-gray-800"}`}
            >
              Details & Origin
            </button>
            <button
              onClick={() => setActiveTab("shipping")}
              className={`pb-3 border-b-2 transition-standard shrink-0 ${activeTab === "shipping" ? "border-brand-600 text-brand-700" : "border-transparent hover:text-gray-800"}`}
            >
              Shipping Information
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-3 border-b-2 transition-standard shrink-0 ${activeTab === "reviews" ? "border-brand-600 text-brand-700" : "border-transparent hover:text-gray-800"}`}
            >
              Reviews ({product.reviewsCount})
            </button>
          </div>

          {/* Active Tab contents */}
          <div className="max-w-4xl text-xs leading-relaxed text-gray-600 space-y-4">
            {activeTab === "desc" && (
              <div className="space-y-3">
                <p>{product.description}</p>
                <p>
                  Our organic produce is hand-picked directly by local farm cooperative networks. Handled with supreme care and zero synthetics from plantation to final transit, ensuring that you receive food rich in flavor, antioxidants, and pure health.
                </p>
              </div>
            )}

            {activeTab === "details" && (
              <div className="border border-gray-100 rounded-xl overflow-hidden max-w-lg">
                <div className="grid grid-cols-2 bg-gray-50/50 p-3 border-b border-gray-100">
                  <span className="font-bold text-gray-700">Brand Provider</span>
                  <span>{product.brand}</span>
                </div>
                <div className="grid grid-cols-2 p-3 border-b border-gray-100">
                  <span className="font-bold text-gray-700">Weight Pack</span>
                  <span>{product.weight}</span>
                </div>
                <div className="grid grid-cols-2 bg-gray-50/50 p-3 border-b border-gray-100">
                  <span className="font-bold text-gray-700">Orchard Location</span>
                  <span>{product.origin}</span>
                </div>
                <div className="grid grid-cols-2 p-3">
                  <span className="font-bold text-gray-700">Certified USDA Organic</span>
                  <span>Yes (Certified Biodynamic)</span>
                </div>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-start space-x-3">
                  <Truck className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-850 text-xs mb-1">Carbon-Neutral Next Day Delivery</h4>
                    <p className="text-gray-400">All orders placed before 4:00 PM are harvested, packed, and dispatched immediately. Arrives chilled in 100% biodegradable insulated bags.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <ShieldCheck className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-850 text-xs mb-1">Temperature-Controlled Safety</h4>
                    <p className="text-gray-400">Milk, pasture eggs, and delicate leafy greens are shipped inside specialized coolbox liners maintaining safe orchard chill throughout transit.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-8">
                {/* Review Form */}
                <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-6">
                  <h4 className="font-display font-bold text-gray-850 text-sm mb-4">Write a Verified Review</h4>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-700 uppercase block mb-1">Your Nickname</label>
                        <input
                          type="text"
                          required
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          placeholder="e.g. OrganicLover99"
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-700 uppercase block mb-1">Star Score</label>
                        <select
                          value={reviewRating}
                          onChange={(e) => setReviewRating(parseInt(e.target.value))}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                        >
                          <option value={5}>5 Stars - Outstanding</option>
                          <option value={4}>4 Stars - Very Fresh</option>
                          <option value={3}>3 Stars - Satisfactory</option>
                          <option value={2}>2 Stars - Needs Improvement</option>
                          <option value={1}>1 Star - Poor Experience</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-700 uppercase block mb-1">Your Detailed Feedback</label>
                      <textarea
                        required
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Write details about fresh taste, pack quality, delivery speed..."
                        className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs flex items-center space-x-2 disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{submittingReview ? "Posting..." : "Submit My Review"}</span>
                    </button>
                  </form>
                </div>

                {/* Existing Reviews list */}
                <div className="space-y-5">
                  {product.reviews.length === 0 ? (
                    <p className="text-gray-400 italic text-xs">There are no customer reviews for this product yet. Be the first to share your experience!</p>
                  ) : (
                    product.reviews.map((rev) => (
                      <div key={rev.id} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h5 className="font-semibold text-gray-800 text-xs">{rev.user}</h5>
                            <span className="text-[10px] text-gray-400 font-mono">{rev.date}</span>
                          </div>
                          <Rating rating={rev.rating} size={11} />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{rev.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* RELATED PRODUCTS SECTION */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h3 className="font-display font-bold text-gray-900 text-lg mb-8 flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse" />
              <span>Related Fresh Items You Might Enjoy</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
