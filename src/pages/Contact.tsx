import React, { useState } from "react";
import { Breadcrumb } from "../components/common/Breadcrumb";
import { Phone, Mail, MapPin, Send, HelpCircle, Sprout } from "lucide-react";
import { toast } from "react-hot-toast";

export const Contact: React.FC = () => {
  // Contact Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("general");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    // Simulate API delivery
    setTimeout(() => {
      setLoading(false);
      toast.success("Message dispatched! Our orchard support team will reply within 4 hours.");
      setName("");
      setEmail("");
      setSubject("general");
      setMessage("");
    }, 1200);
  };

  return (
    <div id="contact-page" className="bg-gray-50/50 pb-16">
      
      <Breadcrumb items={[{ label: "Support & Contact" }]} />

      <div className="container-custom pt-8">
        
        {/* UPPER HEADLINE */}
        <div className="text-center max-w-xl mx-auto space-y-3 mb-12">
          <HelpCircle className="w-10 h-10 text-brand-650 mx-auto" />
          <h1 className="text-2xl md:text-3xl font-bold font-display text-gray-900">Reach Our Orchards</h1>
          <p className="text-xs text-gray-400">
            Have questions about local crop harvest times, delivery boundaries, cooler bags, or farm cooperatives? We are here to support your organic journey.
          </p>
        </div>

        {/* TWO COLUMN CONTENT: INFO + FORM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* A. CONTACT INFRASTRUCTURE (Col 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-6">
              <h3 className="font-display font-bold text-gray-900 text-sm pb-3 border-b border-gray-100">Contact Details</h3>

              <div className="space-y-5">
                {/* Phone */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
                    <Phone className="w-4.5 h-4.5" />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-gray-800 block mb-0.5">Customer hotline</span>
                    <p className="text-gray-500 font-mono">+1 800-555-GROVE</p>
                    <p className="text-gray-400">Mon - Fri: 7:00 AM - 6:00 PM PST</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
                    <Mail className="w-4.5 h-4.5" />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-gray-800 block mb-0.5">Support Inbox</span>
                    <p className="text-gray-500 font-mono">support@organicgrocery.com</p>
                    <p className="text-gray-400">Dispatched responses within 4 hours.</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-4.5 h-4.5" />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-gray-800 block mb-0.5">PNW Cooperative Orchard</span>
                    <p className="text-gray-500">7700 Willamette River Road</p>
                    <p className="text-gray-400">Portland, Oregon, USA</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Environmental banner */}
            <div className="bg-brand-900 text-white rounded-2xl p-6 space-y-3 shadow-md relative overflow-hidden">
              <div className="relative z-10 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-brand-400 font-mono uppercase text-[9px] font-bold">
                  <Sprout className="w-4 h-4 text-brand-500" />
                  <span>Our Sustainability Pledge</span>
                </div>
                <h4 className="font-bold font-display text-sm">Carbon-Neutral Operations</h4>
                <p className="text-[11px] text-brand-200 leading-normal">
                  Our PNW operations utilize solar-powered washing stations, 100% compostable insulated thermal coolers, and electric-powered city transport to preserve clean air.
                </p>
              </div>
            </div>

          </div>

          {/* B. CONTACT FORM SUBMIT (Col 7) */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-gray-150 rounded-2xl p-6 md:p-8 shadow-sm">
              <h3 className="font-display font-bold text-gray-900 text-sm pb-3 border-b border-gray-100 mb-6">Send an Inquiry</h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-700 uppercase block mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Connor"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-700 uppercase block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. sarah@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-700 uppercase block mb-1">Inquiry Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                  >
                    <option value="general">General Support / Hello</option>
                    <option value="cooperative">Farmer Cooperative Networks</option>
                    <option value="delivery">Chilled Bag Delivery Boundaries</option>
                    <option value="wholesale">Wholesale Organic Accounts</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-700 uppercase block mb-1">Your Message Details *</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe your questions or orders details in depth..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-xs focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-3.5 px-8 rounded-xl flex items-center space-x-2 transition-standard shadow shadow-brand-100 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{loading ? "Dispatched..." : "Submit Inquiry"}</span>
                </button>

              </form>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
