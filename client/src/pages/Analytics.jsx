import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useTasks } from '../context/TasksContext';
import { useWindowSize } from '../hooks/useWindowSize';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, CheckCircle2, Clock, Target } from 'lucide-react';

function AnimatedCounter({ value, suffix = '', duration = 1.2 }) {
  const [display, setDisplay] = useState(0);
  const prevValue = useRef(0);
  const numValue = typeof value === 'string' ? parseInt(value) || 0 : value;

  useEffect(() => {
    const start = prevValue.current;
    const end = numValue;
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
  }, [numValue, duration]);

  return <>{display}{suffix}</>;
}

const STATUS_COLORS = { 'todo':'#94a3b8', 'in-progress':'#818cf8', 'review':'#f59e0b', 'done':'#22c55e' };
const PRIORITY_COLORS = { low:'#94a3b8', medium:'#818cf8', high:'#f59e0b', critical:'#ef4444' };
const CATEGORY_COLORS = ['#6366f1','#14b8a6','#ec4899','#f59e0b','#22c55e','#3b82f6','#a855f7'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'var(--bg-elevated)', border:'1px solid var(--border-bright)', borderRadius:8, padding:'8px 12px', fontSize:12 }}>
      {label && <div style={{ fontWeight:700, marginBottom:3 }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ color:p.color }}>{p.name}: <strong>{p.value}</strong></div>
      ))}
    </div>
  );
};

