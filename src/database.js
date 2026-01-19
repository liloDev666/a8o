import fs from 'fs';
import path from 'path';

// Multiple data storage locations for redundancy
const DATA_LOCATIONS = [
  '/app/data',           // Railway volume (primary)
  './data',              // Local fallback
  '/tmp/guild-data'      // Temporary fallback
];

// Find the best available data directory
function getDataDir() {
  for (const dir of DATA_LOCATIONS) {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      // Test write access
      const testFile = path.join(dir, 'test.tmp');
      fs.writeFileSync(testFile, 'test');
      fs.unlinkSync(testFile);
      console.log('📁 Using data directory:', dir);
      return dir;
    } catch (error) {
      console.log('❌ Cannot use directory:', dir, error.message);
    }
  }
  throw new Error('No writable data directory found!');
}

const DATA_DIR = getDataDir();
const DB_FILE = path.join(DATA_DIR, 'guild_data.json');

// Backup locations
const BACKUP_LOCATIONS = [
  path.join(DATA_DIR, 'backups'),
  '/tmp/guild-backups'
];

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
  console.log('🔄 Initializing database...');
  
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      db = JSON.parse(data);
      console.log('📊 Database loaded successfully');
      console.log(`👥 Members: ${db.members?.length || 0}`);
      console.log(`⚔️ Battles: ${db.battles?.length || 0}`);
      console.log(`📅 Events: ${db.events?.length || 0}`);
      
      // Create backup on successful load
      createBackup();
      return;
    } catch (error) {
      console.error('❌ Error loading database:', error.message);
    }
  }
  
  // Try to restore from backup
  console.log('🔍 Searching for backups...');
  const restored = tryRestoreFromBackup();
  
  if (!restored) {
    console.log('📝 Creating new database...');
    // Initialize with default admin user if available
    initializeWithDefaults();
  }
  
  saveDatabase();
}

function tryRestoreFromBackup() {
  for (const backupDir of BACKUP_LOCATIONS) {
    try {
      if (!fs.existsSync(backupDir)) continue;
      
      const backupFiles = fs.readdirSync(backupDir)
        .filter(file => file.startsWith('backup_') && file.endsWith('.json'))
        .map(file => ({
          name: file,
          path: path.join(backupDir, file),
          time: fs.statSync(path.join(backupDir, file)).mtime
        }))
        .sort((a, b) => b.time - a.time);
      
      if (backupFiles.length > 0) {
        const latestBackup = backupFiles[0];
        console.log('💾 Found backup:', latestBackup.name);
        
        const backupData = fs.readFileSync(latestBackup.path, 'utf8');
        db = JSON.parse(backupData);
        
        console.log('✅ Restored from backup!');
        console.log(`👥 Members restored: ${db.members?.length || 0}`);
        return true;
      }
    } catch (error) {
      console.error('❌ Backup restore failed:', error.message);
    }
  }
  return false;
}

function initializeWithDefaults() {
  // Check if we have admin user ID in environment
  const adminIds = process.env.ADMIN_USER_IDS?.split(',').map(id => parseInt(id)) || [];
  
  if (adminIds.length > 0) {
    console.log('🔧 Pre-registering admin user...');
    // Pre-register the admin user so they don't lose access
    db.members = [{
      userId: adminIds[0],
      username: 'BotAdmin',
      gameName: 'BotAdmin',
      role: 'R1', // R1 but with super admin powers
      joinedAt: Date.now(),
      might: 0,
      kills: 0,
      helps: 0,
      language: 'en'
    }];
    console.log('✅ Admin user pre-registered');
  }
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
// Backup system with multiple locations
export function createBackup() {
  const timestamp = Date.now();
  const backupFileName = `backup_${timestamp}.json`;
  
  for (const backupDir of BACKUP_LOCATIONS) {
    try {
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      
      const backupFile = path.join(backupDir, backupFileName);
      fs.writeFileSync(backupFile, JSON.stringify(db, null, 2));
      console.log('💾 Backup created:', backupFile);
      
      // Keep only last 10 backups in each location
      cleanupBackups(backupDir);
    } catch (error) {
      console.error('❌ Backup failed for', backupDir, ':', error.message);
    }
  }
}

function cleanupBackups(backupDir) {
  try {
    const files = fs.readdirSync(backupDir)
      .filter(file => file.startsWith('backup_') && file.endsWith('.json'))
      .map(file => ({
        name: file,
        path: path.join(backupDir, file),
        time: fs.statSync(path.join(backupDir, file)).mtime
      }))
      .sort((a, b) => b.time - a.time);
    
    // Remove old backups (keep only 10)
    files.slice(10).forEach(file => {
      fs.unlinkSync(file.path);
      console.log('🗑️ Removed old backup:', file.name);
    });
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
  }
}