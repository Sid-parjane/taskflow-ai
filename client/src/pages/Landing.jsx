import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import ParticleBackground from '../components/ParticleBackground';
import { Zap, ArrowRight, CheckCircle2, Sparkles, Brain, BarChart3, Kanban, ChevronDown } from 'lucide-react';

const WORDS = ['Smarter', 'Faster', 'Effortless', 'Intelligent', 'Powerful'];

function AnimatedWord() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex(i => (i + 1) % WORDS.length), 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={WORDS[index]}
        initial={{ y: 40, opacity: 0, filter: 'blur(8px)' }}
        animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
        exit={{ y: -40, opacity: 0, filter: 'blur(8px)' }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, #818cf8, #34d399, #f472b6)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}
      >
        {WORDS[index]}
      </motion.span>
    </AnimatePresence>
  );
}

const features = [
  { icon: Brain, title: 'AI Task Breakdown', desc: 'Claude AI decomposes any complex goal into precise, actionable steps.', color: '#818cf8' },
  { icon: Sparkles, title: 'Goal-to-Plan Generator', desc: 'Describe what you want. AI builds a full prioritized task plan instantly.', color: '#34d399' },
  { icon: Kanban, title: 'Drag & Drop Kanban', desc: 'Fluid board with 4 columns. Drag tasks between stages effortlessly.', color: '#f472b6' },
  { icon: BarChart3, title: 'Deep Analytics', desc: 'Interactive charts tracking completion rate, time, and category trends.', color: '#fb923c' },
];

const floatingCards = [
  { title: 'Redesign landing page', priority: 'high', status: 'in-progress', x: -20, delay: 0 },
  { title: 'AI breakdown: Launch MVP', priority: 'critical', status: 'todo', x: 20, delay: 0.3 },
  { title: 'Write API documentation', priority: 'medium', status: 'review', x: -10, delay: 0.6 },
];

