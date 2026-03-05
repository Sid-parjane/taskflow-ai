import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Sparkles, BarChart3, Brain, ArrowRight, CheckCircle2, Kanban, Shield } from 'lucide-react';

const WORDS = ['Smarter', 'Faster', 'Effortlessly', 'Intelligently'];

const features = [
  { icon: Brain,     title: 'AI Task Breakdown',  desc: 'AI decomposes complex goals into clear, actionable subtasks automatically.',          color: '#818cf8' },
  { icon: Sparkles,  title: 'Smart Generation',   desc: 'Describe a goal and AI creates a full task plan with priorities and time estimates.',  color: '#34d399' },
  { icon: BarChart3, title: 'Deep Analytics',     desc: 'Track completion rates, productivity trends, and time patterns visually.',            color: '#fbbf24' },
  { icon: Kanban,    title: 'Kanban Board',        desc: 'Flexible views for every workflow. Drag, drop, and organize effortlessly.',           color: '#f472b6' },
  { icon: Shield,    title: 'Secure & Private',   desc: 'JWT authentication and encrypted storage keeps your data safe always.',               color: '#60a5fa' },
  { icon: Zap,       title: 'Lightning Fast',     desc: 'Built with React + Vite for instant load times and smooth interactions.',             color: '#a78bfa' },
];

const MOCK_COLS = [
  { label:'Todo',        count:5, color:'#94a3b8', tasks:['Research competitors','Write brief','Set timeline'] },
  { label:'In Progress', count:3, color:'#818cf8', tasks:['Redesign landing','API integration','User testing'] },
  { label:'Review',      count:2, color:'#f59e0b', tasks:['Homepage copy','Mobile layouts'] },
  { label:'Done',        count:8, color:'#22c55e', tasks:['Auth setup','DB schema','Deploy infra'] },
];

