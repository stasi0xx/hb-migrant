'use client';

import { useTranslations } from 'next-intl';

export default function FooterSection() {
  const tCta = useTranslations('footerCta');
  const tFooter = useTranslations('footer');

  const scrollToMenu = () => {
    const el = document.getElementById('menu-section');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Footer CTA */}
      <section className="bg-[#1B4332] px-6 py-16 relative overflow-hidden">
        <div className="absolute -bottom-8 -right-4 opacity-5 pointer-events-none select-none text-[200px] leading-none">
          🐾
        </div>

        <div className="mx-auto max-w-2xl text-center relative z-10">
          <h2 className="font-heading font-black text-4xl text-[#FDF6EC] leading-tight mb-8">
            {tCta('headline')}
          </h2>
          <button
            onClick={scrollToMenu}
            className="w-full rounded-full bg-[#E8927C] px-8 py-5 font-heading font-extrabold text-lg text-white shadow-2xl transition-all hover:opacity-90 active:scale-[0.98] mb-6"
          >
            {tCta('cta')} →
          </button>
          <p className="text-[#FDF6EC]/40 text-sm">
            Dostawa Mon–Fri · biuro@glodnyniedzwiedz.pl · +48 732 999 072
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#152b23] px-6 py-8">
        <div className="mx-auto max-w-2xl">
          {/* Logo row */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8927C]">
              <span className="font-heading font-black text-sm text-white leading-none">🐾</span>
            </div>
            <div>
              <p className="font-heading font-black text-base text-white leading-none">Głodny Niedźwiedź</p>
              <p className="text-[10px] text-[#E8927C]/70 uppercase tracking-widest">Est. 2018 Catering</p>
            </div>
          </div>

          <p className="text-sm text-white/40 italic mb-6">{tFooter('tagline')}</p>

          {/* Contact */}
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-[#E8927C] mb-3">
              {tFooter('contact')}
            </p>
            <a
              href="tel:+48732999072"
              className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors mb-2"
            >
              <svg className="h-4 w-4 text-[#E8927C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +48 732 999 072
            </a>
            <a
              href="mailto:biuro@glodnyniedzwiedz.pl"
              className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
            >
              <svg className="h-4 w-4 text-[#E8927C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              biuro@glodnyniedzwiedz.pl
            </a>
          </div>

          {/* Bottom */}
          <div className="border-t border-white/10 pt-4">
            <p className="text-xs text-white/30 text-center">
              © {new Date().getFullYear()} Głodny Niedźwiedź. {tFooter('rights')}.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
