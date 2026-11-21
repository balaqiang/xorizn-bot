export const getMedia = async (conn, m, allowedTypes) => {
  // Ambil objek media dari pesan saat ini atau pesan yang di-reply
  let q = m.quoted ? m.quoted : m
  let type = q.mtype
  
  if (!allowedTypes.includes(type)) return null

  // Fungsi standar Bochiteam untuk mendownload media
  let buffer = await q.download?.()
  if (!buffer) throw new Error('Buffer media kosong')

  return {
    type: type,
    buffer: buffer,
    info: {
      mimetype: q.mimetype || '',
      ptt: q.ptt || false
    }
  }
}

export const getQuotedText = (m) => {
  if (!m.quoted) return null
  return m.quoted.text || m.quoted.caption || m.quoted.description || null
}
