export interface CompanyStat {
  value: string;
  label: string;
  hint?: string;
}

export const companyStats: CompanyStat[] = [
  {
    value: "8",
    label: "лет на рынке",
    hint: "с 2018 года",
  },
  {
    value: "500+",
    label: "завершённых проектов",
    hint: "каждый со своей историей",
  },
  {
    value: "от 1 дня",
    label: "срок изготовления",
    hint: "для типовых заказов",
  },
  {
    value: "Выезд",
    label: "на объект",
    hint: "Пенза и область",
  },
];
