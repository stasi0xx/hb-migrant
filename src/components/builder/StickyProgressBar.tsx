import { ShoppingBag, Check, Package, Clock, Pencil } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { formatWindowDeadline } from '@/lib/migrant-delivery';
import { useCartStore } from '@/store/cart';
import ConfirmModal from '@/components/ConfirmModal';

interface StickyProgressBarProps {
    soupSelected: number;
    mainSelected: number;
    packageSize: number;
    slotLabel: string;
    slotDeadline?: Date;
    isComplete: boolean;
    onChangeSlot: () => void;
    onCancel: () => void;
    onConfirm: () => void;
}

export default function StickyProgressBar({
    soupSelected,
    mainSelected,
    packageSize,
    slotLabel,
    slotDeadline,
    isComplete,
    onChangeSlot,
    onCancel,
    onConfirm,
}: StickyProgressBarProps) {
    const tCat = useTranslations('categories');
    const tm = useTranslations('migrant');
    const { openCart } = useCartStore();
    const [confirmCancel, setConfirmCancel] = useState(false);

    return (
        <>
        <div onClick={openCart} className="sticky top-16 z-30 bg-[#1B4332] shadow-md cursor-pointer">
            <div className="px-4 py-4 md:px-8 grid grid-cols-2 md:grid-cols-3 items-center">
                {/* Left: counters */}
                <div className="flex items-end gap-5">
                    <div className="flex flex-col">
                        <span className="text-[#E8927C] text-[10px] font-bold uppercase tracking-widest">{tCat('Zupy')}</span>
                        <span className="text-white font-heading font-black text-xl leading-none mt-0.5">
                            {soupSelected} <span className="text-white/40 font-semibold text-sm">/ {packageSize}</span>
                        </span>
                        <div className="flex gap-1 mt-1.5">
                            {Array.from({ length: packageSize }).map((_, i) => (
                                <span key={i} className={`h-1.5 w-2 md:w-3 rounded-full transition-colors ${i < soupSelected ? 'bg-[#E8927C]' : 'bg-white/25'}`} />
                            ))}
                        </div>
                    </div>

                    <div className="w-px h-10 bg-white/20" />

                    <div className="flex flex-col">
                        <span className="text-[#E8927C] text-[10px] font-bold uppercase tracking-widest">{tCat('Obiady')}</span>
                        <span className="text-white font-heading font-black text-xl leading-none mt-0.5">
                            {mainSelected} <span className="text-white/40 font-semibold text-sm">/ {packageSize}</span>
                        </span>
                        <div className="flex gap-1 mt-1.5">
                            {Array.from({ length: packageSize }).map((_, i) => (
                                <span key={i} className={`h-1.5 w-2 md:w-3 rounded-full transition-colors ${i < mainSelected ? 'bg-[#E8927C]' : 'bg-white/25'}`} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Center: box summary (desktop only) */}
                <div className="hidden md:flex flex-col items-center gap-1 text-center">
                    <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-[#E8927C] flex-shrink-0" />
                        <span className="text-white font-bold text-sm leading-tight">
                            {packageSize === 3 ? tm('package3days') : tm('package6days')} {' · '} {slotLabel}
                        </span>
                    </div>
                    {slotDeadline && (
                        <div className="flex items-center gap-1 text-[#E8927C]">
                            <Clock className="h-3 w-3 flex-shrink-0" />
                            <span className="text-[10px] font-semibold">{tm('deadlineLabel')}: {formatWindowDeadline(slotDeadline)}</span>
                        </div>
                    )}
                    <button onClick={e => { e.stopPropagation(); onChangeSlot(); }} className="text-[10px] text-white/40 hover:text-white/80 transition-colors">
                        {tm('changePackage')}
                    </button>
                </div>

                {/* Right: buttons */}
                <div className="flex flex-col items-end gap-1">
                    <div className="flex md:flex-row md:gap-3 flex-col-reverse items-end gap-1">
                        <div className="flex flex-row items-center gap-2">
                            <button
                                onClick={e => { e.stopPropagation(); setConfirmCancel(true); }}
                                className="text-xs font-semibold text-white/50 hover:text-white transition-colors md:px-4 md:py-2 md:text-sm"
                            >
                                {tm('cancel')}
                            </button>
                            <button onClick={openCart} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs md:px-5 md:py-2.5 md:text-base rounded-full font-heading font-bold text-white shadow-lg hover:scale-105 active:scale-95 transition-all duration-500 ${isComplete ? 'bg-white/30' : 'bg-[#E8967A]'}`}>
                                <Pencil className="h-3 w-3 md:h-4 md:w-4" />
                                {tm('editCart')}
                            </button>
                        </div>
                        <button
                            onClick={e => { e.stopPropagation(); onConfirm(); }}
                            disabled={!isComplete}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs md:px-5 md:py-2.5 md:text-base rounded-full font-heading font-bold transition-all ${isComplete ? 'bg-[#E8967A] text-white shadow-lg hover:scale-105 active:scale-95' : 'bg-white/10 text-white/40 cursor-not-allowed'}`}
                        >
                            {isComplete ? <Check className="h-4 w-4 md:h-5 md:w-5" /> : <ShoppingBag className="h-4 w-4 md:h-5 md:w-5" />}
                            {tm('confirmPackage')}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <ConfirmModal
            isOpen={confirmCancel}
            question={tm('cancelConfirmQuestion')}
            confirmLabel={tm('cancelConfirmYes')}
            cancelLabel={tm('cancelConfirmNo')}
            onConfirm={() => { setConfirmCancel(false); onCancel(); }}
            onCancel={() => setConfirmCancel(false)}
        />
        </>
    );
}