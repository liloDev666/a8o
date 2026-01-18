import Tesseract from 'tesseract.js';
import { getMember, updateMember } from '../database.js';

export async function handleScreenshot(bot, msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  if (!msg.photo || msg.photo.length === 0) {
    bot.sendMessage(chatId, '❌ Please send a screenshot with this command!');
    return;
  }
  
  bot.sendMessage(chatId, '🔍 Analyzing screenshot...');
  
  try {
    const photo = msg.photo[msg.photo.length - 1];
    const file = await bot.getFile(photo.file_id);
    const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
    
    const { data: { text } } = await Tesseract.recognize(fileUrl, 'eng');
    
    // Extract might from text
    const mightMatch = text.match(/(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*[MmKk]?/);
    
    if (mightMatch) {
      let might = parseFloat(mightMatch[1].replace(/,/g, ''));
      
      // Convert K/M to actual numbers
      if (text.toLowerCase().includes('m')) {
        might *= 1000000;
      } else if (text.toLowerCase().includes('k')) {
        might *= 1000;
      }
      
      const member = getMember(userId);
      if (member) {
        updateMember(userId, { might: Math.floor(might) });
        
        bot.sendMessage(chatId, 
          `✅ *Stats Updated!*\n\n⚔️ Might: ${Math.floor(might).toLocaleString()}\n\nGreat progress! 💪`,
          { parse_mode: 'Markdown' }
        );
      } else {
        bot.sendMessage(chatId, 
          `📊 Detected Might: ${Math.floor(might).toLocaleString()}\n\nRegister first with /register to save stats!`
        );
      }
    } else {
      bot.sendMessage(chatId, '❌ Could not detect stats. Make sure the screenshot is clear!');
    }
  } catch (error) {
    console.error('OCR Error:', error);
    bot.sendMessage(chatId, '❌ Error analyzing screenshot. Try again with a clearer image!');
  }
}

export function handleScanHelp(bot, msg) {
  const chatId = msg.chat.id;
  
  const message = `
📸 *Screenshot Analysis*

Send me screenshots of:
• Your profile (to update might)
• Battle reports (to log kills)
• Resource screens (to track resources)

*How to use:*
1. Take a clear screenshot
2. Send it with caption: \`/scan\`
3. I'll extract and save the data!

*Tips for best results:*
✅ Good lighting
✅ Clear text
✅ Full screen capture
❌ Avoid blurry images
  `;
  
  bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
}
