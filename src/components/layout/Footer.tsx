import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, CheckCircle, Leaf, Facebook, Twitter, Instagram, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    
    // Simulate API newsletter signup
    toast.success("Successfully subscribed to the Ecobazar newsletter!");
    setNewsletterEmail("");
  };

  return (
    <footer id="main-footer" className="bg-brand-900 text-gray-300 pt-16 pb-8 border-t border-brand-850">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 border-b border-brand-850 pb-12 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Leaf className="w-8 h-8 text-brand-500 fill-brand-500/10" />
              <span className="text-xl font-bold font-display text-white tracking-tight">Ecobazar</span>
            </Link>
            <p className="text-xs text-brand-200 leading-relaxed max-w-sm">
              We deliver certified organic fruits, fresh farm vegetables, raw honey, pasture milk, and natural superfoods directly from biodynamic farms to your doorstep. Grown with pure love, zero chemicals.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-brand-800 hover:bg-brand-600 flex items-center justify-center text-white transition-standard">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-brand-800 hover:bg-brand-600 flex items-center justify-center text-white transition-standard">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-brand-800 hover:bg-brand-600 flex items-center justify-center text-white transition-standard">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-white text-sm tracking-wider uppercase mb-5">Quick Store Links</h4>
            <ul className="space-y-3.5 text-xs text-brand-200">
              <li><Link to="/shop" className="hover:text-white transition-standard">Shop All Organic Goods</Link></li>
              <li><Link to="/compare" className="hover:text-white transition-standard">Product Comparison</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition-standard">My Personal Wishlist</Link></li>
              <li><Link to="/about" className="hover:text-white transition-standard">Our Organic Heritage</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-standard">Health & Vitality Blogs</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-standard">FAQs & Support Center</Link></li>
            </ul>
          </div>

          {/* Help & Contact */}
          <div>
            <h4 className="font-display font-semibold text-white text-sm tracking-wider uppercase mb-5">Contact Details</h4>
            <ul className="space-y-4 text-xs text-brand-200">
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                <span>123 Green Pastures Way, Portland, Oregon, 97201, USA</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-brand-500 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-brand-500 shrink-0" />
                <span>support@organico.store</span>
              </li>
              <li className="flex items-center space-x-3">
                <ShieldCheck className="w-4 h-4 text-brand-500 shrink-0" />
                <span>Certified Biodynamic USDA Organic</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div>
            <h4 className="font-display font-semibold text-white text-sm tracking-wider uppercase mb-5">Newsletter & Promos</h4>
            <p className="text-xs text-brand-200 leading-relaxed mb-4">
              Get 15% off your very first delivery. Subscribe for seasonal recipes and biodynamic orchard announcements.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full bg-brand-850 border border-brand-700 text-white rounded-xl py-2.5 pl-4 pr-10 text-xs focus:outline-none focus:border-brand-500"
                />
                <button type="submit" className="absolute right-3 top-2.5 text-brand-400 hover:text-brand-500">
                  <Mail className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center space-x-1.5 text-[10px] text-brand-300">
                <CheckCircle className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                <span>No spam. Unsubscribe any single click.</span>
              </div>
            </form>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-brand-300">
          <p>© 2026 Ecobazar Inc. All rights reserved. Grown with pure love in Pacific Northwest.</p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <span className="hover:text-white cursor-pointer transition-standard">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer transition-standard">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer transition-standard">Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
