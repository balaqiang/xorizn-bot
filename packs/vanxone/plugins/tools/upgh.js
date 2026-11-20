// Port dari 'plugin baru' (tourl-github.js) — logika & teks output sama dengan plugin asal; dijalankan lewat lib/sahril.js.
const S = require('../../lib/engine/core')
const fs = require('fs')
const axios = require('axios')
const crypto = require('crypto')
const { fileTypeFromBuffer } = S

const branch = 'main';
let repos = ['cdn1', 'cdn2', 'cdn3', 'cdn4', 'cdn5'];

async function ensureRepoExists(repo) {
  try {
    await axios.get(`https://api.github.com/repos/${global.userGh}/${repo}`, {
      headers: { Authorization: `Bearer ${global.ghTokens}` }
    });
  } catch (e) {
    if (e.response?.status === 404) {
      await axios.post(`https://api.github.com/user/repos`,
        { name: repo, private: false },
        { headers: { Authorization: `Bearer ${global.ghTokens}` } }
      );
      if (!repos.includes(repo)) repos.push(repo);
    } else throw e;
  }
}

function generateRepoName() {
  return `cdn-${crypto.randomBytes(3).toString('hex')}`;
}

async function uploadFile(buffer, originalName = "file") {
  const detected = await fileTypeFromBuffer(buffer);
  const ext = detected?.ext || (originalName.split('.').pop() || 'bin');
  const code = crypto.randomBytes(3).toString('hex');
  const fileName = `${code}-${Date.now()}.${ext}`;
  const filePathGitHub = `uploads/${fileName}`;
  const base64Content = Buffer.from(buffer).toString('base64');

  let targetRepo = repos[Math.floor(Math.random() * repos.length)];
  try { await ensureRepoExists(targetRepo); }
  catch { targetRepo = generateRepoName(); await ensureRepoExists(targetRepo); }

  await axios.put(
    `https://api.github.com/repos/${global.userGh}/${targetRepo}/contents/${filePathGitHub}`,
    { message: `Upload file ${fileName}`, content: base64Content, branch },
    { headers: { Authorization: `Bearer ${global.ghTokens}` } }
  );

  return `https://raw.githubusercontent.com/${global.userGh}/${targetRepo}/${branch}/${filePathGitHub}`;
}

const handler = async (m, { sock, reply, example }) => {
  try {

    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || '';

    if (!mime && !q?.message?.documentMessage) 
      return m.reply(example('mana file/foto/videonya.'));

    m.react('⌛');

    const buffer = await q.download();
    const originalName =
      q?.message?.documentMessage?.fileName ||
      `file-${Date.now()}.${mime.split('/')[1] || 'bin'}`;

    const url = await uploadFile(buffer, originalName);

    await S.sendButtons(sock, m.chat, {
		text: `*Berhasil upload!*
    
URL: ${url}
Size: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`,
		footer: `© ${global.namaBot} - github.com`,
		buttons: [
	      { 
			 displayText: 'Open', 
			 url: url 
	      },
		  { 
		     displayText: 'Copy', 
		     copy: url 
		  }
	   ]
    }, { quoted: m })
  } catch (e) {
    console.error(e);
    m.reply('❌ ' + e.message);
  }
};

handler.command = ["upgh", 'url', 'cdn'];
handler.noJadiBot = true

module.exports = S.wrap(handler, {"category": "tools"})
