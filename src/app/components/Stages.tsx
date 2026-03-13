import { motion } from 'motion/react';
import { Mic, FileText, Brain, ClipboardCheck } from 'lucide-react';
import { SplitText, BlurReveal, StaggerContainer, StaggerItem, ClipReveal } from './motion-utils';

const steps = [
  {
    num: '01',
    icon: <Mic className="w-5 h-5" />,
    title: 'Устанавливаем устройство',
    description: 'Компактный микрофон на точке. Никаких камер. Никакого вмешательства в работу персонала.',
  },
  {
    num: '02',
    icon: <FileText className="w-5 h-5" />,
    title: 'Записываем 100% диалогов',
    description: 'Все разговоры с клиентами — расшифрованы, размечены по времени и сотруднику.',
  },
  {
    num: '03',
    icon: <Brain className="w-5 h-5" />,
    title: 'ИИ-анализ по вашему стандарту',
    description: 'Система оценивает каждый диалог по вашим скриптам: приветствие, выявление потребности, upsell, закрытие.',
  },
  {
    num: '04',
    icon: <ClipboardCheck className="w-5 h-5" />,
    title: 'Вы получаете отчёт с действиями',
    description: 'Не «статистику», а конкретно: какого сотрудника разобрать, по какому кейсу, сегодня.',
  },
];

export const Stages = () => {
  return (
    <section id="how" className="relative py-32 md:py-40 bg-[#050a09]">
      {/* Subtle glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[800px] h-[500px] top-1/2 -translate-y-1/2 -left-[200px]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,168,79,0.06) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6">
        {/* Header — centered */}
        <div className="text-center mb-20 mx-auto">
          <ClipReveal delay={0}>
            <p className="text-[14px] text-[#00A84F] tracking-wide uppercase mb-4">
              Принцип работы
            </p>
          </ClipReveal>
          <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] tracking-[-0.03em] leading-[1.1] mb-5 text-center">
            <span className="block text-center md:whitespace-nowrap">
              <SplitText delay={0.1} staggerDelay={0.06} className="inline-flex flex-wrap md:flex-nowrap justify-center" wordClassName="bg-clip-text text-transparent bg-gradient-to-br from-white via-white/90 to-white/50">
                Каждый диалог превращаем
              </SplitText>
            </span>
            <span className="block text-center">
              <SplitText delay={0.3} staggerDelay={0.06} className="inline-flex flex-wrap md:flex-nowrap justify-center" wordClassName="bg-clip-text text-transparent bg-gradient-to-r from-[#00A84F] to-[#34D27B]">
                в конкретное действие
              </SplitText>
            </span>
          </h2>
        </div>

        {/* 4 steps with connecting line */}
        <div className="relative">
          {/* Connecting line — desktop only */}
          <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px">
            <div className="absolute inset-0 bg-white/[0.04]" />
            <motion.div
              className="absolute inset-y-0 left-0 right-0 origin-left"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background: 'linear-gradient(90deg, #00A84F 0%, #34D27B 60%, transparent 100%)',
              }}
            />
          </div>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-6" staggerDelay={0.1} delay={0.15}>
            {steps.map((step, index) => (
              <StaggerItem key={index}>
                <div className="group text-center relative">
                  {/* Step circle */}
                  <div className="w-16 h-16 rounded-full border border-white/[0.08] bg-[#050a09] flex items-center justify-center mx-auto mb-7 relative z-10 group-hover:border-[#00A84F]/40 group-hover:bg-[#0a1f14] transition-all duration-500">
                    <span className="text-[18px] text-white/60 group-hover:text-[#34D27B] transition-colors duration-500">
                      {step.num}
                    </span>
                  </div>
                  <h3 className="text-[20px] text-white/90 mb-2.5 tracking-[-0.01em] leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-[14px] text-white/55 leading-relaxed max-w-[220px] mx-auto">
                    {step.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
};

export default Stages;