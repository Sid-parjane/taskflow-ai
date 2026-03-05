const mongoose = require('mongoose');

const subtaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'review', 'done'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['work', 'personal', 'health', 'learning', 'finance', 'creative', 'other'],
    default: 'other'
  },
  tags: [{ type: String }],
  dueDate: { type: Date },
  completedAt: { type: Date },
  subtasks: [subtaskSchema],
  aiGenerated: { type: Boolean, default: false },
  aiSuggestions: [{
    type: { type: String },
    content: String,
    applied: { type: Boolean, default: false }
  }],
  timeEstimate: { type: Number, default: 0 }, // minutes
  timeSpent: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
  color: { type: String, default: '' }
}, { timestamps: true });

taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, dueDate: 1 });

module.exports = mongoose.model('Task', taskSchema);
