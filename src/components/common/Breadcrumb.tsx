import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  url?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="bg-brand-50/50 border-b border-brand-100 py-3.5 text-xs text-gray-500">
      <div className="container-custom flex items-center space-x-2">
        <Link to="/" className="flex items-center space-x-1 hover:text-brand-600 transition-standard">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        {items.map((item, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3 h-3 text-gray-300" />
            {item.url ? (
              <Link to={item.url} className="hover:text-brand-600 transition-standard">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-800 font-medium truncate max-w-[200px] sm:max-w-none">{item.label}</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};
