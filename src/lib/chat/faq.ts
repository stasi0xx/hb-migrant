// FAQ in English — the system prompt embeds this knowledge.
// Bero (the assistant) responds in whatever language the customer writes in.
export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ: FAQItem[] = [
  {
    question: 'How does ordering work?',
    answer:
      'You choose a 3-day or 6-day package, pick your city, enter your delivery address, and pay online by card or iDEAL. We deliver your meals twice a week (Wednesday and Sunday evenings) straight to your door. That is it.',
  },
  {
    question: 'How much does it cost?',
    answer:
      'Food costs €9.98 per day. Delivery costs €1.66 per day. So a 3-day package costs €34.92 and a 6-day package costs €69.84 total (food + delivery). No hidden fees.',
  },
  {
    question: 'Which cities do you deliver to?',
    answer:
      'We currently deliver to Tilburg, Den Bosch, Eindhoven, and Venlo. More cities are coming. If you are not sure whether we reach your exact address, just ask.',
  },
  {
    question: 'How often are deliveries and when?',
    answer:
      'Twice a week — Wednesday evening (18:00–21:00) and Sunday evening (18:00–21:00). A 3-day package arrives in one delivery. A 6-day package arrives in two consecutive deliveries (e.g. Sunday + following Wednesday). Food is always fresh for each batch.',
  },
  {
    question: 'What kind of food do you serve?',
    answer:
      'Home-cooked Polish meals — things like pork schnitzel (schabowy), bigos, soups, pierogi, and other hearty dishes you would recognize from home. Everything is cooked in Poland and transported fresh to the Netherlands. Real food, not fast food.',
  },
  {
    question: 'How do I pay?',
    answer:
      'Online by card or iDEAL. Payment is handled securely through Stripe. We do not accept cash.',
  },
  {
    question: 'What packages are available?',
    answer:
      'We offer two package sizes: 3 days or 6 days. A 3-day package is one delivery. A 6-day package is two consecutive deliveries (3 days of food each time). That is it — no other sizes.',
  },
  {
    question: 'What is included in a day\'s meals?',
    answer:
      'Each day you get a full meal — typically a main dish and a soup. Filling, home-cooked, and made to keep you going after a long shift.',
  },
  {
    question: 'What if I am not home during delivery?',
    answer:
      'Leave delivery instructions in your order notes — for example where to leave the package (front door, reception, neighbour, etc.). Our driver will follow them.',
  },
  {
    question: 'Can I cancel my order?',
    answer:
      'Contact us as soon as possible. Once food preparation has started, cancellation may not be possible. Write to us and we will do our best to help.',
  },
  {
    question: 'Do you have allergen information?',
    answer:
      'We provide basic ingredient information. If you have a serious food allergy, please contact us directly before ordering — we want to make sure it is safe for you.',
  },
  {
    question: 'Is the food halal?',
    answer:
      'Our food is not certified halal. If this is important to you, please contact us before placing an order.',
  },
  {
    question: 'Can I choose specific dishes?',
    answer:
      'You order a package — we select the best dishes based on the weekly menu. If you have strong preferences or dietary needs, mention them in the order notes.',
  },
];
