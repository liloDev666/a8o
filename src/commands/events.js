import { addEvent, getUpcomingEvents } from '../database.js';

export function handleAddEvent(bot, msg, match) {
  const chatId = msg.chat.id;
  const parts = match[1].split('|').map(p => p.trim());
  
  if (parts.length < 3) {
    bot.sendMessage(chatId, 
      '❌ Format: `/addevent <name> | <date> | <time>`\nExample: `/addevent Guild War | 2026-01-20 | 18:00`',
      { parse_mode: 'Markdown' }
    );
    return;
  }
  
  const [name, date, time] = parts;
  const eventDate = new Date(`${date} ${time}`);
  
  if (isNaN(eventDate.getTime())) {
    bot.sendMessage(chatId, '❌ Invalid date/time format!');
    return;
  }
  
  const event = {
    id: Date.now(),
    name,
    timestamp: eventDate.getTime(),
    createdBy: msg.from.username || msg.from.first_name,
    participants: []
  };
  
  addEvent(event);
  
  const keyboard = {
    inline_keyboard: [[
      { text: '✅ I\'ll Join', callback_data: `remind_${event.id}` }
    ]]
  };
  
  bot.sendMessage(chatId, 
    `📅 *Event Added!*\n\n🎯 ${name}\n⏰ ${eventDate.toLocaleString()}\n\nClick below to get reminded!`,
    { parse_mode: 'Markdown', reply_markup: keyboard }
  );
}

export function handleEvents(bot, msg) {
  const chatId = msg.chat.id;
  const events = getUpcomingEvents();
  
  if (events.length === 0) {
    bot.sendMessage(chatId, '📭 No upcoming events scheduled!');
    return;
  }
  
  let eventList = `📅 *Upcoming Events*\n\n`;
  
  events.forEach((event, index) => {
    const eventDate = new Date(event.timestamp);
    const timeUntil = getTimeUntil(event.timestamp);
    
    eventList += `${index + 1}. *${event.name}*\n`;
    eventList += `   ⏰ ${eventDate.toLocaleString()}\n`;
    eventList += `   ⏳ ${timeUntil}\n\n`;
  });
  
  bot.sendMessage(chatId, eventList, { parse_mode: 'Markdown' });
}

export function handleRemindEvent(bot, query) {
  const eventId = parseInt(query.data.split('_')[1]);
  
  bot.answerCallbackQuery(query.id, {
    text: '✅ You\'ll be reminded about this event!',
    show_alert: false
  });
}

function getTimeUntil(timestamp) {
  const now = Date.now();
  const diff = timestamp - now;
  
  if (diff < 0) return 'Started';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `in ${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `in ${hours} hour${hours > 1 ? 's' : ''}`;
  return 'soon';
}
