import {
  Sandwich,
  Sun,
  Soup,
  UtensilsCrossed,
  Salad,
  Fish,
  Cookie,
} from 'lucide-react';

const categoryIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'Kanapki i wrapy': Sandwich,
  'Śniadania i owsianki': Sun,
  'Zupy': Soup,
  'Obiady': UtensilsCrossed,
  'Sałatki': Salad,
  'Sushi i poke': Fish,
  'Desery i napoje': Cookie,
};

interface CategoryIconProps {
  category: string;
  className?: string;
}

export default function CategoryIcon({ category, className = 'h-5 w-5' }: CategoryIconProps) {
  const Icon = categoryIconMap[category] ?? UtensilsCrossed;
  return <Icon className={className} />;
}
