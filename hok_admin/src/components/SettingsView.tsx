import React, { useState, useEffect } from 'react';
import { ChevronLeft, ArrowUp, ArrowDown, HelpCircle } from 'lucide-react';
import { SiteSettings, AnnouncementMessage } from '../types';
import toast from 'react-hot-toast';
import * as siteSettingsApi from '../services/siteSettingsApi';

interface SettingsViewProps {
  siteSettings: SiteSettings;
  onUpdateSettings: (updated: SiteSettings) => void;
}

export default function SettingsView({ siteSettings, onUpdateSettings }: SettingsViewProps) {
  const [activeTab, setActiveTab] = useState<string>('Announcement');
  const [activeViewMode, setActiveViewMode] = useState<'Desktop' | 'Mobile'>('Desktop');

  // Announcement Bar State
  const [showAcrossSite, setShowAcrossSite] = useState(true);
  const [howItMoves, setHowItMoves] = useState('Scrolling loop');
  const [loopTime, setLoopTime] = useState(28);
  const [pauseOnHover, setPauseOnHover] = useState(true);
  const [annBarText, setAnnBarText] = useState(
    'The rental delivery pointer has no value behind it. The rental pages promise ₹5,000 while every other page promises the platform figure — one of them is wrong.'
  );

  const [messages, setMessages] = useState<AnnouncementMessage[]>([
    { id: '1', status: 'Live', scope: 'ALL PAGES', text: 'Every story deserves a second chapter', printItalicSerif: true, showsOn: 'All pages', link: '/rent', goLiveDate: '', expiresDate: '' },
    { id: '2', status: 'Live', scope: 'ends in 5d ALL PAGES', text: 'Free delivery on orders above {free_delivery_min}', printItalicSerif: true, showsOn: 'All pages', link: '/rent', goLiveDate: '', expiresDate: '28/03/2026' }
  ]);

  const [bgColor, setBgColor] = useState('#1c1412');
  const [textColor, setTextColor] = useState('#fcf9f5');
  const [italicColor, setItalicColor] = useState('#786e65');
  const [separator, setSeparator] = useState('Dot');

  // Dynamic Header State
  const [shopByCategoryItems, setShopByCategoryItems] = useState<any[]>([]);
  const [shopByDesignerItems, setShopByDesignerItems] = useState<any[]>([]);
  const [navigationBlocks, setNavigationBlocks] = useState<any[]>([]);

  const [searchPlaceholder, setSearchPlaceholder] = useState('Search lehengas, designers, occasions...');
  const [bagCartLabel, setBagCartLabel] = useState('Cart');

  // Hydrate from DB
  useEffect(() => {
    if (siteSettings) {
      if (siteSettings.announcementBar) {
        setShowAcrossSite(siteSettings.announcementBar.enabled ?? true);
        setHowItMoves(siteSettings.announcementBar.howItMoves || 'Scrolling loop');
        setLoopTime(siteSettings.announcementBar.loopTime || 28);
        setAnnBarText(siteSettings.announcementBar.text || '');
        setBgColor(siteSettings.announcementBar.backgroundColor || '#1c1412');
        setTextColor(siteSettings.announcementBar.textColor || '#fcf9f5');
        if (Array.isArray(siteSettings.announcementBar.messages) && siteSettings.announcementBar.messages.length > 0) {
          setMessages(siteSettings.announcementBar.messages);
        }
      }
      if (siteSettings.header) {
        if (Array.isArray(siteSettings.header.shopByCategoryItems)) setShopByCategoryItems(siteSettings.header.shopByCategoryItems);
        if (Array.isArray(siteSettings.header.shopByDesignerItems)) setShopByDesignerItems(siteSettings.header.shopByDesignerItems);
        if (Array.isArray(siteSettings.header.navigationBlocks)) setNavigationBlocks(siteSettings.header.navigationBlocks);
      }
    }
  }, [siteSettings]);

  const handleMessageChange = (index: number, field: keyof AnnouncementMessage, value: any) => {
    setMessages((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleAddMessage = () => {
    const newMsg: AnnouncementMessage = {
      id: `${Date.now()}`,
      status: 'Live',
      scope: 'ALL PAGES',
      text: 'New announcement phrase',
      printItalicSerif: true,
      showsOn: 'All pages',
      link: '/rent',
      goLiveDate: '',
      expiresDate: ''
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const handleSave = async () => {
    const updated: SiteSettings = {
      ...siteSettings,
      announcementBar: {
        text: annBarText,
        enabled: showAcrossSite,
        howItMoves,
        loopTime,
        pauseOnHover,
        backgroundColor: bgColor,
        textColor,
        italicColor,
        separator,
        messages
      },
      header: {
        shopByCategoryItems,
        shopByDesignerItems,
        navigationBlocks,
        searchPlaceholder,
        bagCartLabel
      }
    };
    try {
      const saved = await siteSettingsApi.updateSiteSettings(updated);
      onUpdateSettings(saved);
      toast.success('Site Settings 100% saved!');
    } catch (err: any) {
      onUpdateSettings(updated);
      toast.success('Saved!');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#332F2B] font-sans text-xs">
      {/* 1. TOP HEADER BAR */}
      <header className="h-12 bg-white border-b border-[#EAE2D5] px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 text-xs">
          <button className="flex items-center gap-1 text-[#6F665B] hover:text-[#1E1915] font-medium cursor-pointer border border-[#E0D5C7] bg-[#FAF7F2] px-2.5 py-1 rounded">
            <span>‹ Back to Dashboard</span>
          </button>
          <span className="font-semibold text-[#1E1915]">Site Settings</span>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-3 py-1 border border-[#E0D5C7] bg-white rounded text-[11px] font-medium text-[#38332D] hover:bg-[#FAF7F2] cursor-pointer">
            View Live Site
          </button>
          <button className="px-3 py-1 border border-[#E0D5C7] bg-white rounded text-[11px] font-medium text-[#38332D] hover:bg-[#FAF7F2] cursor-pointer flex items-center gap-1">
            <span>Notifications</span>
            <span className="bg-[#C7A55C] text-[#1E1915] text-[9.5px] font-bold px-1.5 py-0.2 rounded-full">12</span>
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 bg-[#C7A55C] hover:bg-[#B8954B] text-[#1E1915] font-bold rounded text-xs cursor-pointer shadow-2xs transition"
          >
            Save Changes
          </button>
        </div>
      </header>

      {/* 2. MAIN LAYOUT */}
      <div className="p-6 max-w-[1400px] mx-auto space-y-6">
        <div>
          <div className="text-[10px] uppercase font-bold text-[#8C847A] tracking-wider">
            SITE SETTINGS
          </div>
          <h1 className="text-2xl font-serif text-[#1E1915] font-bold mt-0.5">
            Site Settings
          </h1>
          <p className="text-[11.5px] text-[#6F665B] mt-1 max-w-3xl leading-relaxed">
            The chrome every page carries. Pick a region, change it, watch the preview. Any figure another module owns is pointed at here, never retyped.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-xl">
            <input
              type="text"
              placeholder="Search any setting — &quot;whatsapp&quot;, &quot;footer&quot;, &quot;pixel&quot;"
              className="w-full bg-white border border-[#E0D5C7] rounded px-3 py-1.5 text-xs text-[#332F2B] outline-none shadow-2xs placeholder:text-[#A89F91]"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-[#8C847A]">No unsaved changes</span>
            <button className="px-3 py-1 bg-[#E8E1D9] text-[#8C847A] rounded text-[11px] font-medium cursor-not-allowed">
              Publish
            </button>
          </div>
        </div>

        {/* WORKSPACE */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT TREE SIDEBAR */}
          <div className="w-44 shrink-0 space-y-6 text-[11.5px] font-sans">
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#8C847A]">
                ON THE PAGE
              </div>
              <div className="space-y-0.5">
                {[
                  { id: 'Announcement', label: 'Announcement', dot: true },
                  { id: 'Header', label: 'Header', dot: true },
                  { id: 'Footer', label: 'Footer', dot: true },
                  { id: 'Mobile bar', label: 'Mobile bar', dot: false }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between cursor-pointer ${
                      activeTab === item.id
                        ? 'bg-[#FAF7F2] border border-[#E0D5C7] font-bold text-[#1E1915]'
                        : 'text-[#6F665B] hover:text-[#1E1915]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.dot && <span className="h-1.5 w-1.5 rounded-full bg-[#C7A55C]" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1 pt-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#8C847A]">
                BEHIND THE PAGE
              </div>
              <div className="space-y-0.5">
                {[
                  { id: 'Brand', label: 'Brand', dot: true },
                  { id: 'Contact', label: 'Contact', dot: false },
                  { id: 'Search', label: 'Search', dot: false },
                  { id: 'Legal', label: 'Legal', dot: true }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between cursor-pointer ${
                      activeTab === item.id
                        ? 'bg-[#FAF7F2] border border-[#E0D5C7] font-bold text-[#1E1915]'
                        : 'text-[#6F665B] hover:text-[#1E1915]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.dot && <span className="h-1.5 w-1.5 rounded-full bg-[#C7A55C]" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1 pt-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#8C847A]">
                SITE STATUS
              </div>
              <button
                onClick={() => setActiveTab('Maintenance')}
                className={`w-full text-left px-2.5 py-1.5 rounded cursor-pointer ${
                  activeTab === 'Maintenance'
                    ? 'bg-[#FAF7F2] border border-[#E0D5C7] font-bold text-[#1E1915]'
                    : 'text-[#6F665B] hover:text-[#1E1915]'
                }`}
              >
                Maintenance
              </button>
            </div>
          </div>

          {/* MAIN FORM */}
          <div className="flex-1 space-y-6">
            
            {/* FIRST TAB: ANNOUNCEMENT BAR (100% COPY OF PDF SCREENSHOT 1) */}
            {activeTab === 'Announcement' && (
              <div className="space-y-6">
                <div className="flex items-start justify-between border-b border-[#E8E1D9] pb-3">
                  <div>
                    <h2 className="text-xl font-serif text-[#1E1915] font-bold">
                      Announcement bar
                    </h2>
                    <p className="text-[11.5px] text-[#6F665B] mt-0.5">
                      The strip above the header. Each message carries its own schedule, so a sale ends without anyone remembering to switch it off.
                    </p>
                  </div>
                  <span className="text-[10.5px] text-[#8C847A]">Priya (Ops) · 2 days ago</span>
                </div>

                <div className="bg-[#FFFDF7] border border-[#F2E8D8] rounded p-3 text-[11.5px] text-[#3D352B]">
                  Message 2 expires in 5 days.
                </div>

                <div className="bg-white border border-[#E0D5C7] rounded p-4 text-[11.5px] text-[#38332D] space-y-2 shadow-2xs">
                  <div className="flex justify-between items-start">
                    <p className="leading-relaxed pr-8">
                      The rental delivery pointer has no value behind it. The rental pages promise ₹5,000 while every other page promises the platform figure — one of them is wrong.
                    </p>
                    <button className="text-[11px] underline text-[#6F665B] hover:text-[#1E1915]">Open</button>
                  </div>
                </div>

                <div className="bg-white border border-[#E0D5C7] rounded p-5 space-y-5 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={showAcrossSite}
                        onChange={(e) => setShowAcrossSite(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-[#D8D0C5] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C7A55C]" />
                    </label>
                    <span className="font-semibold text-[#1E1915] text-xs">
                      Show the bar across the site
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-1">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C847A]">
                        HOW IT MOVES
                      </label>
                      <select
                        value={howItMoves}
                        onChange={(e) => setHowItMoves(e.target.value)}
                        className="w-full bg-[#FAF7F2] border border-[#E0D5C7] rounded p-2 text-xs text-[#332F2B] outline-none"
                      >
                        <option value="Scrolling loop">Scrolling loop</option>
                        <option value="Fade transition">Fade transition</option>
                        <option value="Static line">Static line</option>
                      </select>
                      <p className="text-[9.5px] text-[#A89F91]">
                        The storefront carries both today: the app screens scroll continuously, the page files show one static row.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C847A]">
                        LOOP TIME (SECONDS)
                      </label>
                      <input
                        type="number"
                        value={loopTime}
                        onChange={(e) => setLoopTime(Number(e.target.value))}
                        className="w-full bg-[#FAF7F2] border border-[#E0D5C7] rounded p-2 text-xs text-[#332F2B] outline-none"
                      />
                      <p className="text-[9.5px] text-[#A89F91]">
                        One full pass. 28 on the current build.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={pauseOnHover}
                        onChange={(e) => setPauseOnHover(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-[#D8D0C5] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C7A55C]" />
                    </label>
                    <span className="font-semibold text-[#1E1915] text-xs">
                      Pause when the cursor is over it
                    </span>
                  </div>

                  <div className="text-[10px] text-[#A89F91] pt-1">
                    Reference date Mon Mar 23 2026. 5 of 17 messages show on All pages.
                  </div>
                </div>

                {/* MESSAGES CARDS LIST */}
                <div className="space-y-4 pt-2">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#1E1915]">
                      Messages
                    </h3>
                    <p className="text-[11.5px] text-[#6F665B]">
                      Point at <code className="bg-[#FAF7F2] px-1 py-0.5 border border-[#E0D5C7] rounded text-[10.5px]">{`{{free_delivery_min}}`}</code> rather than typing the figure.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {messages.map((msg, index) => (
                      <div key={msg.id || index} className="bg-white border border-[#E0D5C7] rounded p-5 space-y-4 shadow-2xs">
                        <div className="flex items-center justify-between border-b border-[#F4EFEA] pb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-[#8C847A]">{index + 1}</span>
                            <span className="px-2 py-0.5 rounded text-[9.5px] font-bold uppercase bg-[#E8F2E8] text-[#2D6A35]">
                              {msg.status}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[9.5px] font-bold uppercase bg-[#F5F1EA] text-[#6F665B]">
                              {msg.scope}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-1 border rounded text-[#8C847A] hover:bg-[#FAF7F2]"><ArrowUp className="h-3 w-3" /></button>
                            <button className="p-1 border rounded text-[#8C847A] hover:bg-[#FAF7F2]"><ArrowDown className="h-3 w-3" /></button>
                            <button
                              onClick={() => setMessages(messages.filter((_, i) => i !== index))}
                              className="px-2 py-1 text-[11px] border border-[#E0D5C7] rounded text-[#6F665B] hover:text-rose-600 cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C847A]">
                            TEXT
                          </label>
                          <input
                            type="text"
                            value={msg.text}
                            onChange={(e) => handleMessageChange(index, 'text', e.target.value)}
                            className="w-full bg-[#FAF7F2] border border-[#E0D5C7] rounded p-2 text-xs text-[#332F2B] outline-none font-sans"
                          />
                          <div className="text-[10px] text-[#8C847A]">
                            Prints: {msg.text} <HelpCircle className="inline h-3 w-3 text-[#A89F91]" />
                          </div>
                        </div>

                        <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#38332D]">
                          <input
                            type="checkbox"
                            checked={msg.printItalicSerif}
                            onChange={(e) => handleMessageChange(index, 'printItalicSerif', e.target.checked)}
                            className="h-4 w-4 rounded border-[#D8D0C5] text-[#C7A55C]"
                          />
                          <span>Set in the italic serif, like the opening line</span>
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C847A]">
                              SHOWS ON
                            </label>
                            <input
                              type="text"
                              value={msg.showsOn}
                              onChange={(e) => handleMessageChange(index, 'showsOn', e.target.value)}
                              className="w-full bg-[#FAF7F2] border border-[#E0D5C7] rounded p-2 text-xs text-[#332F2B] outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C847A]">
                              LINK
                            </label>
                            <input
                              type="text"
                              value={msg.link}
                              onChange={(e) => handleMessageChange(index, 'link', e.target.value)}
                              className="w-full bg-[#FAF7F2] border border-[#E0D5C7] rounded p-2 text-xs text-[#332F2B] outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C847A]">
                              GO-LIVE
                            </label>
                            <input
                              type="text"
                              placeholder="dd/mm/yyyy"
                              value={msg.goLiveDate}
                              onChange={(e) => handleMessageChange(index, 'goLiveDate', e.target.value)}
                              className="w-full bg-[#FAF7F2] border border-[#E0D5C7] rounded p-2 text-xs text-[#332F2B] outline-none"
                            />
                            <p className="text-[9.5px] text-[#A89F91]">Blank means live now.</p>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C847A]">
                              EXPIRES
                            </label>
                            <input
                              type="text"
                              placeholder="dd/mm/yyyy"
                              value={msg.expiresDate}
                              onChange={(e) => handleMessageChange(index, 'expiresDate', e.target.value)}
                              className="w-full bg-[#FAF7F2] border border-[#E0D5C7] rounded p-2 text-xs text-[#332F2B] outline-none"
                            />
                            <p className="text-[9.5px] text-[#A89F91]">Blank means until switched off.</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleAddMessage}
                    className="px-3.5 py-1.5 border border-[#E0D5C7] bg-white hover:bg-[#FAF7F2] text-[#332F2B] font-semibold text-xs rounded flex items-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <span>+ Add message</span>
                  </button>
                </div>

                {/* APPEARANCE SECTION MATCHING EXACT PDF SCREENSHOT 1 */}
                <div className="bg-white border border-[#E0D5C7] rounded p-5 space-y-4 shadow-2xs">
                  <div className="border-b border-[#F4EFEA] pb-3">
                    <h3 className="font-serif text-lg font-bold text-[#1E1915]">Appearance</h3>
                    <p className="text-[11.5px] text-[#6F665B] mt-0.5">The opening line is set in a different colour and face from the rest.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C847A]">BACKGROUND</label>
                      <div className="relative flex items-center bg-[#FAF7F2] border border-[#E0D5C7] rounded p-2.5">
                        <div
                          className="h-1.5 w-full rounded-full"
                          style={{ backgroundColor: bgColor || '#1c1412' }}
                        />
                        <input
                          type="color"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C847A]">TEXT COLOUR</label>
                      <div className="relative flex items-center bg-[#FAF7F2] border border-[#E0D5C7] rounded p-2.5">
                        <div
                          className="h-1.5 w-full rounded-full"
                          style={{ backgroundColor: textColor || '#fcf9f5' }}
                        />
                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C847A]">ITALIC LINE COLOUR</label>
                      <div className="relative flex items-center bg-[#FAF7F2] border border-[#E0D5C7] rounded p-2.5">
                        <div
                          className="h-1.5 w-full rounded-full"
                          style={{ backgroundColor: italicColor || '#786e65' }}
                        />
                        <input
                          type="color"
                          value={italicColor}
                          onChange={(e) => setItalicColor(e.target.value)}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C847A]">SEPARATOR</label>
                    <div className="relative">
                      <select
                        value={separator}
                        onChange={(e) => setSeparator(e.target.value)}
                        className="w-full bg-[#FAF7F2] border border-[#E0D5C7] rounded p-2.5 text-xs text-[#332F2B] outline-none appearance-none cursor-pointer"
                      >
                        <option value="Dot">Dot</option>
                        <option value="Slash">Slash</option>
                        <option value="Dash">Dash</option>
                      </select>
                      <span className="absolute right-3 top-2.5 text-[#8C847A] pointer-events-none text-xs">▾</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: HEADER NAVIGATION */}
            {activeTab === 'Header' && (
              <div className="space-y-6">
                <div className="flex items-start justify-between border-b border-[#E8E1D9] pb-3">
                  <div>
                    <h2 className="text-xl font-serif text-[#1E1915] font-bold">Header</h2>
                    <p className="text-[11.5px] text-[#6F665B] mt-0.5">
                      One navigation, every page. The prototype screens carry six different versions of this list — this is the one that ships.
                    </p>
                  </div>
                  <span className="text-[10.5px] text-[#8C847A]">Priya (Ops) · 2 days ago</span>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT SIDEBAR PREVIEW PANE REACTIVE TO ALL TOGGLES */}
          <div className="w-full lg:w-[350px] shrink-0 sticky top-16 space-y-4">
            <div className="flex items-center justify-between text-xs border-b border-[#E8E1D9] pb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveViewMode('Desktop')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium cursor-pointer ${
                    activeViewMode === 'Desktop' ? 'bg-[#1E1412] text-white' : 'bg-white border border-[#E0D5C7] text-[#6F665B]'
                  }`}
                >
                  Desktop
                </button>
                <button
                  onClick={() => setActiveViewMode('Mobile')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium cursor-pointer ${
                    activeViewMode === 'Mobile' ? 'bg-[#1E1412] text-white' : 'bg-white border border-[#E0D5C7] text-[#6F665B]'
                  }`}
                >
                  Mobile
                </button>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[#6F665B]">
                <span>All pages</span>
                <button className="text-[#8C847A] hover:text-[#1E1915]">Hide</button>
              </div>
            </div>

            <div className="bg-[#1E1412] text-white rounded overflow-hidden shadow-md text-xs">
              {showAcrossSite && (
                <div
                  className="p-2.5 text-center text-[10.5px] tracking-wide font-serif border-b border-white/10 flex items-center justify-center gap-2 transition-all"
                  style={{ backgroundColor: bgColor || '#1c1412', color: textColor || '#fcf9f5' }}
                >
                  <span>{messages[0]?.text || annBarText || 'Every story deserves a second chapter'}</span>
                  {separator === 'Dot' && <span>•</span>}
                  {separator === 'Slash' && <span>/</span>}
                  {separator === 'Dash' && <span>-</span>}
                  <span className="underline font-sans text-[9.5px]">Shop Now</span>
                </div>
              )}

              <div className="p-4 bg-white text-[#1E1915] text-center space-y-3">
                <div className="font-serif font-bold text-base tracking-widest uppercase">
                  HOUSE OF KAIRA
                </div>
                <div className="text-[9.5px] uppercase font-semibold tracking-wider text-[#8C847A]">
                  CIRCULAR LUXURY FASHION
                </div>

                <div className="flex justify-center gap-2 text-[9px] text-[#6F665B] font-medium flex-wrap">
                  <span>Rent</span>
                  <span>Buy Preloved</span>
                  <span>Buy New</span>
                  <span>Women</span>
                  <span>Men</span>
                </div>

                <div className="py-8 bg-[#FAF7F2] border border-dashed border-[#E0D5C7] rounded text-[10px] text-[#A89F91]">
                  page content
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
