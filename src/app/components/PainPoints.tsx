import { motion } from 'motion/react';
import {
  SplitText,
  BlurReveal,
  StaggerContainer,
  StaggerItem,
  MagneticCard,
  ClipReveal,
} from './motion-utils';

const painPoints = [
  {
    number: '01',
    title: 'Тренинги не работают',
    description: 'Вы платите за обучение, но не знаете — применяет ли продавец скрипт. Через неделю всё возвращается на круги своя.',
  },
  {
    number: '02',
    title: 'Цифры есть, причин нет',
    description: 'Конверсия упала на 12%. Почему? Новый сотрудник? Другой скрипт? Сезон? Вы гадаете вместо того, чтобы знать.',
  },
  {
    number: '03',
    title: 'Масштаб невозможен',
    description: 'Одну точку вы ещё контролируете лично. Три точки — уже нет. Как обеспечить единый стандарт на всей сети?',
  },
];

export const PainPoints = () => {
  return (
    <section id="pain" className="relative pt-32 md:pt-40 pb-32 md:pb-40 bg-transparent">
      {/* Top-to-solid background gradient — blends with Hero */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(5,10,9,0.4) 15%, rgba(5,10,9,0.85) 30%, #050a09 45%)',
        }}
      />

      {/* Subtle aurora glow */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-[800px] h-[500px] -top-[200px] left-1/2 -translate-x-1/2"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,168,79,0.06) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      {/* Diagonal hatching overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(-45deg, transparent, transparent 60px, rgba(0,168,79,0.02) 60px, rgba(0,168,79,0.02) 61px)',
        }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6">
        {/* Section header — centered */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <ClipReveal delay={0}>
            <p className="text-[14px] text-[#00A84F] tracking-wide uppercase mb-4">
              Реальность вашего бизнеса
            </p>
          </ClipReveal>
          <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] tracking-[-0.03em] leading-[1.1] mb-5">
            <SplitText delay={0.1} staggerDelay={0.06} wordClassName="bg-clip-text text-transparent bg-gradient-to-br from-white via-white/90 to-white/50">
              Вы управляете тем,
            </SplitText>
            <br />
            <SplitText delay={0.3} staggerDelay={0.06} wordClassName="bg-clip-text text-transparent bg-gradient-to-r from-[#00A84F] to-[#34D27B]">
              чего не видите
            </SplitText>
          </h2>
          <BlurReveal delay={0.4} y={40}>
            <p className="text-[18px] text-white/60 leading-relaxed tracking-[-0.01em]">
              Тайные покупатели — раз в месяц. Прослушка колл-центра — только для телефона.
              А живые диалоги с клиентами у вас на кассе? Они исчезают навсегда.
            </p>
          </BlurReveal>
        </div>

        {/* 3-column grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-[2px]" staggerDelay={0.08} delay={0.15}>
          {painPoints.map((point, index) => (
            <StaggerItem key={index}>
              <MagneticCard className="h-full">
                <div className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 md:p-10 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-500 overflow-hidden h-full">
                  {/* Hover glow */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[#00A84F]/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  <div className="relative z-10">
                    {/* Large faded number */}
                    <span className="text-[56px] tracking-[-0.04em] bg-clip-text text-transparent bg-gradient-to-b from-[#00A84F]/20 to-transparent leading-none mb-4 block">
                      {point.number}
                    </span>
                    <h3 className="text-[20px] text-white/90 mb-3 tracking-[-0.01em] leading-snug">
                      {point.title}
                    </h3>
                    <p className="text-[18px] text-white/55 leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </div>
              </MagneticCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default PainPoints;