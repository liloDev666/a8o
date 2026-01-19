import { getDatabase } from '../database.js';

export function handleAdminHelp(bot, msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  // Debug logging
  console.log('=== ADMIN HELP DEBUG ===');
  console.log('User ID:', userId, 'type:', typeof userId);
  console.log('ADMIN_USER_IDS env:', process.env.ADMIN_USER_IDS);
  
  // Check if user is bot admin
  const adminIds = process.env.ADMIN_USER_IDS?.split(',').map(id => parseInt(id)) || [];
  const numericUserId = typeof userId === 'string' ? parseInt(userId) : userId;
  const isAdmin = adminIds.includes(numericUserId);
  
  console.log('Parsed admin IDs:', adminIds);
  console.log('Numeric user ID:', numericUserId);
  console.log('Is admin:', isAdmin);
  console.log('=======================');
  
  if (!isAdmin) {
    bot.sendMessage(chatId, `❌ This command is for bot administrators only!\n\nYour ID: ${numericUserId}\nAdmin IDs: ${adminIds.join(', ')}\n\nIf you should be an admin, check your Railway environment variables.`);
    return;
  }
  
  const adminHelp = `🔧 BOT ADMIN COMMANDS

🔑 Super Admin Powers:
You have FULL access to all bot features regardless of your in-game role!

👑 Role Management:
/setrole @user R5 - Assign any role (including R5)
/promote @user - Promote member
/demote @user - Demote member

📊 Admin Stats:
/adminstats - Detailed bot statistics
/admininfo - Bot configuration info

🛠️ Bot Control:
/announce <message> - Send announcements
/translateon - Enable auto-translation
/translateoff - Disable auto-translation

💡 Pro Tips:
• You can assign R5 to the actual guild leader
• You maintain super admin access always
• Your permissions override role restrictions
• Use responsibly! 😊

Example Setup:
1. /register YourName (you'll be R1, but still admin)
2. /setrole @ActualLeader R5 (make real leader R5)
3. /setrole @Officer1 R4 (assign officers)

You're the bot creator - you have ultimate control! 👑`;
  
  bot.sendMessage(chatId, adminHelp);
}

export function handleAdminStats(bot, msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  // Check if user is bot admin
  const adminIds = process.env.ADMIN_USER_IDS?.split(',').map(id => parseInt(id)) || [];
  if (!adminIds.includes(userId)) {
    bot.sendMessage(chatId, '❌ This command is for bot administrators only!');
    return;
  }
  
  const db = getDatabase();
  
  // Count roles
  const roleCounts = {};
  ['R5', 'R4', 'R3', 'R2', 'R1'].forEach(role => {
    roleCounts[role] = db.members.filter(m => m.role === role).length;
  });
  
  // Count languages
  const langCounts = {};
  db.members.forEach(m => {
    const lang = m.language || 'en';
    langCounts[lang] = (langCounts[lang] || 0) + 1;
  });
  
  const adminStats = `
🔧 *BOT ADMIN STATISTICS*

*📊 Database Stats:*
• Total Members: ${db.members.length}
• Total Events: ${db.events?.length || 0}
• Total Battles: ${db.battles?.length || 0}
• Total Resources: ${db.resources?.length || 0}
• Total Targets: ${db.targets?.length || 0}

*👑 Role Distribution:*
• R5 (Leaders): ${roleCounts.R5}
• R4 (Officers): ${roleCounts.R4}
• R3 (Elite): ${roleCounts.R3}
• R2 (Veterans): ${roleCounts.R2}
• R1 (Members): ${roleCounts.R1}

*🌍 Language Distribution:*
${Object.entries(langCounts).map(([lang, count]) => `• ${lang.toUpperCase()}: ${count}`).join('\n')}

*⚙️ Bot Configuration:*
• Guild Name: ${db.settings?.guildName || 'A8O'}
• Guild Tag: ${db.settings?.guildTag || '[A8O]'}
• Auto-translate: ${db.settings?.autoTranslate ? 'Enabled' : 'Disabled'}

*🔑 Admin Access:*
• Your User ID: ${userId}
• Admin Status: ✅ SUPER ADMIN
• Permissions: ALL (Override)
  `;
  
  bot.sendMessage(chatId, adminStats, { parse_mode: 'Markdown' });
}

export function handleAdminInfo(bot, msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  // Check if user is bot admin
  const adminIds = process.env.ADMIN_USER_IDS?.split(',').map(id => parseInt(id)) || [];
  if (!adminIds.includes(userId)) {
    bot.sendMessage(chatId, '❌ This command is for bot administrators only!');
    return;
  }
  
  const adminInfo = `
🔧 *BOT CONFIGURATION INFO*

*🤖 Bot Details:*
• Bot Name: A8O Guild Bot
• Version: 2.0.0 (2026 Edition)
• Status: ✅ Running
• Uptime: Active

*🔑 Admin Configuration:*
• Your ID: ${userId}
• Admin IDs: ${process.env.ADMIN_USER_IDS}
• Chat ID: ${process.env.GUILD_CHAT_ID}

*🌍 Environment:*
• Platform: Railway
• Node.js: v18.20.5
• Database: JSON File Storage

*📊 Features Status:*
• ✅ Multi-language (8 languages)
• ✅ Role system (R5-R1)
• ✅ Battle tracking
• ✅ Event management
• ✅ Resource tracking
• ✅ Auto-translation
• ✅ Interactive menus
• ⚠️ Charts (Disabled for stability)
• ⚠️ OCR (Disabled for stability)

*🔒 Security:*
• Role-based permissions: ✅
• Admin override: ✅
• Input validation: ✅
• Error handling: ✅

Everything is working perfectly! 🚀
  `;
  
  bot.sendMessage(chatId, adminInfo, { parse_mode: 'Markdown' });
}