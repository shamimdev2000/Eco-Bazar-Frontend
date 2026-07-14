import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Breadcrumb } from "../components/common/Breadcrumb";
import { Empty } from "../components/common/Empty";
import { GitCompare, ShoppingCart, Trash2 } from "lucide-react";
import { Rating } from "../components/common/Rating";

export const Compare: React.FC = () => {
  const { compareList, toggleCompare, addToCart } = useApp();
  const navigate = useNavigate();

  if (compareList.length === 0) {
    return (
      <div className="bg-gray-50/50 pb-16">
        <Breadcrumb items={[{ label: "Compare Products" }]} />
        <div className="container-custom pt-12">
          <Empty
            title="Comparison Board is Empty"
            description="Add up to 4 organic products to comparison lists by clicking the comparison button on any card."
            actionText="Go to Shop"
            onAction={() => navigate("/shop")}
          />
        </div>
      </div>
    );
  }

  return (
    <div id="compare-page" className="bg-gray-50/50 pb-16">
      
      <Breadcrumb items={[{ label: "Compare Products" }]} />

      <div className="container-custom pt-8">
        <h1 className="text-2xl font-bold font-display text-gray-900 mb-8 flex items-center space-x-2">
          <GitCompare className="w-6 h-6 text-brand-600" />
          <span>Product Comparison Board ({compareList.length}/4)</span>
        </h1>

        <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full text-xs text-left text-gray-500 border-collapse min-w-[600px]">
            
            {/* Headers row */}
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-bold text-gray-800 uppercase text-[10px] tracking-wider w-1/5 font-mono">Product Spec</th>
                {compareList.map((prod) => (
                  <th key={prod.id} className="p-4 border-l border-gray-100 relative group">
                    <button
                      onClick={() => toggleCompare(prod)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-standard"
                      title="Remove product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="text-center pt-3 pb-2 flex flex-col items-center">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="w-20 h-20 object-contain rounded-lg mb-2"
                      />
                      <h4 className="font-semibold text-gray-800 hover:text-brand-600 transition-standard truncate max-w-[150px]">
                        <Link to={`/product/${prod.id}`}>{prod.name}</Link>
                      </h4>
                      <span className="text-[10px] font-mono font-bold text-gray-400 uppercase mt-0.5">{prod.unit}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Spec rows */}
            <tbody className="divide-y divide-gray-100">
              
              {/* Row: Price */}
              <tr>
                <td className="p-4 font-bold text-gray-800 bg-gray-50/50">Price</td>
                {compareList.map((prod) => (
                  <td key={prod.id} className="p-4 border-l border-gray-100 text-center font-mono font-bold text-brand-700 text-sm">
                    ${prod.price.toFixed(2)}
                  </td>
                ))}
              </tr>

              {/* Row: Old Price */}
              <tr>
                <td className="p-4 font-bold text-gray-800 bg-gray-50/50">Original Price</td>
                {compareList.map((prod) => (
                  <td key={prod.id} className="p-4 border-l border-gray-100 text-center font-mono">
                    {prod.oldPrice > prod.price ? `$${prod.oldPrice.toFixed(2)}` : "No discount"}
                  </td>
                ))}
              </tr>

              {/* Row: Rating */}
              <tr>
                <td className="p-4 font-bold text-gray-800 bg-gray-50/50">Average Rating</td>
                {compareList.map((prod) => (
                  <td key={prod.id} className="p-4 border-l border-gray-100">
                    <div className="flex justify-center">
                      <Rating rating={prod.rating} reviewsCount={prod.reviewsCount} size={11} />
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row: Brand */}
              <tr>
                <td className="p-4 font-bold text-gray-800 bg-gray-50/50">Organic Brand</td>
                {compareList.map((prod) => (
                  <td key={prod.id} className="p-4 border-l border-gray-100 text-center font-semibold text-gray-700">
                    {prod.brand}
                  </td>
                ))}
              </tr>

              {/* Row: Weight */}
              <tr>
                <td className="p-4 font-bold text-gray-800 bg-gray-50/50">Weight Specifications</td>
                {compareList.map((prod) => (
                  <td key={prod.id} className="p-4 border-l border-gray-100 text-center font-mono">
                    {prod.weight}
                  </td>
                ))}
              </tr>

              {/* Row: Origin */}
              <tr>
                <td className="p-4 font-bold text-gray-800 bg-gray-50/50">Grower Origin</td>
                {compareList.map((prod) => (
                  <td key={prod.id} className="p-4 border-l border-gray-100 text-center">
                    {prod.origin}
                  </td>
                ))}
              </tr>

              {/* Row: Key Benefits */}
              <tr>
                <td className="p-4 font-bold text-gray-800 bg-gray-50/50">Key Benefits</td>
                {compareList.map((prod) => (
                  <td key={prod.id} className="p-4 border-l border-gray-100 text-xs">
                    <ul className="list-disc pl-4 space-y-1 text-[11px]">
                      {prod.benefits.map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Row: Stock availability */}
              <tr>
                <td className="p-4 font-bold text-gray-800 bg-gray-50/50">Availability</td>
                {compareList.map((prod) => (
                  <td key={prod.id} className="p-4 border-l border-gray-100 text-center">
                    {prod.stock > 0 ? (
                      <span className="text-brand-600 font-bold uppercase bg-brand-50 px-2 py-1 rounded">In Stock</span>
                    ) : (
                      <span className="text-red-500 font-bold uppercase bg-red-50 px-2 py-1 rounded">Sold Out</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Row: Add to cart CTA */}
              <tr>
                <td className="p-4 font-bold text-gray-800 bg-gray-50/50">Action</td>
                {compareList.map((prod) => (
                  <td key={prod.id} className="p-4 border-l border-gray-100 text-center">
                    <button
                      disabled={prod.stock === 0}
                      onClick={() => addToCart(prod.id, 1)}
                      className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center space-x-1.5 mx-auto disabled:opacity-40 transition-standard"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add to Basket</span>
                    </button>
                  </td>
                ))}
              </tr>

            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
};
