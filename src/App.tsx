import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CalendarDays,
  CircleDot,
  ClipboardCheck,
  GraduationCap,
  Menu,
  MessageCircle,
  Play,
  Route,
  Sparkles,
  Target,
  TrendingUp,
  X,
  type LucideIcon,
} from "lucide-react";
import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, useLayoutEffect, useState, type FormEvent } from "react";
import authorHeroImage from "./assets/uulbolsun-author-hero.jpg";
import { isSupabaseConfigured, supabase } from "./lib/supabase";

const instagramUrl = "https://www.instagram.com/uulbolsun_almazbek/";
const whatsappUrl = "https://wa.me/996506515525";

const marqueeItems = [
  "продюсер",
  "эксперт",
  "запуск",
  "контент",
  "Instagram",
  "сатуу",
  "SMM",
  "прогрев",
  "команда",
  "киреше",
];

const audience = [
  "Жаңы баштагандар",
  "Онлайнга чыккысы келгендер",
  "Аз тажрыйбасы барлар",
  "Эксперт менен иштегиси келгендер",
];

const program = [
  {
    id: "01",
    icon: GraduationCap,
    title: "Профессия",
    text: "Продюсердин ролу, жоопкерчилиги жана эксперт менен иштөө логикасы.",
  },
  {
    id: "02",
    icon: Target,
    title: "Эксперт табуу",
    text: "Ниша, оффер, позициялоо жана эксперт менен сүйлөшүү сценарийи.",
  },
  {
    id: "03",
    icon: MessageCircle,
    title: "Контент",
    text: "Instagram, сторис, прогрев жана аудиторияны ишенимге алып келүү.",
  },
  {
    id: "04",
    icon: TrendingUp,
    title: "Продажи",
    text: "Эфир, консультация, бронь жана төлөмгө жеткирүү системасы.",
  },
  {
    id: "05",
    icon: Route,
    title: "Запуск",
    text: "Команда, дедлайн, аналитика жана биринчи акчалай натыйжа.",
  },
];

const mentorStats = [
  {
    icon: BadgeCheck,
    value: "3,5 жыл",
    label: "продюсерлик жана Instagram запуск тажрыйбасы",
  },
  {
    icon: BarChart3,
    value: "25 млн сом",
    label: "сатуу натыйжасына чейин жеткирген система",
  },
  {
    icon: MessageCircle,
    value: "наставник",
    label: "практика жана кайтарым байланыш менен иштейт",
  },
  {
    icon: Sparkles,
    value: "МЕН ПРОДЮСЕР",
    label: "онлайн киреше жана системдүү запуск",
  },
];

const heroBenefits = ["0дон баштоо", "эксперт менен запуск", "практика + сатуу"] as const;
const courseStartDate = "28-апрель 2026";

const proofPoints = [
  {
    icon: Route,
    tone: "signal",
    value: "6 модуль",
    label: "запуск системасы",
  },
  {
    icon: ClipboardCheck,
    tone: "accent",
    value: "3 күн",
    label: "онлайн практика",
  },
  {
    icon: MessageCircle,
    tone: "sun",
    value: "куратор",
    label: "кайтарым байланыш",
  },
] satisfies Array<{ icon: LucideIcon; tone: MotionTone; value: string; label: string }>;

const formats = [
  {
    icon: ClipboardCheck,
    title: "Стандарт",
    price: "28 000 сом",
    text: "1 ай, 4 жандуу эфир, 6 модуль, 3 күн онлайн практика жана куратордон кайтарым байланыш.",
    meta: "60 000 → 28 000 сом",
    tone: "dark",
  },
  {
    icon: BadgeCheck,
    title: "VIP",
    price: "50 000 сом",
    text: "1,5 ай, жумасына 3 эфир, 10 модуль, 5 күн онлайн практика жана бонус сабактар.",
    meta: "90 000 → 50 000 сом",
    tone: "light",
  },
  {
    icon: TrendingUp,
    title: "Курстан кийин",
    price: "онлайн",
    text: "Продюсер, контентмейкер, сторисмейкер, SMM-адис, копирайтер, прогрев жана сатуу менеджер.",
    meta: "30 000ден 150 000+",
    tone: "accent",
  },
];

const levelOptions = [
  { value: "zero", label: "0дон" },
  { value: "has_blog", label: "блогум бар" },
  { value: "working", label: "иштейм" },
] as const;

const lenisOptions = {
  autoRaf: true,
  gestureOrientation: "vertical",
  lerp: 0.075,
  smoothWheel: true,
  stopInertiaOnNavigate: true,
  syncTouch: false,
  touchMultiplier: 1,
  wheelMultiplier: 0.82,
} as const;

