import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/icon";

const NAV_LINKS = [
  { label: "Главная", href: "#hero" },
  { label: "Услуги", href: "#about" },
  { label: "Отзывы", href: "#reviews" },
  { label: "Контакты", href: "#contacts" },
];

const SERVICES = [
  {
    icon: "Stethoscope",
    title: "Терапия",
    desc: "Диагностика и лечение внутренних болезней. Работаем с кошками, собаками, грызунами и экзотическими животными.",
    tag: "Осмотр · Анализы · Лечение",
  },
  {
    icon: "ShieldCheck",
    title: "Вакцинация",
    desc: "Индивидуальный план прививок, импортные и отечественные препараты, оформление ветеринарного паспорта.",
    tag: "Щенки · Котята · Взрослые",
  },
  {
    icon: "Scissors",
    title: "Хирургия",
    desc: "Плановые и экстренные операции. Современное оборудование, анестезиология и послеоперационный уход.",
    tag: "Плановая · Экстренная · Реабилитация",
  },
];

const REVIEWS = [
  {
    name: "Ольга Смирнова",
    role: "Хозяйка лабрадора Арчи",
    text: "Привозила своего пса после травмы. Команда клиники сработала быстро и профессионально. Арчи восстановился за две недели — быстрее, чем ожидали.",
    rating: 5,
  },
  {
    name: "Дмитрий Карпов",
    role: "Хозяин кота Василия",
    text: "Регулярно приходим на вакцинацию и осмотр. Врачи всегда объясняют что и зачем, не торопят. Ребёнок теперь хочет стать ветеринаром.",
    rating: 5,
  },
  {
    name: "Екатерина Лебедева",
    role: "Хозяйка кроликов",
    text: "Наконец нашли клинику, где умеют работать с экзотикой. Кролики в порядке, врач знает о них всё. Спасибо за бережное отношение!",
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
  const [formData, setFormData] = useState({ name: "", phone: "", pet: "", message: "" });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setFormData({ name: "", phone: "", pet: "", message: "" });
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
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center">
              <Icon name="Heart" size={13} className="text-white fill-white" />
            </div>
            <span className="font-display text-xl font-semibold tracking-tight text-neutral-900">
              Ветклиника АГАУ
            </span>
          </div>
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
              className="text-sm bg-emerald-600 text-white px-5 py-2.5 rounded-full hover:bg-emerald-700 transition-colors duration-200"
            >
              Записаться
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
            <span className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-emerald-700 mb-8 border border-emerald-200 bg-emerald-50 rounded-full px-4 py-1.5">
              Ветеринарная клиника АГАУ
            </span>
          </div>
          <div className="opacity-0 animate-fade-up-1">
            <h1 className="font-display text-[clamp(3rem,8vw,7rem)] leading-[1.05] font-semibold text-neutral-900 max-w-4xl mb-8">
              Здоровье вашего <br />
              <em className="not-italic text-neutral-400">питомца — наша забота</em>
            </h1>
          </div>
          <div className="opacity-0 animate-fade-up-2">
            <p className="text-lg text-neutral-500 max-w-xl leading-relaxed mb-12">
              Профессиональная ветеринарная помощь для кошек, собак и экзотических животных. Терапия, хирургия, вакцинация — всё в одном месте.
            </p>
          </div>
          <div className="opacity-0 animate-fade-up-3 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => scrollTo("#contacts")}
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-emerald-700 transition-all duration-200 hover:gap-3"
            >
              Записаться на приём <Icon name="ArrowRight" size={16} />
            </button>
            <a
              href="tel:+79609416936"
              className="inline-flex items-center gap-2 text-neutral-600 px-8 py-4 rounded-full text-sm border border-neutral-200 hover:border-neutral-400 transition-colors duration-200"
            >
              <Icon name="Phone" size={15} /> +7 960 941 69 36
            </a>
          </div>
        </div>
        <div className="max-w-6xl mx-auto w-full mt-24 opacity-0 animate-fade-in">
          <div className="h-px bg-neutral-100" />
          <div className="grid grid-cols-3 divide-x divide-neutral-100 mt-0">
            {[["1 500+", "Пациентов"], ["8 лет", "Работаем"], ["24 / 7", "Экстренно"]].map(([num, label]) => (
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
                <span className="text-xs tracking-widest uppercase text-neutral-400 mb-4 block">Наши услуги</span>
                <h2 className="font-display text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-tight max-w-xl">
                  Полный спектр ветеринарной помощи
                </h2>
              </div>
              <p className="text-neutral-500 max-w-sm text-sm leading-relaxed">
                От планового осмотра до сложных операций — опытная команда врачей готова помочь вашему питомцу.
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
                  <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
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
                Нам доверяют питомцев
              </h2>
            </div>
          </AnimSection>
          <div className="grid md:grid-cols-3 gap-8">
            {REVIEWS.map((r, i) => (
              <AnimSection key={r.name}>
                <div
                  className="border border-neutral-100 p-8 rounded-2xl hover:border-emerald-200 hover:shadow-sm transition-all duration-300"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="flex gap-0.5 mb-6">
                    {Array.from({ length: r.rating }).map((_, j) => (
                      <Icon key={j} name="Star" size={14} className="text-emerald-500 fill-emerald-500" />
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
        <div className="py-20 px-6 bg-emerald-600 text-white">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="font-display text-[clamp(1.8rem,3.5vw,3rem)] font-semibold leading-tight">
                Экстренная помощь — круглосуточно
              </h3>
              <p className="text-emerald-100 mt-2 text-sm">Принимаем животных в любое время суток.</p>
            </div>
            <a
              href="tel:+79609416936"
              className="shrink-0 inline-flex items-center gap-2 bg-white text-emerald-700 px-8 py-4 rounded-full text-sm font-medium hover:bg-emerald-50 transition-colors duration-200"
            >
              <Icon name="Phone" size={16} /> Позвонить сейчас
            </a>
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
                  Запишитесь <br /><em className="not-italic text-neutral-400">на приём</em>
                </h2>
                <div className="space-y-6 text-sm text-neutral-500">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center shrink-0">
                      <Icon name="Phone" size={14} />
                    </div>
                    <a href="tel:+79609416936" className="hover:text-emerald-600 transition-colors">+7 960 941 69 36</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center shrink-0">
                      <Icon name="Send" size={14} />
                    </div>
                    <a href="https://t.me/comravet" target="_blank" rel="noreferrer" className="hover:text-emerald-600 transition-colors">@comravet</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center shrink-0">
                      <Icon name="Mail" size={14} />
                    </div>
                    <a href="mailto:comravet@mail.ru" className="hover:text-emerald-600 transition-colors">comravet@mail.ru</a>
                  </div>
                  <div className="flex items-start gap-3 pt-4 border-t border-neutral-100">
                    <div className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon name="Building2" size={14} />
                    </div>
                    <div className="text-xs text-neutral-400 leading-relaxed">
                      ООО «Ветклиника АГАУ»<br />
                      ИНН: 2222907971 · КПП: 222201001<br />
                      ОГРН: 1242200010722
                    </div>
                  </div>
                </div>
              </div>

              <div>
                {sent ? (
                  <div className="h-full flex flex-col items-start justify-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center">
                      <Icon name="Check" size={20} className="text-white" />
                    </div>
                    <h3 className="font-display text-2xl font-semibold">Заявка отправлена!</h3>
                    <p className="text-neutral-500 text-sm">Свяжемся с вами в ближайшее время для подтверждения записи.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="text-xs text-neutral-400 uppercase tracking-widest block mb-2">Ваше имя</label>
                      <input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Как вас зовут?"
                        className="w-full border-b border-neutral-200 focus:border-emerald-500 outline-none py-3 text-sm bg-transparent transition-colors duration-200 placeholder:text-neutral-300"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-neutral-400 uppercase tracking-widest block mb-2">Телефон</label>
                      <input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+7 (___) ___-__-__"
                        className="w-full border-b border-neutral-200 focus:border-emerald-500 outline-none py-3 text-sm bg-transparent transition-colors duration-200 placeholder:text-neutral-300"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-neutral-400 uppercase tracking-widest block mb-2">Питомец</label>
                      <input
                        value={formData.pet}
                        onChange={(e) => setFormData({ ...formData, pet: e.target.value })}
                        placeholder="Вид и имя (например: кот Мурзик)"
                        className="w-full border-b border-neutral-200 focus:border-emerald-500 outline-none py-3 text-sm bg-transparent transition-colors duration-200 placeholder:text-neutral-300"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-neutral-400 uppercase tracking-widest block mb-2">Причина визита</label>
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Опишите проблему или укажите нужную услугу..."
                        className="w-full border-b border-neutral-200 focus:border-emerald-500 outline-none py-3 text-sm bg-transparent transition-colors duration-200 placeholder:text-neutral-300 resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-emerald-700 transition-all duration-200 hover:gap-3 mt-2"
                    >
                      Записаться <Icon name="ArrowRight" size={16} />
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
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center">
              <Icon name="Heart" size={9} className="text-white fill-white" />
            </div>
            <span className="font-display text-base font-semibold text-neutral-900">Ветклиника АГАУ</span>
          </div>
          <span className="text-xs text-neutral-400">© 2026 ООО «Ветклиника АГАУ». Все права защищены.</span>
          <a href="tel:+79609416936" className="text-xs text-neutral-500 hover:text-emerald-600 transition-colors duration-200">
            +7 960 941 69 36
          </a>
        </div>
      </footer>
    </div>
  );
}