export default function Landing() {
  const navigate = useNavigate();
  const [wordIdx, setWordIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setWordIdx(i => (i + 1) % WORDS.length), 2200);
    return () => clearInterval(t);
  }, []);

  const px = isMobile ? '20px' : '40px';

  return (
    <div style={{ minHeight:'100vh', background:'#060a10', color:'#f0f4ff', fontFamily:"'DM Sans',sans-serif", overflowX:'hidden' }}>

      {/* BG orbs */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }}>
        <div style={{ position:'absolute', top:'-10%', left: isMobile ? '0' : '20%', width: isMobile ? 300 : 600, height: isMobile ? 300 : 600, borderRadius:'50%', background:'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)' }} />
        <div style={{ position:'absolute', bottom:'5%', right:'-5%', width: isMobile ? 200 : 400, height: isMobile ? 200 : 400, borderRadius:'50%', background:'radial-gradient(circle, rgba(20,184,166,0.09) 0%, transparent 70%)' }} />
      </div>

      {/* ===== NAV ===== */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'space-between', padding:`14px ${px}`, background:'rgba(4,7,14,0.88)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
          <div style={{ width:30, height:30, borderRadius:8, background:'linear-gradient(135deg,#6366f1,#14b8a6)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 18px rgba(99,102,241,0.45)' }}>
            <Zap size={15} color="white" fill="white" />
          </div>
          <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:16, letterSpacing:'-0.01em' }}>
            TaskFlow<span style={{ color:'#818cf8' }}>AI</span>
          </span>
        </div>

        {isMobile ? (
          <button onClick={() => setMenuOpen(v => !v)} style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'8px 10px', color:'white', cursor:'pointer', display:'flex', alignItems:'center' }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        ) : (
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={() => navigate('/login')} style={{ padding:'9px 20px', borderRadius:10, background:'transparent', border:'1px solid rgba(255,255,255,0.12)', color:'#9ca3af', cursor:'pointer', fontSize:14, fontFamily:'inherit' }}>
              Sign In
            </button>
            <motion.button onClick={() => navigate('/register')} whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} style={{ padding:'9px 22px', borderRadius:10, background:'linear-gradient(135deg,#6366f1,#4f46e5)', border:'none', color:'white', cursor:'pointer', fontSize:14, fontWeight:600, fontFamily:'inherit', display:'flex', alignItems:'center', gap:6, boxShadow:'0 4px 18px rgba(99,102,241,0.4)' }}>
              Get Started <ArrowRight size={14} />
            </motion.button>
          </div>
        )}
      </nav>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {isMobile && menuOpen && (
          <motion.div
            initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }}
            style={{ position:'fixed', top:58, left:0, right:0, zIndex:99, background:'rgba(6,10,16,0.97)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.08)', padding:'16px 20px', display:'flex', flexDirection:'column', gap:10 }}
          >
            <button onClick={() => { navigate('/login'); setMenuOpen(false); }} style={{ padding:'12px 16px', borderRadius:10, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', color:'#d1d5db', cursor:'pointer', fontSize:15, fontFamily:'inherit', textAlign:'left' }}>
              Sign In
            </button>
            <button onClick={() => { navigate('/register'); setMenuOpen(false); }} style={{ padding:'12px 16px', borderRadius:10, background:'linear-gradient(135deg,#6366f1,#4f46e5)', border:'none', color:'white', cursor:'pointer', fontSize:15, fontWeight:600, fontFamily:'inherit', textAlign:'left' }}>
              Get Started Free →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== HERO ===== */}
      <div style={{ position:'relative', zIndex:1, paddingTop: isMobile ? 100 : 140, paddingBottom:80, maxWidth:1000, margin:'0 auto', padding: isMobile ? '100px 20px 60px' : '140px 40px 80px', textAlign:'center' }}>
        <motion.div initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>

          {/* Badge */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'5px 14px', borderRadius:100, marginBottom:24, background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.25)', fontSize:11, fontWeight:700, color:'#818cf8', textTransform:'uppercase', letterSpacing:'0.08em' }}>
            <Sparkles size={11} /> AI-Powered Productivity
          </div>

          {/* Animated headline */}
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize: isMobile ? '42px' : 'clamp(48px,7vw,82px)', lineHeight:1.05, letterSpacing:'-0.03em', marginBottom:8, color:'#f0f4ff' }}>
            Work{' '}
            <span style={{ display:'inline-block', minWidth: isMobile ? 180 : 260, verticalAlign:'bottom' }}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIdx}
                  initial={{ opacity:0, y:18, rotateX:-30 }}
                  animate={{ opacity:1, y:0, rotateX:0 }}
                  exit={{ opacity:0, y:-18, rotateX:30 }}
                  transition={{ duration:0.42, ease:[0.4,0,0.2,1] }}
                  style={{ display:'inline-block', background:'linear-gradient(135deg,#6366f1,#14b8a6,#ec4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}
                >
                  {WORDS[wordIdx]}
                </motion.span>
              </AnimatePresence>
            </span>
          </div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize: isMobile ? '42px' : 'clamp(48px,7vw,82px)', lineHeight:1.05, letterSpacing:'-0.03em', marginBottom:24, color:'#f0f4ff' }}>
            with AI
          </div>

          <p style={{ fontSize: isMobile ? 15 : 18, color:'#6b7db3', maxWidth:520, margin:'0 auto 36px', lineHeight:1.75 }}>
            The intelligent task manager that uses AI to break down goals, prioritize work, and help you achieve more — every single day.
          </p>

          {/* CTA buttons */}
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', marginBottom:32 }}>
            <motion.button onClick={() => navigate('/register')} whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
              style={{ padding: isMobile ? '13px 28px' : '14px 36px', fontSize: isMobile ? 15 : 16, fontWeight:600, fontFamily:'inherit', borderRadius:12, background:'linear-gradient(135deg,#6366f1,#4f46e5)', border:'none', color:'white', cursor:'pointer', display:'flex', alignItems:'center', gap:8, boxShadow:'0 4px 24px rgba(99,102,241,0.4)' }}>
              Start for free <ArrowRight size={17} />
            </motion.button>
            <motion.button onClick={() => navigate('/login')} whileHover={{ scale:1.02 }}
              style={{ padding: isMobile ? '13px 24px' : '14px 32px', fontSize: isMobile ? 15 : 16, fontFamily:'inherit', borderRadius:12, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.12)', color:'#d1d5db', cursor:'pointer' }}>
              Sign in
            </motion.button>
          </div>

          {/* Trust badges */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap: isMobile ? 16 : 24, flexWrap:'wrap', color:'#4b5563', fontSize:13 }}>
            {['Free forever','No credit card','Deploy in minutes'].map(text => (
              <div key={text} style={{ display:'flex', alignItems:'center', gap:6 }}>
                <CheckCircle2 size={13} color="#34d399" />
                <span style={{ color:'#6b7db3' }}>{text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ===== APP PREVIEW ===== */}
        <motion.div
          initial={{ opacity:0, y:60, scale:0.95 }}
          animate={{ opacity:1, y:0, scale:1 }}
          transition={{ duration:0.8, delay:0.35 }}
          style={{ marginTop:64, position:'relative' }}
        >
          <div style={{ background:'#0b1120', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding: isMobile ? 14 : 24, boxShadow:'0 40px 100px rgba(0,0,0,0.7), 0 0 60px rgba(99,102,241,0.08)', overflowX:'auto' }}>
            {/* Window dots */}
            <div style={{ display:'flex', gap:6, marginBottom:16 }}>
              {['#ef4444','#f59e0b','#22c55e'].map(c => <div key={c} style={{ width:10, height:10, borderRadius:'50%', background:c, opacity:0.8 }} />)}
            </div>
            {/* Kanban preview — 2 cols on mobile, 4 on desktop */}
            <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)', gap: isMobile ? 8 : 12, minWidth: isMobile ? 'auto' : 0 }}>
              {(isMobile ? MOCK_COLS.slice(0,2) : MOCK_COLS).map(col => (
                <div key={col.label} style={{ background:'rgba(255,255,255,0.02)', borderRadius:10, padding:10 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                    <span style={{ fontSize:9, fontWeight:700, color:col.color, textTransform:'uppercase', letterSpacing:'0.08em' }}>{col.label}</span>
                    <span style={{ fontSize:9, background:'rgba(255,255,255,0.06)', padding:'1px 5px', borderRadius:100, color:'#6b7db3' }}>{col.count}</span>
                  </div>
                  {col.tasks.slice(0, isMobile ? 2 : 3).map((t,i) => (
                    <div key={i} style={{ background:'#0e1526', borderRadius:6, padding:'7px 9px', marginBottom:5, border:'1px solid rgba(255,255,255,0.05)', borderLeft:`2px solid ${col.color}` }}>
                      <div style={{ fontSize:10, color:'#9ca3af', marginBottom:3 }}>{t}</div>
                      <div style={{ height:3, background:'rgba(255,255,255,0.05)', borderRadius:2, width:`${50+i*18}%` }} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div style={{ position:'absolute', bottom:-36, left:'10%', right:'10%', height:70, background:'rgba(99,102,241,0.18)', filter:'blur(36px)', borderRadius:'50%', zIndex:-1 }} />
        </motion.div>
      </div>

      {/* ===== FEATURES ===== */}
      <div style={{ position:'relative', zIndex:1, maxWidth:1000, margin:'0 auto', padding: isMobile ? '60px 20px' : '80px 40px' }}>
        <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} style={{ textAlign:'center', marginBottom:48 }}>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize: isMobile ? 28 : 'clamp(28px,4vw,44px)', fontWeight:800, marginBottom:12, color:'#f0f4ff', letterSpacing:'-0.02em', lineHeight:1.2 }}>
            Everything you need to stay{' '}
            <span style={{ background:'linear-gradient(135deg,#6366f1,#14b8a6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
              in flow
            </span>
          </h2>
          <p style={{ color:'#6b7db3', fontSize: isMobile ? 14 : 16 }}>Powerful features designed for how you actually work.</p>
        </motion.div>

        <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3,1fr)', gap: isMobile ? 10 : 16 }}>
          {features.map(({ icon:Icon, title, desc, color }, i) => (
            <motion.div key={title}
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.07 }}
              whileHover={{ y:-3 }}
              style={{ padding: isMobile ? '16px 14px' : '24px 22px', borderRadius:14, background:'#0b1120', border:'1px solid rgba(255,255,255,0.06)', transition:'all 0.2s' }}
            >
              <div style={{ width: isMobile ? 38 : 44, height: isMobile ? 38 : 44, borderRadius:11, marginBottom:12, background:`${color}18`, border:`1px solid ${color}30`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Icon size={isMobile ? 17 : 20} color={color} />
              </div>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize: isMobile ? 13 : 15, fontWeight:700, marginBottom:6, color:'#f0f4ff', lineHeight:1.3 }}>{title}</h3>
              {!isMobile && <p style={{ color:'#6b7db3', fontSize:13, lineHeight:1.65 }}>{desc}</p>}
            </motion.div>
          ))}
        </div>
      </div>

      {/* ===== CTA ===== */}
      <div style={{ position:'relative', zIndex:1, maxWidth:620, margin:'0 auto', padding: isMobile ? '20px 20px 80px' : '40px 40px 100px', textAlign:'center' }}>
        <motion.div
          initial={{ opacity:0, scale:0.96 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}
          style={{ padding: isMobile ? '36px 24px' : '48px 40px', borderRadius:22, background:'#0b1120', border:'1px solid rgba(99,102,241,0.3)', boxShadow:'0 0 60px rgba(99,102,241,0.08)' }}
        >
          <div style={{ fontSize:36, marginBottom:12 }}>🚀</div>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize: isMobile ? 26 : 32, fontWeight:800, marginBottom:12, color:'#f0f4ff', letterSpacing:'-0.02em' }}>
            Ready to level up?
          </h2>
          <p style={{ color:'#6b7db3', marginBottom:28, fontSize: isMobile ? 14 : 15, lineHeight:1.7 }}>
            Join TaskFlow AI and start accomplishing more with the power of AI.
          </p>
          <motion.button onClick={() => navigate('/register')} whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
            style={{ padding: isMobile ? '13px 32px' : '14px 44px', fontSize: isMobile ? 15 : 16, fontWeight:600, fontFamily:'inherit', borderRadius:12, background:'linear-gradient(135deg,#6366f1,#4f46e5)', border:'none', color:'white', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:8, boxShadow:'0 4px 24px rgba(99,102,241,0.4)' }}>
            Create free account <ArrowRight size={17} />
          </motion.button>
        </motion.div>
      </div>

      {/* ===== FOOTER ===== */}
      <div style={{ borderTop:'1px solid rgba(255,255,255,0.05)', padding: isMobile ? '20px 20px' : '24px 40px', textAlign:'center', color:'#374151', fontSize:12 }}>
        Built with ❤️ by <span style={{ color:'#818cf8' }}>Siddharth Parjane</span> · TaskFlow AI © 2026
      </div>
    </div>
  );
}
