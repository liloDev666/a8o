import axios from 'axios';
import { getDatabase, saveDatabase } from '../database.js';

export async function translateText(text, targetLang, sourceLang = 'auto') {
  try {
    // Use Google Translate's public API endpoint
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (response.data && response.data[0] && response.data[0][0]) {
      // Extract translated text from response
      const translatedText = response.data[0].map(item => item[0]).join('');
      console.log(`Translated "${text}" from ${sourceLang} to ${targetLang}: "${translatedText}"`);
      return translatedText;
    }
    
    console.log('Translation API returned unexpected format:', response.data);
    return text;
  } catch (error) {
    console.error('Translation error:', error.message);
    console.error('Failed to translate:', text);
    return text; // Return original text if translation fails
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
  
  // Don't translate if no text
  if (!msg.text || msg.text.trim().length === 0) {
    return;
  }
  
  // Ensure userId is a number for consistent comparison
  const numericUserId = typeof userId === 'string' ? parseInt(userId) : userId;
  
  // Get sender's language
  const sender = db.members.find(m => {
    const memberUserId = typeof m.userId === 'string' ? parseInt(m.userId) : m.userId;
    return memberUserId === numericUserId;
  });
  
  if (!sender || !sender.language) {
    console.log('Auto-translate: Sender not found or no language set for user:', numericUserId);
    return;
  }
  
  const senderLang = sender.language;
  const text = msg.text;
  
  console.log('Auto-translate: Processing message from', sender.gameName, 'in', senderLang);
  
  // Get all unique languages in the guild (except sender's)
  const targetLanguages = [...new Set(
    db.members
      .filter(m => m.language && m.language !== senderLang)
      .map(m => m.language)
  )];
  
  console.log('Auto-translate: Target languages:', targetLanguages);
  
  if (targetLanguages.length === 0) {
    console.log('Auto-translate: No target languages found');
    return;
  }
  
  try {
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
    console.log('Auto-translate: Sent translations');
  } catch (error) {
    console.error('Auto-translate error:', error);
  }
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
