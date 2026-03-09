import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/icon";

const NAV_LINKS = [
  { label: "Главная", href: "#hero" },
  { label: "Об услуге", href: "#about" },
  { label: "Отзывы", href: "#reviews" },
  { label: "Контакты", href: "#contacts" },
];

const SERVICES = [
  {
    icon: "Palette",
    title: "Дизайн",
    desc: "Создаём визуальные решения, которые говорят без слов. От логотипа до полной айдентики.",
    tag: "Брендинг · UI/UX · Графика",
  },
  {
    icon: "PenLine",
    title: "Копирайтинг",
    desc: "Тексты, которые убеждают. Продающие страницы, статьи, сценарии и контент для соцсетей.",
    tag: "SEO · Продажи · Контент",
  },
  {
    icon: "BarChart2",
    title: "Аудит",
    desc: "Находим слабые места и точки роста. Комплексный анализ вашего бизнеса и коммуникаций.",
    tag: "Маркетинг · Стратегия · UX",
  },
];

const REVIEWS = [
  {
    name: "Анна Комарова",
    role: "Основатель студии Runo",
    text: "Работать с командой — одно удовольствие. Они не просто выполняют задачи, а думают о результате вместе с тобой. После редизайна конверсия выросла вдвое.",
    rating: 5,
  },
  {
    name: "Михаил Третьяков",
    role: "CEO, Tretyakov Group",
    text: "Заказывал аудит сайта и копирайтинг для лендинга. Всё чётко, в срок, с объяснением каждого решения. Рекомендую без оговорок.",
    rating: 5,
  },
  {
    name: "Дарья Волкова",
    role: "Маркетолог, Bloom Agency",
    text: "Восхищена подходом. Не шаблонно, не шумно — всё по делу. Тексты написаны так, будто давно знают нашу аудиторию.",
    rating: 5,
  },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function AnimSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      {children}
    </div>
  );
}

