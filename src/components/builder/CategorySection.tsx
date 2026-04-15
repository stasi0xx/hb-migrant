import CategoryIcon from '@/components/CategoryIcon';
import MigrantDishCard from '@/components/migrant/MigrantDishCard';
import { SelectedMeal, isSoupCategory } from '@/lib/migrant-types';

interface CategorySectionProps {
    category: string;
    localizedCategory: string;
    dishes: SelectedMeal[];
    isOpen: boolean;
    onToggle: () => void;
    selections: Record<string, SelectedMeal>;
    soupSelected: number;
    mainSelected: number;
    packageSize: number;
    onAdd: (dish: SelectedMeal) => void;
    onRemove: (dishId: string) => void;
}

export default function CategorySection({
    category,
    localizedCategory,
    dishes,
    isOpen,
    onToggle,
    selections,
    soupSelected,
    mainSelected,
    packageSize,
    onAdd,
    onRemove,
}: CategorySectionProps) {
    return (
        <div id={`migrant-cat-${category}`} className="rounded-2xl bg-[#FDF6EC] overflow-hidden border border-[#1C3D1C]/10">
            <button onClick={onToggle} className="flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-[#1C3D1C]/5">
                <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#1C3D1C] text-[#E8967A]">
                        <CategoryIcon category={category} className="h-4 w-4" />
                    </span>
                    <span className="font-heading font-bold text-lg text-[#1C3D1C]">{localizedCategory}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#1C3D1C]/50">{dishes.length}</span>
                    <svg className={`h-5 w-5 text-[#1C3D1C]/60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            {isOpen && (
                <div className="px-3 md:px-4 pb-3 md:pb-4 pt-1 grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
                    {dishes.map(dish => (
                        <MigrantDishCard
                            key={dish.id}
                            id={dish.id}
                            name={dish.name}
                            category={dish.category}
                            priceStr={`${dish.originalPrice.toFixed(2).replace('.', ',')} EUR`}
                            date={dish.date}
                            quantity={selections[dish.id]?.quantity ?? 0}
                            canAdd={isSoupCategory(dish.category) ? soupSelected < packageSize : mainSelected < packageSize}
                            isVege={dish.is_vege}
                            isSpicy={dish.is_spicy}
                            onAdd={() => onAdd(dish)}
                            onRemove={() => onRemove(dish.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}