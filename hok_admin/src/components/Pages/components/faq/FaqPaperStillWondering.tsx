/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: FaqPaperStillWondering (Spec §8.4 Part 08, Page 29)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';

interface FaqPaperStillWonderingProps {
  whatsappNumber?: string;
  supportEmail?: string;
}

export const FaqPaperStillWondering: React.FC<FaqPaperStillWonderingProps> = ({
  whatsappNumber = '+91 93401 39300',
  supportEmail = 'concierge@houseofkaira.com'
}) => {
  return (
    <div id="still-wondering" className="mt-14 rounded-[12px] bg-[#1a1612] text-[#f7f2ea] p-8 md:p-10 shadow-lg">
      <div className="max-w-3xl">
        <span className="text-[11px] font-semibold tracking-widest text-[#d4af37] uppercase block mb-2">
          Part 08 · Still wondering?
        </span>

        <h3 className="font-serif text-[28px] md:text-[32px] font-normal leading-tight">
          Still wondering? We are <span className="italic text-[#d4af37]">right here</span>.
        </h3>

        <p className="mt-3 text-sm text-[#dcd4c7] leading-relaxed">
          If your question is not covered in our answers, our concierge team is on hand seven days a week to help with fit, dates, deposits, or styling advice.
        </p>

        <p className="mt-1.5 text-xs text-[#a89d8d] italic">
          Always human, never a robot.
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-[6px] bg-[#25D366] text-[#1a1612] text-xs font-semibold hover:bg-[#20ba5a] transition shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <span>💬</span>
            <span>WhatsApp us at {whatsappNumber}</span>
          </a>

          <a
            href={`mailto:${supportEmail}`}
            className="px-5 py-2.5 rounded-[6px] bg-[#2a241d] border border-[#4a3f33] text-xs font-medium text-[#f7f2ea] hover:bg-[#342c23] transition flex items-center gap-2 cursor-pointer"
          >
            <span>✉️</span>
            <span>Write to {supportEmail}</span>
          </a>
        </div>

        {/* Three ways to reach us */}
        <div className="mt-8 pt-6 border-t border-[#332b21] grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div>
            <div className="font-serif text-sm text-[#f7f2ea] mb-1">
              WhatsApp Concierge
            </div>
            <div className="text-[#a89d8d] leading-snug">
              Open 10:00 to 20:00 IST daily for instant size guidance and booking support.
            </div>
          </div>

          <div>
            <div className="font-serif text-sm text-[#f7f2ea] mb-1">
              Studio Direct Line
            </div>
            <div className="text-[#a89d8d] leading-snug">
              Urgent day of event deliveries and dispatch queries directly to our logistics desk.
            </div>
          </div>

          <div>
            <div className="font-serif text-sm text-[#f7f2ea] mb-1">
              Atelier Appointments
            </div>
            <div className="text-[#a89d8d] leading-snug">
              Private bespoke styling consultations available by prior appointment in Indore.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqPaperStillWondering;
