const fs = require('fs')
const path = require('path')
const axios = require('axios')

// ============================================================
// CONSTANTS
// ============================================================
const RCH_API_ENDPOINT = 'https://apiv2.reactionwa.online/api/v2/react'
const RCH_FIREBASE_API_KEY = 'AIzaSyDNbAlgLycK0oRO8I9ja3mPnIccZkOz0M0'
const RCH_RTDB_URL = 'https://autoreactberry-default-rtdb.asia-southeast1.firebasedatabase.app/api_keys.json'
const RCH_CACHE_DIR = path.join(__dirname, '.cache')
const RCH_STATE_FILE = path.join(RCH_CACHE_DIR, 'rch_vip_state.json')
const RCH_LINK_REGEX = /(?:https?:\/\/)?(?:www\.)?whatsapp\.com\/channel\/([A-Za-z0-9_-]+)\/(\d+)/i
const RCH_EMOJI_REGEX = /\p{Extended_Pictographic}(?:\uFE0F|\uFE0E)?/gu
const RCH_DEFAULT_KEYS = [
  { name: 'VIP-G3FA579P', apiKey: 'BERRY-RCH-s488dmV/Im9CYK9RksIKzHB+PKpqxaGBeDje9boybZoMiEoWLc1EmGG2TA9yTgBOCa9RT56a35exUMwqJG06QTO39LJvF7IWZCVq3FKzME50TUNgJH4=', domain: 'https://berrymodapk.com' },
  { name: 'VIP-VIP-D68J', apiKey: 'BERRY-RCH-UF0CX6Lc+ncL7W/kQldo2v+uKbXtjyqhRg6z/u/GJaoL41jILpCerrfSFQBGLSZnNqHvFrIJ5bnOnDTd2K102CgMulKWZfxGbeo/Fmf9Pi4w2mySyBf5dLAnaw==', domain: 'https://reactv2.zfile.web.id' },
  { name: 'VIP-D68JICP0', apiKey: 'BERRY-RCH-Eu3fhllDTNViiwl8dFcVKfMnJUzSt/UFLTftJ/sZJgPy/nCC3Y7JO+83gJLLhicfp+SEEhfruPHhIE3vJrr0oU5mhEfpa2GcBcC4A/GV9VaInumRoLsmSLjBskNQyVE=', domain: 'https://api.rech.v2.zfile.web.id' },
  { name: 'VIP-H9PQGDBA', apiKey: '5XJr5CoEvcwn6Akmx4TvQPV+ybnaa7VAn8OUYdociEXLS2l06kPypNMFhz5eMExSxrq+/mHz8sOu/5k44dEB016L/QJ3QZpPuYbDiSdpxlVTOR6a14P295M8lQrmMrj0YLJmmne1sQ+1YGhCKSg=', domain: 'https://anzzmodsofficial.edgeone.dev/reaction/wa' },
  { name: 'VIP-SYNOZG8C', apiKey: 'EmCRdHArrxyMxWgwZVbukIcXOFGgz05PleSnm/5E6lP/MNb9rI4R/fqR5ALvCRhe3Q0NmDMw7lBXprFV3w8jen1M', domain: 'https://reactionwa.online' }
]

