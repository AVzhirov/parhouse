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
  MapPin,
  Clock,
  Mail,
  Menu,
  X,
  ArrowRight,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
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

/* ───────────────────────── DATA ───────────────────────── */

const NAV_LINKS = [
  { label: 'Каталог', href: '#catalog' },
  { label: 'Проекты', href: '#projects' },
  { label: 'О производстве', href: '#about' },
  { label: 'Контакты', href: '#contacts' },
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

const CATALOG_ITEMS = [
  {
    id: 1,
    name: 'Баня «Карельская»',
    type: 'Барельефная',
    price: 'от 650 000 ₽',
    size: '4×6 м',
    image: '/hero-bg-sauna.png',
    features: ['Термоясень', 'Печь-каменка', 'Терраса', 'Комната отдыха'],
  },
  {
    id: 2,
    name: 'Баня «Сибирская»',
    type: 'Брусчатая',
    price: 'от 520 000 ₽',
    size: '3×5 м',
    image: '/sauna-barrel.png',
    features: ['Профилированный брус', 'Парная + помывочная', 'Веранда'],
  },
  {
    id: 3,
    name: 'Баня «Имперская»',
    type: 'Рубленая',
    price: 'от 1 200 000 ₽',
    size: '6×8 м',
    image: '/hero-bg-wood.png',
    features: ['Цельный лес', 'Бассейн', 'Бильярдная', 'Терраса 2 этаж'],
  },
  {
    id: 4,
    name: 'Баня «Мини»',
    type: 'Компактная',
    price: 'от 380 000 ₽',
    size: '2.5×3.5 м',
    image: '/hero-bg-wood.png',
    features: ['Термодерево', 'Печь Harvia', 'Минималистичный дизайн'],
  },
]

const PROJECTS = [
  {
    title: 'Баня в пос. Дружино',
    description: 'Проект бани «Карельская» с панорамным остеклением и террасой',
    image: '/hero-bg-sauna.png',
    year: '2024',
  },
  {
    title: 'Сауна в д. Новоомская',
    description: 'Компактная сауна с внутренним оформлением из термодерева',
    image: '/hero-bg-wood.png',
    year: '2024',
  },
  {
    title: 'Баня-барельеф в Омске',
    description: 'Флагманский проект с комнатой отдыха второго уровня',
    image: '/sauna-barrel.png',
    year: '2023',
  },
]

/* ───────────────────────── SHARED HOOK ───────────────────────── */

function useOnScreen(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

/* ───────────────────────── SECTION HEADING ───────────────────────── */

function SectionHeading({ label, title, visible, delay = 0 }: { label: string; title: string; visible: boolean; delay?: number }) {
  return (
    <div className="text-center mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
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
        initial={{ opacity: 0, y: 20 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: delay + 0.1 }}
        className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[0.04em] uppercase text-white"
      >
        {title}
      </motion.h2>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={visible ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, delay: delay + 0.25 }}
        className="mt-5 mx-auto w-20 h-[2px] bg-[#C68E4E] origin-center"
      />
    </div>
  )
}

/* ───────────────────────── COMPONENTS ───────────────────────── */

function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass py-3 shadow-[0_2px_20px_rgba(0,0,0,0.6)]'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center group">
          <img
            src="/logo.png"
            alt="ПАР ХАУС — Производство бань и саун"
            className="h-11 sm:h-13 w-auto object-contain mix-blend-screen brightness-110"
          />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[#C0C8D0] hover:text-[#C68E4E] text-sm tracking-[0.15em] uppercase transition-colors duration-300 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#C68E4E] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
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
          <a
            href="#catalog"
            className="relative p-2 text-[#C0C8D0] hover:text-[#C68E4E] transition-colors duration-300"
          >
            <ShoppingBag className="w-5 h-5" />
          </a>
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
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-[#C0C8D0] hover:text-[#C68E4E] text-sm tracking-[0.15em] uppercase transition-colors py-2"
                >
                  {link.label}
                </a>
              ))}
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