export default function Landing() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div style={{ background: '#030508', minHeight: '100vh', overflow: 'hidden' }}>
      <ParticleBackground />

      {/* Ambient orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: '-15%', left: '20%',
            width: 700, height: 700, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 65%)',
            filter: 'blur(40px)',
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{
            position: 'absolute', bottom: '5%', right: '10%',
            width: 500, height: 500, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(52,211,153,0.18) 0%, transparent 65%)',
            filter: 'blur(50px)',
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          style={{
            position: 'absolute', top: '40%', right: '30%',
            width: 300, height: 300, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(244,114,182,0.2) 0%, transparent 65%)',
            filter: 'blur(40px)',
          }}
        />
      </div>

      {/* NAV */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 48px',
          background: 'rgba(3,5,8,0.7)',
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1, #14b8a6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 24px rgba(99,102,241,0.5)',
            }}
          >
            <Zap size={18} color="white" fill="white" />
          </motion.div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em' }}>
            TaskFlow<span style={{ color: '#818cf8' }}>AI</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/login')}
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', padding: '9px 20px', borderRadius: 10, fontFamily: 'DM Sans, sans-serif', fontSize: 14, cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Sign In
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(99,102,241,0.5)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/register')}
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', border: 'none', padding: '9px 22px', borderRadius: 10, fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 20px rgba(99,102,241,0.35)' }}
          >
            Get Started Free <ArrowRight size={15} />
          </motion.button>
        </div>
      </motion.nav>

      {/* HERO */}
      <div ref={heroRef} style={{ position: 'relative', zIndex: 2, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 80px', textAlign: 'center' }}>
        <motion.div style={{ y, opacity }}>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '7px 16px', borderRadius: 100,
              background: 'rgba(99,102,241,0.12)',
              border: '1px solid rgba(99,102,241,0.3)',
              marginBottom: 32,
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 7, height: 7, borderRadius: '50%', background: '#818cf8' }}
            />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Powered by Claude AI
            </span>
          </motion.div>

          <h1 style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: 'clamp(52px, 9vw, 100px)', lineHeight: 0.95,
            letterSpacing: '-0.04em', marginBottom: 32,
            color: 'white',
          }}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              Work
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              style={{ height: 'clamp(52px, 9vw, 100px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AnimatedWord />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              style={{ color: 'rgba(255,255,255,0.2)' }}>
              with AI
            </motion.div>
          </h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: 'rgba(255,255,255,0.45)', maxWidth: 520, margin: '0 auto 48px', lineHeight: 1.7, fontFamily: 'DM Sans, sans-serif', fontWeight: 300 }}
          >
            The only task manager that thinks with you. Generate plans, break down complexity, and execute — powered by real AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}
            style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 56 }}
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 16px 48px rgba(99,102,241,0.6)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/register')}
              style={{
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color: 'white', border: 'none', padding: '16px 40px',
                borderRadius: 14, fontFamily: 'Syne, sans-serif', fontWeight: 700,
                fontSize: 16, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
                boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
                letterSpacing: '-0.01em',
              }}
            >
              Start Building — Free <ArrowRight size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, borderColor: 'rgba(255,255,255,0.3)' }}
              onClick={() => navigate('/login')}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.7)',
                padding: '16px 32px', borderRadius: 14,
                fontFamily: 'DM Sans, sans-serif', fontSize: 15,
                cursor: 'pointer', backdropFilter: 'blur(10px)',
                transition: 'all 0.2s',
              }}
            >
              Sign In
            </motion.button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}
          >
            {['Free forever', 'No credit card', 'Deploy in minutes'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
                <CheckCircle2 size={14} color="#34d399" />
                {t}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Floating task cards */}
        <div style={{ position: 'absolute', right: '5%', top: '20%', display: 'flex', flexDirection: 'column', gap: 12, pointerEvents: 'none' }}>
          {floatingCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0, y: [0, card.x, 0] }}
              transition={{ delay: 0.8 + i * 0.2, duration: 0.6, y: { duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 1.2 } }}
              style={{
                background: 'rgba(13,20,38,0.9)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14, padding: '14px 18px',
                width: 240,
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: 'white', marginBottom: 8, fontFamily: 'DM Sans, sans-serif' }}>{card.title}</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: card.priority === 'critical' ? 'rgba(239,68,68,0.2)' : card.priority === 'high' ? 'rgba(245,158,11,0.2)' : 'rgba(99,102,241,0.2)', color: card.priority === 'critical' ? '#ef4444' : card.priority === 'high' ? '#f59e0b' : '#818cf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {card.priority}
                </span>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {card.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)' }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity }}
            style={{ color: 'rgba(255,255,255,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
          >
            <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Scroll</span>
            <ChevronDown size={16} />
          </motion.div>
        </motion.div>
      </div>

      {/* FEATURES */}
      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1100, margin: '0 auto', padding: '80px 32px' }}>
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#818cf8', fontWeight: 700, marginBottom: 16 }}>
            Everything you need
          </div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(36px, 5vw, 56px)', color: 'white', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Built for people who<br />
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>actually ship things</span>
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
          {features.map(({ icon: Icon, title, desc, color }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6, boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)` }}
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 20, padding: '28px 24px',
                cursor: 'default',
                transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
              }}
            >
              <div style={{
                width: 50, height: 50, borderRadius: 14, marginBottom: 18,
                background: `${color}18`, border: `1px solid ${color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={22} color={color} />
              </div>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 17, color: 'white', marginBottom: 10, letterSpacing: '-0.01em' }}>
                {title}
              </h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, fontFamily: 'DM Sans, sans-serif', fontWeight: 300 }}>
                {desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA SECTION */}
      <div style={{ position: 'relative', zIndex: 2, padding: '80px 32px 120px', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          style={{
            maxWidth: 680, margin: '0 auto',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(52,211,153,0.08))',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 28, padding: '60px 48px',
            boxShadow: '0 0 80px rgba(99,102,241,0.1)',
          }}
        >
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(32px, 5vw, 48px)', color: 'white', marginBottom: 16, letterSpacing: '-0.03em' }}>
            Ready to build<br />something great?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 17, marginBottom: 36, fontFamily: 'DM Sans, sans-serif', fontWeight: 300 }}>
            Free to use. Deploys in minutes. AI included.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 20px 60px rgba(99,102,241,0.6)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/register')}
            style={{
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: 'white', border: 'none', padding: '18px 48px',
              borderRadius: 14, fontFamily: 'Syne, sans-serif', fontWeight: 700,
              fontSize: 17, cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
              display: 'inline-flex', alignItems: 'center', gap: 10,
            }}
          >
            Create Free Account <ArrowRight size={20} />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
