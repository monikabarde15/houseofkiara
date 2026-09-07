import React from 'react';
import { ArrowUp, ArrowDown, HelpCircle } from 'lucide-react';
import { AnnouncementMessage } from '../../../types';

interface AnnouncementTabProps {
  showAcrossSite: boolean;
  setShowAcrossSite: (value: boolean) => void;

  howItMoves: string;
  setHowItMoves: (value: string) => void;

  loopTime: number;
  setLoopTime: (value: number) => void;

  pauseOnHover: boolean;
  setPauseOnHover: (value: boolean) => void;

  annBarText: string;
  setAnnBarText: (value: string) => void;

  messages: AnnouncementMessage[];
  setMessages: React.Dispatch<React.SetStateAction<AnnouncementMessage[]>>;

  bgColor: string;
  setBgColor: (value: string) => void;

  textColor: string;
  setTextColor: (value: string) => void;

  italicColor: string;
  setItalicColor: (value: string) => void;

  separator: string;
  setSeparator: (value: string) => void;
}

export default function AnnouncementTab({
  showAcrossSite,
  setShowAcrossSite,
  howItMoves,
  setHowItMoves,
  loopTime,
  setLoopTime,
  pauseOnHover,
  setPauseOnHover,
  messages,
  setMessages,
  bgColor,
  setBgColor,
  textColor,
  setTextColor,
  italicColor,
  setItalicColor,
  separator,
  setSeparator,
}: AnnouncementTabProps) {

  const handleMessageChange = (
    index: number,
    field: keyof AnnouncementMessage,
    value: any
  ) => {
    setMessages((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        [field]: value,
      };
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
      expiresDate: '',
    };

    setMessages((prev) => [...prev, newMsg]);
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-start justify-between border-b border-[#E8E1D9] pb-3">
        <div>
          <h2 className="text-xl font-serif text-[#1E1915] font-bold">
            Announcement bar
          </h2>

          <p className="text-[11.5px] text-[#6F665B] mt-0.5">
            The strip above the header. Each message carries its own schedule,
            so a sale ends without anyone remembering to switch it off.
          </p>
        </div>

        <span className="text-[10.5px] text-[#8C847A]">
          Priya (Ops) · 2 days ago
        </span>
      </div>

      {/* EXPIRY NOTICE */}
      <div className="bg-[#FFFDF7] border border-[#F2E8D8] rounded p-3 text-[11.5px] text-[#3D352B]">
        Message 2 expires in 5 days.
      </div>

      {/* ISSUE / WARNING */}
      <div className="bg-white border border-[#E0D5C7] rounded p-4 text-[11.5px] text-[#38332D] space-y-2 shadow-2xs">
        <div className="flex justify-between items-start">
          <p className="leading-relaxed pr-8">
            The rental delivery pointer has no value behind it. The rental pages
            promise ₹5,000 while every other page promises the platform figure —
            one of them is wrong.
          </p>

          <button className="text-[11px] underline text-[#6F665B] hover:text-[#1E1915]">
            Open
          </button>
        </div>
      </div>

      {/* SETTINGS */}
      <div className="bg-white border border-[#E0D5C7] rounded p-5 space-y-5 shadow-2xs">

        {/* SHOW ACROSS SITE */}
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showAcrossSite}
              onChange={(e) => setShowAcrossSite(e.target.checked)}
              className="sr-only peer"
            />

            <div className="w-9 h-5 bg-[#D8D0C5] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C7A55C]" />
          </label>

          <span className="font-semibold text-[#1E1915] text-xs">
            Show the bar across the site
          </span>
        </div>

        {/* MOVEMENT */}
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
              The storefront carries both today: the app screens scroll
              continuously, the page files show one static row.
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

        {/* PAUSE */}
        <div className="flex items-center gap-3 pt-2">
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={pauseOnHover}
              onChange={(e) => setPauseOnHover(e.target.checked)}
              className="sr-only peer"
            />

            <div className="w-9 h-5 bg-[#D8D0C5] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C7A55C]" />
          </label>

          <span className="font-semibold text-[#1E1915] text-xs">
            Pause when the cursor is over it
          </span>
        </div>

        <div className="text-[10px] text-[#A89F91] pt-1">
          Reference date Mon Mar 23 2026. 5 of 17 messages show on All pages.
        </div>
      </div>

      {/* MESSAGES */}
      <div className="space-y-4 pt-2">

        <div>
          <h3 className="font-serif text-lg font-bold text-[#1E1915]">
            Messages
          </h3>

          <p className="text-[11.5px] text-[#6F665B]">
            Point at{' '}
            <code className="bg-[#FAF7F2] px-1 py-0.5 border border-[#E0D5C7] rounded text-[10.5px]">
              {'{{free_delivery_min}}'}
            </code>{' '}
            rather than typing the figure.
          </p>
        </div>

        <div className="space-y-4">

          {messages.map((msg, index) => (

            <div
              key={msg.id || index}
              className="bg-white border border-[#E0D5C7] rounded p-5 space-y-4 shadow-2xs"
            >

              {/* MESSAGE HEADER */}
              <div className="flex items-center justify-between border-b border-[#F4EFEA] pb-3">

                <div className="flex items-center gap-2">

                  <span className="font-bold text-xs text-[#8C847A]">
                    {index + 1}
                  </span>

                  <span className="px-2 py-0.5 rounded text-[9.5px] font-bold uppercase bg-[#E8F2E8] text-[#2D6A35]">
                    {msg.status}
                  </span>

                  <span className="px-2 py-0.5 rounded text-[9.5px] font-bold uppercase bg-[#F5F1EA] text-[#6F665B]">
                    {msg.scope}
                  </span>

                </div>

                <div className="flex items-center gap-2">

                  <button
                    className="p-1 border rounded text-[#8C847A] hover:bg-[#FAF7F2]"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </button>

                  <button
                    className="p-1 border rounded text-[#8C847A] hover:bg-[#FAF7F2]"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </button>

                  <button
                    onClick={() =>
                      setMessages(messages.filter((_, i) => i !== index))
                    }
                    className="px-2 py-1 text-[11px] border border-[#E0D5C7] rounded text-[#6F665B] hover:text-rose-600 cursor-pointer"
                  >
                    Remove
                  </button>

                </div>
              </div>

              {/* TEXT */}
              <div className="space-y-1">

                <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C847A]">
                  TEXT
                </label>

                <input
                  type="text"
                  value={msg.text}
                  onChange={(e) =>
                    handleMessageChange(index, 'text', e.target.value)
                  }
                  className="w-full bg-[#FAF7F2] border border-[#E0D5C7] rounded p-2 text-xs text-[#332F2B] outline-none font-sans"
                />

                <div className="text-[10px] text-[#8C847A]">
                  Prints: {msg.text}{' '}
                  <HelpCircle className="inline h-3 w-3 text-[#A89F91]" />
                </div>

              </div>

              {/* ITALIC */}
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#38332D]">

                <input
                  type="checkbox"
                  checked={msg.printItalicSerif}
                  onChange={(e) =>
                    handleMessageChange(
                      index,
                      'printItalicSerif',
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 rounded border-[#D8D0C5] text-[#C7A55C]"
                />

                <span>
                  Set in the italic serif, like the opening line
                </span>

              </label>

              {/* SHOWS ON + LINK */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="space-y-1">

                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C847A]">
                    SHOWS ON
                  </label>

                  <input
                    type="text"
                    value={msg.showsOn}
                    onChange={(e) =>
                      handleMessageChange(index, 'showsOn', e.target.value)
                    }
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
                    onChange={(e) =>
                      handleMessageChange(index, 'link', e.target.value)
                    }
                    className="w-full bg-[#FAF7F2] border border-[#E0D5C7] rounded p-2 text-xs text-[#332F2B] outline-none"
                  />

                </div>

              </div>

              {/* DATES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="space-y-1">

                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C847A]">
                    GO-LIVE
                  </label>

                  <input
                    type="text"
                    placeholder="dd/mm/yyyy"
                    value={msg.goLiveDate}
                    onChange={(e) =>
                      handleMessageChange(index, 'goLiveDate', e.target.value)
                    }
                    className="w-full bg-[#FAF7F2] border border-[#E0D5C7] rounded p-2 text-xs text-[#332F2B] outline-none"
                  />

                  <p className="text-[9.5px] text-[#A89F91]">
                    Blank means live now.
                  </p>

                </div>

                <div className="space-y-1">

                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C847A]">
                    EXPIRES
                  </label>

                  <input
                    type="text"
                    placeholder="dd/mm/yyyy"
                    value={msg.expiresDate}
                    onChange={(e) =>
                      handleMessageChange(index, 'expiresDate', e.target.value)
                    }
                    className="w-full bg-[#FAF7F2] border border-[#E0D5C7] rounded p-2 text-xs text-[#332F2B] outline-none"
                  />

                  <p className="text-[9.5px] text-[#A89F91]">
                    Blank means until switched off.
                  </p>

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

      {/* APPEARANCE */}
      <div className="bg-white border border-[#E0D5C7] rounded p-5 space-y-4 shadow-2xs">

        <div className="border-b border-[#F4EFEA] pb-3">

          <h3 className="font-serif text-lg font-bold text-[#1E1915]">
            Appearance
          </h3>

          <p className="text-[11.5px] text-[#6F665B] mt-0.5">
            The opening line is set in a different colour and face from the rest.
          </p>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

          {/* BACKGROUND */}
          <div className="space-y-1.5">

            <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C847A]">
              BACKGROUND
            </label>

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

          {/* TEXT COLOUR */}
          <div className="space-y-1.5">

            <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C847A]">
              TEXT COLOUR
            </label>

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

          {/* ITALIC LINE */}
          <div className="space-y-1.5">

            <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C847A]">
              ITALIC LINE COLOUR
            </label>

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

        {/* SEPARATOR */}
        <div className="space-y-1.5 pt-2">

          <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C847A]">
            SEPARATOR
          </label>

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

            <span className="absolute right-3 top-2.5 text-[#8C847A] pointer-events-none text-xs">
              ▾
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}