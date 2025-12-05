export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  if (!body.name || !body.phone) {
    throw createError({
      statusCode: 400,
      message: "Имя и телефон обязательны",
    });
  }

  const message = `
    🆕 *Новая заявка c сайта*

    👤 *Имя:* ${body.name}
    📱 *Телефон:* ${body.phone}
    ${body.message ? `💬 *Сообщение:* ${body.message}` : ""}

    ⏰ *Время:* ${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })}`.trim();

  try {
    await $fetch(
      `https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`,
      {
        method: "POST",
        body: {
          chat_id: config.telegramChatId,
          text: message,
          parse_mode: "Markdown",
        },
      },
    );

    return {
      success: true,
      message: "Заявка успешно отправлена",
    };
  } catch (error) {
    console.error("Telegram API Error:", error);
    throw createError({
      statusCode: 500,
      message: "Ошибка отправки в Telegram",
    });
  }
});
