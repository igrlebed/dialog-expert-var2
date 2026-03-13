import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import {
  Soup,
  Hotel,
  Gem,
  Pill,
  Briefcase,
  Car,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { GlassIcon, GlassIconGradientDef } from './GlassIcon';

/* ══════════════════════════════════════════════
   Data
   ══════════════════════════════════════════════ */
interface CaseItem {
  icon: LucideIcon;
  title: string;
  results: { label: string; value: string }[];
  context: string;
  goal: string;
}

const cases: CaseItem[] = [
  {
    icon: Soup,
    title: 'Фуд-корт',
    results: [
      { label: 'Средний чек', value: '590 → 645₽ (+9%)' },
      { label: 'Допродажи', value: '12 → 24% (+12%)' },
      { label: 'Вежливость', value: '65 → 88% (+23 п.п.)' },
    ],
    context: 'Очереди и загруженные кассиры — посетители уходили без допов.',
    goal: 'Очередь — точка роста, если касса работает по сценарию допродажи.',
  },
  {
    icon: Hotel,
    title: 'Хостелы',
    results: [
      { label: 'Чек допуслуг', value: '200 → 295₽ (+48%)' },
      { label: 'Общий чек', value: '1 100 → 1 195₽ (+9%)' },
      { label: 'Продления', value: '12 → 21% (+9%)' },
    ],
    context: 'Текучка администраторов, жалобы на «уставший» персонал, ноль контроля.',
    goal: 'Допуслуги растут не давлением, а живым и последовательным общением.',
  },
  {
    icon: Gem,
    title: 'Ритейл',
    results: [
      { label: 'Средний чек', value: '8 500 → 9 350₽ (+10%)' },
      { label: 'Чеки с доп. услугой', value: '7 → 18% (+11%)' },
      { label: 'Индекс эмоциональности общения', value: '40 → 75% (+35%)' },
    ],
    context: '«Тайные покупатели» давали точечные срезы, но не полную картину.',
    goal: 'Рост продаж — в эмоциональной подаче и качестве контакта, не в товаре.',
  },
  {
    icon: Pill,
    title: 'Аптеки',
    results: [
      { label: 'Средний чек', value: '780 → 865₽ (+11%)' },
      { label: 'Допродажи', value: '8 → 22% (+14%)' },
      { label: 'Нарушения отпуска рецептурных препаратов', value: '7 → 1 в мес (−86%)' },
    ],
    context: '200+ точек, низкая маржа и риски нарушений отпуска рецептурных препаратов.',
    goal: 'Контроль диалогов влияет на выручку, стандарты и регуляторные риски сразу.',
  },
  {
    icon: Briefcase,
    title: 'B2B-продажи',
    results: [
      { label: 'Речь менеджера', value: '75 → 55% (−20%)' },
      { label: 'Конверсия', value: '22 → 29% (+7%)' },
      { label: 'Цикл сделки', value: '−22%' },
    ],
    context: 'Десятки переговоров в неделю, субъективная оценка, нет паттернов успеха.',
    goal: 'Результат зависит от структуры диалога, а не от количества речи менеджера.',
  },
  {
    icon: Car,
    title: 'Автодилеры',
    results: [
      { label: 'Доля продаж дополнительных продуктов', value: '3 → 20% (+17%)' },
      { label: 'Выручка сети', value: '+5%' },
      { label: 'Конверсия тест-драйва', value: '+23%' },
    ],
    context: 'Общение в шоурумах и на тест-драйвах не контролировалось системно.',
    goal: 'Базовый контроль предложения допов заметно влияет на продажи и выручку.',
  },
];

/* ══════════════════════════════════════════════
   Card component
   ══════════════════════════════════════════════ */
const CaseCard = ({ c, className = '' }: { c: CaseItem; className?: string }) => (
  <div className={`group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] transition-[background,border-color] duration-500 h-full flex flex-col ${className}`}>
    {/* Hover glow */}
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(0,168,79,0.06) 0%, transparent 60%)',
      }}
    />
    {/* Header + Results */}
    <div className="relative z-10 p-7 sm:p-8 pb-0">
      <div className="flex items-center gap-3 mb-5">
        <GlassIcon icon={c.icon} gradientId="cases-icon-grad" />
        <h3 className="text-[20px] text-white/90 tracking-[-0.01em] leading-tight">
          {c.title}
        </h3>
      </div>
      <div className="space-y-0">
        {c.results.map((r, ri) => (
          <div key={ri} className="flex justify-between gap-4 py-3.5 border-t border-white/[0.05]">
            <span className="text-[14px] text-white/55">{r.label}</span>
            <span className="text-[18px] text-white/80 whitespace-nowrap">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
    {/* Context & Goal */}
    <div className="relative z-10 mt-auto p-7 sm:p-8 pt-6">
      <div className="rounded-xl bg-white/[0.03] border border-white/[0.04] p-5 space-y-2.5">
        <p className="text-[14px] text-white/65 leading-relaxed">
          <span className="text-white/80">Контекст: </span>
          {c.context}
        </p>
        <p className="text-[14px] text-white/65 leading-relaxed">
          <span className="text-white/80">Вывод: </span>
          {c.goal}
        </p>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════
   Sticky Scroll Reveal
   ══════════════════════════════════════════════ */
const StickyRevealItem = ({
  c,
  index,
  onVisible,
}: {
  c: CaseItem;
  index: number;
  onVisible: (i: number) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start 0.35'],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);

  /* Track which card is in viewport center */
  const { scrollYProgress: centerProgress } = useScroll({
    target: ref,
    offset: ['start center', 'end center'],
  });

  useMotionValueEvent(centerProgress, 'change', (v) => {
    if (v > 0 && v < 1) onVisible(index);
  });

  return (
    <div ref={ref} id={`sticky-card-${index}`} className="relative">
      <motion.div style={{ opacity, y, scale }}>
        <CaseCard c={c} />
      </motion.div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   Main Export
   ═════════════════════════════════════════════ */
export const Cases = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="industries" className="relative py-32 md:py-40 bg-[#050a09]">
      <GlassIconGradientDef id="cases-icon-grad" />

      {/* Aurora */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-[800px] h-[500px] top-0 right-0"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,168,79,0.08) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6">
        {/* Mobile header (shown above cards on small screens) */}
        <div className="lg:hidden text-center mb-16">
          <p className="text-[14px] text-[#00A84F] tracking-wide uppercase mb-4">
            Отраслевые результаты
          </p>
          <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] tracking-[-0.03em] leading-[1.15]">
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-white via-white/90 to-white/50">
              Работаем там, где идут{' '}
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00A84F] to-[#34D27B]">
              живые продажи
            </span>
          </h2>
        </div>

        <div className="relative lg:grid lg:grid-cols-[340px_1fr] lg:gap-10">
          {/* Sticky left panel — header + nav (desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              {/* Header inside sticky */}
              <div className="mb-8">
                <p className="text-[14px] text-[#00A84F] tracking-wide uppercase mb-4">
                  Отраслевые результаты
                </p>
                <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] tracking-[-0.03em] leading-[1.15]">
                  <span className="bg-clip-text text-transparent bg-gradient-to-br from-white via-white/90 to-white/50">
                    Работаем там, где идут{' '}
                  </span>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00A84F] to-[#34D27B]">
                    живые продажи
                  </span>
                </h2>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/[0.06] mb-4" />

              {/* Nav items */}
              <div className="space-y-1">
                {cases.map((c, i) => (
                  <button
                    key={c.title}
                    onClick={() => {
                      const el = document.getElementById(`sticky-card-${i}`);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                      activeIndex === i
                        ? 'bg-white/[0.06] border border-white/[0.1]'
                        : 'border border-transparent hover:bg-white/[0.03]'
                    }`}
                  >
                    <c.icon
                      className="w-4 h-4 shrink-0"
                      style={{ color: activeIndex === i ? '#34D27B' : 'rgba(255,255,255,0.35)' }}
                      strokeWidth={1.6}
                    />
                    <span className={`text-[18px] transition-colors duration-300 ${
                      activeIndex === i ? 'text-white/90' : 'text-white/50'
                    }`}>
                      {c.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cards column */}
          <div className="space-y-6">
            {cases.map((c, i) => (
              <StickyRevealItem key={c.title} c={c} index={i} onVisible={setActiveIndex} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cases;