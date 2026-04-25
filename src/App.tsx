import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleDot,
  Menu,
  Play,
  Sparkles,
  X,
} from "lucide-react";
import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, useLayoutEffect, useState, type FormEvent } from "react";
import mentorImage from "./assets/uulbolsun-almazbek.png";
import { isSupabaseConfigured, supabase } from "./lib/supabase";

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
    title: "Профессия",
    text: "Продюсердин ролу, жоопкерчилиги жана эксперт менен иштөө логикасы.",
  },
  {
    id: "02",
    title: "Эксперт табуу",
    text: "Ниша, оффер, позициялоо жана эксперт менен сүйлөшүү сценарийи.",
  },
  {
    id: "03",
    title: "Контент",
    text: "Instagram, сторис, прогрев жана аудиторияны ишенимге алып келүү.",
  },
  {
    id: "04",
    title: "Продажи",
    text: "Эфир, консультация, бронь жана төлөмгө жеткирүү системасы.",
  },
  {
    id: "05",
    title: "Запуск",
    text: "Команда, дедлайн, аналитика жана биринчи акчалай натыйжа.",
  },
];

const mentorStats = [
  ["3,5 жыл", "продюсерлик жана Instagram запуск тажрыйбасы"],
  ["25 млн сом", "сатуу натыйжасына чейин жеткирген система"],
  ["наставник", "практика жана кайтарым байланыш менен иштейт"],
  ["МЕН ПРОДЮСЕР", "онлайн киреше жана системдүү запуск"],
];

const heroBenefits = ["0дон баштоо", "эксперт менен запуск", "практика + сатуу"] as const;
const courseStartDate = "28-апрель 2026";

const proofPoints = [
  {
    value: "6 модуль",
    label: "запуск системасы",
  },
  {
    value: "3 күн",
    label: "офлайн практика",
  },
  {
    value: "куратор",
    label: "кайтарым байланыш",
  },
] as const;

const formats = [
  {
    title: "Стандарт",
    price: "28 000 сом",
    focus: "4 эфир · 6 модуль · 3 күн практика",
    text: "1 ай, 4 жандуу эфир, 6 модуль, 3 күн офлайн практика жана куратордон кайтарым байланыш.",
    meta: "60 000 → 28 000 сом",
    tone: "dark",
  },
  {
    title: "VIP",
    price: "50 000 сом",
    focus: "10 модуль · 5 күн практика · бонус",
    text: "1,5 ай, жумасына 3 эфир, 10 модуль, 5 күн офлайн практика жана бонус сабактар.",
    meta: "90 000 → 50 000 сом",
    tone: "light",
  },
  {
    title: "Курстан кийин",
    price: "онлайн",
    focus: "30 000ден 150 000+ киреше",
    text: "Продюсер, контентмейкер, сторисмейкер, SMM-адис, копирайтер, прогрев жана сатуу менеджер.",
    meta: "30 000ден 150 000+",
    tone: "accent",
  },
  {
    title: "Спикерлер",
    price: "практика",
    focus: "сатуу + психология",
    text: "Майрам Мухамбетова — сатуу наставник. Рахима Сабаева — психолог.",
    meta: "сатуу + психология",
    tone: "light",
  },
];

const levelOptions = [
  { value: "zero", label: "0дон" },
  { value: "has_blog", label: "блогум бар" },
  { value: "working", label: "иштейм" },
] as const;

