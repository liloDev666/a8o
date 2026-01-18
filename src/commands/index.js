import { handleStart, handleHelp, handleMenu } from './basic.js';
import { handleRegister, handleProfile, handleMembers } from './members.js';
import { handleAddEvent, handleEvents, handleRemindEvent } from './events.js';
import { handleAddResource, handleResources, handleStats } from './resources.js';
import { handleAnnounce, handleGuildInfo } from './guild.js';
import { handleAddBattle, handleBattles, handleAddTarget, handleTargets, handleWarCoordination } from './battles.js';
import { handleStartContest, handleContestScore, handleLeaderboard, handleMiniGame } from './contests.js';
import { handleGuildChart, handleActivityChart, handleAdvancedStats } from './analytics.js';
import { handleScreenshot, handleScanHelp } from './ocr.js';
import { handleSetReminder, handleMonsterAlert, handleDarknestAlert, handleSubscribe, handleUnsubscribe } from './notifications.js';
import { handleSetLanguage, handleLanguages, handleLanguageCallback } from './language.js';
import { handleSetRole, handleRoles, handleMyRole, handlePromote, handleDemote, hasPermission } from './roles.js';
import { handleTranslate, handleTranslateOn, handleTranslateOff, handleTranslateHelp, handleAutoTranslate } from './translate.js';
import { setupMenuHandlers } from './menuHandler.js';

export function setupCommands(bot) {
  // Setup menu handlers
  setupMenuHandlers(bot);
  
  // Basic commands
  bot.onText(/\/start/, (msg) => handleStart(bot, msg));
  bot.onText(/\/help/, (msg) => handleHelp(bot, msg));
  bot.onText(/\/menu/, (msg) => handleMenu(bot, msg));
  
  // Language commands
  bot.onText(/\/setlang (.+)/, (msg, match) => handleSetLanguage(bot, msg, match));
  bot.onText(/\/languages/, (msg) => handleLanguages(bot, msg));
  bot.onText(/\/lang/, (msg) => handleLanguages(bot, msg));
  
  // Role commands
  bot.onText(/\/setrole (.+)/, (msg, match) => handleSetRole(bot, msg, match));
  bot.onText(/\/roles/, (msg) => handleRoles(bot, msg));
  bot.onText(/\/myrole/, (msg) => handleMyRole(bot, msg));
  bot.onText(/\/promote (.+)/, (msg, match) => handlePromote(bot, msg, match));
  bot.onText(/\/demote (.+)/, (msg, match) => handleDemote(bot, msg, match));
  
  // Translation commands
  bot.onText(/\/translate (.+)/, (msg, match) => handleTranslate(bot, msg, match));
  bot.onText(/\/translateon/, (msg) => handleTranslateOn(bot, msg));
  bot.onText(/\/translateoff/, (msg) => handleTranslateOff(bot, msg));
  bot.onText(/\/translatehelp/, (msg) => handleTranslateHelp(bot, msg));
  
  // Member commands
  bot.onText(/\/register (.+)/, (msg, match) => handleRegister(bot, msg, match));
  bot.onText(/\/profile/, (msg) => handleProfile(bot, msg));
  bot.onText(/\/members/, (msg) => handleMembers(bot, msg));
  
  // Event commands
  bot.onText(/\/addevent (.+)/, (msg, match) => handleAddEvent(bot, msg, match));
  bot.onText(/\/events/, (msg) => handleEvents(bot, msg));
  
  // Resource commands
  bot.onText(/\/addresource (.+)/, (msg, match) => handleAddResource(bot, msg, match));
  bot.onText(/\/resources/, (msg) => handleResources(bot, msg));
  bot.onText(/\/stats/, (msg) => handleStats(bot, msg));
  
  // Guild commands
  bot.onText(/\/announce (.+)/, (msg, match) => handleAnnounce(bot, msg, match));
  bot.onText(/\/guildinfo/, (msg) => handleGuildInfo(bot, msg));
  
  // Battle commands
  bot.onText(/\/addbattle (.+)/, (msg, match) => handleAddBattle(bot, msg, match));
  bot.onText(/\/battles/, (msg) => handleBattles(bot, msg));
  bot.onText(/\/addtarget (.+)/, (msg, match) => handleAddTarget(bot, msg, match));
  bot.onText(/\/targets/, (msg) => handleTargets(bot, msg));
  bot.onText(/\/war/, (msg) => handleWarCoordination(bot, msg));
  
  // Contest commands
  bot.onText(/\/startcontest (.+)/, (msg, match) => handleStartContest(bot, msg, match));
  bot.onText(/\/score (.+)/, (msg, match) => handleContestScore(bot, msg, match));
  bot.onText(/\/leaderboard/, (msg) => handleLeaderboard(bot, msg));
  bot.onText(/\/game/, (msg) => handleMiniGame(bot, msg));
  
  // Analytics commands
  bot.onText(/\/chart/, (msg) => handleGuildChart(bot, msg));
  bot.onText(/\/activity/, (msg) => handleActivityChart(bot, msg));
  bot.onText(/\/advstats/, (msg) => handleAdvancedStats(bot, msg));
  
  // OCR commands
  bot.onText(/\/scan/, (msg) => handleScreenshot(bot, msg));
  bot.onText(/\/scanhelp/, (msg) => handleScanHelp(bot, msg));
  
  // Notification commands
  bot.onText(/\/remind (.+)/, (msg, match) => handleSetReminder(bot, msg, match));
  bot.onText(/\/monster (.+)/, (msg, match) => handleMonsterAlert(bot, msg, match));
  bot.onText(/\/darknest (.+)/, (msg, match) => handleDarknestAlert(bot, msg, match));
  bot.onText(/\/subscribe (.+)/, (msg, match) => handleSubscribe(bot, msg, match));
  bot.onText(/\/unsubscribe (.+)/, (msg, match) => handleUnsubscribe(bot, msg, match));
  
  // Handle photos for OCR
  bot.on('photo', (msg) => {
    if (msg.caption && msg.caption.includes('/scan')) {
      handleScreenshot(bot, msg);
    }
  });
  
  // Handle regular messages for auto-translation
  bot.on('message', (msg) => {
    if (msg.text && !msg.text.startsWith('/')) {
      handleAutoTranslate(bot, msg);
    }
  });
  
  // Callback queries for inline buttons
  bot.on('callback_query', (query) => {
    if (query.data.startsWith('remind_')) {
      handleRemindEvent(bot, query);
    } else if (query.data.startsWith('lang_')) {
      handleLanguageCallback(bot, query);
    }
    // Menu handlers are in menuHandler.js
  });
}
