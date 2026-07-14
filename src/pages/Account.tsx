import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Breadcrumb } from "../components/common/Breadcrumb";
import { 
  User, 
  MapPin, 
  ShoppingBag, 
  LogOut, 
  LayoutDashboard, 
  Lock, 
  Calendar, 
  CheckCircle, 
  Eye, 
  Plus, 
  Trash2,
  Phone,
  Mail,
  ShieldCheck,
  Building
} from "lucide-react";
import { toast } from "react-hot-toast";

export const Account: React.FC = () => {
  const { 
    user, 
    logout, 
    orders, 
    fetchOrders, 
    updateProfile, 
    addAddress, 
    deleteAddress 
  } = useApp();

  const navigate = useNavigate();

  // Selected tab state
  const [activeTab, setActiveTab] = useState<"dashboard" | "profile" | "addresses" | "orders">("dashboard");

  // Selected order details overlay
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any | null>(null);

  // Profile Form States
  const [profName, setProfName] = useState("");
  const [profPhone, setProfPhone] = useState("");
  const [profEmail, setProfEmail] = useState("");
  const [profPass, setProfPass] = useState("••••••••");

  // Address Form States
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addrType, setAddrType] = useState("Home");
  const [addrFullName, setAddrFullName] = useState("");
  const [addrLine, setAddrLine] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrState, setAddrState] = useState("");
  const [addrZip, setAddrZip] = useState("");
  const [addrCountry, setAddrCountry] = useState("USA");

  // Guard: Redirect if guest
  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=account");
    } else {
      setProfName(user.fullName);
      setProfPhone(user.phone || "");
      setProfEmail(user.email);
      fetchOrders();
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleUpdateProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profName.trim() || !profEmail.trim()) {
      toast.error("Full Name and Email are required");
      return;
    }
    await updateProfile({
      fullName: profName.trim(),
      phone: profPhone.trim(),
      email: profEmail.trim()
    });
  };

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrLine || !addrCity || !addrZip) {
      toast.error("Street, City, and Zip code are required");
      return;
    }
    await addAddress({
      type: addrType,
      fullName: addrFullName || user.fullName,
      addressLine: addrLine,
      city: addrCity,
      state: addrState,
      zip: addrZip,
      country: addrCountry
    });

    // Reset Form
    setShowAddAddress(false);
    setAddrLine("");
    setAddrCity("");
    setAddrState("");
    setAddrZip("");
  };

  return (
    <div id="account-page" className="bg-gray-50/50 pb-16">
      
      <Breadcrumb items={[{ label: "My Account" }]} />

      <div className="container-custom pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* A. ACCOUNT DASHBOARD NAVIGATION SIDEBAR (Col 3) */}
          <aside className="lg:col-span-3 bg-white border border-gray-150 rounded-2xl p-5 shadow-sm space-y-6">
            
            {/* Brief User Avatar */}
            <div className="flex items-center space-x-3.5 pb-4 border-b border-gray-100">
              <div className="w-11 h-11 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-base font-display">
                {user.fullName.charAt(0)}
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-gray-800 text-sm truncate">{user.fullName}</h4>
                <p className="text-[10px] text-gray-450 truncate">{user.email}</p>
              </div>
            </div>

            {/* Sidebar menu items */}
            <nav className="flex flex-col space-y-1 text-xs font-semibold text-gray-600">
              
              <button
                onClick={() => { setActiveTab("dashboard"); setSelectedOrderDetails(null); }}
                className={`flex items-center space-x-3 py-2.5 px-4 rounded-xl transition-standard ${
                  activeTab === "dashboard" ? "bg-brand-50 text-brand-700 font-bold" : "hover:bg-gray-50"
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-brand-500" />
                <span>Account Dashboard</span>
              </button>

              <button
                onClick={() => { setActiveTab("profile"); setSelectedOrderDetails(null); }}
                className={`flex items-center space-x-3 py-2.5 px-4 rounded-xl transition-standard ${
                  activeTab === "profile" ? "bg-brand-50 text-brand-700 font-bold" : "hover:bg-gray-50"
                }`}
              >
                <User className="w-4 h-4 text-brand-500" />
                <span>Edit Profile Details</span>
              </button>

              <button
                onClick={() => { setActiveTab("addresses"); setSelectedOrderDetails(null); }}
                className={`flex items-center space-x-3 py-2.5 px-4 rounded-xl transition-standard ${
                  activeTab === "addresses" ? "bg-brand-50 text-brand-700 font-bold" : "hover:bg-gray-50"
                }`}
              >
                <MapPin className="w-4 h-4 text-brand-500" />
                <span>Manage Addresses</span>
              </button>

              <button
                onClick={() => { setActiveTab("orders"); setSelectedOrderDetails(null); }}
                className={`flex items-center space-x-3 py-2.5 px-4 rounded-xl transition-standard ${
                  activeTab === "orders" ? "bg-brand-50 text-brand-700 font-bold" : "hover:bg-gray-50"
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-brand-500" />
                <span>Order History ({orders.length})</span>
              </button>

              <button
                onClick={logout}
                className="flex items-center space-x-3 py-2.5 px-4 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-700 transition-standard border-t border-gray-50 mt-2 pt-3"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out Account</span>
              </button>

            </nav>

          </aside>

          {/* B. ACCOUNT CONTENT AREA (Col 9) */}
          <main className="lg:col-span-9 bg-white border border-gray-150 rounded-2xl p-6 md:p-8 shadow-sm min-h-[420px]">
            
            {/* VIEW A: DASHBOARD VIEW */}
            {activeTab === "dashboard" && (
              <div className="space-y-8">
                
                {/* Dashboard Welcome Card */}
                <div className="bg-gradient-to-br from-brand-900 to-brand-800 text-white rounded-2xl p-6 md:p-8 relative overflow-hidden">
                  <div className="relative z-10 max-w-lg space-y-2">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-brand-400 font-mono">Organic Pantry Customer</span>
                    <h2 className="text-xl md:text-2xl font-bold font-display">Welcome back, {user.fullName}!</h2>
                    <p className="text-xs text-brand-200 leading-relaxed">
                      Manage your carbon-neutral deliveries, edit billing details, or track your organic harvests in transit. Sourced clean, eaten pure.
                    </p>
                  </div>
                </div>

                {/* Grid stats overview */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  
                  <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-4 flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-650 flex items-center justify-center shrink-0">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 font-mono">Total Orders</p>
                      <h4 className="text-base font-black text-gray-800 font-mono">{orders.length}</h4>
                    </div>
                  </div>

                  <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-4 flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-650 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 font-mono">Addresses</p>
                      <h4 className="text-base font-black text-gray-800 font-mono">{user.addresses.length} Saved</h4>
                    </div>
                  </div>

                  <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-4 flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-650 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 font-mono">USDA Bio-Status</p>
                      <h4 className="text-xs font-bold text-brand-650 uppercase">Verified Safe</h4>
                    </div>
                  </div>

                </div>

                {/* Brief order block summary */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <h3 className="font-bold text-gray-850 text-sm">Recent Harvest Shipments</h3>
                    <button 
                      onClick={() => setActiveTab("orders")}
                      className="text-xs text-brand-600 hover:text-brand-700 font-bold"
                    >
                      View All Orders
                    </button>
                  </div>
                  {orders.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No recent orders on file.</p>
                  ) : (
                    <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100 text-xs">
                      {orders.slice(0, 2).map((ord) => (
                        <div key={ord.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white hover:bg-gray-50/40">
                          <div className="space-y-0.5">
                            <span className="font-mono text-gray-800 font-bold">{ord.id}</span>
                            <p className="text-[10px] text-gray-400">Order date: {ord.date}</p>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[9px] tracking-wider font-mono ${
                            ord.status === "Delivered" ? "bg-brand-50 text-brand-700" : "bg-amber-50 text-amber-600"
                          }`}>
                            {ord.status}
                          </span>
                          <span className="font-mono font-bold text-brand-700">${ord.total.toFixed(2)}</span>
                          <button
                            onClick={() => { setSelectedOrderDetails(ord); setActiveTab("orders"); }}
                            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center space-x-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* VIEW B: EDIT PROFILE VIEW */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="border-b border-gray-100 pb-3">
                  <h3 className="font-display font-bold text-gray-900 text-base">Edit Account Credentials</h3>
                  <p className="text-xs text-gray-400 mt-1">Configure your personal contact numbers and primary shipping email.</p>
                </div>

                <form onSubmit={handleUpdateProfileSubmit} className="space-y-4 max-w-xl">
                  <div>
                    <label className="text-[10px] font-bold text-gray-700 uppercase block mb-1">Full Customer Name</label>
                    <input
                      type="text"
                      required
                      value={profName}
                      onChange={(e) => setProfName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-gray-700 uppercase block mb-1">Contact Phone</label>
                      <input
                        type="tel"
                        value={profPhone}
                        onChange={(e) => setProfPhone(e.target.value)}
                        placeholder="e.g. +1 555-123-4567"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-brand-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-700 uppercase block mb-1">Account Email</label>
                      <input
                        type="email"
                        required
                        value={profEmail}
                        onChange={(e) => setProfEmail(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-700 uppercase block mb-1">Update Password</label>
                    <input
                      type="password"
                      value={profPass}
                      onChange={(e) => setProfPass(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl transition-standard shadow-sm shadow-brand-100"
                  >
                    Save profile settings
                  </button>
                </form>
              </div>
            )}

            {/* VIEW C: ADDRESSES MANAGER */}
            {activeTab === "addresses" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="font-display font-bold text-gray-900 text-base">Registered Addresses</h3>
                    <p className="text-xs text-gray-400 mt-1">Manage physical locations for fresh food dispatch.</p>
                  </div>
                  {!showAddAddress && (
                    <button
                      onClick={() => setShowAddAddress(true)}
                      className="bg-brand-100 hover:bg-brand-200 text-brand-700 font-bold text-xs py-2 px-4 rounded-xl flex items-center space-x-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New</span>
                    </button>
                  )}
                </div>

                {showAddAddress ? (
                  /* Add Form */
                  <form onSubmit={handleCreateAddress} className="space-y-4 max-w-xl">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-700 uppercase block mb-1">Address Label</label>
                        <select
                          value={addrType}
                          onChange={(e) => setAddrType(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                        >
                          <option value="Home">Home Address</option>
                          <option value="Office">Office / Work</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-700 uppercase block mb-1">Full Name</label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          value={addrFullName}
                          onChange={(e) => setAddrFullName(e.target.value)}
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
                        value={addrLine}
                        onChange={(e) => setAddrLine(e.target.value)}
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
                          value={addrCity}
                          onChange={(e) => setAddrCity(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-700 uppercase block mb-1">State</label>
                        <input
                          type="text"
                          placeholder="OR"
                          value={addrState}
                          onChange={(e) => setAddrState(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-700 uppercase block mb-1">Zip Code</label>
                        <input
                          type="text"
                          required
                          placeholder="97201"
                          value={addrZip}
                          onChange={(e) => setAddrZip(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-3 pt-2">
                      <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl">
                        Save address location
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setShowAddAddress(false)}
                        className="border border-gray-250 text-gray-600 font-semibold text-xs py-2.5 px-5 rounded-xl hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  /* List of Cards */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {user.addresses.map((addr) => (
                      <div key={addr.id} className="border border-gray-150 rounded-xl p-4.5 bg-white relative hover:bg-gray-50/20 flex flex-col justify-between">
                        <button
                          onClick={() => deleteAddress(addr.id)}
                          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-standard"
                          title="Delete Address"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="space-y-1.5 text-xs text-gray-500 pr-8">
                          <span className="font-bold text-gray-800 uppercase text-[9px] tracking-wide font-mono bg-gray-100 px-2 py-0.5 rounded inline-block">
                            {addr.type}
                          </span>
                          <h4 className="font-bold text-gray-850 text-xs mt-2">{addr.fullName}</h4>
                          <p>{addr.addressLine}</p>
                          <p>{addr.city}, {addr.state} {addr.zip}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* VIEW D: ORDERS HISTORY */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                
                {selectedOrderDetails ? (
                  /* Specific Order Details Overlay Sheet */
                  <div className="space-y-6">
                    <button
                      onClick={() => setSelectedOrderDetails(null)}
                      className="text-xs text-brand-600 hover:text-brand-700 font-bold mb-4 flex items-center space-x-1"
                    >
                      <span>← Back to order lists</span>
                    </button>

                    <div className="border border-gray-150 rounded-2xl p-6 bg-white shadow-sm space-y-6">
                      
                      <div className="flex flex-col sm:flex-row justify-between border-b border-gray-100 pb-4 text-xs gap-3">
                        <div>
                          <h4 className="font-bold text-gray-800 text-sm font-mono">Invoice: {selectedOrderDetails.id}</h4>
                          <p className="text-[10px] text-gray-400 mt-0.5">Purchased on: {selectedOrderDetails.date}</p>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase font-mono tracking-wider self-start sm:self-center ${
                          selectedOrderDetails.status === "Delivered" ? "bg-brand-50 text-brand-700" : "bg-amber-50 text-amber-600"
                        }`}>
                          {selectedOrderDetails.status}
                        </span>
                      </div>

                      {/* Items breakdown list */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono">Basket ledger items</h4>
                        <div className="divide-y divide-gray-100 text-xs">
                          {selectedOrderDetails.items.map((item: any, idx: number) => (
                            <div key={idx} className="py-2.5 flex justify-between items-center">
                              <div className="min-w-0">
                                <span className="font-semibold text-gray-800 block truncate">{item.name}</span>
                                <span className="text-[10px] text-gray-400">Qty {item.quantity} × ${item.price.toFixed(2)}</span>
                              </div>
                              <span className="font-mono font-bold text-gray-750">${(item.quantity * item.price).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Financial summary calculations */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-5 text-xs text-gray-500">
                        <div className="space-y-1 bg-gray-50 p-4 rounded-xl">
                          <p className="font-bold text-gray-800 text-xs mb-1.5 flex items-center space-x-1.5">
                            <MapPin className="w-3.5 h-3.5 text-brand-650" />
                            <span>Delivery Address</span>
                          </p>
                          <p className="font-bold text-gray-800">{selectedOrderDetails.shippingAddress.fullName}</p>
                          <p>{selectedOrderDetails.shippingAddress.addressLine}</p>
                          <p>{selectedOrderDetails.shippingAddress.city}, {selectedOrderDetails.shippingAddress.state} {selectedOrderDetails.shippingAddress.zip}</p>
                        </div>

                        <div className="space-y-2 bg-gray-50 p-4 rounded-xl">
                          <div className="flex justify-between">
                            <span>Shipping Fee</span>
                            <span className="font-mono text-gray-700">{selectedOrderDetails.shippingFee === 0 ? "FREE" : `$${selectedOrderDetails.shippingFee.toFixed(2)}`}</span>
                          </div>
                          {selectedOrderDetails.discount > 0 && (
                            <div className="flex justify-between text-brand-600">
                              <span>Promo Discount</span>
                              <span className="font-mono">-${selectedOrderDetails.discount.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-800 text-sm">
                            <span>Paid Total</span>
                            <span className="text-brand-700 font-mono">${selectedOrderDetails.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                ) : (
                  /* Order list view */
                  <div className="space-y-4">
                    <div className="border-b border-gray-100 pb-3">
                      <h3 className="font-display font-bold text-gray-900 text-base">Order History History</h3>
                      <p className="text-xs text-gray-400 mt-1">Review active delivery timeline parameters or check invoices.</p>
                    </div>

                    {orders.length === 0 ? (
                      <p className="text-xs text-gray-400 italic py-6">You haven't placed any organic orders yet!</p>
                    ) : (
                      <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-100 text-xs">
                        {orders.map((ord) => (
                          <div key={ord.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white hover:bg-gray-50/30">
                            <div className="space-y-0.5">
                              <span className="font-mono text-gray-800 font-bold">{ord.id}</span>
                              <p className="text-[10px] text-gray-400">Date: {ord.date}</p>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[9px] tracking-wider font-mono ${
                              ord.status === "Delivered" ? "bg-brand-50 text-brand-700" : "bg-amber-50 text-amber-600"
                            }`}>
                              {ord.status}
                            </span>
                            <span className="font-mono font-bold text-brand-700">${ord.total.toFixed(2)}</span>
                            <button
                              onClick={() => setSelectedOrderDetails(ord)}
                              className="bg-brand-100 text-brand-700 hover:bg-brand-600 hover:text-white font-bold py-1.5 px-3.5 rounded-lg transition-standard"
                            >
                              View Invoice details
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}

          </main>

        </div>
      </div>

    </div>
  );
};
