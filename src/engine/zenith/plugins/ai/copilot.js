export const FEATURE_CREDIT = "Fitur By: xorizn-bot\nSaluran Resmi: https://whatsapp.com/channel/0029VbEAM5cGJP8FzJH1JH0R";


/*• Nama Fitur : copilot 3 model
• Type : Plugin ESM
• Link Channel : https://whatsapp.com/channel/0029VbEAM5cGJP8FzJH1JH0R
• Author : Z7
*/
const pluginConfig = {
  name: "copilot",
  alias: [],
  category: "ai",
  description: "",
  usage: "",
  example: "",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock, text, prefix, command }) {
    const conn = sock;
    const usedPrefix = prefix || m.prefix || ".";
  if (!text) {
    throw `Please provide a message.\n\nExample: ${usedPrefix + command} Hello, what is a black hole?`;
  }

  try {
    await m.reply('Thinking...');

    const models = ['default', 'gpt-5', 'think-deeper'];
    const randomModel = models[Math.floor(Math.random() * models.length)];
    
    const apiUrl = `https://theresapis.vercel.app/ai/copilot?message=${encodeURIComponent(text)}&model=${randomModel}`;
    
    const response = await fetch(apiUrl);
    const json = await response.json();

    if (json.status && json.result && json.result.text) {
      const resultText = json.result.text;
      await m.reply(`${resultText}\n\n*(Model: ${randomModel})*`);
    } else {
      throw new Error('Invalid API response format or failed request.');
    }
  } catch (error) {
    console.error(error);
    m.reply('Sorry, an error occurred while processing your request. Please try again later.');
  }
};

handler.description = 'Chat with an AI using a randomly selected model (default, gpt-5, think-deeper).';

export { pluginConfig as config, handler };
