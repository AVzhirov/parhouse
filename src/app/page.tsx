'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
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
  MessageCircle,
  TreePine,
  Ruler,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CATALOG_ITEMS, PROJECTS, CATALOG_FILTER_LABELS, getTypeLabel, CATALOG_TYPE_LABELS, type CatalogItem, type Project } from '@/data/products'

/* ───────────────────────── LIVE DATA FROM products.json ─────────────────────────
   Бухгалтер редактирует public/products.json на GitHub.
   Сайт загружает его при первом визите и обновляет данные без пересборки.
   Если файл недоступен — используются значения из products.ts по умолчанию.
   ──────────────────────────────────────────────────────────────────────────── */

let liveCatalog: CatalogItem[] = CATALOG_ITEMS
let liveProjects: Project[] = PROJECTS
let liveFilterLabels: string[] = [...CATALOG_FILTER_LABELS]
let liveTypeLabels: Record<string, string> = { ...CATALOG_TYPE_LABELS }

let _productsLoaded = false

function loadProductsData() {
  if (_productsLoaded || typeof window === 'undefined') return
  _productsLoaded = true
  fetch('/products.json')
    .then(r => {
      if (!r.ok) throw new Error('fetch failed')
      return r.json()
    })
    .then(data => {
      if (!data || typeof data !== 'object') return
      if (data.типы_товаров && typeof data.типы_товаров === 'object') {
        liveTypeLabels = data.типы_товаров
      }
      if (Array.isArray(data.каталог)) {
        liveCatalog = data.каталог
          .filter((item: Record<string, unknown>) =>
            item && typeof item === 'object' && typeof item.название === 'string'
          )
          .map((item: Record<string, unknown>, idx: number) => ({
            id: idx + 1,
            name: String(item.название),
            type: typeof item.тип === 'string' ? item.тип : 'banya',
            price: typeof item.цена === 'string' ? item.цена : '',
            size: typeof item.размер === 'string' ? item.размер : '',
            image: typeof item.фото === 'string' ? item.фото : '',
            description: typeof item.описание === 'string' ? item.описание : '',
            features: Array.isArray(item.преимущества) ? item.преимущества.filter((f: unknown) => typeof f === 'string') : [],
            projectSlug: typeof item.проект === 'string' ? item.проект : undefined,
            video: typeof item.видео === 'string' ? item.видео : undefined,
          }))
      }
      if (Array.isArray(data.проекты)) {
        liveProjects = data.проекты
          .filter((p: Record<string, unknown>) =>
            p && typeof p === 'object' && typeof p.код === 'string'
          )
          .map((p: Record<string, unknown>) => ({
            slug: String(p.код),
            title: typeof p.название === 'string' ? p.название : '',
            description: typeof p.описание === 'string' ? p.описание : '',
            image: typeof p.главное_фото === 'string' ? p.главное_фото : '',
            year: 'n',
            price: typeof p.цена === 'string' ? p.цена : '',
            gallery: Array.isArray(p.галерея) ? p.галерея.filter((g: unknown) => typeof g === 'string') : [],
          }))
      }
      liveFilterLabels = ['Все', ...Object.values(liveTypeLabels)]
      window.dispatchEvent(new Event('data-updated'))
    })
    .catch(() => {})
}

/** Хук: компонент перерисовывается когда products.json загрузился */
function useLiveVersion() {
  const [, setV] = useState(0)
  useEffect(() => {
    const h = () => setV(x => x + 1)
    window.addEventListener('data-updated', h)
    return () => window.removeEventListener('data-updated', h)
  }, [])
}

function getTypeLabelLive(key: string): string {
  return liveTypeLabels[key] ?? key
}

/* ───────────────────────── JSON-LD STRUCTURED DATA ───────────────────────── */

const JSONLD_ATTR = 'data-parhouse-jsonld'

function injectJsonLd() {
  if (typeof document === 'undefined') return
  // Remove previously injected JSON-LD to avoid duplicates on re-renders
  document.head.querySelectorAll(`script[${JSONLD_ATTR}]`).forEach(el => el.remove())

  // ItemList with Products (LocalBusiness already in layout.tsx)
  const baseUrl = 'https://parhouse55.ru'
  const productList = liveCatalog.map((item, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    item: {
      '@type': 'Product',
      name: item.name ?? '',
      description: item.description ?? '',
      image: (item.image && item.image.startsWith('http')) ? item.image : baseUrl + (item.image || ''),
      price: item.price ?? '',
      brand: { '@type': 'Brand', name: 'ПАР ХАУС' },
    },
  }))

  const itemList: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Каталог бань и саун ПАР ХАУС',
    numberOfItems: productList.length,
    itemListElement: productList,
  }

  const ilScript = document.createElement('script')
  ilScript.type = 'application/ld+json'
  ilScript.setAttribute(JSONLD_ATTR, 'itemlist')
  ilScript.textContent = JSON.stringify(itemList)
  document.head.appendChild(ilScript)
}

const CURRENT_YEAR = new Date().getFullYear()

/* ───────────────────────── TYPES ───────────────────────── */

type PageId = 'home' | 'catalog' | 'projects' | 'about' | 'contacts' | 'privacy'

/* ───────────────────────── DATA ───────────────────────── */

