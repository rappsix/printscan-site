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
    name: "Парк FDM-принтеров",
    category: "printer",
    description:
      "Принтеры с рабочим полем до 300×300×400 мм для крупных деталей и мелкой серии.",
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
    name: "SolidWorks, Fusion 360, ZBrush",
    category: "software",
    description:
      "CAD и digital sculpting — под любую задачу: от параметрической детали до органической формы.",
  },
];
