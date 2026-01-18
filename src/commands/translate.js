import axios from 'axios';
import { getDatabase, saveDatabase } from '../database.js';

// Free translation API (LibreTranslate or Google Translate fallback)
const TRANSLATE_API = 'https://translate.googleapis.com/translate_a/single';

export async function translateText(text, targetLang, sourceLang = 'auto') {
  try {
    const response = await axios.get(TRANSLATE_API, {
      params: {
        client: 'gtx',
        sl: sourceLang,
        tl: targetLang,
        dt: 't',
        q: text
      }
    });
    
    if (response.data && response.data[0]) {
      return response.data[0].map(item => item[0]).join('');
    }
    
    return text;
  } catch (error) {
    console.error('Translation error:', error.message);
    return text;
  }
}

export function handleTranslateOn(bot, msg) {
  const chatId = msg.chat.id;
  const db = getDatabase();
  
  if (!db.settings.autoTranslate) {
    db.settings.autoTranslate = {};
  }
  
  db.settings.autoTranslate[chatId] = true;
  saveDatabase();
  
  bot.sendMessage(chatId, 
    `✅ *Auto-translation enabled!*\n\nMessages will be automatically translated to each member's language.\n\nUse /translateoff to disable.`,
    { parse_mode: 'Markdown' }
  );
}

export function handleTranslateOff(bot, msg) {
  const chatId = msg.chat.id;
  const db = getDatabase();
  
  if (db.settings.autoTranslate) {
    db.settings.autoTranslate[chatId] = false;
    saveDatabase();
  }
  
  bot.sendMessage(chatId, 
    `✅ Auto-translation disabled.`,
    { parse_mode: 'Markdown' }
  );
}

export async function handleTranslate(bot, msg, match) {
  const chatId = msg.chat.id;
  const parts = match[1].split('|').map(p => p.trim());
  
  if (parts.length < 2) {
    bot.sendMessage(chatId, 
      '❌ Format: `/translate <lang> | <text>`\nExample: `/translate ru | Hello everyone!`\n\nLanguages: en, ru, ar, fr, es, pt, de, zh',
      { parse_mode: 'Markdown' }
    );
    return;
  }
  
  const [targetLang, text] = parts;
  
  bot.sendMessage(chatId, '🔄 Translating...');
  
  const translated = await translateText(text, targetLang);
  
  bot.sendMessage(chatId, 
    `🌍 *Translation to ${targetLang.toUpperCase()}:*\n\n${translated}`,
    { parse_mode: 'Markdown' }
  );
}

export async function handleAutoTranslate(bot, msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const db = getDatabase();
  
  // Check if auto-translate is enabled for this chat
  if (!db.settings.autoTranslate || !db.settings.autoTranslate[chatId]) {
    return;
  }
  
  // Don't translate bot commands
  if (msg.text && msg.text.startsWith('/')) {
    return;
  }
  
  // Get sender's language
  const sender = db.members.find(m => m.userId === userId);
  if (!sender || !sender.language) return;
  
  const senderLang = sender.language;
  const text = msg.text;
  
  // Get all unique languages in the guild (except sender's)
  const targetLanguages = [...new Set(
    db.members
      .filter(m => m.language && m.language !== senderLang)
      .map(m => m.language)
  )];
  
  if (targetLanguages.length === 0) return;
  
  // Translate to each language
  const translations = await Promise.all(
    targetLanguages.map(async (lang) => {
      const translated = await translateText(text, lang, senderLang);
      return { lang, text: translated };
    })
  );
  
  // Send translations
  let translationMessage = `🌍 *Auto-Translation*\n\n`;
  translationMessage += `Original (${senderLang}): ${text}\n\n`;
  
  translations.forEach(({ lang, text }) => {
    const langEmoji = {
      en: '🇬🇧', ru: '🇷🇺', ar: '🇸🇦', fr: '🇫🇷',
      es: '🇪🇸', pt: '🇵🇹', de: '🇩🇪', zh: '🇨🇳'
    };
    translationMessage += `${langEmoji[lang] || '🌐'} ${lang.toUpperCase()}: ${text}\n`;
  });
  
  bot.sendMessage(chatId, translationMessage, { parse_mode: 'Markdown' });
}

export function handleTranslateHelp(bot, msg) {
  const chatId = msg.chat.id;
  
  const message = `
🌍 *TRANSLATION FEATURES*

*Auto-Translation:*
\`/translateon\` - Enable auto-translation
\`/translateoff\` - Disable auto-translation

When enabled, messages are automatically translated to all guild members' languages!

*Manual Translation:*
\`/translate <lang> | <text>\`

Example:
\`/translate ru | Hello everyone!\`
Result: Привет всем!

*Supported Languages:*
🇬🇧 en - English
🇷🇺 ru - Russian
🇸🇦 ar - Arabic
🇫🇷 fr - French
🇪🇸 es - Spanish
🇵🇹 pt - Portuguese
🇩🇪 de - German
🇨🇳 zh - Chinese

*How Auto-Translation Works:*
1. Enable with /translateon
2. Members set their language with /setlang
3. When someone sends a message, it's automatically translated to all other languages
4. Everyone sees the message in their language!

Perfect for international guilds! 🌍
  `;
  
  bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
}
