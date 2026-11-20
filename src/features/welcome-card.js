/**
 * Kartu gambar welcome / goodbye memakai paket `discord-canvas` (Welcome & Goodbye).
 * Bila discord-canvas / node-canvas tidak bisa dimuat (mis. di Termux tanpa build tools),
 * otomatis memakai renderer cadangan berbasis @napi-rs/canvas dengan tata letak serupa.
 */
import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'
import logger from '../logger.js'
import bot from '../core/bot.js'

const require = createRequire(import.meta.url)
const log = logger.child('welcome')

let discordCanvas = null
let nodeCanvas = null
let loadError = null
try {
  discordCanvas = require('discord-canvas')
  nodeCanvas = require('canvas')
} catch (err) {
  loadError = err
  log.warn('discord-canvas tidak bisa dimuat, memakai renderer cadangan:', err.message)
}

export const engine = () => (discordCanvas ? 'discord-canvas' : 'fallback')

/**
 * node-canvas 3 di Windows tidak bisa memakai font hasil registerFont() (selalu jatuh ke "Sans"
 * sambil mencetak peringatan ke stderr). Di Windows, nama font discord-canvas dipetakan ke font
 * sistem yang pasti ada. Di Linux/Termux font asli discord-canvas tetap dipakai.
 */
const WIN_FONT_MAP = { Bold: 'bold "Segoe UI"', SketchMatch: '"Segoe UI"' }

function withFontFix(fn) {
  if (process.platform !== 'win32' || !nodeCanvas) return fn()
  const original = nodeCanvas.createCanvas
  nodeCanvas.createCanvas = (...args) => {
    const canvas = original(...args)
    const getContext = canvas.getContext.bind(canvas)
    canvas.getContext = (type, ...rest) => {
      const ctx = getContext(type, ...rest)
      if (type === '2d' && !ctx.__fontFix) {
        const desc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(ctx), 'font')
        Object.defineProperty(ctx, 'font', {
          configurable: true,
          get: () => desc.get.call(ctx),
          set: (value) => {
            const m = /^(.*?\d+(?:\.\d+)?px)\s+(\w+)$/.exec(String(value))
            const mapped = m && WIN_FONT_MAP[m[2]]
            desc.set.call(ctx, mapped ? (mapped.startsWith('bold') ? `bold ${m[1]} ${mapped.slice(5)}` : `${m[1]} ${mapped}`) : value)
          }
        })
        ctx.__fontFix = true
      }
      return ctx
    }
    return canvas
  }
  return Promise.resolve(fn()).finally(() => {
    nodeCanvas.createCanvas = original
  })
}

/** Bersihkan nama agar bisa digambar font kartu (huruf "fancy" → huruf biasa, emoji dibuang). */
export function cleanName(name, fallback = 'Member') {
  const out = String(name || '')
    .normalize('NFKC')
    .replace(/[^\p{L}\p{N}\p{P}\p{Zs}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
  return (out || fallback).slice(0, 32)
}

async function fetchBuffer(url) {
  if (!url) return null
  if (Buffer.isBuffer(url)) return url
  if (!/^https?:\/\//i.test(url)) {
    const file = path.resolve(bot.config?.paths?.root || '.', url)
    return fs.existsSync(file) ? fs.readFileSync(file) : null
  }
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10_000) })
    if (!res.ok) return null
    return Buffer.from(await res.arrayBuffer())
  } catch {
    return null
  }
}

/** Latar default: gradien gelap dengan aksen warna. */
async function defaultBackground(accent) {
  const { createCanvas } = nodeCanvas || (await import('@napi-rs/canvas'))
  const c = createCanvas(1024, 450)
  const ctx = c.getContext('2d')
  const g = ctx.createLinearGradient(0, 0, 1024, 450)
  g.addColorStop(0, '#0f172a')
  g.addColorStop(0.55, '#1e1b4b')
  g.addColorStop(1, '#111827')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 1024, 450)
  ctx.globalAlpha = 0.18
  ctx.fillStyle = accent
  for (const [x, y, r] of [[900, 60, 160], [780, 420, 120], [120, 40, 90]]) {
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
  return c.toBuffer('image/png')
}

