import fs from 'fs';
import path from 'path';

const DATA_DIR = './data';
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
  }
  
  if (fs.existsSync(DB_FILE)) {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    db = JSON.parse(data);
  } else {
    saveDatabase();
  }
}

export function saveDatabase() {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

export function getDatabase() {
  return db;
}

export function addMember(member) {
  db.members.push(member);
  saveDatabase();
}

export function getMember(userId) {
  return db.members.find(m => m.userId === userId);
}

export function updateMember(userId, updates) {
  const index = db.members.findIndex(m => m.userId === userId);
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