/* ─── HERO ─── */
function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* Background image with parallax */}
      <motion.div className="absolute inset-0 z-0" style={{ y: bgY }}>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: "url('/hero-bg-wood.png')" }}
        />
        {/* Lighter overlay so the wood texture is visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/50 via-[#1A1A1A]/30 to-[#1A1A1A]" />
        {/* Side vignettes for drama */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#1A1A1A_100%)]" />
        {/* Light beams */}
        <div className="light-beam top-0 left-[15%] w-[3px] h-[70%]" />
        <div className="light-beam top-0 left-[45%] w-[2px] h-[50%] opacity-70" />
        <div className="light-beam top-0 right-[20%] w-[2px] h-[60%] opacity-50" />
      </motion.div>

      {/* Vapor particles */}
      <div className="absolute bottom-0 left-0 right-0 h-64 z-[1] pointer-events-none">
        <div
          className="vapor-particle absolute bottom-0 left-[10%] w-48 h-48 rounded-full bg-[#C68E4E]/8 blur-3xl"
          style={{ animationDelay: '0s' }}
        />
        <div
          className="vapor-particle absolute bottom-0 left-[40%] w-64 h-64 rounded-full bg-[#C68E4E]/5 blur-3xl"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="vapor-particle absolute bottom-0 right-[15%] w-56 h-56 rounded-full bg-[#C68E4E]/6 blur-3xl"
          style={{ animationDelay: '4s' }}
        />
      </div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-24"
      >
        <div className="max-w-4xl">
          {/* Logo in hero */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mb-8"
          >
            <img
              src="/logo.png"
              alt="ПАР ХАУС"
              className="h-24 sm:h-32 lg:h-40 w-auto object-contain mix-blend-screen brightness-110 drop-shadow-[0_0_60px_rgba(198,142,78,0.3)]"
            />
          </motion.div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
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
            initial={{ opacity: 0, y: 20 }}
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <Button
              size="lg"
              className="bg-[#C68E4E] hover:bg-[#D4A762] text-white font-semibold tracking-[0.1em] uppercase text-sm px-8 py-6 h-auto rounded-none transition-all duration-300 hover:shadow-[0_0_40px_rgba(198,142,78,0.4)]"
              onClick={() => document.getElementById('calc-dialog-trigger')?.click()}
            >
              Рассчитать проект
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-[#C68E4E]/50 hover:border-[#C68E4E] hover:bg-[#C68E4E]/10 text-[#C68E4E] font-semibold tracking-[0.1em] uppercase text-sm px-8 py-6 h-auto rounded-none transition-all duration-300"
              onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Смотреть каталог
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
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

/* ─── ADVANTAGES ─── */
function AdvantagesSection() {
  const { ref, visible } = useOnScreen(0.2)

  return (
    <section ref={ref} className="relative py-24 lg:py-32 bg-[#222222]">
      {/* Top gold divider line */}
      <div className="section-divider absolute top-0 left-0 right-0" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading label="Почему мы" title="Преимущества" visible={visible} />

        {/* Glassmorphism cards with strong borders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ADVANTAGES.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
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

      {/* Bottom gold divider line */}
      <div className="section-divider absolute bottom-0 left-0 right-0" />
    </section>
  )
}

/* ─── CATALOG ─── */
function CatalogSection() {
  const { ref, visible } = useOnScreen(0.1)

  return (
    <section ref={ref} id="catalog" className="relative py-24 lg:py-32 bg-[#1A1A1A]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Продукция"
          title="Каталог бань"
          visible={visible}
        />
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-[#B0B8C0] max-w-xl mx-auto mb-12"
        >
          Каждая баня — уникальный проект, созданный с учётом ваших пожеланий и особенностей участка
        </motion.p>

        {/* Product grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CATALOG_ITEMS.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * idx }}
              className="group bg-[#242424] rounded-lg overflow-hidden border border-[#333333] hover:border-[#C68E4E]/40 transition-all duration-500 hover:shadow-[0_8px_40px_rgba(0,0,0,0.4)]"
            >
              <div className="relative h-56 sm:h-64 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${item.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#242424] via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="inline-block px-3 py-1.5 text-[11px] tracking-[0.15em] uppercase font-bold bg-[#C68E4E] text-white">
                    {item.type}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4">
                  <span className="text-2xl font-bold text-[#C68E4E] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    {item.price}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-white font-bold text-lg tracking-[0.02em] uppercase mb-2">
                  {item.name}
                </h3>
                <p className="text-[#8090A0] text-sm mb-4">Размер: {item.size}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {item.features.map((feature) => (
                    <span
                      key={feature}
                      className="text-[11px] tracking-[0.08em] uppercase text-[#B0B8C0] bg-[#1A1A1A] border border-[#3A3A3A] px-2.5 py-1 rounded-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full border-[#C68E4E]/40 hover:border-[#C68E4E] hover:bg-[#C68E4E]/10 text-[#C68E4E] text-xs tracking-[0.15em] uppercase rounded-none h-10 transition-all duration-300"
                  onClick={() => document.getElementById('calc-dialog-trigger')?.click()}
                >
                  Заказать
                  <ArrowRight className="ml-2 w-3.5 h-3.5" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── PROJECTS ─── */
function ProjectsSection() {
  const { ref, visible } = useOnScreen(0.1)

  return (
    <section ref={ref} id="projects" className="relative py-24 lg:py-32 bg-[#222222]">
      <div className="section-divider absolute top-0 left-0 right-0" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading label="Портфолио" title="Наши проекты" visible={visible} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PROJECTS.map((project, idx) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 * idx }}
              className="group relative rounded-lg overflow-hidden h-80 sm:h-96 border border-[#333] hover:border-[#C68E4E]/40 transition-all duration-500"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${project.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="inline-block text-[#C68E4E] text-xs tracking-[0.2em] uppercase font-semibold mb-2 px-2 py-0.5 bg-[#C68E4E]/10 border border-[#C68E4E]/20 rounded-sm">
                  {project.year}
                </span>
                <h3 className="text-white font-bold text-lg tracking-[0.02em] uppercase mb-2">
                  {project.title}
                </h3>
                <p className="text-[#C0C8D0] text-sm">
                  {project.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="section-divider absolute bottom-0 left-0 right-0" />
    </section>
  )
}

/* ─── ABOUT ─── */
function AboutSection() {
  const { ref, visible } = useOnScreen(0.2)

  return (
    <section ref={ref} id="about" className="relative py-24 lg:py-32 bg-[#1A1A1A]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative rounded-lg overflow-hidden h-[400px] lg:h-[500px] border-2 border-[#C68E4E]/20"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/hero-bg-sauna.png')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/60 to-transparent" />
            {/* Gold accent corner */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-[#C68E4E]/40" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-[#C68E4E]/40" />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
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
              «ПАР ХАУС» — это современное производство бань и саун в Омске. Мы
              объединяем вековые традиции русского банного дела с передовыми
              инженерными решениями и технологиями обработки дерева.
            </p>
            <p className="text-[#B0B8C0] leading-relaxed mb-8">
              Используем только термически модифицированную древесину —
              термоясень, лиственницу и карельскую берёзу. Каждая деталь
              изготавливается на собственном производстве с контролем качества на
              каждом этапе.
            </p>
            <div className="grid grid-cols-3 gap-6">
              {[
                { num: '8+', label: 'Лет опыта' },
                { num: '200+', label: 'Проектов' },
                { num: '100%', label: 'Натуральное' },
              ].map((stat) => (
                <div key={stat.label} className="border-t-2 border-[#C68E4E]/30 pt-4">
                  <div className="text-3xl font-bold text-[#C68E4E] mb-1">{stat.num}</div>
                  <div className="text-[#8090A0] text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ─── CONTACTS ─── */
function ContactsSection() {
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
    <section ref={ref} id="contacts" className="relative py-24 lg:py-32 bg-[#222222]">
      <div className="section-divider absolute top-0 left-0 right-0" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading label="Связаться с нами" title="Контакты" visible={visible} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
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
                  <h3 className="text-white font-bold text-sm tracking-[0.1em] uppercase mb-1">
                    Телефон
                  </h3>
                  <a
                    href="tel:+79048220007"
                    className="text-[#C68E4E] text-xl font-semibold hover:underline underline-offset-4 decoration-[#C68E4E]/30"
                  >
                    +7 (904) 822-00-07
                  </a>
                  <p className="text-[#8090A0] text-sm mt-1">
                    Звоните бесплатно, консультация по проекту
                  </p>
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
                  <h3 className="text-white font-bold text-sm tracking-[0.1em] uppercase mb-1">
                    Адрес производства
                  </h3>
                  <p className="text-[#D0D6DC] text-base">
                    г. Омск, пос. Дружино,
                    <br />
                    ул. Тополиная, 31
                  </p>
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
                  <h3 className="text-white font-bold text-sm tracking-[0.1em] uppercase mb-1">
                    Режим работы
                  </h3>
                  <p className="text-[#D0D6DC] text-base">
                    Пн—Пт: 9:00 — 18:00
                    <br />
                    Сб: 10:00 — 16:00
                    <br />
                    <span className="text-[#C68E4E] font-medium">Вс: выходной</span>
                  </p>
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
                  <h3 className="text-white font-bold text-sm tracking-[0.1em] uppercase mb-1">
                    Email
                  </h3>
                  <a
                    href="mailto:info@parhouse55.ru"
                    className="text-[#C68E4E] text-base hover:underline underline-offset-4 decoration-[#C68E4E]/30"
                  >
                    info@parhouse55.ru
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Yandex Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="rounded-lg overflow-hidden h-full min-h-[400px] lg:min-h-0 border-2 border-[#333] hover:border-[#C68E4E]/30 transition-colors duration-500"
          >
            {mapLoaded && (
              <iframe
                src="https://yandex.ru/map-widget/v1/?ll=73.3705%2C55.0971&z=13&text=%D0%9E%D0%BC%D1%81%D0%BA%2C%20%D0%94%D1%80%D1%83%D0%B6%D0%B8%D0%BD%D0%BE%2C%20%D0%A2%D0%BE%D0%BF%D0%BE%D0%BB%D0%B8%D0%BD%D0%B0%D1%8F%2031"
                width="100%"
                height="100%"
                style={{ minHeight: '400px' }}
                frameBorder="0"
                title="Яндекс Карта — ПАР ХАУС"
                className="grayscale hover:grayscale-0 transition-all duration-500"
              />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ─── CALC DIALOG ─── */
function CalcDialog() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      setSubmitted(true)
      setTimeout(() => {
        setOpen(false)
        setSubmitted(false)
        setFormData({ name: '', phone: '', message: '' })
      }, 2000)
    },
    []
  )

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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#1E1E1E] border border-[#C68E4E]/20 text-white sm:max-w-lg rounded-lg shadow-[0_0_80px_rgba(198,142,78,0.1)]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-[0.05em] uppercase text-white">
              Рассчитать проект
            </DialogTitle>
            <DialogDescription className="text-[#8090A0]">
              Оставьте заявку и мы перезвоним вам в течение 30 минут
            </DialogDescription>
          </DialogHeader>

          {submitted ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-[#C68E4E]/20 border-2 border-[#C68E4E]/50 flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-[#C68E4E]" />
              </div>
              <p className="text-[#C68E4E] font-semibold text-lg">Заявка отправлена!</p>
              <p className="text-[#8090A0] text-sm mt-1">
                Мы свяжемся с вами в ближайшее время
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#B0B8C0] text-sm">
                  Ваше имя
                </Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Иван Иванов"
                  className="bg-[#2A2A2A] border-[#444] text-white placeholder:text-[#555] focus:border-[#C68E4E]/60 rounded-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#B0B8C0] text-sm">
                  Телефон
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, phone: e.target.value }))
                  }
                  placeholder="+7 (___) ___-__-__"
                  className="bg-[#2A2A2A] border-[#444] text-white placeholder:text-[#555] focus:border-[#C68E4E]/60 rounded-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-[#B0B8C0] text-sm">
                  Комментарий
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, message: e.target.value }))
                  }
                  placeholder="Опишите вашу идею бани..."
                  rows={3}
                  className="bg-[#2A2A2A] border-[#444] text-white placeholder:text-[#555] focus:border-[#C68E4E]/60 rounded-none resize-none"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#C68E4E] hover:bg-[#D4A762] text-white font-semibold tracking-[0.1em] uppercase text-sm h-12 rounded-none transition-all duration-300 hover:shadow-[0_0_30px_rgba(198,142,78,0.3)]"
              >
                Отправить заявку
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

/* ─── FOOTER ─── */
function Footer() {
  return (
    <footer className="relative border-t-2 border-[#C68E4E]/15 bg-[#141414]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="sm:col-span-2 lg:col-span-1">
          <div className="mb-5">
            <img
              src="/logo.png"
              alt="ПАР ХАУС"
              className="h-14 w-auto object-contain mix-blend-screen brightness-110 opacity-80"
            />
          </div>
            <p className="text-[#8090A0] text-sm leading-relaxed">
              Производство и монтаж бань и саун под ключ в Омске и Омской области.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[#C68E4E] font-bold text-xs tracking-[0.2em] uppercase mb-4">
              Навигация
            </h4>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-[#909AA4] hover:text-[#C68E4E] text-sm transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[#C68E4E] font-bold text-xs tracking-[0.2em] uppercase mb-4">
              Услуги
            </h4>
            <ul className="space-y-2.5">
              {['Бани под ключ', 'Сауны', 'Проектирование', 'Ремонт бань'].map(
                (item) => (
                  <li key={item}>
                    <span className="text-[#909AA4] text-sm">{item}</span>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="text-[#C68E4E] font-bold text-xs tracking-[0.2em] uppercase mb-4">
              Контакты
            </h4>
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
            © {new Date().getFullYear()} ПАР ХАУС. Все права защищены.
          </p>
          <p className="text-[#505860] text-xs">
            Производство бань и саун в Омске
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ───────────────────────── MAIN PAGE ───────────────────────── */

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#1A1A1A]">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <AdvantagesSection />
        <CatalogSection />
        <ProjectsSection />
        <AboutSection />
        <ContactsSection />
      </main>
      <Footer />
      <CalcDialog />
    </div>
  )
}