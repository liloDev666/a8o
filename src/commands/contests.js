import { getDatabase, saveDatabase } from '../database.js';
import { hasPermission } from './roles.js';

export function handleStartContest(bot, msg, match) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  if (!hasPermission(userId, 'manage_contests')) {
    bot.sendMessage(chatId, '❌ You need R4+ permissions to start contests!');
    return;
  }
  
  const parts = match[1].split('|').map(p => p.trim());
  
  if (parts.length < 3) {
    bot.sendMessage(chatId, 
      '❌ Format: `/startcontest <name> | <type> | <duration_hours>`\nExample: `/startcontest Kill Event | kills | 24`',
      { parse_mode: 'Markdown' }
    );
    return;
  }
  
  const [name, type, durationStr] = parts;
  const duration = parseInt(durationStr);
  
  const db = getDatabase();
  const contest = {
    id: Date.now(),
    name,
    type: type.toLowerCase(),
    startTime: Date.now(),
    endTime: Date.now() + (duration * 60 * 60 * 1000),
    participants: [],
    active: true
  };
  
  db.contests.push(contest);
  saveDatabase();
  
  const keyboard = {
    inline_keyboard: [[
      { text: '🎮 Join Contest', callback_data: `join_contest_${contest.id}` }
    ]]
  };
  
  bot.sendMessage(chatId, 
    `🏆 *NEW CONTEST!*\n\n🎯 ${name}\n📊 Type: ${type}\n⏰ Duration: ${duration} hours\n\nClick to join and compete! 💪`,
    { parse_mode: 'Markdown', reply_markup: keyboard }
  );
}

export function handleContestScore(bot, msg, match) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const score = parseInt(match[1]);
  
  if (isNaN(score)) {
    bot.sendMessage(chatId, '❌ Score must be a number!');
    return;
  }
  
  const db = getDatabase();
  const activeContest = db.contests.find(c => c.active);
  
  if (!activeContest) {
    bot.sendMessage(chatId, '❌ No active contest! Start one with /startcontest');
    return;
  }
  
  const participant = activeContest.participants.find(p => p.userId === userId);
  
  if (!participant) {
    bot.sendMessage(chatId, '❌ You need to join the contest first!');
    return;
  }
  
  participant.score += score;
  saveDatabase();
  
  bot.sendMessage(chatId, 
    `✅ Score updated!\n\n${participant.name}: ${participant.score.toLocaleString()} points`,
    { parse_mode: 'Markdown' }
  );
}

export function handleLeaderboard(bot, msg) {
  const chatId = msg.chat.id;
  const db = getDatabase();
  
  const activeContest = db.contests.find(c => c.active);
  
  if (!activeContest) {
    bot.sendMessage(chatId, '❌ No active contest!');
    return;
  }
  
  const sorted = [...activeContest.participants].sort((a, b) => b.score - a.score);
  
  let leaderboard = `🏆 *${activeContest.name} - Leaderboard*\n\n`;
  
  sorted.forEach((participant, index) => {
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
    leaderboard += `${medal} *${participant.name}*: ${participant.score.toLocaleString()}\n`;
  });
  
  const timeLeft = Math.floor((activeContest.endTime - Date.now()) / (1000 * 60 * 60));
  leaderboard += `\n⏰ Time left: ${timeLeft} hours`;
  
  bot.sendMessage(chatId, leaderboard, { parse_mode: 'Markdown' });
}

export function handleMiniGame(bot, msg) {
  const chatId = msg.chat.id;
  
  const games = [
    {
      name: 'Guess the Might',
      description: 'I\'m thinking of a might between 1M and 100M!',
      type: 'guess'
    },
    {
      name: 'Guild Trivia',
      description: 'Test your Lords Mobile knowledge!',
      type: 'trivia'
    }
  ];
  
  const game = games[Math.floor(Math.random() * games.length)];
  
  if (game.type === 'guess') {
    const target = Math.floor(Math.random() * 99000000) + 1000000;
    
    const keyboard = {
      inline_keyboard: [
        [
          { text: '⬇️ Lower', callback_data: 'game_lower' },
          { text: '⬆️ Higher', callback_data: 'game_higher' }
        ],
        [
          { text: '🎯 Guess', callback_data: 'game_guess' }
        ]
      ]
    };
    
    bot.sendMessage(chatId, 
      `🎮 *${game.name}*\n\n${game.description}\n\nMake your guess!`,
      { parse_mode: 'Markdown', reply_markup: keyboard }
    );
  }
}
