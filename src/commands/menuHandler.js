import { 
  getMainMenu, getMembersMenu, getBattlesMenu, getStatsMenu,
  getGamesMenu, getEventsMenu, getAlertsMenu, getLanguageMenu,
  getSettingsMenu, getQuickActionsMenu
} from '../ui/menus.js';
import { handleProfile, handleMembers } from './members.js';
import { handleBattles, handleTargets, handleWarCoordination } from './battles.js';
import { handleStats, handleResources } from './resources.js';
import { handleEvents } from './events.js';
import { handleLeaderboard, handleMiniGame } from './contests.js';
import { handleGuildInfo } from './guild.js';
import { handleRoles, handleMyRole } from './roles.js';
import { handleAdvancedStats, handleGuildChart, handleActivityChart } from './analytics.js';

export function setupMenuHandlers(bot) {
  bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    const data = query.data;
    
    // Answer callback to remove loading state
    bot.answerCallbackQuery(query.id);
    
    // Main menu navigation
    if (data === 'menu_main') {
      bot.editMessageText(
        '🎮 *A8O Guild Bot - Main Menu*\n\nSelect an option:',
        {
          chat_id: chatId,
          message_id: messageId,
          parse_mode: 'Markdown',
          reply_markup: getMainMenu()
        }
      );
    }
    
    // Sub-menu navigation
    else if (data === 'menu_members') {
      bot.editMessageText(
        '👥 *MEMBERS MENU*\n\nManage guild members and view profiles:',
        {
          chat_id: chatId,
          message_id: messageId,
          parse_mode: 'Markdown',
          reply_markup: getMembersMenu()
        }
      );
    }
    
    else if (data === 'menu_battles') {
      bot.editMessageText(
        '⚔️ *BATTLES MENU*\n\nLog battles, manage targets, coordinate wars:',
        {
          chat_id: chatId,
          message_id: messageId,
          parse_mode: 'Markdown',
          reply_markup: getBattlesMenu()
        }
      );
    }
    
    else if (data === 'menu_stats') {
      bot.editMessageText(
        '📊 *STATISTICS MENU*\n\nView guild stats, charts, and analytics:',
        {
          chat_id: chatId,
          message_id: messageId,
          parse_mode: 'Markdown',
          reply_markup: getStatsMenu()
        }
      );
    }
    
    else if (data === 'menu_games') {
      bot.editMessageText(
        '🎮 *GAMES & CONTESTS*\n\nPlay mini-games and compete:',
        {
          chat_id: chatId,
          message_id: messageId,
          parse_mode: 'Markdown',
          reply_markup: getGamesMenu()
        }
      );
    }
    
    else if (data === 'menu_events') {
      bot.editMessageText(
        '📅 *EVENTS MENU*\n\nManage guild events and reminders:',
        {
          chat_id: chatId,
          message_id: messageId,
          parse_mode: 'Markdown',
          reply_markup: getEventsMenu()
        }
      );
    }
    
    else if (data === 'menu_alerts') {
      bot.editMessageText(
        '🔔 *ALERTS & NOTIFICATIONS*\n\nManage alerts and scan screenshots:',
        {
          chat_id: chatId,
          message_id: messageId,
          parse_mode: 'Markdown',
          reply_markup: getAlertsMenu()
        }
      );
    }
    
    else if (data === 'menu_language') {
      bot.editMessageText(
        '🌍 *LANGUAGE SETTINGS*\n\nSelect your preferred language:',
        {
          chat_id: chatId,
          message_id: messageId,
          parse_mode: 'Markdown',
          reply_markup: getLanguageMenu()
        }
      );
    }
    
    else if (data === 'menu_settings') {
      bot.editMessageText(
        '⚙️ *SETTINGS MENU*\n\nConfigure bot settings:',
        {
          chat_id: chatId,
          message_id: messageId,
          parse_mode: 'Markdown',
          reply_markup: getSettingsMenu()
        }
      );
    }
    
    else if (data === 'menu_help') {
      bot.editMessageText(
        `📋 *HELP CENTER*\n\n*Quick Commands:*\n\`/menu\` - Main menu\n\`/profile\` - Your profile\n\`/stats\` - Guild stats\n\`/events\` - Events\n\`/battles\` - Battles\n\n*Need more help?*\nUse the menu buttons for easy navigation!`,
        {
          chat_id: chatId,
          message_id: messageId,
          parse_mode: 'Markdown',
          reply_markup: getMainMenu()
        }
      );
    }
    
    // Action handlers
    else if (data === 'action_profile') {
      handleProfile(bot, { chat: { id: chatId }, from: query.from });
    }
    
    else if (data === 'action_members') {
      handleMembers(bot, { chat: { id: chatId } });
    }
    
    else if (data === 'action_battles') {
      handleBattles(bot, { chat: { id: chatId } });
    }
    
    else if (data === 'action_targets') {
      handleTargets(bot, { chat: { id: chatId } });
    }
    
    else if (data === 'action_war') {
      handleWarCoordination(bot, { chat: { id: chatId } });
    }
    
    else if (data === 'action_stats') {
      handleStats(bot, { chat: { id: chatId } });
    }
    
    else if (data === 'action_advstats') {
      handleAdvancedStats(bot, { chat: { id: chatId } });
    }
    
    else if (data === 'action_chart') {
      handleGuildChart(bot, { chat: { id: chatId } });
    }
    
    else if (data === 'action_activity') {
      handleActivityChart(bot, { chat: { id: chatId } });
    }
    
    else if (data === 'action_resources') {
      handleResources(bot, { chat: { id: chatId } });
    }
    
    else if (data === 'action_events') {
      handleEvents(bot, { chat: { id: chatId } });
    }
    
    else if (data === 'action_leaderboard') {
      handleLeaderboard(bot, { chat: { id: chatId } });
    }
    
    else if (data === 'action_game') {
      handleMiniGame(bot, { chat: { id: chatId } });
    }
    
    else if (data === 'action_guildinfo') {
      handleGuildInfo(bot, { chat: { id: chatId } });
    }
    
    else if (data === 'action_roles') {
      handleRoles(bot, { chat: { id: chatId } });
    }
    
    else if (data === 'action_myrole') {
      handleMyRole(bot, { chat: { id: chatId }, from: query.from });
    }
    
    // Quick actions
    else if (data.startsWith('quick_')) {
      const action = data.replace('quick_', '');
      bot.sendMessage(chatId, 
        `⚡ *Quick ${action.toUpperCase()}*\n\nUse the command:\n\`/${action === 'battle' ? 'addbattle' : action === 'resource' ? 'addresource' : action === 'target' ? 'addtarget' : 'addevent'}\``,
        { parse_mode: 'Markdown' }
      );
    }
    
    // Instruction messages for actions requiring input
    else if (data === 'action_register') {
      bot.sendMessage(chatId, 
        '📝 *Register with the guild!*\n\nUse: `/register YourGameName`\n\nExample: `/register DragonSlayer`',
        { parse_mode: 'Markdown' }
      );
    }
    
    else if (data === 'action_addbattle') {
      bot.sendMessage(chatId,
        '⚔️ *Log a Battle*\n\nFormat: `/addbattle <enemy> | <result> | <kills>`\n\nExample:\n`/addbattle [XYZ]Enemy | won | 2500000`',
        { parse_mode: 'Markdown' }
      );
    }
    
    else if (data === 'action_addtarget') {
      bot.sendMessage(chatId,
        '🎯 *Add Enemy Target*\n\nFormat: `/addtarget <name> | <guild> | <might>`\n\nExample:\n`/addtarget EnemyKing | [ABC] | 75000000`',
        { parse_mode: 'Markdown' }
      );
    }
    
    else if (data === 'action_addevent') {
      bot.sendMessage(chatId,
        '📅 *Create Event*\n\nFormat: `/addevent <name> | <date> | <time>`\n\nExample:\n`/addevent Guild War | 2026-01-25 | 20:00`',
        { parse_mode: 'Markdown' }
      );
    }
    
    else if (data === 'action_addresource') {
      bot.sendMessage(chatId,
        '📦 *Log Resources*\n\nFormat: `/addresource <type> <amount>`\n\nExample:\n`/addresource gold 5000000`\n\nTypes: gold, food, stone, wood, ore, gems',
        { parse_mode: 'Markdown' }
      );
    }
    
    else if (data === 'action_startcontest') {
      bot.sendMessage(chatId,
        '🎮 *Start Contest*\n\nFormat: `/startcontest <name> | <type> | <hours>`\n\nExample:\n`/startcontest Kill Event | kills | 24`',
        { parse_mode: 'Markdown' }
      );
    }
  });
}
