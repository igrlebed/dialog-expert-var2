import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, title, children }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      contentRef.current?.scrollTo(0, 0);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-[680px] max-h-[85vh] flex flex-col rounded-2xl border border-white/[0.06] bg-[#0a0f0e]/95 backdrop-blur-xl shadow-[0_0_80px_rgba(0,168,79,0.06)]"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Top glow line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-[#00A84F]/30 to-transparent" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 sm:px-8 pt-6 pb-4 border-b border-white/[0.04]">
              <h2 className="text-white/90 text-[20px] tracking-[-0.02em]">{title}</h2>
              <button
                onClick={onClose}
                className="group flex items-center justify-center w-8 h-8 rounded-lg border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] transition-colors cursor-pointer"
                aria-label="Закрыть"
              >
                <X className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors" />
              </button>
            </div>

            {/* Content */}
            <div
              ref={contentRef}
              className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 legal-scroll"
            >
              <div className="space-y-5 text-[18px] text-white/50 tracking-[-0.01em] leading-[1.7]">
                {children}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 sm:px-8 py-4 border-t border-white/[0.04]">
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl text-[14px] text-white/60 border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:text-white/80 transition-all cursor-pointer"
              >
                Закрыть
              </button>
            </div>
          </motion.div>

          <style>{`
            .legal-scroll::-webkit-scrollbar { width: 4px; }
            .legal-scroll::-webkit-scrollbar-track { background: transparent; }
            .legal-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
            .legal-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.14); }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ── Mock content ── */

export const PrivacyPolicyContent = () => (
  <>
    <p className="text-white/65">Дата последнего обновления: 1 января 2026 г.</p>

    <div>
      <h3 className="text-white/80 text-[18px] mb-2">1. Общие положения</h3>
      <p>
        Настоящая Политика конфиденциальности (далее — «Политика») определяет порядок обработки
        и защиты персональных данных пользователей сервиса «ДиалогЭксперт» (далее — «Сервис»),
        принадлежащего ООО «ДиалогЭксперт» (далее — «Оператор»). Политика разработана в соответствии
        с Федеральным законом № 152-ФЗ «О персональных данных» и иными нормативными актами
        Российской Федерации.
      </p>
    </div>

    <div>
      <h3 className="text-white/80 text-[18px] mb-2">2. Собираемые данные</h3>
      <p>
        При использовании Сервиса Оператор может собирать следующие категории данных:
        имя и фамилия контактного лица, адрес электронной почты, номер телефона, наименование
        организации, должность, а также технические данные (IP-адрес, тип браузера, параметры
        устройства, cookies). Аудиозаписи диалогов обрабатываются исключительно в рамках
        функциональности речевой аналитики и не передаются третьим лицам.
      </p>
    </div>

    <div>
      <h3 className="text-white/80 text-[18px] mb-2">3. Цели обработки</h3>
      <p>
        Персональные данные обрабатываются в целях: предоставления доступа к функциональности
        Сервиса, технической поддержки пользователей, улучшения качества Сервиса и его
        алгоритмов, выполнения договорных обязательств, направления информационных и сервисных
        сообщений, а также соблюдения требований законодательства Российской Федерации.
      </p>
    </div>

    <div>
      <h3 className="text-white/80 text-[18px] mb-2">4. Хранение и защита данных</h3>
      <p>
        Оператор принимает необходимые организационные и технические меры для защиты персональных
        данных от неправомерного или случайного доступа, уничтожения, изменения, блокирования,
        копирования, распространения. Данные хранятся на территории Российской Федерации
        на сертифицированных серверах с применением шифрования AES-256.
      </p>
    </div>

    <div>
      <h3 className="text-white/80 text-[18px] mb-2">5. Права субъекта данных</h3>
      <p>
        Пользователь вправе запросить информацию об обработке своих персональных данных,
        потребовать их уточнения, блокирования или уничтожения, а также отозвать согласие
        на обработку, направив запрос на адрес privacy@dialogexpert.ru. Оператор обязуется
        рассмотреть обращение в течение 30 календарных дней.
      </p>
    </div>

    <div>
      <h3 className="text-white/80 text-[18px] mb-2">6. Файлы cookie</h3>
      <p>
        Сервис использует файлы cookie для обеспечения корректной работы, персонализации
        контента и анализа трафика. Пользователь может отключить использование cookie
        в настройках браузера, однако это может повлиять на доступность отдельных функций Сервиса.
      </p>
    </div>

    <div>
      <h3 className="text-white/80 text-[18px] mb-2">7. Контактная информация</h3>
      <p>
        По вопросам, связанным с обработкой персональных данных, вы можете обратиться
        по электронной почте: privacy@dialogexpert.ru или по адресу: 123456, г. Москва,
        ул. Примерная, д. 1, офис 100.
      </p>
    </div>
  </>
);

export const TermsOfServiceContent = () => (
  <>
    <p className="text-white/65">Дата последнего обновления: 1 января 2026 г.</p>

    <div>
      <h3 className="text-white/80 text-[18px] mb-2">1. Предмет соглашения</h3>
      <p>
        Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует отношения
        между ООО «ДиалогЭксперт» (далее — «Компания») и пользователем (далее — «Пользователь»)
        в связи с использованием сервиса речевой аналитики «ДиалогЭксперт» (далее — «Сервис»).
        Регистрация в Сервисе или начало его использования означает полное и безоговорочное
        принятие условий настоящего Соглашения.
      </p>
    </div>

    <div>
      <h3 className="text-white/80 text-[18px] mb-2">2. Условия использования</h3>
      <p>
        Сервис предоставляется по модели SaaS (Software as a Service) на условиях подписки.
        Пользователь получает неисключительное, непередаваемое право использования Сервиса
        в пределах оплаченного тарифного плана. Использование Сервиса допускается только
        в законных целях и в соответствии с применимым законодательством Российской Федерации.
      </p>
    </div>

    <div>
      <h3 className="text-white/80 text-[18px] mb-2">3. Права и обязанности сторон</h3>
      <p>
        Компания обязуется обеспечивать доступность Сервиса не менее 99,5% времени в месяц
        (за исключением плановых технических работ), предоставлять техническую поддержку
        в рабочие дни с 9:00 до 18:00 (МСК), своевременно информировать Пользователя
        об изменениях в функциональности и условиях использования.
      </p>
    </div>

    <div>
      <h3 className="text-white/80 text-[18px] mb-2">4. Интеллектуальная собственность</h3>
      <p>
        Все права на Сервис, включая программный код, алгоритмы, дизайн, товарные знаки
        и иные объекты интеллектуальной собственности, принадлежат Компании. Пользователь
        не приобретает каких-либо прав на указанные объекты, за исключением права использования
        Сервиса в соответствии с настоящим Соглашением.
      </p>
    </div>

    <div>
      <h3 className="text-white/80 text-[18px] mb-2">5. Оплата и тарифы</h3>
      <p>
        Стоимость использования Сервиса определяется действующими тарифными планами,
        опубликованными на сайте Компании. Оплата производится на условиях предоплаты.
        Компания вправе изменять тарифы, уведомив Пользователя не менее чем за 30 дней
        до вступления изменений в силу.
      </p>
    </div>

    <div>
      <h3 className="text-white/80 text-[18px] mb-2">6. Ограничение ответственности</h3>
      <p>
        Компания не несёт ответственности за убытки, возникшие в результате использования
        или невозможности использования Сервиса, за исключением случаев, прямо предусмотренных
        законодательством. Совокупная ответственность Компании ограничивается суммой,
        уплаченной Пользователем за последние 3 месяца использования Сервиса.
      </p>
    </div>

    <div>
      <h3 className="text-white/80 text-[18px] mb-2">7. Порядок разрешения споров</h3>
      <p>
        Все споры и разногласия, возникающие в связи с настоящим Соглашением, разрешаются
        путём переговоров. В случае невозможности достижения согласия спор передаётся
        на рассмотрение в Арбитражный суд г. Москвы. Применимое право — законодательство
        Российской Федерации.
      </p>
    </div>

    <div>
      <h3 className="text-white/80 text-[18px] mb-2">8. Заключительные положения</h3>
      <p>
        Компания оставляет за собой право вносить изменения в настоящее Соглашение.
        Актуальная версия Соглашения публикуется на сайте Сервиса. Продолжение использования
        Сервиса после внесения изменений означает согласие Пользователя с новой редакцией
        Соглашения. По всем вопросам обращайтесь: legal@dialogexpert.ru.
      </p>
    </div>
  </>
);