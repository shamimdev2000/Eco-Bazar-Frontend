import React from "react";
import { Phone, MapPin, Globe, HelpCircle } from "lucide-react";

export const Topbar: React.FC = () => {
  return (
    <div id="top-bar" className="bg-brand-600 text-white text-[11px] py-2 hidden md:block border-b border-brand-700/50">
      <div className="container-custom flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-1.5 text-brand-50/90">
            <MapPin className="w-3.5 h-3.5 text-brand-100" />
            <span>Store Location: <strong className="text-white">123 Greenway, CA</strong></span>
          </div>
          <div className="flex items-center space-x-1.5 text-brand-50/90">
            <Phone className="w-3.5 h-3.5 text-brand-100" />
            <span>Free Express Shipping on Orders Over $50</span>
          </div>
        </div>

        <div className="flex items-center space-x-5 text-brand-50/90">
          <div className="flex items-center space-x-1 cursor-pointer hover:text-white transition-standard">
            <Globe className="w-3.5 h-3.5 text-brand-100" />
            <span>English / USD</span>
          </div>
          <div className="h-3 w-[1px] bg-brand-700/50" />
          <div className="flex items-center space-x-4">
            <a href="#help" className="hover:text-white transition-standard">Help Center</a>
          </div>
        </div>
      </div>
    </div>
  );
};
