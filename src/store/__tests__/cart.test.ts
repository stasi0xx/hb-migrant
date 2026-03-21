/**
 * @jest-environment jsdom
 */
import { useCartStore, ONLINE_DISCOUNT, parsePrice, CartItem } from '../cart';

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function makeItem(overrides: Partial<Omit<CartItem, 'quantity' | 'price'>> = {}): Omit<CartItem, 'quantity' | 'price'> {
  return {
    id: 'item-1',
    name: 'Kanapka z łososiem',
    category: 'Kanapki i wrapy',
    originalPrice: 20,
    date: '25.03.2026',
    ...overrides,
  };
}

beforeEach(() => {
  localStorage.clear();
  // Bez flagi 'true' – merge mode zachowuje metody w state
  useCartStore.setState({ items: [], isOpen: false });
});

// ─────────────────────────────────────────────
// ONLINE_DISCOUNT stała
// ─────────────────────────────────────────────
describe('ONLINE_DISCOUNT', () => {
  it('wynosi 5%', () => {
    expect(ONLINE_DISCOUNT).toBe(0.05);
  });
});

// ─────────────────────────────────────────────
// addItem
// ─────────────────────────────────────────────
describe('addItem', () => {
  it('dodaje nowy produkt do pustego koszyka', () => {
    useCartStore.getState().addItem(makeItem());
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].name).toBe('Kanapka z łososiem');
    expect(items[0].quantity).toBe(1);
  });

  it('stosuje 5% zniżkę na cenę', () => {
    useCartStore.getState().addItem(makeItem({ originalPrice: 20 }));
    const item = useCartStore.getState().items[0];
    expect(item.price).toBeCloseTo(19.0);
  });

  it('przechowuje oryginalną cenę bez zmian', () => {
    useCartStore.getState().addItem(makeItem({ originalPrice: 20 }));
    expect(useCartStore.getState().items[0].originalPrice).toBe(20);
  });

  it('inkrementuje quantity gdy ten sam produkt i ta sama data', () => {
    useCartStore.getState().addItem(makeItem());
    useCartStore.getState().addItem(makeItem());
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
  });

  it('traktuje ten sam produkt na inną datę jako oddzielną pozycję', () => {
    useCartStore.getState().addItem(makeItem({ date: '25.03.2026' }));
    useCartStore.getState().addItem(makeItem({ date: '26.03.2026' }));
    expect(useCartStore.getState().items).toHaveLength(2);
  });

  it('traktuje inny produkt na tę samą datę jako oddzielną pozycję', () => {
    useCartStore.getState().addItem(makeItem({ id: 'item-1' }));
    useCartStore.getState().addItem(makeItem({ id: 'item-2', name: 'Zupa dnia' }));
    expect(useCartStore.getState().items).toHaveLength(2);
  });

  it('poprawnie oblicza cenę po zniżce dla liczb zmiennoprzecinkowych', () => {
    useCartStore.getState().addItem(makeItem({ originalPrice: 19.9 }));
    const item = useCartStore.getState().items[0];
    const expectedPrice = parseFloat((19.9 * 0.95).toFixed(2));
    expect(item.price).toBe(expectedPrice);
  });
});

