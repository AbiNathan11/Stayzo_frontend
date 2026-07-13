import React, { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { Star, MessageSquare, Loader2, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  authorId?: string | null;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
  } | null;
}

interface PropertyReviewsProps {
  propertyId: string;
  onAverageRatingChange?: (avg: number, count: number) => void;
  showFormOnlyOnDashboard?: boolean;
  hideForm?: boolean;
}

function decodeToken(token: string): Record<string, any> | null {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export default function PropertyReviews({ propertyId, onAverageRatingChange, hideForm }: PropertyReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isTenant, setIsTenant] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Check role on mount
  useEffect(() => {
    const token = Cookies.get('stayzo_token');
    if (token) {
      const decoded = decodeToken(token);
      if (decoded && decoded.isTenant) {
        setIsTenant(true);
        setUserId(decoded.id || null);
      }
    }
  }, []);

  const fetchReviews = useCallback(async () => {
    if (!propertyId) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/reviews/property/${propertyId}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
        
        // Calculate average rating
        if (data.length > 0) {
          const sum = data.reduce((acc: number, r: Review) => acc + r.rating, 0);
          const avg = sum / data.length;
          if (onAverageRatingChange) {
            onAverageRatingChange(avg, data.length);
          }
        } else {
          if (onAverageRatingChange) {
            onAverageRatingChange(0, 0);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  }, [propertyId, onAverageRatingChange]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a star rating.');
      return;
    }
    if (!comment.trim()) {
      toast.error('Please enter a review comment.');
      return;
    }

    const token = Cookies.get('stayzo_token');
    if (!token) {
      toast.error('You must be signed in to submit a review.');
      return;
    }

    setSubmitLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          propertyId,
          rating,
          comment: comment.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      toast.success('Review submitted successfully!');
      setRating(0);
      setComment('');
      setShowModal(false);
      // Refetch reviews to immediately update UI without reload
      fetchReviews();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Error submitting review. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Compute average rating for local rendering
  const count = reviews.length;
  const average = count > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / count)
    : 0;

  const renderStars = (val: number, size = "w-3.5 h-3.5") => {
    const rounded = Math.round(val);
    return (
      <div className="flex items-center gap-0.5 text-amber-400 select-none">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`${size} ${s <= rounded ? 'fill-amber-400 stroke-amber-400' : 'text-gray-200'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="mt-4 border-t border-gray-100 pt-4 space-y-4">
      {/* Average Rating Summary */}
      <div className="flex items-center justify-between bg-gray-50/50 p-3 rounded-2xl border border-gray-100 select-none">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Reviews ({count})</span>
          {count > 0 && (
            <div className="flex items-center gap-1.5">
              {renderStars(average)}
              <span className="text-xs font-black text-gray-800">{average.toFixed(1)}</span>
            </div>
          )}
        </div>
        {count === 0 && (
          <span className="text-[10px] font-bold text-gray-400 italic">No reviews yet</span>
        )}
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="flex items-center justify-center py-4 text-gray-400 text-xs font-semibold gap-1.5">
          <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
          <span>Loading reviews...</span>
        </div>
      ) : (
        count > 0 && (
          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
            {reviews.map((item) => {
              const dateStr = new Date(item.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });
              const author = item.user 
                ? `${item.user.firstName || ''} ${item.user.lastName || ''}`.trim() || 'Anonymous Tenant'
                : 'Anonymous Tenant';
              return (
                <div key={item.id} className="bg-white border border-gray-100 rounded-xl p-3 space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-black text-gray-800">{author}</span>
                      <span className="text-[9px] text-gray-400 font-semibold block mt-0.5">{dateStr}</span>
                    </div>
                    {renderStars(item.rating, "w-3 h-3")}
                  </div>
                  <p className="text-[11px] font-semibold text-gray-600 italic leading-relaxed">
                    "{item.comment}"
                  </p>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* Write a Review Button (Tenant Only) */}
      {isTenant && !hideForm && (
        reviews.some(r => r.user?.id === userId || r.authorId === userId) ? (
          <div className="w-full text-center py-3 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-bold text-gray-400 uppercase tracking-wider select-none">
            You have already reviewed this property
          </div>
        ) : (
          <button
            onClick={() => {
              setRating(0);
              setComment('');
              setShowModal(true);
            }}
            className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white py-2.5 rounded-xl text-xs font-bold transition duration-200 cursor-pointer uppercase tracking-wider shadow-sm flex items-center justify-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Write a Review</span>
          </button>
        )
      )}

      {/* Review Modal Form overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-[#1A1A1A]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white border border-gray-200 rounded-[32px] w-full max-w-lg p-6 md:p-8 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition cursor-pointer"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>

            <div className="mb-6">
              <h3 className="text-xl font-extrabold text-[#1A1A1A]">Write a Review</h3>
              <p className="text-xs text-gray-500 font-semibold mt-1">
                Share your experience staying here.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                  Select Rating
                </label>
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }, (_, idx) => {
                    const starValue = idx + 1;
                    const isActive = starValue <= (hoverRating || rating);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setRating(starValue)}
                        onMouseEnter={() => setHoverRating(starValue)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform active:scale-90 cursor-pointer"
                      >
                        <Star 
                          className={`w-8 h-8 transition duration-150 ${
                            isActive 
                              ? "fill-amber-400 text-amber-400 scale-105" 
                              : "text-gray-300"
                          }`} 
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                  Your Review & Experience
                </label>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  placeholder="Write details about the property, location, hosting, and landlord..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm outline-none focus:border-gray-400 focus:bg-white transition duration-200 resize-none font-semibold text-gray-700"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-2xl py-3 text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading || rating === 0 || !comment.trim()}
                  className={`flex-1 rounded-2xl py-3 text-xs font-bold shadow-sm transition duration-200 cursor-pointer ${
                    submitLoading || rating === 0 || !comment.trim()
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-[#4F46E5] text-white hover:bg-[#4338CA] active:scale-95"
                  }`}
                >
                  {submitLoading ? 'Submitting...' : 'Submit'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
