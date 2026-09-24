import React, { useState } from 'react';
import { Save, FileText, Sparkles, AlertCircle } from 'lucide-react';

export default function PagesView() {
  const [pages, setPages] = useState(() => JSON.parse(localStorage.getItem('hok_pages') || 'null') || [
    {
      id: "tc",
      title: "Rental Terms & Conditions",
      slug: "terms-and-conditions",
      lastUpdated: "21 Mar 2026",
      body: "House of Kaira manages premium designer dress rentals. Renters agree to safeguard all zardozi embroidery and general fabrics. Security deposits are held in a separate secure client escrow account. If an item is returned damaged, appropriate restoration fines are deducted in accordance with our Quality Assessment condition grades A-D. Cancellations are fully refundable up to 7 days before rental dispatch cycles."
    },
    {
      id: "about",
      title: "About Our Couture Club",
      slug: "about-us",
      lastUpdated: "15 Jan 2026",
      body: "House of Kaira is India's leading luxury fashion rental and consignment circle. We partner directly with esteemed design houses and private high-net-worth curators to offer stunning ensembles. Our custom high-temperature dry-cleaning facility ensures pristine sanitation on all items."
    },
    {
      id: "privacy",
      title: "Privacy & Escrow Protection",
      slug: "privacy-policy",
      lastUpdated: "10 Feb 2026",
      body: "We respect your privacy. All payment transactions, bank account numbers, and credit details provided by wardrobe listers are encrypted in transit using industry-standard protocols. Personal KYC data is exclusively used for shipping verification and escrow settlement processing."
    }
  ]);
  React.useEffect(() => { localStorage.setItem('hok_pages', JSON.stringify(pages)); }, [pages]);

  const [selectedPageId, setSelectedPageId] = useState("tc");
  const currentPage = pages.find(p => p.id === selectedPageId) || pages[0];

  const [editTitle, setEditTitle] = useState(currentPage?.title || '');
  const [editBody, setEditBody] = useState(currentPage?.body || '');

  React.useEffect(() => {
    if (currentPage) {
      setEditTitle(currentPage.title);
      setEditBody(currentPage.body);
    }
  }, [selectedPageId, currentPage]);

  const handleSave = () => {
    setPages(pages.map(p => {
      if (p.id === selectedPageId) {
        return {
          ...p,
          title: editTitle,
          body: editBody,
          lastUpdated: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        };
      }
      return p;
    }));
    alert(`Static page "${editTitle}" has been updated successfully!`);
  };

  return (
    <div className="space-y-6 text-xs font-sans">
      <div>
        <h2 className="text-2xl font-serif text-stone-900 font-medium">Pages Editor (CMS)</h2>
        <p className="text-xs text-stone-500 mt-1">
          Edit terms and conditions, about page narratives, FAQ queries, and statutory privacy notice sections.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side List */}
        <div className="bg-white p-4 rounded-lg border border-stone-200/80 shadow-sm space-y-2 h-fit select-none">
          <h3 className="font-serif font-bold text-stone-900 text-xs border-b border-stone-100 pb-2">Static Pages</h3>
          <div className="space-y-1">
            {pages.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPageId(p.id)}
                className={`w-full p-2.5 rounded text-left font-semibold transition cursor-pointer flex items-center gap-2 ${
                  selectedPageId === p.id
                    ? 'bg-[#fcf9f5] text-[#c5a880] border-l-2 border-[#c5a880]'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <FileText className="h-4 w-4 text-stone-400 shrink-0" />
                <div className="truncate">
                  <span>{p.title}</span>
                  <p className="text-[9px] text-stone-400 mt-0.5 font-normal">Slug: /{p.slug}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Editor */}
        <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-serif font-bold text-stone-950 text-sm">Editing Page: {currentPage?.title}</h3>
              <p className="text-[10px] text-stone-400 mt-0.5">Last updated: {currentPage?.lastUpdated}</p>
            </div>
            <button
              onClick={handleSave}
              className="px-3.5 py-1.5 bg-[#1e1412] hover:bg-[#2c1d1a] text-white rounded font-bold text-xs flex items-center gap-1.5 cursor-pointer transition"
            >
              <Save className="h-4 w-4" />
              <span>Save Static Page</span>
            </button>
          </div>

          <div className="space-y-3 font-sans">
            <div className="space-y-1">
              <label className="text-stone-500 font-medium">Page Display Title</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full p-2.5 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none focus:border-[#c5a880] font-semibold text-stone-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-stone-500 font-medium">Page Content HTML / Markdown Body</label>
              <textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                rows={14}
                className="w-full p-3 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none focus:border-[#c5a880] leading-relaxed text-stone-700"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
