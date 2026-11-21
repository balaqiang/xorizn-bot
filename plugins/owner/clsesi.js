// Port dari 'plugin baru' (clear-sesions.js) — logika & teks output sama dengan plugin asal; dijalankan lewat lib/sahril.js.
const S = require('../../lib/engine/core')
const fs = require('fs')

const handler = async (m, { sock, reply }) => {
	const pathAuth = './session';
	const pathTrash = './data/trash';

	if (!fs.existsSync(pathAuth)) fs.mkdirSync(pathAuth, { recursive: true });
	if (!fs.existsSync(pathTrash)) fs.mkdirSync(pathTrash, { recursive: true });
	const dirsesi = fs.readdirSync(pathAuth).filter((e) => e !== 'creds.json');
	const dirsampah = fs.readdirSync(pathTrash).filter((e) => e !== 'tmp');

	for (const file of dirsesi) {
		try {
			fs.unlinkSync(`${pathAuth}/${file}`);
		} catch (e) {
			console.error(`Gagal hapus ${file}:`, e.message);
		}
	}

	for (const file of dirsampah) {
		try {
			fs.unlinkSync(`${pathTrash}/${file}`);
		} catch (e) {
			console.error(`Gagal hapus ${file}:`, e.message);
		}
	}

	reply(`*Berhasil membersihkan sampah ✅*
	
- *${dirsesi.length}* sampah session
- *${dirsampah.length}* sampah file`);
};

handler.command = ['clsesi', 'clearsesion', 'clearsesi'];
handler.owner = true;
handler.noJadiBot = true
handler.mainOwner = true

module.exports = S.wrap(handler, {"category": "owner"})
