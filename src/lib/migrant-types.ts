export type CategoryData = {
    nazwa: string;
    name_translations?: Record<string, string>;
    cena: string;
    is_vege?: boolean;
    is_spicy?: boolean
}[];

export type MenuData = Record<string, Record<string, CategoryData>>;

export interface SelectedMeal {
    id: string;
    name: string;
    category: string;
    originalPrice: number;
    date: string;
    quantity: number;
    is_vege?: boolean;
    is_spicy?: boolean;
}

export interface Filters {
    search: string;
    vege: boolean;
    spicy: boolean;
}

export const ALLOWED_CATEGORIES = ['obiady', 'zupy'];

export const isSoupCategory = (catName: string) => catName.toLowerCase().includes('zupy');