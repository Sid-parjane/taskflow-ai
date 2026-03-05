import { createContext, useContext, useState, useCallback } from 'react';
import { tasksAPI } from '../utils/api';
import toast from 'react-hot-toast';

const TasksContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ status: '', priority: '', category: '', search: '' });

  const fetchTasks = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const res = await tasksAPI.getAll(params);
      setTasks(res.data.tasks);
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await tasksAPI.getStats();
      setStats(res.data);
    } catch {}
  }, []);

  const createTask = useCallback(async (data) => {
    const res = await tasksAPI.create(data);
    setTasks(prev => [res.data.task, ...prev]);
    fetchStats();
    return res.data.task;
  }, [fetchStats]);

  const updateTask = useCallback(async (id, data) => {
    const res = await tasksAPI.update(id, data);
    setTasks(prev => prev.map(t => t._id === id ? res.data.task : t));
    fetchStats();
    return res.data.task;
  }, [fetchStats]);

  const deleteTask = useCallback(async (id) => {
    await tasksAPI.delete(id);
    setTasks(prev => prev.filter(t => t._id !== id));
    fetchStats();
  }, [fetchStats]);

  const deleteCompleted = useCallback(async () => {
    await tasksAPI.deleteCompleted();
    setTasks(prev => prev.filter(t => t.status !== 'done'));
    fetchStats();
  }, [fetchStats]);

  return (
    <TasksContext.Provider value={{
      tasks, stats, loading, filters, setFilters,
      fetchTasks, fetchStats, createTask, updateTask, deleteTask, deleteCompleted
    }}>
      {children}
    </TasksContext.Provider>
  );
}

export const useTasks = () => {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks must be used within TasksProvider');
  return ctx;
};