// ─────────────────────────────────────────────
// removeItem
// ─────────────────────────────────────────────
describe('removeItem', () => {
  it('usuwa produkt z koszyka', () => {
    useCartStore.getState().addItem(makeItem());
    useCartStore.getState().removeItem('item-1', '25.03.2026');
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('usuwa tylko właściwy produkt (poprawne id + data)', () => {
    useCartStore.getState().addItem(makeItem({ id: 'item-1', date: '25.03.2026' }));
    useCartStore.getState().addItem(makeItem({ id: 'item-2', date: '25.03.2026' }));
    useCartStore.getState().removeItem('item-1', '25.03.2026');
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe('item-2');
  });

  it('nie usuwa produktu gdy data nie pasuje', () => {
    useCartStore.getState().addItem(makeItem({ date: '25.03.2026' }));
    useCartStore.getState().removeItem('item-1', '26.03.2026');
    expect(useCartStore.getState().items).toHaveLength(1);
  });

  it('nie rzuca błędu przy usuwaniu nieistniejącego produktu', () => {
    expect(() => {
      useCartStore.getState().removeItem('nieistniejacy', '25.03.2026');
    }).not.toThrow();
  });
});

// ─────────────────────────────────────────────
// updateQuantity
// ─────────────────────────────────────────────
describe('updateQuantity', () => {
  it('aktualizuje ilość produktu', () => {
    useCartStore.getState().addItem(makeItem());
    useCartStore.getState().updateQuantity('item-1', '25.03.2026', 5);
    expect(useCartStore.getState().items[0].quantity).toBe(5);
  });

  it('usuwa produkt gdy ilość wynosi 0', () => {
    useCartStore.getState().addItem(makeItem());
    useCartStore.getState().updateQuantity('item-1', '25.03.2026', 0);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('usuwa produkt gdy ilość jest ujemna', () => {
    useCartStore.getState().addItem(makeItem());
    useCartStore.getState().updateQuantity('item-1', '25.03.2026', -1);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('aktualizuje tylko właściwy produkt', () => {
    useCartStore.getState().addItem(makeItem({ id: 'item-1' }));
    useCartStore.getState().addItem(makeItem({ id: 'item-2', name: 'Zupa' }));
    useCartStore.getState().updateQuantity('item-1', '25.03.2026', 3);
    const { items } = useCartStore.getState();
    expect(items.find(i => i.id === 'item-1')!.quantity).toBe(3);
    expect(items.find(i => i.id === 'item-2')!.quantity).toBe(1);
  });
});

// ─────────────────────────────────────────────
// clearCart
// ─────────────────────────────────────────────
describe('clearCart', () => {
  it('usuwa wszystkie produkty', () => {
    useCartStore.getState().addItem(makeItem({ id: 'item-1' }));
    useCartStore.getState().addItem(makeItem({ id: 'item-2' }));
    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('nie rzuca błędu na pustym koszyku', () => {
    expect(() => useCartStore.getState().clearCart()).not.toThrow();
  });
});

// ─────────────────────────────────────────────
// openCart / closeCart
// ─────────────────────────────────────────────
describe('openCart / closeCart', () => {
  it('openCart ustawia isOpen na true', () => {
    useCartStore.getState().openCart();
    expect(useCartStore.getState().isOpen).toBe(true);
  });

  it('closeCart ustawia isOpen na false', () => {
    useCartStore.getState().openCart();
    useCartStore.getState().closeCart();
    expect(useCartStore.getState().isOpen).toBe(false);
  });
});

// ─────────────────────────────────────────────
// total / originalTotal / savings
// ─────────────────────────────────────────────
describe('obliczenia finansowe', () => {
  beforeEach(() => {
    // item-1: originalPrice=20, price=19, qty=2
    // item-2: originalPrice=10, price=9.5, qty=1
    useCartStore.getState().addItem(makeItem({ id: 'item-1', originalPrice: 20 }));
    useCartStore.getState().addItem(makeItem({ id: 'item-1', originalPrice: 20 })); // qty → 2
    useCartStore.getState().addItem(makeItem({ id: 'item-2', name: 'Zupa', originalPrice: 10 }));
  });

  it('total() zwraca sumę cen po zniżce', () => {
    // 19*2 + 9.5*1 = 47.5
    expect(useCartStore.getState().total()).toBeCloseTo(47.5);
  });

  it('originalTotal() zwraca sumę cen oryginalnych', () => {
    // 20*2 + 10*1 = 50
    expect(useCartStore.getState().originalTotal()).toBeCloseTo(50);
  });

  it('savings() zwraca kwotę zaoszczędzoną', () => {
    // 50 - 47.5 = 2.5
    expect(useCartStore.getState().savings()).toBeCloseTo(2.5);
  });

  it('total() na pustym koszyku wynosi 0', () => {
    useCartStore.setState({ items: [] });
    expect(useCartStore.getState().total()).toBe(0);
  });

  it('savings() = originalTotal() - total()', () => {
    const { total, originalTotal, savings } = useCartStore.getState();
    expect(savings()).toBeCloseTo(originalTotal() - total());
  });
});

// ─────────────────────────────────────────────
// itemCount
// ─────────────────────────────────────────────
describe('itemCount', () => {
  it('zwraca 0 dla pustego koszyka', () => {
    expect(useCartStore.getState().itemCount()).toBe(0);
  });

  it('zwraca sumę ilości wszystkich produktów', () => {
    useCartStore.getState().addItem(makeItem({ id: 'item-1' }));
    useCartStore.getState().addItem(makeItem({ id: 'item-1' })); // qty=2
    useCartStore.getState().addItem(makeItem({ id: 'item-2', name: 'Zupa' })); // qty=1
    expect(useCartStore.getState().itemCount()).toBe(3);
  });
});

// ─────────────────────────────────────────────
// hasDrink
// ─────────────────────────────────────────────
describe('hasDrink', () => {
  it('zwraca false dla pustego koszyka', () => {
    expect(useCartStore.getState().hasDrink()).toBe(false);
  });

  it('zwraca false dla produktów bez napojów', () => {
    useCartStore.getState().addItem(makeItem({ category: 'Obiady' }));
    expect(useCartStore.getState().hasDrink()).toBe(false);
  });

  it('zwraca true gdy kategoria zawiera "napoje"', () => {
    useCartStore.getState().addItem(makeItem({ category: 'Desery i napoje' }));
    expect(useCartStore.getState().hasDrink()).toBe(true);
  });

  it('zwraca true gdy kategoria zawiera "desery"', () => {
    useCartStore.getState().addItem(makeItem({ category: 'Desery i napoje' }));
    expect(useCartStore.getState().hasDrink()).toBe(true);
  });

  it('zwraca true gdy nazwa produktu zawiera słowo kluczowe', () => {
    useCartStore.getState().addItem(makeItem({ name: 'Smoothie truskawkowy', category: 'Zdrowe' }));
    expect(useCartStore.getState().hasDrink()).toBe(true);
  });

  it('rozpoznaje "sok" w nazwie produktu', () => {
    useCartStore.getState().addItem(makeItem({ name: 'Sok pomarańczowy', category: 'Napoje' }));
    expect(useCartStore.getState().hasDrink()).toBe(true);
  });

  it('nie jest case-sensitive', () => {
    useCartStore.getState().addItem(makeItem({ category: 'DESERY I NAPOJE' }));
    expect(useCartStore.getState().hasDrink()).toBe(true);
  });
});

// ─────────────────────────────────────────────
// parsePrice
// ─────────────────────────────────────────────
describe('parsePrice', () => {
  it('parsuje typowy format polskiej ceny', () => {
    expect(parsePrice('19,90 zł')).toBeCloseTo(19.9);
  });

  it('parsuje cenę bez groszy', () => {
    expect(parsePrice('12 zł')).toBe(12);
  });

  it('parsuje cenę z przodu bez spacji', () => {
    expect(parsePrice('8,50zł')).toBeCloseTo(8.5);
  });

  it('parsuje ceny z menu (przykładowe wartości)', () => {
    expect(parsePrice('29,00 zł')).toBeCloseTo(29.0);
    expect(parsePrice('34,00 zł')).toBeCloseTo(34.0);
    expect(parsePrice('9,90 zł')).toBeCloseTo(9.9);
  });

  it('zwraca 0 dla pustego stringa', () => {
    expect(parsePrice('')).toBe(0);
  });

  it('zwraca 0 dla nieprawidłowej wartości', () => {
    expect(parsePrice('brak ceny')).toBe(0);
  });
});
