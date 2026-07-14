import React from "react";
import { Star, StarHalf } from "lucide-react";

interface RatingProps {
  rating: number;
  reviewsCount?: number;
  size?: number;
}

export const Rating: React.FC<RatingProps> = ({ rating, reviewsCount, size = 14 }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.4;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center space-x-1">
      <div className="flex items-center text-amber-500">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} size={size} fill="currentColor" strokeWidth={0} />
        ))}
        {hasHalfStar && <StarHalf size={size} fill="currentColor" strokeWidth={0} />}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} size={size} className="text-gray-200" strokeWidth={2} />
        ))}
      </div>
      {reviewsCount !== undefined && (
        <span className="text-xs text-gray-400 font-mono font-medium pl-1">({reviewsCount})</span>
      )}
    </div>
  );
};
