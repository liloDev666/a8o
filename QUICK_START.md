# ⚡ Quick Start - 5 Minutes

Get your bot running FAST!

## 🎯 What You Need

1. Telegram bot token
2. Guild group chat ID
3. Your user ID
4. GitHub account
5. Railway account

---

## 📝 Step-by-Step

### 1️⃣ Create Bot (2 min)
```
1. Message @BotFather on Telegram
2. Send: /newbot
3. Name: A8O Guild Bot
4. Username: a8o_guild_bot
5. Copy the token
```

### 2️⃣ Get IDs (2 min)
```
1. Add bot to your guild group
2. Make bot admin
3. Send message in group
4. Visit: https://api.telegram.org/botYOUR_TOKEN/getUpdates
5. Copy chat ID (with minus sign)
6. Message @userinfobot for your user ID
```

### 3️⃣ Deploy (3 min)
```
1. Upload code to GitHub
2. Go to railway.app
3. Login with GitHub
4. New Project → Deploy from GitHub
5. Add 3 variables:
   - TELEGRAM_BOT_TOKEN
   - GUILD_CHAT_ID
   - ADMIN_USER_IDS
6. Deploy!
```

### 4️⃣ Test (1 min)
```
In your guild group:
/start
/register YourName
/setrole @YourUsername R5
/menu
```

---

## ✅ Done!

Bot is running 24/7!

**Full guide:** See SETUP_GUIDE.md

---

## 🚀 First Commands

```bash
# Register members
/register DragonKing

# Set language
/setlang ru

# Assign roles
/setrole @Officer R4

# Enable translation
/translateon

# Create event
/addevent Guild War | 2026-01-25 | 20:00

# Log battle
/addbattle [XYZ]Enemy | won | 2500000

# View stats
/stats

# Open menu
/menu
```

---

## 🆘 Problems?

**Bot not responding?**
- Check bot is admin in group
- Verify token in Railway variables
- Check Railway logs

**Commands not working?**
- Register first: `/register YourName`
- Set role: `/setrole @You R5`

**Need help?**
- Read SETUP_GUIDE.md
- Check README.md

---

**That's it! Enjoy your bot! 🎉**
