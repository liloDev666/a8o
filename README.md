# A8O Guild Bot - Lords Mobile 🏰

**The ULTIMATE Telegram bot for managing your Lords Mobile guild A8O!**

## 🚀 Features

### 👥 Member Management
- Register guild members with game names
- Track might, kills, and helps
- Member profiles with detailed stats
- Leaderboards with rankings

### ⚔️ Battle System
- Log battles with kills and results
- Track enemy targets
- War coordination tools
- Achievement system (First Blood, Killer, Executioner, Warlord, Legend)
- Battle history and analytics

### 📊 Advanced Analytics
- Visual charts (might distribution, activity trends)
- Advanced statistics dashboard
- Real-time guild metrics
- Performance tracking

### 🎮 Contests & Mini-Games
- Create guild contests (kills, might, resources)
- Live leaderboards
- Mini-games (Guess the Might, Guild Trivia)
- Automated scoring

### 🔔 Smart Notifications
- Custom reminders for events
- Monster hunt alerts
- Darknest rally coordination
- Subscription system for personalized alerts
- Automatic event reminders (1 hour before)

### 📸 Screenshot Analysis (OCR)
- Upload screenshots to auto-extract stats
- Automatic might updates
- Battle report parsing
- Resource tracking from images

### 📅 Event Scheduling
- Create guild events with dates/times
- Automatic reminders
- Participant tracking
- Interactive join buttons

### 📦 Resource Management
- Log guild resources (gold, food, stone, wood, ore, gems)
- Resource history tracking
- Guild-wide resource statistics

### 🤖 Automation
- Daily guild reminders (9 AM)
- Hourly event checks
- Automated notifications
- Smart scheduling

## 📋 Complete Command List

### Role Commands
```
/roles                  - View guild hierarchy
/myrole                 - View your role
/setrole @user R4       - Assign role (R5 only)
/promote @user          - Promote member (R4+)
/demote @user           - Demote member (R4+)
```

### Translation Commands
```
/translate <lang> | <text>  - Translate text
/translateon                - Enable auto-translation
/translateoff               - Disable auto-translation
/translatehelp              - Translation guide
```

### Language Commands
```
/languages              - Show language selection menu
/lang                   - Show language menu (short)
/setlang <code>         - Set your language (en, ru, ar, fr, es, pt, de, zh)
```

### Basic Commands
```
/start          - Welcome message
/help           - Interactive help menu
/guildinfo      - Guild information
```

### Member Commands
```
/register <name>              - Register with game name
/profile                      - View your profile
/members                      - List all members
```

### Battle Commands
```
/addbattle <enemy>|<result>|<kills>  - Log a battle
/battles                             - View battle history
/addtarget <name>|<guild>|<might>    - Add enemy target
/targets                             - View active targets
/war                                 - War coordination panel
```

### Analytics Commands
```
/stats          - Basic guild statistics
/advstats       - Advanced statistics
/chart          - Visual might chart
/activity       - Activity trend chart
```

### Contest Commands
```
/startcontest <name>|<type>|<hours>  - Start a contest
/score <amount>                      - Update contest score
/leaderboard                         - View rankings
/game                                - Play mini-games
```

### Event Commands
```
/addevent <name>|<date>|<time>  - Create event
/events                         - View upcoming events
```

### Resource Commands
```
/addresource <type> <amount>  - Log resources
/resources                    - View resource history
```

### Notification Commands
```
/remind <event>|<time>     - Set reminder (e.g., 30m, 1h)
/monster <info>            - Alert about monster hunt
/darknest <level>          - Alert about darknest
/subscribe <type>          - Subscribe to notifications
/unsubscribe <type>        - Unsubscribe
```

### Scanner Commands
```
/scan          - Analyze screenshot (send with image)
/scanhelp      - Scanner usage guide
```

### Admin Commands
```
/announce <message>  - Send guild announcement
```

## 👑 Role-Based Permissions

**Complete Guild Hierarchy System!**

The bot includes a full role system matching Lords Mobile:

| Role | Name | Emoji | Permissions |
|------|------|-------|-------------|
| R5 | Leader | 👑 | All permissions |
| R4 | Officer | ⭐ | Manage members, events, announcements |
| R3 | Elite | 💎 | Manage events, targets, battles |
| R2 | Veteran | 🛡️ | Add battles, resources |
| R1 | Member | ⚔️ | View, add resources |

### Role Commands
```
/roles              - View guild hierarchy
/myrole             - View your role and permissions
/setrole @user R4   - Assign role (R5 only)
/promote @user      - Promote member (R4+)
/demote @user       - Demote member (R4+)
```

**Permission-based access control** - Only authorized members can use certain commands!

See [ROLES.md](ROLES.md) for complete role documentation.

---

## 🌍 Multi-Language Support

**8 Languages Supported!**

The bot automatically translates all messages to each user's preferred language:

| Language | Code | Command |
|----------|------|---------|
| 🇬🇧 English | `en` | `/setlang en` |
| 🇷🇺 Russian | `ru` | `/setlang ru` |
| 🇸🇦 Arabic | `ar` | `/setlang ar` |
| 🇫🇷 French | `fr` | `/setlang fr` |
| 🇪🇸 Spanish | `es` | `/setlang es` |
| 🇵🇹 Portuguese | `pt` | `/setlang pt` |
| 🇩🇪 German | `de` | `/setlang de` |
| 🇨🇳 Chinese | `zh` | `/setlang zh` |

### Change Your Language
```
/languages    - Show interactive menu
/setlang ru   - Switch to Russian
/setlang ar   - Switch to Arabic
/setlang fr   - Switch to French
```

