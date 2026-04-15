'use client';

import { useTranslations } from 'next-intl';
import { Truck, Clock, CalendarDays } from 'lucide-react';
import StepIndicator from './StepIndicator';
import {
  formatWindowDeadline,
  formatDeliveryDate,
  formatEatingDays,
  type MigrantWindow,
  type MigrantWeekSlot,
} from '@/lib/migrant-delivery';

type PackageSize = 3 | 6;

type Props = {
  packageSize: PackageSize;
  availableWindows: MigrantWindow[];
  availableWeekSlots: MigrantWeekSlot[];
  onWindowSelect: (win: MigrantWindow) => void;
  onWeekSlotSelect: (slot: MigrantWeekSlot) => void;
  onBack: () => void;
};

export default function SlotSelector({
  packageSize,
  availableWindows,
  availableWeekSlots,
  onWindowSelect,
  onWeekSlotSelect,
  onBack,
}: Props) {
  const tm = useTranslations('migrant');

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:py-24 text-center">
      <StepIndicator active={2} />

      <h2 className="font-heading font-black text-3xl md:text-5xl uppercase tracking-tight text-[#1B4332] mb-4">
        {tm('windowTitle')}
      </h2>

      <button
        onClick={onBack}
        className="mb-10 text-sm text-[#1B4332]/40 hover:text-[#1B4332]/70 transition-colors"
      >
        ← {tm('changePackage')}
      </button>

      {/* 3-day: individual slot cards */}
      {packageSize === 3 && (
        <div className="flex flex-col gap-4 mt-2">
          {availableWindows.map(win => (
            <button
              key={win.id}
              onClick={() => onWindowSelect(win)}
              className="flex flex-col gap-3 rounded-2xl bg-[#1B4332]/5 hover:bg-[#1B4332]/10 border border-[#1B4332]/15 hover:border-[#E8927C]/60 px-6 py-5 text-left text-[#1B4332] transition-all active:scale-[0.99]"
            >
              <div className="flex items-center gap-2.5">
                <Truck className="h-5 w-5 text-[#E8927C] flex-shrink-0" />
                <span className="font-bold text-sm">
                  {tm('deliveryOn')}: {formatDeliveryDate(win.deliveryDate)}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <CalendarDays className="h-5 w-5 text-[#1B4332]/40 flex-shrink-0" />
                <span className="text-[#1B4332]/60 text-sm">
                  {tm('youEat')}: {formatEatingDays(win.deliveryDays)}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="h-5 w-5 text-[#1B4332]/30 flex-shrink-0" />
                <span className="text-[#1B4332]/45 text-xs">
                  {tm('deadlineLabel')}: {formatWindowDeadline(win.deadline)}
                </span>
              </div>
            </button>
          ))}
          {availableWindows.length === 0 && (
            <p className="text-[#1B4332]/60 text-base text-center">{tm('noWindowAvailable')}</p>
          )}
        </div>
      )}

      {/* 6-day: week slot cards */}
      {packageSize === 6 && (
        <div className="flex flex-col gap-4 mt-2">
          {availableWeekSlots.map(slot => (
            <button
              key={slot.id}
              onClick={() => onWeekSlotSelect(slot)}
              className="flex flex-col gap-3 rounded-2xl bg-[#D4A017]/10 hover:bg-[#D4A017]/20 border-2 border-[#D4A017]/50 hover:border-[#D4A017] px-7 py-5 text-left text-[#1B4332] transition-all active:scale-[0.99]"
            >
              <span className="font-heading font-black text-xl text-[#D4A017] uppercase">
                {tm('weekOf')} {slot.weekLabel}
              </span>
              <div className="flex items-start gap-2.5">
                <Truck className="h-5 w-5 text-[#D4A017] flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1 text-sm font-semibold">
                  <span>{formatDeliveryDate(slot.windowA.deliveryDate)}</span>
                  <span>{formatDeliveryDate(slot.windowB.deliveryDate)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <CalendarDays className="h-5 w-5 text-[#1B4332]/40 flex-shrink-0" />
                <span className="text-[#1B4332]/60 text-sm">
                  {tm('youEat')}: {formatEatingDays([
                    ...slot.windowA.deliveryDays,
                    ...slot.windowB.deliveryDays,
                  ])}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="h-5 w-5 text-[#1B4332]/30 flex-shrink-0" />
                <span className="text-[#1B4332]/45 text-xs">
                  {tm('deadlineLabel')}: {formatWindowDeadline(slot.deadline)}
                </span>
              </div>
            </button>
          ))}
          {availableWeekSlots.length === 0 && (
            <p className="text-[#1B4332]/60 text-base text-center">{tm('noWindowAvailable')}</p>
          )}
        </div>
      )}
    </div>
  );
}
