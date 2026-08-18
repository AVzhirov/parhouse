/* ─────────────────────────════════════════════════════════════════
   ДАННЫЕ ТОВАРОВ И ПРОЕКТОВ — ПАР ХАУС

   👆 ВСЕ ЦЕНЫ ЗДЕСЬ. Чтобы поменять цену —
      измени число в поле price и пересобери проект:
      bun run build  (или npm run build)
   ══════════════════════════════════════════════════════════════════ */

/* ─────────────────── ТИПЫ ─────────────────── */

export interface CatalogItem {
  id: number
  name: string
  type: string
  price: string
  size: string
  image: string
  description: string
  features: string[]
}

export interface Project {
  slug: string
  title: string
  description: string
  image: string
  year: string
  price: string
  gallery: string[]
}

/* ═══════════════ КАТАЛОГ (цены) ═══════════════ */

export const CATALOG_ITEMS: CatalogItem[] = [
  {
    id: 1,
    name: 'Дачный домик 4×6 плюс террасой',
    type: 'Дачный домик',
    price: '650 000 ₽',
    size: '4×6 м + терраса',
    image: '/product-1.jpg',
    description: 'Дачный домик 4х6 с террасой — это классика, которая дает хороший простор для планировки. С террасой полезная площадь визуально и функционально расширяется, а само строение выглядит законченным.',
    features: ['Терраса', 'Просторная планировка', 'Каркасная технология'],
  },
  {
    id: 2,
    name: 'Каркасная баня 5,5×2,5',
    type: 'Каркасная баня',
    price: '780 000 ₽',
    size: '5,5×2,5 м',
    image: '/product-2.jpg',
    description: 'Просторная каркасная баня с продуманной планировкой. Оптимальные размеры для комфортной парной и зоны отдыха.',
    features: ['Парная', 'Помывочная', 'Комната отдыха'],
  },
  {
    id: 3,
    name: 'Мини парная с электрокаменкой 4×2,4',
    type: 'Мини парная',
    price: '445 000 ₽',
    size: '4×2,4 м',
    image: '/product-3.jpg',
    description: 'Компактная мини-парная с электрокаменкой — идеальное решение для небольшого участка. Быстрый прогрев, экономичный расход электроэнергии.',
    features: ['Электрокаменка', 'Компактная', 'Быстрый прогрев'],
  },
  {
    id: 4,
    name: 'Баня 3,9×2,15 с тёплым полом',
    type: 'Баня с тёплым полом',
    price: '380 000 ₽',
    size: '3,9×2,15 м',
    image: '/product-4.jpg',
    description: 'Баня с системой тёплого пола для дополнительного комфорта. Оптимальные габариты, продуманная внутренняя планировка.',
    features: ['Тёплый пол', 'Компактная', 'Утеплённая'],
  },
  {
    id: 5,
    name: 'Мобильный офис',
    type: 'Мобильное здание',
    price: '290 000 ₽',
    size: 'Мобильный',
    image: '/product-5.jpg',
    description: 'Мобильный офис на базе каркасной технологии. Быстрое развёртывание, транспортируется на любой участок.',
    features: ['Мобильный', 'Каркасный', 'Транспортируемый'],
  },
  {
    id: 6,
    name: 'Баня 4×2',
    type: 'Каркасная баня',
    price: '320 000 ₽',
    size: '4×2 м',
    image: '/product-6.jpg',
    description: 'Компактная баня 4 на 2 метра — бюджетное решение для тех, кому нужна качественная парная на небольшом участке.',
    features: ['Компактная', 'Бюджетная', 'Каркасная'],
  },
  {
    id: 7,
    name: 'Дачный домик',
    type: 'Дачный домик',
    price: '550 000 ₽',
    size: 'Стандартный',
    image: '/product-7.jpg',
    description: 'Удобный дачный домик для сезонного проживания. Каркасная технология обеспечивает быстрое строительство и отличную теплоизоляцию.',
    features: ['Сезонный', 'Каркасный', 'Теплоизоляция'],
  },
  {
    id: 8,
    name: 'Каркасная баня 2,5×4',
    type: 'Каркасная баня',
    price: '450 000 ₽',
    size: '2,5×4 м',
    image: '/product-8.jpg',
    description: 'Каркасная баня с размерами 2,5 на 4 метра. Продуманная внутренняя планировка с парной и зоной отдыха.',
    features: ['Парная', 'Зона отдыха', 'Каркасная'],
  },
  {
    id: 9,
    name: 'Баня 3,9×2,15',
    type: 'Каркасная баня',
    price: '350 000 ₽',
    size: '3,9×2,15 м',
    image: '/product-9.jpg',
    description: 'Баня 3,9 на 2,15 м — одно из самых популярных решений. Оптимальное сочетание цены, размеров и функциональности.',
    features: ['Парная', 'Компактная', 'Популярная'],
  },
  {
    id: 10,
    name: 'Каркасный домик 2,5х2 м для детей',
    type: 'Детский домик',
    price: '125 000 ₽',
    size: '2,5×2 м',
    image: '/product-10.jpg',
    description: 'Игровой домик 2,5х2 м для детей — внутри как настоящая квартира! Размер позволяет поставить детский столик и кресло, есть окошко и дверь на щеколду (безопасно).',
    features: ['Окошко', 'Дверь на щеколду', 'Для детей'],
  },
]

