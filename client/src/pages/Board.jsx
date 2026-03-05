import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks } from '../context/TasksContext';
import { tasksAPI } from '../utils/api';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import toast from 'react-hot-toast';
import { Plus, RefreshCw } from 'lucide-react';

const COLUMNS = [
  { id:'todo', label:'Todo', color:'#94a3b8', emoji:'📋' },
  { id:'in-progress', label:'In Progress', color:'#818cf8', emoji:'⚡' },
  { id:'review', label:'Review', color:'#f59e0b', emoji:'🔍' },
  { id:'done', label:'Done', color:'#22c55e', emoji:'✅' },
];

export default function Board() {
  const { tasks, fetchTasks, updateTask } = useTasks();
  const [editTask, setEditTask] = useState(null);
  const [showCreate, setShowCreate] = useState(null); // column id
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const tasksByStatus = (status) => tasks.filter(t => t.status === status);

  // Drag & Drop
  const handleDragStart = (e, task) => {
    setDragging(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOver(colId);
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    setDragOver(null);
    if (!dragging || dragging.status === newStatus) return setDragging(null);

    try {
      await updateTask(dragging._id, { status: newStatus });
      if (newStatus === 'done') toast.success('Task completed! 🎉');
      else toast.success(`Moved to ${newStatus.replace('-',' ')}`);
    } catch {
      toast.error('Move failed');
    }
    setDragging(null);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Kanban Board</h1>
          <p className="page-subtitle">Drag and drop to update task status</p>
        </div>
        <div style={{ display:'flex', gap:12 }}>
          <button onClick={() => fetchTasks()} className="btn btn-secondary">
            <RefreshCw size={16} />
          </button>
          <button className="btn btn-primary" onClick={() => setShowCreate('todo')}>
            <Plus size={18} /> New Task
          </button>
        </div>
      </div>

      <div className="kanban-board">
        {COLUMNS.map(col => {
          const colTasks = tasksByStatus(col.id);
          const isDragTarget = dragOver === col.id;

          return (
            <div
              key={col.id}
              className="kanban-col"
              style={{
                borderColor: isDragTarget ? col.color : 'var(--border)',
                background: isDragTarget ? `rgba(${col.id === 'done' ? '34,197,94' : col.id === 'in-progress' ? '99,102,241' : col.id === 'review' ? '245,158,11' : '148,163,184'},0.05)` : undefined,
                transition:'border-color 0.2s, background 0.2s'
              }}
              onDragOver={e => handleDragOver(e, col.id)}
              onDragLeave={() => setDragOver(null)}
              onDrop={e => handleDrop(e, col.id)}
            >
              <div className="kanban-col-header">
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span>{col.emoji}</span>
                  <span className="kanban-col-title" style={{ color:col.color }}>{col.label}</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span className="kanban-col-count">{colTasks.length}</span>
                  <button
                    onClick={() => setShowCreate(col.id)}
                    style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--text-muted)', display:'flex', padding:2, borderRadius:4 }}
                    title="Add task"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {colTasks.map(task => (
                  <div
                    key={task._id}
                    draggable
                    onDragStart={e => handleDragStart(e, task)}
                    onDragEnd={() => setDragging(null)}
                    style={{
                      opacity: dragging?._id === task._id ? 0.4 : 1,
                      cursor: 'grab'
                    }}
                  >
                    <TaskCard task={task} onEdit={setEditTask} compact />
                  </div>
                ))}
              </AnimatePresence>

              {colTasks.length === 0 && !isDragTarget && (
                <div style={{
                  padding:'24px 16px', textAlign:'center',
                  color:'var(--text-muted)', fontSize:13,
                  border:'2px dashed var(--border)', borderRadius:'var(--radius-md)'
                }}>
                  Drop tasks here
                </div>
              )}

              {isDragTarget && (
                <motion.div
                  initial={{ opacity:0 }} animate={{ opacity:1 }}
                  style={{
                    padding:'20px', textAlign:'center',
                    color:col.color, fontSize:13, fontWeight:600,
                    border:`2px dashed ${col.color}`, borderRadius:'var(--radius-md)',
                    background: `rgba(${col.color.replace('#','')},0.05)`
                  }}
                >
                  Drop here →
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {(showCreate || editTask) && (
        <TaskModal
          task={editTask}
          defaultStatus={showCreate || 'todo'}
          onClose={() => { setShowCreate(null); setEditTask(null); fetchTasks(); }}
        />
      )}
    </div>
  );
}
