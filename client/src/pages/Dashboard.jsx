import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TasksContext';
import { aiAPI } from '../utils/api';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { useWindowSize } from '../hooks/useWindowSize';
import { format } from 'date-fns';
import {
  CheckCircle2, ListTodo, AlertTriangle,
  Sparkles, Plus, Zap, TrendingUp, Calendar, Brain, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

const categoryEmoji = { work:'💼', personal:'🌟', health:'💪', learning:'📚', finance:'💰', creative:'🎨', other:'📌' };

function AnimatedCounter({ value, duration = 1.2 }) {
  const [display, setDisplay] = useState(0);
  const prevValue = useRef(0);

  useEffect(() => {
    const start = prevValue.current;
    const end = typeof value === 'number' ? value : 0;
    if (start === end) return;
    const startTime = performance.now();
    const animate = (now) => {
      const elapsed = (now - startTime) / (duration * 1000);
      if (elapsed >= 1) {
        setDisplay(end);
        prevValue.current = end;
        return;
      }
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, duration]);

  return <>{display}</>;
}

export default function Dashboard() {
  const { user } = useAuth();
  const { tasks, stats, fetchTasks, fetchStats } = useTasks();
  const { isMobile } = useWindowSize();
  const [editTask, setEditTask] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [dailyPlan, setDailyPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState(null);

  useEffect(() => { fetchTasks(); fetchStats(); }, []);

  const getDailyPlan = async () => {
    setPlanLoading(true);
    setPlanError(null);
    setDailyPlan(null);
    try {
      const res = await aiAPI.dailyPlan();
      if (res.data?.motivationalMessage || res.data?.topTasks) {
        setDailyPlan(res.data);
        toast.success('Daily plan ready!');
      } else {
        setPlanError('Unexpected response from AI.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'AI error';
      setPlanError(msg);
      toast.error('AI failed: ' + msg);
    } finally {
      setPlanLoading(false);
    }
  };

  const recentTasks = tasks.filter(t => t.status !== 'done').slice(0, 6);
  const todayTasks = tasks.filter(t => {
    if (!t.dueDate) return false;
    return new Date(t.dueDate).toDateString() === new Date().toDateString();
  });

  const greetingHour = new Date().getHours();
  const greeting = greetingHour < 12 ? 'Good morning' : greetingHour < 17 ? 'Good afternoon' : 'Good evening';

  const statCards = [
    { label:'Total', value: stats?.total || 0, icon: ListTodo, color: '#818cf8', bg: 'rgba(99,102,241,0.1)' },
    { label:'Done', value: stats?.byStatus?.find(s=>s._id==='done')?.count || 0, icon: CheckCircle2, color:'#34d399', bg:'rgba(52,211,153,0.1)' },
    { label:'Active', value: stats?.byStatus?.find(s=>s._id==='in-progress')?.count || 0, icon: TrendingUp, color:'#818cf8', bg:'rgba(99,102,241,0.1)' },
    { label:'Overdue', value: stats?.overdue || 0, icon: AlertTriangle, color:'#f87171', bg:'rgba(248,113,113,0.1)' },
  ];

  return (
    <div style={{ maxWidth: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <motion.h1 className="page-title" initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }}>
            {greeting}, {user?.name?.split(' ')[0]} 👋
          </motion.h1>
          <p className="page-subtitle">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)} style={isMobile ? { width:'100%' } : {}}>
          <Plus size={16} /> New Task
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {statCards.map(({ label, value, icon:Icon, color, bg }, i) => (
          <motion.div key={label} className="stat-card"
            initial={{ opacity:0, y:20, scale:0.95 }}
            animate={{ opacity:1, y:0, scale:1 }}
            transition={{ delay: i * 0.1, type:'spring', stiffness:300, damping:24 }}
            whileHover={{ y:-4, transition:{ duration:0.2 } }}
          >
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
              <div>
                <div className="stat-value" style={{ color }}><AnimatedCounter value={value} /></div>
                <div className="stat-label">{label}</div>
              </div>
              <motion.div
                style={{ padding:8, borderRadius:10, background:bg, flexShrink:0 }}
                whileHover={{ scale:1.15, rotate:5 }}
                transition={{ type:'spring', stiffness:400 }}
              >
                <Icon size={18} color={color} />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main grid — stacks on mobile */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 320px',
        gap: isMobile ? 16 : 24,
        alignItems: 'start',
      }}>
        {/* Tasks column */}
        <div>
          {todayTasks.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
                <Calendar size={16} color="#fbbf24" />
                <h2 style={{ fontFamily:'var(--font-display)', fontSize:16, fontWeight:700 }}>Due Today</h2>
                <span className="kanban-col-count">{todayTasks.length}</span>
              </div>
              {todayTasks.map(task => <TaskCard key={task._id} task={task} onEdit={setEditTask} />)}
            </div>
          )}

          <div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
              <Zap size={16} color="#818cf8" />
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:16, fontWeight:700 }}>Active Tasks</h2>
              <span className="kanban-col-count">{recentTasks.length}</span>
            </div>

            {recentTasks.length === 0 ? (
              <motion.div className="empty-state" initial={{ opacity:0 }} animate={{ opacity:1 }}>
                <div className="empty-icon">✅</div>
                <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700 }}>All caught up!</h3>
                <p style={{ color:'var(--text-secondary)', fontSize:13 }}>Create a task to get started.</p>
                <button className="btn btn-primary btn-sm" onClick={() => setShowCreate(true)}>
                  <Plus size={13} /> Add Task
                </button>
              </motion.div>
            ) : (
              recentTasks.map(task => <TaskCard key={task._id} task={task} onEdit={setEditTask} />)
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

          {/* AI Daily Plan */}
          <div className="card ai-glow-border">
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
              <Brain size={17} color="#818cf8" />
              <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15 }}>AI Daily Plan</h3>
            </div>

            {planError && (
              <div style={{ marginBottom:12 }}>
                <div style={{ padding:10, background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.2)', borderRadius:8, fontSize:12, color:'#f87171', marginBottom:8 }}>
                  ⚠️ {planError}
                </div>
                <button onClick={getDailyPlan} className="btn btn-secondary" style={{ width:'100%' }} disabled={planLoading}>
                  <RefreshCw size={13} /> Try Again
                </button>
              </div>
            )}

            {!dailyPlan && !planError && (
              <div>
                <p style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:14, lineHeight:1.6 }}>
                  Let AI analyze your tasks and build a plan for today.
                </p>
                <button onClick={getDailyPlan} className="btn btn-primary" style={{ width:'100%' }} disabled={planLoading}>
                  {planLoading
                    ? <span style={{ display:'flex', alignItems:'center', gap:8 }}><div className="typing-dots"><span/><span/><span/></div> Thinking...</span>
                    : <><Sparkles size={15} /> Generate Plan</>
                  }
                </button>
              </div>
            )}

            {dailyPlan && !planError && (
              <div>
                {dailyPlan.motivationalMessage && (
                  <div style={{ padding:10, background:'rgba(99,102,241,0.08)', borderRadius:8, marginBottom:12, fontSize:12, color:'var(--text-secondary)', lineHeight:1.6, fontStyle:'italic', border:'1px solid rgba(99,102,241,0.12)' }}>
                    "{dailyPlan.motivationalMessage}"
                  </div>
                )}
                {dailyPlan.topTasks?.length > 0 && (
                  <>
                    <div style={{ fontSize:10, fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>Focus On Today</div>
                    {dailyPlan.topTasks.map((t, i) => (
                      <div key={i} style={{ display:'flex', gap:8, padding:'7px 0', borderBottom:'1px solid var(--border)' }}>
                        <span style={{ fontSize:12, color:'#818cf8', fontWeight:700, minWidth:16 }}>{i+1}.</span>
                        <span style={{ fontSize:12, lineHeight:1.5 }}>{t}</span>
                      </div>
                    ))}
                  </>
                )}
                {dailyPlan.reasoning && (
                  <p style={{ fontSize:11, color:'var(--text-muted)', marginTop:10, lineHeight:1.6 }}>{dailyPlan.reasoning}</p>
                )}
                <button onClick={getDailyPlan} className="btn btn-ghost btn-sm" style={{ marginTop:12, width:'100%' }} disabled={planLoading}>
                  {planLoading ? <span style={{ display:'flex', alignItems:'center', gap:6 }}><div className="typing-dots"><span/><span/><span/></div></span> : <><RefreshCw size={12} /> Regenerate</>}
                </button>
              </div>
            )}
          </div>

          {/* Progress */}
          {user?.stats && (
            <div className="card">
              <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15, marginBottom:14 }}>Your Progress</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <span style={{ fontSize:13, color:'var(--text-secondary)' }}>Created</span>
                  <span style={{ fontSize:13, fontWeight:700 }}>{user.stats.tasksCreated}</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <span style={{ fontSize:13, color:'var(--text-secondary)' }}>Completed</span>
                  <span style={{ fontSize:13, fontWeight:700, color:'#34d399' }}>{user.stats.tasksCompleted}</span>
                </div>
                {user.stats.tasksCreated > 0 && (
                  <div>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                      <span style={{ fontSize:11, color:'var(--text-muted)' }}>Rate</span>
                      <span style={{ fontSize:11, fontWeight:700 }}>{Math.round((user.stats.tasksCompleted/user.stats.tasksCreated)*100)}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width:`${Math.min((user.stats.tasksCompleted/user.stats.tasksCreated)*100,100)}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Category */}
          {stats?.byCategory?.length > 0 && (
            <div className="card">
              <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15, marginBottom:14 }}>By Category</h3>
              {stats.byCategory.sort((a,b) => b.count - a.count).map(({ _id, count }) => (
                <div key={_id} style={{ marginBottom:8 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                    <span style={{ fontSize:12, color:'var(--text-secondary)' }}>{categoryEmoji[_id] || '📌'} {_id.charAt(0).toUpperCase()+_id.slice(1)}</span>
                    <span style={{ fontSize:12, fontWeight:600 }}>{count}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width:`${(count/stats.total)*100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {(showCreate || editTask) && (
        <TaskModal
          task={editTask}
          onClose={() => { setShowCreate(false); setEditTask(null); fetchTasks(); fetchStats(); }}
        />
      )}
    </div>
  );
}
