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
  // Check if user is bot admin (super admin)
  const adminIds = process.env.ADMIN_USER_IDS?.split(',').map(id => parseInt(id)) || [];
  const numericUserId = typeof userId === 'string' ? parseInt(userId) : userId;
  
  if (adminIds.includes(numericUserId)) {
    return true; // Bot admins have ALL permissions
  }
  
  const member = getMember(numericUserId);
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
  
  // Check if user is bot admin OR R5
  const adminIds = process.env.ADMIN_USER_IDS?.split(',').map(id => parseInt(id)) || [];
  const numericUserId = typeof userId === 'string' ? parseInt(userId) : userId;
  const isBotAdmin = adminIds.includes(numericUserId);
  const member = getMember(numericUserId);
  const isR5 = member && member.role === 'R5';
  
  if (!isBotAdmin && !isR5) {
    bot.sendMessage(chatId, '❌ Only bot admins or guild leader (R5) can assign roles!');
    return;
  }
  
  const parts = match[1].split(' ').map(p => p.trim());
  if (parts.length < 2) {
    bot.sendMessage(chatId, '❌ Format: /setrole @username R4\nRoles: R5, R4, R3, R2, R1');
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
  const adminNote = isBotAdmin ? ' (Bot Admin Override)' : '';
  
  let message = `✅ ${roleInfo.emoji} ${targetMember.gameName} promoted to ${roleInfo.name} (${role})!${adminNote}\n\n`;
  message += `Permissions: ${roleInfo.permissions.join(', ')}`;
  
  bot.sendMessage(chatId, message);
}

export function handleRoles(bot, msg) {
  const chatId = msg.chat.id;
  const db = getDatabase();
  
  let roleList = `👑 GUILD HIERARCHY\n\n`;
  
  Object.entries(ROLES).reverse().forEach(([code, info]) => {
    const members = db.members.filter(m => m.role === code);
    roleList += `${info.emoji} ${info.name} (${code}) - ${members.length} members\n`;
    roleList += `   Permissions: ${info.permissions.join(', ')}\n`;
    
    if (members.length > 0 && members.length <= 5) {
      members.forEach(m => {
        roleList += `   • ${m.gameName}\n`;
      });
    }
    roleList += '\n';
  });
  
  // Fix: Use proper user ID handling for "Your Role"
  const userId = msg.from?.id;
  if (userId) {
    const numericUserId = typeof userId === 'string' ? parseInt(userId) : userId;
    roleList += `\nYour Role: ${getMemberRole(numericUserId)}`;
  }
  
  bot.sendMessage(chatId, roleList);
}

export function handleMyRole(bot, msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  // Debug logging
  console.log('=== MY ROLE DEBUG ===');
  console.log('User ID from message:', userId, 'type:', typeof userId);
  console.log('ADMIN_USER_IDS env:', process.env.ADMIN_USER_IDS);
  
  // Ensure userId is a number for consistent comparison
  const numericUserId = typeof userId === 'string' ? parseInt(userId) : userId;
  const member = getMember(numericUserId);
  
  // Check if user is bot admin (super admin)
  const adminIds = process.env.ADMIN_USER_IDS?.split(',').map(id => parseInt(id)) || [];
  const isBotAdmin = adminIds.includes(numericUserId);
  
  console.log('Parsed admin IDs:', adminIds);
  console.log('Numeric user ID:', numericUserId);
  console.log('Is bot admin:', isBotAdmin);
  console.log('Member found:', member ? member.gameName : 'No');
  console.log('===================');
  
  if (!member) {
    if (isBotAdmin) {
      bot.sendMessage(chatId, 
        `🔧 *SUPER ADMIN STATUS*\n\n✅ Bot Administrator\n✅ Override All Permissions\n✅ Can assign any role including R5\n\n❌ You need to /register first to get guild role!\n\nUse: \`/register YourGameName\``,
        { parse_mode: 'Markdown' }
      );
    } else {
      bot.sendMessage(chatId, '❌ You need to /register first!');
    }
    return;
  }
  
  const role = ROLES[member.role] || ROLES.R1;
  
  let message = `${role.emoji} Your Role: ${role.name} (${member.role})\n\n`;
  
  message += `Permissions:\n`;
  role.permissions.forEach(p => {
    message += `✅ ${p}\n`;
  });
  
  if (isBotAdmin) {
    message += `\n🔧 SUPER ADMIN STATUS\n`;
    message += `✅ Bot Administrator\n`;
    message += `✅ Override All Permissions\n`;
    message += `✅ Can assign any role including R5\n\n`;
    message += `*Super Admin Commands:*\n`;
    message += `\`/setrole @username R5\` - Make someone guild leader\n`;
    message += `\`/setrole @username R4\` - Make officer\n`;
    message += `\`/adminhelp\` - Admin commands\n`;
  }
  
  message += `\nYour Stats:\n`;
  message += `⚔️ Might: ${member.might.toLocaleString()}\n`;
  message += `💀 Kills: ${member.kills.toLocaleString()}\n`;
  message += `🤝 Helps: ${member.helps.toLocaleString()}\n`;
  message += `📅 Member since: ${new Date(member.joinedAt).toLocaleDateString()}`;
  
  bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
}

