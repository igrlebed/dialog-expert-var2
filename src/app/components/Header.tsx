import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import svgPaths from '../../imports/svg-2fzfvhnwda';
import { Menu, X } from 'lucide-react';
import { useSmoothScroll } from './SmoothScroll';
import { scrollToSection } from './scroll-utils';
import { navItems } from './nav-items';

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const smoothScroll = useSmoothScroll();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    scrollToSection(href, smoothScroll);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div
        className={`transition-all duration-500 border-b ${
          scrolled
            ? 'bg-[#050a09]/70 backdrop-blur-2xl border-white/[0.04]'
            : 'bg-transparent border-transparent'
        }`}
        style={{ height: 'var(--header-height, 72px)' }}
      >
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-16 md:h-[72px]">
          {/* Logo */}
          <a href="#" onClick={(e) => handleNavClick(e, '#')} className="flex items-center gap-2.5 shrink-0 group">
            <motion.svg
              className="w-8 h-7"
              fill="none"
              viewBox="0 0 45 36"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <path d={svgPaths.p25ebba80} fill="#00A84F" />
              <path d={svgPaths.p20945000} fill="#34D27B" />
            </motion.svg>
            <span className="text-[18px] text-white/90 tracking-[-0.01em]">
              Диалог<span className="text-white/60 ml-0.5">Эксперт</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="relative px-3.5 py-2 text-[14px] text-white/60 hover:text-white/95 transition-colors duration-200 tracking-[-0.01em] group"
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-[#00A84F]/50 group-hover:w-4/5 transition-all duration-300" />
              </motion.a>
            ))}
          </nav>

          {/* Right side: CTA */}
          <div className="flex items-center gap-3">
            <motion.a
              href="#form"
              onClick={(e) => handleNavClick(e, '#form')}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00A84F] hover:bg-[#00C85A] text-[14px] text-white tracking-[-0.01em] transition-all duration-200 shadow-[0_0_20px_rgba(0,168,79,0.3)] hover:shadow-[0_0_30px_rgba(0,168,79,0.5)]"
            >
              Получить демо
            </motion.a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Закрыть меню' : 'Открыть меню'}
              className="md:hidden p-2 text-white/70 hover:text-white"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, height: 'auto', filter: 'blur(0px)' }}
            exit={{ opacity: 0, height: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden bg-[#050a09]/95 backdrop-blur-2xl border-b border-white/[0.04] overflow-hidden"
          >
            <nav className="max-w-[1200px] mx-auto px-6 py-4 flex flex-col gap-1">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="px-3 py-2.5 text-[18px] text-white/70 hover:text-white/95 transition-colors rounded-lg hover:bg-white/[0.04] text-right"
                >
                  {item.label}
                </motion.a>
              ))}

              <motion.a
                href="#form"
                onClick={(e) => handleNavClick(e, '#form')}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#00A84F] text-[18px] text-white"
              >
                Получить демо
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};