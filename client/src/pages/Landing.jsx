import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Sparkles, BarChart3, Brain, ArrowRight, CheckCircle2, Kanban, Shield } from 'lucide-react';

const WORDS = ['Smarter', 'Faster', 'Effortlessly', 'Intelligently'];

const features = [
  { icon: Brain, title: 'AI Task Breakdown', desc: 'AI decomposes complex goals into clear, actionable subtasks automatically.', color: '#818cf8' },
  { icon: Sparkles, title: 'Smart Generation', desc: 'Describe a goal and AI creates a full task plan with priorities and time estimates.', color: '#34d399' },
  { icon: BarChart3, title: 'Deep Analytics', desc: 'Track completion rates, productivity trends, and time patterns visually.', color: '#fbbf24' },
  { icon: Kanban, title: 'Kanban Board', desc: 'Flexible views for every workflow. Drag, drop, and organize effortlessly.', color: '#f472b6' },
  { icon: Shield, title: 'Secure & Private', desc: 'JWT authentication and encrypted storage keeps your data safe.', color: '#60a5fa' },
  { icon: Zap, title: 'Lightning Fast', desc: 'Built with React + Vite for instant load times and smooth interactions.', color: '#a78bfa' },
];

export default function Landing() {
  const navigate = useNavigate();
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIdx(i => (i + 1) % WORDS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#060a10', color: '#f0f4ff', fontFamily: "'DM Sans', sans-serif", overflowX: 'hidden' }}>

      {/* Background orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '-10%', left: '20%',
          width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '5%', right: '5%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(20,184,166,0.09) 0%, transparent 70%)',
        }} />
      </div>

      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 40px',
        background: 'rgba(4,7,14,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: 'linear-gradient(135deg, #6366f1, #14b8a6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99,102,241,0.45)',
          }}>
            <Zap size={16} color="white" fill="white" />
          </div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 17, letterSpacing: '-0.01em' }}>
            TaskFlow<span style={{ color: '#818cf8' }}>AI</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => navigate('/login')}
            style={{ padding: '9px 20px', borderRadius: 10, background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: '#9ca3af', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}
          >
            Sign In
          </button>
          <motion.button
            onClick={() => navigate('/register')}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            style={{ padding: '9px 22px', borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none', color: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}
          >
            Get Started Free <ArrowRight size={15} />
          </motion.button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ position: 'relative', zIndex: 1, paddingTop: 140, paddingBottom: 80, maxWidth: 1000, margin: '0 auto', padding: '140px 32px 80px', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 14px', borderRadius: 100, marginBottom: 28,
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.25)',
            fontSize: 12, fontWeight: 700, color: '#818cf8',
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>
            <Sparkles size={12} /> AI-Powered Productivity
          </div>

          {/* Hero title */}
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(40px, 7vw, 80px)',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            marginBottom: 12,
            color: '#f0f4ff',
          }}>
            Work{' '}
            <span style={{ position: 'relative', display: 'inline-block', minWidth: 240 }}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIdx}
                  initial={{ opacity: 0, y: 20, rotateX: -40 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: -20, rotateX: 40 }}
                  transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                  style={{
                    display: 'inline-block',
                    background: 'linear-gradient(135deg, #6366f1, #14b8a6, #ec4899)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {WORDS[wordIdx]}
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(40px, 7vw, 80px)',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            marginBottom: 28,
            color: '#f0f4ff',
          }}>
            with AI
          </h1>

          <p style={{ fontSize: 18, color: '#6b7db3', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.75 }}>
            The intelligent task manager that uses AI to break down goals, prioritize work, and help you achieve more — every single day.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 36 }}>
            <motion.button
              onClick={() => navigate('/register')}
              whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(99,102,241,0.55)' }}
              whileTap={{ scale: 0.97 }}
              style={{ padding: '14px 36px', fontSize: 16, fontWeight: 600, fontFamily: 'inherit', borderRadius: 12, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 24px rgba(99,102,241,0.4)' }}
            >
              Start for free <ArrowRight size={18} />
            </motion.button>
            <motion.button
              onClick={() => navigate('/login')}
              whileHover={{ scale: 1.02 }}
              style={{ padding: '14px 32px', fontSize: 16, fontFamily: 'inherit', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', color: '#d1d5db', cursor: 'pointer' }}
            >
              Sign in
            </motion.button>
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, flexWrap: 'wrap', color: '#4b5563', fontSize: 13 }}>
            {['Free forever', 'No credit card', 'Deploy in minutes'].map(text => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={14} color="#34d399" />
                <span style={{ color: '#6b7db3' }}>{text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* App preview */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          style={{ marginTop: 72, position: 'relative' }}
        >
          <div style={{
            background: '#0b1120',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 24,
            padding: 24,
            boxShadow: '0 40px 120px rgba(0,0,0,0.7), 0 0 80px rgba(99,102,241,0.08)',
          }}>
            {/* Window dots */}
            <div style={{ display: 'flex', gap: 7, marginBottom: 20 }}>
              {['#ef4444', '#f59e0b', '#22c55e'].map(c => (
                <div key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c, opacity: 0.8 }} />
              ))}
            </div>
            {/* Mock kanban */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {[
                { label: 'Todo', count: 5, color: '#94a3b8', tasks: ['Research competitors', 'Write brief', 'Set timeline'] },
                { label: 'In Progress', count: 3, color: '#818cf8', tasks: ['Redesign landing', 'API integration', 'User testing'] },
                { label: 'Review', count: 2, color: '#f59e0b', tasks: ['Homepage copy', 'Mobile layouts'] },
                { label: 'Done', count: 8, color: '#22c55e', tasks: ['Auth setup', 'DB schema', 'Deploy infra'] },
              ].map(col => (
                <div key={col.label} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 12, padding: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: col.color, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{col.label}</span>
                    <span style={{ fontSize: 10, background: 'rgba(255,255,255,0.06)', padding: '1px 6px', borderRadius: 100, color: '#6b7db3' }}>{col.count}</span>
                  </div>
                  {col.tasks.map((t, i) => (
                    <div key={i} style={{
                      background: '#0e1526', borderRadius: 7, padding: '8px 10px',
                      marginBottom: 6, border: '1px solid rgba(255,255,255,0.05)',
                      borderLeft: `2px solid ${col.color}`,
                    }}>
                      <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>{t}</div>
                      <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, width: `${50 + i * 18}%` }} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          {/* Glow under card */}
          <div style={{
            position: 'absolute', bottom: -40, left: '10%', right: '10%', height: 80,
            background: 'rgba(99,102,241,0.2)', filter: 'blur(40px)', borderRadius: '50%', zIndex: -1,
          }} />
        </motion.div>
      </div>

      {/* Features */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1000, margin: '0 auto', padding: '80px 32px' }}>
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginBottom: 14, color: '#f0f4ff', letterSpacing: '-0.02em' }}>
            Everything you need to stay{' '}
            <span style={{ background: 'linear-gradient(135deg, #6366f1, #14b8a6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              in flow
            </span>
          </h2>
          <p style={{ color: '#6b7db3', fontSize: 16 }}>Powerful features designed for how you actually work.</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {features.map(({ icon: Icon, title, desc, color }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4, borderColor: `${color}40` }}
              style={{
                padding: 24, borderRadius: 16,
                background: '#0b1120',
                border: '1px solid rgba(255,255,255,0.06)',
                transition: 'all 0.2s',
              }}
            >
              <div style={{
                width: 46, height: 46, borderRadius: 12, marginBottom: 16,
                background: `${color}18`,
                border: `1px solid ${color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={21} color={color} />
              </div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#f0f4ff' }}>{title}</h3>
              <p style={{ color: '#6b7db3', fontSize: 13, lineHeight: 1.65 }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA bottom */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, margin: '0 auto', padding: '40px 32px 100px', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          style={{
            padding: '48px 40px', borderRadius: 24,
            background: '#0b1120',
            border: '1px solid rgba(99,102,241,0.3)',
            boxShadow: '0 0 60px rgba(99,102,241,0.08)',
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>🚀</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, marginBottom: 14, color: '#f0f4ff', letterSpacing: '-0.02em' }}>
            Ready to level up?
          </h2>
          <p style={{ color: '#6b7db3', marginBottom: 32, fontSize: 15, lineHeight: 1.7 }}>
            Join TaskFlow AI and start accomplishing more with the power of AI.
          </p>
          <motion.button
            onClick={() => navigate('/register')}
            whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(99,102,241,0.55)' }}
            whileTap={{ scale: 0.97 }}
            style={{ padding: '14px 44px', fontSize: 16, fontWeight: 600, fontFamily: 'inherit', borderRadius: 12, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none', color: 'white', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 24px rgba(99,102,241,0.4)' }}
          >
            Create free account <ArrowRight size={18} />
          </motion.button>
        </motion.div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '24px 32px', textAlign: 'center', color: '#374151', fontSize: 13 }}>
        Built with ❤️ by <span style={{ color: '#818cf8' }}>Siddharth Parjane</span> · TaskFlow AI © 2026
      </div>
    </div>
  );
}
