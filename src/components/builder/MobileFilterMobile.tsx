'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import FilterPanel from './FilterPanel';
import { Filters } from '@/lib/migrant-types';

interface MobileFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
    activeFilterCount: number;
    clearFilters: () => void;
}

export default function MobileFilterModal({
    isOpen,
    onClose,
    filters,
    setFilters,
    activeFilterCount,
    clearFilters
}: MobileFilterModalProps) {
    const tm = useTranslations('migrant');
    const backdropRef = useRef<HTMLDivElement>(null);
    const sheetRef = useRef<HTMLDivElement>(null);
    const isInit = useRef(true);

    useEffect(() => {
        const backdrop = backdropRef.current;
        const sheet = sheetRef.current;
        if (!backdrop || !sheet) return;

        if (isInit.current) {
            gsap.set(backdrop, { opacity: 0, pointerEvents: 'none' });
            gsap.set(sheet, { y: '100%' });
            isInit.current = false;
            return;
        }

        gsap.killTweensOf([backdrop, sheet]);

        if (isOpen) {
            gsap.set(backdrop, { pointerEvents: 'auto' });
            gsap.to(backdrop, { opacity: 1, duration: 0.25, ease: 'power2.out' });
            gsap.to(sheet, { y: '0%', duration: 0.38, ease: 'power3.out' });
        } else {
            gsap.to(backdrop, { opacity: 0, duration: 0.22, ease: 'power2.in' });
            gsap.to(sheet, {
                y: '100%',
                duration: 0.28,
                ease: 'power3.in',
                onComplete: () => { gsap.set(backdrop, { pointerEvents: 'none' }); },
            });
        }
    }, [isOpen]);

    if (typeof window === 'undefined') return null;

    return createPortal(
        <div ref={backdropRef} className="lg:hidden fixed inset-0 flex items-end" style={{ zIndex: 9999 }}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div ref={sheetRef} className="relative w-full bg-white rounded-t-3xl px-5 pt-4 pb-8 shadow-2xl">
                <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#1C3D1C]/15" />
                <button
                    onClick={onClose}
                    className="absolute top-4 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-[#1C3D1C]/8 text-[#1C3D1C]/60 hover:bg-[#1C3D1C]/15 transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>

                <FilterPanel
                    filters={filters}
                    setFilters={setFilters}
                    activeFilterCount={activeFilterCount}
                    clearFilters={clearFilters}
                />

                <button
                    onClick={onClose}
                    className="mt-5 w-full rounded-full bg-[#1B4332] py-3 text-sm font-bold text-white"
                >
                    {tm('filterButton')}
                    {activeFilterCount > 0 && ` (${activeFilterCount})`}
                </button>
            </div>
        </div>,
        document.body
    );
}