export default function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900">

      {/* NAV */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur border-b border-neutral-100 py-4" : "py-6"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <span className="font-display text-2xl font-semibold tracking-tight text-neutral-900">
            Studio<span className="text-neutral-400">.</span>
          </span>
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors duration-200 tracking-wide"
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo("#contacts")}
              className="text-sm bg-neutral-900 text-white px-5 py-2.5 rounded-full hover:bg-neutral-700 transition-colors duration-200"
            >
              Связаться
            </button>
          </nav>
          <button
            className="md:hidden text-neutral-900"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name={menuOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-neutral-100 px-6 py-4 flex flex-col gap-4">
            {NAV_LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className="text-left text-base text-neutral-700 py-1"
              >
                {l.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="hero" className="min-h-screen flex flex-col justify-center pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto w-full">
          <div className="opacity-0 animate-fade-up">
            <span className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-neutral-400 mb-8 border border-neutral-200 rounded-full px-4 py-1.5">
              Профессиональные услуги
            </span>
          </div>
          <div className="opacity-0 animate-fade-up-1">
            <h1 className="font-display text-[clamp(3rem,8vw,7rem)] leading-[1.05] font-semibold text-neutral-900 max-w-4xl mb-8">
              Делаем&nbsp;сложное <br />
              <em className="not-italic text-neutral-400">простым и&nbsp;ясным</em>
            </h1>
          </div>
          <div className="opacity-0 animate-fade-up-2">
            <p className="text-lg text-neutral-500 max-w-xl leading-relaxed mb-12">
              Дизайн, тексты и аналитика для бизнеса, которому важно выглядеть убедительно и говорить понятно.
            </p>
          </div>
          <div className="opacity-0 animate-fade-up-3 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => scrollTo("#contacts")}
              className="inline-flex items-center gap-2 bg-neutral-900 text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-neutral-700 transition-all duration-200 hover:gap-3"
            >
              Начать проект <Icon name="ArrowRight" size={16} />
            </button>
            <button
              onClick={() => scrollTo("#about")}
              className="inline-flex items-center gap-2 text-neutral-600 px-8 py-4 rounded-full text-sm border border-neutral-200 hover:border-neutral-400 transition-colors duration-200"
            >
              Узнать больше
            </button>
          </div>
        </div>
        <div className="max-w-6xl mx-auto w-full mt-24 opacity-0 animate-fade-in">
          <div className="h-px bg-neutral-100" />
          <div className="grid grid-cols-3 divide-x divide-neutral-100 mt-0">
            {[["120+", "Проектов"], ["5 лет", "Опыта"], ["98%", "Довольных"]].map(([num, label]) => (
              <div key={label} className="py-8 px-6 text-center">
                <div className="font-display text-3xl font-semibold text-neutral-900">{num}</div>
                <div className="text-xs text-neutral-400 mt-1 tracking-wide">{label}</div>
              </div>
            ))}
          </div>
          <div className="h-px bg-neutral-100" />
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-28 px-6 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
          <AnimSection>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
              <div>
                <span className="text-xs tracking-widest uppercase text-neutral-400 mb-4 block">Об услуге</span>
                <h2 className="font-display text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-tight max-w-xl">
                  Три направления — одна цель
                </h2>
              </div>
              <p className="text-neutral-500 max-w-sm text-sm leading-relaxed">
                Комплексный подход: работаем со смыслом, формой и данными одновременно, чтобы результат был цельным.
              </p>
            </div>
          </AnimSection>
          <div className="grid md:grid-cols-3 gap-px bg-neutral-200">
            {SERVICES.map((s, i) => (
              <AnimSection key={s.title}>
                <div
                  className="bg-neutral-50 p-8 group hover:bg-white transition-colors duration-300 cursor-default"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                    <Icon name={s.icon} size={16} className="text-white" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold mb-3">{s.title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed mb-6">{s.desc}</p>
                  <span className="text-xs text-neutral-400 tracking-wide">{s.tag}</span>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-28 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <AnimSection>
            <div className="mb-20">
              <span className="text-xs tracking-widest uppercase text-neutral-400 mb-4 block">Отзывы</span>
              <h2 className="font-display text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-tight">
                Что говорят клиенты
              </h2>
            </div>
          </AnimSection>
          <div className="grid md:grid-cols-3 gap-8">
            {REVIEWS.map((r, i) => (
              <AnimSection key={r.name}>
                <div
                  className="border border-neutral-100 p-8 rounded-2xl hover:border-neutral-300 hover:shadow-sm transition-all duration-300"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="flex gap-0.5 mb-6">
                    {Array.from({ length: r.rating }).map((_, j) => (
                      <Icon key={j} name="Star" size={14} className="text-neutral-900 fill-neutral-900" />
                    ))}
                  </div>
                  <p className="text-neutral-600 text-sm leading-relaxed mb-8 font-display text-base italic">
                    «{r.text}»
                  </p>
                  <div>
                    <div className="font-medium text-sm text-neutral-900">{r.name}</div>
                    <div className="text-xs text-neutral-400 mt-0.5">{r.role}</div>
                  </div>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <AnimSection>
        <div className="py-20 px-6 bg-neutral-900 text-white">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="font-display text-[clamp(1.8rem,3.5vw,3rem)] font-semibold leading-tight">
                Готовы обсудить проект?
              </h3>
              <p className="text-neutral-400 mt-2 text-sm">Ответим в течение одного рабочего дня.</p>
            </div>
            <button
              onClick={() => scrollTo("#contacts")}
              className="shrink-0 inline-flex items-center gap-2 bg-white text-neutral-900 px-8 py-4 rounded-full text-sm font-medium hover:bg-neutral-100 transition-colors duration-200 hover:gap-3"
            >
              Оставить заявку <Icon name="ArrowRight" size={16} />
            </button>
          </div>
        </div>
      </AnimSection>

      {/* CONTACTS */}
      <section id="contacts" className="py-28 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <AnimSection>
            <div className="grid md:grid-cols-2 gap-20">
              <div>
                <span className="text-xs tracking-widest uppercase text-neutral-400 mb-4 block">Контакты</span>
                <h2 className="font-display text-[clamp(2.2rem,4vw,3.5rem)] font-semibold leading-tight mb-8">
                  Начнём <br /><em className="not-italic text-neutral-400">вместе?</em>
                </h2>
                <div className="space-y-6 text-sm text-neutral-500">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center">
                      <Icon name="Mail" size={14} />
                    </div>
                    <span>hello@studio.ru</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center">
                      <Icon name="Phone" size={14} />
                    </div>
                    <span>+7 (999) 000-00-00</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center">
                      <Icon name="MapPin" size={14} />
                    </div>
                    <span>Москва, Россия</span>
                  </div>
                </div>
              </div>

              <div>
                {sent ? (
                  <div className="h-full flex flex-col items-start justify-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center">
                      <Icon name="Check" size={20} className="text-white" />
                    </div>
                    <h3 className="font-display text-2xl font-semibold">Заявка отправлена!</h3>
                    <p className="text-neutral-500 text-sm">Свяжемся с вами в течение одного рабочего дня.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="text-xs text-neutral-400 uppercase tracking-widest block mb-2">Имя</label>
                      <input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Как вас зовут?"
                        className="w-full border-b border-neutral-200 focus:border-neutral-900 outline-none py-3 text-sm bg-transparent transition-colors duration-200 placeholder:text-neutral-300"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-neutral-400 uppercase tracking-widest block mb-2">Email</label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full border-b border-neutral-200 focus:border-neutral-900 outline-none py-3 text-sm bg-transparent transition-colors duration-200 placeholder:text-neutral-300"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-neutral-400 uppercase tracking-widest block mb-2">Сообщение</label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Расскажите о вашем проекте..."
                        className="w-full border-b border-neutral-200 focus:border-neutral-900 outline-none py-3 text-sm bg-transparent transition-colors duration-200 placeholder:text-neutral-300 resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 bg-neutral-900 text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-neutral-700 transition-all duration-200 hover:gap-3 mt-2"
                    >
                      Отправить заявку <Icon name="ArrowRight" size={16} />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </AnimSection>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-neutral-100 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-display text-lg font-semibold text-neutral-900">
            Studio<span className="text-neutral-400">.</span>
          </span>
          <span className="text-xs text-neutral-400">© 2026 Studio. Все права защищены.</span>
          <div className="flex gap-4">
            {["Telegram", "Instagram", "Linkedin"].map((s) => (
              <button key={s} className="text-xs text-neutral-400 hover:text-neutral-900 transition-colors duration-200">
                {s}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
