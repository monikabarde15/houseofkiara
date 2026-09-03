import mongoose from '../db/postgresAdapter.js';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  time: { type: String }, // e.g. "14:00"
  type: { type: String, default: 'Custom' },
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  assignee: { type: String },
  orderId: { type: String }, // Optional link to an order
  description: { type: String }
}, { timestamps: true });

// Transform output to match frontend CalendarEvent id mapping
taskSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model('Task', taskSchema);
