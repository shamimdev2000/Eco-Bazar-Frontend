import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Product } from "../types";
import { productsApi } from "../services/api";
import { ProductCard } from "../components/product/ProductCard";
import { Breadcrumb } from "../components/common/Breadcrumb";
import { Empty } from "../components/common/Empty";
import { 
  Filter, 
  ArrowUpDown, 
  Search, 
  Star, 
  Grid3X3, 
  List, 
  SlidersHorizontal,
  X 
} from "lucide-react";

export const Shop: React.FC = () => {
  const { categories } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Active filters bound to state and URL synchronizations
  const searchQuery = searchParams.get("search") || "";
  const categoryFilter = searchParams.get("category") || "all";
  const sortOption = searchParams.get("sort") || "featured";
  const minRating = searchParams.get("rating") || "";
  const showOnlyInStock = searchParams.get("inStock") === "true";

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const params: any = {
          search: searchQuery || undefined,
          category: categoryFilter !== "all" ? categoryFilter : undefined,
          sort: sortOption || undefined,
          rating: minRating || undefined,
        };
        const list = await productsApi.getAll(params);
        
        // Post-filtering for client-side toggles if any
        let filtered = [...list];
        if (showOnlyInStock) {
          filtered = filtered.filter(p => p.stock > 0);
        }
        setProducts(filtered);
      } catch (err) {
        console.error("Failed to load shop products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [searchQuery, categoryFilter, sortOption, minRating, showOnlyInStock]);

  // Filter handlers updating searchParams
  const updateQueryParam = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === null || value === "" || value === "all") {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div id="shop-page" className="bg-gray-50/50 pb-16">
      
      <Breadcrumb items={[{ label: "Shop Products" }]} />

      <div className="container-custom pt-8">
        
        {/* SHOP METRIC ROW & OPTIONS */}
        <div className="bg-white border border-gray-150 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 shadow-sm">
          <div className="text-xs text-gray-500 font-medium">
            Showing <strong className="text-gray-800 font-mono font-bold">{products.length}</strong> certified organic items
            {searchQuery && <span> for "<strong className="text-brand-600">{searchQuery}</strong>"</span>}
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            
            {/* Mobile Filters Trigger */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center space-x-1.5 border border-gray-250 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-700 bg-white"
            >
              <SlidersHorizontal className="w-4 h-4 text-brand-600" />
              <span>Filters</span>
            </button>

            {/* Sorting Select */}
            <div className="flex items-center space-x-2 shrink-0">
              <ArrowUpDown className="w-4 h-4 text-gray-400" />
              <select
                value={sortOption}
                onChange={(e) => updateQueryParam("sort", e.target.value)}
                className="bg-white border border-gray-200 text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500"
              >
                <option value="featured">Featured Picks</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated First</option>
                <option value="discount">Biggest Discounts</option>
              </select>
            </div>

          </div>
        </div>

        {/* MAIN BODY LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* DESKTOP FILTER SIDEBAR */}
          <aside className="hidden lg:block bg-white border border-gray-150 rounded-2xl p-6 space-y-7 shadow-sm">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <span className="font-display font-bold text-gray-900 text-sm">Filter Options</span>
              {(searchQuery || categoryFilter !== "all" || sortOption !== "featured" || minRating || showOnlyInStock) && (
                <button 
                  onClick={handleClearFilters}
                  className="text-[10px] text-red-500 hover:text-red-700 font-bold uppercase tracking-wider"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Search filter inside sidebar */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 block">Search Keywords</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Apples, seeds..."
                  value={searchQuery}
                  onChange={(e) => updateQueryParam("search", e.target.value || null)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-3 pr-8 text-xs focus:outline-none focus:border-brand-500"
                />
                <Search className="w-4 h-4 text-gray-450 absolute right-2.5 top-2.5" />
              </div>
            </div>

            {/* Category selection */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-gray-700 block">Orchard Category</label>
              <div className="flex flex-col space-y-1.5">
                <button
                  onClick={() => updateQueryParam("category", "all")}
                  className={`text-left text-xs py-1 px-2.5 rounded-lg transition-standard ${
                    categoryFilter === "all" ? "bg-brand-50 text-brand-700 font-semibold" : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => updateQueryParam("category", cat.id)}
                    className={`text-left text-xs py-1 px-2.5 rounded-lg flex items-center justify-between transition-standard ${
                      categoryFilter === cat.id ? "bg-brand-50 text-brand-700 font-semibold" : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] font-mono text-gray-400 font-medium bg-gray-50 px-1.5 py-0.5 rounded">
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-gray-700 block">Rating Threshold</label>
              <div className="flex flex-col space-y-1.5">
                {[4.5, 4.0, 3.5].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => updateQueryParam("rating", String(stars))}
                    className={`text-left text-xs py-1 px-2.5 rounded-lg flex items-center space-x-2 transition-standard ${
                      minRating === String(stars) ? "bg-brand-50 text-brand-700 font-semibold" : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={11} fill={i < Math.floor(stars) ? "currentColor" : "none"} strokeWidth={1.5} className={i < Math.floor(stars) ? "" : "text-gray-300"} />
                      ))}
                    </div>
                    <span>{stars}+ Stars</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Availability */}
            <div className="space-y-2.5 pt-2 border-t border-gray-100">
              <label className="text-xs font-bold text-gray-700 block">Availability</label>
              <label className="flex items-center space-x-2 text-xs text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlyInStock}
                  onChange={(e) => updateQueryParam("inStock", e.target.checked ? "true" : null)}
                  className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                />
                <span>Show Only In Stock</span>
              </label>
            </div>

          </aside>

          {/* MAIN CATALOG GRID */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-[340px] bg-white border border-gray-100 rounded-2xl p-4 flex flex-col justify-between animate-pulse">
                    <div className="aspect-square w-full rounded-xl bg-gray-100" />
                    <div className="space-y-2 mt-4">
                      <div className="h-4 bg-gray-100 rounded w-1/3" />
                      <div className="h-4 bg-gray-100 rounded w-full" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                    <div className="h-8 bg-gray-100 rounded-xl mt-6" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <Empty
                title="No organic products match your filters"
                description="We couldn't find any biodynamic or organic items matching your active selections. Try clearing filters or tweaking your keywords."
                actionText="Reset All Filters"
                onAction={handleClearFilters}
              />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            )}

            {/* Simple Pagination Footer */}
            {products.length > 0 && (
              <div className="flex justify-center items-center space-x-1.5 mt-12">
                <button disabled className="px-3.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-400 disabled:opacity-40">
                  Prev
                </button>
                <button className="w-8 h-8 rounded-lg bg-brand-600 text-white text-xs font-bold font-mono">1</button>
                <button disabled className="px-3.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-400 disabled:opacity-40">
                  Next
                </button>
              </div>
            )}
          </main>

        </div>
      </div>

      {/* MOBILE COLLAPSED FILTERS MODAL */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden flex justify-end">
          <div className="bg-white w-full max-w-sm h-full shadow-2xl p-6 flex flex-col overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
              <span className="font-display font-bold text-gray-900 text-base">Filters</span>
              <button onClick={() => setShowMobileFilters(false)} className="p-1 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sidebar content copy */}
            <div className="space-y-7 flex-1">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block">Search Keywords</label>
                <input
                  type="text"
                  placeholder="Apples, seeds..."
                  value={searchQuery}
                  onChange={(e) => updateQueryParam("search", e.target.value || null)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs focus:outline-none"
                />
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block">Categories</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateQueryParam("category", "all")}
                    className={`text-xs py-1.5 px-3 rounded-lg transition-standard ${
                      categoryFilter === "all" ? "bg-brand-500 text-white font-semibold" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => updateQueryParam("category", cat.id)}
                      className={`text-xs py-1.5 px-3 rounded-lg transition-standard ${
                        categoryFilter === cat.id ? "bg-brand-500 text-white font-semibold" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ratings */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block">Rating Threshold</label>
                <div className="flex flex-col space-y-1.5">
                  {[4.5, 4.0, 3.5].map((stars) => (
                    <button
                      key={stars}
                      onClick={() => updateQueryParam("rating", String(stars))}
                      className={`text-left text-xs py-2 px-3 rounded-lg flex items-center space-x-2 transition-standard ${
                        minRating === String(stars) ? "bg-brand-50 text-brand-700 font-semibold border border-brand-200" : "bg-gray-50 text-gray-500"
                      }`}
                    >
                      <span>{stars}+ Stars</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock */}
              <div className="space-y-2.5 pt-2 border-t border-gray-100">
                <label className="flex items-center space-x-2 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showOnlyInStock}
                    onChange={(e) => updateQueryParam("inStock", e.target.checked ? "true" : null)}
                    className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span>Show Only In Stock</span>
                </label>
              </div>
            </div>

            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold py-3 rounded-xl mt-6 text-center"
            >
              Apply Filter Selections
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
