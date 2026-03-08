import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, User, Zap, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return toast.error('Please fill all fields');
    if (password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Account created! Welcome to TaskFlow 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColors = ['', '#ef4444', '#f59e0b', '#22c55e'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Strong'];

  return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:'var(--bg-primary)', padding:20
    }}>
      <div style={{ position:'fixed', inset:0, overflow:'hidden', pointerEvents:'none' }}>
        <motion.div
          animate={{ x:[0,-20,15,0], y:[0,15,-20,0], scale:[1,1.04,0.96,1] }}
          transition={{ duration:20, repeat:Infinity, ease:'linear' }}
          style={{
            position:'absolute', top:'20%', right:'20%',
            width:400, height:400, borderRadius:'50%',
            background:'radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%)',
            filter:'blur(40px)',
          }}
        />
        <motion.div
          animate={{ x:[0,15,-20,0], y:[0,-15,10,0] }}
          transition={{ duration:24, repeat:Infinity, ease:'linear' }}
          style={{
            position:'absolute', bottom:'15%', left:'15%',
            width:300, height:300, borderRadius:'50%',
            background:'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)',
            filter:'blur(40px)',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:0.5 }}
        style={{ width:'100%', maxWidth:440 }}
      >
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <Link to="/" style={{ textDecoration:'none', color:'inherit' }}>
            <motion.div
              initial={{ scale:0, rotate:-180 }}
              animate={{ scale:1, rotate:0 }}
              transition={{ type:'spring', stiffness:200, damping:15 }}
              style={{
                width:48, height:48, borderRadius:14,
                background:'linear-gradient(135deg, #6366f1, #14b8a6)',
                display:'inline-flex', alignItems:'center', justifyContent:'center',
                boxShadow:'0 0 30px rgba(99,102,241,0.4)', marginBottom:16
              }}
            >
              <Zap size={22} color="white" fill="white" />
            </motion.div>
          </Link>
          <motion.h1
            initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.2 }}
            style={{ fontFamily:'var(--font-display)', fontSize:28, fontWeight:800, marginBottom:6 }}
          >
            Create account
          </motion.h1>
          <motion.p
            initial={{ opacity:0 }} animate={{ opacity:1 }}
            transition={{ delay:0.3 }}
            style={{ color:'var(--text-secondary)', fontSize:15 }}
          >
            Start managing tasks intelligently
          </motion.p>
        </div>

        <motion.div
          className="card"
          style={{ borderColor:'var(--border-bright)' }}
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.35, type:'spring', stiffness:200, damping:20 }}
        >
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <div className="input-icon-wrap">
                <User size={16} className="input-icon" />
                <input
                  type="text" className="input"
                  placeholder="John Doe"
                  value={name} onChange={e => setName(e.target.value)}
                />
              </div>
            </div>

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
                <Lock size={16} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }} />
                <input
                  type={showPass ? 'text' : 'password'} className="input"
                  placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)}
                  style={{ paddingLeft:42, paddingRight:42 }}
                />
                <button
                  type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'transparent', border:'none', color:'var(--text-muted)', cursor:'pointer' }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {password.length > 0 && (
                <div style={{ display:'flex', gap:4, marginTop:8 }}>
                  {[1,2,3].map(i => (
                    <div key={i} style={{
                      flex:1, height:3, borderRadius:2,
                      background: i <= strength ? strengthColors[strength] : 'var(--border)',
                      transition:'background 0.3s'
                    }} />
                  ))}
                  <span style={{ fontSize:11, color:strengthColors[strength], fontWeight:600 }}>
                    {strengthLabels[strength]}
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit" className="btn btn-primary"
              style={{ width:'100%', justifyContent:'center', padding:'13px' }}
              disabled={loading}
            >
              {loading ? <span className="spinner" style={{ width:18, height:18, borderWidth:2 }} /> : <>Create account <ArrowRight size={16} /></>}
            </button>
          </form>
        </motion.div>

        <motion.p
          initial={{ opacity:0 }} animate={{ opacity:1 }}
          transition={{ delay:0.5 }}
          style={{ textAlign:'center', marginTop:20, color:'var(--text-secondary)', fontSize:14 }}
        >
          Already have an account?{' '}
          <Link to="/login" style={{ color:'var(--accent-bright)', fontWeight:600, textDecoration:'none' }}>
            Sign in
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
