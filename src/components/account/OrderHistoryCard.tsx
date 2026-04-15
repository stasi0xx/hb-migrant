'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface HistoryCardOrder {
  shortId: string;
  createdAtLabel: string;
  status: 'new' | 'confirmed' | 'delivered' | 'cancelled';
  paymentMethod: 'stripe' | 'cash';
  city: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
}

export interface HistoryT {
  statusLabels: Record<string, string>;
  paymentLabels: Record<string, string>;
  total: string;
  itemsSuffix: string;
  collapseItems: string;
}

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-[#D4A017]/15 text-[#D4A017]',
  confirmed: 'bg-blue-50 text-blue-600',
  delivered: 'bg-emerald-50 text-emerald-600',
  cancelled: 'bg-red-50 text-red-500',
};

export default function OrderHistoryCard({
  order,
  t,
}: {
  order: HistoryCardOrder;
  t: HistoryT;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm lg:flex">

      {/* ── Left: meta ── */}
      <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3 lg:w-52 lg:flex-shrink-0 lg:flex-col lg:items-start lg:justify-start lg:gap-2 lg:border-r lg:border-[#1C3D1C]/5 lg:p-5">
        <div>
          <p className="text-sm font-bold text-[#1C3D1C]">{order.createdAtLabel}</p>
          <p className="mt-0.5 font-mono text-[11px] text-[#1C3D1C]/30">#{order.shortId}</p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${STATUS_STYLES[order.status] ?? ''}`}>
            {t.statusLabels[order.status] ?? order.status}
          </span>
          <span className="text-[11px] text-[#1C3D1C]/40">
            {t.paymentLabels[order.paymentMethod]} · {order.city}
          </span>
        </div>
      </div>

      {/* ── Right: items + footer ── */}
      <div className="flex flex-1 flex-col">

        {/* Items list — hidden on mobile unless open, always visible on desktop */}
        <div className={`border-t border-[#1C3D1C]/5 lg:border-t-0 lg:flex-1 ${isOpen ? 'block' : 'hidden'} lg:block`}>
          <ul className="divide-y divide-[#1C3D1C]/4 px-4 lg:px-5">
            {order.items.map((item, i) => (
              <li key={i} className="flex items-baseline gap-2 py-2.5 text-sm">
                <span className="flex-1 leading-snug text-[#1C3D1C]">{item.name}</span>
                <span className="shrink-0 text-xs text-[#1C3D1C]/35">{item.quantity}×</span>
                <span className="shrink-0 tabular-nums font-semibold text-[#1C3D1C]">
                  {(item.price * item.quantity).toFixed(2)} zł
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer: toggle (mobile) + total (always) */}
        <div className="flex items-center justify-between border-t border-[#1C3D1C]/5 px-4 py-3 lg:px-5">
          <button
            className="flex items-center gap-1.5 text-xs font-semibold text-[#E8967A] lg:hidden"
            onClick={() => setIsOpen((o) => !o)}
            aria-expanded={isOpen}
          >
            {isOpen
              ? <><ChevronUp className="h-3.5 w-3.5" />{t.collapseItems}</>
              : <><ChevronDown className="h-3.5 w-3.5" />{order.items.length} {t.itemsSuffix}</>
            }
          </button>
          {/* Spacer on desktop (items already visible, no button needed) */}
          <div className="hidden lg:block" />
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#1C3D1C]/30">{t.total}</p>
            <p className="font-heading text-lg font-extrabold text-[#1C3D1C]">
              {order.total.toFixed(2)} zł
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
