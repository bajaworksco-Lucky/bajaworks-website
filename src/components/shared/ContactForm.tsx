import { useState } from 'react';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) return;
    const mailto = `mailto:bajaworksco@gmail.com?subject=${encodeURIComponent(form.subject || 'Website Inquiry')}&body=${encodeURIComponent(`From: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
    window.open(mailto, '_blank');
    setSent(true);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', borderRadius: 5,
    border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)',
    color: '#E8E4DF', fontFamily: "'Outfit', sans-serif", fontSize: 14,
    outline: 'none', transition: 'border-color 0.2s',
  };

  if (sent) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <div style={{ fontSize: 28, marginBottom: 12 }}>✓</div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: 2, marginBottom: 8 }}>Message Ready</div>
        <p style={{ fontSize: 13.5, color: 'rgba(232,228,223,0.4)' }}>
          Your email client should have opened. If not, email us directly at bajaworksco@gmail.com
        </p>
        <button
          onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
          style={{
            marginTop: 16, padding: '8px 20px', borderRadius: 4,
            border: '1px solid rgba(255,255,255,0.1)', background: 'transparent',
            color: 'rgba(232,228,223,0.6)', cursor: 'pointer',
            fontFamily: "'Outfit', sans-serif", fontSize: 12,
          }}
        >Send Another</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(232,228,223,0.25)', marginBottom: 4 }}>
        Send Us a Message
      </div>
      <input
        type="text" placeholder="Your Name" value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        style={inputStyle}
        onFocus={e => (e.target.style.borderColor = 'rgba(196,160,112,0.4)')}
        onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
      />
      <input
        type="email" placeholder="Your Email" value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
        style={inputStyle}
        onFocus={e => (e.target.style.borderColor = 'rgba(196,160,112,0.4)')}
        onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
      />
      <input
        type="text" placeholder="Subject (optional)" value={form.subject}
        onChange={e => setForm({ ...form, subject: e.target.value })}
        style={inputStyle}
        onFocus={e => (e.target.style.borderColor = 'rgba(196,160,112,0.4)')}
        onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
      />
      <textarea
        placeholder="Your message..." rows={5} value={form.message}
        onChange={e => setForm({ ...form, message: e.target.value })}
        style={{ ...inputStyle, resize: 'vertical', minHeight: 120 }}
        onFocus={e => (e.target.style.borderColor = 'rgba(196,160,112,0.4)')}
        onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
      />
      <button
        onClick={handleSubmit}
        style={{
          padding: '13px 0', borderRadius: 4, border: 'none',
          background: '#C4A070', color: '#0D0D0B', cursor: 'pointer',
          fontFamily: "'Outfit', sans-serif", fontSize: 13,
          fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase',
          marginTop: 4,
          opacity: (!form.name || !form.email || !form.message) ? 0.4 : 1,
          transition: 'opacity 0.2s',
        }}
      >Send Message</button>
    </div>
  );
}
