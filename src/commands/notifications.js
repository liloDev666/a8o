import { getDatabase, saveDatabase } from '../database.js';

export function handleSetReminder(bot, msg, match) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const parts = match[1].split('|').map(p => p.trim());
  
  if (parts.length < 2) {
    bot.sendMessage(chatId, 
      '❌ Format: `/remind <event> | <time>`\nExample: `/remind Monster Hunt | 30m`',
      { parse_mode: 'Markdown' }
    );
    return;
  }
  
  const [event, timeStr] = parts;
  const minutes = parseTimeString(timeStr);
  
  if (!minutes) {
    bot.sendMessage(chatId, '❌ Invalid time format! Use: 30m, 1h, 2h30m');
    return;
  }
  
  setTimeout(() => {
    bot.sendMessage(chatId, 
      `⏰ *REMINDER*\n\n${event} is starting now!\n\n@${msg.from.username || msg.from.first_name}`,
      { parse_mode: 'Markdown' }
    );
  }, minutes * 60 * 1000);
  
  bot.sendMessage(chatId, 
    `✅ Reminder set for *${event}* in ${timeStr}!`,
    { parse_mode: 'Markdown' }
  );
}

export function handleMonsterAlert(bot, msg, match) {
  const chatId = msg.chat.id;
  const monsterInfo = match[1].trim();
  
  const keyboard = {
    inline_keyboard: [[
      { text: '🎯 I\'m Going!', callback_data: 'monster_join' },
      { text: '📍 Share Location', callback_data: 'monster_location' }
    ]]
  };
  
  bot.sendMessage(chatId, 
    `🐉 *MONSTER ALERT!*\n\n${monsterInfo}\n\nWho's joining the hunt?`,
    { parse_mode: 'Markdown', reply_markup: keyboard }
  );
}

export function handleDarknestAlert(bot, msg, match) {
  const chatId = msg.chat.id;
  const level = match[1].trim();
  
  const keyboard = {
    inline_keyboard: [
      [
        { text: '⚔️ Rally Leader', callback_data: 'darknest_lead' },
        { text: '🛡️ Join Rally', callback_data: 'darknest_join' }
      ]
    ]
  };
  
  bot.sendMessage(chatId, 
    `🏰 *DARKNEST ALERT!*\n\nLevel ${level} Darknest spotted!\n\nWho's leading the rally?`,
    { parse_mode: 'Markdown', reply_markup: keyboard }
  );
}

export function handleSubscribe(bot, msg, match) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const type = match[1].toLowerCase();
  
  const validTypes = ['events', 'battles', 'monsters', 'darknest', 'all'];
  
  if (!validTypes.includes(type)) {
    bot.sendMessage(chatId, 
      `❌ Invalid type! Choose from: ${validTypes.join(', ')}`,
      { parse_mode: 'Markdown' }
    );
    return;
  }
  
  const db = getDatabase();
  if (!db.subscriptions) db.subscriptions = {};
  if (!db.subscriptions[userId]) db.subscriptions[userId] = [];
  
  if (!db.subscriptions[userId].includes(type)) {
    db.subscriptions[userId].push(type);
    saveDatabase();
  }
  
  bot.sendMessage(chatId, 
    `✅ Subscribed to *${type}* notifications!`,
    { parse_mode: 'Markdown' }
  );
}

export function handleUnsubscribe(bot, msg, match) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const type = match[1].toLowerCase();
  
  const db = getDatabase();
  if (db.subscriptions && db.subscriptions[userId]) {
    db.subscriptions[userId] = db.subscriptions[userId].filter(t => t !== type);
    saveDatabase();
  }
  
  bot.sendMessage(chatId, 
    `✅ Unsubscribed from *${type}* notifications!`,
    { parse_mode: 'Markdown' }
  );
}

function parseTimeString(timeStr) {
  const hourMatch = timeStr.match(/(\d+)h/);
  const minMatch = timeStr.match(/(\d+)m/);
  
  let minutes = 0;
  if (hourMatch) minutes += parseInt(hourMatch[1]) * 60;
  if (minMatch) minutes += parseInt(minMatch[1]);
  
  return minutes > 0 ? minutes : null;
}
