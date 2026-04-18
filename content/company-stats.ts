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
    hint: "для юрлиц и ИП",
  },
  {
    value: "15+",
    label: "видов пластика",
    hint: "под любую задачу",
  },
  {
    value: "58",
    label: "регион выезда",
    hint: "Пенза и область",
  },
];
