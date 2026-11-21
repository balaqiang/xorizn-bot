const ENDPOINT = "https://token-netflix.vercel.app/api/generate"
const CREATOR = "vanXone"

function buildLinks(token) {
  return {
    browser: `https://www.netflix.com/login?nftoken=${token}`,
    mobile: `https://netflix.com/unsupported?nftoken=${token}`,
    tv: `https://www.netflix.com/tv?nftoken=${token}`,
    pc: `https://www.netflix.com/browse?nftoken=${token}`
  }
}

async function generateNetflix(count = 1) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ count, stream: false })
  })
  const data = await res.json()
  return data
}

module.exports = {
  name: 'nf-gen',
  command: ['nf-gen', 'netflixgen', 'nfgen'],
  category: 'premium',
  desc: 'Netflix token vip by vanXone',
  usage: '[jumlah]',
  run: async ({ sock, msg, from, args, text, prefix, reply }) => {
    const count = parseInt(args[0]) || 1
    if (count < 1 || count > 5) return reply(`Contoh: ${prefix}nf-gen 1`)

    try {
      await reply(`⏳ Generating ${count} token by ${CREATOR}...`)
      const result = await generateNetflix(count)
      const tokens = result.data || []

      if (!tokens.length) return reply(`❌ Stok habis / API error\n${JSON.stringify(result).slice(0, 1000)}`)

      const sukses = tokens.filter(t => t.success).length

      let txt = `⚔ *NETFLIX-TOKEN*\n\n`
      txt += `┌─ *Ringkasan Hasil*\n`
      txt += `│ ◦ Status : true\n`
      txt += `│ ◦ Negara : Indonesia (ID)\n`
      txt += `│ ◦ Stok : ${sukses} tersisa\n`
      txt += `│ ◦ Total : ${sukses} / ${count}\n`
      txt += `└\n\n`
      txt += `┌─ *Daftar Token VIP*\n`

      tokens.forEach((item, idx) => {
        if (!item.success) return
        const links = buildLinks(item.token)
        const p = item.profile || {}

        txt += `│\n`
        txt += `│ ${idx + 1}. Token:\n`
        txt += `│ ${item.token}\n`
        txt += `│\n`
        txt += `│ ◦ Country : ${p.country || 'ID'}\n`
        txt += `│ ◦ Name : ${p.countryName || 'Indonesia'}\n`
        txt += `│ ◦ Remaining : ${p.remaining?? 0}\n`
        txt += `│ ◦ Status : ${p.status || 'Active'}\n`
        txt += `│ ◦ Email : ${p.email || 'yo***@gmail.com'}\n`
        txt += `│ ◦ Plan : ${p.plan || 'Premium'}\n`
        txt += `│ ◦ Country : ${p.country || 'ID'}\n`
        txt += `│ ◦ Payments : ${p.payments || '•••••' + (p.last4 || '5076')}\n`
        txt += `│ ◦ Next Billing: ${p.nextBilling || '5 November 2026'}\n`
        txt += `│ ◦ Member Since: ${p.memberSince || 'November 2023'}\n`
        txt += `│ ◦ Phone : ${p.phone || '0821-7650-****'}\n`
        txt += `│ ◦ Connection : ${p.connection || '4 devices · UHD'}\n`
        txt += `│ ◦ Profiles : ${p.profiles || 5}\n`
        txt += `│ ◦ Profile Sub-System: ${p.profileSystem || '5 profiles'}\n`
        txt += `│ ◦ Expires : ${item.expiry? new Date(item.expiry).toLocaleString() : '10/5/2026, 12:10:54 PM'}\n`
        txt += `│\n`
        txt += `│ ◦ Link Browser: ${links.browser}\n`
        txt += `│\n`
        txt += `│ ◦ Link Mobile : ${links.mobile}\n`
        txt += `│\n`
        txt += `│ ◦ Link TV : ${links.tv}\n`
      })

      txt += `└\n\n`
      txt += `_Creator: ${CREATOR} | ${result.time_ms || ''}ms_`

      await sock.sendMessage(from, { text: txt }, { quoted: msg })

    } catch (e) {
      reply(`❌ Error: ${e.message}`)
    }
  }
}