export default function Analytics() {
  const { tasks, stats, fetchTasks, fetchStats } = useTasks();
  const { isMobile } = useWindowSize();

  useEffect(() => { fetchTasks(); fetchStats(); }, []);

  const statusData = (stats?.byStatus || []).map(s => ({
    name: s._id.replace('-',' ').replace(/\b\w/g,l=>l.toUpperCase()),
    value: s.count, color: STATUS_COLORS[s._id] || '#94a3b8'
  }));

  const priorityData = (stats?.byPriority || []).map(p => ({
    name: p._id.charAt(0).toUpperCase() + p._id.slice(1),
    count: p.count, color: PRIORITY_COLORS[p._id] || '#94a3b8'
  }));

  const categoryData = (stats?.byCategory || []).map((c, i) => ({
    name: c._id.charAt(0).toUpperCase() + c._id.slice(1),
    value: c.count, color: CATEGORY_COLORS[i % CATEGORY_COLORS.length]
  }));

  const last7days = Array.from({length:7}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return { day: d.toLocaleDateString('en', { weekday: isMobile ? 'narrow' : 'short' }), date: d.toDateString(), created:0, completed:0 };
  });
  tasks.forEach(t => {
    const created = new Date(t.createdAt).toDateString();
    const day = last7days.find(d => d.date === created);
    if (day) day.created++;
    if (t.completedAt) {
      const cDay = last7days.find(d => d.date === new Date(t.completedAt).toDateString());
      if (cDay) cDay.completed++;
    }
  });

  const completionRate = stats?.total
    ? Math.round((stats.byStatus?.find(s=>s._id==='done')?.count || 0) / stats.total * 100) : 0;
  const totalTime = tasks.reduce((sum,t) => sum + (t.timeEstimate||0), 0);
  const avgTime = tasks.length ? Math.round(totalTime/tasks.length) : 0;

  const chartHeight = isMobile ? 180 : 220;

  return (
    <div style={{ maxWidth:'100%', overflow:'hidden' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Track your productivity over time</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {[
          { label:'Completion', value:completionRate, suffix:'%', icon:Target, color:'#818cf8' },
          { label:'Total Tasks', value:stats?.total||0, suffix:'', icon:CheckCircle2, color:'#34d399' },
          { label:'Avg Time', value:avgTime, suffix:'m', icon:Clock, color:'#fbbf24' },
          { label:'Overdue', value:stats?.overdue||0, suffix:'', icon:TrendingUp, color:'#f87171' },
        ].map(({ label, value, suffix, icon:Icon, color }, i) => (
          <motion.div key={label} className="stat-card"
            initial={{ opacity:0, y:20, scale:0.95 }}
            animate={{ opacity:1, y:0, scale:1 }}
            transition={{ delay: i * 0.1, type:'spring', stiffness:300, damping:24 }}
            whileHover={{ y:-4, transition:{ duration:0.2 } }}
          >
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
              <div>
                <div className="stat-value" style={{ color }}><AnimatedCounter value={value} suffix={suffix} /></div>
                <div className="stat-label">{label}</div>
              </div>
              <motion.div
                style={{ padding:8, borderRadius:10, background:`${color}20`, flexShrink:0 }}
                whileHover={{ scale:1.15, rotate:5 }}
                transition={{ type:'spring', stiffness:400 }}
              >
                <Icon size={18} color={color} />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts grid — 1 col on mobile, 2 col on desktop */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? 12 : 20,
      }}>

        {/* 7-Day Activity */}
        <motion.div className="card"
          initial={{ opacity:0, y:20, scale:0.98 }} animate={{ opacity:1, y:0, scale:1 }}
          transition={{ delay:0.2, type:'spring', stiffness:200, damping:20 }}
        >
          <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15, marginBottom:16 }}>7-Day Activity</h3>
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={last7days} barGap={2} margin={{ left: -20, right: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill:'var(--text-muted)', fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'var(--text-muted)', fontSize:11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill:'rgba(255,255,255,0.03)' }} />
              <Legend wrapperStyle={{ fontSize:11, color:'var(--text-secondary)' }} />
              <Bar dataKey="created" name="Created" fill="#6366f1" radius={[3,3,0,0]} />
              <Bar dataKey="completed" name="Completed" fill="#22c55e" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Status Breakdown */}
        <motion.div className="card"
          initial={{ opacity:0, y:20, scale:0.98 }} animate={{ opacity:1, y:0, scale:1 }}
          transition={{ delay:0.3, type:'spring', stiffness:200, damping:20 }}
        >
          <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15, marginBottom:16 }}>Status Breakdown</h3>
          {statusData.length ? (
            <ResponsiveContainer width="100%" height={chartHeight}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={isMobile ? 40 : 55} outerRadius={isMobile ? 65 : 85} paddingAngle={3} dataKey="value">
                  {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize:11, color:'var(--text-secondary)' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding:32 }}>
              <p style={{ color:'var(--text-muted)', fontSize:13 }}>No task data yet</p>
            </div>
          )}
        </motion.div>

        {/* Priority Distribution */}
        <motion.div className="card"
          initial={{ opacity:0, y:20, scale:0.98 }} animate={{ opacity:1, y:0, scale:1 }}
          transition={{ delay:0.4, type:'spring', stiffness:200, damping:20 }}
        >
          <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15, marginBottom:16 }}>Priority Distribution</h3>
          {priorityData.length ? (
            <ResponsiveContainer width="100%" height={chartHeight}>
              <BarChart data={priorityData} layout="vertical" margin={{ left: 0, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={{ fill:'var(--text-muted)', fontSize:11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fill:'var(--text-secondary)', fontSize:11 }} axisLine={false} tickLine={false} width={60} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill:'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="count" name="Tasks" radius={[0,4,4,0]}>
                  {priorityData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding:32 }}>
              <p style={{ color:'var(--text-muted)', fontSize:13 }}>No task data yet</p>
            </div>
          )}
        </motion.div>

        {/* Categories */}
        <motion.div className="card"
          initial={{ opacity:0, y:20, scale:0.98 }} animate={{ opacity:1, y:0, scale:1 }}
          transition={{ delay:0.5, type:'spring', stiffness:200, damping:20 }}
        >
          <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15, marginBottom:16 }}>Categories</h3>
          {categoryData.length ? (
            <ResponsiveContainer width="100%" height={chartHeight}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={isMobile ? 65 : 85} paddingAngle={3} dataKey="value">
                  {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize:11, color:'var(--text-secondary)' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding:32 }}>
              <p style={{ color:'var(--text-muted)', fontSize:13 }}>No task data yet</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
