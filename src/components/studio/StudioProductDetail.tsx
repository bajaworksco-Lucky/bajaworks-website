import { useState, useRef } from 'react';

interface ProductOption {
  label: string;
  value: string;
  priceAdd?: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  division: string;
  category: string;
  badge?: string | null;
  image: string;
  images?: string[];
  description?: string;
  features?: string[];
  materials?: string[];
  options?: ProductOption[];
  care?: string | null;
  acceptsUpload?: boolean;
  needsDesign?: boolean;
}

const PLACEHOLDER_REVIEWS = [
  { author: 'Carlos M.', rating: 5, date: 'Mar 2026', text: 'Ordered a banner for our shop opening — the colors were incredible and it arrived faster than expected. Professional quality all around.' },
  { author: 'Priya S.', rating: 5, date: 'Feb 2026', text: 'Had them design a logo package for my business. The concepts were sharp and the final files were exactly what I needed. Worth every dollar.' },
  { author: 'Alex D.', rating: 4, date: 'Jan 2026', text: 'Great print quality on the canvas. Took a few extra days since I needed a revision on the layout, but the team was super responsive.' },
];

export default function StudioProductDetail({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedOption, setSelectedOption] = useState(product.options?.[0]?.value || '');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [needsDesign, setNeedsDesign] = useState(product.needsDesign || false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [designNotes, setDesignNotes] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const optionPriceAdd = product.options?.find(o => o.value === selectedOption)?.priceAdd || 0;
  const designFee = (!product.needsDesign && needsDesign) ? 2500 : 0; // $25 design fee if opting in
  const totalPrice = product.price + optionPriceAdd + designFee;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const addToCart = () => {
    if (typeof window !== 'undefined' && (window as any).addToCart) {
      const optionLabel = product.options?.find(o => o.value === selectedOption)?.label || '';
      const nameParts = [product.name];
      if (optionLabel) nameParts.push(optionLabel);
      if (needsDesign && !product.needsDesign) nameParts.push('+ Design');

      const cartProduct = {
        ...product,
        price: totalPrice,
        name: nameParts.join(' — '),
      };
      for (let i = 0; i < qty; i++) {
        (window as any).addToCart(cartProduct);
      }
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const avgRating = (PLACEHOLDER_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / PLACEHOLDER_REVIEWS.length).toFixed(1);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px clamp(18px, 4vw, 40px) 80px' }}>

      {/* Breadcrumb */}
      <nav style={{ fontSize: 12.5, color: 'rgba(17,17,17,0.35)', marginBottom: 28, display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
        <a href="/" style={{ color: 'rgba(17,17,17,0.35)' }}>Home</a>
        <span>›</span>
        <a href="/studio" style={{ color: 'rgba(17,17,17,0.35)' }}>Baja Studio</a>
        <span>›</span>
        <span style={{ color: '#111' }}>{product.name}</span>
      </nav>

      {/* Main Grid */}
      <div className="pdp-grid" style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 'clamp(28px, 4vw, 56px)', alignItems: 'start' }}>

        {/* LEFT: Image Gallery */}
        <div>
          <div style={{
            width: '100%', aspectRatio: '1 / 1', borderRadius: 10, overflow: 'hidden',
            border: '1px solid rgba(17,17,17,0.08)',
            background: `linear-gradient(135deg, rgba(232,117,58,0.06), rgba(196,160,112,0.04))`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
          }}>
            <div style={{
              width: '100%', height: '100%',
              backgroundImage: `url(${images[selectedImage]})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 64, color: 'rgba(17,17,17,0.05)' }}>▣</span>
            </div>
            {product.badge && (
              <span style={{
                position: 'absolute', top: 16, left: 16,
                padding: '4px 12px', borderRadius: 4,
                background: product.badge === 'New' ? '#E8753A' : product.badge === 'Popular' ? '#E8753A' : 'rgba(139,109,79,0.85)',
                color: '#fff', fontSize: 10.5, fontWeight: 600,
                letterSpacing: 1.2, textTransform: 'uppercase',
              }}>{product.badge}</span>
            )}
          </div>

          {images.length > 1 && (
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  style={{
                    width: 72, height: 72, borderRadius: 8, overflow: 'hidden', cursor: 'pointer',
                    border: selectedImage === i ? '2px solid #E8753A' : '1px solid rgba(17,17,17,0.08)',
                    background: `linear-gradient(135deg, rgba(232,117,58,${0.04 + i * 0.02}), rgba(196,160,112,0.03))`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: 0, opacity: selectedImage === i ? 1 : 0.6,
                    transition: 'opacity 0.2s, border-color 0.2s',
                  }}
                >
                  <div style={{
                    width: '100%', height: '100%',
                    backgroundImage: `url(${img})`,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: 18, color: 'rgba(17,17,17,0.05)' }}>▣</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Product Info */}
        <div>
          <div style={{
            fontSize: 10.5, letterSpacing: 2.5, textTransform: 'uppercase',
            color: '#E8753A', fontWeight: 500, marginBottom: 10,
          }}>
            Baja Studio · {product.category}
          </div>

          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(32px, 5vw, 48px)',
            letterSpacing: 2, lineHeight: 1, margin: '0 0 16px', color: '#111',
          }}>
            {product.name}
          </h1>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 20 }}>
            {product.options && product.options.length > 1 ? (
              <>
                <span style={{ fontSize: 14, fontWeight: 500, color: 'rgba(17,17,17,0.4)' }}>Starting at</span>
                <span style={{ fontSize: 26, fontWeight: 700, color: '#E8753A' }}>
                  ${(product.price / 100).toFixed(2)}
                </span>
              </>
            ) : (
              <span style={{ fontSize: 26, fontWeight: 700, color: '#E8753A' }}>
                ${(totalPrice / 100).toFixed(2)}
              </span>
            )}
          </div>

          {/* Selected price breakdown */}
          {(optionPriceAdd > 0 || designFee > 0) && (
            <div style={{
              fontSize: 13, color: 'rgba(17,17,17,0.5)', marginBottom: 20,
              padding: '10px 14px', borderRadius: 6,
              background: 'rgba(232,117,58,0.04)', border: '1px solid rgba(232,117,58,0.1)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span>Base price</span>
                <span>${(product.price / 100).toFixed(2)}</span>
              </div>
              {optionPriceAdd > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span>Size/option upgrade</span>
                  <span>+${(optionPriceAdd / 100).toFixed(2)}</span>
                </div>
              )}
              {designFee > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span>Design service</span>
                  <span>+${(designFee / 100).toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: '#111', borderTop: '1px solid rgba(17,17,17,0.08)', paddingTop: 6, marginTop: 4 }}>
                <span>Total per unit</span>
                <span>${(totalPrice / 100).toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Rating Summary */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 2 }}>
              {[1,2,3,4,5].map(star => (
                <span key={star} style={{ color: star <= Math.round(Number(avgRating)) ? '#E8753A' : 'rgba(17,17,17,0.1)', fontSize: 16 }}>★</span>
              ))}
            </div>
            <span style={{ fontSize: 13, color: 'rgba(17,17,17,0.4)' }}>
              {avgRating} ({PLACEHOLDER_REVIEWS.length} reviews)
            </span>
          </div>

          {product.description && (
            <p style={{ fontSize: 14.5, lineHeight: 1.75, color: 'rgba(17,17,17,0.55)', margin: '0 0 28px', maxWidth: '52ch' }}>
              {product.description}
            </p>
          )}

          {/* Size / Option selector */}
          {product.options && product.options.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(17,17,17,0.35)', marginBottom: 10, fontWeight: 500 }}>
                Size / Option
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {product.options.map((opt: ProductOption) => (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedOption(opt.value)}
                    style={{
                      padding: '9px 18px', borderRadius: 6, cursor: 'pointer',
                      fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 500,
                      border: selectedOption === opt.value ? '2px solid #E8753A' : '1px solid rgba(17,17,17,0.12)',
                      background: selectedOption === opt.value ? 'rgba(232,117,58,0.08)' : 'transparent',
                      color: selectedOption === opt.value ? '#111' : 'rgba(17,17,17,0.5)',
                      transition: 'all 0.2s',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Materials */}
          {product.materials && product.materials.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(17,17,17,0.35)', marginBottom: 8, fontWeight: 500 }}>
                Material
              </div>
              <div style={{ fontSize: 14, color: '#111' }}>
                {product.materials.join(' · ')}
              </div>
            </div>
          )}

          {/* Upload your artwork */}
          {product.acceptsUpload && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(17,17,17,0.35)', marginBottom: 10, fontWeight: 500 }}>
                Your Artwork
              </div>

              {!uploadedFile ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    padding: '24px 18px', borderRadius: 8, cursor: 'pointer',
                    border: '2px dashed rgba(17,17,17,0.12)',
                    background: 'rgba(232,117,58,0.02)',
                    textAlign: 'center',
                    transition: 'border-color 0.2s, background 0.2s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(232,117,58,0.3)';
                    e.currentTarget.style.background = 'rgba(232,117,58,0.04)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(17,17,17,0.12)';
                    e.currentTarget.style.background = 'rgba(232,117,58,0.02)';
                  }}
                >
                  <div style={{ fontSize: 24, marginBottom: 8, color: 'rgba(17,17,17,0.15)' }}>↑</div>
                  <div style={{ fontSize: 13.5, fontWeight: 500, color: '#111', marginBottom: 4 }}>
                    Upload your image or design file
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(17,17,17,0.35)' }}>
                    PNG, JPG, PDF, AI, or PSD — up to 50MB
                  </div>
                </div>
              ) : (
                <div style={{
                  padding: '14px 18px', borderRadius: 8,
                  border: '1px solid rgba(232,117,58,0.2)',
                  background: 'rgba(232,117,58,0.04)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <span style={{ fontSize: 18, color: '#E8753A', flexShrink: 0 }}>✓</span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 500, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {uploadedFile.name}
                      </div>
                      <div style={{ fontSize: 11.5, color: 'rgba(17,17,17,0.35)' }}>
                        {(uploadedFile.size / 1024 / 1024).toFixed(1)} MB
                      </div>
                    </div>
                  </div>
                  <button onClick={removeFile} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(17,17,17,0.3)', fontSize: 16, flexShrink: 0, padding: '4px 8px',
                  }}>✕</button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.pdf,.ai,.psd,.svg,.tiff,.tif"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />

              {/* Design help toggle — only show if product accepts uploads (not already a design service) */}
              {!product.needsDesign && (
                <div style={{ marginTop: 12 }}>
                  <label style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer',
                    padding: '12px 14px', borderRadius: 6,
                    border: needsDesign ? '1px solid rgba(232,117,58,0.25)' : '1px solid rgba(17,17,17,0.08)',
                    background: needsDesign ? 'rgba(232,117,58,0.04)' : 'transparent',
                    transition: 'all 0.2s',
                  }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: 4, flexShrink: 0, marginTop: 1,
                      border: needsDesign ? '2px solid #E8753A' : '2px solid rgba(17,17,17,0.15)',
                      background: needsDesign ? '#E8753A' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}>
                      {needsDesign && <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>✓</span>}
                    </div>
                    <input
                      type="checkbox"
                      checked={needsDesign}
                      onChange={(e) => setNeedsDesign(e.target.checked)}
                      style={{ display: 'none' }}
                    />
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 500, color: '#111' }}>
                        I need design help (+$25.00)
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(17,17,17,0.4)', marginTop: 2, lineHeight: 1.5 }}>
                        Don't have artwork ready? We'll design it for you. Includes one revision round.
                      </div>
                    </div>
                  </label>
                </div>
              )}
            </div>
          )}

          {/* Design notes — show if needs design or product is a design service */}
          {(needsDesign || product.needsDesign) && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(17,17,17,0.35)', marginBottom: 10, fontWeight: 500 }}>
                Design Notes <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: 11, color: 'rgba(17,17,17,0.25)' }}>(optional — you can also email us after)</span>
              </div>
              <textarea
                placeholder="Tell us about your vision — colors, text, layout ideas, reference images, anything that helps us nail it."
                value={designNotes}
                onChange={(e) => setDesignNotes(e.target.value)}
                rows={3}
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 6,
                  border: '1px solid rgba(17,17,17,0.12)', background: 'rgba(17,17,17,0.02)',
                  color: '#111', fontFamily: "'Outfit', sans-serif", fontSize: 13.5,
                  resize: 'vertical', outline: 'none', minHeight: 80,
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(232,117,58,0.3)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(17,17,17,0.12)'}
              />
            </div>
          )}

          {/* Quantity + Add to Cart */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 28 }}>
            <div style={{
              display: 'flex', alignItems: 'center', border: '1px solid rgba(17,17,17,0.12)',
              borderRadius: 6, overflow: 'hidden',
            }}>
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                style={{
                  width: 40, height: 44, border: 'none', background: 'transparent',
                  cursor: 'pointer', fontSize: 18, color: '#111',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >−</button>
              <span style={{
                width: 40, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 600, borderLeft: '1px solid rgba(17,17,17,0.08)',
                borderRight: '1px solid rgba(17,17,17,0.08)',
              }}>{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                style={{
                  width: 40, height: 44, border: 'none', background: 'transparent',
                  cursor: 'pointer', fontSize: 18, color: '#111',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >+</button>
            </div>

            <button
              onClick={addToCart}
              style={{
                flex: 1, padding: '13px 0', borderRadius: 6, border: 'none', cursor: 'pointer',
                fontFamily: "'Outfit', sans-serif", fontSize: 13.5, fontWeight: 600,
                letterSpacing: 1.5, textTransform: 'uppercase',
                background: added ? '#4a7c59' : '#111',
                color: '#F2F0EC',
                transition: 'background 0.3s',
              }}
            >
              {added ? '✓ Added to Cart' : `Add to Cart — $${(totalPrice / 100).toFixed(2)}`}
            </button>
          </div>

          {/* Info Note */}
          <div style={{
            padding: '14px 18px', borderRadius: 6,
            border: '1px solid rgba(17,17,17,0.06)',
            background: 'rgba(232,117,58,0.03)',
            fontSize: 12.5, color: 'rgba(17,17,17,0.4)', lineHeight: 1.6,
          }}>
            {product.acceptsUpload || product.needsDesign ? (
              <>
                <strong style={{ color: 'rgba(17,17,17,0.55)' }}>How it works:</strong> Place your order, then email your files or details to <a href="mailto:bajaworksco@gmail.com" style={{ color: '#E8753A', fontWeight: 500 }}>bajaworksco@gmail.com</a> with your order number. We'll confirm everything before production begins.
              </>
            ) : (
              <>
                <strong style={{ color: 'rgba(17,17,17,0.55)' }}>Made to order.</strong> Most items ship within 5–7 business days. Custom and design projects may take 7–14 days depending on complexity.
              </>
            )}
          </div>
        </div>
      </div>

      {/* TABS: Details / Reviews */}
      <div style={{ marginTop: 64 }}>
        <div style={{
          display: 'flex', gap: 0, borderBottom: '1px solid rgba(17,17,17,0.08)',
          marginBottom: 32,
        }}>
          {(['details', 'reviews'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '14px 24px', border: 'none', cursor: 'pointer',
                background: 'transparent',
                fontFamily: "'Outfit', sans-serif", fontSize: 13,
                letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 500,
                color: activeTab === tab ? '#111' : 'rgba(17,17,17,0.3)',
                borderBottom: activeTab === tab ? '2px solid #E8753A' : '2px solid transparent',
                transition: 'all 0.2s',
              }}
            >
              {tab === 'details' ? 'Details & Specs' : `Reviews (${PLACEHOLDER_REVIEWS.length})`}
            </button>
          ))}
        </div>

        {activeTab === 'details' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, maxWidth: 800 }} className="pdp-details-grid">
            {product.features && product.features.length > 0 && (
              <div>
                <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(17,17,17,0.3)', marginBottom: 14, fontWeight: 500 }}>
                  What's Included
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {product.features.map((f, i) => (
                    <li key={i} style={{ fontSize: 14, color: 'rgba(17,17,17,0.6)', display: 'flex', alignItems: 'flex-start', gap: 10, lineHeight: 1.5 }}>
                      <span style={{ color: '#E8753A', fontSize: 8, marginTop: 6, flexShrink: 0 }}>●</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              {product.care && (
                <div style={{ marginBottom: 28 }}>
                  <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(17,17,17,0.3)', marginBottom: 14, fontWeight: 500 }}>
                    Care Instructions
                  </div>
                  <p style={{ fontSize: 14, color: 'rgba(17,17,17,0.55)', lineHeight: 1.7, margin: 0 }}>
                    {product.care}
                  </p>
                </div>
              )}

              {/* Accepted file types for upload products */}
              {product.acceptsUpload && (
                <div>
                  <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(17,17,17,0.3)', marginBottom: 14, fontWeight: 500 }}>
                    Accepted File Types
                  </div>
                  <p style={{ fontSize: 14, color: 'rgba(17,17,17,0.55)', lineHeight: 1.7, margin: 0 }}>
                    PNG, JPG, PDF, AI, PSD, SVG, TIFF. For best results, send files at 300 DPI or higher at the intended print size. Not sure? Email us and we'll check your file.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div style={{ maxWidth: 700 }}>
            {/* Rating Overview */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32,
              padding: '20px 24px', borderRadius: 8,
              border: '1px solid rgba(17,17,17,0.06)', background: 'rgba(232,117,58,0.02)',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 42, color: '#111', lineHeight: 1 }}>{avgRating}</div>
                <div style={{ display: 'flex', gap: 2, justifyContent: 'center', marginTop: 4 }}>
                  {[1,2,3,4,5].map(star => (
                    <span key={star} style={{ color: star <= Math.round(Number(avgRating)) ? '#E8753A' : 'rgba(17,17,17,0.1)', fontSize: 14 }}>★</span>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(17,17,17,0.35)', marginTop: 4 }}>{PLACEHOLDER_REVIEWS.length} reviews</div>
              </div>
              <div style={{ flex: 1 }}>
                {[5,4,3,2,1].map(stars => {
                  const count = PLACEHOLDER_REVIEWS.filter(r => r.rating === stars).length;
                  const pct = (count / PLACEHOLDER_REVIEWS.length) * 100;
                  return (
                    <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 11, color: 'rgba(17,17,17,0.35)', width: 14, textAlign: 'right' }}>{stars}</span>
                      <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(17,17,17,0.06)', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', borderRadius: 3, background: '#E8753A', transition: 'width 0.3s' }} />
                      </div>
                      <span style={{ fontSize: 11, color: 'rgba(17,17,17,0.25)', width: 20 }}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {PLACEHOLDER_REVIEWS.map((review, i) => (
              <div key={i} style={{
                padding: '20px 0',
                borderBottom: i < PLACEHOLDER_REVIEWS.length - 1 ? '1px solid rgba(17,17,17,0.06)' : 'none',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'rgba(232,117,58,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 600, color: '#E8753A',
                    }}>
                      {review.author[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: '#111' }}>{review.author}</div>
                      <div style={{ display: 'flex', gap: 2 }}>
                        {[1,2,3,4,5].map(star => (
                          <span key={star} style={{ color: star <= review.rating ? '#E8753A' : 'rgba(17,17,17,0.1)', fontSize: 11 }}>★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: 11.5, color: 'rgba(17,17,17,0.25)' }}>{review.date}</span>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(17,17,17,0.55)', margin: 0 }}>
                  {review.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 820px) {
          .pdp-grid { grid-template-columns: 1fr !important; }
          .pdp-details-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
