import { motion } from "motion/react";
import {
  SplitText,
  BlurReveal,
  StaggerContainer,
  StaggerItem,
  MagneticCard,
  ClipReveal,
} from "./motion-utils";
import svgPaths from "../../imports/svg-bidhnqi9km";

/* Островок Суши logo — inline from Figma import */
const OstrovokLogo = () => (
  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
    <svg className="w-10 h-10" fill="none" viewBox="0 0 28.0985 27.7499">
      <path clipRule="evenodd" d={svgPaths.pf81e2e0} fill="#0a1a12" fillRule="evenodd" />
      <path clipRule="evenodd" d={svgPaths.p3d258680} fill="rgba(255,255,255,0.75)" fillRule="evenodd" />
      <path clipRule="evenodd" d={svgPaths.p280095b1} fill="#D20001" fillRule="evenodd" />
      <path clipRule="evenodd" d={svgPaths.p2a7aad80} fill="rgba(255,255,255,0.85)" fillRule="evenodd" />
    </svg>
  </div>
);

export const SocialProof = () => {
  return (
    <section
      id="proof"
      className="relative py-32 md:py-40 bg-[#050a09]"
    >
      {/* Aurora */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[600px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,168,79,0.08) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6">
        {/* Header — centered */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <ClipReveal delay={0}>
            <p className="text-[14px] text-[#00A84F] tracking-wide uppercase mb-4">
              Клиенты о результатах
            </p>
          </ClipReveal>
          <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] tracking-[-0.03em] leading-[1.1]">
            <SplitText
              delay={0.1}
              staggerDelay={0.06}
              wordClassName="bg-clip-text text-transparent bg-gradient-to-br from-white via-white/90 to-white/50"
            >
              Не теория —
            </SplitText>{" "}
            <SplitText
              delay={0.3}
              staggerDelay={0.06}
              wordClassName="bg-clip-text text-transparent bg-gradient-to-r from-[#00A84F] to-[#34D27B]"
            >
              реальные цифры
            </SplitText>
          </h2>
        </div>

        {/* 3-column testimonials */}
        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          staggerDelay={0.1}
          delay={0.15}
        >
          {/* Testimonial 1 — Quote */}
          <StaggerItem>
            <MagneticCard className="h-full" intensity={6}>
              <div className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-500 h-full flex flex-col">
                <span className="text-[80px] leading-[0.5] bg-clip-text text-transparent bg-gradient-to-b from-[#00A84F]/40 to-transparent mb-5 block">
                  &ldquo;
                </span>
                <p className="text-[18px] text-white/70 leading-relaxed mb-6 flex-1">
                  «Думал, что знаю своих кассиров. Оказалось,
                  большинство вообще не предлагали
                  дополнительные роллы к заказу. После первого
                  месяца работы с системой{" "}
                  <span className="text-[#34D27B]">
                    средний чек вырос на 22%
                  </span>{" "}
                  — просто потому что я наконец увидел, где
                  именно теряются деньги.»
                </p>
                <div className="flex items-center gap-3.5 pt-5 border-t border-white/[0.06]">
                  <OstrovokLogo />
                  <div>
                    <div className="text-[18px] text-white/80">
                      Островок Суши
                    </div>
                    <div className="text-[14px] text-white/55">
                      Собственник, 3 точки
                    </div>
                  </div>
                </div>
              </div>
            </MagneticCard>
          </StaggerItem>

          {/* Testimonial 2 — Metric highlight */}
          <StaggerItem>
            <MagneticCard className="h-full" intensity={6}>
              <div className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-500 h-full flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <div>
                    <div className="text-[42px] tracking-[-0.03em] bg-clip-text text-transparent bg-gradient-to-r from-[#00A84F] to-[#34D27B] leading-none">
                      90%
                    </div>
                    <div className="text-[14px] text-white/55 mt-1">
                      соблюдение скрипта продаж
                    </div>
                  </div>
                </div>
                <p className="text-[18px] text-white/60 leading-relaxed flex-1">
                  Результаты на той же контрольной точке спустя
                  6 недель после старта.
                  <br />
                  До начала пилота у собственника отсутствовали
                  данные о соблюдении стандартов сотрудниками.
                </p>
                <div className="pt-4 border-t border-white/[0.06] mt-4">
                  <div className="flex items-center gap-3.5">
                    <OstrovokLogo />
                    <div>
                      <div className="text-[18px] text-white/80">
                        Островок Суши
                      </div>
                      <div className="text-[14px] text-white/55">
                        Реальный результат
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </MagneticCard>
          </StaggerItem>

          {/* Testimonial 3 — Invitation (dashed) */}
          <StaggerItem>
            <MagneticCard className="h-full" intensity={6}>
              <div className="group relative rounded-2xl border border-dashed border-white/[0.08] bg-[#00A84F]/[0.02] p-8 hover:bg-[#00A84F]/[0.04] hover:border-[#00A84F]/20 transition-all duration-500 h-full flex flex-col">
                <span className="text-[80px] leading-[0.5] text-white/[0.06] mb-5 block">
                  &ldquo;
                </span>
                <p className="text-[18px] text-white/55 italic leading-relaxed flex-1">
                  Здесь скоро появится ваш результат.
                  <br />
                  <br />
                  Мы запускаем пилот на 2 точки —
                  через 30 дней у вас будут свои цифры.
                </p>
                <div className="flex items-center gap-3.5 pt-5 border-t border-white/[0.06]">
                  <div className="w-10 h-10 rounded-full bg-[#00A84F]/10 flex items-center justify-center text-[#00A84F] text-[18px] shrink-0">
                    ?
                  </div>
                  <div>
                    <div className="text-[18px] text-white/80">
                      Ваш бизнес
                    </div>
                    <div className="text-[14px] text-white/55">
                      Станьте следующим кейсом
                    </div>
                  </div>
                </div>
              </div>
            </MagneticCard>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
};

export default SocialProof;