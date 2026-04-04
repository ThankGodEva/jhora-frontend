import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { postReview } from '../lib/api';
import { StarRating } from './StarRating';

interface ReviewFormProps {
  productId: string | number;
  onReviewSubmitted: (newReview: any) => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ productId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (comment.length < 5) {
      toast.error('Comment must be at least 5 characters long');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await postReview(productId, { rating, comment });
      toast.success('Review submitted successfully!');
      setComment('');
      setRating(5);
      onReviewSubmitted(response.data);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to submit review. Please log in.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Write a Review</h3>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Rating</label>
        <StarRating 
          rating={rating} 
          interactive 
          onRatingChange={setRating} 
          size={24} 
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="comment" className="text-sm font-medium text-gray-700">Comment</label>
        <textarea
          id="comment"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this product..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all resize-none"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-brand hover:bg-brand-hover text-white py-3 rounded-xl font-semibold transition-all shadow-md shadow-brand/10 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : 'Post Review'}
      </button>
    </form>
  );
};
