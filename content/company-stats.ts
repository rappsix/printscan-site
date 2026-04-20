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
    value: "10+",
    label: "принтеров в парке",
    hint: "FDM и SLA",
  },
  {
    value: "Выезд",
    label: "на объект",
    hint: "Пенза и область",
  },
];
