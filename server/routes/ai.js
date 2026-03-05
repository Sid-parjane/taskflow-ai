const router = require('express').Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

// ===== EXTRACT JSON from any Groq response =====
function extractJSON(text) {
  if (!text) return null;

  // 1. Direct parse
  try { return JSON.parse(text.trim()); } catch {}

  // 2. Strip markdown code blocks
  const codeBlock = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlock) {
    try { return JSON.parse(codeBlock[1].trim()); } catch {}
  }

  // 3. Find first JSON object {...}
  const objMatch = text.match(/\{[\s\S]*\}/);
  if (objMatch) {
    try { return JSON.parse(objMatch[0]); } catch {}
  }

  // 4. Find first JSON array [...]
  const arrMatch = text.match(/\[[\s\S]*\]/);
  if (arrMatch) {
    try { return JSON.parse(arrMatch[0]); } catch {}
  }

  return null;
}

// ===== CALL GROQ =====
async function callGroq(prompt, maxTokens = 1000) {
  console.log('📡 Calling Groq API...');

  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is missing from .env file');
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are a productivity assistant. Always respond with valid JSON only. No markdown, no explanation, no extra text. Just the raw JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: maxTokens,
      temperature: 0.5
    })
  });

  const data = await response.json();
  console.log('📥 Groq raw response status:', response.status);

  if (!response.ok) {
    console.error('❌ Groq API error:', JSON.stringify(data));
    throw new Error(data.error?.message || `Groq API returned status ${response.status}`);
  }

  const text = data.choices?.[0]?.message?.content || '';
  console.log('📝 Groq response text:', text.substring(0, 200));
  return text;
}

// ===================================================
// POST /api/ai/breakdown
// ===================================================
router.post('/breakdown', auth, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) return res.status(400).json({ message: 'Title is required' });

    const prompt = `Break down this task into subtasks and return ONLY a JSON object.

Task: "${title}"
${description ? `Description: "${description}"` : ''}

Return this exact JSON structure:
{
  "subtasks": ["step 1", "step 2", "step 3", "step 4"],
  "timeEstimate": 60,
  "priority": "medium",
  "category": "work",
  "tips": ["tip 1", "tip 2"]
}

Rules:
- subtasks: array of 3-6 specific actionable strings
- timeEstimate: number (total minutes)
- priority: exactly one of: low, medium, high, critical
- category: exactly one of: work, personal, health, learning, finance, creative, other
- tips: array of 2-3 short productivity tip strings`;

    const text = await callGroq(prompt, 800);
    const parsed = extractJSON(text);

    if (!parsed) {
      console.error('❌ Could not parse JSON from:', text);
      return res.status(500).json({ message: 'AI returned invalid JSON. Raw: ' + text.substring(0, 100) });
    }

    // Ensure required fields exist
    const result = {
      subtasks: Array.isArray(parsed.subtasks) ? parsed.subtasks : [],
      timeEstimate: Number(parsed.timeEstimate) || 30,
      priority: parsed.priority || 'medium',
      category: parsed.category || 'work',
      tips: Array.isArray(parsed.tips) ? parsed.tips : []
    };

    console.log('✅ Breakdown success:', result.subtasks.length, 'subtasks');
    res.json(result);

  } catch (err) {
    console.error('❌ /breakdown error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// ===================================================
// POST /api/ai/generate
// ===================================================
router.post('/generate', auth, async (req, res) => {
  try {
    const { goal, timeframe } = req.body;

    if (!goal) return res.status(400).json({ message: 'Goal is required' });

    const prompt = `Create 5 tasks to achieve this goal and return ONLY a JSON array.

Goal: "${goal}"
Timeframe: ${timeframe || 'this week'}

Return this exact JSON array:
[
  {
    "title": "Task title here",
    "description": "Brief description here",
    "priority": "high",
    "category": "work",
    "timeEstimate": 45,
    "daysFromNow": 1
  }
]

Rules:
- Return exactly 5 tasks as a JSON array
- title: short specific task name
- description: one sentence description
- priority: exactly one of: low, medium, high, critical
- category: exactly one of: work, personal, health, learning, finance, creative, other
- timeEstimate: number of minutes
- daysFromNow: number 0-7`;

    const text = await callGroq(prompt, 1200);
    let parsed = extractJSON(text);

    if (!parsed) {
      console.error('❌ Could not parse JSON from:', text);
      return res.status(500).json({ message: 'AI returned invalid JSON. Raw: ' + text.substring(0, 100) });
    }

    // Handle if AI returned object instead of array
    if (!Array.isArray(parsed)) {
      if (parsed.tasks && Array.isArray(parsed.tasks)) {
        parsed = parsed.tasks;
      } else {
        parsed = [parsed];
      }
    }

    // Sanitize each task
    const tasks = parsed.map(t => ({
      title: t.title || 'Untitled task',
      description: t.description || '',
      priority: t.priority || 'medium',
      category: t.category || 'work',
      timeEstimate: Number(t.timeEstimate) || 30,
      daysFromNow: Number(t.daysFromNow) || 0
    }));

    console.log('✅ Generate success:', tasks.length, 'tasks');
    res.json({ tasks });

  } catch (err) {
    console.error('❌ /generate error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// ===================================================
// POST /api/ai/daily-plan
// ===================================================
router.post('/daily-plan', auth, async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user._id,
      status: { $ne: 'done' }
    }).lean();

    // If no pending tasks, return a helpful default
    if (!tasks.length) {
      return res.json({
        topTasks: [],
        reasoning: 'No pending tasks found.',
        motivationalMessage: "You have no pending tasks — great work! Create some new tasks to get your next plan."
      });
    }

    const taskList = tasks.slice(0, 15).map((t, i) =>
      `${i + 1}. "${t.title}" — priority: ${t.priority}, due: ${t.dueDate ? new Date(t.dueDate).toDateString() : 'no date'}`
    ).join('\n');

    const prompt = `You are a productivity coach. Given these pending tasks, suggest the best 3-5 to focus on today.

Today: ${new Date().toDateString()}

Pending tasks:
${taskList}

Return ONLY this JSON object:
{
  "topTasks": ["exact task title 1", "exact task title 2", "exact task title 3"],
  "reasoning": "One sentence explaining your prioritization logic.",
  "motivationalMessage": "One energizing sentence to motivate the user today."
}

Rules:
- topTasks: array of 3-5 strings, use the exact task titles from the list above
- reasoning: single string sentence
- motivationalMessage: single string sentence, upbeat and personal`;

    const text = await callGroq(prompt, 600);
    const parsed = extractJSON(text);

    if (!parsed) {
      console.error('❌ Could not parse daily-plan JSON from:', text);
      return res.status(500).json({ message: 'AI returned invalid response. Raw: ' + text.substring(0, 150) });
    }

    const plan = {
      topTasks: Array.isArray(parsed.topTasks) ? parsed.topTasks : [],
      reasoning: parsed.reasoning || '',
      motivationalMessage: parsed.motivationalMessage || 'Stay focused and keep pushing forward!'
    };

    console.log('✅ Daily plan success:', plan.topTasks.length, 'tasks suggested');
    res.json(plan);

  } catch (err) {
    console.error('❌ /daily-plan error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
