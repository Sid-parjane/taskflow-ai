import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks } from '../context/TasksContext';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { Search, Filter, Plus, Trash2, SlidersHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TaskList() {
  const { tasks, loading, fetchTasks, deleteCompleted, filters, setFilters } = useTasks();
  const [editTask, setEditTask] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const filtered = tasks.filter(t => {
    if (filters.status && t.status !== filters.status) return false;
    if (filters.priority && t.priority !== filters.priority) return false;
    if (filters.category && t.category !== filters.category) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) &&
        !t.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const clearFilters = () => setFilters({ status:'', priority:'', category:'' });
  const hasFilters = filters.status || filters.priority || filters.category || search;

  const handleDeleteCompleted = async () => {
    if (!confirm('Delete all completed tasks?')) return;
    await deleteCompleted();
    toast.success('Completed tasks deleted');
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">All Tasks</h1>
          <p className="page-subtitle">{filtered.length} task{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <div style={{ display:'flex', gap:12 }}>
          <button onClick={handleDeleteCompleted} className="btn btn-danger btn-sm">
            <Trash2 size={15} /> Clear Done
          </button>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
            <Plus size={18} /> New Task
          </button>
        </div>
      </div>

      {/* Search + Filters */}
      <div style={{ marginBottom:24, display:'flex', flexDirection:'column', gap:12 }}>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <div className="search-bar" style={{ flex:1 }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              placeholder="Search tasks..."
              value={search} onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--text-muted)' }}>✕</button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn ${hasFilters ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          >
            <SlidersHorizontal size={15} /> Filters {hasFilters && '•'}
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
              exit={{ height:0, opacity:0 }}
              style={{ display:'flex', gap:12, flexWrap:'wrap', overflow:'hidden' }}
            >
              <select className="input" style={{ width:'auto', minWidth:140 }}
                value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
                <option value="">All Statuses</option>
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
              <select className="input" style={{ width:'auto', minWidth:140 }}
                value={filters.priority} onChange={e => setFilters(f => ({ ...f, priority: e.target.value }))}>
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
              <select className="input" style={{ width:'auto', minWidth:140 }}
                value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}>
                <option value="">All Categories</option>
                {['work','personal','health','learning','finance','creative','other'].map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>
                ))}
              </select>
              {hasFilters && (
                <button onClick={clearFilters} className="btn btn-ghost btn-sm">Clear all</button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Task list */}
      {loading ? (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height:80 }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700 }}>
            {hasFilters ? 'No tasks match filters' : 'No tasks yet'}
          </h3>
          <p style={{ color:'var(--text-secondary)', fontSize:14 }}>
            {hasFilters ? 'Try different filters or create a new task.' : 'Create your first task to get started.'}
          </p>
          {!hasFilters && (
            <button className="btn btn-primary btn-sm" onClick={() => setShowCreate(true)}>
              <Plus size={14} /> Add Task
            </button>
          )}
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(340px, 1fr))', gap:12 }}>
          <AnimatePresence>
            {filtered.map(task => (
              <TaskCard key={task._id} task={task} onEdit={setEditTask} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {(showCreate || editTask) && (
        <TaskModal
          task={editTask}
          onClose={() => { setShowCreate(false); setEditTask(null); fetchTasks(); }}
        />
      )}
    </div>
  );
}
