import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Check } from 'lucide-react';
import { SplitText, BlurReveal, StaggerContainer, StaggerItem, ScaleReveal, ClipReveal } from './motion-utils';

const features = [
  {
    title: 'Рейтинг сотрудников в реальном времени',
    description: 'Видите, кто из продавцов теряет клиентов — до того, как закрылась смена.',
  },
  {
    title: 'Автоматические алерты на критические диалоги',
    description: 'Грубость, игнорирование клиента, нарушение скрипта — уведомление сразу.',
  },
  {
    title: 'Сравнение точек и смен',
    description: 'Почему одна точка продаёт лучше другой? Теперь вы знаете точно.',
  },
  {
    title: 'Готовые материалы для разборов',
    description: 'Реальные фрагменты диалогов для обучения — лучшие и худшие примеры недели.',
  },
];

const dashMetrics = [
  { value: '67%', label: 'Конверсия сегодня' },
  { value: '23', label: 'Диалогов сегодня' },
  { value: '4.2', label: 'Средний чек, тыс. ₽' },
  { value: '89%', label: 'Соблюдение скрипта' },
];

/* ── Chart data ── */
const chartData = [
  { day: 'Пн', total: 31, converted: 8 },
  { day: 'Вт', total: 27, converted: 12 },
  { day: 'Ср', total: 34, converted: 10 },
  { day: 'Чт', total: 22, converted: 15 },
  { day: 'Пт', total: 36, converted: 11 },
  { day: 'Сб', total: 29, converted: 18 },
  { day: 'Вс', total: 16, converted: 6 },
];

const dashBars = [
  { name: 'Сотрудник 1', value: 91, color: '#00A84F' },
  { name: 'Сотрудник 2', value: 74, color: '#34D27B' },
  { name: 'Сотрудник 3', value: 48, color: '#E05040' },
];

/* ── Custom SVG mini-chart ── */
const CHART_W = 280;
const CHART_H = 120;
const CHART_PAD = { top: 8, right: 8, bottom: 20, left: 28 };
const Y_MAX = 40;

function toX(i: number) {
  const plotW = CHART_W - CHART_PAD.left - CHART_PAD.right;
  return CHART_PAD.left + (i / (chartData.length - 1)) * plotW;
}
function toY(v: number) {
  const plotH = CHART_H - CHART_PAD.top - CHART_PAD.bottom;
  return CHART_PAD.top + plotH - (v / Y_MAX) * plotH;
}
function makePath(key: 'total' | 'converted') {
  return chartData.map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(1)},${toY(d[key]).toFixed(1)}`).join(' ');
}
function makeAreaPath(key: 'total' | 'converted') {
  const line = chartData.map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(1)},${toY(d[key]).toFixed(1)}`).join(' ');
  const bottom = `L${toX(chartData.length - 1).toFixed(1)},${toY(0).toFixed(1)} L${toX(0).toFixed(1)},${toY(0).toFixed(1)} Z`;
  return `${line} ${bottom}`;
}

const yTicks = [0, 10, 20, 30, 40];

function MiniChart({ animate }: { animate: boolean }) {
  return (
    <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="mcGradGreen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00A84F" stopOpacity={0.18} />
          <stop offset="100%" stopColor="#00A84F" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="mcGradPurple" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A78BFA" stopOpacity={0.15} />
          <stop offset="100%" stopColor="#A78BFA" stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Horizontal grid lines */}
      {yTicks.map(t => (
        <line
          key={`grid-${t}`}
          x1={CHART_PAD.left}
          x2={CHART_W - CHART_PAD.right}
          y1={toY(t)}
          y2={toY(t)}
          stroke="rgba(255,255,255,0.05)"
          strokeDasharray="3 3"
        />
      ))}

      {/* Y-axis labels */}
      {yTicks.map(t => (
        <text
          key={`y-${t}`}
          x={CHART_PAD.left - 6}
          y={toY(t) + 3}
          textAnchor="end"
          fill="rgba(255,255,255,0.2)"
          fontSize={8}
        >
          {t}
        </text>
      ))}

      {/* X-axis labels */}
      {chartData.map((d, i) => (
        <text
          key={`x-${i}`}
          x={toX(i)}
          y={CHART_H - 4}
          textAnchor="middle"
          fill="rgba(255,255,255,0.25)"
          fontSize={8}
        >
          {d.day}
        </text>
      ))}

      {/* Green area fill */}
      <motion.path
        d={makeAreaPath('total')}
        fill="url(#mcGradGreen)"
        initial={{ opacity: 0 }}
        animate={animate ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      />

      {/* Green line (total) */}
      <motion.path
        d={makePath('total')}
        fill="none"
        stroke="#00A84F"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={animate ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Purple area fill */}
      <motion.path
        d={makeAreaPath('converted')}
        fill="url(#mcGradPurple)"
        initial={{ opacity: 0 }}
        animate={animate ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      />

      {/* Purple dashed line (converted) */}
      <motion.path
        d={makePath('converted')}
        fill="none"
        stroke="#A78BFA"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="6 3"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={animate ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 1.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Green dots */}
      {chartData.map((d, i) => (
        <motion.circle
          key={`dot-total-${i}`}
          cx={toX(i)}
          cy={toY(d.total)}
          r={3}
          fill="#050a09"
          stroke="#00A84F"
          strokeWidth={1.5}
          initial={{ scale: 0, opacity: 0 }}
          animate={animate ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.8 + i * 0.06 }}
        />
      ))}

      {/* Purple dots */}
      {chartData.map((d, i) => (
        <motion.circle
          key={`dot-conv-${i}`}
          cx={toX(i)}
          cy={toY(d.converted)}
          r={3}
          fill="#050a09"
          stroke="#A78BFA"
          strokeWidth={1.5}
          initial={{ scale: 0, opacity: 0 }}
          animate={animate ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.3, delay: 1.0 + i * 0.06 }}
        />
      ))}
    </svg>
  );
}

