module.exports = async function (__naren_imp, __naren_meta) {


let handler = async (m, { text }) => {
	if (!text) throw 'Who wants to be banned?';
	let who;
	if (m.isGroup) who = m.mentionedJid[0];
	else who = m.chat;
	if (!who) throw 'Tag??';
	global.db.data.users[who].banned = true;
	m.reply('Success!');
};
handler.help = ['ban'];
handler.tags = ['owner'];
handler.command = /^ban(user)?$/i;
handler.owner = true;

const __naren_default = handler;;

;return { default: __naren_default };
}
