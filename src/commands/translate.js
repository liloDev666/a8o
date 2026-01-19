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
    `✅ *Auto-translation enabled!*\n\n🌍 Messages will be automatically translated\n📝 Only messages 10+ characters\n🔢 Max 4 languages shown\n⚡ Smart filtering to avoid spam\n\nUse /translateoff to disable.`,
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
  
  // Don't translate if no text or too short
  if (!msg.text || msg.text.trim().length < 3) {
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
    return; // Silent return if sender not found or no language set
  }
  
  const senderLang = sender.language;
  const text = msg.text;
  
  // Get all unique languages in the guild (except sender's)
  const targetLanguages = [...new Set(
    db.members
      .filter(m => m.language && m.language !== senderLang)
      .map(m => m.language)
  )];
  
  // Limit to max 4 languages to avoid spam (most common languages)
  const maxLanguages = 4;
  const limitedTargetLanguages = targetLanguages.slice(0, maxLanguages);
  
  if (limitedTargetLanguages.length === 0) {
    return; // No other languages to translate to
  }
  
  // Only translate if message is longer than 10 characters to avoid spam
  if (text.length < 10) {
    return;
  }
  
  try {
    // Translate to each language
    const translations = await Promise.all(
      limitedTargetLanguages.map(async (lang) => {
        const translated = await translateText(text, lang, senderLang);
        return { lang, text: translated };
      })
    );
    
    // Filter out failed translations (where translated text equals original)
    const successfulTranslations = translations.filter(t => 
      t.text !== text && t.text.length > 0
    );
    
    if (successfulTranslations.length === 0) {
      return; // No successful translations
    }
    
    // Create compact translation message
    let translationMessage = `🌍 *${sender.gameName || sender.username}*\n\n`;
    
    // Show original with flag
    const langEmojis = {
      en: '🇬🇧', ru: '🇷🇺', ar: '🇸🇦', fr: '🇫🇷',
      es: '🇪🇸', pt: '🇵🇹', de: '🇩🇪', zh: '🇨🇳'
    };
    
    translationMessage += `${langEmojis[senderLang] || '🌐'} ${text}\n\n`;
    
    // Add translations
    successfulTranslations.forEach(({ lang, text }) => {
      translationMessage += `${langEmojis[lang] || '🌐'} ${text}\n`;
    });
    
    // Add note if there were more languages
    if (targetLanguages.length > maxLanguages) {
      const remaining = targetLanguages.length - maxLanguages;
      translationMessage += `\n_+${remaining} more languages available_`;
    }
    
    bot.sendMessage(chatId, translationMessage, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Auto-translate error:', error);
    // Silent fail - don't spam chat with error messages
  }
}

export function handleTranslateHelp(bot, msg) {
  const chatId = msg.chat.id;
  
  const message = `
🌍 *TRANSLATION FEATURES*

*Auto-Translation:*
\`/translateon\` - Enable auto-translation
\`/translateoff\` - Disable auto-translation

*Smart Auto-Translation:*
✅ Only translates messages 10+ characters
✅ Shows max 4 most common languages
✅ Compact format with flags
✅ Filters failed translations
✅ No spam from short messages

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

*How It Works:*
1. Enable with /translateon
2. Members set language with /setlang
3. Send messages normally (10+ chars)
4. Bot shows translations with flags
5. Clean, professional format

Perfect for international guilds! 🌍
  `;
  
  bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
}
