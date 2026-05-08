import nodemailer from "nodemailer";

export async function sendLeadByEmail(lead: {
  name: string;
  phone: string;
  message?: string;
}): Promise<void> {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.SMTP_TO;

  if (!user || !pass || !to) {
    throw new Error("SMTP_USER, SMTP_PASS or SMTP_TO is not configured");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.yandex.ru",
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  const now = new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" });

  const lines = [
    `Имя: ${lead.name}`,
    `Телефон: ${lead.phone}`,
  ];
  if (lead.message) lines.push(`Сообщение: ${lead.message}`);
  lines.push(``, `Получено: ${now} МСК`);

  await transporter.sendMail({
    from: `"Заявки с сайта" <${user}>`,
    to,
    subject: `Новая заявка от ${lead.name}`,
    text: lines.join("\n"),
  });
}
