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
    
    // For action handlers, delete the menu message and send new response
    if (data.startsWith('action_')) {
      // Delete the menu message
      try {
        await bot.deleteMessage(chatId, messageId);
      } catch (error) {
        console.log('Could not delete menu message:', error.message);
      }
      
      // Handle actions
      if (data === 'action_profile') {
        const fakeMsg = { chat: { id: chatId }, from: query.from };
        handleProfile(bot, fakeMsg);
      }
      else if (data === 'action_members') {
        const fakeMsg = { chat: { id: chatId } };
        handleMembers(bot, fakeMsg);
      }
      else if (data === 'action_battles') {
        const fakeMsg = { chat: { id: chatId } };
        handleBattles(bot, fakeMsg);
      }
      else if (data === 'action_targets') {
        const fakeMsg = { chat: { id: chatId } };
        handleTargets(bot, fakeMsg);
      }
      else if (data === 'action_war') {
        const fakeMsg = { chat: { id: chatId } };
        handleWarCoordination(bot, fakeMsg);
      }
      else if (data === 'action_stats') {
        const fakeMsg = { chat: { id: chatId } };
        handleStats(bot, fakeMsg);
      }
      else if (data === 'action_advstats') {
        const fakeMsg = { chat: { id: chatId } };
        handleAdvancedStats(bot, fakeMsg);
      }
      else if (data === 'action_chart') {
        const fakeMsg = { chat: { id: chatId } };
        handleGuildChart(bot, fakeMsg);
      }
      else if (data === 'action_activity') {
        const fakeMsg = { chat: { id: chatId } };
        handleActivityChart(bot, fakeMsg);
      }
      else if (data === 'action_resources') {
        const fakeMsg = { chat: { id: chatId } };
        handleResources(bot, fakeMsg);
      }
      else if (data === 'action_events') {
        const fakeMsg = { chat: { id: chatId } };
        handleEvents(bot, fakeMsg);
      }
      else if (data === 'action_leaderboard') {
        const fakeMsg = { chat: { id: chatId } };
        handleLeaderboard(bot, fakeMsg);
      }
      else if (data === 'action_game') {
        const fakeMsg = { chat: { id: chatId } };
        handleMiniGame(bot, fakeMsg);
      }
      else if (data === 'action_guildinfo') {
        const fakeMsg = { chat: { id: chatId } };
        handleGuildInfo(bot, fakeMsg);
      }
      else if (data === 'action_roles') {
        const fakeMsg = { chat: { id: chatId } };
        handleRoles(bot, fakeMsg);
      }
      else if (data === 'action_myrole') {
        const fakeMsg = { 
          chat: { id: chatId }, 
          from: { 
            id: query.from.id,
            username: query.from.username,
            first_name: query.from.first_name
          }
        };
        handleMyRole(bot, fakeMsg);
      }
      else if (data === 'action_register') {
        bot.sendMessage(chatId, 
          '📝 Register with the guild!\n\nUse: /register YourGameName\n\nExample: /register DragonSlayer'
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
      
      return; // Exit early for actions
    }
    
    // For menu navigation, update the existing message
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
    
    // Quick actions - delete menu and send instruction
    else if (data.startsWith('quick_')) {
      try {
        await bot.deleteMessage(chatId, messageId);
      } catch (error) {
        console.log('Could not delete menu message:', error.message);
      }
      
      const action = data.replace('quick_', '');
      bot.sendMessage(chatId, 
        `⚡ *Quick ${action.toUpperCase()}*\n\nUse the command:\n\`/${action === 'battle' ? 'addbattle' : action === 'resource' ? 'addresource' : action === 'target' ? 'addtarget' : 'addevent'}\``,
        { parse_mode: 'Markdown' }
      );
    }
  });
}
