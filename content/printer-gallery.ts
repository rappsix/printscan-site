export interface PrinterPhoto {
  id: string;
  name: string;
  description: string;
  imagePath: string;
  tag?: string;
}

export const printerGallery: PrinterPhoto[] = [
  {
    id: "fdm-1",
    name: "FDM-принтер #1",
    description: "Рабочее поле 300×300×400 мм, печать крупных деталей и серий",
    imagePath: "/equipment/fdm-1.jpg",
    tag: "FDM",
  },
  {
    id: "fdm-2",
    name: "FDM-принтер #2",
    description: "Высокоточная FDM-печать с поддержкой технических пластиков",
    imagePath: "/equipment/fdm-2.jpg",
    tag: "FDM",
  },
  {
    id: "resin-1",
    name: "Фотополимерный принтер",
    description: "Точность 25–50 мкм для миниатюр и деталей с тонкой геометрией",
    imagePath: "/equipment/resin-1.jpg",
    tag: "Смола",
  },
  {
    id: "scanner-1",
    name: "3D-сканер",
    description: "Ручной сканер для выездной работы, точность до сотых мм",
    imagePath: "/equipment/scanner-1.jpg",
    tag: "Сканер",
  },
];
