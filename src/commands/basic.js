import { t, getUserLanguage } from '../i18n/translations.js';
import { getDatabase } from '../database.js';
import { getMainMenu } from '../ui/menus.js';
import { getMainMenu } from '../ui/menus.js';

export function handleStart(bot, msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const db = getDatabase();
  const lang = getUserLanguage(userId, db);
  
  const welcomeMessage = `
╔═══════════════════════╗
║   🏰 A8O GUILD BOT   ║
║      2026 Edition     ║
╚═══════════════════════╝

${t(lang, 'welcome.title')}

${t(lang, 'welcome.subtitle')}

✨ *What's New in 2026:*
• Modern interactive menus
• Role-based permissions
• Auto-translation (8 languages)
• Visual analytics & charts
• Smart notifications
• Screenshot scanner

🚀 *Quick Start:*
1️⃣ ${t(lang, 'welcome.register')}
2️⃣ Set your language below
3️⃣ Explore the menu!

${t(lang, 'welcome.footer')}
  `;
  
  bot.sendMessage(chatId, welcomeMessage, { 
    parse_mode: 'Markdown',
    reply_markup: getMainMenu()
  });
}

export function handleHelp(bot, msg) {
  const chatId = msg.chat.id;
  
  const keyboard = {
    inline_keyboard: [
      [
        { text: '👥 Members', callback_data: 'help_members' },
        { text: '⚔️ Battles', callback_data: 'help_battles' }
      ],
      [
        { text: '📊 Analytics', callback_data: 'help_analytics' },
        { text: '🎮 Games', callback_data: 'help_games' }
      ],
      [
        { text: '🔔 Alerts', callback_data: 'help_alerts' },
        { text: '📸 Scanner', callback_data: 'help_scanner' }
      ]
    ]
  };
  
  const helpMessage = `
📋 *A8O GUILD BOT - COMMAND CENTER*

*👥 MEMBERS*
\`/register <name>\` - Join the guild
\`/profile\` - Your stats
\`/members\` - Member list

*⚔️ BATTLES*
\`/addbattle <enemy>|<result>|<kills>\`
\`/battles\` - Battle history
\`/addtarget <name>|<guild>|<might>\`
\`/targets\` - Active targets
\`/war\` - War coordination

*📊 ANALYTICS*
\`/stats\` - Guild stats
\`/advstats\` - Advanced stats
\`/chart\` - Might chart
\`/activity\` - Activity chart

*🎮 CONTESTS & GAMES*
\`/startcontest <name>|<type>|<hours>\`
\`/leaderboard\` - Contest rankings
\`/game\` - Play mini-games

*🔔 ALERTS*
\`/remind <event>|<time>\`
\`/monster <info>\` - Monster alert
\`/darknest <level>\` - Darknest alert
\`/subscribe <type>\` - Get notifications

*📸 SCANNER*
\`/scan\` - Analyze screenshot
\`/scanhelp\` - Scanner guide

*📅 EVENTS*
\`/addevent <name>|<date>|<time>\`
\`/events\` - Upcoming events

*📦 RESOURCES*
\`/addresource <type> <amount>\`
\`/resources\` - Resource log

Click buttons below for detailed help! 💪
  `;
  
  bot.sendMessage(chatId, helpMessage, { 
    parse_mode: 'Markdown',
    reply_markup: keyboard 
  });
}

export function handleHelp(bot, msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const db = getDatabase();
  const lang = getUserLanguage(userId, db);
  
  const helpMessage = `
╔═══════════════════════╗
║   📋 COMMAND CENTER   ║
╚═══════════════════════╝

*🎯 Quick Commands:*

\`/menu\` - Open main menu
\`/profile\` - Your profile
\`/stats\` - Guild statistics
\`/events\` - Upcoming events
\`/battles\` - Battle history

*💡 Pro Tips:*
• Use the menu buttons for easy navigation
• Set your language for personalized experience
• Enable auto-translate for multilingual chat
• Check /roles for your permissions

*🆘 Need Help?*
Use the interactive menu below or type:
\`/help <topic>\`

Topics: members, battles, events, stats, games, alerts

*📱 Mobile Friendly:*
All features work perfectly on mobile!

Click a button below to get started! 👇
  `;
  
  bot.sendMessage(chatId, helpMessage, { 
    parse_mode: 'Markdown',
    reply_markup: getMainMenu()
  });
}

export function handleMenu(bot, msg) {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, 
    '🎮 *A8O Guild Bot - Main Menu*\n\nSelect an option below:',
    { 
      parse_mode: 'Markdown',
      reply_markup: getMainMenu()
    }
  );
}


import { getMainMenu } from '../ui/menus.js';