const NAV_LINKS: { label: string; pageId: PageId }[] = [
  { label: 'Главная', pageId: 'home' },
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
    title: 'Гарантия 1 год',
    description: 'На все конструкции и инженерные системы предоставляем гарантию',
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
  { name: 'Игорь П.', text: 'Ставили баню с тёплым полом на участке в Черлаке. Тёплый пол реально меняет всё — заходишь после парной и не мёрзнешь. Жена в восторге.', rating: 5, location: 'Черлак' },
  { name: 'Елена М.', text: 'Выбрала ПАР ХАУС потому что у них реально своё производство, а не перекупы. Видела цех, видела материал — всё честно. Дачный домик собран на совесть.', rating: 5, location: 'Омск' },
  { name: 'Сергей Т.', text: 'Заказывали мобильный офис для торговли на трассе. За месяц окупился. Тёплый зимой, не продувается. Хорошие ребята, сделали быстро.', rating: 5, location: 'Тюкалинск' },
  { name: 'Ольга Р.', text: 'Дети не выходят из домика! Собрали за 2 дня, всё аккуратно, без щелей, покрасили в цвет который мы хотели. Лучший подарок для детей.', rating: 5, location: 'Омск' },
  { name: 'Виктор Н.', text: 'Баня 3,9×2,15 из кедра — запах стоит невероятный. Монтажники работали чисто, убрали за собой. Три месяца пользуемся, никаких нареканий.', rating: 5, location: 'Калачинск' },
  { name: 'Анна Д.', text: 'Пятая баня, которую мы ставим на свои базы отдыха. Всегда одни и те же ребята из ПАР ХАУС — надёжные, сроки соблюдают, цена договорённая.', rating: 5, location: 'Омская область' },
]

const FAQ_DATA = [
  { q: 'Сколько стоит баня под ключ?', a: 'Стоимость зависит от размеров и комплектации. Базовые модели начинаются от 320 000 ₽. Точную стоимость рассчитаем после консультации — это бесплатно.' },
  { q: 'Какой срок изготовления?', a: 'Стандартный срок производства — 2-4 недели в зависимости от сложности проекта. Монтаж на участке занимает 1-3 дня.' },
  { q: 'Какую древесину вы используете?', a: 'Работаем с термически модифицированной древесиной: лиственницу, липу и сосну. Также используем кедровый мини брус.' },
  { q: 'Есть ли доставка и монтаж?', a: 'Да, осуществляем доставку по Омску и Омской области. Монтаж выполняют наши специалисты с соблюдением всех технологических норм.' },
  { q: 'Какая гарантия на продукцию?', a: 'Предоставляем гарантию 1 год на все конструкции и инженерные системы. Также даём рекомендации по уходу.' },
  { q: 'Можно ли заказать индивидуальный проект?', a: 'Конечно! Разработаем 3D-проект с учётом всех ваших пожеланий и особенностей участка. Проектирование включено в стоимость.' },
]

const PROCESS_STEPS = [
  { num: '01', icon: Phone, title: 'Звонок', desc: 'Позвоните нам или напишите в мессенджер' },
  { num: '02', icon: Ruler, title: 'Проектирование', desc: 'Разработаем 3D-проект с учётом ваших пожеланий' },
  { num: '03', icon: Factory, title: 'Производство', desc: 'Изготовим на нашем заводе в Омске за 2-4 недели' },
  { num: '04', icon: Wrench, title: 'Монтаж', desc: 'Доставим и установим на вашем участке' },
]

