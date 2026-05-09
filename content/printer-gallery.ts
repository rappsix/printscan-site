export interface PrinterPhoto {
  id: string;
  name: string;
  description: string;
  imagePath: string;
  tag?: string;
}

export const printerGallery: PrinterPhoto[] = [
  {
    id: "elegoo-neptune-4-max",
    name: "Elegoo Neptune 4 Max",
    description: "Крупноформатный FDM-принтер: рабочее поле 430×430×480 мм. Печатаем большие детали, корпуса, архитектурные макеты и серии целиком.",
    imagePath: "/equipment/elegoo-neptune-4-max.jpg",
    tag: "FDM · Large",
  },
  {
    id: "bambu-lab",
    name: "Bambu Lab",
    description: "Скоростная многоцветная FDM-печать с автоматической калибровкой. Высокая точность, поддержка технических пластиков: ABS, ASA, PA, CF.",
    imagePath: "/equipment/bambu-lab.jpg",
    tag: "FDM · Multicolor",
  },
  {
    id: "creality",
    name: "Creality",
    description: "Надёжные FDM-станки для серийного производства и прототипирования. PLA, PETG, TPU и другие материалы под любую задачу.",
    imagePath: "/equipment/creality.jpg",
    tag: "FDM",
  },
  {
    id: "scanner-1",
    name: "3D-сканер",
    description: "Ручной сканер для выездной работы, точность до сотых мм",
    imagePath: "/equipment/scanner-1.jpg",
    tag: "Сканер",
  },
];
