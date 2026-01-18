export function formatNumber(num) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K';
  }
  return num.toString();
}

export function getTimeAgo(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
}

export function isAdmin(userId) {
  const adminIds = process.env.ADMIN_USER_IDS?.split(',').map(id => parseInt(id)) || [];
  return adminIds.includes(userId);
}

export function generateProgressBar(current, max, length = 10) {
  const percentage = Math.min(current / max, 1);
  const filled = Math.floor(percentage * length);
  const empty = length - filled;
  
  return '█'.repeat(filled) + '░'.repeat(empty) + ` ${(percentage * 100).toFixed(1)}%`;
}

export function getRandomTip() {
  const tips = [
    '💡 Tip: Always shield before going offline!',
    '💡 Tip: Join rallies to earn guild coins!',
    '💡 Tip: Complete daily quests for rewards!',
    '💡 Tip: Help guild members to increase your helps count!',
    '💡 Tip: Upgrade your heroes for better battle performance!',
    '💡 Tip: Save gems for important events!',
    '💡 Tip: Join guild events for exclusive rewards!',
    '💡 Tip: Coordinate with your guild before attacking!',
    '💡 Tip: Keep your troops trained and ready!',
    '💡 Tip: Use the right troop composition for each battle!'
  ];
  
  return tips[Math.floor(Math.random() * tips.length)];
}
