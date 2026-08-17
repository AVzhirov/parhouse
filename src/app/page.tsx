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
          ? 'glass py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-sm bg-ph-gold/20 border border-ph-gold/40 flex items-center justify-center group-hover:bg-ph-gold/30 transition-colors">
            <span className="text-ph-gold font-bold text-lg leading-none">П</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-base tracking-[0.2em] uppercase leading-none">
              Пар Хаус
            </span>
            <span className="text-ph-silver/60 text-[10px] tracking-[0.15em] uppercase mt-0.5">
              Production
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-ph-silver hover:text-ph-gold text-sm tracking-[0.15em] uppercase transition-colors duration-300 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-ph-gold transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-4">
          <a
            href="tel:+79048220007"
            className="hidden sm:flex items-center gap-2 text-ph-silver hover:text-ph-gold transition-colors duration-300"
          >
            <Phone className="w-4 h-4" />
            <span className="text-sm font-medium">+7 (904) 822-00-07</span>
          </a>
          <a
            href="#catalog"
            className="relative p-2 text-ph-silver hover:text-ph-gold transition-colors duration-300"
          >
            <ShoppingBag className="w-5 h-5" />
          </a>
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-ph-silver hover:text-ph-gold transition-colors"
            aria-label="Меню"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
                  className="text-ph-silver hover:text-ph-gold text-sm tracking-[0.15em] uppercase transition-colors py-2"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="tel:+79048220007"
                className="flex items-center gap-2 text-ph-gold text-sm font-medium pt-2 border-t border-white/10"
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
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: bgY }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-bg-wood.png')" }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/70 via-[#1A1A1A]/50 to-[#1A1A1A]" />
        {/* Light beam effects */}
        <div className="light-beam top-0 left-[15%] w-[2px] h-[70%]" />
        <div className="light-beam top-0 left-[45%] w-[1px] h-[50%] opacity-50" />
        <div className="light-beam top-0 right-[20%] w-[1.5px] h-[60%] opacity-30" />
      </motion.div>

      {/* Vapor particles */}
      <div className="absolute bottom-0 left-0 right-0 h-64 z-[1] pointer-events-none">
        <div
          className="vapor-particle absolute bottom-0 left-[10%] w-48 h-48 rounded-full bg-ph-gold/5 blur-3xl"
          style={{ animationDelay: '0s' }}
        />
        <div
          className="vapor-particle absolute bottom-0 left-[40%] w-64 h-64 rounded-full bg-ph-gold/3 blur-3xl"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="vapor-particle absolute bottom-0 right-[15%] w-56 h-56 rounded-full bg-ph-gold/4 blur-3xl"
          style={{ animationDelay: '4s' }}
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-12 h-px bg-ph-gold" />
            <span className="text-ph-gold text-xs sm:text-sm tracking-[0.3em] uppercase font-medium">
              Производство бань и саун
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gold-glow"
          >
            <span className="block text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-black tracking-[0.08em] uppercase text-white leading-[0.9]">
              ПАР
            </span>
            <span className="block text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-black tracking-[0.08em] uppercase text-ph-gold leading-[0.9] mt-1">
              ХАУС
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 text-lg sm:text-xl lg:text-2xl text-ph-silver/90 max-w-2xl leading-relaxed font-light"
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
              className="bg-ph-gold hover:bg-ph-gold-hover text-white font-semibold tracking-[0.1em] uppercase text-sm px-8 py-6 h-auto rounded-none transition-all duration-300 hover:shadow-[0_0_30px_rgba(198,142,78,0.3)]"
              onClick={() => document.getElementById('calc-dialog-trigger')?.click()}
            >
              Рассчитать проект
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-ph-gold/40 hover:border-ph-gold hover:bg-ph-gold/10 text-ph-gold font-semibold tracking-[0.1em] uppercase text-sm px-8 py-6 h-auto rounded-none transition-all duration-300"
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
        <span className="text-ph-silver/40 text-[10px] tracking-[0.3em] uppercase">
          Scroll
        </span>
        <div className="scroll-indicator">
          <ChevronDown className="w-5 h-5 text-ph-gold/60" />
        </div>
      </motion.div>
    </section>
  )
}

