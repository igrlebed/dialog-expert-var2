Техническое задание: секция "Кейсы" со слайдером
Общее описание
Создай адаптивную секцию кейсов с многослайдовым слайдером, автопрокруткой, swipe-жестами и премиальными анимациями в стиле dark-luxury лендингов (Laravel Nightwatch, Linear).

Технические требования
1. Стек технологий
React + TypeScript
Motion (импорт: import { motion } from 'motion/react')
Tailwind CSS v4
Lucide React для иконок
2. Визуальный дизайн
Цветовая палитра:

Фон секции: #050a09 (глубокий тёмно-зелёный)
Акцент: #00A84F (зелёный primary)
Карточки: 
  - Фон: white/[0.02] с border white/[0.06]
  - Hover: white/[0.04] с border white/[0.1]
Aurora blur: radial-gradient с rgba(0,168,79,0.06)
Hover glow: radial-gradient с rgba(0,168,79,0.06)
Типографика:

Заголовок секции: clamp(2rem,4vw,3.5rem), gradient от white до white/50
Подзаголовок кейса: 19px, white/85
Метрики: 15px, white/70
Лейблы: 13px, white/30
Эффекты:

Aurora blur с filter blur(80px) в правом верхнем углу
Карточки с hover-glow через radial-gradient
Скруглённые углы 2xl (rounded-2xl)
Плавные переходы 500–800ms cubic-bezier
3. Структура данных
Каждый кейс содержит:

{
  title: string;          // Название компании/индустрии
  subtitle: string;       // Геолокация · Длительность
  results: Array<{        // Метрики результатов
    label: string;        // Название метрики
    value: string;        // Значение с изменением
  }>;
  context: string;        // Контекст проблемы
  goal: string;           // Цель проекта
}
Пример данных:

{
  title: "Сеть доставки суши",
  subtitle: "Москва · 60 дней",
  results: [
    { label: "Средний чек доставки", value: "1 950 → 2 200 ₽ (+12,8%)" },
    { label: "Допродажи при встрече", value: "4% → 17% (+13%)" },
  ],
  context: "Сеть с собственной курьерской службой столкнулась с жалобами на общение при доставке.",
  goal: "Повысить лояльность получателей за счёт качества общения курьеров и увеличить спонтанные допродажи."
}
4. Функциональность
4.1. Адаптивная сетка
// Количество видимых карточек:
Desktop (≥1024px): 3 карточки
Tablet (≥768px): 2 карточки
Mobile (<768px): 1 карточка
4.2. Навигация
Кнопки со стрелками:

Иконки: ChevronLeft, ChevronRight из lucide-react
Дизайн: border border-white/[0.08], bg-white/[0.03]
Hover: border-white/[0.15], bg-white/[0.06], text-white/70
Disabled (prev на первом слайде): opacity-25, cursor-not-allowed
Next зацикливается на начало (loop)
Счётчик:

Формат: {currentIndex + 1}–{min(currentIndex + visibleCount, total)} из {total}
Стиль: 13px, white/25, tabular-nums
Dots-индикатор:

