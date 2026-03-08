import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Kanban, ListTodo, Sparkles,
  BarChart3, Settings, LogOut, Menu, X, Zap, ChevronRight
} from 'lucide-react';
import { Mail } from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/board', label: 'Kanban Board', icon: Kanban },
  { path: '/tasks', label: 'All Tasks', icon: ListTodo },
  { path: '/ai-studio', label: 'AI Studio', icon: Sparkles },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/contact', label: 'Contact', icon: Mail },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on route change
  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/'); };

  const SidebarContent = ({ onClose }) => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 4px' }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(135deg, #6366f1, #14b8a6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99,102,241,0.4)',
          }}>
            <Zap size={17} color="white" fill="white" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, letterSpacing: '-0.01em' }}>
              TaskFlow
            </div>
            <div style={{ fontSize: 9, color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              AI Powered
            </div>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 4, display: 'flex' }}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              className={`nav-link ${isActive ? 'active' : ''}`}
              onClick={() => { navigate(path); onClose?.(); }}
            >
              <Icon size={17} />
              <span>{label}</span>
              {isActive && <ChevronRight size={13} style={{ marginLeft: 'auto', color: '#818cf8' }} />}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, marginTop: 14 }}>
        <button
          className="nav-link"
          onClick={() => { navigate('/settings'); onClose?.(); }}
        >
          <Settings size={17} />
          <span>Settings</span>
        </button>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 9,
          padding: '10px', marginTop: 6,
          borderRadius: 12, background: 'var(--bg-elevated)',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #6366f1, #14b8a6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: 'white',
          }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.email}
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 4, display: 'flex', borderRadius: 6 }}
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-void)' }}>

      {/* Animated background orbs */}
      <div className="animated-orb animated-orb-1" />
      <div className="animated-orb animated-orb-2" />
      <div className="animated-orb animated-orb-3" />

      {/* ===== DESKTOP SIDEBAR ===== */}
      {!isMobile && (
        <aside style={{
          width: 240, minWidth: 240, flexShrink: 0,
          background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-void) 100%)',
          borderRight: '1px solid var(--border)',
          padding: '24px 14px',
          position: 'fixed', left: 0, top: 0, height: '100vh',
          zIndex: 50, overflowY: 'auto',
        }}>
          <SidebarContent />
        </aside>
      )}

      {/* ===== MOBILE SIDEBAR OVERLAY ===== */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.75)',
                backdropFilter: 'blur(4px)',
                zIndex: 98,
              }}
            />
            <motion.aside
              initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              style={{
                position: 'fixed', left: 0, top: 0, height: '100vh',
                width: 260, zIndex: 99,
                background: 'linear-gradient(180deg, #090e1a 0%, var(--bg-void) 100%)',
                borderRight: '1px solid var(--border)',
                padding: '24px 14px',
                overflowY: 'auto',
              }}
            >
              <SidebarContent onClose={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ===== MAIN CONTENT ===== */}
      <main style={{
        flex: 1,
        marginLeft: isMobile ? 0 : 240,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Mobile top bar */}
        {isMobile && (
          <div style={{
            position: 'sticky', top: 0, zIndex: 40,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px',
            background: 'rgba(6,10,16,0.92)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: 'linear-gradient(135deg, #6366f1, #14b8a6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 16px rgba(99,102,241,0.4)',
              }}>
                <Zap size={15} color="white" fill="white" />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15 }}>
                TaskFlow<span style={{ color: '#818cf8' }}>AI</span>
              </span>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setSidebarOpen(true)}
              style={{
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                borderRadius: 10, padding: '8px 10px', cursor: 'pointer',
                color: 'var(--text-primary)', display: 'flex', alignItems: 'center',
              }}
            >
              <Menu size={18} />
            </motion.button>
          </div>
        )}

        {/* Page content */}
        <div style={{ padding: isMobile ? '20px 16px' : '36px 40px', flex: 1 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 18, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.99 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
