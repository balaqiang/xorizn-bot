// Dummy database sementara untuk menyimpan current channel (bisa diganti pakai global.db nantinya)
let currentChannel = { id: '120363432093486679@newsletter', name: '𝐢𝐧𝐟𝐨 & 𝐮𝐩𝐝𝐚𝐭𝐞 vanXone 𝐦𝐝' }

export const ch = {
  pickTarget: async (conn, rawText) => {
    let id = currentChannel?.id
    let name = currentChannel?.name
    let rest = rawText || ''

    // Cek jika user menyisipkan link channel di awal teks
    const match = rawText.match(/https:\/\/whatsapp\.com\/channel\/([A-Za-z0-9]+)/i)
    if (match) {
      // Logic untuk resolve invite link ke JID channel bisa ditambahkan di sini
      // Sementara kita asumsikan extract ID dari invite code / metadata Baileys
      id = `${match[1]}@newsletter`
      name = 'Saluran Kustom'
      rest = rawText.replace(match[0], '').trim()
    }

    return { id, name, rest }
  },

  getCurrent: () => currentChannel,

  setCurrent: (id, name) => {
    currentChannel = { id, name }
  },

  assertCanPost: (target) => {
    if (!target || !target.id || !target.id.endsWith('@newsletter')) {
      throw new Error('ID Saluran tidak valid atau belum diatur.')
    }
    return true
  },

  explain: (err) => {
    if (err.message.includes('not-authorized')) return 'Bot tidak memiliki akses admin ke saluran tersebut.'
    return `Terjadi kesalahan saat memposting: ${err.message}`
  }
}