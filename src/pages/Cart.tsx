import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Breadcrumb } from "../components/common/Breadcrumb";
import { Empty } from "../components/common/Empty";
import { Trash2, ShoppingBag, ArrowRight, Tag, Percent } from "lucide-react";
import { toast } from "react-hot-toast";

export const Cart: React.FC = () => {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    cartSubtotal, 
    cartCount 
  } = useApp();

  const navigate = useNavigate();

  // Coupon Engine State
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === "ORGANIC15") {
      setDiscountPercent(15);
      setAppliedCoupon("ORGANIC15");
      toast.success("Promo code applied! You saved 15% on your organic order.");
      setCouponCode("");
    } else if (code === "FRESH20") {
      setDiscountPercent(20);
      setAppliedCoupon("FRESH20");
      toast.success("Fresh grower code applied! You saved 20% on your organic order.");
      setCouponCode("");
    } else {
      toast.error("Invalid coupon code. Try 'ORGANIC15' or 'FRESH20'.");
    }
  };

  const handleRemoveCoupon = () => {
    setDiscountPercent(0);
    setAppliedCoupon(null);
    toast.success("Coupon removed");
  };

  // Shipping logic
  const shippingFee = cartSubtotal >= 40 ? 0 : cartSubtotal > 0 ? 4.99 : 0;
  const discountAmount = (cartSubtotal * discountPercent) / 100;
  const grandTotal = cartSubtotal - discountAmount + shippingFee;

  if (cart.length === 0) {
    return (
      <div className="bg-gray-50/30 pb-16">
        <Breadcrumb items={[{ label: "Shopping Cart" }]} />
        <div className="container-custom pt-12">
          <Empty
            title="Your Shopping Cart is Empty"
            description="You haven't added any fresh biodynamic greens or organic products to your basket yet. Stock up your pantry with nature's best!"
            actionText="Go to Shop"
            onAction={() => navigate("/shop")}
          />
        </div>
      </div>
    );
  }

  return (
    <div id="cart-page" className="bg-gray-50/50 pb-16">
      
      <Breadcrumb items={[{ label: "Shopping Cart" }]} />

      <div className="container-custom pt-8">
        <h1 className="text-2xl font-bold font-display text-gray-900 mb-8 flex items-center space-x-2">
          <ShoppingBag className="w-6 h-6 text-brand-600" />
          <span>My Shopping Basket ({cartCount} items)</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* A. CART ITEMS LIST SECTION */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm">
              <div className="hidden sm:grid grid-cols-12 bg-gray-50/60 px-6 py-3.5 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">
                <div className="col-span-6">Organic Product Details</div>
                <div className="col-span-2 text-center">Unit Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Subtotal</div>
              </div>

              <div className="divide-y divide-gray-100">
                {cart.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 px-6 py-5 items-center">
                    
                    {/* Item details */}
                    <div className="col-span-12 sm:col-span-6 flex items-center space-x-4">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-gray-100 bg-gray-50"
                      />
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-gray-800 truncate hover:text-brand-600 transition-standard">
                          <Link to={`/product/${item.product.id}`}>{item.product.name}</Link>
                        </h4>
                        <p className="text-xs text-gray-400 mt-0.5">Brand: {item.product.brand}</p>
                        <span className="text-[10px] bg-brand-50 text-brand-700 font-bold px-2 py-0.5 rounded font-mono">
                          {item.product.unit}
                        </span>
                      </div>
                    </div>

                    {/* Unit Price */}
                    <div className="col-span-6 sm:col-span-2 text-left sm:text-center text-sm font-semibold text-gray-600 font-mono">
                      <span className="sm:hidden text-xs text-gray-400 mr-2 font-sans font-medium">Price:</span>
                      ${item.product.price.toFixed(2)}
                    </div>

                    {/* Quantity Selector */}
                    <div className="col-span-6 sm:col-span-2 flex justify-start sm:justify-center">
                      <div className="flex items-center border border-gray-200 rounded-lg py-1 px-2.5 bg-gray-50/50">
                        <button
                          disabled={item.quantity <= 1}
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-brand-600 font-bold disabled:opacity-35"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-gray-700 font-mono">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-brand-600 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Line subtotal */}
                    <div className="col-span-12 sm:col-span-2 flex sm:flex-col justify-between sm:justify-center items-center sm:items-end border-t sm:border-0 border-gray-50 pt-3 sm:pt-0">
                      <span className="sm:hidden text-xs text-gray-400 font-sans font-medium">Line Total:</span>
                      <div className="flex items-center space-x-3.5">
                        <span className="text-sm font-bold text-brand-700 font-mono">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-standard shrink-0"
                          title="Remove item"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <button
                onClick={clearCart}
                className="text-xs font-bold text-red-500 hover:text-red-700 uppercase tracking-wider border border-red-200 hover:bg-red-50 py-2.5 px-5 rounded-xl transition-standard w-full sm:w-auto text-center"
              >
                Clear Entire Basket
              </button>
              <Link
                to="/shop"
                className="text-xs font-bold text-brand-600 hover:text-brand-700 uppercase tracking-wider border border-brand-200 hover:bg-brand-50 py-2.5 px-6 rounded-xl transition-standard w-full sm:w-auto text-center"
              >
                Continue Organic Shopping
              </Link>
            </div>

          </div>

          {/* B. CART SUMMARY BOX SECTION */}
          <div className="space-y-6">
            
            {/* Coupon Entry Box */}
            <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="font-semibold text-gray-800 text-sm flex items-center space-x-2">
                <Tag className="w-4 h-4 text-brand-500" />
                <span>Have a Promo Coupon?</span>
              </h3>
              
              {appliedCoupon ? (
                <div className="bg-brand-50 border border-brand-100 rounded-xl p-3 flex justify-between items-center text-xs text-brand-800">
                  <div className="flex items-center space-x-2 font-semibold">
                    <Percent className="w-3.5 h-3.5 text-brand-600" />
                    <span>Coupon: {appliedCoupon} ({discountPercent}%) Applied</span>
                  </div>
                  <button 
                    onClick={handleRemoveCoupon} 
                    className="text-red-500 hover:text-red-700 font-bold uppercase tracking-wider text-[10px] pl-2 border-l border-brand-200"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. ORGANIC15"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs focus:outline-none uppercase"
                  />
                  <button
                    type="submit"
                    className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-4 rounded-xl transition-standard"
                  >
                    Apply
                  </button>
                </form>
              )}
              <div className="text-[10px] text-gray-400 font-medium leading-normal">
                Try codes <strong className="text-brand-600 font-bold">ORGANIC15</strong> (15% off) or <strong className="text-brand-600 font-bold">FRESH20</strong> (20% off) for testing.
              </div>
            </div>

            {/* Calculations Total Summary */}
            <div className="bg-brand-900 text-white rounded-2xl p-6 shadow-md space-y-5">
              <h3 className="font-display font-bold text-base border-b border-brand-850 pb-3">
                Order Financial Summary
              </h3>

              <div className="space-y-2.5 text-xs text-brand-200">
                <div className="flex justify-between">
                  <span>Basket Subtotal</span>
                  <span className="font-mono text-white font-semibold">${cartSubtotal.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-accent-400">
                    <span>Coupon Discount</span>
                    <span className="font-mono font-semibold">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Insulated Delivery Fee</span>
                  {shippingFee === 0 ? (
                    <span className="text-brand-400 font-bold uppercase font-mono">FREE (Saver)</span>
                  ) : (
                    <span className="font-mono text-white font-semibold">${shippingFee.toFixed(2)}</span>
                  )}
                </div>

                {shippingFee > 0 && (
                  <div className="text-[10px] text-brand-400 leading-normal pt-1 bg-brand-850/40 p-2.5 rounded-lg border border-brand-800">
                    Spend <strong className="text-white">$40.00</strong> or more to unlock <strong className="text-brand-500 font-bold">FREE Insulated Same-Day Delivery</strong>!
                  </div>
                )}
              </div>

              <div className="border-t border-brand-850 pt-4 flex justify-between items-center">
                <span className="text-sm font-bold">Grand Total</span>
                <span className="text-xl md:text-2xl font-black text-brand-400 font-mono">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  // Pass coupon code if applied to checkout via state
                  navigate("/checkout", { state: { coupon: appliedCoupon, discountPercent } });
                }}
                className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-brand-950/30 flex items-center justify-center space-x-2 transition-all duration-300"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
