import React, { useState } from 'react';
import { Mail, Edit, Save, Plus, FileText, Check } from 'lucide-react';
import { EmailTemplate } from '../types';

interface EmailsViewProps {
  emailTemplates: EmailTemplate[];
  onUpdateTemplate: (updatedTemplate: EmailTemplate) => void;
}

export default function EmailsView({ emailTemplates, onUpdateTemplate }: EmailsViewProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("1");
  const currentTemplate = emailTemplates.find(t => t.id === selectedTemplateId) || emailTemplates[0];

  const [editSubject, setEditSubject] = useState(currentTemplate?.subject || '');
  const [editBody, setEditBody] = useState(currentTemplate?.body || '');

  // Sync state if template selection changed
  React.useEffect(() => {
    if (currentTemplate) {
      setEditSubject(currentTemplate.subject);
      setEditBody(currentTemplate.body);
    }
  }, [selectedTemplateId, currentTemplate]);

  const handleSave = () => {
    if (!currentTemplate) return;
    const updated: EmailTemplate = {
      ...currentTemplate,
      subject: editSubject,
      body: editBody
    };
    onUpdateTemplate(updated);
    alert(`Email template "${currentTemplate.name}" updated successfully!`);
  };

  const insertVariable = (variable: string) => {
    setEditBody(prev => prev + ` {${variable}}`);
  };

  return (
    <div className="space-y-6 text-xs font-sans">
      <div>
        <h2 className="text-2xl font-serif text-stone-900 font-medium">Email Templates & Alerts</h2>
        <p className="text-xs text-stone-500 mt-1">
          Customise automatic system notification emails dispatched to renters during transit milestones and deposit releases.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List of templates */}
        <div className="bg-white p-4 rounded-lg border border-stone-200/80 shadow-sm space-y-2 h-fit">
          <h3 className="font-serif font-bold text-stone-900 text-xs border-b border-stone-100 pb-2">System Events</h3>
          <div className="space-y-1">
            {emailTemplates.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplateId(t.id)}
                className={`w-full p-2.5 rounded text-left font-semibold transition cursor-pointer flex items-center justify-between ${
                  selectedTemplateId === t.id
                    ? 'bg-[#fcf9f5] text-[#c5a880] border-l-2 border-[#c5a880]'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <span>{t.name}</span>
                <Mail className="h-3.5 w-3.5 opacity-60" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Editor */}
        <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-serif font-bold text-stone-950 text-sm">Editing Template: {currentTemplate?.name}</h3>
              <p className="text-[10px] text-stone-400 mt-0.5">Triggers automatically on event milestone.</p>
            </div>
            <button
              onClick={handleSave}
              className="px-3.5 py-1.5 bg-[#1e1412] hover:bg-[#2c1d1a] text-white rounded font-bold text-xs flex items-center gap-1.5 cursor-pointer transition"
            >
              <Save className="h-4 w-4" />
              <span>Save Template</span>
            </button>
          </div>

          <div className="space-y-3 font-sans">
            <div className="space-y-1">
              <label className="text-stone-500 font-medium">Email Subject Line</label>
              <input
                type="text"
                value={editSubject}
                onChange={(e) => setEditSubject(e.target.value)}
                className="w-full p-2.5 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none focus:border-[#c5a880] font-semibold text-stone-800"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-stone-500 font-medium">Email Content Body</label>
                <span className="text-[10px] text-stone-400 font-bold">Dynamic Variable Placeholders:</span>
              </div>
              
              {/* Clickable Variable Helpers */}
              <div className="flex flex-wrap gap-1 mb-2">
                {currentTemplate?.variables?.map(v => (
                  <button
                    key={v}
                    onClick={() => insertVariable(v)}
                    className="px-2 py-1 bg-stone-100 hover:bg-[#eae1d8] text-stone-600 hover:text-stone-900 border border-stone-200 rounded text-[10px] font-mono cursor-pointer transition"
                    title="Click to insert at the end of body"
                  >
                    +{v}
                  </button>
                ))}
              </div>

              <textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                rows={12}
                className="w-full p-3 bg-[#fcf9f5] border border-stone-200 rounded text-xs font-mono outline-none focus:border-[#c5a880] leading-relaxed text-stone-700"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
