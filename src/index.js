import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import { setupCommands } from './commands/index.js';
import { setupScheduler } from './scheduler.js';
import { initDatabase } from './database.js';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Initialize database
initDatabase();

// Setup commands
setupCommands(bot);

// Setup scheduled tasks
setupScheduler(bot);

// Error handling
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

console.log('🤖 A8O Guild Bot is running...');
