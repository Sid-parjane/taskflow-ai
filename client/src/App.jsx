import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TasksProvider } from './context/TasksContext';
import CustomCursor from './components/CustomCursor';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Board from './pages/Board';
import TaskList from './pages/TaskList';
import AIStudio from './pages/AIStudio';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Contact from './pages/Contact';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--bg-void)' }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
        <div className="spinner" />
        <span style={{ fontSize:13, color:'var(--text-secondary)', fontFamily:'var(--font-body)' }}>Loading...</span>
      </div>
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/board" element={<ProtectedRoute><Layout><Board /></Layout></ProtectedRoute>} />
      <Route path="/tasks" element={<ProtectedRoute><Layout><TaskList /></Layout></ProtectedRoute>} />
      <Route path="/ai-studio" element={<ProtectedRoute><Layout><AIStudio /></Layout></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Layout><Analytics /></Layout></ProtectedRoute>} />
      <Route path="/contact" element={<ProtectedRoute><Layout><Contact /></Layout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TasksProvider>
          {/* Custom cursor — works on all pages */}
           <CustomCursor /> 

          <AppRoutes />

          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: 'rgba(11,17,32,0.95)',
                color: '#f0f4ff',
                border: '1px solid rgba(255,255,255,0.08)',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
                borderRadius: '12px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                letterSpacing: '-0.01em',
              },
              success: {
                iconTheme: { primary: '#34d399', secondary: 'rgba(11,17,32,0.95)' },
              },
              error: {
                iconTheme: { primary: '#f87171', secondary: 'rgba(11,17,32,0.95)' },
              },
            }}
          />
        </TasksProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
