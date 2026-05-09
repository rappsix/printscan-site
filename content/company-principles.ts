export interface CompanyPrinciple {
  title: string;
  description: string;
}

export const companyPrinciples: CompanyPrinciple[] = [
  {
    title: "Работаем как партнёр, а не подрядчик",
    description:
      "Погружаемся в задачу, подбираем технологию под цель и предупреждаем о рисках до старта.",
  },
  {
    title: "Прозрачные сроки и смета",
    description:
      "Фиксируем бюджет и дедлайны в договоре или счёте. О любых изменениях сообщаем заранее.",
  },
  {
    title: "Контроль качества на каждом этапе",
    description:
      "Проверяем геометрию, прочность и внешний вид до отгрузки. Нет — только после вашего «ок».",
  },
  {
    title: "Готовы к нестандартным задачам",
    description:
      "Комбинируем печать, сканирование и ручной труд. Беремся за проекты, которые другим не по силам.",
  },
];

export interface EquipmentItem {
  name: string;
  category: "printer" | "scanner" | "software";
  description: string;
}

export const equipmentInventory: EquipmentItem[] = [
  {
    name: "FDM-принтеры: Creality, Bambu Lab, Elegoo Neptune 4 Max",
    category: "printer",
    description:
      "Рабочее поле до 430×430×480 мм. Печать крупных деталей, корпусов, макетов и серий. Поддержка PLA, PETG, ABS, ASA, TPU, PA, CF.",
  },
  {
    name: "Фотополимерные SLA/LCD принтеры",
    category: "printer",
    description:
      "Точность 25–50 микрон для миниатюр, ювелирных моделей и деталей с тонкой геометрией.",
  },
  {
    name: "Ручные 3D-сканеры",
    category: "scanner",
    description:
      "Профессиональные сканеры с точностью до сотых миллиметра, в том числе для выездной работы.",
  },
  {
    name: "КОМПАС-3D, SolidWorks, Fusion 360, ZBrush",
    category: "software",
    description:
      "Отечественный КОМПАС-3D и мировые CAD-системы — моделирование под любую задачу: от конструкторской документации до органических форм.",
  },
];
