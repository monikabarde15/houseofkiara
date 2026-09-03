import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { CalendarEvent } from '../types';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: CalendarEvent) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('Alteration / Maintenance');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title || !date) return;
    
    const newTask: CalendarEvent = {
      id: `task_${Date.now()}`,
      type: 'internal-task',
      title: `${category}: ${title}`,
      date: date,
      detail: {
        customerName: 'Internal Task',
        customerLocation: 'HQ',
        customerPhone: '-',
        orderPlaced: '-',
        productName: category,
        productSubtitle: '-',
        rentalPeriodLabel: '-',
        dispatchByLabel: '-',
        carrierLabel: '-',
        rentalAmountLabel: '-',
        securityDepositLabel: '-',
        depositStatusLabel: '-'
      }
    };

    onSave(newTask);
    toast.success('Task added successfully!');
    
    // Reset state
    setTitle('');
    setDate(new Date().toISOString().split('T')[0]);
    setCategory('Alteration / Maintenance');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 font-sans">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-stone-100">
          <h3 className="text-sm font-bold text-stone-800">Add Operational Task / Inventory Block</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Task Title / Description</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Zardozi repair & dry cleaning check"
              className="w-full px-3 py-2 border border-stone-200 rounded text-sm focus:outline-none focus:border-[#C7A55C]"
            />
          </div>
          
          <div>
            <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Target Date</label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-stone-200 rounded text-sm text-stone-700 focus:outline-none focus:border-[#C7A55C]"
            />
          </div>
          
          <div>
            <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Reason / Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-stone-200 rounded text-sm text-stone-700 focus:outline-none focus:border-[#C7A55C]"
            >
              <option value="Alteration / Maintenance">Alteration / Maintenance</option>
              <option value="Dispatch Prep">Dispatch Prep</option>
              <option value="Dry Cleaning">Dry Cleaning</option>
              <option value="Client Follow-up">Client Follow-up</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        
        <div className="px-6 py-4 border-t border-stone-100 flex justify-end gap-3 bg-stone-50">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-200 rounded transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={!title}
            className="px-4 py-2 text-sm font-medium text-white bg-[#C7A55C] hover:bg-[#b89750] rounded transition-colors disabled:opacity-50"
          >
            Save to Calendar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