type MotionTone = "accent" | "signal" | "sun" | "deep";
type LeadLevel = (typeof levelOptions)[number]["value"];
type LeadStatus = "idle" | "submitting" | "success" | "error";

function useRevealMotion() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            window.requestAnimationFrame(() => {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            });
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.04 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

function useMotionSetup() {
  useLayoutEffect(() => {
    document.body.classList.add("motion-ready");
    const frame = window.requestAnimationFrame(() => {
      document.body.classList.add("intro-ready");
    });

    return () => {
      window.cancelAnimationFrame(frame);
      document.body.classList.remove("motion-ready", "intro-ready");
    };
  }, []);
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(query.matches);

    updatePreference();
    query.addEventListener("change", updatePreference);
    return () => {
      query.removeEventListener("change", updatePreference);
    };
  }, []);

  return prefersReducedMotion;
}

function useScrollProgress() {
  useEffect(() => {
    let frame = 0;

    const updateProgress = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;

      document.documentElement.style.setProperty("--scroll-progress", progress.toFixed(4));
    };

    const scheduleProgress = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updateProgress();
      });
    };

    updateProgress();
    window.addEventListener("scroll", scheduleProgress, { passive: true });
    window.addEventListener("resize", scheduleProgress);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleProgress);
      window.removeEventListener("resize", scheduleProgress);
      document.documentElement.style.removeProperty("--scroll-progress");
    };
  }, []);
}

