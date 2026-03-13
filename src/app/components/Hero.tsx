import { useMemo } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Constellation } from "./Constellation";
import {
  FloatingElement,
  SplitText,
  TextShimmer,
  ease,
} from "./motion-utils";
import { useSmoothScroll } from "./SmoothScroll";
import { scrollToSection } from "./scroll-utils";

const easeOut = ease.out as any;

/* ── Waveform bar heights ── */
const waveHeights = [
  20, 35, 55, 70, 45, 60, 80, 50, 30, 65, 75, 40, 55, 70, 35,
  60, 45, 80, 30, 55, 65, 40, 75, 50, 35, 60, 80, 45, 55, 30,
  70, 60, 40, 75, 50, 35, 65, 80, 45, 30, 60, 55, 40, 70, 50,
  35, 65, 45,
];

const stats = [
  { value: "+34%", label: "Рост конверсии\nза первые 90 дней" },
  {
    value: "2 дня",
    label: "До первых инсайтов\nпо вашей точке",
  },
  { value: "100%", label: "Диалогов\nпод контролем" },
];

export const Hero = ({ ready = true }: { ready?: boolean }) => {
  const smoothScroll = useSmoothScroll();
  const { scrollY } = useScroll();

  const textY = useTransform(scrollY, [0, 800], [0, -30]);
  const textOpacity = useTransform(scrollY, [200, 700], [1, 0]);
  const visualY = useTransform(scrollY, [0, 1200], [0, -60]);
  const visualOpacity = useTransform(
    scrollY,
    [300, 1000],
    [1, 0],
  );

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    scrollToSection(href, smoothScroll);
  };

  const show = (values: any) =>
    ready ? values : undefined;

  const waveformBars = useMemo(
    () =>
      waveHeights.map((h, i) => (
        <div
          key={i}
          className="rounded-full animate-waveform shrink-0"
          style={{
            width: 4,
            height: `${h}px`,
            background:
              "linear-gradient(to top, #00A84F, #34D27B)",
            animationDelay: `-${i * 0.06}s`,
            transformOrigin: "center",
            willChange: "transform, opacity",
          }}
        />
      )),
    [],
  );

  return (
    <section className="relative min-h-[calc(100vh-72px)] bg-[#050a09] overflow-hidden">
      <Constellation />

      {/* Aurora gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingElement duration={8} distance={30} delay={0}>
          <motion.div
            className="absolute w-[900px] h-[600px] top-[10%] left-1/2 -translate-x-1/2"
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0,168,79,0.15) 0%, rgba(0,168,79,0.05) 40%, transparent 70%)",
              filter: "blur(60px)",
              willChange: "transform, opacity",
            }}
          />
        </FloatingElement>
        <FloatingElement duration={10} distance={20} delay={2}>
          <motion.div
            className="absolute w-[600px] h-[400px] top-[30%] left-[10%]"
            animate={{ scale: [1, 1.12, 1] }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0,100,60,0.12) 0%, transparent 70%)",
              filter: "blur(80px)",
              willChange: "transform",
            }}
          />
        </FloatingElement>
      </div>

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 pt-12 md:pt-16 lg:pt-20 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-14rem)]">
          {/* ── Left: Text ── */}
          <motion.div
            className="flex flex-col items-center text-center lg:items-start lg:text-left"
            style={{ y: textY, opacity: textOpacity }}
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={show({ opacity: 1, y: 0 })}
              transition={{ duration: 0.8, ease: easeOut }}
              className="flex items-center gap-3 mb-7"
            >
              <span className="hidden md:block w-8 h-px bg-[#00A84F]" />
              <span className="text-[14px] text-[#00A84F] tracking-[0.2em] uppercase">
                Речевая аналитика офлайн-диалогов
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="mb-7 max-w-xl">
              {ready ? (
                <TextShimmer>
                  <span className="text-[clamp(2.5rem,5vw,4rem)] tracking-[-0.03em] leading-[1.08]">
                    <span className="whitespace-nowrap">
                      <SplitText
                        delay={0.1}
                        staggerDelay={0.07}
                        immediate
                        wordClassName="bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/40"
                      >
                        Вы теряете сделки.
                      </SplitText>
                    </span>
                    <br />
                    <SplitText
                      delay={0.3}
                      staggerDelay={0.07}
                      immediate
                      wordClassName="bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/40"
                    >
                      Но не знаете,
                    </SplitText>
                    <br />
                    <SplitText
                      delay={0.5}
                      staggerDelay={0.07}
                      immediate
                      wordClassName="bg-clip-text text-transparent bg-gradient-to-r from-[#00A84F] to-[#34D27B]"
                    >
                      где именно.
                    </SplitText>
                  </span>
                </TextShimmer>
              ) : (
                <span className="text-[clamp(2.5rem,5vw,4rem)] tracking-[-0.03em] leading-[1.08] opacity-0">
                  Вы теряете сделки. Но не знаете, где именно.
                </span>
              )}
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={show({ opacity: 1, y: 0 })}
              transition={{
                duration: 1.0,
                delay: 0.4,
                ease: easeOut,
              }}
              className="text-[18px] text-white/60 max-w-[440px] leading-relaxed mb-10 mx-auto lg:mx-0"
            >
              ДиалогЭксперт записывает, расшифровывает и
              анализирует каждый диалог ваших продавцов —{" "}
              <span className="text-white/80">
                без камер и без вмешательства
              </span>. Вы видите, где теряются деньги.
            </motion.p>

            {/* CTA Group */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={show({ opacity: 1, y: 0 })}
              transition={{
                duration: 1.0,
                delay: 0.55,
                ease: easeOut,
              }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-12"
            >
              <motion.a
                href="#form"
                onClick={(e) => handleClick(e, "#form")}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className="group inline-flex items-center justify-center gap-2.5 h-12 px-6 rounded-xl bg-[#00A84F] hover:bg-[#00C85A] text-[18px] text-white tracking-[-0.01em] transition-colors duration-300 shadow-[0_0_40px_rgba(0,168,79,0.35)] hover:shadow-[0_0_60px_rgba(0,168,79,0.5)]"
              >
                Получить демо
              </motion.a>
              <motion.a
                href="#how"
                onClick={(e) => handleClick(e, "#how")}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className="inline-flex items-center gap-2 text-[18px] text-white/60 hover:text-white/90 transition-colors duration-300"
              >
                Как это работает
                <span className="text-[18px]">?</span>
              </motion.a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={show({ opacity: 1, y: 0 })}
              transition={{
                duration: 1.0,
                delay: 0.7,
                ease: easeOut,
              }}
              className="flex justify-center lg:justify-start gap-8 lg:gap-10 pt-8 border-t border-white/[0.06]"
            >
              {stats.map((stat, i) => (
                <div key={i} className="min-w-0">
                  <div className="text-[clamp(1.75rem,3.5vw,2.75rem)] tracking-[-0.03em] bg-clip-text text-transparent bg-gradient-to-r from-[#00A84F] to-[#34D27B] leading-none mb-1">
                    {stat.value}
                  </div>
                  <div className="text-[14px] text-white/55 leading-snug max-w-[140px] whitespace-pre-line">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right: Visual ── */}
          <motion.div
            className="relative hidden lg:flex items-center justify-center"
            style={{ y: visualY, opacity: visualOpacity }}
          >
            {/* Grid overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(0,168,79,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,168,79,0.04) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            {/* Glow */}
            <div
              className="absolute -top-24 -right-24 w-[400px] h-[400px] pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(0,168,79,0.15) 0%, transparent 70%)",
              }}
            />

            <div className="relative z-10 w-full max-w-md space-y-4 py-8 min-h-[440px]">
              {/* Waveform */}
              <div className="h-20 mb-4 overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={show({ opacity: 1, scale: 1 })}
                  transition={{
                    duration: 1.0,
                    delay: 0.3,
                    ease: easeOut,
                  }}
                  className="flex items-center gap-[3px] h-full"
                >
                  {waveformBars}
                </motion.div>
              </div>

              {/* Dialog card: flagged */}
              <div className="min-h-[110px]">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={show({ opacity: 1, y: 0 })}
                  transition={{
                    duration: 0.8,
                    delay: 0.5,
                    ease: easeOut,
                  }}
                  className="rounded-xl border border-red-500/30 bg-red-900/20 backdrop-blur-sm p-4 h-full"
                >
                  <div className="text-[14px] uppercase tracking-[0.15em] text-red-300 font-semibold mb-2">
                    &#9888; Потеря сделки — ювелирный
                  </div>
                  <div className="text-[14px] text-white/80 italic leading-relaxed">
                    &laquo;Ну ладно, я подумаю...&raquo; —
                    &laquo;Хорошо, заходите!&raquo;
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-[14px] text-white/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                    Продавец не отрабовал возражение. Клиент ушёл.
                  </div>
                </motion.div>
              </div>

              {/* Dialog card: ok */}
              <div className="min-h-[110px]">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={show({ opacity: 1, y: 0 })}
                  transition={{
                    duration: 0.8,
                    delay: 0.65,
                    ease: easeOut,
                  }}
                  className="rounded-xl border border-green-500/30 bg-green-900/20 backdrop-blur-sm p-4 h-full"
                >
                  <div className="text-[14px] uppercase tracking-[0.15em] text-[#4ADE80] font-semibold mb-2">
                    &#10003; Эталонный диалог — HoReCa
                  </div>
                  <div className="text-[14px] text-white/80 italic leading-relaxed">
                    &laquo;Могу предложить к этому бокалу сырную
                    тарелку...&raquo;
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-[14px] text-white/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                    Upsell-предложение сделано вовремя. Чек +450₽.
                  </div>
                </motion.div>
              </div>

              {/* Dialog card: summary */}
              <div className="min-h-[90px]">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={show({ opacity: 1, y: 0 })}
                  transition={{
                    duration: 0.8,
                    delay: 0.8,
                    ease: easeOut,
                  }}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-4 h-full"
                >
                  <div className="text-[14px] uppercase tracking-[0.15em] text-[#00A84F] mb-2">
                    &#128202; Итог за сегодня — 3 точки
                  </div>
                  <div className="text-[14px] text-white/60 whitespace-nowrap">
                    <span className="text-white/90 font-semibold">
                      47
                    </span>{" "}
                    диалогов
                    <span className="text-white/45 mx-1">·</span>
                    Критических:{" "}
                    <span className="text-red-400 font-semibold">
                      8
                    </span>
                    <span className="text-white/45 mx-1">·</span>
                    Эталонных:{" "}
                    <span className="text-[#34D27B] font-semibold">
                      14
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};