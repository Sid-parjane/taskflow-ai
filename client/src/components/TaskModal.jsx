import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks } from '../context/TasksContext';
import { useSounds } from '../hooks/useSounds';
import { aiAPI } from '../utils/api';
import toast from 'react-hot-toast';
import {
  X, Plus, Sparkles, Clock, Tag, Calendar,
  Loader, CheckSquare, Square
} from 'lucide-react';

const STATUSES = ['todo', 'in-progress', 'review', 'done'];
const PRIORITIES = ['low', 'medium', 'high', 'critical'];
const CATEGORIES = ['work', 'personal', 'health', 'learning', 'finance', 'creative', 'other'];

export default function TaskModal({ task, onClose, defaultStatus = 'todo' }) {
  const { createTask, updateTask } = useTasks();
  const { playSuccess, playClick, playAI, playOpen } = useSounds();
  const isEdit = !!task;

  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || defaultStatus,
    priority: task?.priority || 'medium',
    category: task?.category || 'work',
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    timeEstimate: task?.timeEstimate || '',
    tags: task?.tags?.join(', ') || '',
    subtasks: task?.subtasks || [],
  });

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [newSubtask, setNewSubtask] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState(null);

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required');
    setLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        timeEstimate: form.timeEstimate ? parseInt(form.timeEstimate) : 0,
        dueDate: form.dueDate || null,
      };
      if (isEdit) {
        await updateTask(task._id, payload);
        playClick();
        toast.success('Task updated!');
      } else {
        await createTask(payload);
        playSuccess();
        toast.success('Task created! 🎉');
      }
      onClose();
    } catch {
      toast.error('Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const getAISuggestions = async () => {
    if (!form.title.trim()) return toast.error('Add a title first');
    setAiLoading(true);
    playAI();
    try {
      const res = await aiAPI.breakdown({ title: form.title, description: form.description });
      setAiSuggestions(res.data);
      if (res.data.priority) update('priority', res.data.priority);
      if (res.data.category) update('category', res.data.category);
      if (res.data.timeEstimate) update('timeEstimate', res.data.timeEstimate);
      if (res.data.subtasks?.length) {
        update('subtasks', res.data.subtasks.map(t => ({ title: t, completed: false })));
      }
      playSuccess();
      toast.success('AI suggestions applied!');
    } catch {
      toast.error('AI service unavailable');
    } finally {
      setAiLoading(false);
    }
  };

  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    playClick();
    update('subtasks', [...form.subtasks, { title: newSubtask.trim(), completed: false }]);
    setNewSubtask('');
  };

  const toggleSubtask = (i) => {
    playClick();
    const updated = [...form.subtasks];
    updated[i] = { ...updated[i], completed: !updated[i].completed };
    update('subtasks', updated);
  };

  const removeSubtask = (i) => {
    playClick();
    update('subtasks', form.subtasks.filter((_, idx) => idx !== i));
  };

  const completedSubtasks = form.subtasks.filter(s => s.completed).length;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={e => { if (e.target === e.currentTarget) { playClick(); onClose(); } }}
      >
        <motion.div
          className="modal"
          initial={{ scale: 0.88, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.88, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 24, stiffness: 280 }}
          style={{ maxWidth: 620 }}
        >
          {/* Header */}
          <div className="modal-header">
            <h2 className="modal-title">{isEdit ? '✏️ Edit Task' : '✨ New Task'}</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={getAISuggestions}
                className="btn btn-secondary btn-sm"
                disabled={aiLoading}
              >
                {aiLoading ? (
                  <>
                    <div className="typing-dots"><span /><span /><span /></div>
                    AI thinking...
                  </>
                ) : (
                  <><Sparkles size={14} /> AI Suggest</>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => { playClick(); onClose(); }}
                style={{
                  background: 'transparent', border: 'none',
                  cursor: 'pointer', color: 'var(--text-secondary)',
                  padding: 6, display: 'flex', borderRadius: 8,
                }}
              >
                <X size={20} />
              </motion.button>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Title */}
            <div className="input-group">
              <label className="input-label">Title *</label>
              <input
                type="text"
                className="input"
                placeholder="What needs to be done?"
                value={form.title}
                onChange={e => update('title', e.target.value)}
                style={{ fontSize: 15, fontWeight: 500, position: 'relative', zIndex: 10 }}
                autoFocus
              />
            </div>

            {/* Description */}
            <div className="input-group">
              <label className="input-label">Description</label>
              <textarea
                className="input"
                rows={3}
                placeholder="Add more details..."
                value={form.description}
                onChange={e => update('description', e.target.value)}
                style={{ position: 'relative', zIndex: 10 }}
              />
            </div>

            {/* Status + Priority */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="input-group">
                <label className="input-label">Status</label>
                <select
                  className="input"
                  value={form.status}
                  onChange={e => { playClick(); update('status', e.target.value); }}
                  style={{ position: 'relative', zIndex: 10 }}
                >
                  {STATUSES.map(s => (
                    <option key={s} value={s}>
                      {s.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Priority</label>
                <select
                  className="input"
                  value={form.priority}
                  onChange={e => { playClick(); update('priority', e.target.value); }}
                  style={{ position: 'relative', zIndex: 10 }}
                >
                  {PRIORITIES.map(p => (
                    <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category + Due Date */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="input-group">
                <label className="input-label">Category</label>
                <select
                  className="input"
                  value={form.category}
                  onChange={e => { playClick(); update('category', e.target.value); }}
                  style={{ position: 'relative', zIndex: 10 }}
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">
                  <Calendar size={11} style={{ display: 'inline', marginRight: 4 }} />
                  Due Date
                </label>
                <input
                  type="date"
                  className="input"
                  value={form.dueDate}
                  onChange={e => update('dueDate', e.target.value)}
                  style={{ position: 'relative', zIndex: 10 }}
                />
              </div>
            </div>

            {/* Time + Tags */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="input-group">
                <label className="input-label">
                  <Clock size={11} style={{ display: 'inline', marginRight: 4 }} />
                  Time Estimate (min)
                </label>
                <input
                  type="number"
                  className="input"
                  placeholder="30"
                  value={form.timeEstimate}
                  onChange={e => update('timeEstimate', e.target.value)}
                  style={{ position: 'relative', zIndex: 10 }}
                />
              </div>
              <div className="input-group">
                <label className="input-label">
                  <Tag size={11} style={{ display: 'inline', marginRight: 4 }} />
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="design, urgent..."
                  value={form.tags}
                  onChange={e => update('tags', e.target.value)}
                  style={{ position: 'relative', zIndex: 10 }}
                />
              </div>
            </div>

            {/* Subtasks */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <label className="input-label" style={{ margin: 0 }}>
                  Subtasks {form.subtasks.length > 0 && `(${completedSubtasks}/${form.subtasks.length})`}
                </label>
                {form.subtasks.length > 0 && (
                  <div className="progress-bar" style={{ width: 100 }}>
                    <div
                      className="progress-fill"
                      style={{ width: `${(completedSubtasks / form.subtasks.length) * 100}%` }}
                    />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
                <AnimatePresence>
                  {form.subtasks.map((st, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10, height: 0 }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '8px 12px',
                        background: 'var(--bg-elevated)',
                        borderRadius: 8,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => toggleSubtask(i)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#818cf8', padding: 0, display: 'flex' }}
                      >
                        {st.completed
                          ? <CheckSquare size={16} color="#34d399" />
                          : <Square size={16} color="var(--text-muted)" />
                        }
                      </button>
                      <span style={{
                        flex: 1, fontSize: 13,
                        color: st.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                        textDecoration: st.completed ? 'line-through' : 'none',
                      }}>
                        {st.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeSubtask(i)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2, display: 'flex' }}
                      >
                        <X size={13} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  className="input"
                  placeholder="Add a subtask and press Enter..."
                  value={newSubtask}
                  onChange={e => setNewSubtask(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
                  style={{ flex: 1, position: 'relative', zIndex: 10 }}
                />
                <motion.button
                  type="button"
                  onClick={addSubtask}
                  className="btn btn-secondary btn-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={16} />
                </motion.button>
              </div>
            </div>

            {/* AI Tips */}
            <AnimatePresence>
              {aiSuggestions?.tips?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    padding: 16,
                    background: 'rgba(99,102,241,0.08)',
                    border: '1px solid rgba(99,102,241,0.2)',
                    borderRadius: 12,
                    overflow: 'hidden',
                  }}
                >
                  <div className="ai-badge" style={{ marginBottom: 10 }}>
                    <Sparkles size={11} /> AI Tips
                  </div>
                  {aiSuggestions.tips.map((tip, i) => (
                    <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4, lineHeight: 1.6 }}>
                      • {tip}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
              <motion.button
                type="button"
                onClick={() => { playClick(); onClose(); }}
                className="btn btn-secondary"
                style={{ flex: 1, justifyContent: 'center' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 2, justifyContent: 'center' }}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading
                  ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                  : isEdit ? '💾 Save Changes' : '✨ Create Task'
                }
              </motion.button>
            </div>

          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}