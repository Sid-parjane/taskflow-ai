import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, Zap, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Demo login
  const demoLogin = async () => {
    setLoading(true);
    try {
      await login('demo@taskflow.ai', 'demo1234');
      toast.success('Logged in as demo user!');
      navigate('/dashboard');
    } catch {
      toast.error('Demo account not set up yet — please register!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:'var(--bg-primary)', padding: 20
    }}>
      {/* Background */}
      <div style={{ position:'fixed', inset:0, overflow:'hidden', pointerEvents:'none' }}>
        <div style={{
          position:'absolute', top:'20%', left:'50%', transform:'translateX(-50%)',
          width:500, height:500, borderRadius:'50%',
          background:'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)'
        }} />
      </div>

      <motion.div
        initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:0.5 }}
        style={{ width:'100%', maxWidth:440 }}
      >
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <Link to="/" style={{ textDecoration:'none', color:'inherit' }}>
            <div style={{
              width:48, height:48, borderRadius:14,
              background:'linear-gradient(135deg, #6366f1, #14b8a6)',
              display:'inline-flex', alignItems:'center', justifyContent:'center',
              boxShadow:'0 0 30px rgba(99,102,241,0.4)', marginBottom:16
            }}>
              <Zap size={22} color="white" fill="white" />
            </div>
          </Link>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:28, fontWeight:800, marginBottom:6 }}>
            Welcome back
          </h1>
          <p style={{ color:'var(--text-secondary)', fontSize:15 }}>Sign in to your TaskFlow account</p>
        </div>

        <div className="card" style={{ borderColor:'var(--border-bright)' }}>
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <div className="input-group">
              <label className="input-label">Email</label>
              <div className="input-icon-wrap">
                <Mail size={16} className="input-icon" />
                <input
                  type="email" className="input"
                  placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <div style={{ position:'relative' }}>
                <Lock size={16} className="input-icon" style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }} />
                <input
                  type={showPass ? 'text' : 'password'} className="input"
                  placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)}
                  style={{ paddingLeft:42, paddingRight:42 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'transparent', border:'none', color:'var(--text-muted)', cursor:'pointer' }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit" className="btn btn-primary"
              style={{ width:'100%', justifyContent:'center', padding:'13px' }}
              disabled={loading}
            >
              {loading ? <span className="spinner" style={{ width:18, height:18, borderWidth:2 }} /> : <>Sign in <ArrowRight size={16} /></>}
            </button>
          </form>

          <div style={{ display:'flex', alignItems:'center', gap:12, margin:'16px 0' }}>
            <div style={{ flex:1, height:1, background:'var(--border)' }} />
            <span style={{ fontSize:12, color:'var(--text-muted)' }}>or</span>
            <div style={{ flex:1, height:1, background:'var(--border)' }} />
          </div>

          <button
            onClick={demoLogin} disabled={loading}
            className="btn btn-secondary"
            style={{ width:'100%', justifyContent:'center' }}
          >
            🎮 Try Demo Account
          </button>
        </div>

        <p style={{ textAlign:'center', marginTop:20, color:'var(--text-secondary)', fontSize:14 }}>
          No account?{' '}
          <Link to="/register" style={{ color:'var(--accent-bright)', fontWeight:600, textDecoration:'none' }}>
            Create one free
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
