import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { getDatabase } from '../database.js';

const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 800, height: 600 });

export async function handleGuildChart(bot, msg) {
  const chatId = msg.chat.id;
  const db = getDatabase();
  
  if (db.members.length === 0) {
    bot.sendMessage(chatId, '❌ No member data available!');
    return;
  }
  
  const sortedMembers = [...db.members].sort((a, b) => b.might - a.might).slice(0, 10);
  
  const configuration = {
    type: 'bar',
    data: {
      labels: sortedMembers.map(m => m.gameName),
      datasets: [{
        label: 'Might',
        data: sortedMembers.map(m => m.might),
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return (value / 1000000).toFixed(1) + 'M';
            }
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'A8O Guild - Top 10 Members by Might',
          font: { size: 20 }
        }
      }
    }
  };
  
  try {
    const image = await chartJSNodeCanvas.renderToBuffer(configuration);
    bot.sendPhoto(chatId, image, { caption: '📊 Guild Might Distribution' });
  } catch (error) {
    bot.sendMessage(chatId, '❌ Error generating chart. Use /stats for text stats.');
  }
}

export async function handleActivityChart(bot, msg) {
  const chatId = msg.chat.id;
  const db = getDatabase();
  
  // Get activity data for last 7 days
  const days = 7;
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  
  const activityData = [];
  const labels = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const dayStart = now - (i * dayMs);
    const dayEnd = dayStart + dayMs;
    
    const battlesCount = db.battles.filter(b => 
      b.timestamp >= dayStart && b.timestamp < dayEnd
    ).length;
    
    activityData.push(battlesCount);
    
    const date = new Date(dayStart);
    labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
  }
  
  const configuration = {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Battles',
        data: activityData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'A8O Guild - Weekly Activity',
          font: { size: 20 }
        }
      }
    }
  };
  
  try {
    const image = await chartJSNodeCanvas.renderToBuffer(configuration);
    bot.sendPhoto(chatId, image, { caption: '📈 Guild Activity (Last 7 Days)' });
  } catch (error) {
    bot.sendMessage(chatId, '❌ Error generating chart.');
  }
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
