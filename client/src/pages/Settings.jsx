import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { User, Bell, Palette, Shield, ChevronRight, Save } from 'lucide-react';

export default function Settings() {
  const { user, updateUser, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await authAPI.updateProfile({ name });
      updateUser(res.data.user);
      toast.success('Profile saved!');
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth:640 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your account and preferences</p>
        </div>
      </div>

      {/* Profile */}
      <motion.div className="card" style={{ marginBottom:20 }} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
          <User size={18} color="var(--accent-bright)" />
          <h2 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:17 }}>Profile</h2>
        </div>

        {/* Avatar */}
        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24 }}>
          <div style={{
            width:64, height:64, borderRadius:20,
            background:'linear-gradient(135deg, var(--accent), var(--teal))',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:24, fontWeight:800
          }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight:700, fontSize:16 }}>{user?.name}</div>
            <div style={{ color:'var(--text-secondary)', fontSize:13 }}>{user?.email}</div>
          </div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div className="input-group">
            <label className="input-label">Display Name</label>
            <input type="text" className="input" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Email</label>
            <input type="text" className="input" value={user?.email} disabled style={{ opacity:0.6 }} />
          </div>
          <button onClick={saveProfile} className="btn btn-primary" style={{ alignSelf:'flex-start' }} disabled={saving}>
            {saving ? 'Saving...' : <><Save size={15} /> Save Changes</>}
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div className="card" style={{ marginBottom:20 }} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
          <Shield size={18} color="var(--green)" />
          <h2 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:17 }}>Your Stats</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          {[
            { label:'Tasks Created', value:user?.stats?.tasksCreated || 0 },
            { label:'Tasks Completed', value:user?.stats?.tasksCompleted || 0 },
          ].map(({ label, value }) => (
            <div key={label} style={{ padding:16, background:'var(--bg-elevated)', borderRadius:'var(--radius-md)', textAlign:'center' }}>
              <div style={{ fontFamily:'var(--font-display)', fontSize:32, fontWeight:800, color:'var(--accent-bright)' }}>{value}</div>
              <div style={{ fontSize:13, color:'var(--text-secondary)', marginTop:4 }}>{label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Deployment instructions */}
      <motion.div className="card" style={{ borderColor:'rgba(99,102,241,0.3)' }} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
          <Palette size={18} color="var(--teal)" />
          <h2 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:17 }}>Deployment Info</h2>
        </div>
        <div style={{ padding:16, background:'var(--bg-elevated)', borderRadius:'var(--radius-md)', fontSize:13, color:'var(--text-secondary)', lineHeight:1.8 }}>
          <p><strong style={{ color:'var(--text-primary)' }}>Frontend</strong> → Deploy on <strong style={{ color:'var(--accent-bright)' }}>Vercel</strong> (free)</p>
          <p><strong style={{ color:'var(--text-primary)' }}>Backend</strong> → Deploy on <strong style={{ color:'var(--accent-bright)' }}>Render</strong> (free)</p>
          <p><strong style={{ color:'var(--text-primary)' }}>Database</strong> → <strong style={{ color:'var(--accent-bright)' }}>MongoDB Atlas</strong> (free tier)</p>
          <p style={{ marginTop:8 }}>See <strong>README.md</strong> for full deployment guide.</p>
        </div>
      </motion.div>
    </div>
  );
}
