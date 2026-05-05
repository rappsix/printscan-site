export type PortfolioCategory =
  | "3d-print"
  | "3d-scan"
  | "reverse-engineering"
  | "3d-modeling"
  | "mockups"
  | "post-processing";

export interface PortfolioProject {
  slug: string;
  title: string;
  category: PortfolioCategory;
  categoryLabel: string;
  summary: string;
  client?: string;
  year: number;
  quantity?: string;
  material?: string;
  leadTime?: string;
  coverImage: string;
  imageObjectPosition?: string;
  imageFit?: "cover" | "contain";
  highlights: string[];
}

export const portfolioProjects: PortfolioProject[] = [
  {
    slug: "industrial-housings-petg",
    title: "Корпуса приборов из PETG для заказчика в Пензе",
    category: "3d-print",
    categoryLabel: "3D-печать",
    summary:
      "Партия корпусов для промышленного оборудования — FDM-печать PETG, точность ±0,2 мм, монтаж электроники с первого раза.",
    client: "Промышленный заказчик",
    year: 2025,
    quantity: "120 шт",
    material: "PETG",
    leadTime: "9 рабочих дней",
    coverImage: "/portfolio/industrial-housings-petg.jpg",
    highlights: [
      "Подготовили модель под оптимальный набор слоёв",
      "Контроль геометрии на каждой партии",
      "Полностью попали в размеры электроники",
    ],
  },
  {
    slug: "scan-industrial-gearbox",
    title: "Сканирование редуктора с выездом на производство",
    category: "3d-scan",
    categoryLabel: "3D-сканирование",
    summary:
      "Выезд на производство, сканирование редуктора без демонтажа, получение STL-модели для проектирования замены.",
    year: 2025,
    leadTime: "2 дня",
    coverImage: "/portfolio/scan-industrial-gearbox.jpg",
    highlights: [
      "Сканирование на месте без остановки производства",
      "Очистка и объединение сканов в студии",
      "Передача STL + PDF-отчёта",
    ],
  },
  {
    slug: "reverse-pump-housing",
    title: "Реверс-инжиниринг корпуса насоса",
    category: "reverse-engineering",
    categoryLabel: "Реверс-инжиниринг",
    summary:
      "Сняли с производства деталь — восстановили геометрию, построили параметрическую модель, выдали чертежи для литья.",
    year: 2024,
    leadTime: "10 дней",
    coverImage: "/portfolio/reverse-pump-housing.jpg",
    highlights: [
      "Сканирование + ручной обмер критичных посадок",
      "Параметрическая 3D-модель в SolidWorks",
      "Чертежи по ГОСТ 2.109-73",
    ],
  },
  {
    slug: "arch-mockup-residential",
    title: "Макет жилого комплекса, масштаб 1:200",
    category: "mockups",
    categoryLabel: "Макеты",
    summary:
      "Презентационный макет с подсветкой для застройщика: корпуса напечатаны на FDM, ландшафт комбинированный.",
    year: 2025,
    leadTime: "4 недели",
    coverImage: "/portfolio/arch-mockup-residential.jpg",
    highlights: [
      "Встроенная подсветка жилых корпусов",
      "Точное соответствие генплану",
      "Съёмная крышка для демонстрации квартир",
    ],
  },
  {
    slug: "photo-to-3d-figurine",
    title: "Коллекционная фигурка по фотографиям",
    category: "3d-modeling",
    categoryLabel: "3D-моделирование",
    summary:
      "Создали 3D-модель персонажа по 24 фотографиям заказчика, напечатали на фотополимере, покрасили вручную.",
    year: 2025,
    leadTime: "6 дней",
    coverImage: "/portfolio/photo-to-3d-figurine.jpg",
    highlights: [
      "Скульптинг в ZBrush с сохранением сходства",
      "SLA-печать 50 микрон",
      "Художественная покраска акрилом",
    ],
  },
  {
    slug: "post-processing-painted-props",
    title: "Покраска реквизита для театра",
    category: "post-processing",
    categoryLabel: "Постобработка",
    summary:
      "Шлифовка, шпатлёвка и покраска напечатанного реквизита под металл и патину — партия для театральной постановки.",
    year: 2024,
    quantity: "18 шт",
    leadTime: "8 дней",
    coverImage: "/portfolio/post-processing-painted-props.jpg",
    highlights: [
      "Полное скрытие слоёв печати",
      "Эффект состаренного металла",
      "Защитный лак под сценическое освещение",
    ],
  },
];

export function findProjectBySlug(slug: string): PortfolioProject | undefined {
  return portfolioProjects.find((project) => project.slug === slug);
}
