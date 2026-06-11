// src/components/shared/ProductReviews.tsx
// Real customer reviews: fetches approved reviews from /api/reviews and lets
// customers submit one (held for moderation). Drop into both PDP components
// in place of the PLACEHOLDER_REVIEWS rendering:
//
//   Casa:   <ProductReviews productId={product.id} accent="#C4A070" />
//   Studio: <ProductReviews productId={product.id} accent="#E8753A" />

import { useState, useEffect } from 'react';

interface Review {
  id: number;
  author: string;
  rating: number;
  text: string;
  created_at: string;
}

interface Props {
  productId: string;
  accent?: string; // '#C4A070' casa · '#E8753A' studio
}

export default function ProductReviews({ productId, accent = '#C4A070' }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/reviews?product_id=${encodeURIComponent(productId)}`)
      .then(res => res.json())
      .then(data => setReviews(data.reviews || []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [productId]);

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const formatDate = (iso: string) => {
    const d = new Date(iso.replace(' ', 'T') + 'Z');
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const submitReview = async () => {
    setError('');
    if (!author.trim()) { setError('Please add your name.'); return; }
    if (rating === 0) { setError('Please pick a star rating.'); return; }
    if (text.trim().length < 10) { setError('Please write at least a sentence.'); return; }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, author: author.trim(), rating, text: text.trim(), website }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
      } else {
        setSubmitted(true);
        setShowForm(false);
      }
    } catch {
      setError('Could not submit. Check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const label: React.CSSProperties = {
    fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
    color: 'rgba(17,17,17,0.35)', marginBottom: 8, fontWeight: 500, display: 'block',
  };
  const input: React.CSSProperties = {
    width: '100%', padding: '11px 14px', borderRadius: 6,
    border: '1px solid rgba(17,17,17,0.15)', background: '#fff',
    fontFamily: "'Outfit', sans-serif", fontSize: 14, color: '#111',
    outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div>
      {/* Summary row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {avgRating ? (
            <>
              <div style={{ display: 'flex', gap: 2 }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star} style={{ color: star <= Math.round(Number(avgRating)) ? accent : 'rgba(17,17,17,0.12)', fontSize: 17 }}>★</span>
                ))}
              </div>
              <span style={{ fontSize: 13.5, color: 'rgba(17,17,17,0.45)' }}>
                {avgRating} · {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </span>
            </>
          ) : (
            <span style={{ fontSize: 13.5, color: 'rgba(17,17,17,0.4)' }}>
              {loading ? 'Loading reviews…' : 'No reviews yet — be the first.'}
            </span>
          )}
        </div>

        {!submitted && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '9px 20px', borderRadius: 6, cursor: 'pointer',
              border: `1.5px solid ${accent}`, background: 'transparent', color: '#111',
              fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 600,
              letterSpacing: 1, textTransform: 'uppercase',
            }}
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Thank-you state */}
      {submitted && (
        <div style={{
          padding: '16px 20px', borderRadius: 8, marginBottom: 20,
          background: 'rgba(196,160,112,0.08)', border: `1px solid ${accent}40`,
          fontSize: 14, color: 'rgba(17,17,17,0.65)', lineHeight: 1.6,
        }}>
          Thanks for your review! It'll appear here once it's been checked over — usually within a day.
        </div>
      )}

      {/* Form */}
      {showForm && !submitted && (
        <div style={{
          padding: '22px 22px 24px', borderRadius: 10, marginBottom: 24,
          background: 'rgba(17,17,17,0.025)', border: '1px solid rgba(17,17,17,0.08)',
        }}>
          <div style={{ marginBottom: 16 }}>
            <span style={label}>Your Rating</span>
            <div style={{ display: 'flex', gap: 4 }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  aria-label={`${star} star${star > 1 ? 's' : ''}`}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: 2,
                    fontSize: 26, lineHeight: 1,
                    color: star <= (hoverRating || rating) ? accent : 'rgba(17,17,17,0.15)',
                    transition: 'color 0.15s',
                  }}
                >★</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <span style={label}>Your Name</span>
            <input
              type="text"
              value={author}
              onChange={e => setAuthor(e.target.value)}
              placeholder="First name, last initial — e.g. Maria G."
              maxLength={60}
              style={input}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <span style={label}>Your Review</span>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="How's the quality? Was it a gift? Would you order again?"
              maxLength={1200}
              rows={4}
              style={{ ...input, resize: 'vertical', minHeight: 90 }}
            />
          </div>

          {/* Honeypot — hidden from real users */}
          <input
            type="text"
            value={website}
            onChange={e => setWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{ position: 'absolute', left: -9999, width: 1, height: 1, opacity: 0 }}
          />

          {error && (
            <p style={{ fontSize: 13, color: '#C0392B', margin: '0 0 14px' }}>{error}</p>
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={submitReview}
              disabled={submitting}
              style={{
                padding: '12px 28px', borderRadius: 6, border: 'none',
                background: submitting ? 'rgba(17,17,17,0.3)' : '#2A2520', color: '#fff',
                cursor: submitting ? 'default' : 'pointer',
                fontFamily: "'Outfit', sans-serif", fontSize: 12.5, fontWeight: 600,
                letterSpacing: 1.5, textTransform: 'uppercase',
              }}
            >
              {submitting ? 'Sending…' : 'Submit Review'}
            </button>
            <button
              onClick={() => { setShowForm(false); setError(''); }}
              style={{
                padding: '12px 20px', borderRadius: 6, cursor: 'pointer',
                border: '1px solid rgba(17,17,17,0.15)', background: 'transparent',
                color: 'rgba(17,17,17,0.5)', fontFamily: "'Outfit', sans-serif",
                fontSize: 12.5, fontWeight: 500, letterSpacing: 1, textTransform: 'uppercase',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Review list */}
      {reviews.map(review => (
        <div key={review.id} style={{ padding: '18px 0', borderBottom: '1px solid rgba(17,17,17,0.07)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8, marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <strong style={{ fontSize: 14, color: '#111' }}>{review.author}</strong>
              <div style={{ display: 'flex', gap: 1 }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star} style={{ color: star <= review.rating ? accent : 'rgba(17,17,17,0.1)', fontSize: 13 }}>★</span>
                ))}
              </div>
            </div>
            <span style={{ fontSize: 12, color: 'rgba(17,17,17,0.3)' }}>{formatDate(review.created_at)}</span>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(17,17,17,0.55)', margin: 0, maxWidth: '60ch' }}>
            {review.text}
          </p>
        </div>
      ))}
    </div>
  );
}
