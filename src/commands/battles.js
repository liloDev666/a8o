import { getDatabase, saveDatabase, getMember } from '../database.js';
import { hasPermission } from './roles.js';

export function handleAddBattle(bot, msg, match) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const parts = match[1].split('|').map(p => p.trim());
  
  if (parts.length < 3) {
    bot.sendMessage(chatId, 
      '❌ Format: `/addbattle <enemy> | <result> | <kills>`\nExample: `/addbattle [XYZ]Player | won | 1500000`',
      { parse_mode: 'Markdown' }
    );
    return;
  }
  
  const [enemy, result, killsStr] = parts;
  const kills = parseInt(killsStr);
  
  if (isNaN(kills)) {
    bot.sendMessage(chatId, '❌ Kills must be a number!');
    return;
  }
  
  const member = getMember(userId);
  const username = member ? member.gameName : (msg.from.username || msg.from.first_name);
  
  const db = getDatabase();
  const battle = {
    id: Date.now(),
    attacker: username,
    enemy,
    result: result.toLowerCase(),
    kills,
    timestamp: Date.now()
  };
  
  db.battles.push(battle);
  
  // Update member kills
  if (member) {
    member.kills += kills;
  }
  
  saveDatabase();
  
  const emoji = result.toLowerCase() === 'won' ? '🎉' : '💪';
  const keyboard = {
    inline_keyboard: [[
      { text: '👍 Nice!', callback_data: `like_${battle.id}` },
      { text: '🔥 Epic!', callback_data: `epic_${battle.id}` }
    ]]
  };
  
  bot.sendMessage(chatId, 
    `${emoji} *Battle Report*\n\n⚔️ ${username} vs ${enemy}\n📊 Result: ${result.toUpperCase()}\n💀 Kills: ${kills.toLocaleString()}\n\nKeep dominating! 💪`,
    { parse_mode: 'Markdown', reply_markup: keyboard }
  );
  
  checkAchievements(bot, chatId, member, kills);
}

export function handleBattles(bot, msg) {
  const chatId = msg.chat.id;
  const db = getDatabase();
  
  if (db.battles.length === 0) {
    bot.sendMessage(chatId, '📭 No battles recorded yet!');
    return;
  }
  
  const recentBattles = db.battles.slice(-10).reverse();
  let battleList = `⚔️ *Recent Battles*\n\n`;
  
  recentBattles.forEach((battle, index) => {
    const emoji = battle.result === 'won' ? '✅' : '⚠️';
    const date = new Date(battle.timestamp).toLocaleDateString();
    
    battleList += `${emoji} *${battle.attacker}* vs ${battle.enemy}\n`;
    battleList += `   💀 ${battle.kills.toLocaleString()} kills | ${date}\n\n`;
  });
  
  bot.sendMessage(chatId, battleList, { parse_mode: 'Markdown' });
}

export function handleAddTarget(bot, msg, match) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  if (!hasPermission(userId, 'manage_targets')) {
    bot.sendMessage(chatId, '❌ You need R3+ permissions to add targets!');
    return;
  }
  
  const parts = match[1].split('|').map(p => p.trim());
  
  if (parts.length < 3) {
    bot.sendMessage(chatId, 
      '❌ Format: `/addtarget <name> | <guild> | <might>`\nExample: `/addtarget EnemyPlayer | [ABC] | 50000000`',
      { parse_mode: 'Markdown' }
    );
    return;
  }
  
  const [name, guild, mightStr] = parts;
  const might = parseInt(mightStr);
  
  const db = getDatabase();
  const target = {
    id: Date.now(),
    name,
    guild,
    might,
    status: 'active',
    addedBy: msg.from.username || msg.from.first_name,
    timestamp: Date.now()
  };
  
  db.targets.push(target);
  saveDatabase();
  
  const keyboard = {
    inline_keyboard: [[
      { text: '🎯 I\'ll Attack', callback_data: `claim_${target.id}` },
      { text: '✅ Eliminated', callback_data: `eliminate_${target.id}` }
    ]]
  };
  
  bot.sendMessage(chatId, 
    `🎯 *New Target Added!*\n\n👤 ${name} [${guild}]\n⚔️ Might: ${might.toLocaleString()}\n\nWho's taking this one?`,
    { parse_mode: 'Markdown', reply_markup: keyboard }
  );
}

export function handleTargets(bot, msg) {
  const chatId = msg.chat.id;
  const db = getDatabase();
  
  const activeTargets = db.targets.filter(t => t.status === 'active');
  
  if (activeTargets.length === 0) {
    bot.sendMessage(chatId, '📭 No active targets! Add one with /addtarget');
    return;
  }
  
  let targetList = `🎯 *Active Targets*\n\n`;
  
  activeTargets.forEach((target, index) => {
    targetList += `${index + 1}. *${target.name}* [${target.guild}]\n`;
    targetList += `   ⚔️ ${target.might.toLocaleString()} might\n\n`;
  });
  
  bot.sendMessage(chatId, targetList, { parse_mode: 'Markdown' });
}

export function handleWarCoordination(bot, msg) {
  const chatId = msg.chat.id;
  const db = getDatabase();
  
  const warTime = db.settings.warTime || '20:00';
  
  const keyboard = {
    inline_keyboard: [
      [
        { text: '✅ I\'m Ready', callback_data: 'war_ready' },
        { text: '❌ Can\'t Make It', callback_data: 'war_absent' }
      ],
      [
        { text: '🛡️ Defense', callback_data: 'war_defense' },
        { text: '⚔️ Attack', callback_data: 'war_attack' }
      ]
    ]
  };
  
  const message = `
⚔️ *WAR COORDINATION*

🕐 War Time: ${warTime}
📍 Rally Point: Guild Hall

*Roles Needed:*
🛡️ Defenders: Protect our hive
⚔️ Attackers: Hit enemy targets
🏥 Support: Reinforce & heal

Click below to confirm your role!
  `;
  
  bot.sendMessage(chatId, message, { 
    parse_mode: 'Markdown',
    reply_markup: keyboard 
  });
}

function checkAchievements(bot, chatId, member, kills) {
  if (!member) return;
  
  const achievements = [
    { name: 'First Blood', threshold: 100000, emoji: '🩸' },
    { name: 'Killer', threshold: 1000000, emoji: '💀' },
    { name: 'Executioner', threshold: 5000000, emoji: '⚔️' },
    { name: 'Warlord', threshold: 10000000, emoji: '👑' },
    { name: 'Legend', threshold: 50000000, emoji: '🏆' }
  ];
  
  achievements.forEach(achievement => {
    if (member.kills >= achievement.threshold && member.kills - kills < achievement.threshold) {
      bot.sendMessage(chatId, 
        `${achievement.emoji} *ACHIEVEMENT UNLOCKED!*\n\n${member.gameName} earned: *${achievement.name}*\n\nTotal Kills: ${member.kills.toLocaleString()}`,
        { parse_mode: 'Markdown' }
      );
    }
  });
}