function LenisHashScroll() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const scrollToHash = () => {
      const target = window.location.hash;
      if (!target) return;

      const scrollOnce = () => {
        const element = document.querySelector<HTMLElement>(target);
        if (!element) return;

        const offset = window.innerWidth <= 860 ? 76 : 78;
        const top = Math.max(0, element.getBoundingClientRect().top + window.scrollY - offset);

        lenis.scrollTo(top, {
          duration: 0.75,
          easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
        });
      };

      window.requestAnimationFrame(scrollOnce);
      window.setTimeout(scrollOnce, 420);
    };

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, [lenis]);

  return null;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadContact, setLeadContact] = useState("");
  const [leadLevel, setLeadLevel] = useState<LeadLevel>("zero");
  const [leadStatus, setLeadStatus] = useState<LeadStatus>("idle");
  const [leadMessage, setLeadMessage] = useState("Маалымат калтырсаңыз, менеджер байланышат.");
  const prefersReducedMotion = usePrefersReducedMotion();
  useMotionSetup();
  useRevealMotion();
  useScrollProgress();

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const closeOnHashChange = () => setMenuOpen(false);

    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("hashchange", closeOnHashChange);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("hashchange", closeOnHashChange);
    };
  }, [menuOpen]);

  async function handleLeadSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!leadName.trim() || !leadContact.trim()) {
      setLeadStatus("error");
      setLeadMessage("Атыңызды жана байланыш номерди жазыңыз.");
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      setLeadStatus("error");
      setLeadMessage("Supabase азыр туташкан эмес. .env.local ачкычтарын текшериңиз.");
      return;
    }

    setLeadStatus("submitting");
    setLeadMessage("Заявка жөнөтүлүп жатат...");

    const { error } = await supabase.functions.invoke("submit-course-lead", {
      body: {
        name: leadName,
        contact: leadContact,
        level: leadLevel,
        pageUrl: window.location.href,
      },
    });

    if (error) {
      setLeadStatus("error");
      setLeadMessage("Жөнөтүү болбой калды. Бир аздан кийин кайра аракет кылыңыз.");
      return;
    }

    setLeadStatus("success");
    setLeadMessage("Заявка жөнөтүлдү. Менеджер жакын арада байланышат.");
    setLeadName("");
    setLeadContact("");
    setLeadLevel("zero");
  }

  const page = (
    <main className="landing-shell">
      <div className="scroll-progress" aria-hidden="true" />
      <div className="motion-field" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      <header className="site-nav" data-intro>
        <a className="brand" href="#top" aria-label="МЕН ПРОДЮСЕР башкы бет">
          <span className="brand-dot" />
          <span>МЕН ПРОДЮСЕР</span>
        </a>

        <button
          className="nav-toggle"
          type="button"
          aria-label={menuOpen ? "Менюну жабуу" : "Менюну ачуу"}
          aria-controls="primary-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <nav
          className={menuOpen ? "nav-links open" : "nav-links"}
          id="primary-navigation"
          aria-label="Башкы навигация"
        >
          <a href="#program" onClick={() => setMenuOpen(false)}>
            Программа
          </a>
          <a href="#formats" onClick={() => setMenuOpen(false)}>
            Тарифтер
          </a>
          <a href="#mentor" onClick={() => setMenuOpen(false)}>
            Автор
          </a>
          <a href="#video" onClick={() => setMenuOpen(false)}>
            Видео
          </a>
        </nav>

        <a className="nav-cta" href="#signup" onClick={() => setMenuOpen(false)}>
          Катталуу
          <ArrowRight size={16} />
        </a>
      </header>

      <section className="hero-section" id="top">
        <div className="hero-orbit" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="hero-meta" data-intro>
          <span>МЕН ПРОДЮСЕР · автордук курс</span>
          <span>Уулболсун Алмазбек · 3,5 жылдык тажрыйбасы бар</span>
          <span>{courseStartDate} · онлайн практика</span>
        </div>

        <div className="hero-grid">
          <div className="hero-copy">
            <div className="hero-kicker" data-intro>
              <span />
              эфирге жана курска катталуу
            </div>
            <p className="hero-date" data-intro>
              <CalendarDays size={14} />
              старт {courseStartDate}
            </p>

            <h1 className="hero-title" data-intro>
              <span>МЕН</span>
              <em>ПРОДЮСЕР</em>
              <span className="wide-word">автордук курс</span>
            </h1>

            <div className="hero-hook" data-intro>
              <MotionIcon icon={TrendingUp} tone="accent" compact />
              <span>3,5 миллиондон 25 миллион сомго чейин сатуу жасаган эксперттердин продюсери.</span>
            </div>

            <div className="mobile-hero-preview" data-intro>
              <CourseCard compact />
            </div>

            <p className="hero-text" data-intro>
              Уулболсун Алмазбектин автордук курсу: 0дон баштап онлайн продюсер
              болуп, эксперттер менен запуск жасап, киреше табууну үйрөнөсүз.
            </p>

            <div className="hero-actions" data-intro>
              <a className="primary-action" href="#signup">
                Катталуу
                <span>
                  <ArrowRight size={17} />
                </span>
              </a>
              <a className="secondary-action" href="#program">
                Программаны көрүү
                <ArrowDown size={16} />
              </a>
            </div>

            <div className="hero-benefits" data-intro>
              {heroBenefits.map((item) => (
                <span key={item}>
                  <i aria-hidden="true" />
                  {item}
                </span>
              ))}
            </div>

            <div className="proof-strip" data-intro aria-label="Курстун негизги далилдери">
              {proofPoints.map((item) => (
                <article key={item.value}>
                  <MotionIcon icon={item.icon} tone={item.tone} compact />
                  <div>
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </div>
                </article>
              ))}
            </div>

          </div>

          <div className="hero-visual" data-intro>
            <CourseCard />
          </div>

          <div className="hero-stats" data-intro>
            <Stat value="3,5" label="жылдык тажрыйба" />
            <Stat value="25 млн" label="сомго чейин сатуу" />
            <Stat value="150K+" label="киреше потенциалы" />
          </div>
        </div>

        <div className="scroll-row" data-intro>
          <span>Scroll</span>
          <span>МЕН ПРОДЮСЕР · 2026</span>
          <span>↓ 06 бөлүм</span>
        </div>
      </section>

      <Marquee />

      <section className="audience-section section-pad" id="audience" data-reveal>
        <div className="section-signal audience-signal" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="section-label">/ 02 — кимдер үчүн</div>
        <div className="section-heading">
          <HookLine icon={Target}>Биринчи суроо: сиз азыр кайсы чекиттесиз?</HookLine>
          <h2>Курс кимдер үчүн?</h2>
          <p>
            Бул курс “эмнеден баштайм?”, “өзүмдү кантип сатам?” жана “кантип
            эксперт менен иштейм?” деген суроолорго практикалык жооп берет.
          </p>
        </div>
        <div className="audience-grid">
          <article className="audience-card cream-card">
            <span>кимдер</span>
            {audience.map((item, index) => (
              <p key={item}>
                <b>{String(index + 1).padStart(2, "0")}</b>
                {item}
              </p>
            ))}
          </article>
          <article className="audience-card dark-card">
            <span>натыйжа</span>
            <strong>0дон биринчи запуск СИСТЕМАСЫ</strong>
            <p>
              Контентти, прогревди, сатуу сценарийин жана команда менен иштөөнү
              бир логикага чогултасыз.
            </p>
          </article>
        </div>
      </section>

      <section className="program-section" id="program" data-reveal>
        <div className="program-track" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="program-head">
          <span>/ 03 — программа</span>
          <HookLine icon={Route}>5 кадам: эксперттен төлөмгө чейин бир запуск картасы.</HookLine>
          <h2>Курста эмне болот?</h2>
          <p>Теория аз, практика көп: ар бир блок запусктын реалдуу кадамына байланган.</p>
        </div>
        <div className="program-grid">
          {program.map((item) => (
            <article className="program-card" key={item.id}>
              <span>{item.id}</span>
              <MotionIcon icon={item.icon} tone="accent" compact />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
        <a className="program-cta" href="#signup">
          Катталуу
          <ArrowRight size={16} />
        </a>
      </section>

      <section className="mentor-section section-pad" id="mentor" data-reveal>
        <div className="section-signal mentor-signal" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="mentor-copy">
          <span className="section-label">/ 04 — кимден үйрөнөсүз</span>
          <HookLine icon={BadgeCheck}>Сатуу цифрасы жана практика бир жерден көрүнүшү керек.</HookLine>
          <h2>Уулболсун Алмазбек</h2>
          <p>
            3,5 миллиондон 25 миллион сомго чейин сатуу жасаган эксперттердин продюсери.
          </p>
          <div className="mentor-stats">
            {mentorStats.map((item) => (
              <article key={item.value}>
                <MotionIcon icon={item.icon} tone="accent" compact />
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="formats-section section-pad" id="formats" data-reveal>
        <div className="section-signal formats-signal" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="formats-head">
          <span className="section-label">/ 05 — формат жана натыйжа</span>
          <HookLine icon={ClipboardCheck}>Кайсы формат сизге туура келет?</HookLine>
          <h2>Форматтар жана натыйжа</h2>
          <p>эфир → курс → практика → запуск</p>
        </div>
        <div className="formats-grid">
          {formats.map((item) => (
            <article className={`format-card ${item.tone}`} key={item.title}>
              <header>
                <span>
                  <MotionIcon icon={item.icon} tone={item.tone === "dark" ? "accent" : "signal"} compact />
                  {item.title}
                </span>
                <b>{item.price}</b>
              </header>
              <p>{item.text}</p>
              <footer>
                <span>{item.meta}</span>
                <ArrowRight size={18} />
              </footer>
            </article>
          ))}
          <article className="video-card" id="video">
            <span>Видео түшүндүрмө</span>
            <HookLine icon={Play}>Көрүп түшүн: эфирден башта, анан форматты танда.</HookLine>
            <strong>КУРС ТУУРАЛУУ ВИДЕО ТҮШҮНДҮРМӨ</strong>
            <p>
              Эфирден башта, анан курс форматын танда.
            </p>
            <a className="video-play" href="#signup" aria-label="Эфирге катталуу">
              <Play size={18} fill="currentColor" />
            </a>
          </article>
        </div>
      </section>

      <section className="final-cta" id="signup" data-reveal>
        <div className="section-signal cta-signal" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="cta-copy">
          <span>/ 06 — акыркы кадам</span>
          <HookLine icon={MessageCircle}>30 секунд: байланыш калтырып, орунду брондоңуз.</HookLine>
          <h2>
            Эфирге кошул
            <br />
            орун брондо
          </h2>
          <p>
            Эфирден баштап, курска орун брондоңуз. Менеджер программа, практика
            жана төлөм шарттарын түшүндүрөт.
          </p>
          <small>
            <CircleDot size={11} fill="currentColor" />
            эфир · курс · практика · старт {courseStartDate}
          </small>
        </div>
        <form className="signup-form" onSubmit={handleLeadSubmit}>
          <span>катталуу · 30 сек</span>
          <label>
            Атыңыз
            <input
              name="name"
              placeholder="Атыңызды жазыңыз"
              autoComplete="name"
              value={leadName}
              onChange={(event) => setLeadName(event.target.value)}
              disabled={leadStatus === "submitting"}
              minLength={2}
              required
            />
          </label>
          <label>
            Телефон / Telegram
            <input
              name="contact"
              placeholder="@nickname же +996"
              autoComplete="tel"
              value={leadContact}
              onChange={(event) => setLeadContact(event.target.value)}
              disabled={leadStatus === "submitting"}
              minLength={3}
              required
            />
            <small>Telegram же телефон калтырыңыз, менеджер түз байланышат.</small>
          </label>
          <fieldset>
            <legend>Деңгээлиңиз</legend>
            {levelOptions.map((option) => (
              <button
                className={leadLevel === option.value ? "active" : ""}
                type="button"
                key={option.value}
                aria-pressed={leadLevel === option.value}
                disabled={leadStatus === "submitting"}
                onClick={() => setLeadLevel(option.value)}
              >
                {option.label}
              </button>
            ))}
          </fieldset>
          <button className="form-submit" type="submit" disabled={leadStatus === "submitting"}>
            {leadStatus === "submitting" ? "Жөнөтүлүүдө..." : "Эфирге катталуу"}
            <ArrowRight size={16} />
          </button>
          <p
            className={`form-note ${leadStatus}`}
            role={leadStatus === "error" ? "alert" : "status"}
            aria-live="polite"
          >
            {leadMessage}
          </p>
          <div className="contact-actions" aria-label="Тез байланыш">
            <a href={instagramUrl} target="_blank" rel="noreferrer">
              <InstagramLogo size={16} />
              Instagram
            </a>
            <a href={whatsappUrl} target="_blank" rel="noreferrer">
              <MessageCircle size={16} />
              WhatsApp
            </a>
          </div>
        </form>
      </section>

      <footer className="site-footer">
        <a className="brand" href="#top">
          <span className="brand-dot" />
          <span>МЕН ПРОДЮСЕР</span>
        </a>
        <nav aria-label="Footer navigation">
          <a href="#program">Программа</a>
          <a href="#mentor">Автор</a>
          <a href="#video">Видео</a>
          <a href="#formats">Тарифтер</a>
        </nav>
        <div className="socials" aria-label="Социалдык байланыштар">
          <a className="social-link instagram" href={instagramUrl} target="_blank" rel="noreferrer">
            <InstagramLogo size={15} />
            Instagram
          </a>
          <a className="social-link whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer">
            <MessageCircle size={15} />
            WhatsApp
          </a>
        </div>
      </footer>
    </main>
  );

  if (prefersReducedMotion) return page;

  return (
    <ReactLenis root options={lenisOptions}>
      <LenisHashScroll />
      {page}
    </ReactLenis>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <article>
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  );
}

function CourseCard({ compact = false }: { compact?: boolean }) {
  return (
    <article className={compact ? "course-card compact" : "course-card"}>
      <div className="course-glow" />
      <header>
        <span>Курс визуал · 01/06</span>
        <i />
      </header>
      <div className="course-photo">
        <img src={authorHeroImage} alt="Уулболсун Алмазбек" />
      </div>
      <strong>продюсер</strong>
      <div className="course-radar" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="course-matrix" aria-hidden="true">
        <span className="matrix-core">0дон</span>
        <span>контент</span>
        <span>прогрев</span>
        <span>эфир</span>
        <span>бронь</span>
        <span>сатуу</span>
      </div>
      <div className="course-proof course-proof-left">
        <MotionIcon icon={BadgeCheck} tone="signal" compact />
        <b>3,5 жыл</b>
        <span>тажрыйба</span>
      </div>
      <div className="course-proof course-proof-right">
        <MotionIcon icon={BarChart3} tone="sun" compact />
        <b>25 млн</b>
        <span>сатуу</span>
      </div>
      <footer>
        <div>
          <span>онлайн курс</span>
          <b>28.04 / 2026</b>
        </div>
        <a className="course-play" href="#video" aria-label="Видео бөлүмүнө өтүү">
          <Play size={16} fill="currentColor" />
        </a>
      </footer>
      <div className="sticker">
        <Sparkles size={12} />
        практика · запуск · сатуу
      </div>
    </article>
  );
}

function InstagramLogo({ size = 16 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17" cy="7" r="1.2" fill="currentColor" />
    </svg>
  );
}

function MotionIcon({
  icon: Icon,
  tone = "accent",
  compact = false,
}: {
  icon: LucideIcon;
  tone?: MotionTone;
  compact?: boolean;
}) {
  return (
    <span className={`motion-icon ${tone}${compact ? " compact" : ""}`} aria-hidden="true">
      <Icon size={compact ? 16 : 20} strokeWidth={2.4} />
      <i />
      <b />
    </span>
  );
}

function HookLine({ children, icon }: { children: string; icon: LucideIcon }) {
  return (
    <p className="section-hook">
      <MotionIcon icon={icon} tone="accent" compact />
      <span>{children}</span>
    </p>
  );
}

function Marquee() {
  const row = [...marqueeItems, ...marqueeItems, ...marqueeItems];

  return (
    <section className="marquee" aria-label="Курс багыттары">
      <div>
        {row.map((item, index) => (
          <span key={`${item}-${index}`}>
            {item}
            <b>✺</b>
          </span>
        ))}
      </div>
    </section>
  );
}
