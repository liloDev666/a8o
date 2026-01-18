import { getDatabase, saveDatabase, getMember, updateMember } from '../database.js';
import { translations } from '../i18n/translations.js';

export function handleSetLanguage(bot, msg, match) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const lang = match[1].toLowerCase();
  
  const supportedLanguages = Object.keys(translations);
  
  if (!supportedLanguages.includes(lang)) {
    const langList = supportedLanguages.join(', ');
    bot.sendMessage(chatId, 
      `❌ Language not supported!\n\nAvailable: ${langList}\n\nExample: \`/setlang en\``,
      { parse_mode: 'Markdown' }
    );
    return;
  }
  
  // Ensure userId is a number for consistent comparison
  const numericUserId = typeof userId === 'string' ? parseInt(userId) : userId;
  const member = getMember(numericUserId);
  if (member) {
    updateMember(numericUserId, { language: lang });
  } else {
    const db = getDatabase();
    db.members.push({
      userId: numericUserId,
      username: msg.from.username || msg.from.first_name,
      gameName: null,
      role: 'R1',
      language: lang,
      joinedAt: Date.now(),
      might: 0,
      kills: 0,
      helps: 0
    });
    saveDatabase();
  }
  
  const languageNames = {
    en: 'English 🇬🇧',
    ru: 'Русский 🇷🇺',
    ar: 'العربية 🇸🇦',
    fr: 'Français 🇫🇷',
    es: 'Español 🇪🇸',
    pt: 'Português 🇵🇹',
    de: 'Deutsch 🇩🇪',
    zh: '中文 🇨🇳'
  };
  
  bot.sendMessage(chatId, 
    `✅ Language set to ${languageNames[lang]}!\n\nUse /help to see commands in your language.`,
    { parse_mode: 'Markdown' }
  );
}

export function handleLanguages(bot, msg) {
  const chatId = msg.chat.id;
  
  const keyboard = {
    inline_keyboard: [
      [
        { text: '🇬🇧 English', callback_data: 'lang_en' },
        { text: '🇷🇺 Русский', callback_data: 'lang_ru' }
      ],
      [
        { text: '🇸🇦 العربية', callback_data: 'lang_ar' },
        { text: '🇫🇷 Français', callback_data: 'lang_fr' }
      ],
      [
        { text: '🇪🇸 Español', callback_data: 'lang_es' },
        { text: '🇵🇹 Português', callback_data: 'lang_pt' }
      ],
      [
        { text: '🇩🇪 Deutsch', callback_data: 'lang_de' },
        { text: '🇨🇳 中文', callback_data: 'lang_zh' }
      ]
    ]
  };
  
  const message = `
🌍 *SELECT YOUR LANGUAGE / ВЫБЕРИТЕ ЯЗЫК*

Choose your preferred language:
Выберите предпочитаемый язык:
اختر لغتك المفضلة:
Choisissez votre langue:
Elige tu idioma:
Escolha seu idioma:
Wähle deine Sprache:
选择你的语言:

Click a button below or use:
\`/setlang <code>\`

Available codes: en, ru, ar, fr, es, pt, de, zh
  `;
  
  bot.sendMessage(chatId, message, {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  });
}

export function handleLanguageCallback(bot, query) {
  const userId = query.from.id;
  const lang = query.data.split('_')[1];
  
  // Ensure userId is a number for consistent comparison
  const numericUserId = typeof userId === 'string' ? parseInt(userId) : userId;
  const member = getMember(numericUserId);
  if (member) {
    updateMember(numericUserId, { language: lang });
  } else {
    const db = getDatabase();
    db.members.push({
      userId: numericUserId,
      username: query.from.username || query.from.first_name,
      gameName: null,
      role: 'R1',
      language: lang,
      joinedAt: Date.now(),
      might: 0,
      kills: 0,
      helps: 0
    });
    saveDatabase();
  }
  
  const languageNames = {
    en: 'English 🇬🇧',
    ru: 'Русский 🇷🇺',
    ar: 'العربية 🇸🇦',
    fr: 'Français 🇫🇷',
    es: 'Español 🇪🇸',
    pt: 'Português 🇵🇹',
    de: 'Deutsch 🇩🇪',
    zh: '中文 🇨🇳'
  };
  
  bot.answerCallbackQuery(query.id, {
    text: `✅ Language set to ${languageNames[lang]}!`,
    show_alert: false
  });
  
  bot.sendMessage(query.message.chat.id, 
    `✅ Language changed to ${languageNames[lang]}!\n\nUse /help to see commands.`
  );
}
