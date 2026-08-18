'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
  Phone,
  ShoppingBag,
  Factory,
  ShieldCheck,
  Wrench,
  Box,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  MapPin,
  Clock,
  Mail,
  Menu,
  X,
  ArrowRight,
  Star,
  Plus,
  MessageCircle,
  Send,
  TreePine,
  Ruler,
  Hammer,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CATALOG_ITEMS, PROJECTS, CATALOG_FILTER_LABELS, getTypeLabel } from '@/data/products'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const CURRENT_YEAR = new Date().getFullYear()

/* ───────────────────────── TYPES ───────────────────────── */

type PageId = 'home' | 'catalog' | 'projects' | 'about' | 'contacts' | 'privacy'

/* ───────────────────────── DATA ───────────────────────── */

const NAV_LINKS: { label: string; pageId: PageId }[] = [
  { label: 'Каталог', pageId: 'catalog' },
  { label: 'Проекты', pageId: 'projects' },
  { label: 'О производстве', pageId: 'about' },
  { label: 'Контакты', pageId: 'contacts' },
]

const ADVANTAGES = [
  {
    icon: Factory,
    title: 'Собственное производство',
    description: 'Полный цикл от заготовки до финальной сборки на нашем заводе в Омске',
  },
  {
    icon: ShieldCheck,
    title: 'Гарантия 5 лет',
    description: 'На все конструкции и инженерные системы предоставляем расширенную гарантию',
  },
  {
    icon: Wrench,
    title: 'Монтаж под ключ',
    description: 'Бережная установка с соблюдением всех технологических норм',
  },
  {
    icon: Box,
    title: 'Проектирование 3D',
    description: 'Детальная визуализация вашей бани до начала строительства',
  },
]

const REVIEWS = [
  { name: 'Алексей К.', text: 'Заказывали баню 5,5×2,5 под ключ. Качество на высоте, монтаж занял всего 3 дня. Печём уже полгода — никаких проблем!', rating: 5, location: 'Омск' },
  { name: 'Марина С.', text: 'Дачный домик превзошёл все ожидания. Тёплый, уютный, собран очень аккуратно. Рекомендую ПАР ХАУС всем знакомым.', rating: 5, location: 'Омская область' },
  { name: 'Дмитрий В.', text: 'Мини-парная для загородного дома — идеальное решение. Быстрый прогрев, экономично. Спасибо команде за профессионализм!', rating: 5, location: 'Омск' },
]

const FAQ_DATA = [
  { q: 'Сколько стоит баня под ключ?', a: 'Стоимость зависит от размеров и комплектации. Базовые модели начинаются от 320 000 ₽. Точную стоимость рассчитаем после консультации — это бесплатно.' },
  { q: 'Какой срок изготовления?', a: 'Стандартный срок производства — 2-4 недели в зависимости от сложности проекта. Монтаж на участке занимает 1-3 дня.' },
  { q: 'Какую древесину вы используете?', a: 'Работаем с термически модифицированной древесиной: термоясень, лиственница, карельская берёза. Также используем кедровый мини брус.' },
  { q: 'Есть ли доставка и монтаж?', a: 'Да, осуществляем доставку по Омску и Омской области. Монтаж выполняют наши специалисты с соблюдением всех технологических норм.' },
  { q: 'Какая гарантия на продукцию?', a: 'Предоставляем гарантию 5 лет на все конструкции и инженерные системы. Также даём рекомендации по уходу.' },
  { q: 'Можно ли заказать индивидуальный проект?', a: 'Конечно! Разработаем 3D-проект с учётом всех ваших пожеланий и особенностей участка. Проектирование включено в стоимость.' },
]

const PROCESS_STEPS = [
  { num: '01', icon: Phone, title: 'Заявка', desc: 'Оставьте заявку на сайте или позвоните нам' },
  { num: '02', icon: Ruler, title: 'Проектирование', desc: 'Разработаем 3D-проект с учётом ваших пожеланий' },
  { num: '03', icon: Factory, title: 'Производство', desc: 'Изготовим на нашем заводе в Омске за 2-4 недели' },
  { num: '04', icon: Wrench, title: 'Монтаж', desc: 'Доставим и установим на вашем участке' },
]

const MATERIALS = [
  { name: 'Термоясень', desc: 'Термически модифицированная ясень — устойчива к влаге и гниению, красивый текстурный рисунок' },
  { name: 'Лиственница', desc: 'Природная долговечность, высокая плотность, устойчивость к деформации' },
  { name: 'Карельская берёза', desc: 'Эксклюзивная древесина с уникальным рисунком, идеальна для интерьеров' },
  { name: 'Кедр', desc: 'Кедровый мини брус — целебные свойства, природный аромат, отличная теплоизоляция' },
]

const VALUES = [
  { title: 'Качество', desc: 'Каждая деталь проходит контроль на всех этапах производства. Не экономим на материалах.' },
  { title: 'Честность', desc: 'Прозрачное ценообразование, никаких скрытых платежей. Что договорили — то делаем.' },
  { title: 'Ответственность', desc: 'Берём ответственность за весь цикл — от проекта до финального монтажа и гарантийного обслуживания.' },
]

/* CATALOG_TYPES removed — now uses CATALOG_FILTER_LABELS from @/data/products */

/* ───────────────────────── SHARED HOOKS ───────────────────────── */

function useOnScreen(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true) // true for SSR
  const hasChecked = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || hasChecked.current) return
    hasChecked.current = true

    // Delay check to avoid flash — runs after first paint
    const timer = setTimeout(() => {
      const rect = el.getBoundingClientRect()
      if (rect.top > window.innerHeight) {
        setVisible(false)
      }
    }, 50)

    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold }
    )
    obs.observe(el)
    return () => { clearTimeout(timer); obs.disconnect() }
  }, [threshold])

  return { ref, visible }
}

function useCountUp(end: number, duration = 2000, startVal = 0) {
  const [count, setCount] = useState(startVal)
  const [triggered, setTriggered] = useState(false)
  const rafRef = useRef(0)

  useEffect(() => {
    if (!triggered) return
    let startTs: number | null = null
    const step = (ts: number) => {
      if (!startTs) startTs = ts
      const progress = Math.min((ts - startTs) / duration, 1)
      setCount(Math.floor(startVal + (end - startVal) * progress))
      if (progress < 1) rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [triggered, end, duration, startVal])

  return { count, start: () => setTriggered(true) }
}

/* ───────────────────────── PAGE TRANSITION VARIANTS ───────────────────────── */

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

const pageTransition = { duration: 0.35, ease: 'easeInOut' as const }

/* ───────────────────────── SECTION HEADING ───────────────────────── */

function SectionHeading({ label, title, visible, delay = 0 }: { label: string; title: string; visible: boolean; delay?: number }) {
  return (
    <div className="text-center mb-16">
      <motion.div
        initial={false}
        animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay }}
        className="flex items-center justify-center gap-4 mb-5"
      >
        <div className="w-10 h-px bg-gradient-to-r from-transparent to-[#C68E4E]" />
        <span className="text-[#C68E4E] text-xs sm:text-sm tracking-[0.35em] uppercase font-semibold">
          {label}
        </span>
        <div className="w-10 h-px bg-gradient-to-l from-transparent to-[#C68E4E]" />
      </motion.div>
      <motion.h2
        initial={false}
        animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: delay + 0.1 }}
        className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[0.04em] uppercase text-white"
      >
        {title}
      </motion.h2>
      <motion.div
        initial={false}
        animate={visible ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.8, delay: delay + 0.25 }}
        className="mt-5 mx-auto w-20 h-[2px] bg-[#C68E4E] origin-center"
      />
    </div>
  )
}

/* ───────────────────────── HEADER ───────────────────────── */