function AnimatedBar({ bar, inView, delay }: { bar: typeof dashBars[0]; inView: boolean; delay: number }) {
  return (
    <div>
      <div className="flex justify-between text-[14px] text-white/60 mb-1.5">
        <span>{bar.name}</span>
        <span style={{ color: bar.color }}>{bar.value}%</span>
      </div>
      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${bar.color}, ${bar.color}88)` }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${bar.value}%` } : { width: 0 }}
          transition={{ duration: 1.5, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

export const Included = () => {
  const dashRef = useRef<HTMLDivElement>(null);
  const dashInView = useInView(dashRef, { once: true, margin: '-50px' });

  return (
    <section id="features" className="relative py-32 md:py-40 bg-[#050a09]">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Eyebrow */}
        <ClipReveal delay={0}>
          <p className="text-[14px] text-[#00A84F] tracking-wide uppercase mb-4 text-center lg:text-left">
            Возможности системы
          </p>
        </ClipReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
          {/* Left: Heading + subtitle + Feature cards */}
          <div className="flex flex-col">
            <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] tracking-[-0.03em] leading-[1.15] mb-4 text-center lg:text-left">
              <SplitText delay={0.1} staggerDelay={0.06} wordClassName="bg-clip-text text-transparent bg-gradient-to-br from-white via-white/90 to-white/50">
                Всё, что нужно собственнику
              </SplitText>
              <br />
              <SplitText delay={0.3} staggerDelay={0.06} wordClassName="bg-clip-text text-transparent bg-gradient-to-r from-[#00A84F] to-[#34D27B]">
                для старта
              </SplitText>
            </h2>
            <BlurReveal delay={0.4} y={20}>
              <p className="text-[18px] text-white/60 leading-relaxed mb-10 text-center lg:text-left">
                2 точки для пилота &middot; Стабильный интернет &middot; Без ИТ-отдела.
              </p>
            </BlurReveal>

            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 flex-1" staggerDelay={0.08} delay={0.15}>
              {features.map((feature, index) => (
                <StaggerItem key={index}>
                  <div className="group relative flex gap-4 items-start p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-[#00A84F]/30 hover:bg-white/[0.04] hover:-translate-y-1 transition-all duration-500">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-xl" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,168,79,0.08) 0%, transparent 60%)' }} />
                    <div className="relative w-5 h-5 rounded-full bg-[#00A84F] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <div className="relative">
                      <h4 className="text-[18px] text-white/90 mb-1 tracking-[-0.01em]">
                        {feature.title}
                      </h4>
                      <p className="text-[14px] text-white/55 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          {/* Right: Dashboard mock */}
          <ScaleReveal delay={0.3} className="hidden lg:flex flex-col h-full">
            <div ref={dashRef} className="rounded-2xl border border-white/[0.08] bg-[#0a1210]/80 overflow-hidden shadow-2xl shadow-black/50 flex flex-col flex-1">
              {/* Browser top bar */}
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
              </div>

              {/* Body */}
              <div className="p-5 space-y-5 flex-1 flex flex-col">
                {/* Metric row */}
                <div className="hidden lg:grid grid-cols-2 gap-3">
                  {dashMetrics.map((m, i) => (
                    <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-3.5">
                      <div className="text-[20px] tracking-[-0.03em] leading-none mb-0.5">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00A84F] to-[#34D27B]">{m.value}</span>
                      </div>
                      <div className="text-[14px] text-white/55 mt-0.5">{m.label}</div>
                    </div>
                  ))}
                </div>

                {/* ── SVG line chart ── */}
                <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[14px] text-white/60 uppercase tracking-[0.1em]">Диалоги за неделю</span>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 text-[14px] text-white/55">
                        <span className="w-2 h-2 rounded-full bg-[#00A84F]" />Всего
                      </span>
                      <span className="flex items-center gap-1.5 text-[14px] text-white/55">
                        <span className="w-2 h-2 rounded-full bg-[#A78BFA]" />Конверсия
                      </span>
                    </div>
                  </div>

                  <div className="w-full aspect-[280/120]">
                    <MiniChart animate={dashInView} />
                  </div>
                </div>

                {/* ── Employee score bars ── */}
                <div className="space-y-5">
                  <span className="text-[14px] text-white/60 uppercase tracking-[0.1em] block mb-4">Рейтинг продавцов</span>
                  {dashBars.map((bar, i) => (
                    <AnimatedBar key={i} bar={bar} inView={dashInView} delay={0.6 + i * 0.15} />
                  ))}
                </div>

                {/* Alert */}
                <div className="rounded-lg border border-red-500/20 bg-red-500/[0.06] p-3.5 flex items-start gap-3">
                  <span className="text-[14px] shrink-0">&#9888;&#65039;</span>
                  <span className="text-[14px] text-white/50 leading-relaxed">
                    Сотрудник 3, 14:32 &mdash; клиент задал вопрос о дополнительной услуге, продавец не предложил. Потенциальная доппродажа упущена.
                  </span>
                </div>
              </div>
            </div>
          </ScaleReveal>
        </div>
      </div>
    </section>
  );
};

export default Included;