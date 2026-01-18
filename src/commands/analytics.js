export function handleGuildChart(bot, msg) {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, 
    '📊 *Guild Chart Feature*\n\nCharts are temporarily disabled to ensure stable deployment.\n\nUse `/stats` for detailed statistics!',
    { parse_mode: 'Markdown' }
  );
}

export function handleActivityChart(bot, msg) {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, 
    '📈 *Activity Chart Feature*\n\nCharts are temporarily disabled to ensure stable deployment.\n\nUse `/advstats` for detailed activity data!',
    { parse_mode: 'Markdown' }
  );
}

export function handleAdvancedStats(bot, msg) {
  const chatId = msg.chat.id;
  const db = getDatabase();
  
  const totalMembers = db.members.length;
  const totalMight = db.members.reduce((sum, m) => sum + m.might, 0);
  const avgMight = totalMembers > 0 ? totalMight / totalMembers : 0;
  
  const totalBattles = db.battles.length;
  const wonBattles = db.battles.filter(b => b.result === 'won').length;
  const winRate = totalBattles > 0 ? (wonBattles / totalBattles * 100).toFixed(1) : 0;
  
  const totalKills = db.battles.reduce((sum, b) => sum + b.kills, 0);
  const avgKillsPerBattle = totalBattles > 0 ? Math.floor(totalKills / totalBattles) : 0;
  
  const topKiller = db.members.reduce((top, m) => 
    m.kills > (top?.kills || 0) ? m : top, null
  );
  
  const stats = `
📊 *ADVANCED GUILD STATISTICS*

👥 *Members:* ${totalMembers}
⚔️ *Total Might:* ${totalMight.toLocaleString()}
📈 *Average Might:* ${avgMight.toLocaleString()}

⚔️ *Battle Stats:*
• Total Battles: ${totalBattles}
• Win Rate: ${winRate}%
• Total Kills: ${totalKills.toLocaleString()}
• Avg Kills/Battle: ${avgKillsPerBattle.toLocaleString()}

🏆 *Top Killer:* ${topKiller ? `${topKiller.gameName} (${topKiller.kills.toLocaleString()})` : 'N/A'}

📦 *Resources:* ${db.resources.length} logged
🎯 *Active Targets:* ${db.targets.filter(t => t.status === 'active').length}
📅 *Upcoming Events:* ${db.events.filter(e => e.timestamp > Date.now()).length}

Use /chart for visual analytics!
  `;
  
  bot.sendMessage(chatId, stats, { parse_mode: 'Markdown' });
}
