export const FEATURE_CREDIT = "Fitur By: xorizn-bot\nSaluran Resmi: https://whatsapp.com/channel/0029VbEAM5cGJP8FzJH1JH0R";


import fetch from 'node-fetch'
import axios from 'axios'
import * as cheerio from 'cheerio'
 const pluginConfig = {
  name: "alkitab",
  alias: [],
  category: "religi",
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

async function handler(m, { text, prefix, command }) {
    const usedPrefix = prefix || m.prefix || "."; 
     if (!text) throw `uhm.. teksnya mana?\n\ncontoh:\n${usedPrefix + command} kejadian` 
     let res = await axios.get(`https://alkitab.me/search?q=${encodeURIComponent(text)}`, { headers: { "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36" } }) 
  
     let $ = cheerio.load(res.data) 
     let result = [] 
     $('div.vw').each(function (a, b) { 
         let teks = $(b).find('p').text().trim() 
         let link = $(b).find('a').attr('href') 
         let title = $(b).find('a').text().trim() 
         result.push({ teks, link, title }) 
     }) 
 
   let foto = 'https://telegra.ph/file/a333442553b1bc336cc55.jpg'
   let judul = '*────────「 Alkitab 」 ────────*'
     let caption = result.map(v => `💌 ${v.title}\n📮 ${v.teks}`).join('\n┄┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┄\n') 
      conn.sendFile(m.chat, foto, 'alkitab.jpg', `${judul}\n\n${caption}`, m)
 }

export { pluginConfig as config, handler };
