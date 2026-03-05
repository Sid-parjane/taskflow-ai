import { motion } from 'framer-motion';

const contacts = [
  {
    label: 'Gmail',
    value: 'siddharthparjane07@gmail.com',
    href: 'mailto:siddharthparjane07@gmail.com',
    color: '#EA4335',
    bg: 'rgba(234,67,53,0.1)',
    border: 'rgba(234,67,53,0.25)',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
        <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6z" fill="rgba(234,67,53,0.15)" stroke="#EA4335" strokeWidth="1.5"/>
        <path d="M22 6l-10 7L2 6" stroke="#EA4335" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    value: 'siddharth-parjane',
    href: 'https://www.linkedin.com/in/siddharth-parjane-1a990731a/',
    color: '#0A66C2',
    bg: 'rgba(10,102,194,0.1)',
    border: 'rgba(10,102,194,0.25)',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="#0A66C2">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: 'GitHub',
    value: 'Sid-parjane',
    href: 'https://github.com/Sid-parjane',
    color: '#ffffff',
    bg: 'rgba(255,255,255,0.07)',
    border: 'rgba(255,255,255,0.15)',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
];

export default function Contact() {
  return (
    <div style={{ maxWidth: '100%', overflow: 'hidden' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Contact</h1>
          <p className="page-subtitle">Get in touch or find me online</p>
        </div>
      </div>

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          maxWidth: 560,
          margin: '0 auto 40px',
          textAlign: 'center',
          padding: '40px 24px 32px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-bright)',
          borderRadius: 24,
          boxShadow: '0 0 60px rgba(99,102,241,0.08)',
        }}
      >
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
          style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #14b8a6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, fontWeight: 800, color: 'white',
            margin: '0 auto 16px',
            boxShadow: '0 0 32px rgba(99,102,241,0.4)',
            fontFamily: 'var(--font-display)',
          }}
        >
          S
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, letterSpacing: '-0.02em', marginBottom: 6 }}
        >
          Siddharth Parjane
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 360, margin: '0 auto 28px' }}
        >
          Computer Science Engineer · Full Stack Developer · Open to freelance work
        </motion.p>

        {/* Contact cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {contacts.map(({ label, value, href, color, bg, border, icon }, i) => (
            <motion.a
              key={label}
              href={href}
              target={href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 18px',
                background: bg,
                border: `1px solid ${border}`,
                borderRadius: 14,
                textDecoration: 'none',
                transition: 'all 0.2s',
                cursor: 'pointer',
              }}
            >
              <div style={{
                width: 46, height: 46, borderRadius: 12,
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {icon}
              </div>
              <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
                  {label}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {value}
                </div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.6 }}>
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* Availability badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        style={{ textAlign: 'center' }}
      >
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '10px 20px', borderRadius: 100,
          background: 'rgba(52,211,153,0.1)',
          border: '1px solid rgba(52,211,153,0.25)',
        }}>
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399' }}
          />
          <span style={{ fontSize: 13, color: '#34d399', fontWeight: 600 }}>
            Available for freelance projects
          </span>
        </div>
      </motion.div>
    </div>
  );
}
