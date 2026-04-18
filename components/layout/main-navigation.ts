export interface NavLink {
  href: string;
  label: string;
}

export const primaryNavLinks: NavLink[] = [
  { href: "/#services", label: "Услуги" },
  { href: "/portfolio", label: "Портфолио" },
  { href: "/blog", label: "Блог" },
  { href: "/about", label: "О компании" },
  { href: "/contacts", label: "Контакты" },
];