export function handlePromote(bot, msg, match) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const db = getDatabase();
  
  // Check if user is bot admin OR has manage_members permission
  const adminIds = process.env.ADMIN_USER_IDS?.split(',').map(id => parseInt(id)) || [];
  const numericUserId = typeof userId === 'string' ? parseInt(userId) : userId;
  const isBotAdmin = adminIds.includes(numericUserId);
  
  if (!isBotAdmin && !hasPermission(numericUserId, 'manage_members')) {
    bot.sendMessage(chatId, '❌ You need R4+ permissions or be a bot admin to promote members!');
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
  const newRoleLevel = Math.min(currentRole.level + 1, 4); // Can't promote to R5 via promote
  const newRoleCode = Object.keys(ROLES).find(k => ROLES[k].level === newRoleLevel);
  
  if (newRoleLevel === currentRole.level) {
    bot.sendMessage(chatId, '❌ Cannot promote further! Use /setrole for R5 assignment.');
    return;
  }
  
  updateMember(targetMember.userId, { role: newRoleCode });
  
  const newRole = ROLES[newRoleCode];
  const adminNote = isBotAdmin ? ' (Bot Admin)' : '';
  
  bot.sendMessage(chatId, 
    `🎉 ${newRole.emoji} ${targetMember.gameName} promoted to ${newRole.name} (${newRoleCode})!${adminNote}`
  );
}

export function handleDemote(bot, msg, match) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const db = getDatabase();
  
  // Check if user is bot admin OR has manage_members permission
  const adminIds = process.env.ADMIN_USER_IDS?.split(',').map(id => parseInt(id)) || [];
  const numericUserId = typeof userId === 'string' ? parseInt(userId) : userId;
  const isBotAdmin = adminIds.includes(numericUserId);
  
  if (!isBotAdmin && !hasPermission(numericUserId, 'manage_members')) {
    bot.sendMessage(chatId, '❌ You need R4+ permissions or be a bot admin to demote members!');
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
  const adminNote = isBotAdmin ? ' (Bot Admin)' : '';
  
  bot.sendMessage(chatId, 
    `⬇️ ${newRole.emoji} ${targetMember.gameName} demoted to ${newRole.name} (${newRoleCode})${adminNote}`
  );
}

function getMemberRole(userId) {
  const numericUserId = typeof userId === 'string' ? parseInt(userId) : userId;
  const member = getMember(numericUserId);
  if (!member) return 'Not registered';
  
  const role = ROLES[member.role] || ROLES.R1;
  
  // Check if user is bot admin
  const adminIds = process.env.ADMIN_USER_IDS?.split(',').map(id => parseInt(id)) || [];
  const isBotAdmin = adminIds.includes(numericUserId);
  
  return `${role.emoji} ${role.name} (${member.role})${isBotAdmin ? ' + Bot Admin' : ''}`;
}

export { ROLES };
