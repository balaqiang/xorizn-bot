/**
 * Hirara AI / vanXone — WhatsApp Bot
 * 
 * Module       : Canvas Total Chat Leaderboard (3D Neo-Brutalism)
 * Engine       : kyzz-canvas + Open-Source SVG Icons (Lucide / Feather)
 * Creator      : Mommy Kyu
 * Copyright © 2026 Hirara AI
 */

import fs from 'node:fs';
import { join } from 'node:path';
import axios from 'axios';
import sharp from 'sharp';

try {
  sharp.cache(false);
  sharp.concurrency(1);
  sharp.simd(true);
} catch (_) {}
import { Canvas, fonts } from 'kyzz-canvas';

const DEFAULT_AVATAR_PATH = join(process.cwd(), 'engine/lumen/src/avatar_contact.png');
let defaultAvatarBuffer = null;
if (fs.existsSync(DEFAULT_AVATAR_PATH)) {
  try {
    defaultAvatarBuffer = fs.readFileSync(DEFAULT_AVATAR_PATH);
  } catch (_) {}
}

// Lucide & Open-Source SVG Icon Set (MIT / ISC License)
export const SVG_ICONS = {
  flame: (w = 24, h = 24, stroke = '#000000', fill = '#f97316') =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,

  trophy: (w = 24, h = 24, stroke = '#000000', fill = '#fbbf24') =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.45 1-1 1H7v2h10v-2h-2c-.55 0-1-.45-1-1v-2.34c3.3-1.07 5.5-4.18 5.5-7.66V4H5.5v3c0 3.48 2.2 6.59 5.5 7.66z"/></svg>`,

  crown: (w = 24, h = 24, stroke = '#000000', fill = '#fbbf24') =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.735H5.81a1 1 0 0 1-.957-.735L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/></svg>`,

  medal: (w = 24, h = 24, stroke = '#000000', fill = '#94a3b8') =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`,

  chat: (w = 24, h = 24, stroke = '#000000', fill = 'none') =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,

  users: (w = 24, h = 24, stroke = '#000000', fill = 'none') =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,

  zap: (w = 24, h = 24, stroke = '#000000', fill = '#fde047') =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,

  sparkles: (w = 24, h = 24, stroke = '#000000', fill = '#f43f5e') =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`,

  badgeCheck: (w = 24, h = 24, stroke = '#000000', fill = '#22c55e') =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>`
};

export const AVATAR_COLORS = [
  '#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6', '#06b6d4',
  '#10b981', '#f59e0b', '#6366f1', '#14b8a6', '#84cc16'
];

let fontsReady = false;
export async function initFonts() {
  if (fontsReady) return;
  try {
    await fonts.google('Poppins', { weight: [400, 600, 700] });
  } catch (_) {
    // kyzz-canvas includes DejaVu Sans out of the box
  }
  fontsReady = true;
}

export function drawNeoBox(canvas, x, y, w, h, { radius = 12, fill = '#ffffff', stroke = '#000000', strokeWidth = 3, depth = 4 } = {}) {
  if (depth > 0) {
    canvas.box(x + depth, y + depth, w, h, { radius, fill: '#000000' });
  }
  canvas.box(x, y, w, h, { radius, fill, stroke, strokeWidth });
}

