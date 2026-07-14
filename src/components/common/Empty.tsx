import React from "react";
import { Inbox } from "lucide-react";

interface EmptyProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const Empty: React.FC<EmptyProps> = ({ title, description, actionText, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-gray-150 rounded-2xl bg-white space-y-4">
      <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center text-brand-500 shadow-inner">
        <Inbox className="w-8 h-8" />
      </div>
      <div className="max-w-md space-y-1">
        <h3 className="font-display font-semibold text-gray-800 text-base">{title}</h3>
        <p className="text-xs text-gray-400 leading-relaxed">{description}</p>
      </div>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold px-6 py-2.5 rounded-full shadow-sm transition-standard hover:scale-102"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
