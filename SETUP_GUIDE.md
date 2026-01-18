# 🚀 Complete Setup Guide - A8O Guild Bot

Follow these steps to get your bot running in 15 minutes!

## 📋 Prerequisites

- Telegram account
- GitHub account (free)
- Railway account (free)

---

## STEP 1: Create Your Telegram Bot (5 minutes)

### 1.1 Open Telegram
- Open Telegram app on your phone or desktop
- Search for: **@BotFather**
- Start a chat with BotFather

### 1.2 Create Bot
Send these commands to BotFather:

```
/newbot
```

BotFather will ask for:

**Bot Name:** (What users see)
```
A8O Guild Bot
```

**Bot Username:** (Must end with 'bot')
```
a8o_guild_bot
```
(If taken, try: `a8o_lords_bot`, `a8o_lm_bot`, etc.)

### 1.3 Save Your Token
BotFather will reply with:
```
Done! Your token is: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz
```

**⚠️ IMPORTANT:** Copy this token and save it somewhere safe!

---

## STEP 2: Get Your Chat ID (3 minutes)

### 2.1 Add Bot to Your Guild Group
1. Go to your guild's Telegram group
2. Click group name → Add Members
3. Search for your bot username (e.g., `@a8o_guild_bot`)
4. Add the bot to the group

### 2.2 Make Bot Admin (Important!)
1. Click group name → Administrators
2. Add your bot as administrator
3. Give it permission to:
   - Send messages
   - Delete messages
   - Pin messages

### 2.3 Get Chat ID
1. Send any message in your group (e.g., "Hello")
2. Open this URL in your browser (replace YOUR_BOT_TOKEN):
   ```
   https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
   ```
   
   Example:
   ```
   https://api.telegram.org/bot123456789:ABCdefGHIjklMNOpqrsTUVwxyz/getUpdates
   ```

3. Look for this in the response:
   ```json
   "chat":{"id":-1001234567890
   ```
   
4. Copy the chat ID (including the minus sign!)
   Example: `-1001234567890`

---

## STEP 3: Get Your User ID (2 minutes)

### 3.1 Find Your User ID
1. Open Telegram
2. Search for: **@userinfobot**
3. Start chat and click "Start"
4. It will reply with your user ID
   Example: `123456789`

**Save this number!** You'll need it for admin access.

---

## STEP 4: Upload to GitHub (5 minutes)

