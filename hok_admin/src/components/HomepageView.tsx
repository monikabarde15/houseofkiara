import React, { useState } from 'react';
import { Sparkles, Save, Trash2, Plus, Edit, Image } from 'lucide-react';
import { HomepageEditor } from '../types';
import toast from 'react-hot-toast';

interface HomepageViewProps {
  homepage: HomepageEditor;
  onUpdateHomepage: (updated: HomepageEditor) => void;
}

export default function HomepageView({ homepage, onUpdateHomepage }: HomepageViewProps) {
  const [heroHeading, setHeroHeading] = useState(homepage.hero?.heading || 'Luxury Couture Rentals');
  const [heroSubheading, setHeroSubheading] = useState(homepage.hero?.subheading || 'Access the finest wardrobes from India’s top designers.');
  const [ctaLabel, setCtaLabel] = useState(homepage.hero?.primaryCtaLabel || 'Rent Bridalwear');
  const [ctaUrl, setCtaUrl] = useState(homepage.hero?.primaryCtaUrl || '/rentals');
  const [ctaLabelSec, setCtaLabelSec] = useState(homepage.hero?.secondaryCtaLabel || 'Consign Clothes');
  const [ctaUrlSec, setCtaUrlSec] = useState(homepage.hero?.secondaryCtaUrl || '/consign');

  const [testimonials, setTestimonials] = useState(homepage.testimonials || []);

  const [newAuthor, setNewAuthor] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newText, setNewText] = useState('');
  const [newRating, setNewRating] = useState('5');

  const handleSave = () => {
    const updated: HomepageEditor = {
      hero: {
        heading: heroHeading,
        subheading: heroSubheading,
        primaryCtaLabel: ctaLabel,
        primaryCtaUrl: ctaUrl,
        secondaryCtaLabel: ctaLabelSec,
        secondaryCtaUrl: ctaUrlSec,
        backgroundImageUrl: homepage.hero?.backgroundImageUrl
      },
      testimonials
    };
    onUpdateHomepage(updated);
    toast.success("Homepage CMS modifications saved successfully!");
  };

  const handleAddTestimonial = () => {
    if (!newAuthor.trim() || !newText.trim()) {
      toast.error("Author name and review text are required.");
      return;
    }
    const newTest = {
      id: "TEST-" + Math.floor(100 + Math.random() * 900),
      author: newAuthor,
      role: newRole || "Client",
      text: newText,
      rating: Number(newRating)
    };
    setTestimonials([...testimonials, newTest]);
    setNewAuthor('');
    setNewRole('');
    setNewText('');
    toast.success("Review testimonial added!");
  };

  const handleDeleteTestimonial = (id: string) => {
    setTestimonials(testimonials.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-6 text-xs font-sans">
      <div className="flex justify-between items-center border-b border-stone-100 pb-3">
        <div>
          <h2 className="text-2xl font-serif text-stone-900 font-medium">Homepage Editor (CMS)</h2>
          <p className="text-xs text-stone-500 mt-1">
            Modify storefront hero content blocks, call to actions (CTAs), and customer testimonials instantly.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-[#1e1412] hover:bg-[#2c1d1a] text-white rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition"
        >
          <Save className="h-4 w-4" />
          <span>Save CMS Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hero Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-stone-900 text-sm">Hero Banner Content Block</h3>
            <div className="grid grid-cols-1 gap-4 font-sans">
              <div className="space-y-1">
                <label className="text-stone-500 font-medium">Hero Display Heading</label>
                <input
                  type="text"
                  value={heroHeading}
                  onChange={(e) => setHeroHeading(e.target.value)}
                  className="w-full p-2.5 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-500 font-medium">Hero Sub-heading / Description</label>
                <textarea
                  value={heroSubheading}
                  onChange={(e) => setHeroSubheading(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Primary CTA Button Label</label>
                  <input
                    type="text"
                    value={ctaLabel}
                    onChange={(e) => setCtaLabel(e.target.value)}
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Primary CTA URL Link</label>
                  <input
                    type="text"
                    value={ctaUrl}
                    onChange={(e) => setCtaUrl(e.target.value)}
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Secondary CTA Button Label</label>
                  <input
                    type="text"
                    value={ctaLabelSec}
                    onChange={(e) => setCtaLabelSec(e.target.value)}
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Secondary CTA URL Link</label>
                  <input
                    type="text"
                    value={ctaUrlSec}
                    onChange={(e) => setCtaUrlSec(e.target.value)}
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial List Editor */}
          <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-stone-900 text-sm border-b border-stone-100 pb-2">Renters Testimonials reviews</h3>
            <div className="space-y-2">
              {testimonials.map(t => (
                <div key={t.id} className="p-3 bg-stone-50 border border-stone-150 rounded flex justify-between items-start">
                  <div>
                    <span className="font-bold text-stone-800">{t.author}</span>
                    <span className="text-[10px] text-stone-400 ml-1.5 font-sans">({t.role}) | {t.rating} Stars</span>
                    <p className="text-stone-500 mt-1 italic leading-relaxed">"{t.text}"</p>
                  </div>
                  <button
                    onClick={() => handleDeleteTestimonial(t.id)}
                    className="p-1 text-stone-400 hover:text-rose-600 transition cursor-pointer"
                    title="Delete Review"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Testimonial Addition Form */}
            <div className="border-t border-stone-100 pt-4 space-y-3 font-sans">
              <h4 className="font-bold text-stone-800">Add New Review Testimonial</h4>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Author Name"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none"
                />
                <input
                  type="text"
                  placeholder="Role (e.g. Bridal Renter)"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none"
                />
                <select
                  value={newRating}
                  onChange={(e) => setNewRating(e.target.value)}
                  className="p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none"
                >
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                </select>
              </div>
              <textarea
                placeholder="Review Testimonial Text..."
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                rows={2}
                className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none"
              />
              <button
                onClick={handleAddTestimonial}
                className="px-3 py-1.5 bg-[#1e1412] text-white hover:bg-[#2c1d1a] rounded font-semibold text-xs flex items-center gap-1 cursor-pointer transition"
              >
                <Plus className="h-4 w-4" />
                <span>Add Testimonial</span>
              </button>
            </div>
          </div>
        </div>

        {/* Hero Visual Mockup Column */}
        <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4 h-fit">
          <div className="flex items-center gap-1.5 border-b border-stone-100 pb-2 text-[#c5a880]">
            <Sparkles className="h-4 w-4" />
            <h3 className="font-serif font-bold text-stone-900 text-sm">Storefront Preview Mockup</h3>
          </div>
          <div className="border border-stone-200 rounded p-4 space-y-3 bg-[#1e1412] text-white text-center">
            <h4 className="text-sm font-serif font-bold leading-tight">{heroHeading}</h4>
            <p className="text-[10px] text-stone-300 leading-relaxed font-sans">{heroSubheading}</p>
            <div className="flex justify-center gap-2 pt-1 select-none">
              <span className="px-3 py-1 bg-[#c5a880] text-white text-[9px] rounded font-bold">{ctaLabel}</span>
              <span className="px-3 py-1 border border-white text-white text-[9px] rounded font-bold">{ctaLabelSec}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
