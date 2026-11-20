const axios = require('axios')
const { getQuotedText } = require('../../lib/utils')

// riwayat singkat per chat (hilang saat bot restart)
const history = new Map()
const MAX_TURNS = 6

module.exports = {
  name: 'ai',
  command: ['ai', 'ask', 'gpt', 'tanya'],
  category: 'tools',
  desc: 'Tanya AI (gratis tanpa API key, atau pakai key sendiri)',
  usage: '<pertanyaan> | reset',
  run: async ({ from, sender, msg, text, config, prefix, reply }) => {
    const cfg = config.ai || {}
    const free = !cfg.apiKey
    if (free && !cfg.free?.url) return reply('Fitur AI belum aktif. Owner perlu mengisi ai.apiKey di config.js.')

    const key = `${from}:${sender}`
    if (text.toLowerCase() === 'reset') {
      history.delete(key)
      return reply('Riwayat percakapan AI dihapus.')
    }

    const quoted = getQuotedText(msg)
    const question = [quoted && `Konteks (pesan yang di-reply):\n${quoted}`, text].filter(Boolean).join('\n\n')
    if (!question) return reply(`Contoh: ${prefix}ai jelaskan apa itu blockchain`)

    const past = history.get(key) || []
    const messages = [
      { role: 'system', content: cfg.system || 'Kamu asisten WhatsApp yang membantu.' },
      ...past,
      { role: 'user', content: question }
    ]

    try {
      // Provider resmi Anthropic (Claude): set ai.provider = 'anthropic' dan ai.apiKey (console.anthropic.com)
      if (!free && cfg.provider === 'anthropic') {
        const sys = messages.filter((m) => m.role === 'system').map((m) => m.content).join('\n')
        const { data } = await axios.post(
          cfg.url && /anthropic\.com/.test(cfg.url) ? cfg.url : 'https://api.anthropic.com/v1/messages',
          { model: cfg.model || 'claude-sonnet-5-5', max_tokens: 1024, system: sys, messages: messages.filter((m) => m.role !== 'system') },
          { headers: { 'x-api-key': cfg.apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' }, timeout: 90000 }
        )
        const answer = (data?.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('').trim()
        if (!answer) return reply('AI tidak memberikan jawaban. Coba lagi.')
        history.set(key, [...past, { role: 'user', content: question }, { role: 'assistant', content: answer }].slice(-MAX_TURNS * 2))
        return reply(answer)
      }

      const { data } = await axios.post(
        free ? cfg.free.url : cfg.url || 'https://api.openai.com/v1/chat/completions',
        { model: free ? cfg.free.model || 'openai' : cfg.model || 'gpt-4o-mini', messages, temperature: 0.7 },
        { headers: free ? {} : { Authorization: `Bearer ${cfg.apiKey}` }, timeout: 60000 }
      )
      const answer = data?.choices?.[0]?.message?.content?.trim()
      if (!answer) return reply('AI tidak memberikan jawaban. Coba lagi.')

      history.set(key, [...past, { role: 'user', content: question }, { role: 'assistant', content: answer }].slice(-MAX_TURNS * 2))
      await reply(answer)
    } catch (err) {
      const code = err.response?.status
      console.log('[AI]', code || err.message)
      await reply(code === 401 ? (free ? 'Layanan AI gratis sedang meminta kunci/login. Owner bisa mengisi ai.apiKey di config.js.' : 'API key AI tidak valid. Hubungi owner.') : code === 429 ? 'Kuota/batas AI tercapai. Coba lagi nanti.' : 'Gagal menghubungi AI. Coba lagi nanti.')
    }
  }
}
