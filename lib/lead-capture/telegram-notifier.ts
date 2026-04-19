function escapeTelegramHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatLeadMessage(lead: { name: string; phone: string; message?: string }): string {
  const lines = [
    "📋 <b>Новая заявка с сайта</b>",
    "",
    `👤 <b>Имя:</b> ${escapeTelegramHtml(lead.name)}`,
    `📞 <b>Телефон:</b> ${escapeTelegramHtml(lead.phone)}`,
  ];

  if (lead.message) {
    lines.push(`💬 <b>Сообщение:</b> ${escapeTelegramHtml(lead.message)}`);
  }

  const now = new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" });
  lines.push("", `🕐 <b>Получено:</b> ${now} МСК`);

  return lines.join("\n");
}

export async function sendLeadToTelegram(lead: {
  name: string;
  phone: string;
  message?: string;
}): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error("TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not configured");
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: formatLeadMessage(lead), parse_mode: "HTML" }),
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Telegram API error ${response.status}: ${body}`);
  }
}
