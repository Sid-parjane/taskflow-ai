import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTasks } from '../context/TasksContext';
import { useSounds } from '../hooks/useSounds';
import { format, isPast, isToday } from 'date-fns';
import { Clock, Tag, Calendar, MoreHorizontal, Trash2, Edit, CheckCircle, Circle, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const categoryEmoji = { work:'💼', personal:'🌟', health:'💪', learning:'📚', finance:'💰', creative:'🎨', other:'📌' };

export default function TaskCard({ task, onEdit, compact = false }) {
  const { updateTask, deleteTask } = useTasks();
  const { playComplete, playDelete, playClick } = useSounds();
  const [showMenu, setShowMenu] = useState(false);
  const [completing, setCompleting] = useState(false);

  const isDone = task.status === 'done';
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !isDone;
  const isTodayDue = task.dueDate && isToday(new Date(task.dueDate));
  const completedSubs = task.subtasks?.filter(s => s.completed).length || 0;

  const toggleDone = async (e) => {
    e.stopPropagation();
    setCompleting(true);
    try {
      await updateTask(task._id, { status: isDone ? 'todo' : 'done' });
      if (!isDone) {
        playComplete();
        toast.success('Task completed! 🎉');
      } else {
        playClick();
      }
    } finally { setCompleting(false); }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    setShowMenu(false);
    playDelete();
    try {
      await deleteTask(task._id);
      toast.success('Deleted');
    } catch { toast.error('Delete failed'); }
  };

  return (
    <motion.div
      className={`task-card priority-${task.priority}`}
      onClick={() => { playClick(); onEdit(task); }}
      layout
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      whileHover={{ scale: 1.01 }}
      style={{ opacity: isDone ? 0.55 : 1 }}
    >
      <div style={{ display:'flex', alignItems:'flex-start', gap: 10 }}>
        {/* Checkbox */}
        <motion.button
          onClick={toggleDone}
          whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
          style={{ background:'transparent', border:'none', cursor:'pointer', color: isDone ? 'var(--green)' : 'var(--text-muted)', padding:0, flexShrink:0, marginTop:1, display:'flex' }}
        >
          {completing
            ? <span className="spinner" style={{ width:16, height:16, borderWidth:2 }} />
            : isDone
              ? <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:400 }}><CheckCircle size={17} /></motion.div>
              : <Circle size={17} />
          }
        </motion.button>

        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:5 }}>
            <span style={{ fontSize:12 }}>{categoryEmoji[task.category]}</span>
            <span style={{
              fontSize:13, fontWeight:600, letterSpacing:'-0.01em',
              textDecoration: isDone ? 'line-through' : 'none',
              color: isDone ? 'var(--text-muted)' : 'var(--text-primary)',
              overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
            }}>
              {task.title}
            </span>
            {task.aiGenerated && (
              <span style={{ flexShrink:0 }}>
                <Sparkles size={11} color="var(--indigo-bright)" />
              </span>
            )}
          </div>

          {!compact && task.description && (
            <p style={{ fontSize:12, color:'var(--text-secondary)', marginBottom:8, lineHeight:1.6, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', fontWeight:300 }}>
              {task.description}
            </p>
          )}

          {/* Meta row */}
          <div style={{ display:'flex', alignItems:'center', gap:7, flexWrap:'wrap', marginTop:4 }}>
            <span className={`badge badge-${task.priority}`}>
              <span className={`priority-dot priority-dot-${task.priority}`} />
              {task.priority}
            </span>

            {task.dueDate && (
              <span style={{ display:'flex', alignItems:'center', gap:3, fontSize:11, color: isOverdue ? 'var(--red)' : isTodayDue ? 'var(--amber)' : 'var(--text-secondary)', fontWeight: (isOverdue||isTodayDue) ? 600 : 400 }}>
                <Calendar size={10} />
                {isOverdue ? '⚠ ' : ''}{format(new Date(task.dueDate), 'MMM d')}
              </span>
            )}

            {task.timeEstimate > 0 && (
              <span style={{ display:'flex', alignItems:'center', gap:3, fontSize:11, color:'var(--text-muted)' }}>
                <Clock size={10} /> {task.timeEstimate}m
              </span>
            )}

            {task.subtasks?.length > 0 && (
              <span style={{ fontSize:11, color:'var(--text-muted)' }}>
                ▣ {completedSubs}/{task.subtasks.length}
              </span>
            )}
          </div>

          {/* Subtask progress */}
          {task.subtasks?.length > 0 && (
            <div className="progress-bar" style={{ marginTop:8 }}>
              <motion.div
                className="progress-fill"
                initial={{ width:0 }}
                animate={{ width:`${(completedSubs/task.subtasks.length)*100}%` }}
                transition={{ duration:0.6, ease:'easeOut' }}
              />
            </div>
          )}

          {/* Tags */}
          {!compact && task.tags?.length > 0 && (
            <div style={{ display:'flex', gap:4, marginTop:8, flexWrap:'wrap' }}>
              {task.tags.slice(0,3).map(tag => (
                <span key={tag} className="tag"><Tag size={9}/>{tag}</span>
              ))}
            </div>
          )}
        </div>

        {/* Menu */}
        <div style={{ position:'relative' }}>
          <motion.button
            onClick={e => { e.stopPropagation(); playClick(); setShowMenu(!showMenu); }}
            whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
            style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:3, borderRadius:4, display:'flex' }}
          >
            <MoreHorizontal size={15} />
          </motion.button>
          {showMenu && (
            <motion.div
              initial={{ opacity:0, scale:0.9, y:-4 }}
              animate={{ opacity:1, scale:1, y:0 }}
              className="dropdown-menu"
               style={{ right: 0, top: '100%', position: 'fixed', zIndex: 9999 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="dropdown-item" onClick={e => { e.stopPropagation(); playClick(); setShowMenu(false); onEdit(task); }}>
                <Edit size={13} /> Edit
              </button>
              <div className="dropdown-divider" />
              <button className="dropdown-item" onClick={handleDelete} style={{ color:'var(--red)' }}>
                <Trash2 size={13} /> Delete
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
