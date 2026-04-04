import React, { useState, useEffect } from 'react';
import { getReviews } from '../lib/api';
import { ReviewList } from './ReviewList';
import { ReviewForm } from './ReviewForm';

interface ReviewSectionProps {
  productId: string | number;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getReviews(productId);
      setReviews(response.data);
    } catch (err: any) {
      // Log for developer context but don't show a scary error to the user
      console.warn('Backend unreachable, switching to Demo Mode:', err.message);
      
      // Fallback to mock data for demo purposes in AIS preview if API fails (Network Error)
      const mockReviews = [
        { id: 1, user: { name: 'Chibueze' }, rating: 5, comment: 'Excellent quality! The leather is genuine and the stitching is perfect.', created_at: new Date().toISOString() },
        { id: 2, user: { name: 'Adaora' }, rating: 4, comment: 'Beautiful bag, but the strap is a bit long for me. Still love it!', created_at: new Date().toISOString() },
        { id: 3, user: { name: 'Tunde' }, rating: 5, comment: 'Proudly Nigerian! The craftsmanship is top-notch.', created_at: new Date().toISOString() },
      ];
      setReviews(mockReviews);
      setError('Demo Mode'); // Subtle indicator
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const handleReviewSubmitted = (newReview: any) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-16">
      <div className="lg:col-span-2 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
          <div className="flex items-center gap-2">
            {error === 'Demo Mode' && (
              <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                Demo Mode
              </span>
            )}
            <div className="bg-brand/10 text-brand px-3 py-1 rounded-full text-sm font-medium">
              {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
            </div>
          </div>
        </div>
        <ReviewList reviews={reviews} isLoading={isLoading} />
      </div>
      
      <div className="lg:col-span-1">
        <div className="sticky top-24">
          <ReviewForm productId={productId} onReviewSubmitted={handleReviewSubmitted} />
        </div>
      </div>
    </div>
  );
};
