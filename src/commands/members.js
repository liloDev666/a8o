import { addMember, getMember, getDatabase, updateMember } from '../database.js';

export function handleRegister(bot, msg, match) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const gameName = match[1].trim();
  
  const existingMember = getMember(userId);
  
  if (existingMember) {
    bot.sendMessage(chatId, `You're already registered as *${existingMember.gameName}*!`, 
      { parse_mode: 'Markdown' });
    return;
  }
  
  const member = {
    userId,
    username: msg.from.username || msg.from.first_name,
    gameName,
    joinedAt: Date.now(),
    might: 0,
    kills: 0,
    helps: 0
  };
  
  addMember(member);
  
  bot.sendMessage(chatId, 
    `✅ Welcome to A8O, *${gameName}*!\n\nUse /profile to view your stats.`,
    { parse_mode: 'Markdown' }
  );
}

export function handleProfile(bot, msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  const member = getMember(userId);
  
  if (!member) {
    bot.sendMessage(chatId, 
      '❌ You need to register first!\nUse: `/register YourGameName`',
      { parse_mode: 'Markdown' }
    );
    return;
  }
  
  const joinDate = new Date(member.joinedAt).toLocaleDateString();
  
  const profile = `
👤 *${member.gameName}*

⚔️ Might: ${member.might.toLocaleString()}
💀 Kills: ${member.kills.toLocaleString()}
🤝 Helps: ${member.helps.toLocaleString()}
📅 Joined: ${joinDate}

Use \`/updatemight <amount>\` to update your might!
  `;
  
  bot.sendMessage(chatId, profile, { parse_mode: 'Markdown' });
}

export function handleMembers(bot, msg) {
  const chatId = msg.chat.id;
  const db = getDatabase();
  
  if (db.members.length === 0) {
    bot.sendMessage(chatId, '📭 No members registered yet!');
    return;
  }
  
  const sortedMembers = [...db.members].sort((a, b) => b.might - a.might);
  
  let memberList = `👥 *A8O Guild Members* (${db.members.length})\n\n`;
  
  sortedMembers.forEach((member, index) => {
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '▪️';
    memberList += `${medal} *${member.gameName}*\n`;
    memberList += `   Might: ${member.might.toLocaleString()} | Kills: ${member.kills.toLocaleString()}\n\n`;
  });
  
  bot.sendMessage(chatId, memberList, { parse_mode: 'Markdown' });
}
