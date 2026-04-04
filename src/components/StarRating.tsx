import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  onRatingChange?: (rating: number) => void;
  size?: number;
  interactive?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  onRatingChange,
  size = 20,
  interactive = false,
}) => {
  return (
    <div className="flex gap-1">
      {[...Array(maxRating)].map((_, i) => {
        const starValue = i + 1;
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => onRatingChange?.(starValue)}
            className={`${interactive ? 'cursor-pointer' : 'cursor-default'} transition-transform hover:scale-110 active:scale-95`}
          >
            <Star
              size={size}
              className={`${
                starValue <= rating
                  ? 'fill-brand text-brand'
                  : 'fill-gray-200 text-gray-200'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};