// ============================================================
// HELPERS
// ============================================================
function rchEnsureCache() {
  if (!fs.existsSync(RCH_CACHE_DIR)) {
    try { fs.mkdirSync(RCH_CACHE_DIR, { recursive: true }) } catch {}
  }
}
function rchLoadState() {
  rchEnsureCache()
  let state = { keyIndex: 0, keys: RCH_DEFAULT_KEYS, lastSync: 0 }
  if (fs.existsSync(RCH_STATE_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(RCH_STATE_FILE, 'utf8'))
      if (typeof data.keyIndex === 'number') state.keyIndex = data.keyIndex
      if (Array.isArray(data.keys) && data.keys.length > 0) state.keys = data.keys
      if (typeof data.lastSync === 'number') state.lastSync = data.lastSync
    } catch {}
  }
  return state
}
function rchSaveState(state) {
  rchEnsureCache()
  try { fs.writeFileSync(RCH_STATE_FILE, JSON.stringify(state, null, 2)) } catch {}
}
async function rchSyncKeys() {
  try {
    const authRes = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${RCH_FIREBASE_API_KEY}`, { returnSecureToken: true }, { headers: { Referer: 'https://reactionwa.online/' }, timeout: 10000 })
    const idToken = authRes.data && authRes.data.idToken
    if (!idToken) return null
    const dbRes = await axios.get(`${RCH_RTDB_URL}?auth=${idToken}`, { timeout: 10000 })
    if (!dbRes.data || typeof dbRes.data !== 'object') return null
    const freshKeys = []
    for (const [name, val] of Object.entries(dbRes.data)) {
      if (val && val.active !== false && val.apiKey) {
        freshKeys.push({ name, apiKey: val.apiKey, domain: val.domain === '*' ? 'https://reactionwa.online' : (val.domain || 'https://reactionwa.online') })
      }
    }
    if (freshKeys.length > 0) {
      const state = rchLoadState()
      state.keys = freshKeys
      state.lastSync = Date.now()
      rchSaveState(state)
      return freshKeys
    }
  } catch {}
  return null
}
function rchNormalizeUrl(inputUrl) {
  const match = String(inputUrl || '').match(RCH_LINK_REGEX)
  if (!match) return null
  return `https://whatsapp.com/channel/${match[1]}/${match[2]}`
}
function rchParseEmojis(inputEmoji) {
  const matches = String(inputEmoji || '').match(RCH_EMOJI_REGEX)
  if (!matches || matches.length === 0) return null
  return matches.slice(0, 5).join(', ')
}
async function rchSendRequest(targetUrl, reactionText, keyObj) {
  const origin = keyObj.domain === '*' ? 'https://reactionwa.online' : keyObj.domain
  const referer = origin.endsWith('/') ? origin : origin + '/'
  const response = await axios.post(RCH_API_ENDPOINT, { url: targetUrl, reaction: reactionText }, {
    headers: {
      'Content-Type': 'application/json',
      'Origin': origin,
      'Referer': referer,
      'x-api-key': keyObj.apiKey,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    timeout: 45000
  })
  return response.data
}
async function rchReact(targetUrl, reactionInput) {
  const startTime = Date.now()
  const normalizedUrl = rchNormalizeUrl(targetUrl)
  if (!normalizedUrl) return { status: false, time: `${Date.now() - startTime}ms`, error: 'Format URL WhatsApp Channel tidak valid.' }
  const emojiString = rchParseEmojis(reactionInput)
  if (!emojiString) return { status: false, time: `${Date.now() - startTime}ms`, error: 'Emoji tidak valid.' }
  const state = rchLoadState()
  if (!state.keys || state.keys.length === 0) state.keys = RCH_DEFAULT_KEYS
  let attempts = 0
  const maxAttempts = state.keys.length
  let lastError = 'Semua VIP Key sedang sibuk / limit.'
  while (attempts < maxAttempts) {
    const currentKey = state.keys[state.keyIndex % state.keys.length]
    state.keyIndex = (state.keyIndex + 1) % state.keys.length
    rchSaveState(state)
    try {
      const result = await rchSendRequest(normalizedUrl, emojiString, currentKey)
      if (result && (result.success === true || result.status === 'success')) {
        const task = (result.data && result.data.task) || {}
        const vipInfo = (result.data && result.data.vip) || {}
        return {
          status: true,
          time: `${Date.now() - startTime}ms`,
          message: result.message || 'Reaction VIP masuk antrean.',
          data: {
            target: normalizedUrl,
            emojis: task.reaction_code || emojiString,
            vip_key: currentKey.name,
            vip_package: vipInfo.packageName || 'VIP Permanent',
            usage_today: result.usage_today || null,
            limit: result.limit || 50,
            points_remaining: vipInfo.pointRemaining ?? null
          }
        }
      }
      if (result && result.error) lastError = result.error
    } catch (err) {
      const errData = err.response && err.response.data
      lastError = (errData && errData.error) || err.message || 'Error server'
    }
    attempts++
  }
  return { status: false, time: `${Date.now() - startTime}ms`, error: lastError }
}

module.exports = {
  name: 'rch',
  command: ['rch'],
  category: 'tools',
  desc: 'Reaction Channel WA VIP (IzzXd API) - Auto Reaction Saluran',
  usage: '<url_channel> <emoji>',
  // owner: false,
  // group: false,
  run: async ({ sock, msg, from, sender, args, text, prefix, reply }) => {
    
    if (!text || !text.includes(' ')) {
      return reply(
        `⚠️ *Format Salah!*\n\n` +
        `Gunakan: *${prefix}rch <url_channel> <emoji>*\n\n` +
        `Contoh:\n` +
        `• ${prefix}rch https://whatsapp.com/channel/0029Vb7pLCF35fLqMBUCMP1D/123 🔥\n` +
        `• ${prefix}rch https://whatsapp.com/channel/0029Vb7pLCF35fLqMBUCMP1D/123 🔥,🚀,👑\n\n` +
        `_Maks 5 emoji_`
      )
    }

    const firstSpaceIndex = text.indexOf(' ')
    const targetUrl = text.substring(0, firstSpaceIndex).trim()
    const rawEmoji = text.substring(firstSpaceIndex + 1).trim()

    if (!rchNormalizeUrl(targetUrl)) {
      return reply(`❌ URL channel tidak valid! Harus ada ID pesan di akhir, contoh: https://whatsapp.com/channel/xxxxx/158`)
    }

    await reply(`⏳ *Memproses reaction VIP...*`)

    // sync key (fire & forget)
    rchSyncKeys().catch(() => {})

    try {
      const result = await rchReact(targetUrl, rawEmoji)

      if (!result.status) {
        return reply(`❌ *REACTION GAGAL!*\n\n⚠️ Error: ${result.error}\n⏱️ Time: ${result.time}`)
      }

      const d = result.data || {}
      return reply(
        `✅ *REACTION VIP MASUK ANTRIAN!*\n\n` +
        `🎭 *Emoji:* ${d.emojis || rawEmoji}\n` +
        `🔗 *Target:* ${d.target || targetUrl}\n\n` +
        `👑 *VIP Key:* ${d.vip_key || '-'}\n` +
        `📦 *Paket:* ${d.vip_package || 'VIP Permanent'}\n` +
        `📊 *Usage:* ${d.usage_today ?? '-'} / ${d.limit ?? 50}\n` +
        `🪙 *Poin:* ${d.points_remaining ?? '-'}\n\n` +
        `⏱️ *Time:* ${result.time}\n` +
        `👤 Creator: IzzXd`
      )

    } catch (e) {
      console.error('RCH ERROR:', e)
      return reply(`❌ *REACTION ERROR!*\n\n${e.message || e}`)
    }
  }
}
