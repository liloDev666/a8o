import { getDatabase } from '../database.js';
import { hasPermission } from './roles.js';

export function handleAnnounce(bot, msg, match) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  if (!hasPermission(userId, 'announce')) {
    bot.sendMessage(chatId, '❌ Only R4+ can send announcements!');
    return;
  }
  
  const announcement = match[1].trim();
  const message = `
📢 *GUILD ANNOUNCEMENT*

${announcement}

— A8O Leadership
  `;
  
  bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
}

export function handleGuildInfo(bot, msg) {
  const chatId = msg.chat.id;
  const db = getDatabase();
  
  const info = `
🏰 *Guild A8O*

${db.settings.guildTag} Lords Mobile Guild

👥 Members: ${db.members.length}
📅 Events: ${db.events.length}
📦 Resources Logged: ${db.resources.length}

*About Us:*
We're a competitive Lords Mobile guild focused on teamwork, strategy, and dominating the kingdom!

*Join Requirements:*
• Active daily
• Participate in guild events
• Help fellow members
• Communicate in guild chat

Use /help to see all available commands!
  `;
  
  bot.sendMessage(chatId, info, { parse_mode: 'Markdown' });
}
