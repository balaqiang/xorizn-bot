import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const SETMENU_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), 'setmenu.js')
let _cache = null
let _cacheMtime = 0

const loadSetmenu = async () => {
	const stat = fs.statSync(SETMENU_PATH)
	if (_cache && stat.mtimeMs === _cacheMtime) return _cache

	const mod = await import(`file://${SETMENU_PATH}?update=${stat.mtimeMs}`)
	_cache = mod
	_cacheMtime = stat.mtimeMs
	return mod
}

const handler = async (m, { sock, getMenuData, usedPrefix, isOwner, isPremium, text, botSet, getMenuConfig, isJadiBot, db, richMenu }) => {

	// mode rich (.uimode rich): kartu menu interaktif xorizn-bot; mode text atau gagal -> lanjut ke menu teks di bawah
	if (typeof richMenu === 'function' && await richMenu((text || '').trim().toLowerCase())) return

	const { MENU_TYPES } = await loadSetmenu()
	const rawMenu = getMenuData()
	const sub = (text || '').trim().toLowerCase()

	const menu = {}
	for (const [cat, cmds] of Object.entries(rawMenu || {})) {
		menu[cat] = (cmds || []).map(c => {
			if (typeof c === 'string') return c
			if (Array.isArray(c)) return c[0]
			const cmd = c.cmd ?? c.command
			if (Array.isArray(cmd)) return cmd[0]
			if (typeof cmd === 'string') return cmd
			return c
		})
	}

	const status = isOwner ? 'owner' : isPremium ? 'premium' : 'free user'
	const typeSub = `${font(`this is the result for the *menu ${sub}*`)}`
	const prfx = botSet.multiprefix ? `[${botSet.prefix || '.'}]` : 'multi prefix'
	const info = m.senderInfo
	const myinfo = info?.username ? `@${info.username}` : info?.jid?.split('@')[0] || info?.lid?.split('@')[0] || m.sender.split('@')[0]
	const limitInfo = (isOwner || isPremium) ? 'unlimited' : (() => { const l = db.getLimitInfo(m.sender); return `${l.limit}/${l.max}` })()
	
	const config = getMenuConfig()
	const wantKey = isJadiBot && config.type === 'poll menu' ? 'extended' : config.type
	const entry = Object.values(MENU_TYPES).find(v => v.key === wantKey) || MENU_TYPES[2]

	const greeting = m.pushName || 'kak'
	
	const formatSection = (category, cmds) => {
		if (!cmds?.length) return ''
		const label = (c) => {
			const rawCmd = c.cmd ?? (Array.isArray(c.command) ? c.command[0] : c.command) ?? c
			const name = typeof rawCmd === 'string' ? rawCmd : (rawCmd?.cmd ?? '')
			return `${usedPrefix}${name}`
		}
		const lines = cmds.map((c) => `▢ ${label(c)}`)
		return `${font(`*⌯ menu ${category}*\n${lines.join('\n')}`)}`
	}

	const botInfo = `${font(`*⌯ bot info:*`)}
- bot name : *${global.namaBot}*
- creator : *${global.namaOwner}*
- prefix : \`${prfx}\`
- mode : *${botSet.public ? 'public' : 'self'}*
- library : *${global.library}*
- version : \`${global.versi}\`
- runtime : *${global.rtBot}*
- type : *${global.typeSc}*
- database : *${global.data}*`

	const userInfo = `${font(`*⌯ users info:*`)}
- name : *${m.pushName}*
- number/username : *${myinfo}*
- status : *${status}*
- limit : \`${limitInfo}\``

	const CATEGORY_ALIAS = {
		random: 'main',
	}

	const allFolders = Object.keys(menu).sort()
	let teks = ''

	if (sub === 'all') {
		teks = `${font(`Hello *${greeting}*`)}
${font(`Here are all the *commands* in this source!`)}

${botInfo}

${userInfo}

`
		for (const [cat, cmds] of Object.entries(menu)) {
			teks += formatSection(cat, cmds) + '\n\n'
		}

	} else if (sub) {
		const folder = CATEGORY_ALIAS[sub] || sub
		teks = `Hello ${greeting}\n${typeSub}\n\n${userInfo}\n\n`

		if (menu[folder]?.length) {
			teks += formatSection(folder, menu[folder]) + '\n'
		} else if (folder in menu) {
			teks += `Belum ada command di kategori *${folder}*\n`
		} else {
			teks += `*Kategori ${sub}* tidak ditemukan.\n\nKategori tersedia:\n` +
				allFolders.map(f => `- ${f}`).join('\n') + '\n'
		}

	} else {
		const REVERSE_ALIAS = Object.fromEntries(Object.entries(CATEGORY_ALIAS).map(([k, v]) => [v, k]))
		const list = ['all', ...allFolders.map(f => REVERSE_ALIAS[f] || f)]

		teks = `hi ${greeting} 🪸, i am an automated system (WhatsApp Bot) that can help to do something, search and get data / information only through WhatsApp.

${botInfo}

${userInfo}

${font(`*⌯ cmd category*`)}
${list.map(c => `- ${c}`).join('\n')}

${font(`*use:* ${usedPrefix}menu [category]`)}
${font(`*ex:* ${usedPrefix}menu all`)}`
	}

	if (entry.buildSubmenuPoll && sub) {
		return entry.buildSubmenuPoll({ sock, m, customText: teks })
	}

	return entry.build({ sock, m, menu, usedPrefix, status, customText: teks, isMainMenu: !sub })
}

handler.command = ['menu']
export default handler