export function getInitialAvatarSvg(nameOrNumber, color, w = 100, h = 100) {
  const initial = String(nameOrNumber || 'U').trim()[0]?.toUpperCase() || 'U';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <rect width="${w}" height="${h}" rx="${Math.round(w / 3)}" fill="${color}"/>
    <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="Poppins, DejaVu Sans, sans-serif" font-weight="bold" font-size="${w * 0.46}" fill="#ffffff">${initial}</text>
  </svg>`;
}

const avatarCache = new Map();

/**
 * Safely fetches and converts remote/local avatar to a standardized PNG buffer
 * Resolves format issues with WhatsApp JPEG avatars by pre-converting to clean PNG via sharp
 */
export async function loadAndProcessAvatar(url, size = 100) {
  let rawBuf = null;

  if (Buffer.isBuffer(url)) {
    rawBuf = url;
  } else if (typeof url === 'string') {
    const trimmed = url.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      if (avatarCache.has(trimmed)) {
        return avatarCache.get(trimmed);
      }
      try {
        const res = await axios.get(trimmed, {
          responseType: 'arraybuffer',
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
          }
        });
        if (res.data) {
          rawBuf = Buffer.from(res.data);
        }
      } catch (_) {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 6000);
          const resp = await fetch(trimmed, {
            signal: controller.signal,
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
          });
          clearTimeout(timeout);
          if (resp.ok) {
            const ab = await resp.arrayBuffer();
            rawBuf = Buffer.from(ab);
          }
        } catch (_) {}
      }
    } else if (fs.existsSync(trimmed)) {
      try {
        rawBuf = fs.readFileSync(trimmed);
      } catch (_) {}
    }
  }

  // Fallback to default contact avatar file if no URL or fetch failed
  if (!rawBuf && defaultAvatarBuffer) {
    rawBuf = defaultAvatarBuffer;
  }

  if (rawBuf) {
    try {
      // Convert to clean PNG via sharp so resvg can decode dataURL without mimeType mismatch
      const pngBuf = await sharp(rawBuf)
        .resize(size, size, { fit: 'cover' })
        .png()
        .toBuffer();

      if (typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'))) {
        avatarCache.set(url.trim(), pngBuf);
        if (avatarCache.size > 40) {
          const firstKey = avatarCache.keys().next().value;
          avatarCache.delete(firstKey);
        }
      }
      return pngBuf;
    } catch (_) {}
  }

  return null;
}

/**
 * Generate 3D Neo-Brutalism Total Chat Leaderboard Card
 * @param {Object} options
 * @param {string} [options.groupName='Grup WhatsApp']
 * @param {string|Buffer|null} [options.groupPpUrl=null]
 * @param {number} [options.totalChats=0]
 * @param {Array} [options.topUsers=[]]
 * @param {'jpeg'|'png'|'webp'} [options.format='jpeg']
 * @returns {Promise<Buffer>}
 */
export async function createTotalChatCard({
  groupName = 'Grup WhatsApp',
  groupPpUrl = null,
  totalChats = 0,
  topUsers = [],
  format = 'jpeg'
}) {
  await initFonts();

  const countToShow = Math.max(1, Math.min(topUsers.length, 10));
  const cardItemHeight = 74;
  const headerHeight = 155;
  const listGap = 12;
  const padding = 36;
  const listStartY = padding + headerHeight + 58;
  const totalListHeight = topUsers.length === 0 ? 110 : countToShow * (cardItemHeight + listGap);

  const W = 960;
  const H = Math.max(680, listStartY + totalListHeight + 60);

  const canvas = new Canvas(W, H);
  canvas.bg('#fef08a');

  // Background Dot Grid Pattern (pure vector SVG)
  const dotPattern = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <pattern id="neo-dot-grid" width="28" height="28" patternUnits="userSpaceOnUse">
        <circle cx="14" cy="14" r="2.2" fill="#000000" opacity="0.08"/>
      </pattern>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#neo-dot-grid)"/>
  </svg>`;
  canvas.svg(dotPattern, { x: 0, y: 0, width: W, height: H });

  // Outer Neo-Brutalism Solid Frame
  canvas.rect(0, 0, W, H, { stroke: '#000000', strokeWidth: 8, fill: 'none' });

  // 1. Header 3D Container Box
  const headerBoxY = padding;
  const headerBoxH = headerHeight;
  const headerBoxW = W - padding * 2;
  drawNeoBox(canvas, padding, headerBoxY, headerBoxW, headerBoxH, {
    radius: 18,
    fill: '#38bdf8',
    strokeWidth: 3.5,
    depth: 6
  });

  // Group Avatar Frame
  const gPpSize = 108;
  const gPpX = padding + 24;
  const gPpY = headerBoxY + 23;
  drawNeoBox(canvas, gPpX, gPpY, gPpSize, gPpSize, {
    radius: 16,
    fill: '#ffffff',
    strokeWidth: 3,
    depth: 4
  });

  const groupImgBuf = await loadAndProcessAvatar(groupPpUrl, gPpSize);
  if (groupImgBuf) {
    canvas.image(groupImgBuf, {
      x: gPpX,
      y: gPpY,
      width: gPpSize,
      height: gPpSize,
      radius: 16,
      fit: 'cover'
    });
  } else {
    canvas.svg(getInitialAvatarSvg(groupName, '#6366f1', gPpSize, gPpSize), {
      x: gPpX,
      y: gPpY,
      width: gPpSize,
      height: gPpSize
    });
  }

  // Header Analytics Tag Pill
  const textStartX = gPpX + gPpSize + 22;
  const tagW = 205, tagH = 32;
  drawNeoBox(canvas, textStartX, headerBoxY + 20, tagW, tagH, {
    radius: 8,
    fill: '#ffea00',
    strokeWidth: 2.5,
    depth: 3
  });
  canvas.svg(SVG_ICONS.flame(22, 22, '#000000', '#f97316'), {
    x: textStartX + 8,
    y: headerBoxY + 25,
    width: 22,
    height: 22
  });
  canvas.text('GROUP ANALYTICS', {
    x: textStartX + 36,
    y: headerBoxY + 41,
    font: 'Poppins',
    size: 13,
    weight: 'bold',
    color: '#000000'
  });

  // Group Title
  let cleanGName = String(groupName || 'Grup WhatsApp').trim();
  if (cleanGName.length > 25) cleanGName = cleanGName.slice(0, 24) + '…';
  canvas.text(cleanGName, {
    x: textStartX,
    y: headerBoxY + 84,
    font: 'Poppins',
    size: 26,
    weight: 'bold',
    color: '#000000'
  });

  // Subtitle with Users Open-Source SVG
  canvas.svg(SVG_ICONS.users(18, 18, '#1e293b', 'none'), {
    x: textStartX,
    y: headerBoxY + 104,
    width: 18,
    height: 18
  });
  canvas.text('Leaderboard Aktivitas Obrolan • WhatsApp Group', {
    x: textStartX + 24,
    y: headerBoxY + 118,
    font: 'Poppins',
    size: 14,
    weight: 600,
    color: '#1e293b'
  });

  // Total Chat Metric Box (Right side)
  const metricW = 215, metricH = 105;
  const metricX = W - padding - 24 - metricW;
  const metricY = headerBoxY + 25;
  drawNeoBox(canvas, metricX, metricY, metricW, metricH, {
    radius: 16,
    fill: '#a3e635',
    strokeWidth: 3,
    depth: 4
  });

  canvas.svg(SVG_ICONS.chat(20, 20, '#000000', 'none'), {
    x: metricX + 16,
    y: metricY + 16,
    width: 20,
    height: 20
  });
  canvas.text('TOTAL CHAT', {
    x: metricX + 42,
    y: metricY + 31,
    font: 'Poppins',
    size: 13,
    weight: 'bold',
    color: '#000000'
  });
  canvas.text(`${Number(totalChats).toLocaleString('id-ID')}`, {
    x: metricX + metricW / 2,
    y: metricY + 68,
    font: 'Poppins',
    size: 32,
    weight: 'bold',
    color: '#000000',
    align: 'center'
  });
  canvas.text('pesan terkirim', {
    x: metricX + metricW / 2,
    y: metricY + 90,
    font: 'Poppins',
    size: 12,
    weight: 600,
    color: '#1e293b',
    align: 'center'
  });

  // 2. Leaderboard Title Bar with Trophy SVG
  canvas.svg(SVG_ICONS.trophy(26, 26, '#000000', '#fbbf24'), {
    x: padding + 4,
    y: listStartY - 36,
    width: 26,
    height: 26
  });
  canvas.text('TOP 10 MEMBER PALING AKTIF', {
    x: padding + 36,
    y: listStartY - 16,
    font: 'Poppins',
    size: 21,
    weight: 'bold',
    color: '#000000'
  });

  // Real-time Live Status Pill with Zap SVG
  const liveW = 195, liveH = 32;
  drawNeoBox(canvas, W - padding - liveW, listStartY - 38, liveW, liveH, {
    radius: 8,
    fill: '#f43f5e',
    strokeWidth: 2.5,
    depth: 3
  });
  canvas.svg(SVG_ICONS.zap(20, 20, '#000000', '#fde047'), {
    x: W - padding - liveW + 8,
    y: listStartY - 33,
    width: 20,
    height: 20
  });
  canvas.text('REAL-TIME CHAT.DB', {
    x: W - padding - liveW + 34,
    y: listStartY - 17,
    font: 'Poppins',
    size: 13,
    weight: 'bold',
    color: '#ffffff'
  });

  // 3. User Rows or Empty State
  if (topUsers.length === 0) {
    drawNeoBox(canvas, padding, listStartY, W - padding * 2, 110, {
      radius: 14,
      fill: '#ffffff',
      strokeWidth: 3,
      depth: 5
    });
    canvas.svg(SVG_ICONS.chat(32, 32, '#94a3b8', 'none'), {
      x: W / 2 - 16,
      y: listStartY + 24,
      width: 32,
      height: 32
    });
    canvas.text('Belum ada pesan yang tercatat di database grup ini.', {
      x: W / 2,
      y: listStartY + 78,
      font: 'Poppins',
      size: 18,
      weight: 'bold',
      color: '#64748b',
      align: 'center'
    });
  } else {
    // Pre-fetch and process all user avatars concurrently with sharp PNG conversion
    const userAvatars = await Promise.all(
      topUsers.slice(0, countToShow).map((u) => loadAndProcessAvatar(u.ppUrl || u.avatarBuffer, 52))
    );

    for (let i = 0; i < countToShow; i++) {
      const u = topUsers[i];
      const rank = i + 1;
      const curY = listStartY + i * (cardItemHeight + listGap);
      const cardW = W - padding * 2;

      let cardBg = '#ffffff';
      let rankPillColor = '#e2e8f0';
      let countBg = '#f1f5f9';

      if (rank === 1) {
        cardBg = '#fffbeb';
        rankPillColor = '#fbbf24';
        countBg = '#a3e635';
      } else if (rank === 2) {
        cardBg = '#f8fafc';
        rankPillColor = '#94a3b8';
        countBg = '#67e8f9';
      } else if (rank === 3) {
        cardBg = '#fff7ed';
        rankPillColor = '#fdba74';
        countBg = '#fdba74';
      }

      drawNeoBox(canvas, padding, curY, cardW, cardItemHeight, {
        radius: 14,
        fill: cardBg,
        strokeWidth: 3,
        depth: 4
      });

      // Rank Badge Pill
      const rBadgeW = 56, rBadgeH = 52;
      const rBadgeX = padding + 12, rBadgeY = curY + 11;
      drawNeoBox(canvas, rBadgeX, rBadgeY, rBadgeW, rBadgeH, {
        radius: 10,
        fill: rankPillColor,
        strokeWidth: 2.5,
        depth: 2
      });

      if (rank === 1) {
        canvas.svg(SVG_ICONS.crown(20, 20, '#000000', '#fbbf24'), {
          x: rBadgeX + 6,
          y: rBadgeY + 5,
          width: 20,
          height: 20
        });
        canvas.text('#1', {
          x: rBadgeX + rBadgeW / 2 + 8,
          y: rBadgeY + 22,
          font: 'Poppins',
          size: 16,
          weight: 'bold',
          color: '#000000',
          align: 'center'
        });
        canvas.text('TOP', {
          x: rBadgeX + rBadgeW / 2,
          y: rBadgeY + 42,
          font: 'Poppins',
          size: 11,
          weight: 'bold',
          color: '#b45309',
          align: 'center'
        });
      } else if (rank === 2 || rank === 3) {
        canvas.svg(SVG_ICONS.medal(20, 20, '#000000', rank === 2 ? '#cbd5e1' : '#fed7aa'), {
          x: rBadgeX + 6,
          y: rBadgeY + 5,
          width: 20,
          height: 20
        });
        canvas.text(`#${rank}`, {
          x: rBadgeX + rBadgeW / 2 + 8,
          y: rBadgeY + 22,
          font: 'Poppins',
          size: 16,
          weight: 'bold',
          color: '#000000',
          align: 'center'
        });
        canvas.text(rank === 2 ? '2ND' : '3RD', {
          x: rBadgeX + rBadgeW / 2,
          y: rBadgeY + 42,
          font: 'Poppins',
          size: 11,
          weight: 'bold',
          color: '#475569',
          align: 'center'
        });
      } else {
        canvas.text(`#${rank}`, {
          x: rBadgeX + rBadgeW / 2,
          y: rBadgeY + 34,
          font: 'Poppins',
          size: 20,
          weight: 'bold',
          color: '#334155',
          align: 'center'
        });
      }

      // User Avatar
      const uPpSize = 52;
      const uPpX = rBadgeX + rBadgeW + 14;
      const uPpY = curY + 11;
      drawNeoBox(canvas, uPpX, uPpY, uPpSize, uPpSize, {
        radius: 12,
        fill: '#ffffff',
        strokeWidth: 2.5,
        depth: 2
      });

      const userImgBuf = userAvatars[i];
      const displayName = u.push_name || u.name || (u.sender_number ? `User ${String(u.sender_number).slice(-4)}` : 'User');
      const senderNum = u.sender_number || u.number?.replace(/\D/g, '') || '';

      if (userImgBuf) {
        canvas.image(userImgBuf, {
          x: uPpX,
          y: uPpY,
          width: uPpSize,
          height: uPpSize,
          radius: 12,
          fit: 'cover'
        });
      } else {
        canvas.svg(getInitialAvatarSvg(displayName || senderNum, AVATAR_COLORS[i % AVATAR_COLORS.length], uPpSize, uPpSize), {
          x: uPpX,
          y: uPpY,
          width: uPpSize,
          height: uPpSize
        });
      }

      // User Display Name & Phone Number
      const nameX = uPpX + uPpSize + 16;
      let cleanUName = String(displayName).trim();
      if (cleanUName.length > 22) cleanUName = cleanUName.slice(0, 21) + '…';

      canvas.text(cleanUName, {
        x: nameX,
        y: curY + 32,
        font: 'Poppins',
        size: 19,
        weight: 'bold',
        color: '#000000'
      });
      canvas.text(senderNum ? `+${senderNum}` : '-', {
        x: nameX,
        y: curY + 54,
        font: 'Poppins',
        size: 14,
        weight: 600,
        color: '#64748b'
      });

      // Total Messages Pill with Chat SVG
      const countPillW = 185;
      const countPillH = 48;
      const countPillX = W - padding - 16 - countPillW;
      const countPillY = curY + 13;
      drawNeoBox(canvas, countPillX, countPillY, countPillW, countPillH, {
        radius: 10,
        fill: countBg,
        strokeWidth: 2.5,
        depth: 2
      });

      canvas.svg(SVG_ICONS.chat(20, 20, '#000000', 'none'), {
        x: countPillX + 12,
        y: countPillY + 14,
        width: 20,
        height: 20
      });
      const chatCount = Number(u.count ?? u.total ?? 0);
      canvas.text(`${chatCount.toLocaleString('id-ID')} pesan`, {
        x: countPillX + countPillW / 2 + 10,
        y: countPillY + 31,
        font: 'Poppins',
        size: 16,
        weight: 'bold',
        color: '#000000',
        align: 'center'
      });
    }
  }

  // 4. Footer Signature with Sparkles SVG
  canvas.svg(SVG_ICONS.sparkles(16, 16, '#000000', '#f43f5e'), {
    x: W / 2 - 225,
    y: H - 32,
    width: 16,
    height: 16
  });
  canvas.text('vanXone • Powered by kyzz-canvas • Open-Source SVG Engine • chat.json', {
    x: W / 2,
    y: H - 20,
    font: 'Poppins',
    size: 13,
    weight: 'bold',
    color: '#334155',
    align: 'center'
  });

  return await canvas.render(format);
}

export default createTotalChatCard;
