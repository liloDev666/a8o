import { getDatabase, saveDatabase, getMember, updateMember } from '../database.js';
import { t, getUserLanguage } from '../i18n/translations.js';

const ROLES = {
  R5: { name: 'Leader', level: 5, emoji: '👑', permissions: ['all'] },
  R4: { name: 'Officer', level: 4, emoji: '⭐', permissions: ['manage_members', 'manage_events', 'announce', 'manage_targets', 'manage_contests'] },
  R3: { name: 'Elite', level: 3, emoji: '💎', permissions: ['manage_events', 'manage_targets', 'add_battles'] },
  R2: { name: 'Veteran', level: 2, emoji: '🛡️', permissions: ['add_battles', 'add_resources'] },
  R1: { name: 'Member', level: 1, emoji: '⚔️', permissions: ['view', 'add_resources'] }
};

export function hasPermission(userId, permission) {
  const member = getMember(userId);
  if (!member) return false;
  
  const role = ROLES[member.role] || ROLES.R1;
  
  // R5 has all permissions
  if (role.level === 5) return true;
  
  return role.permissions.includes(permission);
}

export function handleSetRole(bot, msg, match) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const db = getDatabase();
  const lang = getUserLanguage(userId, db);
  
  // Only R5 can set roles
  if (!hasPermission(userId, 'all')) {
    bot.sendMessage(chatId, '❌ Only the guild leader (R5) can assign roles!');
    return;
  }
  
  const parts = match[1].split(' ').map(p => p.trim());
  if (parts.length < 2) {
    bot.sendMessage(chatId, 
      '❌ Format: `/setrole @username R4`\nRoles: R5, R4, R3, R2, R1',
      { parse_mode: 'Markdown' }
    );
    return;
  }
  
  const [username, role] = parts;
  const targetUsername = username.replace('@', '');
  
  if (!ROLES[role]) {
    bot.sendMessage(chatId, '❌ Invalid role! Use: R5, R4, R3, R2, R1');
    return;
  }
  
  const targetMember = db.members.find(m => 
    m.username === targetUsername || m.gameName === targetUsername
  );
  
  if (!targetMember) {
    bot.sendMessage(chatId, '❌ Member not found! They need to /register first.');
    return;
  }
  
  updateMember(targetMember.userId, { role });
  
  const roleInfo = ROLES[role];
  bot.sendMessage(chatId, 
    `✅ ${roleInfo.emoji} *${targetMember.gameName}* promoted to *${roleInfo.name} (${role})*!\n\nPermissions: ${roleInfo.permissions.join(', ')}`,
    { parse_mode: 'Markdown' }
  );
}

export function handleRoles(bot, msg) {
  const chatId = msg.chat.id;
  const db = getDatabase();
  
  let roleList = `👑 *GUILD HIERARCHY*\n\n`;
  
  Object.entries(ROLES).reverse().forEach(([code, info]) => {
    const members = db.members.filter(m => m.role === code);
    roleList += `${info.emoji} *${info.name} (${code})* - ${members.length} members\n`;
    roleList += `   Permissions: ${info.permissions.join(', ')}\n`;
    
    if (members.length > 0 && members.length <= 5) {
      members.forEach(m => {
        roleList += `   • ${m.gameName}\n`;
      });
    }
    roleList += '\n';
  });
  
  const userId = msg.from?.id;
  roleList += `\n*Your Role:* ${getMemberRole(userId)}`;
  
  bot.sendMessage(chatId, roleList, { parse_mode: 'Markdown' });
}

export function handleMyRole(bot, msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const member = getMember(userId);
  
  if (!member) {
    bot.sendMessage(chatId, '❌ You need to /register first!');
    return;
  }
  
  const role = ROLES[member.role] || ROLES.R1;
  
  const message = `
${role.emoji} *Your Role: ${role.name} (${member.role})*

*Permissions:*
${role.permissions.map(p => `✅ ${p}`).join('\n')}

*Your Stats:*
⚔️ Might: ${member.might.toLocaleString()}
💀 Kills: ${member.kills.toLocaleString()}
🤝 Helps: ${member.helps.toLocaleString()}
📅 Member since: ${new Date(member.joinedAt).toLocaleDateString()}
  `;
  
  bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
}

export function handlePromote(bot, msg, match) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const db = getDatabase();
  
  if (!hasPermission(userId, 'manage_members')) {
    bot.sendMessage(chatId, '❌ You need R4+ permissions to promote members!');
    return;
  }
  
  const targetUsername = match[1].trim().replace('@', '');
  const targetMember = db.members.find(m => 
    m.username === targetUsername || m.gameName === targetUsername
  );
  
  if (!targetMember) {
    bot.sendMessage(chatId, '❌ Member not found!');
    return;
  }
  
  const currentRole = ROLES[targetMember.role] || ROLES.R1;
  const newRoleLevel = Math.min(currentRole.level + 1, 4); // Can't promote to R5
  const newRoleCode = Object.keys(ROLES).find(k => ROLES[k].level === newRoleLevel);
  
  if (newRoleLevel === currentRole.level) {
    bot.sendMessage(chatId, '❌ Cannot promote further! Only R5 can assign R5 role.');
    return;
  }
  
  updateMember(targetMember.userId, { role: newRoleCode });
  
  const newRole = ROLES[newRoleCode];
  bot.sendMessage(chatId, 
    `🎉 ${newRole.emoji} *${targetMember.gameName}* promoted to *${newRole.name} (${newRoleCode})*!`,
    { parse_mode: 'Markdown' }
  );
}

export function handleDemote(bot, msg, match) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const db = getDatabase();
  
  if (!hasPermission(userId, 'manage_members')) {
    bot.sendMessage(chatId, '❌ You need R4+ permissions to demote members!');
    return;
  }
  
  const targetUsername = match[1].trim().replace('@', '');
  const targetMember = db.members.find(m => 
    m.username === targetUsername || m.gameName === targetUsername
  );
  
  if (!targetMember) {
    bot.sendMessage(chatId, '❌ Member not found!');
    return;
  }
  
  const currentRole = ROLES[targetMember.role] || ROLES.R1;
  const newRoleLevel = Math.max(currentRole.level - 1, 1);
  const newRoleCode = Object.keys(ROLES).find(k => ROLES[k].level === newRoleLevel);
  
  if (newRoleLevel === currentRole.level) {
    bot.sendMessage(chatId, '❌ Already at lowest rank!');
    return;
  }
  
  updateMember(targetMember.userId, { role: newRoleCode });
  
  const newRole = ROLES[newRoleCode];
  bot.sendMessage(chatId, 
    `⬇️ ${newRole.emoji} *${targetMember.gameName}* demoted to *${newRole.name} (${newRoleCode})*`,
    { parse_mode: 'Markdown' }
  );
}

function getMemberRole(userId) {
  const member = getMember(userId);
  if (!member) return 'Not registered';
  
  const role = ROLES[member.role] || ROLES.R1;
  return `${role.emoji} ${role.name} (${member.role})`;
}

export { ROLES };
