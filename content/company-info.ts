export const companyInfo = {
  name: "Scan & Print",
  legalName: "Scan & Print",
  founded: 2018,
  city: "Пенза",
  region: "Пензенская область",
  tagline: "3D-печать, сканирование и макетирование для бизнеса с 2018 года",
  description:
    "Профессиональная 3D-печать пластиками, сканирование промышленными сканерами, реверс-инжиниринг, моделирование по фото, макеты архитектурных объектов. Выезд на место по Пензе и области.",
  phone: "+7 (937) 444-15-45",
  phoneClean: "+79374441545",
  email: "penzaoil58@yandex.ru",
  whatsapp: "79374441545",
  telegram: "autohouse58",
  vk: "id466666186",
  address: "г. Пенза",
  workingHours: "Пн–Пт 9:00–19:00",
  whatsappGreeting:
    "Здравствуйте! Хочу обсудить заказ 3D-печати / сканирования",
} as const;

export type CompanyInfo = typeof companyInfo;