Активная точка: width 6 (w-6), bg-[#00A84F]
Неактивная: width 1.5 (w-1.5), bg-white/10, hover bg-white/20
Высота всех: h-1.5, rounded-full
Transition: 500ms
4.3. Автопрокрутка
// Интервал: 10 секунд
// Пауза при hover на контейнере слайдера
// Возобновление при mouseLeave
// Зацикливание: при достижении maxIndex → currentIndex = 0
4.4. Swipe-жесты (touch)
// Порог срабатывания: 50px
// touchStartX - touchEndX > 50 → next()
// touchStartX - touchEndX < -50 → prev()
4.5. Логика слайдера
// Расчёт transform:
const cardWidth = (containerWidth - (visibleCount - 1) * gap) / visibleCount;
const gap = 16; // 1rem
const offsetX = currentIndex * (cardWidth + gap);
transform: `translateX(-${offsetX}px)`;
transition: 'transform 0.8s cubic-bezier(0.76, 0, 0.24, 1)';
5. Анимации (Motion)
5.1. Заголовок секции
SplitText (word-by-word reveal):

// Каждое слово через overflow:hidden + motion.span
// initial: { y: '110%', opacity: 0 }
// animate: { y: '0%', opacity: 1 }
// duration: 1.0, ease: [0.76, 0, 0.24, 1]
// stagger: 0.06s между словами
ClipReveal для label:

// clip-path: inset(100% 0 0 0) → inset(0 0 0 0)
// duration: 1.2, ease: [0.76, 0, 0.24, 1]
BlurReveal для description:

// initial: { opacity: 0, y: 40, filter: 'blur(8px)' }
// animate: { opacity: 1, y: 0, filter: 'blur(0px)' }
// duration: 1.0, delay: 0.4, ease: [0.22, 1, 0.36, 1]
5.2. Контейнер слайдера
motion.div с:
initial: { opacity: 0, y: 60 }
whileInView: { opacity: 1, y: 0 }
viewport: { once: true, margin: "-50px" }
transition: { duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }
5.3. Навигация (кнопки + счётчик)
initial: { opacity: 0, y: 20 }
whileInView: { opacity: 1, y: 0 }
transition: { duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }
6. Структура карточки
<div className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] transition-[background,border-color] duration-500">
  {/* Hover glow */}
  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" 
       style={{ background: 'radial-gradient(...)' }} />
  
  {/* Header + Results */}
  <div className="relative z-10 p-8 pb-0">
    <h3>{title}</h3>
    <span>{subtitle}</span>
    <div className="space-y-0">
      {results.map(res => (
        <div className="flex justify-between gap-4 py-3.5 border-t border-white/[0.05]">
          <span>{res.label}</span>
          <span className="whitespace-nowrap">{res.value}</span>
        </div>
      ))}
    </div>
  </div>
  
  {/* Context & Goal (mt-auto для прижатия вниз) */}
  <div className="relative z-10 mt-auto p-8 pt-6">
    <div className="rounded-xl bg-white/[0.03] border border-white/[0.04] p-5">
      <p><strong>Контекст:</strong> {context}</p>
      <p><strong>Цель:</strong> {goal}</p>
    </div>
  </div>
</div>
7. Адаптивность
Padding секции:

Mobile: py-32
Desktop (≥768px): py-40
Layout заголовка:

Mobile: flex-col
Desktop (≥768px): flex-row items-end justify-between
Max-width контейнера:

1200px, mx-auto, px-6
8. Accessibility
// ARIA-атрибуты для индикатора:
<div role="tablist" aria-label="Навигация по кейсам">
  <button 
    role="tab"
    aria-selected={i === currentIndex}
    aria-label={`Кейс ${i + 1}`}
  />
</div>

// Кнопки навигации:
<button aria-label="Предыдущий кейс" />
<button aria-label="Следующий кейс" />
9. Оптимизация
Resize-обработчик:

useEffect(() => {
  const update = () => {
    setVisibleCount(getVisibleCount());
    setContainerWidth(containerRef.current.offsetWidth);
  };
  update();
  window.addEventListener('resize', update);
  return () => window.removeEventListener('resize', update);
}, []);
Refs для performance:

const containerRef = useRef<HTMLDivElement>(null);
const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);
const touchStartX = useRef(0);
const touchEndX = useRef(0);
const isSwiping = useRef(false);
10. Готовый массив данных
Используй 11 кейсов из различных индустрий:

Сеть доставки суши
Паназиатский фуд-корт
Хостел
Ювелирная сеть (300+ магазинов)
ЖД-кассы
Аптечная сеть (200+ точек)
B2B-консалтинг
Банковские отделения
Страховая компания
Автодилерская сеть (20+ шоурумов)
Инфостойка аэропорта
Ожидаемый результат
Премиальная секция со слайдером, которая:

✅ Автоматически прокручивается каждые 10 секунд
✅ Показывает 1–3 карточки в зависимости от viewport
✅ Поддерживает swipe на мобильных
✅ Имеет плавные Motion-анимации
✅ Адаптивна и accessibility-friendly
✅ Работает с loop-навигацией (зацикливание)