/* ─── ADVANTAGES ─── */
function AdvantagesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="relative py-24 lg:py-32 overflow-hidden">
      {/* Subtle background from hero */}
      <div className="absolute inset-0 bg-cover bg-center bg-fixed opacity-20" style={{ backgroundImage: "url('/hero-bg-wood.png')" }} />
      <div className="absolute inset-0 bg-[#1A1A1A]/90" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="w-8 h-px bg-ph-gold" />
            <span className="text-ph-gold text-xs tracking-[0.3em] uppercase">
              Почему мы
            </span>
            <div className="w-8 h-px bg-ph-gold" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[0.05em] uppercase text-white"
          >
            Преимущества
          </motion.h2>
        </div>

        {/* Glassmorphism cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ADVANTAGES.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 * idx }}
              className="glass-light group rounded-lg p-6 lg:p-8 hover:border-ph-gold/20 transition-all duration-500 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-sm bg-ph-gold/10 border border-ph-gold/20 flex items-center justify-center mb-6 group-hover:bg-ph-gold/20 transition-colors duration-300">
                <item.icon className="w-7 h-7 text-ph-gold" />
              </div>
              <h3 className="text-white font-bold text-base tracking-[0.05em] uppercase mb-3">
                {item.title}
              </h3>
              <p className="text-ph-silver/70 text-sm leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── CATALOG ─── */
function CatalogSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} id="catalog" className="relative py-24 lg:py-32 bg-[#1A1A1A]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="w-8 h-px bg-ph-gold" />
            <span className="text-ph-gold text-xs tracking-[0.3em] uppercase">
              Продукция
            </span>
            <div className="w-8 h-px bg-ph-gold" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[0.05em] uppercase text-white"
          >
            Каталог бань
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-ph-silver/60 max-w-xl mx-auto"
          >
            Каждая баня — уникальный проект, созданный с учётом ваших пожеланий и особенностей участка
          </motion.p>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CATALOG_ITEMS.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * idx }}
              className="group glass-light rounded-lg overflow-hidden hover:border-ph-gold/20 transition-all duration-500"
            >
              <div className="relative h-56 sm:h-64 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${item.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="inline-block px-3 py-1 text-[10px] tracking-[0.2em] uppercase font-medium bg-ph-gold/90 text-white rounded-sm">
                    {item.type}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4">
                  <span className="text-2xl font-bold text-ph-gold">
                    {item.price}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-white font-bold text-lg tracking-[0.03em] uppercase mb-2">
                  {item.name}
                </h3>
                <p className="text-ph-silver/50 text-sm mb-4">Размер: {item.size}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {item.features.map((feature) => (
                    <span
                      key={feature}
                      className="text-[11px] tracking-[0.1em] uppercase text-ph-silver/70 border border-white/10 px-2.5 py-1 rounded-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full border-ph-gold/30 hover:border-ph-gold hover:bg-ph-gold/10 text-ph-gold text-xs tracking-[0.15em] uppercase rounded-none h-10 transition-all duration-300"
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
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} id="projects" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-fixed opacity-10" style={{ backgroundImage: "url('/hero-bg-sauna.png')" }} />
      <div className="absolute inset-0 bg-[#1A1A1A]/95" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="w-8 h-px bg-ph-gold" />
            <span className="text-ph-gold text-xs tracking-[0.3em] uppercase">
              Портфолио
            </span>
            <div className="w-8 h-px bg-ph-gold" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[0.05em] uppercase text-white"
          >
            Наши проекты
          </motion.h2>
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PROJECTS.map((project, idx) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 * idx }}
              className="group relative rounded-lg overflow-hidden h-80 sm:h-96"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${project.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="text-ph-gold text-xs tracking-[0.2em] uppercase mb-2 block">
                  {project.year}
                </span>
                <h3 className="text-white font-bold text-lg tracking-[0.03em] uppercase mb-2">
                  {project.title}
                </h3>
                <p className="text-ph-silver/60 text-sm">
                  {project.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── ABOUT ─── */
function AboutSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} id="about" className="relative py-24 lg:py-32 bg-[#1A1A1A]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative rounded-lg overflow-hidden h-[400px] lg:h-[500px]"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/hero-bg-sauna.png')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/50 to-transparent" />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-ph-gold" />
              <span className="text-ph-gold text-xs tracking-[0.3em] uppercase">
                О производстве
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-[0.03em] uppercase text-white mb-6">
              Традиции русского
              <br />
              <span className="text-ph-gold">мастерства</span>
            </h2>
            <p className="text-ph-silver/70 leading-relaxed mb-6">
              «ПАР ХАУС» — это современное производство бань и саун в Омске. Мы
              объединяем вековые традиции русского банного дела с передовыми
              инженерными решениями и технологиями обработки дерева.
            </p>
            <p className="text-ph-silver/70 leading-relaxed mb-8">
              Используем только термически модифицированную древесину —
              термоясень, лиственницу и карельскую берёзу. Каждая деталь
              изготавливается на собственном производстве с контролем качества на
              каждом этапе.
            </p>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold text-ph-gold mb-1">8+</div>
                <div className="text-ph-silver/50 text-sm">Лет опыта</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-ph-gold mb-1">200+</div>
                <div className="text-ph-silver/50 text-sm">Проектов</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-ph-gold mb-1">100%</div>
                <div className="text-ph-silver/50 text-sm">Натуральное</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ─── CONTACTS ─── */
function ContactsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          setMapLoaded(true)
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} id="contacts" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-fixed opacity-10" style={{ backgroundImage: "url('/hero-bg-wood.png')" }} />
      <div className="absolute inset-0 bg-[#1A1A1A]/95" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="w-8 h-px bg-ph-gold" />
            <span className="text-ph-gold text-xs tracking-[0.3em] uppercase">
              Связаться с нами
            </span>
            <div className="w-8 h-px bg-ph-gold" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[0.05em] uppercase text-white"
          >
            Контакты
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Phone */}
            <div className="glass-light rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-sm bg-ph-gold/10 border border-ph-gold/20 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-ph-gold" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm tracking-[0.1em] uppercase mb-1">
                    Телефон
                  </h3>
                  <a
                    href="tel:+79048220007"
                    className="text-ph-gold text-xl font-semibold hover:underline decoration-ph-gold/30"
                  >
                    +7 (904) 822-00-07
                  </a>
                  <p className="text-ph-silver/50 text-sm mt-1">
                    Звоните бесплатно, консультация по проекту
                  </p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="glass-light rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-sm bg-ph-gold/10 border border-ph-gold/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-ph-gold" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm tracking-[0.1em] uppercase mb-1">
                    Адрес производства
                  </h3>
                  <p className="text-ph-silver/80 text-base">
                    г. Омск, пос. Дружино,
                    <br />
                    ул. Тополиная, 31
                  </p>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="glass-light rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-sm bg-ph-gold/10 border border-ph-gold/20 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-ph-gold" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm tracking-[0.1em] uppercase mb-1">
                    Режим работы
                  </h3>
                  <p className="text-ph-silver/80 text-base">
                    Пн—Пт: 9:00 — 18:00
                    <br />
                    Сб: 10:00 — 16:00
                    <br />
                    Вс: выходной
                  </p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="glass-light rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-sm bg-ph-gold/10 border border-ph-gold/20 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-ph-gold" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm tracking-[0.1em] uppercase mb-1">
                    Email
                  </h3>
                  <a
                    href="mailto:info@parhouse55.ru"
                    className="text-ph-gold text-base hover:underline decoration-ph-gold/30"
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
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="rounded-lg overflow-hidden h-full min-h-[400px] lg:min-h-0 border border-white/10"
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
      {/* Hidden trigger for programmatic click */}
      <button
        id="calc-dialog-trigger"
        onClick={() => setOpen(true)}
        className="sr-only"
        aria-label="Открыть форму расчёта"
      >
        trigger
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#1A1A1A] border border-white/10 text-white sm:max-w-lg rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-[0.05em] uppercase">
              Рассчитать проект
            </DialogTitle>
            <DialogDescription className="text-ph-silver/60">
              Оставьте заявку и мы перезвоним вам в течение 30 минут
            </DialogDescription>
          </DialogHeader>

          {submitted ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-ph-gold/20 border border-ph-gold/40 flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-ph-gold" />
              </div>
              <p className="text-ph-gold font-semibold text-lg">Заявка отправлена!</p>
              <p className="text-ph-silver/50 text-sm mt-1">
                Мы свяжемся с вами в ближайшее время
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-ph-silver text-sm">
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
                  className="bg-white/5 border-white/10 text-white placeholder:text-ph-silver/30 focus:border-ph-gold/50 rounded-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-ph-silver text-sm">
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
                  className="bg-white/5 border-white/10 text-white placeholder:text-ph-silver/30 focus:border-ph-gold/50 rounded-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-ph-silver text-sm">
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
                  className="bg-white/5 border-white/10 text-white placeholder:text-ph-silver/30 focus:border-ph-gold/50 rounded-none resize-none"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-ph-gold hover:bg-ph-gold-hover text-white font-semibold tracking-[0.1em] uppercase text-sm h-12 rounded-none transition-all duration-300 hover:shadow-[0_0_30px_rgba(198,142,78,0.3)]"
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
    <footer className="relative border-t border-white/5 bg-[#111111]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-sm bg-ph-gold/20 border border-ph-gold/40 flex items-center justify-center">
                <span className="text-ph-gold font-bold text-sm leading-none">
                  П
                </span>
              </div>
              <span className="text-white font-bold text-sm tracking-[0.2em] uppercase">
                Пар Хаус
              </span>
            </div>
            <p className="text-ph-silver/50 text-sm leading-relaxed">
              Производство и монтаж бань и саун под ключ в Омске и Омской области.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-[0.2em] uppercase mb-4">
              Навигация
            </h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-ph-silver/50 hover:text-ph-gold text-sm transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-[0.2em] uppercase mb-4">
              Услуги
            </h4>
            <ul className="space-y-2">
              {['Бани под ключ', 'Сауны', 'Проектирование', 'Ремонт бань'].map(
                (item) => (
                  <li key={item}>
                    <span className="text-ph-silver/50 text-sm">{item}</span>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-[0.2em] uppercase mb-4">
              Контакты
            </h4>
            <div className="space-y-3">
              <a
                href="tel:+79048220007"
                className="flex items-center gap-2 text-ph-gold text-sm hover:underline"
              >
                <Phone className="w-3.5 h-3.5" />
                +7 (904) 822-00-07
              </a>
              <div className="flex items-start gap-2 text-ph-silver/50 text-sm">
                <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>
                  г. Омск, пос. Дружино, ул. Тополиная, 31
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-ph-silver/30 text-xs tracking-wider">
            © {new Date().getFullYear()} ПАР ХАУС. Все права защищены.
          </p>
          <p className="text-ph-silver/20 text-xs">
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