**Each member can use the bot in their own language!** Perfect for international guilds with Russian, Arabic, French, and other language speakers.

### Chat Translation
```
/translateon        - Enable auto-translation in chat
/translate ru | Hi  - Translate text to Russian
/translatehelp      - Translation guide
```

**Auto-translation feature** - Messages are automatically translated to each member's language! Russian members see Russian, Arabic members see Arabic, etc.

See [LANGUAGES.md](LANGUAGES.md) for detailed language documentation.

---

## 🛠️ Setup Guide

### 1. Create Your Telegram Bot

1. Open Telegram and message [@BotFather](https://t.me/botfather)
2. Send `/newbot`
3. Choose a name: `A8O Guild Bot`
4. Choose a username: `a8o_guild_bot` (must end in 'bot')
5. Save your bot token (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### 2. Get Your Chat ID

1. Add your bot to your guild group chat
2. Send any message in the group
3. Visit this URL in your browser (replace YOUR_BOT_TOKEN):
   ```
   https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
   ```
4. Look for `"chat":{"id":-1234567890}` - that's your chat ID

### 3. Get Your User ID (for admin access)

1. Message [@userinfobot](https://t.me/userinfobot) on Telegram
2. It will reply with your user ID

### 4. Local Development (Optional)

```bash
# Install Node.js (if not installed)
# Download from: https://nodejs.org/

# Clone or download this project
cd a8o-guild-bot

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials:
# TELEGRAM_BOT_TOKEN=your_bot_token_here
# GUILD_CHAT_ID=your_chat_id
# ADMIN_USER_IDS=your_user_id

# Run the bot
npm start
```

### 5. Deploy to Railway (Recommended)

1. **Create GitHub Repository**
   - Go to [GitHub](https://github.com)
   - Create new repository
   - Upload all bot files

2. **Deploy on Railway**
   - Go to [Railway.app](https://railway.app)
   - Sign up/login with GitHub
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Click "Add variables" and add:
     ```
     TELEGRAM_BOT_TOKEN = your_bot_token
     GUILD_CHAT_ID = your_chat_id
     ADMIN_USER_IDS = your_user_id
     ```
   - Click "Deploy"

3. **Your bot is now live 24/7!** 🎉

## 💡 Usage Examples

### Register Members
```
/register DragonSlayer
```

### Log a Battle
```
/addbattle [XYZ]Enemy | won | 2500000
```

### Add Enemy Target
```
/addtarget EnemyKing | [ABC] | 75000000
```

### Create Event
```
/addevent Guild War | 2026-01-25 | 20:00
```

### Start Contest
```
/startcontest Kill Event | kills | 24
```

### Set Reminder
```
/remind Monster Hunt | 30m
```

### Log Resources
```
/addresource gold 5000000
```

### Scan Screenshot
Send a screenshot with caption `/scan` to auto-extract stats!

## 🎯 Pro Tips

- Use `/chart` to visualize guild progress
- Set up `/subscribe all` for important notifications
- Upload screenshots with `/scan` for quick stat updates
- Create weekly contests to boost engagement
- Use `/war` before guild wars for coordination
- Check `/advstats` for detailed analytics

## 🔧 Configuration

Edit `src/database.js` to customize:
```javascript
settings: {
  guildName: 'A8O',
  guildTag: '[A8O]',
  language: 'en',
  timezone: 'UTC',
  warTime: '20:00',
  minMight: 10000000
}
```

## 📱 Bot Features Breakdown

| Feature | Commands | Description |
|---------|----------|-------------|
| Roles | 5 | R5/R4/R3/R2/R1 hierarchy with permissions |
| Translation | 4 | Auto-translate chat messages |
| Language | 3 | Multi-language support (8 languages) |
| Members | 3 | Registration, profiles, leaderboards |
| Battles | 5 | Battle logs, targets, war coordination |
| Analytics | 4 | Stats, charts, activity tracking |
| Contests | 4 | Competitions, leaderboards, games |
| Events | 2 | Scheduling, reminders |
| Resources | 2 | Logging, tracking |
| Notifications | 5 | Reminders, alerts, subscriptions |
| Scanner | 2 | OCR, screenshot analysis |
| Admin | 2 | Announcements, management |

**Total: 32+ commands!**

## 🆘 Troubleshooting

**Bot not responding?**
- Check if bot token is correct
- Verify bot is added to group
- Ensure bot has admin rights in group

**Commands not working?**
- Make sure you're using `/` before commands
- Check command format in `/help`

**Charts not generating?**
- Charts require member data
- Try `/stats` for text-based stats

**Scanner not working?**
- Send clear, high-quality screenshots
- Use `/scanhelp` for tips

## 🌟 What Makes This Bot SUPER?

✅ **40+ Commands** - Most comprehensive Lords Mobile bot
✅ **Role System** - R5/R4/R3/R2/R1 hierarchy with permissions
✅ **Auto-Translation** - Chat messages translated to each member's language
✅ **8 Languages** - Russian, Arabic, French, Spanish, Portuguese, German, Chinese, English
✅ **Visual Analytics** - Charts and graphs
✅ **OCR Technology** - Screenshot analysis
✅ **Smart Notifications** - Customizable alerts
✅ **Achievement System** - Gamification
✅ **Contest System** - Boost engagement
✅ **War Coordination** - Battle planning tools
✅ **24/7 Automation** - Always active
✅ **Easy Deployment** - One-click Railway setup
✅ **Interactive UI** - Buttons and menus

## 📞 Support

For issues or questions, contact guild leadership!

---

**Made with ❤️ for A8O Guild**
*Dominate the kingdom together!* 👑