/** Avatar inisial nama (dipakai bila foto profil disembunyikan). */
async function initialsAvatar(name, color) {
  const { createCanvas } = nodeCanvas || (await import('@napi-rs/canvas'))
  const c = createCanvas(270, 270)
  const ctx = c.getContext('2d')
  const g = ctx.createLinearGradient(0, 0, 270, 270)
  g.addColorStop(0, color)
  g.addColorStop(1, '#1e293b')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 270, 270)
  const initials = cleanName(name, '?').split(' ').filter(Boolean).slice(0, 2).map((w) => [...w][0]).join('').toUpperCase() || '?'
  ctx.fillStyle = '#ffffff'
  ctx.font = process.platform === 'win32' ? 'bold 110px "Segoe UI"' : 'bold 110px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(initials, 135, 142)
  return c.toBuffer('image/png')
}

/**
 * @param {'welcome'|'goodbye'} kind
 * @param {{ username, number, groupName, memberCount, avatar, background, color }} data
 * @returns {Promise<Buffer>} PNG
 */
export async function renderCard(kind, data) {
  const color = data.color || (kind === 'welcome' ? '#2dd4bf' : '#f43f5e')
  const username = cleanName(data.username)
  const groupName = cleanName(data.groupName, 'Grup')
  const discriminator = String(data.number || '0000').replace(/\D/g, '').slice(-4).padStart(4, '0')
  const avatar = (await fetchBuffer(data.avatar)) || (await initialsAvatar(username, color))
  const background = (await fetchBuffer(data.background)) || (await defaultBackground(color))

  if (discordCanvas) return withFontFix(async () => {
    const Card = kind === 'welcome' ? discordCanvas.Welcome : discordCanvas.Goodbye
    const card = new Card()
      .setUsername(username)
      .setDiscriminator(discriminator)
      .setMemberCount(String(data.memberCount ?? 0))
      .setGuildName(groupName)
      .setBackground(background)
      .setColor('title', color)
      .setColor('avatar', color)
      .setColor('border', '#000000')
      .setColor('username-box', '#000000')
      .setColor('discriminator-box', '#000000')
      .setColor('message-box', '#000000')
      .setOpacity('border', 0.35)
      .setOpacity('username-box', 0.55)
      .setOpacity('discriminator-box', 0.55)
      .setText('title', kind === 'welcome' ? 'WELCOME' : 'GOODBYE')
      .setText('message', kind === 'welcome' ? 'Welcome to {server}' : 'Leaving {server}')
      .setText('member-count', kind === 'welcome' ? '- anggota ke-{count} -' : '- tersisa {count} anggota -')
    if (avatar) card.setAvatar(avatar)
    const canvas = await card.toAttachment()
    return canvas.toBuffer('image/png')
  })
  return renderFallback(kind, { ...data, username, groupName, discriminator, avatar, background, color })
}

async function renderFallback(kind, d) {
  const { createCanvas, loadImage } = await import('@napi-rs/canvas')
  const c = createCanvas(1024, 450)
  const ctx = c.getContext('2d')
  ctx.drawImage(await loadImage(d.background), 0, 0, 1024, 450)
  ctx.fillStyle = 'rgba(0,0,0,0.35)'
  ctx.fillRect(0, 0, 1024, 450)
  ctx.fillStyle = d.color
  ctx.font = 'bold 86px sans-serif'
  ctx.fillText(kind === 'welcome' ? 'WELCOME' : 'GOODBYE', 380, 130)
  ctx.fillStyle = 'rgba(0,0,0,0.55)'
  ctx.fillRect(344, 160, 625, 65)
  ctx.fillRect(308, 340, 672, 65)
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 44px sans-serif'
  ctx.fillText(`${d.username} #${d.discriminator}`, 364, 208)
  ctx.font = 'bold 40px sans-serif'
  ctx.fillText((kind === 'welcome' ? 'Welcome to ' : 'Leaving ') + d.groupName, 328, 386)
  ctx.font = 'bold 22px sans-serif'
  ctx.fillText(kind === 'welcome' ? `- anggota ke-${d.memberCount} -` : `- tersisa ${d.memberCount} anggota -`, 40, 415)
  ctx.save()
  ctx.beginPath()
  ctx.arc(180, 225, 135, 0, Math.PI * 2)
  ctx.lineWidth = 10
  ctx.strokeStyle = d.color
  ctx.stroke()
  ctx.clip()
  if (d.avatar) ctx.drawImage(await loadImage(d.avatar), 45, 90, 270, 270)
  ctx.restore()
  return c.toBuffer('image/png')
}

export { loadError }
