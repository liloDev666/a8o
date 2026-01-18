import cron from 'node-cron';
import { getUpcomingEvents } from './database.js';

export function setupScheduler(bot) {
  // Check for upcoming events every hour
  cron.schedule('0 * * * *', () => {
    checkEventReminders(bot);
  });
  
  // Daily guild reminder at 9 AM
  cron.schedule('0 9 * * *', () => {
    sendDailyReminder(bot);
  });
}

function checkEventReminders(bot) {
  const events = getUpcomingEvents();
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  
  events.forEach(event => {
    const timeUntil = event.timestamp - now;
    
    // Remind 1 hour before event
    if (timeUntil > 0 && timeUntil <= oneHour) {
      const chatId = process.env.GUILD_CHAT_ID;
      if (chatId) {
        bot.sendMessage(chatId, 
          `⏰ *Event Reminder!*\n\n🎯 ${event.name}\n⏳ Starting in 1 hour!\n\nGet ready! 💪`,
          { parse_mode: 'Markdown' }
        );
      }
    }
  });
}

function sendDailyReminder(bot) {
  const chatId = process.env.GUILD_CHAT_ID;
  if (!chatId) return;
  
  const reminders = [
    '☀️ Good morning A8O! Don\'t forget to:\n• Collect your daily rewards\n• Help guild members\n• Check for guild events',
    '🌅 Rise and shine! Time to:\n• Complete your daily quests\n• Participate in guild activities\n• Coordinate with teammates',
    '🎮 New day, new victories!\n• Login and claim rewards\n• Support your guild mates\n• Check event schedule'
  ];
  
  const randomReminder = reminders[Math.floor(Math.random() * reminders.length)];
  bot.sendMessage(chatId, randomReminder);
}
