export async function handleScreenshot(bot, msg) {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, 
    '📸 *Screenshot Scanner*\n\nOCR feature is temporarily disabled to ensure stable deployment.\n\nPlease manually update your stats using:\n`/register YourName` to set your game name\n\nFull OCR support coming soon!',
    { parse_mode: 'Markdown' }
  );
}

export function handleScanHelp(bot, msg) {
  const chatId = msg.chat.id;
  
  const message = `
📸 *Screenshot Analysis (Coming Soon)*

This feature will allow you to:
• Upload profile screenshots to auto-update might
• Scan battle reports to extract kills
• Parse resource screens automatically

*For now, please use manual commands:*
\`/register YourGameName\` - Set your name
\`/addbattle enemy|result|kills\` - Log battles
\`/addresource type amount\` - Log resources

Full OCR support will be added in the next update! 🚀
  `;
  
  bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
}