const lenisOptions = {
  anchors: { offset: 86 },
  autoRaf: true,
  gestureOrientation: "vertical",
  lerp: 0.085,
  smoothWheel: true,
  stopInertiaOnNavigate: true,
  syncTouch: false,
  touchMultiplier: 1,
  wheelMultiplier: 0.9,
} as const;

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
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.18 },
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
    const updateProgress = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;

      document.documentElement.style.setProperty("--scroll-progress", progress.toFixed(4));
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
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

      window.setTimeout(() => {
        lenis.scrollTo(target, { offset: 86 });
      }, 80);
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
  const [showMobileCta, setShowMobileCta] = useState(false);
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

  useEffect(() => {
    const updateMobileCta = () => {
      const signup = document.getElementById("signup");
      const signupTop = signup?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;
      const signupInView = signupTop < window.innerHeight * 0.78;

      setShowMobileCta(window.scrollY > 420 && !signupInView);
    };

    updateMobileCta();
    window.addEventListener("scroll", updateMobileCta, { passive: true });
    window.addEventListener("resize", updateMobileCta);
    return () => {
      window.removeEventListener("scroll", updateMobileCta);
      window.removeEventListener("resize", updateMobileCta);
    };
  }, []);

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

      <a
        className={showMobileCta ? "mobile-sticky-cta visible" : "mobile-sticky-cta"}
        href="#signup"
        aria-label="Эфирге катталуу"
      >
        <span>Эфирге катталуу</span>
        <ArrowRight size={16} />
      </a>

      <section className="hero-section" id="top">
        <div className="hero-meta" data-intro>
          <span>МЕН ПРОДЮСЕР · автордук курс</span>
          <span>Уулболсун Алмазбек · 3,5 жылдык опыт</span>
          <span>{courseStartDate} · онлайн + офлайн практика</span>
        </div>

        <div className="hero-grid">
          <div className="hero-copy">
            <div className="hero-kicker" data-intro>
              <span />
              эфирге жана курска катталуу
            </div>
            <p className="hero-date" data-intro>
              <CalendarDays size={14} />
              старт <strong>{courseStartDate}</strong>
            </p>

            <h1 className="hero-title" data-intro>
              <span>МЕН</span>
              <em>ПРОДЮСЕР</em>
              <span className="wide-word">автордук курс</span>
            </h1>

            <p className="hero-text" data-intro>
              Уулболсун Алмазбектин автордук курсу: 0дон баштап онлайн продюсер
              болуп, эксперттер менен запуск жасап, киреше табууну үйрөнөсүз.
            </p>

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
                  <CheckCircle2 size={18} />
                  <div>
                    <strong className="proof-value">{item.value}</strong>
                    <span>{item.label}</span>
                  </div>
                </article>
              ))}
            </div>

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

          </div>

          <div className="hero-visual" data-intro>
            <CourseCard />
          </div>

          <div className="hero-stats" data-intro>
            <Stat value="3,5" label="жылдык опыт" />
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
        <div className="section-label">/ 02 — кимдер үчүн</div>
        <div className="section-heading">
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
            <strong>Эфирден биринчи запускка чейин</strong>
            <p>
              Контентти, прогревди, сатуу сценарийин жана команда менен иштөөнү
              бир логикага чогултасыз.
            </p>
          </article>
        </div>
      </section>

      <section className="program-section" id="program" data-reveal>
        <div className="program-head">
          <span>/ 03 — программа</span>
          <h2>Курста эмне болот?</h2>
          <p>Теория аз, практика көп: ар бир блок запусктын реалдуу кадамына байланган.</p>
        </div>
        <div className="program-grid">
          {program.map((item) => (
            <article className="program-card" key={item.id}>
              <span>{item.id}</span>
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
        <div className="mentor-card">
          <CourseCard compact />
        </div>
        <div className="mentor-copy">
          <span className="section-label">/ 04 — кимден үйрөнөсүз</span>
          <h2>Уулболсун Алмазбек</h2>
          <p>
            Уулболсун Алмазбек — 3,5 жылдык опыты бар, 250 000 сомдон 25
            миллион сомго чейин сатуу жасаган эксперттердин продюсери.
          </p>
          <div className="mentor-stats">
            {mentorStats.map(([value, label]) => (
              <article key={value}>
                <strong>{value}</strong>
                <span>{label}</span>
              </article>
            ))}
          </div>
          <div className="speaker-strip">
            <span>Спикерлер</span>
            <p>Майрам Мухамбетова — сатуу наставник; Рахима Сабаева — психолог.</p>
          </div>
        </div>
      </section>

      <section className="formats-section section-pad" id="formats" data-reveal>
        <div className="formats-head">
          <span className="section-label">/ 05 — формат жана натыйжа</span>
          <h2>Форматтар жана натыйжа</h2>
          <p>эфир → курс → практика → запуск</p>
        </div>
        <div className="formats-grid">
          {formats.map((item) => (
            <article className={`format-card ${item.tone}`} key={item.title}>
              <header>
                <span className="format-title">{item.title}</span>
                <b className="price-pill">{item.price}</b>
              </header>
              <span className="format-focus">
                <CircleDot size={11} fill="currentColor" />
                {item.focus}
              </span>
              <p className="format-copy">{item.text}</p>
              <footer>
                <span className="format-meta">{item.meta}</span>
                <ArrowRight size={18} />
              </footer>
            </article>
          ))}
          <article className="video-card" id="video">
            <span>Видео түшүндүрмө</span>
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
        <div className="cta-copy">
          <span>/ 06 — акыркы кадам</span>
          <h2>
            Эфирге кошул
            <br />
            курска старт ал
            <br />
            орун брондо
          </h2>
          <p>
            Эфирден баштап, курска орун брондоңуз. Менеджер программа, практика
            жана төлөм шарттарын түшүндүрөт.
          </p>
          <small className="cta-facts">
            <CircleDot size={11} fill="currentColor" />
            эфир · курс · практика · <strong>старт {courseStartDate}</strong>
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
        </form>
      </section>

      <footer className="site-footer">
        <div className="footer-main">
          <a className="footer-brand" href="#top" aria-label="МЕН ПРОДЮСЕР башкы бет">
            <span className="brand-dot" />
            <strong>МЕН ПРОДЮСЕР</strong>
          </a>
          <p>
            Уулболсун Алмазбектин автордук курсу: эксперт менен запуск,
            контент, сатуу жана практика бир системада.
          </p>
        </div>

        <nav className="footer-links" aria-label="Footer navigation">
          <a href="#program">Программа</a>
          <a href="#formats">Тарифтер</a>
          <a href="#mentor">Автор</a>
          <a href="#signup">Катталуу</a>
        </nav>

        <div className="footer-action">
          <span>{courseStartDate}</span>
          <a href="#signup">
            Орун брондоо
            <ArrowRight size={16} />
          </a>
        </div>

        <div className="footer-bottom">
          <span>© 2026 МЕН ПРОДЮСЕР</span>
          <a href="#top">Башына кайтуу</a>
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
      <strong className="metric-value">{value}</strong>
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
      <strong>продюсер</strong>
      <img src={mentorImage} alt="Уулболсун Алмазбек" />
      <footer>
        <div>
          <span>Курс</span>
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
