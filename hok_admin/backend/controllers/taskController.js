import Task from '../models/Task.js';

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ date: 1, time: 1 });
    res.json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task) {
      res.json({ success: true, data: task });
    } else {
      res.status(404).json({ success: false, message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    const createdTask = await task.save();
    res.status(201).json({ success: true, data: createdTask });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task) {
      Object.assign(task, req.body);
      const updatedTask = await task.save();
      res.json({ success: true, data: updatedTask });
    } else {
      res.status(404).json({ success: false, message: 'Task not found' });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task) {
      await task.deleteOne();
      res.json({ success: true, message: 'Task removed' });
    } else {
      res.status(404).json({ success: false, message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

