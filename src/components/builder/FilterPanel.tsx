import { Search, Check, Leaf, Flame } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Filters } from '@/lib/migrant-types';

interface FilterPanelProps {
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
    activeFilterCount: number;
    clearFilters: () => void;
}

export default function FilterPanel({ filters, setFilters, activeFilterCount, clearFilters }: FilterPanelProps) {
    const tm = useTranslations('migrant');

    return (
        <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-base text-[#1C3D1C]">{tm('filterTitle')}</span>
                {activeFilterCount > 0 && (
                    <button
                        onClick={clearFilters}
                        className="text-xs font-semibold text-[#E8927C] hover:text-[#d07060] transition-colors"
                    >
                        {tm('filterClear')}
                    </button>
                )}
            </div>

            {/* Search */}
            <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#1C3D1C]/50">
                    {tm('filterSearch')}
                </span>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#1C3D1C]/30 pointer-events-none" />
                    <input
                        type="text"
                        value={filters.search}
                        onChange={e => setFilters(p => ({ ...p, search: e.target.value }))}
                        placeholder={tm('filterSearchPlaceholder')}
                        className="w-full rounded-xl border border-[#1C3D1C]/15 bg-[#FDF6EC] pl-8 pr-3 py-2 text-sm text-[#1C3D1C] placeholder:text-[#1C3D1C]/30 focus:outline-none focus:border-[#1C3D1C]/35 transition-colors"
                    />
                </div>
            </div>

            {/* Dietary toggles */}
            <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#1C3D1C]/50">
                    {tm('filterDietary')}
                </span>
                <label className="flex items-center gap-3 cursor-pointer group py-1.5">
                    <div
                        className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all ${filters.vege
                            ? 'bg-[#1C3D1C] border-[#1C3D1C]'
                            : 'border-[#1C3D1C]/25 group-hover:border-[#1C3D1C]/50'
                            }`}
                    >
                        {filters.vege && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                    </div>
                    <input
                        type="checkbox"
                        checked={filters.vege}
                        onChange={e => setFilters(p => ({ ...p, vege: e.target.checked }))}
                        className="sr-only"
                    />
                    <div className="flex items-center gap-2">
                        <Leaf className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-sm font-medium text-[#1C3D1C]">{tm('filterVege')}</span>
                    </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group py-1.5">
                    <div
                        className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all ${filters.spicy
                            ? 'bg-[#1C3D1C] border-[#1C3D1C]'
                            : 'border-[#1C3D1C]/25 group-hover:border-[#1C3D1C]/50'
                            }`}
                    >
                        {filters.spicy && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                    </div>
                    <input
                        type="checkbox"
                        checked={filters.spicy}
                        onChange={e => setFilters(p => ({ ...p, spicy: e.target.checked }))}
                        className="sr-only"
                    />
                    <div className="flex items-center gap-2">
                        <Flame className="h-3.5 w-3.5 text-orange-500" />
                        <span className="text-sm font-medium text-[#1C3D1C]">{tm('filterSpicy')}</span>
                    </div>
                </label>
            </div>
        </div>
    );
}