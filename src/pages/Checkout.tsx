import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Breadcrumb } from "../components/common/Breadcrumb";
import { ShieldCheck, Truck, CreditCard, Banknote, MapPin, ClipboardList, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";

export const Checkout: React.FC = () => {
  const { 
    user, 
    cart, 
    cartSubtotal, 
    createOrder, 
    addAddress 
  } = useApp();

  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve coupon details from state if passed from cart
  const incomingCoupon = location.state?.coupon || null;
  const incomingDiscountPercent = location.state?.discountPercent || 0;

  // Selected address state
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  // New Address Form State
  const [newType, setNewType] = useState("Home");
  const [newFullName, setNewFullName] = useState("");
  const [newAddressLine, setNewAddressLine] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newState, setNewState] = useState("");
  const [newZip, setNewZip] = useState("");
  const [newCountry, setNewCountry] = useState("USA");

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<"credit-card" | "paypal" | "cod">("credit-card");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Guard: Redirect if guest
  useEffect(() => {
    if (!user) {
      toast.error("Please login to complete your checkout.");
      navigate("/login?redirect=checkout");
    } else if (cart.length === 0) {
      toast.error("Your shopping cart is empty.");
      navigate("/shop");
    } else if (user.addresses.length > 0) {
      // Auto-select first or default address
      const def = user.addresses.find(a => a.isDefault) || user.addresses[0];
      setSelectedAddressId(def.id);
    } else {
      setShowNewAddressForm(true);
    }
  }, [user, cart, navigate]);

  if (!user || cart.length === 0) return null;

  // Calculations
  const shippingFee = cartSubtotal >= 40 ? 0 : 4.99;
  const discountAmount = (cartSubtotal * incomingDiscountPercent) / 100;
  const grandTotal = cartSubtotal - discountAmount + shippingFee;

  const handleAddNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressLine || !newCity || !newZip) {
      toast.error("Please fill in all address details");
      return;
    }
    await addAddress({
      type: newType,
      fullName: newFullName || user.fullName,
      addressLine: newAddressLine,
      city: newCity,
      state: newState,
      zip: newZip,
      country: newCountry
    });

    // Reset Form
    setShowNewAddressForm(false);
    setNewAddressLine("");
    setNewCity("");
    setNewState("");
    setNewZip("");
  };

  const handlePlaceOrder = async () => {
    const activeAddress = user.addresses.find(a => a.id === selectedAddressId);
    if (!activeAddress) {
      toast.error("Please select a delivery address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderItems = cart.map(item => ({
        id: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price
      }));

      const res = await createOrder({
        shippingAddress: {
          fullName: activeAddress.fullName,
          addressLine: activeAddress.addressLine,
          city: activeAddress.city,
          state: activeAddress.state,
          zip: activeAddress.zip,
          country: activeAddress.country,
          phone: user.phone || "+1 555-123-4567"
        },
        paymentMethod,
        items: orderItems,
        subtotal: cartSubtotal,
        shippingFee,
        discount: discountAmount,
        total: grandTotal
      });

      if (res) {
        // Order successfully created! Redirect to dashboard or detail
        navigate(`/account/orders`, { state: { justPlaced: true, orderId: res.id } });
      }
    } catch (err) {
      toast.error("Failed to place order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="checkout-page" className="bg-gray-50/50 pb-16">
      
      <Breadcrumb items={[{ label: "Shopping Cart", url: "/cart" }, { label: "Secure Checkout" }]} />

      <div className="container-custom pt-8">
        <h1 className="text-2xl font-bold font-display text-gray-900 mb-8 flex items-center space-x-2">
          <ShieldCheck className="text-brand-600 w-6.5 h-6.5" />
          <span>Secure Delivery Checkout</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Shipping & Billing details (Col 7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. SHIPPING ADDRESS */}
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="font-semibold text-gray-850 text-sm flex items-center space-x-2">
                  <MapPin className="w-4.5 h-4.5 text-brand-500" />
                  <span>1. Delivery Address Selection</span>
                </h3>
                {!showNewAddressForm && (
                  <button 
                    onClick={() => setShowNewAddressForm(true)}
                    className="text-xs text-brand-600 hover:text-brand-700 font-bold uppercase tracking-wider"
                  >
                    + Add New
                  </button>
                )}
              </div>

              {showNewAddressForm ? (
                /* Address Add Form */
                <form onSubmit={handleAddNewAddress} className="space-y-4 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-gray-700 uppercase block mb-1">Address Label</label>
                      <select 
                        value={newType} 
                        onChange={(e) => setNewType(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                      >
                        <option value="Home">Home Address</option>
                        <option value="Office">Office / Work</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-700 uppercase block mb-1">Recipient Name</label>
                      <input
                        type="text"
                        placeholder="e.g. John Doe"
                        value={newFullName}
                        onChange={(e) => setNewFullName(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-700 uppercase block mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 123 Green Pastures Blvd"
                      value={newAddressLine}
                      onChange={(e) => setNewAddressLine(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="col-span-2">
                      <label className="text-[10px] font-bold text-gray-700 uppercase block mb-1">City</label>
                      <input
                        type="text"
                        required
                        placeholder="Portland"
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-700 uppercase block mb-1">State</label>
                      <input
                        type="text"
                        placeholder="Oregon"
                        value={newState}
                        onChange={(e) => setNewState(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-700 uppercase block mb-1">Zip Code</label>
                      <input
                        type="text"
                        required
                        placeholder="97201"
                        value={newZip}
                        onChange={(e) => setNewZip(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-2">
                    <button
                      type="submit"
                      className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl"
                    >
                      Save and Use Address
                    </button>
                    {user.addresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowNewAddressForm(false)}
                        className="border border-gray-250 text-gray-600 font-semibold text-xs px-5 py-2.5 rounded-xl hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              ) : (
                /* Address selection cards list */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`border rounded-xl p-4 cursor-pointer relative flex flex-col justify-between hover:bg-gray-50/40 transition-standard ${
                        selectedAddressId === addr.id 
                          ? "border-brand-500 bg-brand-50/10 ring-2 ring-brand-50" 
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="space-y-1.5 text-xs text-gray-500">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-850 uppercase text-[10px] tracking-wide font-mono bg-gray-100 px-2 py-0.5 rounded">
                            {addr.type}
                          </span>
                          {selectedAddressId === addr.id && (
                            <CheckCircle className="w-4 h-4 text-brand-600" />
                          )}
                        </div>
                        <h4 className="font-bold text-gray-800 text-xs mt-1">{addr.fullName}</h4>
                        <p>{addr.addressLine}</p>
                        <p>{addr.city}, {addr.state} {addr.zip}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. PAYMENT METHODS */}
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-5">
              <h3 className="font-semibold text-gray-850 text-sm flex items-center space-x-2 border-b border-gray-100 pb-3">
                <CreditCard className="w-4.5 h-4.5 text-brand-500" />
                <span>2. Secured Payment Selection</span>
              </h3>

              {/* Payment selector tabs */}
              <div className="flex border border-gray-200 rounded-xl overflow-hidden text-xs font-semibold text-gray-500">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("credit-card")}
                  className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 transition-standard ${
                    paymentMethod === "credit-card" ? "bg-brand-600 text-white" : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <CreditCard className="w-4.5 h-4.5" />
                  <span>Credit Card / Debit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("paypal")}
                  className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 transition-standard ${
                    paymentMethod === "paypal" ? "bg-brand-600 text-white" : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <span>PayPal Express</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 transition-standard ${
                    paymentMethod === "cod" ? "bg-brand-600 text-white" : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <Banknote className="w-4.5 h-4.5" />
                  <span>Cash on Delivery</span>
                </button>
              </div>

              {/* Payment form content context */}
              <div className="text-xs text-gray-500 bg-gray-50/50 border border-gray-100 rounded-xl p-4">
                {paymentMethod === "credit-card" && (
                  <div className="space-y-4">
                    <p className="text-[10px] text-brand-600 font-bold tracking-widest uppercase font-mono">Simulated Secure Stripe Portal</p>
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-bold text-gray-700 uppercase block mb-1">Card Number</label>
                        <input
                          type="text"
                          required
                          placeholder="4111 2222 3333 4444"
                          defaultValue="4111 2222 3333 4444"
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-gray-700 uppercase block mb-1">Expiry Date</label>
                          <input
                            type="text"
                            required
                            placeholder="MM / YY"
                            defaultValue="12 / 29"
                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-700 uppercase block mb-1">Security Code (CVC)</label>
                          <input
                            type="text"
                            required
                            placeholder="123"
                            defaultValue="123"
                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "paypal" && (
                  <div className="space-y-2 text-center py-4">
                    <CheckCircle className="w-8 h-8 text-brand-500 mx-auto mb-2" />
                    <p className="font-bold text-gray-800 text-xs">PayPal Express Checkout Active</p>
                    <p className="text-[10px] text-gray-400">You will be redirected temporarily to PayPal's secure overlay on confirmation.</p>
                  </div>
                )}

                {paymentMethod === "cod" && (
                  <div className="space-y-2 text-center py-4">
                    <Banknote className="w-8 h-8 text-brand-500 mx-auto mb-2" />
                    <p className="font-bold text-gray-800 text-xs">Cash/Card on Delivery Accepted</p>
                    <p className="text-[10px] text-gray-400">Pay using cash or mobile POS terminal once our carbon-neutral delivery van reaches your door.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Order summary & CTA (Col 5) */}
          <div className="lg:col-span-5">
            
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-6">
              <h3 className="font-semibold text-gray-850 text-sm flex items-center space-x-2 border-b border-gray-100 pb-3">
                <ClipboardList className="w-4.5 h-4.5 text-brand-500" />
                <span>3. Order Items Breakdown</span>
              </h3>

              {/* Items List */}
              <div className="divide-y divide-gray-550 max-h-56 overflow-y-auto pr-2 space-y-3.5">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs py-2 first:pt-0">
                    <div className="flex items-center space-x-3 min-w-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-lg object-cover shrink-0 border border-gray-100"
                      />
                      <div className="min-w-0">
                        <h4 className="font-semibold text-gray-800 truncate">{item.product.name}</h4>
                        <p className="text-[10px] text-gray-400">Qty: {item.quantity} × ${item.product.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <span className="font-mono text-gray-700 font-bold shrink-0">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial Calculation box */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4.5 space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Basket Subtotal</span>
                  <span className="font-mono font-bold text-gray-800">${cartSubtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-brand-600">
                    <span>Coupon Discount {incomingCoupon ? `(${incomingCoupon})` : ""}</span>
                    <span className="font-mono font-bold">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Insulated Delivery</span>
                  {shippingFee === 0 ? (
                    <span className="text-brand-600 font-bold uppercase">FREE</span>
                  ) : (
                    <span className="font-mono font-bold text-gray-800">${shippingFee.toFixed(2)}</span>
                  )}
                </div>
                <div className="border-t border-gray-200 pt-3 mt-1 flex justify-between text-sm font-bold text-gray-900">
                  <span>Grand Total Payable</span>
                  <span className="text-brand-700 font-mono text-base">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Secure checkout promise banner */}
              <div className="flex items-start space-x-2 bg-brand-50/40 border border-brand-100 p-3 rounded-xl text-[10px] text-brand-850">
                <Truck className="w-4.5 h-4.5 text-brand-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Your fresh harvest is secured. It will be hand-selected inside chilled coolers and dispatched for standard carbon-neutral PNW delivery.
                </p>
              </div>

              {/* Place Order Button */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handlePlaceOrder}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-xl shadow-md shadow-brand-100 transition-standard flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{isSubmitting ? "Securing and placing..." : "Confirm & Place Organic Order"}</span>
              </button>

            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
