# 🌍 Multi-Language Support

The A8O Guild Bot supports **8 languages** to accommodate your international guild members!

## Supported Languages

| Language | Code | Flag | Native Name |
|----------|------|------|-------------|
| English | `en` | 🇬🇧 | English |
| Russian | `ru` | 🇷🇺 | Русский |
| Arabic | `ar` | 🇸🇦 | العربية |
| French | `fr` | 🇫🇷 | Français |
| Spanish | `es` | 🇪🇸 | Español |
| Portuguese | `pt` | 🇵🇹 | Português |
| German | `de` | 🇩🇪 | Deutsch |
| Chinese | `zh` | 🇨🇳 | 中文 |

## How to Change Language

### Method 1: Interactive Menu
```
/languages
```
or
```
/lang
```
This shows a button menu where you can click your preferred language.

### Method 2: Direct Command
```
/setlang <code>
```

**Examples:**
- `/setlang ru` - Switch to Russian
- `/setlang ar` - Switch to Arabic
- `/setlang fr` - Switch to French
- `/setlang es` - Switch to Spanish
- `/setlang pt` - Switch to Portuguese
- `/setlang de` - Switch to German
- `/setlang zh` - Switch to Chinese
- `/setlang en` - Switch back to English

## What Gets Translated?

✅ **Welcome messages**
✅ **Command descriptions**
✅ **Success/error messages**
✅ **Button labels**
✅ **System notifications**
✅ **Achievement unlocks**
✅ **Event reminders**

## Personal Language Settings

- Each member can set their own language preference
- Language is saved to your profile
- All bot responses will be in your chosen language
- Commands work the same in all languages

## Examples in Different Languages

### English 🇬🇧
```
/register DragonSlayer
✅ Welcome to A8O, DragonSlayer!
Use /profile to view your stats.
```

### Russian 🇷🇺
```
/register DragonSlayer
✅ Добро пожаловать в A8O, DragonSlayer!
Используйте /profile для просмотра статистики.
```

### Arabic 🇸🇦
```
/register DragonSlayer
✅ مرحباً بك في A8O، DragonSlayer!
استخدم /profile لعرض إحصائياتك.
```

### French 🇫🇷
```
/register DragonSlayer
✅ Bienvenue à A8O, DragonSlayer!
Utilisez /profile pour voir vos stats.
```

### Spanish 🇪🇸
```
/register DragonSlayer
✅ ¡Bienvenido a A8O, DragonSlayer!
Usa /profile para ver tus estadísticas.
```

### Portuguese 🇵🇹
```
/register DragonSlayer
✅ Bem-vindo ao A8O, DragonSlayer!
Use /profile para ver suas estatísticas.
```

### German 🇩🇪
```
/register DragonSlayer
✅ Willkommen bei A8O, DragonSlayer!
Verwende /profile für deine Stats.
```

### Chinese 🇨🇳
```
/register DragonSlayer
✅ 欢迎加入A8O，DragonSlayer！
使用/profile查看你的统计。
```

## Adding More Languages

Want to add more languages? Edit `src/i18n/translations.js` and add a new language object following the existing pattern.

## Technical Details

### How It Works
1. Each user's language preference is stored in their member profile
2. When a command is executed, the bot checks the user's language setting
3. Messages are automatically translated using the translation system
4. If a translation is missing, it falls back to English

### Translation Function
```javascript
t(lang, 'welcome.title')
// Returns translated text based on user's language
```

### User Language Detection
```javascript
getUserLanguage(userId, db)
// Returns user's preferred language or default (English)
```

## Benefits for Your Guild

🌍 **Inclusive** - Everyone can use the bot in their native language
🚀 **Easy to use** - One command to switch languages
💬 **Better communication** - Clear messages for all members
🎯 **More engagement** - Members feel more comfortable
🏆 **Professional** - Shows your guild cares about diversity

## Default Language

The bot defaults to **English** for:
- New users who haven't set a language
- Guild-wide announcements
- Error messages (with fallback)

## Language in Group Chats

In group chats, each member sees messages in their own language when they interact with the bot. This means:
- Russian members see Russian
- Arabic members see Arabic
- French members see French
- And so on!

## Quick Reference

| Command | Purpose |
|---------|---------|
| `/languages` | Show language menu |
| `/lang` | Show language menu (short) |
| `/setlang en` | Set to English |
| `/setlang ru` | Set to Russian |
| `/setlang ar` | Set to Arabic |
| `/setlang fr` | Set to French |
| `/setlang es` | Set to Spanish |
| `/setlang pt` | Set to Portuguese |
| `/setlang de` | Set to German |
| `/setlang zh` | Set to Chinese |

---

**Your guild, your language!** 🌍
