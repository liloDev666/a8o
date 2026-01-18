import { addResource, getRecentResources, getMember, getDatabase } from '../database.js';

export function handleAddResource(bot, msg, match) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const parts = match[1].trim().split(' ');
  
  if (parts.length < 2) {
    bot.sendMessage(chatId, 
      '❌ Format: `/addresource <type> <amount>`\nExample: `/addresource gold 1000000`',
      { parse_mode: 'Markdown' }
    );
    return;
  }
  
  const [type, amountStr] = parts;
  const amount = parseInt(amountStr);
  
  if (isNaN(amount)) {
    bot.sendMessage(chatId, '❌ Amount must be a number!');
    return;
  }
  
  // Ensure userId is a number for consistent comparison
  const numericUserId = typeof userId === 'string' ? parseInt(userId) : userId;
  const member = getMember(numericUserId);
  const username = member ? member.gameName : (msg.from.username || msg.from.first_name);
  
  const resource = {
    id: Date.now(),
    type: type.toLowerCase(),
    amount,
    addedBy: username,
    timestamp: Date.now()
  };
  
  addResource(resource);
  
  const emoji = getResourceEmoji(type);
  bot.sendMessage(chatId, 
    `✅ ${emoji} *${amount.toLocaleString()}* ${type} added by ${username}!`,
    { parse_mode: 'Markdown' }
  );
}

export function handleResources(bot, msg) {
  const chatId = msg.chat.id;
  const resources = getRecentResources(10);
  
  if (resources.length === 0) {
    bot.sendMessage(chatId, '📭 No resources logged yet!');
    return;
  }
  
  let resourceList = `📦 *Recent Resources*\n\n`;
  
  resources.forEach((res) => {
    const emoji = getResourceEmoji(res.type);
    const date = new Date(res.timestamp).toLocaleDateString();
    resourceList += `${emoji} ${res.amount.toLocaleString()} ${res.type}\n`;
    resourceList += `   by ${res.addedBy} - ${date}\n\n`;
  });
  
  bot.sendMessage(chatId, resourceList, { parse_mode: 'Markdown' });
}

export function handleStats(bot, msg) {
  const chatId = msg.chat.id;
  const db = getDatabase();
  
  const totalMembers = db.members.length;
  const totalMight = db.members.reduce((sum, m) => sum + m.might, 0);
  const totalKills = db.members.reduce((sum, m) => sum + m.kills, 0);
  
  const resourcesByType = {};
  db.resources.forEach(res => {
    resourcesByType[res.type] = (resourcesByType[res.type] || 0) + res.amount;
  });
  
  let stats = `📊 *A8O Guild Statistics*\n\n`;
  stats += `👥 Members: ${totalMembers}\n`;
  stats += `⚔️ Total Might: ${totalMight.toLocaleString()}\n`;
  stats += `💀 Total Kills: ${totalKills.toLocaleString()}\n\n`;
  
  if (Object.keys(resourcesByType).length > 0) {
    stats += `📦 *Resources Collected:*\n`;
    Object.entries(resourcesByType).forEach(([type, amount]) => {
      const emoji = getResourceEmoji(type);
      stats += `${emoji} ${type}: ${amount.toLocaleString()}\n`;
    });
  }
  
  bot.sendMessage(chatId, stats, { parse_mode: 'Markdown' });
}

function getResourceEmoji(type) {
  const emojis = {
    gold: '💰',
    food: '🌾',
    stone: '🪨',
    wood: '🪵',
    ore: '⛏️',
    gems: '💎'
  };
  return emojis[type.toLowerCase()] || '📦';
}
