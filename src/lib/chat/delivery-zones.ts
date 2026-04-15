export interface DeliveryZone {
  city: string;
  aliases: string[];
  available: boolean;
  note?: string;
}

export const DELIVERY_ZONES: DeliveryZone[] = [
  {
    city: 'Tilburg',
    aliases: ['tilburg'],
    available: true,
    note: 'We deliver to Tilburg.',
  },
  {
    city: 'Den Bosch',
    aliases: ["'s-hertogenbosch", 's-hertogenbosch', 'hertogenbosch', 'denbosch', 'den bosch', 'bossche'],
    available: true,
    note: "We deliver to Den Bosch ('s-Hertogenbosch).",
  },
  {
    city: 'Eindhoven',
    aliases: ['eindhoven'],
    available: true,
    note: 'We deliver to Eindhoven.',
  },
  {
    city: 'Venlo',
    aliases: ['venlo'],
    available: true,
    note: 'We deliver to Venlo.',
  },
];

export function checkDelivery(cityInput: string): {
  available: boolean;
  city?: string;
  note?: string;
} {
  const normalised = cityInput.toLowerCase().trim();

  for (const zone of DELIVERY_ZONES) {
    const allNames = [zone.city.toLowerCase(), ...zone.aliases.map((a) => a.toLowerCase())];
    if (allNames.some((name) => normalised.includes(name) || name.includes(normalised))) {
      return { available: zone.available, city: zone.city, note: zone.note };
    }
  }

  return { available: false };
}