/* ═══════════════ ПРОЕКТЫ (цены) ═══════════════ */

export const PROJECTS: Project[] = [
  {
    slug: 'dachny-domik-46-terasa',
    title: 'Дачный домик 4×6 с террасой',
    description: 'Дачный домик 4х6 с террасой — это классика, которая дает хороший простор для планировки. Главное преимущество — с террасой полезная площадь визуально и функционально расширяется, а само строение выглядит законченным.',
    image: '/projects/dachny-domik-46-terasa/main.jpg',
    year: '2024',
    price: '650 000 ₽',
    gallery: [
      '/projects/dachny-domik-46-terasa/main.jpg',
      '/projects/dachny-domik-46-terasa/gallery-1.jpg',
      '/projects/dachny-domik-46-terasa/gallery-2.jpg',
      '/projects/dachny-domik-46-terasa/gallery-3.jpg',
      '/projects/dachny-domik-46-terasa/gallery-4.jpg',
      '/projects/dachny-domik-46-terasa/gallery-5.jpg',
    ],
  },
  {
    slug: 'karkasnaya-banya-55-25',
    title: 'Каркасная баня 5,5×2,5',
    description: 'Каркасная баня 5×2,5 с панорамными окнами, с тёплым полом.',
    image: '/projects/karkasnaya-banya-55-25/main.jpg',
    year: '2024',
    price: '780 000 ₽',
    gallery: [
      '/projects/karkasnaya-banya-55-25/main.jpg',
      '/projects/karkasnaya-banya-55-25/gallery-1.jpg',
      '/projects/karkasnaya-banya-55-25/gallery-2.jpg',
      '/projects/karkasnaya-banya-55-25/gallery-3.jpg',
      '/projects/karkasnaya-banya-55-25/gallery-4.jpg',
      '/projects/karkasnaya-banya-55-25/gallery-5.jpg',
    ],
  },
  {
    slug: 'mini-parnaya-elektrokamenka',
    title: 'Мини парная с электрокаменкой 4×2,4',
    description: 'Мини парная с электрокаменкой и небольшим предбанником, специальное панорамное остекление прямо в парной. Уютная МИНИ баня — отличный вариант для мини отелей или компактного места.',
    image: '/projects/mini-parnaya-elektrokamenka/main.jpg',
    year: '2024',
    price: '445 000 ₽',
    gallery: [
      '/projects/mini-parnaya-elektrokamenka/main.jpg',
      '/projects/mini-parnaya-elektrokamenka/gallery-1.jpg',
      '/projects/mini-parnaya-elektrokamenka/gallery-2.jpg',
      '/projects/mini-parnaya-elektrokamenka/gallery-3.jpg',
      '/projects/mini-parnaya-elektrokamenka/gallery-4.jpg',
      '/projects/mini-parnaya-elektrokamenka/gallery-5.jpg',
    ],
  },
  {
    slug: 'banya-39-teplym-polom',
    title: 'Баня 3,9×2,15 с тёплым полом',
    description: 'Горячая новинка осени — баня 3,9×2,15 с тёплым полом в комнате отдыха. Продуманное до мелочей пространство для здоровья и удовольствия. Качество исполнения и smart-решения.',
    image: '/projects/banya-39-teplym-polom/main.jpg',
    year: '2024',
    price: '380 000 ₽',
    gallery: [
      '/projects/banya-39-teplym-polom/main.jpg',
      '/projects/banya-39-teplym-polom/gallery-1.jpg',
      '/projects/banya-39-teplym-polom/gallery-2.jpg',
      '/projects/banya-39-teplym-polom/gallery-3.jpg',
      '/projects/banya-39-teplym-polom/gallery-4.jpg',
      '/projects/banya-39-teplym-polom/gallery-5.jpg',
    ],
  },
  {
    slug: 'mobilny-ofis',
    title: 'Мобильный офис',
    description: 'Мобильный офис продаж размер 3,5×2,5 для круглогодичного использования.',
    image: '/projects/mobilny-ofis/main.jpg',
    year: '2024',
    price: '290 000 ₽',
    gallery: [
      '/projects/mobilny-ofis/main.jpg',
      '/projects/mobilny-ofis/gallery-1.jpg',
      '/projects/mobilny-ofis/gallery-2.jpg',
      '/projects/mobilny-ofis/gallery-3.jpg',
      '/projects/mobilny-ofis/gallery-4.jpg',
      '/projects/mobilny-ofis/gallery-5.jpg',
    ],
  },
  {
    slug: 'banya-42',
    title: 'Баня 4×2',
    description: 'Баня 4×2 из профилированного мини бруса.',
    image: '/projects/banya-42/main.jpg',
    year: '2024',
    price: '320 000 ₽',
    gallery: [
      '/projects/banya-42/main.jpg',
      '/projects/banya-42/gallery-1.jpg',
      '/projects/banya-42/gallery-2.jpg',
      '/projects/banya-42/gallery-3.jpg',
      '/projects/banya-42/gallery-4.jpg',
    ],
  },
  {
    slug: 'dachny-domik-64',
    title: 'Дачный домик 6×4',
    description: 'Дачный домик 6×4, собран из профилированного кедрового мини бруса.',
    image: '/projects/dachny-domik-64/main.jpg',
    year: '2024',
    price: '550 000 ₽',
    gallery: [
      '/projects/dachny-domik-64/main.jpg',
      '/projects/dachny-domik-64/gallery-1.jpg',
      '/projects/dachny-domik-64/gallery-2.jpg',
      '/projects/dachny-domik-64/gallery-3.jpg',
    ],
  },
  {
    slug: 'karkasnaya-banya-25-4',
    title: 'Каркасная баня 2,5×4',
    description: 'Каркасная баня 2,5×4 под ключ.',
    image: '/projects/karkasnaya-banya-25-4/main.jpg',
    year: '2024',
    price: '450 000 ₽',
    gallery: [
      '/projects/karkasnaya-banya-25-4/main.jpg',
      '/projects/karkasnaya-banya-25-4/gallery-1.jpg',
      '/projects/karkasnaya-banya-25-4/gallery-2.jpg',
      '/projects/karkasnaya-banya-25-4/gallery-3.jpg',
      '/projects/karkasnaya-banya-25-4/gallery-4.jpg',
      '/projects/karkasnaya-banya-25-4/gallery-5.jpg',
    ],
  },
  {
    slug: 'banya-39-215',
    title: 'Баня 3,9×2,15',
    description: 'Баня 3,9×2,15 из сухого профилированного кедрового мини бруса, парилка обшита осиновой вагонкой. Печь «Русь», бак 50л из нержавейки, дымоход «Термофор» 0,8мм. Установка по противопожарным нормам. Электрика медным проводом в кабель канале. Обработка пропиткой, водоотведение. Мебель и камни в подарок.',
    image: '/projects/banya-39-215/main.jpg',
    year: '2024',
    price: '350 000 ₽',
    gallery: [
      '/projects/banya-39-215/main.jpg',
      '/projects/banya-39-215/gallery-1.jpg',
      '/projects/banya-39-215/gallery-2.jpg',
      '/projects/banya-39-215/gallery-3.jpg',
      '/projects/banya-39-215/gallery-4.jpg',
    ],
  },
  {
    slug: 'banya-brus-52-24',
    title: 'Баня из профилированного бруса 5×2,4',
    description: 'Баня 5×2,4 на 3 отделения, высота потолка 2,10м, ширина парилки 2,25м. Выдвижной нижний полок, мойка из лиственницы. Печь «Русь», бак 50л из нержавейки, дымоход «Термофор» 0,8мм. Электрика медным проводом в кабель канале, двойная пропитка. Мебель и камни в подарок.',
    image: '/projects/banya-brus-52-24/main.jpg',
    year: '2024',
    price: '480 000 ₽',
    gallery: [
      '/projects/banya-brus-52-24/main.jpg',
      '/projects/banya-brus-52-24/gallery-1.jpg',
      '/projects/banya-brus-52-24/gallery-2.jpg',
      '/projects/banya-brus-52-24/gallery-3.jpg',
      '/projects/banya-brus-52-24/gallery-4.jpg',
      '/projects/banya-brus-52-24/gallery-5.jpg',
    ],
  },
  {
    slug: 'detskij-domik-25h2',
    title: 'Каркасный домик 2,5х2 м для детей',
    description: 'Игровой домик 2,5х2 м для детей — внутри как настоящая квартира! Размер позволяет поставить детский столик и кресло, есть окошко и дверь на щеколду (безопасно).',
    image: '/projects/detskij-domik-25h2/main.jpg',
    year: '2025',
    price: '125 000 ₽',
    gallery: [
      '/projects/detskij-domik-25h2/main.jpg',
      '/projects/detskij-domik-25h2/gallery-1.jpg',
      '/projects/detskij-domik-25h2/gallery-2.jpg',
    ],
  },
]
