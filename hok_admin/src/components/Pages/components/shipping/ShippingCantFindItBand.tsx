/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: ShippingCantFindItBand (Spec § 8.15 Part 08)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';

export interface ShippingCantFindItBandProps {
  onSelectFigure?: (figureKey: string) => void;
}

export const ShippingCantFindItBand: React.FC<ShippingCantFindItBandProps> = ({
  onSelectFigure
}) => {
  return (
    <div className="pt-4">
      <div className="bg-[#1c1917] text-white rounded-[10px] p-8 sm:p-10 space-y-6">
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#c5ad7d] font-semibold">
            WE'RE HERE FOR YOU
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">
            Can't find your <span className="italic text-[#c5ad7d]">answer?</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl">
            Every situation is a little different. If yours is not covered here, or you would simply like to talk it through, message us. We would much rather help you directly than have you worry, and nothing is too small to ask.
          </p>
          <p className="text-xs italic text-[#c5ad7d] pt-1">
            With love, the House of Kaira team
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <a
            href="https://wa.me/919340139300"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#25d366] text-[#0f2415] text-xs font-semibold rounded-md hover:bg-[#20ba5a] transition-colors"
          >
            Message us on WhatsApp
          </a>
          <a
            href="mailto:hello@houseofkaira.com"
            className="px-4 py-2 bg-white/10 text-white border border-white/20 text-xs font-medium rounded-md hover:bg-white/20 transition-colors"
          >
            Write to us
          </a>
        </div>

        {/* Three Contact Channels */}
        <div className="border-t border-white/10 pt-6 space-y-4 text-xs">
          {/* WhatsApp Channel */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="font-medium text-white">WhatsApp</div>
              <p className="text-stone-300">
                The fastest way to reach us.{' '}
                <span className="border border-stone-600 bg-stone-800 px-1 py-0.5 rounded text-[11px] text-[#c5ad7d]">
                  Seven days a week
                </span>{' '}
                <button
                  type="button"
                  onClick={() => onSelectFigure?.('support_hours')}
                  className="border border-stone-600 bg-stone-800 px-1 py-0.5 rounded text-[11px] text-[#c5ad7d] hover:bg-stone-700 cursor-pointer"
                >
                  10 AM to 8 PM IST
                </button>
                , with replies usually within{' '}
                <button
                  type="button"
                  onClick={() => onSelectFigure?.('support_sla')}
                  className="border border-stone-600 bg-stone-800 px-1 py-0.5 rounded text-[11px] text-[#c5ad7d] hover:bg-stone-700 cursor-pointer"
                >
                  2 hours
                </button>
                .
              </p>
            </div>
            <a
              href="https://wa.me/919340139300"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#c5ad7d] hover:underline uppercase text-[10.5px] font-semibold tracking-wider shrink-0"
            >
              Start a chat
            </a>
          </div>

          {/* Email Channel */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-white/10 pt-4">
            <div>
              <div className="font-medium text-white">Email</div>
              <p className="text-stone-300">
                <span className="border border-stone-600 bg-stone-800 px-1.5 py-0.5 rounded text-[11px] text-[#c5ad7d] font-mono mr-1">
                  hello@houseofkaira.com
                </span>
                Best when you want to send photos or documents.
              </p>
            </div>
            <a
              href="mailto:hello@houseofkaira.com"
              className="text-[#c5ad7d] hover:underline uppercase text-[10.5px] font-semibold tracking-wider shrink-0"
            >
              Send an email
            </a>
          </div>

          {/* Account Channel */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-white/10 pt-4">
            <div>
              <div className="font-medium text-white">Your order, in one place</div>
              <p className="text-stone-300">
                Cancel, track a refund, or follow your deposit, all inside My Account.
              </p>
            </div>
            <a
              href="#account"
              className="text-[#c5ad7d] hover:underline uppercase text-[10.5px] font-semibold tracking-wider shrink-0"
            >
              Go to my account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingCantFindItBand;
