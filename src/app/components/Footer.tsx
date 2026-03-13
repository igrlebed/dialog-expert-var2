import { LegalModal, PrivacyPolicyContent, TermsOfServiceContent } from './LegalModal';
import rootCodePaths from '../../imports/svg-3rl6qm2vfh';
import { useState } from 'react';
import svgPaths from '../../imports/svg-2fzfvhnwda';
import { BlurReveal } from './motion-utils';
import { useSmoothScroll } from './SmoothScroll';
import { scrollToSection } from './scroll-utils';
import { navItems } from './nav-items';

export const Footer = () => {
  const smoothScroll = useSmoothScroll();
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    scrollToSection(href, smoothScroll);
  };

  return (
    <footer className="bg-[#050a09] border-t border-white/[0.04]">
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <BlurReveal y={20}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            {/* Logos */}
            <div className="flex items-center gap-6">
              <a href="#" onClick={(e) => handleNavClick(e, '#')} className="flex items-center gap-2.5">
                <svg className="w-7 h-6" fill="none" viewBox="0 0 45 36">
                  <path d={svgPaths.p25ebba80} fill="#00A84F" />
                  <path d={svgPaths.p20945000} fill="#34D27B" />
                </svg>
                <span className="text-[18px] text-white/80 tracking-[-0.01em]">
                  Диалог<span className="text-white/45 ml-0.5">Эксперт</span>
                </span>
              </a>
              <span className="h-5 w-px bg-white/10" />
              <svg className="h-[18px] w-auto" fill="none" viewBox="0 0 183 30">
                <path d={rootCodePaths.p3a38fc80} fill="rgba(255,255,255,0.45)" />
                <path d={rootCodePaths.p8c91c00} fill="rgba(255,255,255,0.45)" />
                <path d={rootCodePaths.p219d830} fill="rgba(255,255,255,0.45)" />
                <path d={rootCodePaths.p1035eb00} fill="rgba(255,255,255,0.45)" />
                <path d={rootCodePaths.p1e5c4880} fill="rgba(255,255,255,0.45)" />
                <path d={rootCodePaths.pc26180} fill="#191A1F" />
                <path d={rootCodePaths.p89ab200} fill="#191A1F" />
                <path d={rootCodePaths.p9600300} fill="#191A1F" />
                <path d={rootCodePaths.p1a5b24c0} fill="#191A1F" />
                <path d={rootCodePaths.p8e00400} fill="#191A1F" />
              </svg>
            </div>

            {/* Nav */}
            <nav className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="text-[14px] text-white/50 hover:text-white/70 transition-colors tracking-[-0.01em]"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </BlurReveal>

        <div className="h-px bg-white/[0.04] mb-8" />

        <BlurReveal delay={0.1} y={15}>
          <div className="flex flex-col items-center md:flex-row md:items-center justify-between gap-4 text-center md:text-left">
            <span className="text-[14px] text-white/25 tracking-[-0.01em]">
              &copy; {new Date().getFullYear()} ДиалогЭксперт. Речевая аналитика офлайн-диалогов.
            </span>

            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <button
                onClick={() => setPrivacyOpen(true)}
                className="text-[14px] text-white/25 tracking-[-0.01em] cursor-pointer hover:text-white/40 transition-colors"
              >
                Политика конфиденциальности
              </button>
              <button
                onClick={() => setTermsOpen(true)}
                className="text-[14px] text-white/25 tracking-[-0.01em] cursor-pointer hover:text-white/40 transition-colors"
              >
                Пользовательское соглашение
              </button>
            </div>
          </div>
        </BlurReveal>
      </div>

      <LegalModal
        isOpen={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        title="Политика конфиденциальности"
      >
        <PrivacyPolicyContent />
      </LegalModal>

      <LegalModal
        isOpen={termsOpen}
        onClose={() => setTermsOpen(false)}
        title="Пользовательское соглашение"
      >
        <TermsOfServiceContent />
      </LegalModal>

      {/* Third level — legal info */}
      <div className="border-t border-white/[0.04]">
        <div className="max-w-[1200px] mx-auto px-6 py-5">
          <BlurReveal delay={0.15} y={10}>
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-x-6 gap-y-1.5 text-[14px] text-white/25 tracking-[-0.01em] text-center">
              <span>ИНН 7708399508</span>
              <span className="hidden sm:inline text-white/20">·</span>
              <span>ОКВЭД 62.01</span>
              <span className="hidden sm:inline text-white/20">·</span>
              <span>Аккредитация Минцифры России от 29.10.2021 № АО-20211028-453499</span>
              <span className="hidden sm:inline text-white/20">·</span>
              <span>Реестр отечественного ПО №30823</span>
            </div>
            <p className="mt-4 max-w-[800px] mx-auto text-[12px] text-white/15 tracking-[-0.01em] text-center leading-[1.6]">
              Представленные данные основаны на внутренней аналитике компаний и носят справочный характер. Результаты вашего проекта могут отличаться в зависимости от исходных условий. Любые цифры, указанные в портфолио, не являются публичной офертой (ст.&nbsp;437 ГК&nbsp;РФ) и не гарантируют достижения аналогичных показателей.
            </p>
          </BlurReveal>
        </div>
      </div>
    </footer>
  );
};

export default Footer;