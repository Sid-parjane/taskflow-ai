import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiAPI } from '../utils/api';
import { useTasks } from '../context/TasksContext';
import { useWindowSize } from '../hooks/useWindowSize';
import toast from 'react-hot-toast';
import { Sparkles, Brain, Target, Plus, Check, RefreshCw, AlertCircle, CheckSquare } from 'lucide-react';

export default function AIStudio() {
  const { createTask } = useTasks();
  const { isMobile } = useWindowSize();
  const [tab, setTab] = useState('generate');

  // Generate
  const [goal, setGoal] = useState('');
  const [timeframe, setTimeframe] = useState('this week');
  const [generatedTasks, setGeneratedTasks] = useState([]);
  const [genLoading, setGenLoading] = useState(false);
  const [genError, setGenError] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState(new Set());
  const [addingAll, setAddingAll] = useState(false);

  // Breakdown
  const [bdTitle, setBdTitle] = useState('');
  const [bdDesc, setBdDesc] = useState('');
  const [bdResult, setBdResult] = useState(null);
  const [bdLoading, setBdLoading] = useState(false);
  const [bdError, setBdError] = useState(null);

  const generateTasks = async () => {
    if (!goal.trim()) return toast.error('Please describe your goal first');
    setGenLoading(true); setGenError(null); setGeneratedTasks([]); setSelectedTasks(new Set());
    try {
      const res = await aiAPI.generate({ goal, timeframe });
      const tasks = res.data.tasks || [];
      if (!tasks.length) { setGenError('AI returned no tasks. Try a more specific goal.'); return; }
      setGeneratedTasks(tasks);
      setSelectedTasks(new Set(tasks.map((_, i) => i)));
      toast.success(`${tasks.length} tasks generated!`);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'AI error';
      setGenError(msg);
      toast.error('AI failed: ' + msg);
    } finally { setGenLoading(false); }
  };

  const toggleSelect = (i) => {
    setSelectedTasks(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });
  };

  const addSelectedToTasks = async () => {
    if (!selectedTasks.size) return toast.error('Select at least one task');
    setAddingAll(true);
    let count = 0;
    for (const i of selectedTasks) {
      const t = generatedTasks[i];
      try {
        await createTask({
          title: t.title, description: t.description || '',
          priority: t.priority || 'medium', category: t.category || 'work',
          timeEstimate: t.timeEstimate || 0, aiGenerated: true,
          dueDate: t.daysFromNow != null ? new Date(Date.now() + t.daysFromNow * 86400000).toISOString().split('T')[0] : null,
        });
        count++;
      } catch {}
    }
    toast.success(`${count} task${count !== 1 ? 's' : ''} added!`);
    setSelectedTasks(new Set());
    setAddingAll(false);
  };

  const breakdownTask = async () => {
    if (!bdTitle.trim()) return toast.error('Enter a task title first');
    setBdLoading(true); setBdError(null); setBdResult(null);
    try {
      const res = await aiAPI.breakdown({ title: bdTitle, description: bdDesc });
      if (res.data?.subtasks) { setBdResult(res.data); toast.success('Task analyzed!'); }
      else { setBdError('Unexpected AI response.'); }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'AI error';
      setBdError(msg);
      toast.error('AI failed: ' + msg);
    } finally { setBdLoading(false); }
  };

  const addBreakdownTask = async () => {
    if (!bdResult) return;
    try {
      await createTask({
        title: bdTitle, description: bdDesc,
        priority: bdResult.priority || 'medium', category: bdResult.category || 'work',
        timeEstimate: bdResult.timeEstimate || 0, aiGenerated: true,
        subtasks: bdResult.subtasks?.map(t => ({ title: t, completed: false })) || [],
      });
      toast.success('Task created with AI breakdown!');
      setBdTitle(''); setBdDesc(''); setBdResult(null); setBdError(null);
    } catch { toast.error('Failed to create task'); }
  };

  const priorityColors = { low:'#94a3b8', medium:'#818cf8', high:'#fbbf24', critical:'#f87171' };

  return (
    <div style={{ maxWidth:'100%', overflow:'hidden' }}>
      <div className="page-header">
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', marginBottom:4 }}>
            <h1 className="page-title">AI Studio</h1>
            <div className="ai-badge"><Sparkles size={11} /> Powered by Groq</div>
          </div>
          <p className="page-subtitle">Let AI help you plan and organize your work</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom:24 }}>
        <button className={`tab ${tab==='generate'?'active':''}`} onClick={() => setTab('generate')}>
          🎯 {isMobile ? 'Goal' : 'Goal to Tasks'}
        </button>
        <button className={`tab ${tab==='breakdown'?'active':''}`} onClick={() => setTab('breakdown')}>
          🔬 {isMobile ? 'Breakdown' : 'Task Breakdown'}
        </button>
      </div>

      <AnimatePresence mode="wait">

        {/* ===== GOAL GENERATOR ===== */}
        {tab === 'generate' && (
          <motion.div key="generate" initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0 }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: isMobile ? 16 : 24,
              alignItems: 'start',
            }}>
              {/* Input */}
              <div className="card ai-glow-border">
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:18 }}>
                  <Target size={19} color="#818cf8" />
                  <h2 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:17 }}>Define Your Goal</h2>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  <div className="input-group">
                    <label className="input-label">What do you want to achieve?</label>
                    <textarea
                      className="input" rows={4}
                      placeholder="e.g. Launch my freelance portfolio website, Learn React in 30 days..."
                      value={goal}
                      onChange={e => setGoal(e.target.value)}
                      onKeyDown={e => { if (e.key==='Enter' && e.metaKey) generateTasks(); }}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Timeframe</label>
                    <select className="input" value={timeframe} onChange={e => setTimeframe(e.target.value)}>
                      <option value="today">Today</option>
                      <option value="this week">This Week</option>
                      <option value="this month">This Month</option>
                      <option value="next 3 months">Next 3 Months</option>
                    </select>
                  </div>

                  {genError && (
                    <div style={{ padding:10, background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.2)', borderRadius:8, fontSize:12, color:'#f87171', display:'flex', gap:7 }}>
                      <AlertCircle size={13} style={{ flexShrink:0, marginTop:1 }} /> {genError}
                    </div>
                  )}

                  <button onClick={generateTasks} className="btn btn-primary" style={{ width:'100%' }} disabled={genLoading || !goal.trim()}>
                    {genLoading
                      ? <span style={{ display:'flex', alignItems:'center', gap:8 }}><div className="typing-dots"><span/><span/><span/></div> Planning...</span>
                      : <><Sparkles size={15} /> Generate Task Plan</>
                    }
                  </button>

                  <div style={{ padding:12, background:'rgba(255,255,255,0.02)', borderRadius:8, border:'1px solid var(--border)' }}>
                    <div style={{ fontSize:10, fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:7 }}>💡 Tips</div>
                    <ul style={{ fontSize:12, color:'var(--text-muted)', lineHeight:1.8, paddingLeft:14 }}>
                      <li>Be specific about your goal</li>
                      <li>Mention your skill level if relevant</li>
                      <li>Include any constraints or deadlines</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div>
                {genLoading && (
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {[...Array(4)].map((_,i) => <div key={i} className="skeleton" style={{ height:76, animationDelay:`${i*0.1}s` }} />)}
                  </div>
                )}

                {!genLoading && generatedTasks.length > 0 && (
                  <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12, flexWrap:'wrap', gap:8 }}>
                      <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:14 }}>
                        {generatedTasks.length} Tasks Generated
                      </h3>
                      <div style={{ display:'flex', gap:7 }}>
                        <button onClick={() => selectedTasks.size === generatedTasks.length ? setSelectedTasks(new Set()) : setSelectedTasks(new Set(generatedTasks.map((_,i)=>i)))} className="btn btn-ghost btn-sm">
                          {selectedTasks.size === generatedTasks.length ? 'Deselect All' : 'Select All'}
                        </button>
                        <button onClick={addSelectedToTasks} className="btn btn-primary btn-sm" disabled={!selectedTasks.size || addingAll}>
                          {addingAll ? <div className="typing-dots"><span/><span/><span/></div> : <><Plus size={13}/> Add {selectedTasks.size > 0 ? selectedTasks.size : ''}</>}
                        </button>
                      </div>
                    </div>

                    {generatedTasks.map((task, i) => (
                      <motion.div key={i}
                        initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}
                        onClick={() => toggleSelect(i)}
                        style={{
                          marginBottom:8, padding:14, borderRadius:10, cursor:'pointer',
                          background: selectedTasks.has(i) ? 'rgba(99,102,241,0.1)' : 'var(--bg-card)',
                          border: `1px solid ${selectedTasks.has(i) ? 'rgba(99,102,241,0.35)' : 'var(--border)'}`,
                          transition:'all 0.15s',
                        }}
                      >
                        <div style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
                          <div style={{
                            width:20, height:20, borderRadius:5, flexShrink:0,
                            border:`2px solid ${selectedTasks.has(i) ? '#6366f1' : 'rgba(255,255,255,0.15)'}`,
                            background: selectedTasks.has(i) ? '#6366f1' : 'transparent',
                            display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s',
                          }}>
                            {selectedTasks.has(i) && <Check size={12} color="white" />}
                          </div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontWeight:600, fontSize:13, marginBottom:3, letterSpacing:'-0.01em' }}>{task.title}</div>
                            {task.description && <div style={{ fontSize:12, color:'var(--text-secondary)', marginBottom:6, lineHeight:1.5 }}>{task.description}</div>}
                            <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                              {task.priority && <span style={{ fontSize:10, padding:'1px 7px', borderRadius:100, background:'rgba(255,255,255,0.05)', color:priorityColors[task.priority], fontWeight:700, textTransform:'uppercase' }}>● {task.priority}</span>}
                              {task.category && <span style={{ fontSize:10, padding:'1px 7px', borderRadius:100, background:'rgba(255,255,255,0.05)', color:'var(--text-secondary)' }}>{task.category}</span>}
                              {task.timeEstimate > 0 && <span style={{ fontSize:10, padding:'1px 7px', borderRadius:100, background:'rgba(255,255,255,0.05)', color:'var(--text-secondary)' }}>⏱ {task.timeEstimate}m</span>}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    <button onClick={generateTasks} className="btn btn-ghost btn-sm" style={{ width:'100%', marginTop:4 }} disabled={genLoading}>
                      <RefreshCw size={12} /> Regenerate
                    </button>
                  </motion.div>
                )}

                {!genLoading && !generatedTasks.length && !genError && (
                  <div className="empty-state" style={{ padding:40, border:'2px dashed var(--border)', borderRadius:14 }}>
                    <div className="empty-icon">🤖</div>
                    <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700 }}>AI awaits your goal</h3>
                    <p style={{ color:'var(--text-secondary)', fontSize:13, textAlign:'center', lineHeight:1.6 }}>
                      {isMobile ? 'Type above and tap Generate' : 'Type your goal on the left and click Generate'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ===== TASK BREAKDOWN ===== */}
        {tab === 'breakdown' && (
          <motion.div key="breakdown" initial={{ opacity:0, x:12 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0 }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: isMobile ? 16 : 24,
              alignItems: 'start',
            }}>
              {/* Input */}
              <div className="card ai-glow-border">
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:18 }}>
                  <Brain size={19} color="#34d399" />
                  <h2 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:17 }}>Break Down a Task</h2>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  <div className="input-group">
                    <label className="input-label">Task Title *</label>
                    <input type="text" className="input"
                      placeholder="e.g. Build a REST API with authentication..."
                      value={bdTitle}
                      onChange={e => setBdTitle(e.target.value)}
                      onKeyDown={e => e.key==='Enter' && breakdownTask()}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Description (optional)</label>
                    <textarea className="input" rows={3}
                      placeholder="Any extra context, tools, constraints..."
                      value={bdDesc}
                      onChange={e => setBdDesc(e.target.value)}
                    />
                  </div>

                  {bdError && (
                    <div style={{ padding:10, background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.2)', borderRadius:8, fontSize:12, color:'#f87171', display:'flex', gap:7 }}>
                      <AlertCircle size={13} style={{ flexShrink:0, marginTop:1 }} /> {bdError}
                    </div>
                  )}

                  <button onClick={breakdownTask} className="btn btn-primary" style={{ width:'100%' }} disabled={bdLoading || !bdTitle.trim()}>
                    {bdLoading
                      ? <span style={{ display:'flex', alignItems:'center', gap:8 }}><div className="typing-dots"><span/><span/><span/></div> Analyzing...</span>
                      : <><Brain size={15} /> Analyze & Break Down</>
                    }
                  </button>
                </div>
              </div>

              {/* Result */}
              <div>
                {bdLoading && (
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {[...Array(3)].map((_,i) => <div key={i} className="skeleton" style={{ height:52 }} />)}
                  </div>
                )}

                {!bdLoading && bdResult && (
                  <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
                    <div className="card">
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14, flexWrap:'wrap', gap:8 }}>
                        <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15 }}>AI Analysis</h3>
                        <button onClick={addBreakdownTask} className="btn btn-primary btn-sm"><Plus size={13}/> Add to Tasks</button>
                      </div>

                      <div style={{ display:'flex', gap:6, marginBottom:14, flexWrap:'wrap' }}>
                        {bdResult.priority && <span className={`badge badge-${bdResult.priority}`}>⚡ {bdResult.priority}</span>}
                        {bdResult.category && <span className="badge badge-todo">📁 {bdResult.category}</span>}
                        {bdResult.timeEstimate && <span className="badge badge-todo">⏱ ~{bdResult.timeEstimate}min</span>}
                      </div>

                      {bdResult.subtasks?.length > 0 && (
                        <div style={{ marginBottom:14 }}>
                          <div style={{ fontSize:10, fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>
                            Subtasks ({bdResult.subtasks.length})
                          </div>
                          {bdResult.subtasks.map((st, i) => (
                            <div key={i} style={{ display:'flex', gap:8, padding:'8px 10px', background:'rgba(255,255,255,0.03)', borderRadius:7, marginBottom:5 }}>
                              <CheckSquare size={14} color="#818cf8" style={{ flexShrink:0, marginTop:1 }} />
                              <span style={{ fontSize:13 }}>{st}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {bdResult.tips?.length > 0 && (
                        <div style={{ padding:12, background:'rgba(99,102,241,0.08)', borderRadius:8, border:'1px solid rgba(99,102,241,0.15)' }}>
                          <div className="ai-badge" style={{ marginBottom:8 }}><Sparkles size={10}/> Pro Tips</div>
                          {bdResult.tips.map((tip, i) => (
                            <div key={i} style={{ fontSize:12, color:'var(--text-secondary)', marginBottom:4, lineHeight:1.6 }}>• {tip}</div>
                          ))}
                        </div>
                      )}

                      <button onClick={breakdownTask} className="btn btn-ghost btn-sm" style={{ width:'100%', marginTop:12 }} disabled={bdLoading}>
                        <RefreshCw size={12}/> Re-analyze
                      </button>
                    </div>
                  </motion.div>
                )}

                {!bdLoading && !bdResult && !bdError && (
                  <div className="empty-state" style={{ padding:40, border:'2px dashed var(--border)', borderRadius:14 }}>
                    <div className="empty-icon">🔬</div>
                    <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700 }}>Analyze any task</h3>
                    <p style={{ color:'var(--text-secondary)', fontSize:13, textAlign:'center', lineHeight:1.6 }}>
                      {isMobile ? 'Enter a task title above and tap Analyze' : 'Enter a task title and AI will break it into subtasks'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