### 4.1 Create GitHub Account
- Go to [github.com](https://github.com)
- Sign up (if you don't have an account)

### 4.2 Create New Repository
1. Click the "+" icon → "New repository"
2. Repository name: `a8o-guild-bot`
3. Description: `Lords Mobile Guild Bot for A8O`
4. Select: **Public**
5. Click "Create repository"

### 4.3 Upload Files
**Option A: Using GitHub Website (Easiest)**
1. Click "uploading an existing file"
2. Drag and drop ALL your bot files
3. Click "Commit changes"

**Option B: Using Git (If you know how)**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/a8o-guild-bot.git
git push -u origin main
```

---

## STEP 5: Deploy on Railway (5 minutes)

### 5.1 Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Click "Login"
3. Choose "Login with GitHub"
4. Authorize Railway

### 5.2 Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository: `a8o-guild-bot`
4. Click "Deploy Now"

### 5.3 Add Environment Variables
1. Click on your project
2. Go to "Variables" tab
3. Click "New Variable"

Add these 3 variables:

**Variable 1:**
```
Name: TELEGRAM_BOT_TOKEN
Value: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz
```
(Your bot token from Step 1)

**Variable 2:**
```
Name: GUILD_CHAT_ID
Value: -1001234567890
```
(Your chat ID from Step 2)

**Variable 3:**
```
Name: ADMIN_USER_IDS
Value: 123456789
```
(Your user ID from Step 3)

If you have multiple admins, separate with commas:
```
Value: 123456789,987654321,555666777
```

### 5.4 Deploy
1. Click "Deploy"
2. Wait 2-3 minutes for deployment
3. Check logs for: `🤖 A8O Guild Bot is running...`

---

## STEP 6: Test Your Bot (2 minutes)

### 6.1 In Your Guild Group
Send this message:
```
/start
```

You should see:
```
╔═══════════════════════╗
║   🏰 A8O GUILD BOT   ║
║      2026 Edition     ║
╚═══════════════════════╝

Welcome to A8O Guild Bot!
...
```

### 6.2 Register Yourself
```
/register YourGameName
```

Example:
```
/register DragonKing
```

### 6.3 Set Your Role (Guild Leader)
```
/setrole @YourUsername R5
```

Example:
```
/setrole @john R5
```

### 6.4 Test the Menu
```
/menu
```

You should see the interactive button menu!

---

## ✅ You're Done!

Your bot is now running 24/7 on Railway!

---

## 🎯 Next Steps

### For Guild Leader (You):

1. **Set your language:**
   ```
   /setlang en
   ```
   (or ru, ar, fr, es, pt, de, zh)

2. **Assign officers:**
   ```
   /setrole @OfficerName R4
   ```

3. **Enable auto-translation:**
   ```
   /translateon
   ```

4. **Create first event:**
   ```
   /addevent Guild War | 2026-01-25 | 20:00
   ```

### For Guild Members:

1. **Register:**
   ```
   /register TheirGameName
   ```

2. **Set language:**
   ```
   /setlang ru
   ```
   (Russian, Arabic, French, etc.)

3. **Explore menu:**
   ```
   /menu
   ```

---

## 📱 Quick Reference

### Essential Commands
```
/menu       - Open main menu
/help       - Get help
/profile    - Your profile
/stats      - Guild statistics
/events     - Upcoming events
/battles    - Battle history
```

### Admin Commands (R5/R4)
```
/setrole @user R4      - Assign role
/promote @user         - Promote member
/announce <message>    - Send announcement
/startcontest ...      - Start contest
```

### Member Commands
```
/register <name>       - Join guild
/addbattle ...         - Log battle
/addresource ...       - Log resources
/setlang <code>        - Change language
```

---

## 🆘 Troubleshooting

### Bot Not Responding?

**Check 1: Bot is Admin**
- Go to group settings
- Make sure bot is administrator

**Check 2: Token is Correct**
- Go to Railway → Variables
- Verify TELEGRAM_BOT_TOKEN is correct

**Check 3: Bot is Running**
- Go to Railway → Deployments
- Check logs for errors
- Should see: "A8O Guild Bot is running..."

**Check 4: Chat ID is Correct**
- Verify GUILD_CHAT_ID includes minus sign
- Example: `-1001234567890` (not `1001234567890`)

### Commands Not Working?

**Issue: "Only R4+ can..."**
- You need to assign yourself R5 role first
- Use: `/setrole @YourUsername R5`

**Issue: "You need to register first"**
- Register with: `/register YourGameName`

**Issue: Bot responds in wrong language**
- Set your language: `/setlang en`

### Railway Issues?

**Deployment Failed:**
1. Check all files are uploaded to GitHub
2. Verify package.json exists
3. Check Railway logs for errors

**Bot Stops After a While:**
- Railway free tier may sleep after inactivity
- Upgrade to hobby plan ($5/month) for 24/7 uptime

---

## 💰 Costs

### Free Tier (Railway)
- ✅ $5 free credit per month
- ✅ Enough for small guilds
- ⚠️ May sleep after inactivity

### Hobby Plan (Recommended)
- 💵 $5/month
- ✅ 24/7 uptime
- ✅ No sleeping
- ✅ Better performance

---

## 🔒 Security Tips

1. **Never share your bot token**
2. **Keep admin user IDs private**
3. **Only make trusted members R4/R5**
4. **Regularly check member roles**
5. **Monitor bot activity**

---

## 📞 Support

### Need Help?

1. Check this guide again
2. Read README.md
3. Check FEATURES.md for feature list
4. Check ROLES.md for role system
5. Check LANGUAGES.md for language info
6. Check UI_GUIDE.md for menu system

### Common Questions

**Q: Can I use this for multiple guilds?**
A: Yes! Deploy separate instances for each guild.

**Q: How do I update the bot?**
A: Push changes to GitHub, Railway auto-deploys.

**Q: Can I customize the bot?**
A: Yes! Edit the code and redeploy.

**Q: Is my data safe?**
A: Yes! Data is stored in JSON files on Railway.

**Q: Can I backup my data?**
A: Yes! Use `/export` command (coming soon) or download from Railway.

---

## 🎉 Congratulations!

Your A8O Guild Bot is now live! 

Enjoy the most advanced Lords Mobile guild bot in 2026! 🏰👑

---

**Made with ❤️ for A8O Guild**