function Header({ currentPage, onNavigate }: { currentPage: PageId; onNavigate: (page: PageId) => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleNav = useCallback((pageId: PageId) => {
    onNavigate(pageId)
    setMobileOpen(false)
  }, [onNavigate])

  const isGlass = scrolled || currentPage !== 'home'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isGlass
          ? 'glass py-3 shadow-[0_2px_20px_rgba(0,0,0,0.6)]'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => handleNav('home')}
          className="flex items-center group"
        >
          <img
            src="/logo.webp"
            alt="ПАР ХАУС — Производство бань и саун"
            fetchPriority="high"
            className="h-11 sm:h-13 w-auto object-contain mix-blend-screen brightness-110"
          />
        </button>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = currentPage === link.pageId
            return (
              <button
                key={link.pageId}
                onClick={() => handleNav(link.pageId)}
                className={`text-sm tracking-[0.15em] uppercase transition-colors duration-300 relative group ${
                  isActive
                    ? 'text-[#C68E4E]'
                    : 'text-[#C0C8D0] hover:text-[#C68E4E]'
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-[2px] bg-[#C68E4E] transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </button>
            )
          })}
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-4">
          <a
            href="tel:+79048220007"
            className="hidden sm:flex items-center gap-2 text-[#C0C8D0] hover:text-[#C68E4E] transition-colors duration-300"
          >
            <Phone className="w-4 h-4" />
            <span className="text-sm font-medium">+7 (904) 822-00-07</span>
          </a>
          <button
            onClick={() => handleNav('catalog')}
            className="relative p-2 text-[#C0C8D0] hover:text-[#C68E4E] transition-colors duration-300"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-[#C0C8D0] hover:text-[#C68E4E] transition-colors"
            aria-label="Меню"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass overflow-hidden"
          >
            <nav className="flex flex-col px-4 py-4 gap-4">
              {NAV_LINKS.map((link) => {
                const isActive = currentPage === link.pageId
                return (
                  <button
                    key={link.pageId}
                    onClick={() => handleNav(link.pageId)}
                    className={`text-sm tracking-[0.15em] uppercase transition-colors py-2 text-left ${
                      isActive
                        ? 'text-[#C68E4E]'
                        : 'text-[#C0C8D0] hover:text-[#C68E4E]'
                    }`}
                  >
                    {link.label}
                  </button>
                )
              })}
              <a
                href="tel:+79048220007"
                className="flex items-center gap-2 text-[#C68E4E] text-sm font-medium pt-2 border-t border-[#C68E4E]/20"
              >
                <Phone className="w-4 h-4" />
                +7 (904) 822-00-07
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

/* ───────────────────────── SCROLL PROGRESS BAR ───────────────────────── */

function ScrollProgressBar({ mainRef }: { mainRef: React.RefObject<HTMLDivElement | null> }) {
  const { scrollYProgress } = useScroll({
    target: mainRef,
    offset: ['start start', 'end end'],
  })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-[#C68E4E] z-[60] origin-left"
      style={{ scaleX: scrollYProgress }}
    />
  )
}

/* ───────────────────────── BACK TO TOP ───────────────────────── */

function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handler = () => setShow(window.scrollY > 600)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-28 right-5 z-50 w-12 h-12 rounded-full bg-[#C68E4E] hover:bg-[#D4A762] text-white flex items-center justify-center shadow-[0_4px_20px_rgba(198,142,78,0.4)] transition-colors duration-300"
          aria-label="Наверх"
        >
          <ChevronUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}


/* ───────────────────────── HERO SECTION ───────────────────────── */

function HeroSection({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-bg.webp"
          alt="ПАР ХАУС — интерьер бани из кедра"
          className="absolute inset-0 w-full h-full object-cover scale-105"
          fetchPriority="high"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/60 via-[#1A1A1A]/40 to-[#1A1A1A]" />
        {/* Side vignettes for drama */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#1A1A1A_100%)]" />
        {/* Light beams */}
        <div className="light-beam top-0 left-[15%] w-[3px] h-[70%]" />
        <div className="light-beam top-0 left-[45%] w-[2px] h-[50%] opacity-70" />
        <div className="light-beam top-0 right-[20%] w-[2px] h-[60%] opacity-50" />
      </div>

      {/* Rising steam/vapor particles */}
      <div className="absolute bottom-0 left-0 right-0 h-[400px] z-[1] pointer-events-none overflow-hidden">
        <div
          className="vapor-1 absolute bottom-0 left-[8%] w-52 h-52 rounded-full bg-[#C68E4E]/[0.07] blur-3xl"
          style={{ animationDelay: '0s' }}
        />
        <div
          className="vapor-2 absolute bottom-0 left-[25%] w-72 h-72 rounded-full bg-white/[0.04] blur-[40px]"
          style={{ animationDelay: '1.5s' }}
        />
        <div
          className="vapor-3 absolute bottom-0 left-[45%] w-64 h-64 rounded-full bg-[#C68E4E]/[0.06] blur-3xl"
          style={{ animationDelay: '0.5s' }}
        />
        <div
          className="vapor-4 absolute bottom-0 left-[60%] w-48 h-48 rounded-full bg-white/[0.05] blur-[35px]"
          style={{ animationDelay: '3s' }}
        />
        <div
          className="vapor-1 absolute bottom-0 left-[75%] w-56 h-56 rounded-full bg-[#C68E4E]/[0.05] blur-3xl"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="vapor-3 absolute bottom-0 left-[90%] w-44 h-44 rounded-full bg-white/[0.03] blur-[30px]"
          style={{ animationDelay: '4s' }}
        />
        <div
          className="vapor-2 absolute bottom-0 left-[35%] w-40 h-40 rounded-full bg-[#C68E4E]/[0.04] blur-3xl"
          style={{ animationDelay: '5s' }}
        />
        <div
          className="vapor-4 absolute bottom-0 left-[55%] w-60 h-60 rounded-full bg-white/[0.04] blur-[40px]"
          style={{ animationDelay: '1s' }}
        />
      </div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-24"
      >
        <div className="max-w-4xl">
          {/* Tagline */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-14 h-[2px] bg-[#C68E4E]" />
            <span className="text-[#C68E4E] text-xs sm:text-sm tracking-[0.3em] uppercase font-semibold">
              Производство бань и саун
            </span>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-lg sm:text-xl lg:text-2xl text-[#D0D6DC] max-w-2xl leading-relaxed font-light"
          >
            Строим бани, которые дышат.
            <br className="hidden sm:block" />
            <span className="text-white font-normal">
              {' '}Инженерные решения для русского пара.
            </span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <Button
              size="lg"
              className="bg-[#C68E4E] hover:bg-[#D4A762] text-white font-semibold tracking-[0.1em] uppercase text-sm px-8 py-6 h-auto rounded-none transition-all duration-300 hover:shadow-[0_0_40px_rgba(198,142,78,0.4)]"
              onClick={() => openCalcDialog()}
            >
              Рассчитать проект
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-[#C68E4E]/50 hover:border-[#C68E4E] hover:bg-[#C68E4E]/10 text-[#C68E4E] font-semibold tracking-[0.1em] uppercase text-sm px-8 py-6 h-auto rounded-none transition-all duration-300"
              onClick={() => onNavigate('catalog')}
            >
              Смотреть каталог
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[#C68E4E]/50 text-[10px] tracking-[0.3em] uppercase">
          Scroll
        </span>
        <div className="scroll-indicator">
          <ChevronDown className="w-5 h-5 text-[#C68E4E]/70" />
        </div>
      </motion.div>
    </section>
  )
}

/* ───────────────────────── PROCESS TIMELINE ───────────────────────── */

function ProcessTimeline({ compact = false }: { compact?: boolean }) {
  const { ref, visible } = useOnScreen(0.15)

  return (
    <div ref={ref} className="py-20 lg:py-28 bg-[#222222] relative">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Процесс"
          title="Как мы работаем"
          visible={visible}
        />

        {/* Desktop horizontal timeline */}
        <div className="hidden lg:block relative">
          {/* Connector line */}
          <div className="absolute top-24 left-[12.5%] right-[12.5%] h-[2px] timeline-line" />

          <div className="grid grid-cols-4 gap-8">
            {PROCESS_STEPS.map((step, idx) => (
              <motion.div
                key={step.num}
                initial={false}
                animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.15 * idx + 0.3 }}
                className="flex flex-col items-center text-center"
              >
                {/* Number */}
                <span className="text-[#C68E4E]/30 text-4xl font-bold mb-4 tracking-[0.1em]">{step.num}</span>
                {/* Icon circle */}
                <div className="w-16 h-16 rounded-full bg-[#C68E4E]/15 border-2 border-[#C68E4E]/40 flex items-center justify-center mb-6">
                  <step.icon className="w-7 h-7 text-[#C68E4E]" />
                </div>
                <h3 className="text-white font-bold text-base tracking-[0.04em] uppercase mb-2">{step.title}</h3>
                <p className="text-[#B0B8C0] text-sm leading-relaxed max-w-[200px]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile vertical timeline */}
        <div className="lg:hidden space-y-0">
          {PROCESS_STEPS.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={false}
              animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.5, delay: 0.12 * idx + 0.3 }}
              className="flex gap-6 relative"
            >
              {/* Left: line + circle */}
              <div className="flex flex-col items-center shrink-0">
                <div className="w-12 h-12 rounded-full bg-[#C68E4E]/15 border-2 border-[#C68E4E]/40 flex items-center justify-center z-10">
                  <step.icon className="w-5 h-5 text-[#C68E4E]" />
                </div>
                {idx < PROCESS_STEPS.length - 1 && (
                  <div className="w-[2px] flex-1 bg-gradient-to-b from-[#C68E4E]/40 to-[#C68E4E]/10 min-h-[40px]" />
                )}
              </div>
              {/* Right: content */}
              <div className="pb-8">
                <span className="text-[#C68E4E]/40 text-lg font-bold tracking-[0.1em]">{step.num}</span>
                <h3 className="text-white font-bold text-base tracking-[0.04em] uppercase mb-1">{step.title}</h3>
                <p className="text-[#B0B8C0] text-sm leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────── HOME PAGE ───────────────────────── */

function HomePage({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  return (
    <>
      <HeroSection onNavigate={onNavigate} />

      {/* Advantages compact */}
      <section className="relative py-20 lg:py-28 bg-[#222222]">
        <div className="section-divider absolute top-0 left-0 right-0" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AdvantagesCompact />
        </div>
      </section>

      {/* Featured Projects */}
      <FeaturedProjects onNavigate={onNavigate} />

      {/* Process Timeline */}
      <ProcessTimeline />

      {/* Reviews */}
      <ReviewsSection />

      {/* FAQ */}
      <FAQSection />

      {/* CTA Banner */}
      <CTABanner />
    </>
  )
}

/* ───────────────────────── ADVANTAGES COMPACT ───────────────────────── */

function AdvantagesCompact() {
  const { ref, visible } = useOnScreen(0.2)

  return (
    <div ref={ref}>
      <SectionHeading label="Почему мы" title="Преимущества" visible={visible} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {ADVANTAGES.map((item, idx) => (
          <motion.div
            key={item.title}
            initial={false}
            animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.15 * idx }}
            className="glass-card group rounded-lg p-6 lg:p-8 hover:border-[#C68E4E]/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_12px_48px_rgba(198,142,78,0.12)]"
          >
            <div className="w-14 h-14 rounded-sm bg-[#C68E4E]/15 border border-[#C68E4E]/30 flex items-center justify-center mb-6 group-hover:bg-[#C68E4E]/25 group-hover:border-[#C68E4E]/50 transition-colors duration-300">
              <item.icon className="w-7 h-7 text-[#C68E4E]" />
            </div>
            <h3 className="text-white font-bold text-base tracking-[0.04em] uppercase mb-3">
              {item.title}
            </h3>
            <p className="text-[#B0B8C0] text-sm leading-relaxed">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ───────────────────────── FEATURED PROJECTS (HOME) ───────────────────────── */

function FeaturedProjects({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  const { ref, visible } = useOnScreen(0.1)
  const featured = PROJECTS.slice(0, 3)

  return (
    <section ref={ref} className="relative py-20 lg:py-28 bg-[#1A1A1A]">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading label="Портфолио" title="Избранные проекты" visible={visible} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((project, idx) => (
            <motion.div
              key={project.slug}
              initial={false}
              animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.1 * idx }}
              className="group relative rounded-lg overflow-hidden h-72 sm:h-80 lg:h-96 border border-[#333] hover:border-[#C68E4E]/40 transition-all duration-500 cursor-pointer"
              onClick={() => onNavigate('projects')}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${project.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/50 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-14 h-14 rounded-full bg-[#C68E4E]/20 border border-[#C68E4E]/50 flex items-center justify-center">
                  <ArrowRight className="w-6 h-6 text-[#C68E4E]" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-block text-[#C68E4E] text-xs tracking-[0.2em] uppercase font-semibold px-2 py-0.5 bg-[#C68E4E]/10 border border-[#C68E4E]/20 rounded-sm">
                    {project.gallery.length} фото
                  </span>
                  <span className="text-[#C68E4E] font-bold text-sm">{project.price}</span>
                </div>
                <h3 className="text-white font-bold text-lg tracking-[0.02em] uppercase">
                  {project.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={false}
          animate={visible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Button
            variant="outline"
            className="border-[#C68E4E]/50 hover:border-[#C68E4E] hover:bg-[#C68E4E]/10 text-[#C68E4E] font-semibold tracking-[0.1em] uppercase text-sm px-8 py-5 h-auto rounded-none transition-all duration-300"
            onClick={() => onNavigate('projects')}
          >
            Все проекты
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

/* ───────────────────────── REVIEWS SECTION ───────────────────────── */

function ReviewsSection() {
  const { ref, visible } = useOnScreen(0.15)

  return (
    <section ref={ref} className="relative py-20 lg:py-28 bg-[#222222]">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading label="Отзывы" title="Наши клиенты" visible={visible} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {REVIEWS.map((review, idx) => (
            <motion.div
              key={review.name}
              initial={false}
              animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.15 * idx }}
              className="glass-card rounded-lg p-6 lg:p-8"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-[#C68E4E] fill-[#C68E4E]" />
                ))}
              </div>
              {/* Quote */}
              <p className="text-[#D0D6DC] text-sm leading-relaxed mb-6 italic">
                &ldquo;{review.text}&rdquo;
              </p>
              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#333]">
                <div className="w-10 h-10 rounded-full bg-[#C68E4E]/20 border border-[#C68E4E]/30 flex items-center justify-center">
                  <span className="text-[#C68E4E] font-bold text-sm">
                    {review.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{review.name}</p>
                  <p className="text-[#8090A0] text-xs">{review.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── FAQ SECTION ───────────────────────── */

function FAQSection() {
  const { ref, visible } = useOnScreen(0.1)
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <section ref={ref} className="relative py-20 lg:py-28 bg-[#1A1A1A]">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading label="Вопросы" title="Частые вопросы" visible={visible} />

        <div className="space-y-3">
          {FAQ_DATA.map((item, idx) => {
            const isOpen = openIdx === idx
            return (
              <motion.div
                key={idx}
                initial={false}
                animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.08 * idx }}
                className="glass-card rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 lg:p-6 text-left group"
                >
                  <span className={`text-sm font-semibold tracking-[0.02em] transition-colors duration-300 ${isOpen ? 'text-[#C68E4E]' : 'text-white group-hover:text-[#D0D6DC]'}`}>
                    {item.q}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="shrink-0 ml-4 w-8 h-8 rounded-full bg-[#C68E4E]/10 border border-[#C68E4E]/30 flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4 text-[#C68E4E]" />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 lg:px-6 pb-5 lg:pb-6 text-[#B0B8C0] text-sm leading-relaxed border-t border-[#333]/50 pt-4">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── CTA BANNER ───────────────────────── */

function CTABanner() {
  const { ref, visible } = useOnScreen(0.2)

  return (
    <section ref={ref} className="relative py-20 lg:py-28 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] via-[#2A2218] to-[#1A1A1A]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(198,142,78,0.08)_0%,transparent_70%)]" />
      <div className="section-divider absolute top-0 left-0 right-0" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={false}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[0.04em] uppercase text-white mb-6">
            Готовы построить
            <br />
            <span className="text-[#C68E4E]">баню мечты?</span>
          </h2>
          <p className="text-[#B0B8C0] text-base lg:text-lg max-w-xl mx-auto mb-10">
            Оставьте заявку и получите бесплатный расчёт проекта за 30 минут
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-[#C68E4E] hover:bg-[#D4A762] text-white font-semibold tracking-[0.1em] uppercase text-sm px-8 py-6 h-auto rounded-none transition-all duration-300 hover:shadow-[0_0_40px_rgba(198,142,78,0.4)]"
              onClick={() => openCalcDialog()}
            >
              Рассчитать проект
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <a
              href="tel:+79048220007"
              className="inline-flex items-center justify-center gap-2 border border-[#C68E4E]/50 hover:border-[#C68E4E] hover:bg-[#C68E4E]/10 text-[#C68E4E] font-semibold tracking-[0.1em] uppercase text-sm px-8 py-6 h-auto rounded-none transition-all duration-300"
            >
              <Phone className="w-4 h-4" />
              Позвонить
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ───────────────────────── CATALOG PAGE ───────────────────────── */

function CatalogPage({ onNavigate, onOpenProject }: { onNavigate: (page: PageId) => void; onOpenProject: (slug: string) => void }) {
  const { ref, visible } = useOnScreen(0.1)
  const [activeFilter, setActiveFilter] = useState('Все')
  const [selectedItem, setSelectedItem] = useState<typeof CATALOG_ITEMS[0] | null>(null)

  const filtered = activeFilter === 'Все'
    ? CATALOG_ITEMS
    : CATALOG_ITEMS.filter((item) => getTypeLabel(item.type) === activeFilter)

  return (
    <div className="pt-28 pb-16">
      <div ref={ref} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading label="Продукция" title="Каталог бань" visible={visible} />
        <motion.p
          initial={false}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-[#B0B8C0] max-w-xl mx-auto mb-12"
        >
          Каждая баня — уникальный проект
        </motion.p>

        {/* Filter buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {CATALOG_FILTER_LABELS.map((type) => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`px-4 py-2 text-xs sm:text-sm tracking-[0.1em] uppercase font-semibold rounded-sm transition-all duration-300 ${
                activeFilter === type
                  ? 'bg-[#C68E4E] text-white'
                  : 'border border-[#444] text-[#A0AAB2] hover:border-[#C68E4E]/50 hover:text-[#C68E4E]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="wait">
            {filtered.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: 0.05 * idx }}
                className="group bg-[#242424] rounded-lg overflow-hidden border border-[#333333] hover:border-[#C68E4E]/40 transition-all duration-500 hover:shadow-[0_8px_40px_rgba(0,0,0,0.4)] cursor-pointer flex flex-col"
                onClick={() => {
                  if (item.projectSlug) {
                    onOpenProject(item.projectSlug)
                  } else {
                    setSelectedItem(item)
                  }
                }}
              >
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url('${item.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#242424] via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="inline-block px-2.5 py-1 text-[10px] tracking-[0.12em] uppercase font-bold bg-[#C68E4E] text-white">
                      {getTypeLabel(item.type)}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="text-xl font-bold text-[#C68E4E] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                      {item.price}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-white font-bold text-base tracking-[0.02em] uppercase mb-1.5 leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-[#8090A0] text-xs mb-3">{item.size}</p>
                  {item.description && (
                    <p className="text-[#909AA4] text-sm leading-relaxed mb-3 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {item.features.map((feature) => (
                      <span
                        key={feature}
                        className="text-[10px] tracking-[0.06em] uppercase text-[#B0B8C0] bg-[#1A1A1A] border border-[#3A3A3A] px-2 py-0.5 rounded-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto flex items-center justify-center gap-2 text-[#C68E4E] text-xs tracking-[0.1em] uppercase font-semibold group-hover:gap-3 transition-all duration-300">
                    Фото проекта
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Catalog Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <CatalogDetailModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onOpenProject={onOpenProject}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

/* ───────────────────────── CATALOG DETAIL MODAL ───────────────────────── */

function CatalogDetailModal({ item, onClose, onOpenProject }: { item: typeof CATALOG_ITEMS[0]; onClose: () => void; onOpenProject: (slug: string) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const normalize = (s: string) => s.toLowerCase().replace(/[^a-zа-яё0-9]/gi, '')
  const matchedProject = PROJECTS.find((p) => {
    const ni = normalize(item.name)
    const np = normalize(p.title)
    return ni.includes(np) || np.includes(ni) || (ni.split('x').length > 1 && np.split('x').length > 1 && ni.split('x')[0] === np.split('x')[0] && ni.split('x')[1] === np.split('x')[1])
  })

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    scrollRef.current?.scrollTo(0, 0)
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] bg-[#1A1A1A] overflow-y-auto"
      ref={scrollRef}
    >
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-[#1A1A1A]/95 backdrop-blur-md border-b border-[#333]/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-[#8090A0] hover:text-[#C68E4E] transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm tracking-[0.05em] uppercase">Назад к каталогу</span>
          </button>
          <span className="text-[#C68E4E] font-bold text-lg">{item.price}</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Large image */}
        <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-[#111] rounded-lg overflow-hidden border border-[#333] mb-10">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${item.image}')` }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left: description */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[2px] bg-[#C68E4E]" />
              <span className="inline-block px-2.5 py-1 text-[10px] tracking-[0.12em] uppercase font-bold bg-[#C68E4E] text-white">
                {getTypeLabel(item.type)}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-[0.03em] uppercase text-white mb-4">
              {item.name}
            </h1>
            <p className="text-[#8090A0] text-sm mb-6">{item.size}</p>
            <div className="w-16 h-[2px] bg-[#C68E4E] mb-6" />
            <p className="text-[#B0B8C0] leading-relaxed text-base lg:text-lg mb-8">
              {item.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {item.features.map((feature) => (
                <span
                  key={feature}
                  className="text-xs tracking-[0.06em] uppercase text-[#B0B8C0] bg-[#2A2A2A] border border-[#3A3A3A] px-3 py-1.5 rounded-sm"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Right: price card + CTA */}
          <div className="space-y-6">
            <div className="glass-card rounded-lg p-6">
              <div className="text-[#8090A0] text-xs tracking-[0.2em] uppercase font-semibold mb-2">
                Стоимость
              </div>
              <div className="text-[#C68E4E] text-3xl font-bold mb-4">{item.price}</div>
              <div className="space-y-3">
                <Button
                  className="w-full bg-[#C68E4E] hover:bg-[#B37D42] text-white font-bold tracking-[0.05em] uppercase text-sm rounded-sm h-11 transition-colors"
                  onClick={() => {
                    onClose()
                    setTimeout(() => openCalcDialog(item.name), 100)
                  }}
                >
                  Заказать
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <a
                  href="tel:+79048220007"
                  className="flex items-center justify-center gap-2 w-full py-3 border border-[#C68E4E]/40 hover:border-[#C68E4E] hover:bg-[#C68E4E]/10 text-[#C68E4E] font-bold tracking-[0.05em] uppercase text-sm rounded-sm transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Позвонить
                </a>
                {matchedProject && (
                  <button
                    onClick={() => { onClose(); onOpenProject(matchedProject.slug) }}
                    className="flex items-center justify-center gap-2 w-full py-3 border border-[#8090A0]/30 hover:border-[#8090A0] hover:bg-[#8090A0]/10 text-[#8090A0] hover:text-white font-semibold tracking-[0.05em] uppercase text-sm rounded-sm transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Смотреть проект ({matchedProject.gallery.length} фото)
                  </button>
                )}
              </div>
            </div>
            <div className="glass-card rounded-lg p-6">
              <h3 className="text-white font-bold text-sm tracking-[0.1em] uppercase mb-3">
                Почему ПАР ХАУС
              </h3>
              <ul className="space-y-2.5">
                {['Собственное производство в Омске', 'Кедровый мини брус', 'Комплектация под ключ', 'Доставка и монтаж'].map((txt) => (
                  <li key={txt} className="flex items-start gap-2.5 text-[#B0B8C0] text-sm">
                    <Star className="w-4 h-4 text-[#C68E4E] shrink-0 mt-0.5" />
                    {txt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="h-16" />
      </div>
    </motion.div>
  )
}

/* ───────────────────────── PROJECTS PAGE ───────────────────────── */

function ProjectsPage({ initialProjectSlug, onProjectOpened }: { initialProjectSlug: string | null; onProjectOpened: () => void }) {
  const { ref, visible } = useOnScreen(0.1)
  const [selectedProject, setSelectedProject] = useState<typeof PROJECTS[0] | null>(null)
  const [hasOpenedSlug, setHasOpenedSlug] = useState(false)

  // Adjust state when prop changes (React supports setState during render)
  if (initialProjectSlug && !hasOpenedSlug) {
    const p = PROJECTS.find((pr) => pr.slug === initialProjectSlug)
    if (p) {
      setSelectedProject(p)
      setHasOpenedSlug(true)
    }
  }

  // Notify parent that slug was consumed (calls parent setState, not local)
  useEffect(() => {
    if (hasOpenedSlug) {
      onProjectOpened()
    }
  }, [hasOpenedSlug, onProjectOpened])

  return (
    <div className="pt-28 pb-16">
      <div ref={ref} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading label="Портфолио" title="Наши проекты" visible={visible} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project, idx) => (
            <motion.div
              key={project.slug}
              initial={false}
              animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.06 * idx }}
              onClick={() => setSelectedProject(project)}
              className="group relative rounded-lg overflow-hidden h-72 sm:h-80 lg:h-96 border border-[#333] hover:border-[#C68E4E]/40 transition-all duration-500 cursor-pointer"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${project.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/50 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-14 h-14 rounded-full bg-[#C68E4E]/20 border border-[#C68E4E]/50 flex items-center justify-center">
                  <ArrowRight className="w-6 h-6 text-[#C68E4E]" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-block text-[#C68E4E] text-xs tracking-[0.2em] uppercase font-semibold px-2 py-0.5 bg-[#C68E4E]/10 border border-[#C68E4E]/20 rounded-sm">
                    {project.gallery.length} фото
                  </span>
                  <span className="text-[#C68E4E] font-bold text-sm">{project.price}</span>
                </div>
                <h3 className="text-white font-bold text-lg tracking-[0.02em] uppercase">
                  {project.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Project detail page overlay */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailPage
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

/* ───────────────────────── PROJECT DETAIL PAGE (KEEP EXISTING) ───────────────────────── */

function ProjectDetailPage({ project, onClose }: { project: typeof PROJECTS[0]; onClose: () => void }) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const gallery = project.gallery
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setCurrentIdx((i) => Math.min(i + 1, gallery.length - 1))
      if (e.key === 'ArrowLeft') setCurrentIdx((i) => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    scrollRef.current?.scrollTo(0, 0)
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [gallery.length, onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] bg-[#1A1A1A] overflow-y-auto"
      ref={scrollRef}
    >
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-[#1A1A1A]/95 backdrop-blur-md border-b border-[#333]/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-[#8090A0] hover:text-[#C68E4E] transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm tracking-[0.05em] uppercase">Назад к проектам</span>
          </button>
          <span className="text-[#C68E4E] font-bold text-lg">{project.price}</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Main image with gallery controls */}
        <div className="relative">
          <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-[#111] rounded-lg overflow-hidden border border-[#333]">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIdx}
                src={gallery[currentIdx]}
                alt={`${project.title} — фото ${currentIdx + 1}`}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 w-full h-full object-contain"
                loading="lazy"
                decoding="async"
              />
            </AnimatePresence>

            {/* Nav arrows */}
            {gallery.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentIdx((i) => (i === 0 ? gallery.length - 1 : i - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-black/60 hover:bg-[#C68E4E]/30 text-white/80 hover:text-white rounded-sm border border-white/10 hover:border-[#C68E4E]/50 transition-all"
                  aria-label="Предыдущее фото"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentIdx((i) => (i === gallery.length - 1 ? 0 : i + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-black/60 hover:bg-[#C68E4E]/30 text-white/80 hover:text-white rounded-sm border border-white/10 hover:border-[#C68E4E]/50 transition-all"
                  aria-label="Следующее фото"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Counter badge */}
            <div className="absolute bottom-3 right-3 bg-black/70 text-white/80 text-xs px-3 py-1.5 rounded-sm border border-white/10">
              {currentIdx + 1} / {gallery.length}
            </div>
          </div>

          {/* Thumbnails strip */}
          {gallery.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIdx(idx)}
                  className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded overflow-hidden border-2 transition-all ${
                    idx === currentIdx
                      ? 'border-[#C68E4E] opacity-100'
                      : 'border-[#333] opacity-50 hover:opacity-80'
                  }`}
                >
                  <img src={img} alt={`Миниатюра ${idx + 1}`} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Project info */}
        <div className="mt-10 lg:mt-14 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left: description */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[2px] bg-[#C68E4E]" />
              <span className="text-[#C68E4E] text-xs tracking-[0.3em] uppercase font-semibold">
                {project.year}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[0.03em] uppercase text-white mb-6">
              {project.title}
            </h1>
            <div className="w-16 h-[2px] bg-[#C68E4E] mb-6" />
            <p className="text-[#B0B8C0] leading-relaxed text-base lg:text-lg">
              {project.description}
            </p>
          </div>

          {/* Right: price card + CTA */}
          <div className="space-y-6">
            <div className="glass-card rounded-lg p-6">
              <div className="text-[#8090A0] text-xs tracking-[0.2em] uppercase font-semibold mb-2">
                Стоимость
              </div>
              <div className="text-[#C68E4E] text-3xl font-bold mb-4">{project.price}</div>
              <div className="space-y-3">
                <a
                  href="tel:+79048220007"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#C68E4E] hover:bg-[#B37D42] text-white font-bold tracking-[0.05em] uppercase text-sm rounded-sm transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Позвонить
                </a>
                <button
                  onClick={() => { onClose(); setTimeout(() => openCalcDialog(project.title), 350) }}
                  className="flex items-center justify-center gap-2 w-full py-3 border border-[#C68E4E]/40 hover:border-[#C68E4E] hover:bg-[#C68E4E]/10 text-[#C68E4E] font-bold tracking-[0.05em] uppercase text-sm rounded-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Оставить заявку
                </button>
              </div>
            </div>
            <div className="glass-card rounded-lg p-6">
              <h3 className="text-white font-bold text-sm tracking-[0.1em] uppercase mb-3">
                Почему ПАР ХАУС
              </h3>
              <ul className="space-y-2.5">
                {['Собственное производство в Омске', 'Кедровый мини брус', 'Комплектация под ключ', 'Доставка и монтаж'].map((txt) => (
                  <li key={txt} className="flex items-start gap-2.5 text-[#B0B8C0] text-sm">
                    <Star className="w-4 h-4 text-[#C68E4E] shrink-0 mt-0.5" />
                    {txt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom spacer */}
        <div className="h-16" />
      </div>
    </motion.div>
  )
}

/* ───────────────────────── ABOUT PAGE ───────────────────────── */

function AboutPage() {
  return (
    <div className="pt-28 pb-16">
      {/* About Hero */}
      <AboutHero />

      {/* Stats */}
      <AboutStats />

      {/* Materials */}
      <AboutMaterials />

      {/* Process Timeline */}
      <ProcessTimeline />

      {/* Values */}
      <AboutValues />
    </div>
  )
}

/* ─── About Hero ─── */
function AboutHero() {
  const { ref, visible } = useOnScreen(0.2)

  return (
    <section ref={ref} className="relative py-16 lg:py-24 bg-[#1A1A1A]">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={false}
            animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8 }}
            className="relative rounded-lg overflow-hidden h-[400px] lg:h-[500px] border-2 border-[#C68E4E]/20"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/hero-bg-sauna.png')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/60 to-transparent" />
            <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-[#C68E4E]/40" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-[#C68E4E]/40" />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={false}
            animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[2px] bg-[#C68E4E]" />
              <span className="text-[#C68E4E] text-xs tracking-[0.3em] uppercase font-semibold">
                О производстве
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-[0.02em] uppercase text-white mb-6">
              Традиции русского
              <br />
              <span className="text-[#C68E4E]">мастерства</span>
            </h2>
            <p className="text-[#B0B8C0] leading-relaxed mb-6">
              «ПАР ХАУС» — это современное производство мобильных бань, саун и дачных домиков в Омске. Каркасные и брусовые строения изготавливаются по новой технологии — работаем на качество, а не на количество.
            </p>
            <p className="text-[#B0B8C0] leading-relaxed">
              Используем только термически модифицированную древесину —
              термоясень, лиственницу и карельскую берёзу. Каждая деталь
              изготавливается на собственном производстве с контролем качества на
              каждом этапе.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ─── About Stats ─── */
function AboutStats() {
  const { ref, visible } = useOnScreen(0.2)
  const stat8 = useCountUp(8, 2000)
  const stat200 = useCountUp(200, 2000)
  const stat100 = useCountUp(100, 2000)
  const stat5 = useCountUp(5, 1500)

  const starts = [stat8.start, stat200.start, stat100.start, stat5.start] as const
  useEffect(() => {
    if (visible) starts.forEach((s) => s())
  }, [visible])

  const stats = [
    { count: stat8.count, suffix: '+', label: 'Лет опыта' },
    { count: stat200.count, suffix: '+', label: 'Проектов' },
    { count: stat100.count, suffix: '%', label: 'Натуральное' },
    { count: stat5.count, suffix: '', label: 'Лет гарантия' },
  ]

  return (
    <section ref={ref} className="relative py-16 lg:py-20 bg-[#222222]">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={false}
              animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.12 * idx }}
              className="text-center border-t-2 border-[#C68E4E]/30 pt-6"
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#C68E4E] mb-2">
                {stat.count}{stat.suffix}
              </div>
              <div className="text-[#8090A0] text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── About Materials ─── */
function AboutMaterials() {
  const { ref, visible } = useOnScreen(0.15)

  return (
    <section ref={ref} className="relative py-20 lg:py-28 bg-[#1A1A1A]">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading label="Материалы" title="Мы работаем с" visible={visible} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MATERIALS.map((material, idx) => (
            <motion.div
              key={material.name}
              initial={false}
              animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.15 * idx }}
              className="glass-card group rounded-lg p-6 lg:p-8 hover:border-[#C68E4E]/50 transition-all duration-500 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-full bg-[#C68E4E]/15 border border-[#C68E4E]/30 flex items-center justify-center mb-5">
                <TreePine className="w-6 h-6 text-[#C68E4E]" />
              </div>
              <h3 className="text-white font-bold text-base tracking-[0.04em] uppercase mb-3">
                {material.name}
              </h3>
              <p className="text-[#B0B8C0] text-sm leading-relaxed">
                {material.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── About Values ─── */
function AboutValues() {
  const { ref, visible } = useOnScreen(0.15)

  return (
    <section ref={ref} className="relative py-20 lg:py-28 bg-[#1A1A1A]">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading label="Ценности" title="Наши принципы" visible={visible} />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {VALUES.map((value, idx) => (
            <motion.div
              key={value.title}
              initial={false}
              animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.15 * idx }}
              className="glass-card rounded-lg p-6 lg:p-8 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-[#C68E4E]/15 border-2 border-[#C68E4E]/40 flex items-center justify-center mx-auto mb-5">
                <span className="text-[#C68E4E] text-xl font-bold">{idx + 1}</span>
              </div>
              <h3 className="text-white font-bold text-base tracking-[0.04em] uppercase mb-3">
                {value.title}
              </h3>
              <p className="text-[#B0B8C0] text-sm leading-relaxed">
                {value.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── CONTACTS PAGE ───────────────────────── */

function ContactsPage({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  const { ref, visible } = useOnScreen(0.1)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setMapLoaded(true)
        }
      },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div className="pt-28 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading label="Связаться с нами" title="Контакты" visible={visible} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact info */}
          <motion.div
            initial={false}
            animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Phone */}
            <div className="glass-card rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-sm bg-[#C68E4E]/15 border border-[#C68E4E]/30 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#C68E4E]" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm tracking-[0.1em] uppercase mb-1">Телефон</h3>
                  <a href="tel:+79048220007" className="text-[#C68E4E] text-xl font-semibold hover:underline underline-offset-4 decoration-[#C68E4E]/30">
                    +7 (904) 822-00-07
                  </a>
                  <p className="text-[#8090A0] text-sm mt-1">Звоните бесплатно, консультация по проекту</p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="glass-card rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-sm bg-[#C68E4E]/15 border border-[#C68E4E]/30 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#C68E4E]" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm tracking-[0.1em] uppercase mb-1">Адрес производства</h3>
                  <p className="text-[#D0D6DC] text-base">г. Омск, пос. Дружино,<br />ул. Тополиная, 31</p>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="glass-card rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-sm bg-[#C68E4E]/15 border border-[#C68E4E]/30 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-[#C68E4E]" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm tracking-[0.1em] uppercase mb-1">Режим работы</h3>
                  <p className="text-[#D0D6DC] text-base">Пн—Пт: 9:00 — 18:00<br />Сб: 10:00 — 16:00<br /><span className="text-[#C68E4E] font-medium">Вс: выходной</span></p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="glass-card rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-sm bg-[#C68E4E]/15 border border-[#C68E4E]/30 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[#C68E4E]" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm tracking-[0.1em] uppercase mb-1">Email</h3>
                  <a href="mailto:info@parhouse55.ru" className="text-[#C68E4E] text-base hover:underline underline-offset-4 decoration-[#C68E4E]/30">
                    info@parhouse55.ru
                  </a>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="https://vk.com/parhouse55"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card rounded-lg w-12 h-12 flex items-center justify-center hover:border-[#C68E4E]/50 transition-colors group"
                aria-label="VK"
              >
                <MessageCircle className="w-5 h-5 text-[#8090A0] group-hover:text-[#C68E4E] transition-colors" />
              </a>
              <a
                href="https://wa.me/79048220007"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card rounded-lg w-12 h-12 flex items-center justify-center hover:border-[#25D366]/50 transition-colors group"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5 text-[#8090A0] group-hover:text-[#25D366] transition-colors" />
              </a>
            </div>
          </motion.div>

          {/* Right: Contact Form + Map */}
          <motion.div
            initial={false}
            animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Contact Form */}
            <ContactForm onNavigate={onNavigate} />

            {/* Yandex Map */}
            <div
              ref={ref}
              className="rounded-lg overflow-hidden border-2 border-[#333] hover:border-[#C68E4E]/30 transition-colors duration-500 h-[300px] sm:h-[350px] lg:h-[400px]"
            >
              {mapLoaded && (
                <iframe
                  src="https://yandex.ru/map-widget/v1/?ll=73.3705%2C55.0971&z=13&text=%D0%9E%D0%BC%D1%81%D0%BA%2C%20%D0%94%D1%80%D1%83%D0%B6%D0%B8%D0%BD%D0%BE%2C%20%D0%A2%D0%BE%D0%BF%D0%BE%D0%BB%D0%B8%D0%BD%D0%B0%D1%8F%2031"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  title="Яндекс Карта — ПАР ХАУС"
                  sandbox="allow-scripts allow-same-origin allow-popups"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale hover:grayscale-0 transition-all duration-500"
                />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

/* ─── Отправка заявок на info@parhouse55.ru через Web3Forms ─── */
const FORM_ENDPOINT = 'https://api.web3forms.com/submit'
const WEB3FORMS_KEY = '14a1eaa5-9689-46ac-ba9e-7756a18a6eb4'

async function submitForm(fields: Record<string, string>): Promise<boolean> {
  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_key: WEB3FORMS_KEY, ...fields }),
    })
    return res.ok
  } catch {
    return false
  }
}

/* ─── Contact Form (Inline) ─── */
function ContactForm({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  const [formData, setFormData] = useState({ name: '', phone: '', message: '', consent: false })
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.consent) return
    setStatus('sending')
    const ok = await submitForm({ name: formData.name, phone: formData.phone, message: formData.message || '—', subject: `Заявка с сайта ПАР ХАУС от ${formData.name}` })
    setStatus(ok ? 'ok' : 'err')
    if (ok) {
      setTimeout(() => {
        setStatus('idle')
        setFormData({ name: '', phone: '', message: '', consent: false })
      }, 3000)
    } else {
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  if (status === 'ok') {
    return (
      <div className="glass-card rounded-lg p-10 text-center">
        <div className="w-16 h-16 rounded-full bg-[#C68E4E]/20 border-2 border-[#C68E4E]/50 flex items-center justify-center mx-auto mb-4">
          <Star className="w-8 h-8 text-[#C68E4E]" />
        </div>
        <p className="text-[#C68E4E] font-semibold text-lg mb-1">Сообщение отправлено!</p>
        <p className="text-[#8090A0] text-sm">Мы свяжемся с вами в ближайшее время</p>
      </div>
    )
  }
  if (status === 'err') {
    return (
      <div className="glass-card rounded-lg p-10 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500/50 flex items-center justify-center mx-auto mb-4">
          <X className="w-8 h-8 text-red-400" />
        </div>
        <p className="text-red-400 font-semibold text-lg mb-1">Ошибка отправки</p>
        <p className="text-[#8090A0] text-sm">Попробуйте ещё раз или позвоните нам</p>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-lg p-6 lg:p-8">
      <h3 className="text-white font-bold text-lg tracking-[0.05em] uppercase mb-6">Напишите нам</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="contact-name" className="text-[#B0B8C0] text-sm">Ваше имя</Label>
          <Input
            id="contact-name"
            required
            autoComplete="name"
            maxLength={50}
            value={formData.name}
            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
            placeholder="Иван Иванов"
            className="bg-[#2A2A2A] border-[#444] text-white placeholder:text-[#555] focus:border-[#C68E4E]/60 rounded-none"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-phone" className="text-[#B0B8C0] text-sm">Телефон</Label>
          <Input
            id="contact-phone"
            type="tel"
            required
            autoComplete="tel"
            pattern="[+]?[0-9\s\-()]{7,18}"
            value={formData.phone}
            onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
            placeholder="+7 (___) ___-__-__"
            className="bg-[#2A2A2A] border-[#444] text-white placeholder:text-[#555] focus:border-[#C68E4E]/60 rounded-none"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-message" className="text-[#B0B8C0] text-sm">Сообщение</Label>
          <Textarea
            id="contact-message"
            value={formData.message}
            onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
            placeholder="Опишите ваш вопрос..."
            rows={4}
            className="bg-[#2A2A2A] border-[#444] text-white placeholder:text-[#555] focus:border-[#C68E4E]/60 rounded-none resize-none"
          />
        </div>
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            required
            checked={formData.consent}
            onChange={(e) => setFormData((p) => ({ ...p, consent: e.target.checked }))}
            className="mt-1 accent-[#C68E4E] w-4 h-4 shrink-0"
          />
          <span className="text-[#8090A0] text-xs leading-relaxed">
            Нажимая кнопку, вы соглашаетесь с{' '}
            <button
              type="button"
              onClick={() => onNavigate('privacy')}
              className="text-[#C68E4E] underline underline-offset-2 hover:text-[#D4A762] transition-colors"
            >
              Политикой обработки персональных данных
            </button>
          </span>
        </label>
        <Button
          type="submit"
          disabled={!formData.consent || status === 'sending'}
          className="w-full bg-[#C68E4E] hover:bg-[#D4A762] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold tracking-[0.1em] uppercase text-sm h-12 rounded-none transition-all duration-300 hover:shadow-[0_0_30px_rgba(198,142,78,0.3)]"
        >
          {status === 'sending' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Отправить сообщение
              <Send className="ml-2 w-4 h-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  )
}

/* ───────────────────────── CALC DIALOG ───────────────────────── */

/** Module-level: stores project name for the next CalcDialog open */
let _calcProjectName = ''

/** Open CalcDialog, optionally pre-filling project context */
function openCalcDialog(projectName?: string) {
  _calcProjectName = projectName || ''
  document.getElementById('calc-dialog-trigger')?.click()
}

function CalcDialog({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  const [open, setOpen] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [formData, setFormData] = useState({ name: '', phone: '', message: '', consent: false })
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')

  // Sync module-level project name when dialog opens
  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (nextOpen) {
      setProjectName(_calcProjectName)
      _calcProjectName = '' // consume it
    } else {
      setStatus('idle')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.consent) return
    setStatus('sending')
    const subject = projectName
      ? `Заявка на проект «${projectName}» от ${formData.name}`
      : `Расчёт проекта — заявка от ${formData.name}`
    const payload: Record<string, string> = {
      name: formData.name,
      phone: formData.phone,
      message: formData.message || '—',
      subject,
    }
    if (projectName) {
      payload['Проект'] = projectName
    }
    const ok = await submitForm(payload)
    setStatus(ok ? 'ok' : 'err')
    if (ok) {
      setTimeout(() => {
        setOpen(false)
        setProjectName('')
        setFormData({ name: '', phone: '', message: '', consent: false })
      }, 2000)
    } else {
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  return (
    <>
      <button
        id="calc-dialog-trigger"
        onClick={() => setOpen(true)}
        className="sr-only"
        aria-label="Открыть форму расчёта"
      >
        trigger
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="bg-[#1E1E1E] border border-[#C68E4E]/20 text-white sm:max-w-lg rounded-lg shadow-[0_0_80px_rgba(198,142,78,0.1)]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-[0.05em] uppercase text-white">
              {projectName ? `Заявка на «${projectName}»` : 'Рассчитать проект'}
            </DialogTitle>
            <DialogDescription className="text-[#8090A0]">
              Оставьте заявку и мы перезвоним вам в течение 30 минут
            </DialogDescription>
          </DialogHeader>

          {status === 'ok' ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-[#C68E4E]/20 border-2 border-[#C68E4E]/50 flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-[#C68E4E]" />
              </div>
              <p className="text-[#C68E4E] font-semibold text-lg">Заявка отправлена!</p>
              <p className="text-[#8090A0] text-sm mt-1">
                Мы свяжемся с вами в ближайшее время
              </p>
            </div>
          ) : status === 'err' ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500/50 flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-400" />
              </div>
              <p className="text-red-400 font-semibold text-lg">Ошибка отправки</p>
              <p className="text-[#8090A0] text-sm mt-1">Попробуйте ещё раз или позвоните нам</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#B0B8C0] text-sm">Ваше имя</Label>
                <Input
                  id="name"
                  required
                  autoComplete="name"
                  maxLength={50}
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Иван Иванов"
                  className="bg-[#2A2A2A] border-[#444] text-white placeholder:text-[#555] focus:border-[#C68E4E]/60 rounded-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#B0B8C0] text-sm">Телефон</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  pattern="[+]?[0-9\s\-()]{7,18}"
                  value={formData.phone}
                  onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="+7 (___) ___-__-__"
                  className="bg-[#2A2A2A] border-[#444] text-white placeholder:text-[#555] focus:border-[#C68E4E]/60 rounded-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-[#B0B8C0] text-sm">Комментарий</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                  placeholder="Опишите вашу идею бани..."
                  rows={3}
                  className="bg-[#2A2A2A] border-[#444] text-white placeholder:text-[#555] focus:border-[#C68E4E]/60 rounded-none resize-none"
                />
              </div>
              {/* 152-ФЗ: согласие на обработку персональных данных */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  required
                  checked={formData.consent}
                  onChange={(e) => setFormData((p) => ({ ...p, consent: e.target.checked }))}
                  className="mt-1 accent-[#C68E4E] w-4 h-4 shrink-0"
                />
                <span className="text-[#8090A0] text-xs leading-relaxed">
                  Нажимая кнопку, вы соглашаетесь с{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      setOpen(false)
                      onNavigate('privacy')
                    }}
                    className="text-[#C68E4E] underline underline-offset-2 hover:text-[#D4A762] transition-colors"
                  >
                    Политикой обработки персональных данных
                  </button>
                </span>
              </label>
              <Button
                type="submit"
                disabled={!formData.consent || status === 'sending'}
                className="w-full bg-[#C68E4E] hover:bg-[#D4A762] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold tracking-[0.1em] uppercase text-sm h-12 rounded-none transition-all duration-300 hover:shadow-[0_0_30px_rgba(198,142,78,0.3)]"
              >
                {status === 'sending' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Отправить заявку
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

/* ───────────────────────── FOOTER ───────────────────────── */

function Footer({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  return (
    <footer className="relative border-t-2 border-[#C68E4E]/15 bg-[#141414] mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-5">
              <img
                src="/logo.webp"
                alt="ПАР ХАУС"
                loading="lazy"
                className="h-14 w-auto object-contain mix-blend-screen brightness-110 opacity-80"
              />
            </div>
            <p className="text-[#8090A0] text-sm leading-relaxed">
              Производство и монтаж бань и саун под ключ в Омске и Омской области.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[#C68E4E] font-bold text-xs tracking-[0.2em] uppercase mb-4">Навигация</h4>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.pageId}>
                  <button
                    onClick={() => onNavigate(link.pageId)}
                    className="text-[#909AA4] hover:text-[#C68E4E] text-sm transition-colors duration-300"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[#C68E4E] font-bold text-xs tracking-[0.2em] uppercase mb-4">Услуги</h4>
            <ul className="space-y-2.5">
              {['Бани под ключ', 'Сауны', 'Проектирование', 'Ремонт бань'].map((item) => (
                <li key={item}>
                  <span className="text-[#909AA4] text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="text-[#C68E4E] font-bold text-xs tracking-[0.2em] uppercase mb-4">Контакты</h4>
            <div className="space-y-3">
              <a
                href="tel:+79048220007"
                className="flex items-center gap-2 text-[#C68E4E] text-sm hover:underline underline-offset-4"
              >
                <Phone className="w-3.5 h-3.5" />
                +7 (904) 822-00-07
              </a>
              <div className="flex items-start gap-2 text-[#909AA4] text-sm">
                <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>г. Омск, пос. Дружино, ул. Тополиная, 31</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[#C68E4E]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#606870] text-xs tracking-wider">
            © {CURRENT_YEAR} ПАР ХАУС. Все права защищены.
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('privacy')}
              className="text-[#505860] hover:text-[#C68E4E] text-xs transition-colors"
            >
              Политика конфиденциальности
            </button>
            <span className="text-[#606870] text-xs">Производство бань и саун в Омске</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ───────────────────────── PRIVACY POLICY (152-ФЗ) ───────────────────────── */

function PrivacyPage({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  return (
    <div className="min-h-screen bg-[#141414] py-16">
      <div className="section-divider" />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => onNavigate('contacts')}
          className="flex items-center gap-2 text-[#C68E4E] hover:text-[#D4A762] transition-colors mb-8 text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Назад
        </button>
        <h2 className="text-2xl font-bold tracking-[0.05em] uppercase text-white mb-8">
          Политика обработки персональных данных
        </h2>
        <div className="space-y-4 text-[#8090A0] text-sm leading-relaxed">
          <p><strong className="text-[#B0B8C0]">1. Общие положения</strong></p>
          <p>
            Настоящая Политика обработки персональных данных составлена в соответствии
            с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных» и определяет
            порядок обработки персональных данных и меры по обеспечению безопасности
            персональных данных, предпринимаемые ИП (далее — Оператор).
          </p>
          <p><strong className="text-[#B0B8C0]">2. Основные понятия</strong></p>
          <p>
            <strong className="text-[#909AA4]">Персональные данные</strong> — любая информация, относящаяся к прямо или косвенно
            определённому или определяемому физическому лицу (субъекту персональных данных).
          </p>
          <p><strong className="text-[#B0B8C0]">3. Какие данные собираем</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>ФИО — при заполнении формы заявки</li>
            <li>Номер телефона — для обратной связи</li>
            <li>Комментарий — по желанию пользователя</li>
          </ul>
          <p><strong className="text-[#B0B8C0]">4. Цели обработки</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Обработка входящих заявок и обратная связь</li>
            <li>Консультирование по вопросам продукции и услуг</li>
            <li>Улучшение качества сервиса</li>
          </ul>
          <p><strong className="text-[#B0B8C0]">5. Правовые основания</strong></p>
          <p>
            Обработка персональных данных осуществляется на основании согласия субъекта
            персональных данных, выраженного путём отметки в форме обратной связи на сайте.
          </p>
          <p><strong className="text-[#B0B8C0]">6. Защита данных</strong></p>
          <p>
            Оператор принимает необходимые организационные и технические меры для защиты
            персональных данных от неправомерного или случайного доступа, уничтожения,
            изменения, блокирования, копирования, предоставления, распространения
            персональных данных, а также от иных неправомерных действий в отношении
            персональных данных третьих лиц.
          </p>
          <p><strong className="text-[#B0B8C0]">7. Сроки хранения</strong></p>
          <p>
            Персональные данные хранятся не более 3 лет с момента последнего обращения
            субъекта, после чего уничтожаются.
          </p>
          <p><strong className="text-[#B0B8C0]">8. Контакты</strong></p>
          <p>
            По всем вопросам, связанным с обработкой персональных данных, обращайтесь:{' '}
            <a href="tel:+79048220007" className="text-[#C68E4E] hover:underline">+7 (904) 822-00-07</a>
            {' '}или{' '}
            <a href="mailto:info@parhouse55.ru" className="text-[#C68E4E] hover:underline">info@parhouse55.ru</a>
          </p>
          <p className="text-[#505860] text-xs mt-6">Дата последнего обновления: {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────── MAIN PAGE ───────────────────────── */

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageId>('home')
  const [openProjectSlug, setOpenProjectSlug] = useState<string | null>(null)
  const mainRef = useRef<HTMLDivElement>(null)

  // Dismiss inline preloader once React hydrates
  useEffect(() => {
    const el = document.getElementById('preloader')
    if (!el) return
    el.style.opacity = '0'
    el.style.visibility = 'hidden'
    setTimeout(() => el.remove(), 700)
  }, [])

  const handleNavigate = useCallback((page: PageId) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-[#1A1A1A]">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Scroll progress bar (visible on home page) */}
      {currentPage === 'home' && <ScrollProgressBar mainRef={mainRef} />}

      <main className="flex-1" ref={mainRef}>
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div
              key="home"
              variants={pageVariants}
              initial={false}
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >
              <HomePage onNavigate={handleNavigate} />
            </motion.div>
          )}

          {currentPage === 'catalog' && (
            <motion.div
              key="catalog"
              variants={pageVariants}
              initial={false}
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >
              <CatalogPage onNavigate={handleNavigate} onOpenProject={(slug) => { setOpenProjectSlug(slug); handleNavigate('projects') }} />
            </motion.div>
          )}

          {currentPage === 'projects' && (
            <motion.div
              key="projects"
              variants={pageVariants}
              initial={false}
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >
              <ProjectsPage initialProjectSlug={openProjectSlug} onProjectOpened={() => setOpenProjectSlug(null)} />
            </motion.div>
          )}

          {currentPage === 'about' && (
            <motion.div
              key="about"
              variants={pageVariants}
              initial={false}
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >
              <AboutPage />
            </motion.div>
          )}

          {currentPage === 'contacts' && (
            <motion.div
              key="contacts"
              variants={pageVariants}
              initial={false}
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >
              <ContactsPage onNavigate={handleNavigate} />
            </motion.div>
          )}

          {currentPage === 'privacy' && (
            <motion.div
              key="privacy"
              variants={pageVariants}
              initial={false}
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >
              <PrivacyPage onNavigate={handleNavigate} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer onNavigate={handleNavigate} />
      <CalcDialog onNavigate={handleNavigate} />

      {/* Global floating elements */}
      <BackToTop />
    </div>
  )
}
