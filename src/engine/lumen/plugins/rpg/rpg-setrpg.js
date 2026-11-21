let handler = async (m,{conn,args})=>{

let user = global.db.data.users[m.sender]

let type = (args[0]||'').toLowerCase()

if(type !== 'lumen')
return conn.reply(m.chat,'Gunakan:\n.setrpg lumen',m)

if(user.lumen)
return conn.reply(m.chat,'Kamu sudah menjadi Adventurer xorizn-bot',m)

user.lumen = true

conn.reply(m.chat,`
🌸 *xorizn-bot RPG* ❀

Selamat datang Adventurer!

Sekarang kamu bisa berburu monster dengan:
.huntanya
`,m)

}

handler.help = ['setrpg']
handler.tags = ['rpg']
handler.command = /^(setrpg)$/i
handler.group = true

export default handler