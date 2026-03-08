const router = require('express').Router();
const Task = require('../models/Task');
const User = require('../models/User');
const auth = require('../middleware/auth');

// GET all tasks (with filters)
router.get('/', auth, async (req, res) => {
  try {
    const { status, priority, category, search, sortBy = 'createdAt', order = 'desc' } = req.query;
    const filter = { user: req.user._id };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (search) filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];

    const tasks = await Task.find(filter)
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .lean();

    res.json({ tasks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET stats
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const [total, byStatus, byPriority, byCategory, recentlyCompleted] = await Promise.all([
      Task.countDocuments({ user: userId }),
      Task.aggregate([{ $match: { user: userId } }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
      Task.aggregate([{ $match: { user: userId } }, { $group: { _id: '$priority', count: { $sum: 1 } } }]),
      Task.aggregate([{ $match: { user: userId } }, { $group: { _id: '$category', count: { $sum: 1 } } }]),
      Task.find({ user: userId, status: 'done' }).sort({ completedAt: -1 }).limit(5).lean()
    ]);

    // Overdue tasks
    const overdue = await Task.countDocuments({
      user: userId,
      dueDate: { $lt: new Date() },
      status: { $ne: 'done' }
    });

    res.json({ total, byStatus, byPriority, byCategory, recentlyCompleted, overdue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single task
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE task
router.post('/', auth, async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, user: req.user._id });

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, { $inc: { 'stats.tasksCreated': 1 } });

    res.status(201).json({ task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// BULK update (for drag-and-drop reordering) — must be before /:id routes
router.patch('/bulk/update', auth, async (req, res) => {
  try {
    const { updates } = req.body;
    const ops = updates.map(({ id, ...data }) =>
      Task.findOneAndUpdate({ _id: id, user: req.user._id }, data)
    );
    await Promise.all(ops);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE task
router.patch('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Track completion
    if (req.body.status === 'done' && task.status !== 'done') {
      req.body.completedAt = new Date();
      await User.findByIdAndUpdate(req.user._id, { $inc: { 'stats.tasksCompleted': 1 } });
    }

    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ task: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE all completed — must be before /:id route
router.delete('/bulk/completed', auth, async (req, res) => {
  try {
    await Task.deleteMany({ user: req.user._id, status: 'done' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
