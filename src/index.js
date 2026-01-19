import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import { setupCommands } from './commands/index.js';
import { setupScheduler } from './scheduler.js';
import { initDatabase } from './database.js';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;

// Create bot with better error handling
const bot = new TelegramBot(token, { 
  polling: {
    interval: 1000,
    autoStart: true,
    params: {
      timeout: 10
    }
  }
});

// Initialize database
initDatabase();

// Setup commands
setupCommands(bot);

// Setup scheduled tasks
setupScheduler(bot);

// Enhanced error handling
bot.on('polling_error', (error) => {
  console.error('Polling error:', error.message);
  
  if (error.message.includes('409') || error.message.includes('Conflict')) {
    console.log('🔄 Bot conflict detected - another instance is running');
    console.log('⏳ Waiting 30 seconds before retry...');
    
    // Stop current polling
    bot.stopPolling();
    
    // Wait and restart
    setTimeout(() => {
      console.log('🚀 Restarting bot polling...');
      bot.startPolling();
    }, 30000);
  }
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Shutting down bot gracefully...');
  bot.stopPolling();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down...');
  bot.stopPolling();
  process.exit(0);
});

console.log('🤖 A8O Guild Bot is running...');
console.log('📊 Data directory:', process.env.RAILWAY_VOLUME_MOUNT_PATH ? 'Railway Volume' : 'Local ./data');
