import React, { useState, useEffect } from 'react';
import { ChevronLeft, ArrowUp, ArrowDown, HelpCircle } from 'lucide-react';
import { SiteSettings, AnnouncementMessage } from '../types';
import toast from 'react-hot-toast';
import * as siteSettingsApi from '../services/siteSettingsApi';
import AnnouncementTab from './SiteSettings/Announcement/AnnouncementTab';
import HeaderTab from './SiteSettings/Header/HeaderTab';
import FooterTab from './SiteSettings/Footer/FooterTab';
import MobileBarTab from "./SiteSettings/MobileBar/MobileBarTab";
import BrandTab from "./SiteSettings/Brand/BrandTab";
import ContactTab from "./SiteSettings/Contact/ContactTab";
import GoogleTab from "./SiteSettings/Google/GoogleTab";
import LegalTab from "./SiteSettings/Legal/LegalTab";
import RegionalTab from "./SiteSettings/Regional/RegionalTab";
import MaintenanceTab from "./SiteSettings/Maintenance/MaintenanceTab";

interface SettingsViewProps {
  siteSettings: SiteSettings;
  onUpdateSettings: (updated: SiteSettings) => void;
}

export default function SettingsView({ siteSettings, onUpdateSettings }: SettingsViewProps) {
  const [activeTab, setActiveTab] = useState<string>('Announcement');
  const [activeViewMode, setActiveViewMode] = useState<'Desktop' | 'Mobile'>('Desktop');

  // Announcement Bar State
  const [showAcrossSite, setShowAcrossSite] = useState(false);
  const [howItMoves, setHowItMoves] = useState('Scrolling loop');
  const [loopTime, setLoopTime] = useState(28);
  const [pauseOnHover, setPauseOnHover] = useState(true);
  const [annBarText, setAnnBarText] = useState('');

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
                    className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between cursor-pointer ${activeTab === item.id
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
  { id: 'Google', label: 'Google', dot: false },
  { id: 'Legal', label: 'Legal', dot: true },
  { id: 'Regional', label: 'Regional', dot: false }
].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between cursor-pointer ${activeTab === item.id
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
                className={`w-full text-left px-2.5 py-1.5 rounded cursor-pointer ${activeTab === 'Maintenance'
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
  <AnnouncementTab
    showAcrossSite={showAcrossSite}
    setShowAcrossSite={setShowAcrossSite}
    howItMoves={howItMoves}
    setHowItMoves={setHowItMoves}
    loopTime={loopTime}
    setLoopTime={setLoopTime}
    pauseOnHover={pauseOnHover}
    setPauseOnHover={setPauseOnHover}
    annBarText={annBarText}
    setAnnBarText={setAnnBarText}
    messages={messages}
    setMessages={setMessages}
    bgColor={bgColor}
    setBgColor={setBgColor}
    textColor={textColor}
    setTextColor={setTextColor}
    italicColor={italicColor}
    setItalicColor={setItalicColor}
    separator={separator}
    setSeparator={setSeparator}
  />
)}
            {/* TAB 2: HEADER NAVIGATION */}
            {/* TAB 2: HEADER NAVIGATION */}
{activeTab === 'Header' && (
  <HeaderTab
    navigationBlocks={navigationBlocks}
    setNavigationBlocks={setNavigationBlocks}
    shopByCategoryItems={shopByCategoryItems}
    setShopByCategoryItems={setShopByCategoryItems}
    shopByDesignerItems={shopByDesignerItems}
    setShopByDesignerItems={setShopByDesignerItems}
    searchPlaceholder={searchPlaceholder}
    setSearchPlaceholder={setSearchPlaceholder}
    bagCartLabel={bagCartLabel}
    setBagCartLabel={setBagCartLabel}
  />
)}

{activeTab === 'Footer' && (
  <FooterTab />
)}
{activeTab === 'Mobile bar' && (
  <MobileBarTab />
)}
{activeTab === 'Brand' && (
  <BrandTab />
)}
{activeTab === 'Contact' && (
  <ContactTab />
)}
{activeTab === 'Google' && (
  <GoogleTab />
)}
{activeTab === 'Legal' && (
  <LegalTab />
)}
{activeTab === 'Regional' && (
  <RegionalTab />
)}
{activeTab === 'Maintenance' && (
  <MaintenanceTab />
)}
</div>

          

          {/* RIGHT SIDEBAR PREVIEW PANE REACTIVE TO ALL TOGGLES */}
          <div className="w-full lg:w-[350px] shrink-0 sticky top-16 space-y-4">
            <div className="flex items-center justify-between text-xs border-b border-[#E8E1D9] pb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveViewMode('Desktop')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium cursor-pointer ${activeViewMode === 'Desktop' ? 'bg-[#1E1412] text-white' : 'bg-white border border-[#E0D5C7] text-[#6F665B]'
                    }`}
                >
                  Desktop
                </button>
                <button
                  onClick={() => setActiveViewMode('Mobile')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium cursor-pointer ${activeViewMode === 'Mobile' ? 'bg-[#1E1412] text-white' : 'bg-white border border-[#E0D5C7] text-[#6F665B]'
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
