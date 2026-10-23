/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: ContactAddressesCard (Spec §6.5)
   Admin panel v217 · 20 October 2026
========================================================= */

import React from 'react';
import { Mail, Phone, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { ContactAddressItem } from '../../types';

interface ContactAddressesCardProps {
  addresses: ContactAddressItem[];
  onVerifyOrReplace?: (id: string) => void;
  onNavigateToPage?: (slug: string) => void;
}

export const ContactAddressesCard: React.FC<ContactAddressesCardProps> = ({
  addresses,
  onVerifyOrReplace,
  onNavigateToPage
}) => {
  return (
    <div className="rounded-[8px] bg-[#fffefb] border border-[#e6dccb] shadow-[0_1px_3px_rgba(26,22,18,0.03)] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#e6dccb] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded-[4px] bg-[#f5edd8] text-[#8a6a36]">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-serif font-bold text-[#1a1612]">
              4. Email and phone addresses printed
            </h3>
            <p className="text-[11px] text-[#6e6358] mt-0.5">
              Customer care inboxes, grievance escalations, and hotline numbers published across documents.
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-[#6e6358] bg-[#efe7db] px-2 py-0.5 rounded-[4px]">
          {addresses.length} addresses verified
        </span>
      </div>

      {/* List */}
      <div className="divide-y divide-[#e6dccb]/70">
        {addresses.map(addr => (
          <div key={addr.id} className="p-4 hover:bg-[#f7f2ea]/40 transition-colors space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="p-1 rounded-[4px] bg-[#f7f2ea] text-[#6e6358]">
                  {addr.type === 'email' ? (
                    <Mail className="w-3.5 h-3.5" />
                  ) : (
                    <Phone className="w-3.5 h-3.5" />
                  )}
                </span>
                <span className="text-xs font-mono font-semibold text-[#1a1612]">
                  {addr.address}
                </span>

                {addr.isVerified ? (
                  <span className="px-2 py-0.5 rounded-[4px] bg-[#6b7e5a]/10 text-[#6b7e5a] border border-[#6b7e5a]/30 font-mono text-[10px] font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>Active & Verified</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-[4px] bg-[#a4512f]/10 text-[#a4512f] border border-[#a4512f]/30 font-mono text-[10px] font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    <span>Unverified Address</span>
                  </span>
                )}
              </div>

              {!addr.isVerified && (
                <button
                  onClick={() => onVerifyOrReplace?.(addr.id)}
                  className="px-2.5 py-1 rounded-[4px] text-[11px] font-medium text-white bg-[#a4512f] hover:bg-[#8c4324] transition-colors cursor-pointer self-start sm:self-auto"
                >
                  Replace with care@houseofkiara.com
                </button>
              )}
            </div>

            {addr.notes && (
              <p className="text-[11px] text-[#a4512f] bg-[#a4512f]/5 p-2 rounded-[4px] border border-[#a4512f]/20">
                {addr.notes}
              </p>
            )}

            {/* Pages Footnote */}
            <div className="flex items-center gap-2 text-[11px] text-[#6e6358] flex-wrap">
              <span>Appears on {addr.usedOnPages.length} pages:</span>
              <div className="flex items-center gap-1 flex-wrap">
                {addr.usedOnPages.slice(0, 6).map(slug => (
                  <button
                    key={slug}
                    onClick={() => onNavigateToPage?.(slug)}
                    className="font-mono text-[10px] bg-[#fffefb] hover:bg-[#efe7db] text-[#5c5248] px-1.5 py-0.5 rounded-[3px] border border-[#e6dccb] transition-colors cursor-pointer"
                  >
                    {slug}
                  </button>
                ))}
                {addr.usedOnPages.length > 6 && (
                  <span className="text-[10px] text-[#6e6358]">
                    +{addr.usedOnPages.length - 6} more
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactAddressesCard;
