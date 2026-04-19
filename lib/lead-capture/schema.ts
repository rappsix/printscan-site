import { z } from "zod";

export const contactLeadSchema = z.object({
  name: z.string().min(1, "Укажите имя").max(100),
  phone: z.string().min(1, "Укажите телефон").refine(
    (val) => val.replace(/\D/g, "").length >= 10,
    "Введите корректный номер телефона"
  ),
  message: z.string().max(1000).optional(),
  honeypot: z.string().max(0).optional(),
});

export type ContactLead = z.infer<typeof contactLeadSchema>;
