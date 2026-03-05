import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { User, Shield, Save, LogOut, Trash2 } from 'lucide-react';

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
    <div style={{ maxWidth: 580 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your account and preferences</p>
        </div>
      </div>

      {/* Profile */}
      <motion.div className="card" style={{ marginBottom: 16 }}
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <User size={17} color="#818cf8" />
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>Profile</h2>
        </div>

        {/* Avatar row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 18, flexShrink: 0,
            background: 'linear-gradient(135deg, #6366f1, #14b8a6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 800, color: 'white',
            boxShadow: '0 0 20px rgba(99,102,241,0.3)',
          }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{user?.name}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 2 }}>{user?.email}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="input-group">
            <label className="input-label">Display Name</label>
            <input
              type="text" className="input"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveProfile()}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              type="text" className="input"
              value={user?.email} disabled
              style={{ opacity: 0.55, cursor: 'not-allowed' }}
            />
          </div>
          <button
            onClick={saveProfile}
            className="btn btn-primary"
            style={{ alignSelf: 'flex-start' }}
            disabled={saving || !name.trim()}
          >
            {saving ? 'Saving...' : <><Save size={14} /> Save Changes</>}
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div className="card" style={{ marginBottom: 16 }}
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <Shield size={17} color="#34d399" />
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>Your Stats</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { label: 'Tasks Created',   value: user?.stats?.tasksCreated   || 0, color: '#818cf8' },
            { label: 'Tasks Completed', value: user?.stats?.tasksCompleted || 0, color: '#34d399' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ padding: '18px 16px', background: 'var(--bg-elevated)', borderRadius: 12, textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Completion rate bar */}
        {(user?.stats?.tasksCreated || 0) > 0 && (
          <div style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Completion Rate</span>
              <span style={{ fontSize: 12, fontWeight: 700 }}>
                {Math.round(((user?.stats?.tasksCompleted || 0) / user.stats.tasksCreated) * 100)}%
              </span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${Math.min(((user?.stats?.tasksCompleted || 0) / user.stats.tasksCreated) * 100, 100)}%` }} />
            </div>
          </div>
        )}
      </motion.div>

      {/* Account Actions */}
      <motion.div className="card"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <LogOut size={17} color="#f87171" />
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>Account</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={() => { logout(); }}
            className="btn btn-secondary"
            style={{ justifyContent: 'flex-start', gap: 10 }}
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </motion.div>
    </div>
  );
}
