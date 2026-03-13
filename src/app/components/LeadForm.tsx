import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, Clock, CheckCircle2, FileText } from 'lucide-react';
import { SplitText, BlurReveal, ScaleReveal } from './motion-utils';

const guarantees = [
  { icon: <Star className="w-4 h-4 text-[#00A84F]" />, text: 'Работает с 1 точки' },
  { icon: <Clock className="w-4 h-4 text-[#00A84F]" />, text: 'Результат за 48 часов' },
  { icon: <FileText className="w-4 h-4 text-[#00A84F]" />, text: 'Соответствует 152-ФЗ' },
];

export const LeadForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setIsSubmitted(true);
  };

  return (
    <section id="form" className="relative py-32 md:py-40 bg-[#050a09] text-center overflow-hidden">
      {/* Central glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]"
          style={{
            background: 'radial-gradient(circle, rgba(0,168,79,0.12) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-[700px] lg:max-w-[820px] mx-auto px-6">
        {/* Badge */}
        <BlurReveal delay={0}>
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#00A84F]/30 bg-[#00A84F]/10 mb-8">
            <span className="text-[14px] text-[#00A84F] tracking-[0.12em] uppercase">
              Пилот — 14 дней
            </span>
          </div>
        </BlurReveal>

        {/* Heading */}
        <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] tracking-[-0.03em] leading-[1.1] mb-5">
          <SplitText delay={0.1} staggerDelay={0.06} wordClassName="bg-clip-text text-transparent bg-gradient-to-br from-white via-white/90 to-white/50">
            Узнайте, где вы теряете деньги —
          </SplitText>
          {' '}
          <SplitText delay={0.4} staggerDelay={0.06} wordClassName="bg-clip-text text-transparent bg-gradient-to-r from-[#00A84F] to-[#34D27B]">
            сегодня
          </SplitText>
        </h2>

        <BlurReveal delay={0.3} y={20}>
          <p className="text-[18px] text-white/60 max-w-lg mx-auto leading-relaxed mb-10">
            Подключим одну точку. Через 48 часов покажем первый отчёт по вашим диалогам.
          </p>
        </BlurReveal>

        {/* Form */}
        <ScaleReveal delay={0.2}>
          {isSubmitted ? (
            <div className="py-16">
              <div className="w-16 h-16 rounded-2xl bg-[#00A84F]/15 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-[#34D27B]" />
              </div>
              <h3 className="text-[20px] text-white/90 mb-3 tracking-[-0.02em]">
                Заявка принята
              </h3>
              <p className="text-[18px] text-white/60 max-w-sm mx-auto">
                Наш менеджер свяжется с вами в течение 15 минут для уточнения деталей.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-3 justify-center items-center">
              <input
                type="text"
                placeholder="Ваше имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full lg:w-[260px] px-6 py-4 rounded-xl bg-white/[0.05] border border-white/[0.08] text-[18px] text-white/80 placeholder:text-white/45 outline-none focus:border-[#00A84F]/40 transition-colors duration-300"
              />
              <input
                type="tel"
                placeholder="+7 (___) ___-__-__"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full lg:w-[260px] px-6 py-4 rounded-xl bg-white/[0.05] border border-white/[0.08] text-[18px] text-white/80 placeholder:text-white/45 outline-none focus:border-[#00A84F]/40 transition-colors duration-300"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group w-full lg:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#00A84F] hover:bg-[#00C85A] text-[18px] text-white tracking-[-0.01em] transition-colors duration-300 shadow-[0_0_40px_rgba(0,168,79,0.35)] hover:shadow-[0_0_60px_rgba(0,168,79,0.5)] whitespace-nowrap"
              >
                Получить демо
              </motion.button>
            </form>
          )}
        </ScaleReveal>

        {/* Guarantees strip */}
        <BlurReveal delay={0.5} y={20}>
          <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-nowrap sm:justify-center sm:gap-x-6 md:gap-x-8 mt-16">
            {guarantees.map((g, i) => (
              <div key={i} className="flex items-center justify-center gap-2 sm:gap-2.5 text-[14px] text-white/60 whitespace-nowrap">
                {g.icon}
                {g.text}
              </div>
            ))}
          </div>
        </BlurReveal>
      </div>
    </section>
  );
};

export default LeadForm;