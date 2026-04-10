'use client';

import { useTranslations } from 'next-intl';
import { getSiteConfig } from '@/config/sites';

const siteConfig = getSiteConfig();
const isHB = siteConfig.id === 'hongige-beer-migrant' || siteConfig.id === 'hongige-beer-office';

const HB_CONTACT = {
  companyName: 'Foodmarkt BV',
  address: 'Blankenstein 265, 7943 PG Meppel, Netherlands',
  phone: '+31 682595605',
  phoneHref: 'tel:+31682595605',
  emailInfo: 'info@foodmarkt.com',
  emailOrder: 'order@foodmarkt.com',
  coc: 'CoC: 78333490',
  vat: 'VAT: NL861353730B01',
  logo: '/images/hb-logo.png',
  copyright: 'Foodmarkt BV / Hongige Beer',
};

const GN_CONTACT = {
  phone: '+48 732 999 072',
  phoneHref: 'tel:+48732999072',
  email: 'biuro@glodnyniedzwiedz.pl',
  logo: '/images/logo.webp',
  copyright: 'Głodny Niedźwiedź',
};

export default function FooterSection() {
  const tCta = useTranslations('footerCta');
  const tFooter = useTranslations('footer');
  const tNav = useTranslations('nav');

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
      <section id="contact" className="bg-[#1B4332] px-6 py-16 relative overflow-hidden">
        <div className="absolute -bottom-12 -right-12 opacity-5 pointer-events-none select-none">
          <img src={isHB ? HB_CONTACT.logo : GN_CONTACT.logo} alt="" className="w-96 h-auto" />
        </div>

        <div className="mx-auto max-w-2xl text-center relative z-10">
          <h2 className="font-heading font-black text-4xl text-[#FDF6EC] leading-tight mb-8">
            {tCta('headline')}
          </h2>
          <button
            onClick={scrollToMenu}
            className="w-full rounded-full bg-[#ed8788] px-8 py-5 font-heading font-extrabold text-lg text-white shadow-2xl transition-all hover:opacity-90 active:scale-[0.98] mb-6"
          >
            {tCta('cta')} →
          </button>
          {isHB ? (
            <p className="text-[#FDF6EC]/40 text-sm">
              {HB_CONTACT.emailInfo} · {HB_CONTACT.phone}
            </p>
          ) : (
            <p className="text-[#FDF6EC]/40 text-sm">
              Dostawa Mon–Fri · biuro@glodnyniedzwiedz.pl · +48 732 999 072
            </p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#152b23] px-6 pt-16 pb-8 border-t border-[#1b3a2e]">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 lg:gap-12 mb-16">

            {/* Pages Col */}
            <div className="col-span-1">
              <p className="font-bold text-white mb-6 uppercase tracking-wider text-xs">
                {tFooter('pages')}
              </p>
              <ul className="flex flex-col gap-4">
                <li><a href="/#menu-section" className="text-sm text-white/60 hover:text-white transition-colors">{tNav('menu')}</a></li>
                <li><a href="/#how-it-works" className="text-sm text-white/60 hover:text-white transition-colors">{tNav('howItWorks')}</a></li>
                <li><a href="/#faq" className="text-sm text-white/60 hover:text-white transition-colors">{tNav('faq')}</a></li>
                {!isHB && (
                  <li><a href="/dla-firm" className="text-sm text-white/60 hover:text-white transition-colors">{tNav('forBusiness')}</a></li>
                )}
              </ul>
            </div>

            {/* Legal Col */}
            <div className="col-span-1">
              <p className="font-bold text-white mb-6 uppercase tracking-wider text-xs">
                {tFooter('legalLinks')}
              </p>
              <ul className="flex flex-col gap-4">
                <li><a href="/terms" className="text-sm text-white/60 hover:text-white transition-colors">{tFooter('termsOfService')}</a></li>
                <li><a href="/privacy" className="text-sm text-white/60 hover:text-white transition-colors">{tFooter('privacyPolicy')}</a></li>
              </ul>
            </div>

            {/* Contact Col */}
            <div className="col-span-2 md:col-span-2 lg:col-span-1">
              <p className="font-bold text-white mb-6 uppercase tracking-wider text-xs">
                {tFooter('contact')}
              </p>
              {isHB ? (
                <ul className="flex flex-col gap-4">
                  <li><a href={HB_CONTACT.phoneHref} className="text-sm text-white/60 hover:text-white transition-colors">{HB_CONTACT.phone}</a></li>
                  <li><a href={`mailto:${HB_CONTACT.emailInfo}`} className="text-sm text-white/60 hover:text-white transition-colors">{HB_CONTACT.emailInfo}</a></li>
                  <li><a href={`mailto:${HB_CONTACT.emailOrder}`} className="text-sm text-white/60 hover:text-white transition-colors">{HB_CONTACT.emailOrder}</a></li>
                </ul>
              ) : (
                <ul className="flex flex-col gap-4">
                  <li><a href={GN_CONTACT.phoneHref} className="text-sm text-white/60 hover:text-white transition-colors">{GN_CONTACT.phone}</a></li>
                  <li><a href={`mailto:${GN_CONTACT.email}`} className="text-sm text-white/60 hover:text-white transition-colors">{GN_CONTACT.email}</a></li>
                </ul>
              )}
            </div>

            {/* Brand Col */}
            <div className="col-span-2 md:col-span-4 lg:col-span-3 lg:pl-12 lg:border-l border-white/10">
              <div className="mb-6">
                <img
                  src={isHB ? HB_CONTACT.logo : GN_CONTACT.logo}
                  alt={isHB ? 'Hongige Beer' : 'Głodny Niedźwiedź'}
                  className="h-10 w-auto"
                />
              </div>

              <p className="text-sm text-white/60 mb-6 italic">
                {tFooter('tagline')}
              </p>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#ed8788] mb-3">
                  {tFooter('companyDetails')}
                </p>
                {isHB ? (
                  <div className="text-[11px] text-white/40 leading-relaxed flex flex-col gap-1">
                    <span className="font-semibold text-white/60">{HB_CONTACT.companyName}</span>
                    <span>{HB_CONTACT.address}</span>
                    <span className="mt-1">{HB_CONTACT.coc}</span>
                    <span>{HB_CONTACT.vat}</span>
                  </div>
                ) : (
                  <p className="text-[11px] text-white/40 leading-relaxed text-justify">
                    {tFooter('companyInfo')}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/40 text-center md:text-left">
              © {new Date().getFullYear()} {isHB ? HB_CONTACT.copyright : GN_CONTACT.copyright}. {tFooter('rights')}.
            </p>
            <div className="flex items-center gap-4 opacity-50">
              {/* Optional space for future icons */}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
