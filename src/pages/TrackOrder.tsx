import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ordersApi } from "../services/api";
import { Order } from "../types";
import { Breadcrumb } from "../components/common/Breadcrumb";
import { ClipboardList, Search, Truck, MapPin, PackageCheck, Calendar, Clock } from "lucide-react";
import { toast } from "react-hot-toast";

export const TrackOrder: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get("id") || "";

  // State
  const [orderId, setOrderId] = useState(initialId);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleTrack = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const queryId = orderId.trim().toUpperCase();
    if (!queryId) {
      toast.error("Please enter an order reference number.");
      return;
    }

    setLoading(true);
    setHasSearched(true);
    setOrder(null);
    setSearchParams({ id: queryId });

    try {
      const res = await ordersApi.getById(queryId);
      setOrder(res);
      toast.success("Order located successfully!");
    } catch (err) {
      toast.error("Order not found. Check ID and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Run automatically if order ID passed in search parameters on mount
  React.useEffect(() => {
    if (initialId) {
      handleTrack();
    }
  }, [initialId]);

  // Status mapping to timeline integers
  const getStatusStep = (status: string) => {
    if (status === "Placed") return 1;
    if (status === "In Transit") return 3;
    if (status === "Delivered") return 4;
    return 1;
  };

  const activeStep = order ? getStatusStep(order.status) : 0;

  return (
    <div id="track-order-page" className="bg-gray-50/50 pb-16">
      
      <Breadcrumb items={[{ label: "Track My Order" }]} />

      <div className="container-custom pt-8 max-w-4xl">
        
        {/* HEADING AND INPUT */}
        <div className="bg-white border border-gray-150 rounded-2xl p-6 md:p-8 shadow-sm space-y-6 mb-8 text-center">
          <div className="max-w-md mx-auto space-y-2">
            <ClipboardList className="w-10 h-10 text-brand-650 mx-auto" />
            <h1 className="text-xl md:text-2xl font-bold font-display text-gray-900">Track Organic Delivery</h1>
            <p className="text-xs text-gray-400">
              Enter your unique order tracking code (e.g. <strong className="text-brand-600 font-mono font-semibold">ORD-9281-A</strong>) to view live harvesting, packaging, and dispatch timelines.
            </p>
          </div>

          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <div className="relative flex-1">
              <input
                type="text"
                required
                placeholder="Enter Order ID..."
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-4 pr-10 text-xs focus:outline-none uppercase font-mono font-semibold"
              />
              <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-3.5 px-8 rounded-xl shrink-0 transition-standard disabled:opacity-50"
            >
              {loading ? "Locating..." : "Locate Delivery"}
            </button>
          </form>
        </div>

        {/* LOADING INDICATOR */}
        {loading && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-150 p-6 shadow-sm">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-gray-400 font-mono">Retrieving database tracking params...</p>
          </div>
        )}

        {/* SEARCH NOT FOUND STATE */}
        {hasSearched && !loading && !order && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-150 p-8 shadow-sm space-y-3.5">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="font-bold text-gray-800 text-sm">Order Reference Not Found</h3>
              <p className="text-xs text-gray-450 leading-relaxed">
                We couldn't locate an order matching that specific ID in our records. Please verify your email receipt or navigate to your account dashboard to check your order reference.
              </p>
            </div>
          </div>
        )}

        {/* DISPLAY TRACKING TIMELINE */}
        {order && !loading && (
          <div className="bg-white border border-gray-150 rounded-2xl p-6 md:p-8 shadow-sm space-y-10">
            
            {/* Header info metrics */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-100 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-brand-600 tracking-wider font-mono">Live Tracking Active</span>
                <h3 className="font-bold text-gray-800 font-mono text-sm">Order Ref: {order.id}</h3>
              </div>
              <div className="flex items-center space-x-6 text-gray-500 font-medium">
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4 text-brand-500" />
                  <span>Placed on: <strong className="text-gray-700 font-mono">{order.date}</strong></span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-brand-500" />
                  <span>Status: <strong className="text-brand-650">{order.status}</strong></span>
                </div>
              </div>
            </div>

            {/* LIVE VISUAL TIMELINE STRIP */}
            <div>
              <div className="relative">
                {/* Connector Line behind steps */}
                <div className="absolute top-4.5 left-6 right-6 h-[3px] bg-gray-100 z-0 hidden sm:block">
                  <div 
                    className="h-full bg-brand-500 transition-all duration-1000"
                    style={{ width: `${((activeStep - 1) / 3) * 100}%` }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 relative z-10 text-center">
                  
                  {/* Step 1: Placed */}
                  <div className="flex sm:flex-col items-center sm:items-center space-x-4 sm:space-x-0">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs font-mono shadow-sm transition-standard ${
                      activeStep >= 1 ? "bg-brand-600 text-white" : "bg-white border-2 border-gray-250 text-gray-400"
                    }`}>
                      1
                    </div>
                    <div className="text-left sm:text-center mt-0 sm:mt-3.5 space-y-0.5">
                      <h4 className="font-bold text-gray-850 text-xs">Order Confirmed</h4>
                      <p className="text-[10px] text-gray-400 leading-normal">Orchard network notified.</p>
                    </div>
                  </div>

                  {/* Step 2: Packaging */}
                  <div className="flex sm:flex-col items-center sm:items-center space-x-4 sm:space-x-0">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs font-mono shadow-sm transition-standard ${
                      activeStep >= 2 || activeStep >= 3 ? "bg-brand-600 text-white" : "bg-white border-2 border-gray-250 text-gray-400"
                    }`}>
                      2
                    </div>
                    <div className="text-left sm:text-center mt-0 sm:mt-3.5 space-y-0.5">
                      <h4 className="font-bold text-gray-850 text-xs">Eco-Chilled Packing</h4>
                      <p className="text-[10px] text-gray-400 leading-normal">Packaged inside insulated coolers.</p>
                    </div>
                  </div>

                  {/* Step 3: In Transit */}
                  <div className="flex sm:flex-col items-center sm:items-center space-x-4 sm:space-x-0">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs font-mono shadow-sm transition-standard ${
                      activeStep >= 3 ? "bg-brand-600 text-white" : "bg-white border-2 border-gray-250 text-gray-400"
                    }`}>
                      3
                    </div>
                    <div className="text-left sm:text-center mt-0 sm:mt-3.5 space-y-0.5">
                      <h4 className="font-bold text-gray-850 text-xs">Dispatched Transit</h4>
                      <p className="text-[10px] text-gray-400 leading-normal">Clean EV delivery van enroute.</p>
                    </div>
                  </div>

                  {/* Step 4: Delivered */}
                  <div className="flex sm:flex-col items-center sm:items-center space-x-4 sm:space-x-0">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs font-mono shadow-sm transition-standard ${
                      activeStep >= 4 ? "bg-brand-600 text-white" : "bg-white border-2 border-gray-250 text-gray-400"
                    }`}>
                      4
                    </div>
                    <div className="text-left sm:text-center mt-0 sm:mt-3.5 space-y-0.5">
                      <h4 className="font-bold text-gray-850 text-xs">Hand Delivered</h4>
                      <p className="text-[10px] text-gray-400 leading-normal">Safely resting on your porch.</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* FOOTER DETAIL BLOCK */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-100 text-xs text-gray-500">
              
              {/* Delivery info */}
              <div className="space-y-3">
                <h4 className="font-bold text-gray-800 text-xs flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-brand-500" />
                  <span>Porch Delivery Coordinates</span>
                </h4>
                <div className="bg-gray-50 p-4 rounded-xl space-y-1 text-xs">
                  <p className="font-bold text-gray-800">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.addressLine}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                  <p className="text-gray-400 pt-1 border-t border-gray-150 mt-1.5 font-mono">Phone: {order.shippingAddress.phone}</p>
                </div>
              </div>

              {/* Items Summary list */}
              <div className="space-y-3">
                <h4 className="font-bold text-gray-800 text-xs flex items-center space-x-2">
                  <PackageCheck className="w-4 h-4 text-brand-500" />
                  <span>Chilled cooler basket contents</span>
                </h4>
                <div className="bg-gray-50 p-4 rounded-xl space-y-2 max-h-36 overflow-y-auto">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="font-medium text-gray-700 truncate max-w-[200px]">{item.name}</span>
                      <span className="font-mono text-gray-400 shrink-0">Qty {item.quantity}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-800">
                    <span>Grand Total Invoice</span>
                    <span className="font-mono text-brand-700">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};
