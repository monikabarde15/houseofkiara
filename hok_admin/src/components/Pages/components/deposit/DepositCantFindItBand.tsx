/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: DepositCantFindItBand (Spec § 8.13 Part 09)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';

export const DepositCantFindItBand: React.FC = () => {
  return (
    <div className="bg-[#1a1612] text-white rounded-[8px] p-8 md:p-10 shadow-lg space-y-8">
      {/* Top Section */}
      <div className="space-y-3">
        <span className="text-[10px] tracking-[0.2em] font-semibold text-[#c5ad7d] uppercase block">
          WE'RE HERE FOR YOU
        </span>
        <h2 className="text-2xl md:text-3xl font-serif font-normal">
          <span>Can't find your </span>
          <span className="italic text-[#c5ad7d]">answer?</span>
        </h2>
        <p className="text-white/80 text-xs md:text-sm leading-relaxed max-w-xl">
          Every situation is a little different. If yours is not covered here, or you would simply like to talk it through, message us. We would much rather help you directly than have you worry, and nothing is too small to ask.
        </p>
        <p className="font-serif italic text-xs text-[#c5ad7d]">
          With love, the House of Kaira team
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href="https://wa.me/919340139300"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-[4px] bg-[#2e7d32] text-white text-[11px] font-semibold tracking-wider uppercase hover:bg-[#256628] transition-colors shadow-xs"
          >
            MESSAGE US ON WHATSAPP
          </a>
          <a
            href="mailto:hello@houseofkaira.com"
            className="px-4 py-2 rounded-[4px] bg-transparent border border-white/30 text-white text-[11px] font-semibold tracking-wider uppercase hover:bg-white/10 transition-colors"
          >
            WRITE TO US
          </a>
        </div>
      </div>

      {/* 3 Contact Channels */}
      <div className="border-t border-white/15 pt-6 space-y-4 text-xs divide-y divide-white/10">
        {/* 1. WhatsApp */}
        <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="font-medium text-white mb-0.5">WhatsApp</div>
            <div className="text-white/70 text-[11px]">
              The fastest way to reach us. Seven days a week 10 AM to 8 PM IST with replies usually within 2 hours
            </div>
          </div>
          <a
            href="https://wa.me/919340139300"
            target="_blank"
            rel="noreferrer"
            className="text-[11px] font-semibold text-[#c5ad7d] tracking-wider uppercase hover:underline shrink-0"
          >
            START A CHAT
          </a>
        </div>

        {/* 2. Email */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="font-medium text-white mb-0.5">Email</div>
            <div className="text-white/70 text-[11px]">
              hello@houseofkaira.com. Best when you want to send photos or documents.
            </div>
          </div>
          <a
            href="mailto:hello@houseofkaira.com"
            className="text-[11px] font-semibold text-[#c5ad7d] tracking-wider uppercase hover:underline shrink-0"
          >
            SEND AN EMAIL
          </a>
        </div>

        {/* 3. My Account */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="font-medium text-white mb-0.5">Your order, in one place</div>
            <div className="text-white/70 text-[11px]">
              Cancel, track a refund, or follow your deposit, all inside My Account.
            </div>
          </div>
          <a
            href="/profile"
            className="text-[11px] font-semibold text-[#c5ad7d] tracking-wider uppercase hover:underline shrink-0"
          >
            GO TO MY ACCOUNT
          </a>
        </div>
      </div>
    </div>
  );
};

export default DepositCantFindItBand;