const MATERIALS = [
  { name: 'Лиственница', desc: 'Природная долговечность, высокая плотность, устойчивость к влаге и деформации' },
  { name: 'Липа', desc: 'Низкая теплопроводность, гипоаллергенна, идеальна для парных и лежанок' },
  { name: 'Сосна', desc: 'Лёгкая, прочная, с выраженным ароматом — отлично подходит для каркасных конструкций' },
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

/* ───────────────────────── FADE IN SECTION ───────────────────────── */

function FadeInSection({ children, delay = 0, className = '', onClick }: { children: React.ReactNode; delay?: number; className?: string; onClick?: () => void }) {
  const { ref, visible } = useOnScreen(0.15)

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
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

/* ───────────────────────── BREADCRUMBS ───────────────────────── */

const PAGE_NAMES: Record<PageId, string> = {
  home: 'Главная',
  catalog: 'Каталог',
  projects: 'Проекты',
  about: 'О компании',
  contacts: 'Контакты',
  privacy: 'Политика конфиденциальности',
}

function Breadcrumbs({ pageId }: { pageId: PageId }) {
  if (pageId === 'home') return null
  return (
    <nav aria-label="Хлебные крошки" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      <ol className="flex items-center gap-2 text-sm text-[#8090A0]" itemScope itemType="https://schema.org/BreadcrumbList">
        <li className="flex items-center gap-2" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
          <a href="/" itemProp="item" className="hover:text-[#C68E4E] transition-colors">
            <span itemProp="name">Главная</span>
          </a>
          <meta itemProp="position" content="1" />
          <ChevronRight className="w-3.5 h-3.5 text-[#505860]" />
        </li>
        <li className="flex items-center gap-2" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
          <span itemProp="name" className="text-[#C68E4E]">{PAGE_NAMES[pageId]}</span>
          <meta itemProp="position" content="2" />
        </li>
      </ol>
    </nav>
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
            className="h-18 sm:h-20 w-auto object-contain"
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
          <div className="lg:hidden" key="mobile-menu">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 z-[55]"
              onClick={() => setMobileOpen(false)}
            />
            {/* Slide-in panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-[#1A1A1A] z-[56] overflow-y-auto shadow-[-4px_0_40px_rgba(0,0,0,0.6)]"
            >
              <div className="flex justify-end p-4">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-[#C0C8D0] hover:text-[#C68E4E] transition-colors"
                  aria-label="Закрыть меню"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex flex-col px-6 pb-8 gap-1">
                {NAV_LINKS.map((link, idx) => {
                  const isActive = currentPage === link.pageId
                  return (
                    <motion.button
                      key={link.pageId}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 * idx + 0.1 }}
                      onClick={() => handleNav(link.pageId)}
                      className={`text-sm tracking-[0.15em] uppercase transition-colors py-3 text-left border-b border-[#333]/30 ${
                        isActive
                          ? 'text-[#C68E4E]'
                          : 'text-[#C0C8D0] hover:text-[#C68E4E]'
                      }`}
                    >
                      {link.label}
                    </motion.button>
                  )
                })}
                <motion.a
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * NAV_LINKS.length + 0.15 }}
                  href="tel:+79048220007"
                  className="flex items-center gap-2 text-[#C68E4E] text-sm font-medium pt-4 mt-2 border-t border-[#C68E4E]/20"
                >
                  <Phone className="w-4 h-4" />
                  +7 (904) 822-00-07
                </motion.a>
              </nav>
            </motion.div>
          </div>
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


/* ───────────────────────── FLOATING CALL BUTTON ───────────────────────── */

function FloatingCallButton() {
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const check = () => setModalOpen(document.body.style.overflow === 'hidden')
    const observer = new MutationObserver(check)
    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] })
    check()
    return () => observer.disconnect()
  }, [])

  return (
    <AnimatePresence>
      {!modalOpen && (
        <motion.a
          href="tel:+79048220007"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-40 sm:bottom-36 right-5 z-[90] flex items-center gap-2 bg-[#C68E4E] hover:bg-[#D4A762] text-white font-semibold tracking-[0.08em] uppercase text-xs sm:text-sm px-4 sm:px-5 py-3 sm:py-3.5 rounded-lg shadow-[0_4px_20px_rgba(198,142,78,0.4)] hover:shadow-[0_4px_30px_rgba(198,142,78,0.6)] transition-colors duration-300"
          aria-label="Позвонить"
        >
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex items-center justify-center"
          >
            <Phone className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          </motion.span>
          <span className="hidden sm:inline">Позвонить</span>
        </motion.a>
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
      {/* Background image + grain */}
      <div className="absolute inset-0 z-0 noise-overlay">
        <img
          src="/hero-bg.webp"
          alt="ПАР ХАУС — интерьер бани из кедра"
          className="absolute inset-0 w-full h-full object-cover scale-105"
          fetchPriority="high"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/70 via-[#1A1A1A]/50 to-[#1A1A1A]" />
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
        <div className="max-w-5xl">
          {/* Tagline */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-14 h-[2px] bg-[#C68E4E]" />
            <span className="text-[#C68E4E] text-xs sm:text-sm tracking-[0.3em] uppercase font-semibold">
              Производство бань и саун
            </span>
          </motion.div>

          {/* Big headline with word reveal */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-[0.03em] uppercase leading-[1.1] mb-8" style={{ perspective: '600px' }}>
            {['Бани,', 'которые', 'дышат'].map((word, i) => (
              <span key={i}>
                <span className={`word-reveal ${i === 2 ? 'text-[#C68E4E] text-gold-glow' : 'text-white'}`} style={{ animationDelay: `${0.5 + i * 0.15}s` }}>
                  {word}
                </span>
                {i < 2 && ' '}
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="text-base sm:text-lg lg:text-xl text-[#B0B8C0] max-w-2xl leading-relaxed"
          >
            Инженерные решения для русского пара. Собственное производство в Омске, монтаж под ключ.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <a
              href="tel:+79048220007"
              className="inline-flex items-center justify-center gap-2 bg-[#C68E4E] hover:bg-[#D4A762] text-white font-semibold tracking-[0.1em] uppercase text-sm px-8 py-6 h-auto rounded-none transition-all duration-300 hover:shadow-[0_0_40px_rgba(198,142,78,0.4)]"
            >
              <Phone className="w-4 h-4" />
              Позвонить
            </a>
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

/* ────────────────────── HOME PAGE ────────────────────── */

function HomePage({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  /* ── stats bar hooks ── */
  const statsRef = useRef<HTMLDivElement>(null)
  const [statsVisible, setStatsVisible] = useState(true)
  const s8 = useCountUp(8, 2000)
  const s200 = useCountUp(200, 2000)
  const s100 = useCountUp(100, 2000)
  const s1 = useCountUp(1, 1000)

  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsVisible(true) },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (statsVisible) {
      s8.start()
      s200.start()
      s100.start()
      s1.start()
    }
  }, [statsVisible])

  const statsItems = [
    { val: s8.count, suf: '+', label: 'Лет опыта' },
    { val: s200.count, suf: '+', label: 'Проектов выполнено' },
    { val: s100.count, suf: '%', label: 'Натуральные материалы' },
    { val: s1.count, suf: '', label: 'Год гарантии' },
  ]

  return (
    <>
      <HeroSection onNavigate={onNavigate} />

      {/* Animated stats bar */}
      <section ref={statsRef} className="relative bg-[#1A1A1A] border-y border-[#C68E4E]/15">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {statsItems.map((it, idx) => (
              <FadeInSection key={it.label} delay={0.1 * idx}>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-[#C68E4E] tabular-nums">
                    {it.val}{it.suf}
                  </div>
                  <div className="text-[#8090A0] text-xs sm:text-sm mt-1 tracking-wide">
                    {it.label}
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

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
  useLiveVersion()
  const { ref, visible } = useOnScreen(0.1)
  const featured = liveProjects.slice(0, 5)

  return (
    <section ref={ref} className="relative py-20 lg:py-28 bg-[#1A1A1A]">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading label="Портфолио" title="Избранные проекты" visible={visible} />

        {/* Responsive grid — all cards fully visible */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((project, idx) => (
            <FadeInSection
              key={project.slug}
              delay={0.1 * idx}
              className="group relative rounded-lg overflow-hidden h-72 sm:h-80 lg:h-[380px] border border-[#333] hover:border-[#C68E4E]/40 transition-all duration-500 cursor-pointer"
              onClick={() => onNavigate('projects')}
            >
              <img
                loading="lazy"
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/40 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-14 h-14 rounded-full bg-[#C68E4E]/20 border border-[#C68E4E]/50 flex items-center justify-center">
                  <ArrowRight className="w-6 h-6 text-[#C68E4E]" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-block text-[#C68E4E] text-xs tracking-[0.2em] uppercase font-semibold px-2 py-0.5 bg-[#C68E4E]/10 border border-[#C68E4E]/20 rounded-sm">
                    {project.gallery.includes(project.image) ? project.gallery.length : project.gallery.length + 1} фото
                  </span>
                  <span className="text-[#C68E4E] font-bold text-sm">{project.price}</span>
                </div>
                <h3 className="text-white font-bold text-lg tracking-[0.02em] uppercase">
                  {project.title}
                </h3>
              </div>
            </FadeInSection>
          ))}
        </div>

        <motion.div
          initial={false}
          animate={visible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 text-center"
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
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isPausedRef = useRef(false)

  const CARDS_PER_VIEW = 3
  const CARDS_PER_SLIDE = 1
  const AUTO_SCROLL_MS = 4000

  const updateArrows = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 2)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2)
  }, [])

  const scrollBy = useCallback((direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const card = el.firstElementChild as HTMLElement | null
    if (!card) return
    const gap = 24 // gap-6 = 24px
    const cardW = card.offsetWidth
    const step = (cardW + gap) * CARDS_PER_SLIDE
    el.scrollBy({ left: direction === 'left' ? -step : step, behavior: 'smooth' })
  }, [])

  // Auto-scroll
  useEffect(() => {
    if (!visible) return
    autoScrollRef.current = setInterval(() => {
      if (isPausedRef.current) return
      const el = scrollRef.current
      if (!el) return
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 2) {
        el.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        scrollBy('right')
      }
    }, AUTO_SCROLL_MS)
    return () => { if (autoScrollRef.current) clearInterval(autoScrollRef.current) }
  }, [visible, scrollBy])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateArrows()
    el.addEventListener('scroll', updateArrows, { passive: true })
    window.addEventListener('resize', updateArrows)
    return () => {
      el.removeEventListener('scroll', updateArrows)
      window.removeEventListener('resize', updateArrows)
    }
  }, [updateArrows])

  return (
    <section ref={ref} className="relative py-20 lg:py-28 bg-[#222222]">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading label="Отзывы" title="Наши клиенты" visible={visible} />

        <div className="relative group/reviews">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#222222] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#222222] to-transparent z-10 pointer-events-none" />

          {/* Arrow left */}
          {canScrollLeft && (
            <button
              onClick={() => { isPausedRef.current = true; scrollBy('left') }}
              onMouseLeave={() => { isPausedRef.current = false }}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-[#1A1A1A]/90 border border-[#C68E4E]/30 hover:border-[#C68E4E]/60 text-[#C68E4E] rounded-sm transition-all hover:bg-[#C68E4E]/10"
              aria-label="Предыдущий отзыв"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Arrow right */}
          {canScrollRight && (
            <button
              onClick={() => { isPausedRef.current = true; scrollBy('right') }}
              onMouseLeave={() => { isPausedRef.current = false }}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-[#1A1A1A]/90 border border-[#C68E4E]/30 hover:border-[#C68E4E]/60 text-[#C68E4E] rounded-sm transition-all hover:bg-[#C68E4E]/10"
              aria-label="Следующий отзыв"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Scrollable track */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6"
            onMouseEnter={() => { isPausedRef.current = true }}
            onMouseLeave={() => { isPausedRef.current = false }}
          >
            {REVIEWS.map((review, idx) => (
              <motion.div
                key={review.name}
                initial={false}
                animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.08 * idx }}
                className="glass-card rounded-lg p-6 lg:p-8 shrink-0 w-[320px] sm:w-[340px] lg:w-[360px] snap-start"
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
              <FadeInSection key={idx} delay={0.08 * idx}>
                <div className="glass-card rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 lg:p-6 text-left group"
                  >
                    <span className={`text-sm font-semibold tracking-[0.02em] transition-colors duration-300 ${isOpen ? 'text-[#C68E4E]' : 'text-white group-hover:text-[#D0D6DC]'}`}>
                      {item.q}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="shrink-0 ml-4 w-8 h-8 rounded-full bg-[#C68E4E]/10 border border-[#C68E4E]/30 flex items-center justify-center"
                    >
                      <ChevronDown className="w-4 h-4 text-[#C68E4E]" />
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
                </div>
              </FadeInSection>
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

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={false}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="relative rounded-lg p-[1px] animated-border"
        >
          <div className="bg-[#1A1A1A]/95 backdrop-blur rounded-[7px] p-10 sm:p-14 lg:p-16 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[0.04em] uppercase text-white mb-6">
              Готовы построить
              <br />
              <span className="text-[#C68E4E] text-gold-glow">баню мечты?</span>
            </h2>
            <p className="text-[#B0B8C0] text-base lg:text-lg max-w-xl mx-auto mb-10">
              Свяжитесь с нами для бесплатного расчёта проекта
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+79048220007"
                className="inline-flex items-center justify-center gap-2 border border-[#C68E4E]/50 hover:border-[#C68E4E] hover:bg-[#C68E4E]/10 text-[#C68E4E] font-semibold tracking-[0.1em] uppercase text-sm px-8 py-6 h-auto rounded-none transition-all duration-300"
              >
                <Phone className="w-4 h-4" />
                Позвонить
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ───────────────────────── CATALOG PAGE ───────────────────────── */

function CatalogPage({ onNavigate, onOpenProject }: { onNavigate: (page: PageId) => void; onOpenProject: (slug: string) => void }) {
  useLiveVersion()
  const { ref, visible } = useOnScreen(0.1)
  const [activeFilter, setActiveFilter] = useState('Все')
  const [selectedItem, setSelectedItem] = useState<typeof CATALOG_ITEMS[0] | null>(null)

  const filtered = activeFilter === 'Все'
    ? liveCatalog
    : liveCatalog.filter((item) => getTypeLabelLive(item.type) === activeFilter)

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
          {liveFilterLabels.map((type) => (
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
        <FadeInSection>
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
                  setSelectedItem(item)
                }}
              >
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <img
                    loading="lazy"
                    src={item.image}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#242424] via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="inline-block px-2.5 py-1 text-[10px] tracking-[0.12em] uppercase font-bold bg-[#C68E4E] text-white">
                      {getTypeLabelLive(item.type)}
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
        </FadeInSection>
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

/* ───────────────────────── VK VIDEO PLAYER ───────────────────────── */

function VkVideoPlayer({ url }: { url: string }) {
  const embedUrl = useMemo(() => {
    // vkvideo.ru/video-OWNER_ID_ID  или  vk.com/video-OWNER_ID_ID
    const m = url.match(/(?:video|clip)(-?\d+)_(\d+)/)
    if (!m) return url
    return `https://vk.com/video_ext.php?oid=${m[1]}&id=${m[2]}&hd=2`
  }, [url])

  const [visible, setVisible] = useState(false)

  if (!visible) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="absolute inset-0 w-full h-full flex items-center justify-center gap-3 bg-[#111] hover:bg-[#1A1A1A] transition-colors group cursor-pointer"
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#C68E4E]/20 border-2 border-[#C68E4E] flex items-center justify-center group-hover:bg-[#C68E4E]/30 group-hover:scale-110 transition-all duration-300">
          <svg className="w-7 h-7 sm:w-8 sm:h-8 text-[#C68E4E] ml-1" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <span className="text-[#8090A0] text-sm tracking-[0.05em] uppercase group-hover:text-[#C68E4E] transition-colors">
          Смотреть видео
        </span>
      </button>
    )
  }

  return (
    <iframe
      src={embedUrl}
      width="100%"
      height="100%"
      allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
      frameBorder="0"
      sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
      referrerPolicy="no-referrer-when-downgrade"
      className="absolute inset-0 w-full h-full"
      allowFullScreen
    />
  )
}

/* ───────────────────────── CATALOG DETAIL MODAL ───────────────────────── */

function CatalogDetailModal({ item, onClose, onOpenProject }: { item: typeof CATALOG_ITEMS[0]; onClose: () => void; onOpenProject: (slug: string) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const normalize = (s: string) => s.toLowerCase().replace(/[^a-zа-яё0-9]/gi, '')
  const matchedProject = item.projectSlug
    ? liveProjects.find((p) => p.slug === item.projectSlug)
    : liveProjects.find((p) => {
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
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Video */}
        {item.video && (
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[2px] bg-[#C68E4E]" />
              <span className="text-xs tracking-[0.12em] uppercase font-bold text-[#C68E4E]">Видео</span>
            </div>
            <div className="relative aspect-video bg-[#111] rounded-lg overflow-hidden border border-[#333]">
              <VkVideoPlayer url={item.video} />
            </div>
          </div>
        )}

        {/* Project gallery */}
        {matchedProject && (() => {
          const galleryFiltered = matchedProject.gallery.filter(g => g !== item.image)
          if (galleryFiltered.length === 0) return null
          return (
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[2px] bg-[#C68E4E]" />
              <span className="text-xs tracking-[0.12em] uppercase font-bold text-[#C68E4E]">
                Фото проекта ({galleryFiltered.length})
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {galleryFiltered.map((img, idx) => (
                <div key={idx} className="relative aspect-[4/3] bg-[#111] rounded-lg overflow-hidden border border-[#333] hover:border-[#C68E4E]/40 transition-colors duration-300">
                  <img
                    src={img}
                    alt={`${item.name} — фото ${idx + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          )
        })()}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left: description */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[2px] bg-[#C68E4E]" />
              <span className="inline-block px-2.5 py-1 text-[10px] tracking-[0.12em] uppercase font-bold bg-[#C68E4E] text-white">
                {getTypeLabelLive(item.type)}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-[0.03em] uppercase text-white mb-4">
              {item.name}
            </h2>
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
                <a
                  href="tel:+79048220007"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#C68E4E] hover:bg-[#B37D42] text-white font-bold tracking-[0.05em] uppercase text-sm rounded-sm transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Позвонить
                </a>
                <a
                  href="mailto:parhouse_55@mail.ru"
                  className="flex items-center justify-center gap-2 w-full py-3 border border-[#C68E4E]/40 hover:border-[#C68E4E] hover:bg-[#C68E4E]/10 text-[#C68E4E] font-bold tracking-[0.05em] uppercase text-sm rounded-sm transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Написать на почту
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

function ProjectsPage({ initialProjectSlug, onProjectOpened, onNavigate }: { initialProjectSlug: string | null; onProjectOpened: () => void; onNavigate: (page: PageId) => void }) {
  useLiveVersion()
  const { ref, visible } = useOnScreen(0.1)
  const [selectedProject, setSelectedProject] = useState<typeof PROJECTS[0] | null>(null)
  const [hasOpenedSlug, setHasOpenedSlug] = useState(false)

  // Adjust state when prop changes (React supports setState during render)
  if (initialProjectSlug && !hasOpenedSlug) {
    const p = liveProjects.find((pr) => pr.slug === initialProjectSlug)
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

        <div className="flex justify-center mb-8">
          <button
            onClick={() => onNavigate('catalog')}
            className="inline-flex items-center gap-2 text-[#C68E4E] hover:text-[#D4A762] text-sm tracking-[0.1em] uppercase font-semibold transition-colors group"
          >
            <span>Смотреть каталог с ценами</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveProjects.map((project, idx) => (
            <FadeInSection
              key={project.slug}
              delay={0.1 * idx}
              className="group relative rounded-lg overflow-hidden h-72 sm:h-80 lg:h-96 border border-[#333] hover:border-[#C68E4E]/40 transition-all duration-500 cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <img
                loading="lazy"
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
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
                    {project.gallery.includes(project.image) ? project.gallery.length : project.gallery.length + 1} фото
                  </span>
                  <span className="text-[#C68E4E] font-bold text-sm">{project.price}</span>
                </div>
                <h3 className="text-white font-bold text-lg tracking-[0.02em] uppercase">
                  {project.title}
                </h3>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>

      {/* Project detail page overlay */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailPage
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            onNavigate={onNavigate}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

/* ───────────────────────── PROJECT DETAIL PAGE (KEEP EXISTING) ───────────────────────── */

function ProjectDetailPage({ project, onClose, onNavigate }: { project: typeof PROJECTS[0]; onClose: () => void; onNavigate?: (page: PageId) => void }) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const allPhotos = [project.image, ...project.gallery.filter(g => g !== project.image)]
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightbox) {
        if (e.key === 'Escape') setLightbox(false)
        if (e.key === 'ArrowRight') setCurrentIdx((i) => (i === allPhotos.length - 1 ? 0 : i + 1))
        if (e.key === 'ArrowLeft') setCurrentIdx((i) => (i === 0 ? allPhotos.length - 1 : i - 1))
      } else {
        if (e.key === 'Escape') onClose()
        if (e.key === 'ArrowRight') setCurrentIdx((i) => Math.min(i + 1, allPhotos.length - 1))
        if (e.key === 'ArrowLeft') setCurrentIdx((i) => Math.max(i - 1, 0))
      }
    }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    scrollRef.current?.scrollTo(0, 0)
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [allPhotos.length, onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, pointerEvents: 'none' }}
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
          {onNavigate && (
            <button
              onClick={() => { onClose(); onNavigate('catalog') }}
              className="hidden sm:flex items-center gap-1.5 text-[#8090A0] hover:text-[#C68E4E] text-xs tracking-[0.1em] uppercase font-semibold transition-colors"
            >
              <span>Каталог</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Main image with gallery controls */}
        <div className="relative">
          <div
            className="relative aspect-[4/3] sm:aspect-[16/10] bg-[#111] rounded-lg overflow-hidden border border-[#333] cursor-zoom-in"
            onClick={() => setLightbox(true)}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIdx}
                src={allPhotos[currentIdx]}
                alt={`${project.title} — фото ${currentIdx + 1}`}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </AnimatePresence>

            {/* Nav arrows */}
            {allPhotos.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); setCurrentIdx((i) => (i === 0 ? allPhotos.length - 1 : i - 1)) }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-black/60 hover:bg-[#C68E4E]/30 text-white/80 hover:text-white rounded-sm border border-white/10 hover:border-[#C68E4E]/50 transition-all"
                  aria-label="Предыдущее фото"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setCurrentIdx((i) => (i === allPhotos.length - 1 ? 0 : i + 1)) }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-black/60 hover:bg-[#C68E4E]/30 text-white/80 hover:text-white rounded-sm border border-white/10 hover:border-[#C68E4E]/50 transition-all"
                  aria-label="Следующее фото"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Counter badge */}
            <div className="absolute bottom-3 right-3 bg-black/70 text-white/80 text-xs px-3 py-1.5 rounded-sm border border-white/10">
              {currentIdx + 1} / {allPhotos.length}
            </div>
          </div>

          {/* Thumbnails strip */}
          {allPhotos.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {allPhotos.map((img, idx) => (
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
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[0.03em] uppercase text-white mb-6">
              {project.title}
            </h2>
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
                <a
                  href="mailto:parhouse_55@mail.ru"
                  className="flex items-center justify-center gap-2 w-full py-3 border border-[#C68E4E]/40 hover:border-[#C68E4E] hover:bg-[#C68E4E]/10 text-[#C68E4E] font-bold tracking-[0.05em] uppercase text-sm rounded-sm transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Написать на почту
                </a>
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

      {/* Lightbox fullscreen */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[90] bg-black/95 flex items-center justify-center"
            onClick={() => setLightbox(false)}
          >
            <button
              type="button"
              className="absolute top-4 right-4 z-10 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
              onClick={() => setLightbox(false)}
              aria-label="Закрыть"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white/80 text-sm px-4 py-2 rounded-full border border-white/10">
              {currentIdx + 1} / {allPhotos.length}
            </div>
            {allPhotos.length > 1 && (
              <>
                <button
                  type="button"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-black/50 hover:bg-[#C68E4E]/30 text-white/80 hover:text-white rounded-full border border-white/10 hover:border-[#C68E4E]/50 transition-all"
                  onClick={(e) => { e.stopPropagation(); setCurrentIdx((i) => (i === 0 ? allPhotos.length - 1 : i - 1)) }}
                  aria-label="Предыдущее фото"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-black/50 hover:bg-[#C68E4E]/30 text-white/80 hover:text-white rounded-full border border-white/10 hover:border-[#C68E4E]/50 transition-all"
                  onClick={(e) => { e.stopPropagation(); setCurrentIdx((i) => (i === allPhotos.length - 1 ? 0 : i + 1)) }}
                  aria-label="Следующее фото"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIdx}
                src={allPhotos[currentIdx]}
                alt={`${project.title} — фото ${currentIdx + 1}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="w-[95vw] h-[90vh] object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
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
            <img
              loading="lazy"
              src="/hero-bg-sauna.webp"
              alt="Производство ПАР ХАУС"
              className="absolute inset-0 w-full h-full object-cover"
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
              лиственницу, липу и сосну. Каждая деталь
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
  const stat1 = useCountUp(1, 1000)

  const starts = [stat8.start, stat200.start, stat100.start, stat1.start] as const
  useEffect(() => {
    if (visible) starts.forEach((s) => s())
  }, [visible])

  const stats = [
    { count: stat8.count, suffix: '+', label: 'Лет опыта' },
    { count: stat200.count, suffix: '+', label: 'Проектов' },
    { count: stat100.count, suffix: '%', label: 'Натуральное' },
    { count: stat1.count, suffix: '', label: 'Год гарантия' },
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
                  <a href="mailto:parhouse_55@mail.ru" className="text-[#C68E4E] text-base hover:underline underline-offset-4 decoration-[#C68E4E]/30">
                    parhouse_55@mail.ru
                  </a>
                </div>
              </div>
            </div>

            {/* Organization Details */}
            <div className="glass-card rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-sm bg-[#C68E4E]/15 border border-[#C68E4E]/30 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-[#C68E4E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm tracking-[0.1em] uppercase mb-1">Реквизиты</h3>
                  <p className="text-[#D0D6DC] text-base font-medium">ИП Арзамасов Роман Борисович</p>
                  <p className="text-[#8090A0] text-sm mt-1">ИНН 550726246970</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="https://vk.ru/mobil_bani55"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card rounded-lg w-12 h-12 flex items-center justify-center hover:border-[#C68E4E]/50 transition-colors group"
                aria-label="VK"
              >
                <svg className="w-5 h-5 text-[#8090A0] group-hover:text-[#C68E4E] transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.598-.188 1.368 1.259 2.183 1.815.616.42 1.084.328 1.084.328l2.175-.03s1.14-.07.599-.964c-.044-.073-.314-.661-1.618-1.869-1.366-1.265-1.183-1.06.462-3.246.999-1.328 1.398-2.14 1.273-2.487-.119-.332-.854-.244-.854-.244l-2.444.015s-.182-.025-.316.056c-.131.079-.216.263-.216.263s-.388 1.036-.906 1.917c-1.092 1.856-1.528 1.954-1.706 1.84-.414-.268-.31-1.077-.31-1.651 0-1.795.272-2.543-.53-2.738-.266-.064-.462-.107-1.142-.114-.872-.009-1.61.003-2.027.208-.278.136-.493.44-.362.457.162.022.529.099.723.363.251.342.242 1.109.242 1.109s.144 2.112-.337 2.374c-.331.18-.783-.187-1.756-1.869-.498-.86-.874-1.812-.874-1.812s-.073-.178-.202-.274c-.157-.116-.377-.153-.377-.153l-2.323.015s-.35.01-.478.162c-.114.135-.009.413-.009.413s1.82 4.262 3.88 6.405c1.889 1.966 4.032 1.837 4.032 1.837h.972z"/>
                </svg>
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

          {/* Right: Map */}
          <motion.div
            initial={false}
            animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
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
                  sandbox="allow-scripts"
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

/* ───────────────────────── COOKIE CONSENT BANNER (ФЗ-420) ───────────────────────── */

const COOKIE_CONSENT_KEY = 'parhouse_cookie_consent'

/** Expose consent state globally for conditional tracker loading */
declare global {
  interface Window {
    __cookieConsent?: 'accepted' | 'rejected'
    __loadTrackers?: () => void
  }
}

function CookieBanner({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (stored === 'accepted' || stored === 'rejected') {
      window.__cookieConsent = stored
      if (stored === 'accepted' && typeof window.__loadTrackers === 'function') {
        window.__loadTrackers()
      }
    } else {
      const id = requestAnimationFrame(() => setVisible(true))
      return () => cancelAnimationFrame(id)
    }
  }, [])

  const handleAccept = useCallback(() => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted')
    document.cookie = 'parhouse_cookie_consent=accepted; path=/; max-age=31536000; SameSite=Lax; Secure'
    window.__cookieConsent = 'accepted'
    setVisible(false)
    if (typeof window.__loadTrackers === 'function') {
      window.__loadTrackers()
    }
  }, [])

  const handleReject = useCallback(() => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected')
    document.cookie = 'parhouse_cookie_consent=rejected; path=/; max-age=31536000; SameSite=Lax; Secure'
    window.__cookieConsent = 'rejected'
    setVisible(false)
  }, [])

  if (!visible) return null

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6"
    >
      <div className="max-w-4xl mx-auto bg-[#1E1E1E] border border-[#C68E4E]/20 rounded-lg p-5 sm:p-6 shadow-[0_-4px_40px_rgba(0,0,0,0.5)]">
        <p className="text-[#B0B8C0] text-sm leading-relaxed mb-5">
          Сайт использует технические cookie для корректной работы.
          Аналитические cookie в данный момент не устанавливаются.
          {' '}
          <button
            type="button"
            onClick={() => { setVisible(false); onNavigate('privacy') }}
            className="text-[#C68E4E] underline underline-offset-2 hover:text-[#D4A762] transition-colors whitespace-nowrap"
          >
            Политика конфиденциальности
          </button>
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleReject}
            className="flex-1 px-6 py-3 text-sm font-semibold tracking-[0.08em] uppercase border border-[#555] text-[#B0B8C0] hover:bg-[#2A2A2A] hover:border-[#8090A0] transition-all duration-300 rounded-none"
          >
            Закрыть
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="flex-1 px-6 py-3 text-sm font-semibold tracking-[0.08em] uppercase border border-[#C68E4E] bg-[#C68E4E] text-white hover:bg-[#D4A762] hover:border-[#D4A762] transition-all duration-300 rounded-none"
          >
            Принять
          </button>
        </div>
      </div>
    </motion.div>
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
                decoding="async"
                className="h-24 w-auto object-contain opacity-90"
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
          <div className="text-[#606870] text-xs tracking-wider space-y-1">
            <p>© {CURRENT_YEAR} ПАР ХАУС. Все права защищены.</p>
            <p>ИП Арзамасов Р.Б. · ИНН 550726246970</p>
          </div>
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
          <p>
            Сайт <strong className="text-[#909AA4]">не собирает персональные данные</strong> пользователей.
            На сайте отсутствуют формы ввода, регистрация и авторизация. Пользователь
            самостоятельно связывается с Оператором по указанным контактам (телефон, email,
            мессенджеры), передавая информацию по своему усмотрению.
          </p>
          <p><strong className="text-[#B0B8C0]">4. Цели обработки</strong></p>
          <p>
            Персональные данные, полученные Оператором при непосредственном обращении
            пользователя по телефонам, email или мессенджерам, обрабатываются в целях:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Консультирование по вопросам продукции и услуг</li>
            <li>Заключение и исполнение договоров подряда</li>
            <li>Улучшение качества сервиса</li>
          </ul>
          <p><strong className="text-[#B0B8C0]">5. Правовые основания</strong></p>
          <p>
            Обработка персональных данных, полученных при непосредственном обращении
            пользователя, осуществляется на основании:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>п. 5 ч. 1 ст. 6 Федерального закона № 152-ФЗ — для заключения и исполнения договора;</li>
            <li>п. 1 ч. 1 ст. 6 Федерального закона № 152-ФЗ — на основании согласия субъекта,
              выраженного при обращении к Оператору.</li>
          </ul>
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
          <p><strong className="text-[#B0B8C0]">8. Использование файлов cookie</strong></p>
          <p>
            Сайт использует файлы cookie — небольшие текстовые файлы, размещаемые
            на устройстве пользователя. Cookie делятся на две категории:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong className="text-[#909AA4]">Технические (необходимые) cookie</strong> — обеспечивают корректную работу сайта,
              запоминание состояния (например, согласие на cookie, выбранная страница).
              Эти cookie устанавливаются автоматически и не требуют согласия пользователя.</li>
            <li><strong className="text-[#909AA4]">Аналитические cookie</strong> — могут использоваться для сбора обезличенной статистики
              посещаемости (например, Яндекс.Метрика). Установка таких cookie
              производится только после получения явного согласия пользователя
              посредством баннера на сайте.</li>
          </ul>
          <p>
            На данный момент аналитические cookie <strong className="text-[#909AA4]">не используются</strong>.
            Сайт устанавливает только технические cookie, необходимые для его работы.
          </p>
          <p>
            Вы можете в любой момент отказаться от аналитических cookie, очистив
            соответствующую запись в localStorage браузера (ключ: <code className="text-[#C68E4E] text-xs">parhouse_cookie_consent</code>)
            или воспользовавшись настройками браузера.
          </p>
          <p><strong className="text-[#B0B8C0]">9. Контакты</strong></p>
          <p>
            По всем вопросам, связанным с обработкой персональных данных, обращайтесь:{' '}
            <a href="tel:+79048220007" className="text-[#C68E4E] hover:underline">+7 (904) 822-00-07</a>
            {' '}или{' '}
            <a href="mailto:parhouse_55@mail.ru" className="text-[#C68E4E] hover:underline">parhouse_55@mail.ru</a>
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
  const [loaded, setLoaded] = useState(false)
  const mainRef = useRef<HTMLDivElement>(null)
  // Load live data from /products.json & dismiss preloader
  useEffect(() => {
    loadProductsData()
    const el = document.getElementById('preloader')
    if (!el) return
    el.style.opacity = '0'
    el.style.visibility = 'hidden'
    setTimeout(() => el.remove(), 700)
  }, [])
  // Dismiss splash screen via direct DOM manipulation (no React state — avoids hydration mismatch)
  useEffect(() => {
    const splash = document.getElementById('splash')
    if (!splash) return
    const timer = setTimeout(() => {
      splash.style.opacity = '0'
      setTimeout(() => splash.remove(), 500)
    }, 800)
    return () => clearTimeout(timer)
  }, [])
  // Skeleton loading state
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 300)
    return () => clearTimeout(timer)
  }, [])
  // JSON-LD structured data: inject on mount and re-inject when live data loads
  useEffect(() => {
    injectJsonLd()
    const h = () => injectJsonLd()
    window.addEventListener('data-updated', h)
    return () => window.removeEventListener('data-updated', h)
  }, [])

  const handleNavigate = useCallback((page: PageId) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-[#1A1A1A] relative">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Scroll progress bar (visible on home page) */}
      {currentPage === 'home' && <ScrollProgressBar mainRef={mainRef} />}

      <main className="flex-1 relative" ref={mainRef}>
        {!loaded ? (
          <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Hero skeleton */}
            <div className="w-full aspect-video rounded-sm bg-[#2a2a2a] animate-pulse" />
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <div className="h-5 w-48 rounded bg-[#2a2a2a] animate-pulse" />
              <div className="h-5 w-32 rounded bg-[#2a2a2a] animate-pulse" />
            </div>
            {/* Card grid skeleton */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-sm overflow-hidden">
                  <div className="w-full aspect-[4/3] bg-[#2a2a2a] animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 w-3/4 rounded bg-[#2a2a2a] animate-pulse" />
                    <div className="h-3 w-1/2 rounded bg-[#2a2a2a] animate-pulse" />
                    <div className="h-3 w-full rounded bg-[#2a2a2a] animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
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
              <Breadcrumbs pageId="catalog" />
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
              <Breadcrumbs pageId="projects" />
              <ProjectsPage initialProjectSlug={openProjectSlug} onProjectOpened={() => setOpenProjectSlug(null)} onNavigate={handleNavigate} />
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
              <Breadcrumbs pageId="about" />
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
              <Breadcrumbs pageId="contacts" />
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
              <Breadcrumbs pageId="privacy" />
              <PrivacyPage onNavigate={handleNavigate} />
            </motion.div>
          )}
        </AnimatePresence>
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
      <CookieBanner onNavigate={handleNavigate} />

      {/* Global floating elements */}
      <BackToTop />
      <FloatingCallButton />
    </div>
  )
}
