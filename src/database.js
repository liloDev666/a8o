import fs from 'fs';
import path from 'path';

// Use Railway's persistent volume if available, otherwise local data folder
const DATA_DIR = process.env.RAILWAY_VOLUME_MOUNT_PATH 
  ? path.join(process.env.RAILWAY_VOLUME_MOUNT_PATH, 'data')
  : './data';

const DB_FILE = path.join(DATA_DIR, 'guild_data.json');

let db = {
  members: [],
  events: [],
  resources: [],
  battles: [],
  achievements: [],
  contests: [],
  targets: [],
  stats: {},
  settings: {
    guildName: 'A8O',
    guildTag: '[A8O]',
    language: 'en',
    timezone: 'UTC',
    warTime: '20:00',
    minMight: 10000000
  }
};

export function initDatabase() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log('📁 Created data directory:', DATA_DIR);
  }
  
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      db = JSON.parse(data);
      console.log('📊 Database loaded successfully');
      console.log(`👥 Members: ${db.members?.length || 0}`);
      console.log(`⚔️ Battles: ${db.battles?.length || 0}`);
      console.log(`📅 Events: ${db.events?.length || 0}`);
    } catch (error) {
      console.error('❌ Error loading database:', error.message);
      console.log('🔄 Creating new database...');
      saveDatabase();
    }
  } else {
    console.log('📝 Creating new database...');
    saveDatabase();
  }
  
  // Create backup on startup
  createBackup();
}

export function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
    
    // Create backup every 10 saves
    if (!saveDatabase.counter) saveDatabase.counter = 0;
    saveDatabase.counter++;
    
    if (saveDatabase.counter % 10 === 0) {
      createBackup();
    }
  } catch (error) {
    console.error('❌ Save failed:', error.message);
  }
}

export function getDatabase() {
  return db;
}

export function addMember(member) {
  db.members.push(member);
  saveDatabase();
}

export function getMember(userId) {
  // Ensure consistent type comparison - convert both to numbers
  const numericUserId = typeof userId === 'string' ? parseInt(userId) : userId;
  return db.members.find(m => {
    const memberUserId = typeof m.userId === 'string' ? parseInt(m.userId) : m.userId;
    return memberUserId === numericUserId;
  });
}

export function updateMember(userId, updates) {
  // Ensure consistent type comparison - convert both to numbers
  const numericUserId = typeof userId === 'string' ? parseInt(userId) : userId;
  const index = db.members.findIndex(m => {
    const memberUserId = typeof m.userId === 'string' ? parseInt(m.userId) : m.userId;
    return memberUserId === numericUserId;
  });
  if (index !== -1) {
    db.members[index] = { ...db.members[index], ...updates };
    saveDatabase();
  }
}

export function addEvent(event) {
  db.events.push(event);
  saveDatabase();
}

export function getUpcomingEvents() {
  const now = Date.now();
  return db.events.filter(e => e.timestamp > now).sort((a, b) => a.timestamp - b.timestamp);
}

export function addResource(resource) {
  db.resources.push(resource);
  saveDatabase();
}

export function getRecentResources(limit = 10) {
  return db.resources.slice(-limit).reverse();
}
// Backup system
export function createBackup() {
  try {
    const backupFile = path.join(DATA_DIR, `backup_${Date.now()}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(db, null, 2));
    console.log('💾 Backup created:', backupFile);
    
    // Keep only last 5 backups
    cleanupBackups();
  } catch (error) {
    console.error('❌ Backup failed:', error.message);
  }
}

function cleanupBackups() {
  try {
    const files = fs.readdirSync(DATA_DIR)
      .filter(file => file.startsWith('backup_') && file.endsWith('.json'))
      .map(file => ({
        name: file,
        path: path.join(DATA_DIR, file),
        time: fs.statSync(path.join(DATA_DIR, file)).mtime
      }))
      .sort((a, b) => b.time - a.time);
    
    // Remove old backups (keep only 5)
    files.slice(5).forEach(file => {
      fs.unlinkSync(file.path);
      console.log('🗑️ Removed old backup:', file.name);
    });
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
  }
}