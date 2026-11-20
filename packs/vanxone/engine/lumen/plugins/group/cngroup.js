/**
 * ╔══════════════════════════════════════════╗
 * ║             vanXone — CUSTOM CN           ║
 * ║       Name Generator + Native Copy        ║
 * ╚══════════════════════════════════════════╝
 *
 * Type    : ESM Plugin
 * Creator : Hamm
 */

import fs from 'fs'
import path from 'path'

const DB_PATH = './database/cn.json'
const TEMPLATE_NAME = 'template'

function loadCN() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })
      fs.writeFileSync(DB_PATH, '{}')
    }

    const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))
    return data && typeof data === 'object' && !Array.isArray(data)
      ? data
      : {}
  } catch {
    return {}
  }
}

function saveCN(data) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const args = (text || '').trim()
  const db = loadCN()

  // HELP
  if (!args || /^help$/i.test(args)) {
    return m.reply(
      `📋 *CUSTOM CN GENERATOR*\n\n` +
      `📝 Simpan template:\n` +
      `${usedPrefix + command} create template|𝐭𝐞𝐬𝐭𝐞𝐞𝐫\n\n` +
      `✨ Generate CN:\n` +
      `${usedPrefix + command} Udin\n\n` +
      `📄 Lihat template:\n` +
      `${usedPrefix + command} template\n\n` +
      `🗑️ Hapus template:\n` +
      `${usedPrefix + command} delete template`
    )
  }

  // CREATE / UPDATE TEMPLATE
  if (/^create\s+/i.test(args)) {
    const content = args.replace(/^create\s+/i, '')
    const separator = content.indexOf('|')

    if (separator < 1 || !content.slice(separator + 1).trim()) {
      return m.reply(
        `❌ *FORMAT SALAH*\n\n` +
        `Contoh:\n` +
        `${usedPrefix + command} create template|𝐭𝐞𝐬𝐭𝐞𝐞𝐫`
      )
    }

    const name = content.slice(0, separator).trim().toLowerCase()
    const value = content.slice(separator + 1).trim()

    if (name !== TEMPLATE_NAME) {
      return m.reply(
        `❌ Nama penyimpanan harus *template*.\n\n` +
        `Contoh:\n${usedPrefix + command} create template|𝐭𝐞𝐬𝐭𝐞𝐞𝐫`
      )
    }

    if (value.length > 10000) {
      return m.reply('❌ Template maksimal 10.000 karakter.')
    }

    db[TEMPLATE_NAME] = value
    saveCN(db)

    return m.reply(
      `✅ *TEMPLATE CN BERHASIL DISIMPAN*\n\n` +
      `📋 Template:\n${value}\n\n` +
      `Sekarang kamu bisa menggunakan:\n` +
      `${usedPrefix + command} Udin\n\n` +
      `Hasil: udin${value}`
    )
  }

  // DELETE TEMPLATE
  if (/^(delete|del)\s+/i.test(args)) {
    const name = args.replace(/^(delete|del)\s+/i, '').trim()

    if (name.toLowerCase() !== TEMPLATE_NAME) {
      return m.reply('❌ Yang bisa dihapus hanya template.')
    }

    if (!db[TEMPLATE_NAME]) {
      return m.reply('❌ Template belum tersimpan.')
    }

    delete db[TEMPLATE_NAME]
    saveCN(db)

    return m.reply('✅ Template CN berhasil dihapus.')
  }

  // SHOW SAVED TEMPLATE
  if (/^template$/i.test(args)) {
    if (!db[TEMPLATE_NAME]) {
      return m.reply(
        `❌ Template belum dibuat.\n\n` +
        `Gunakan:\n${usedPrefix + command} create template|𝐭𝐞𝐬𝐭𝐞𝐞𝐫`
      )
    }

    return conn.sendMessage(m.chat, {
      text:
        `📋 *TEMPLATE CN*\n\n` +
        `${db[TEMPLATE_NAME]}`,
      footer: global.wm || 'vanXone',
      nativeFlow: [{
        text: '📋 Salin Template',
        copy: db[TEMPLATE_NAME]
      }]
    }, { quoted: m })
  }

  // GENERATE CN FROM NAME
  const name = args.toLowerCase().replace(/\s+/g, '')

  if (!name) {
    return m.reply('❌ Masukkan nama yang ingin dibuat CN.')
  }

  if (!/^[\p{L}\p{N}_-]+$/u.test(name)) {
    return m.reply(
      '❌ Nama hanya boleh berisi huruf, angka, underscore, atau tanda hubung.'
    )
  }

  if (name.length > 50) {
    return m.reply('❌ Nama maksimal 50 karakter.')
  }

  if (!db[TEMPLATE_NAME]) {
    return m.reply(
      `❌ Template CN belum tersimpan.\n\n` +
      `Simpan dahulu:\n` +
      `${usedPrefix + command} create template|𝐭𝐞𝐬𝐭𝐞𝐞𝐫`
    )
  }

  const result = `${name}${db[TEMPLATE_NAME]}`

  return conn.sendMessage(m.chat, {
    text:
      `✨ *CN BERHASIL DIBUAT*\n\n` +
      `👤 Nama: ${name}\n` +
      `📋 Hasil CN:\n${result}\n\n` +
      `Tekan tombol di bawah untuk menyalin.`,
    footer: global.wm || 'vanXone',
    nativeFlow: [{
      text: `📋 Salin ${name}`,
      copy: result
    }]
  }, { quoted: m })
}

handler.help = [
  'cn',
  'cn create template',
  'cn template',
  'cn delete template'
]

handler.tags = ['tools']
handler.command = /^cn$/i

export default handler