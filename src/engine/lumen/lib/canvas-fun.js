/**
 * Hirara AI / xorizn-bot — WhatsApp Bot
 * 
 * Module       : Canvas Fun Check Card (3D Neo-Brutalism)
 * Engine       : kyzz-canvas + Open-Source SVG Engine
 * Creator      : Mommy Kyu
 * Copyright © 2026 Hirara AI
 */

import sharp from 'sharp';
import { Canvas, fonts } from 'kyzz-canvas';
import {
  initFonts,
  drawNeoBox,
  getInitialAvatarSvg,
  loadAndProcessAvatar,
  createTotalChatCard
} from './canvas-totalchat.js';

export { createTotalChatCard };

function wrapTextSimple(text, maxChars = 46) {
  if (!text) return [];
  const words = String(text).split(' ');
  const lines = [];
  let current = '';
  for (const w of words) {
    if ((current + ' ' + w).trim().length <= maxChars) {
      current = (current + ' ' + w).trim();
    } else {
      if (current) lines.push(current);
      current = w;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Fetch avatar buffer safely with fallback (for legacy plugins)
 */
export async function getAvatarBuffer(conn, jid) {
  if (!conn || !jid) return null;
  try {
    const url = await conn.profilePictureUrl(jid, 'image').catch(() => null);
    if (!url) return null;
    return await loadAndProcessAvatar(url, 120);
  } catch {
    return null;
  }
}

/**
 * Generate 3D Neo-Brutalism Fun Card (Exact hirara-ai 16:9 ratio style)
 * @param {Object} options
 * @returns {Promise<Buffer>}
 */
export async function generateFunCard({
  title = 'FUN CARD',
  badgeText = '100% SCORE',
  titleBg = '#ff4794',
  badgeBg = '#ffd000',
  name = 'User',
  rate = 100,
  categoryLabel = 'Kategori',
  categoryValue = 'Super Fun',
  descLabel = 'Deskripsi',
  descValue = 'Efek luar biasa!',
  footerText = 'Gunakan command fun lainnya!',
  barColor = '#ff4794',
  showMeter = true,
  ppUrl = null
}) {
  await initFonts();

  const W = 900, H = 540;
  const canvas = new Canvas(W, H);
  canvas.bg('#fffae5');

  // Background Dot Grid Pattern
  const dotPattern = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <pattern id="neo-dot-grid" width="26" height="26" patternUnits="userSpaceOnUse">
        <circle cx="13" cy="13" r="1.8" fill="#000000" opacity="0.06"/>
      </pattern>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#neo-dot-grid)"/>
  </svg>`;
  canvas.svg(dotPattern, { x: 0, y: 0, width: W, height: H });

  const p = 16;
  drawNeoBox(canvas, p, p, W - p * 2, H - p * 2, { radius: 24, fill: '#ffffff', stroke: '#000000', strokeWidth: 4, depth: 8 });

  // Header Left (Title Box)
  const headerY = p + 18;
  const tBg = titleBg || '#ff4794';
  drawNeoBox(canvas, p + 18, headerY, 500, 50, { radius: 16, fill: tBg, stroke: '#000000', strokeWidth: 3.5, depth: 5 });

  const rawTitle = title.startsWith('🌐') || title.startsWith('⚡') || title.startsWith('🌸') || title.startsWith('✨') || title.startsWith('🌈') || title.startsWith('🕺') || title.startsWith('💃') || title.startsWith('💍') || title.startsWith('🧠') || title.startsWith('😈') ? title : `✨ ${title.toUpperCase()}`;
  let safeTitle = rawTitle;
  if (safeTitle.length > 32) safeTitle = safeTitle.slice(0, 30) + '..';

  canvas.text(safeTitle, {
    x: p + 36,
    y: headerY + 28,
    font: 'Poppins',
    size: 21,
    weight: 'bold',
    color: '#ffffff',
    align: 'left'
  });

  // Header Right (Badge Box)
  const bBg = badgeBg || '#ffd000';
  const badgeW = Math.max(160, Math.min(270, String(badgeText).length * 12 + 40));
  const badgeX = W - p - 18 - badgeW;
  drawNeoBox(canvas, badgeX, headerY, badgeW, 50, { radius: 16, fill: bBg, stroke: '#000000', strokeWidth: 3.5, depth: 5 });

  canvas.text(String(badgeText), {
    x: badgeX + badgeW / 2,
    y: headerY + 28,
    font: 'Poppins',
    size: 16,
    weight: 'bold',
    color: '#000000',
    align: 'center'
  });

  // Body Layout
  const mainY = headerY + 68;
  const leftW = 260;
  const leftX = p + 18;
  const rightX = leftX + leftW + 18;
  const rightW = W - p * 2 - leftW - 54;
  const sectionH = H - p * 2 - 150;

  // Left Section (Profile)
  drawNeoBox(canvas, leftX, mainY, leftW, sectionH, { radius: 20, fill: '#f8f9fc', stroke: '#000000', strokeWidth: 3.5, depth: 6 });

  const avSize = 120;
  const avX = leftX + (leftW - avSize) / 2;
  const avY = mainY + 20;
  drawNeoBox(canvas, avX, avY, avSize, avSize, { radius: 22, fill: '#ffffff', stroke: '#000000', strokeWidth: 3, depth: 5 });

  const avatarImgBuf = await loadAndProcessAvatar(ppUrl, avSize);
  if (avatarImgBuf) {
    canvas.image(avatarImgBuf, {
      x: avX,
      y: avY,
      width: avSize,
      height: avSize,
      radius: 22,
      fit: 'cover'
    });
  } else {
    canvas.svg(getInitialAvatarSvg(name, '#ff6b6b', avSize, avSize), {
      x: avX,
      y: avY,
      width: avSize,
      height: avSize
    });
  }

  // Name Box
  drawNeoBox(canvas, leftX + 16, mainY + 158, leftW - 32, 42, { radius: 12, fill: '#ffffff', stroke: '#000000', strokeWidth: 2.5, depth: 4 });
  let safeName = String(name || 'User').trim();
  if (safeName.length > 18) safeName = safeName.slice(0, 16) + '..';
  canvas.text(`👤 ${safeName}`, {
    x: leftX + leftW / 2,
    y: mainY + 182,
    font: 'Poppins',
    size: 16,
    weight: 'bold',
    color: '#000000',
    align: 'center'
  });

  // Fun Check Result Tag
  drawNeoBox(canvas, leftX + 16, mainY + 212, leftW - 32, 44, { radius: 12, fill: '#00e5ff', stroke: '#000000', strokeWidth: 2.5, depth: 4 });
  canvas.text('✨ FUN CHECK RESULT', {
    x: leftX + leftW / 2,
    y: mainY + 236,
    font: 'Poppins',
    size: 13,
    weight: 'bold',
    color: '#000000',
    align: 'center'
  });

  // Right Section (Analysis & Score)
  drawNeoBox(canvas, rightX, mainY, rightW, sectionH, { radius: 20, fill: '#ffffff', stroke: '#000000', strokeWidth: 3.5, depth: 6 });

  // 1. Category Box
  const catBoxY = mainY + 18;
  const catBoxH = 60;
  drawNeoBox(canvas, rightX + 18, catBoxY, rightW - 36, catBoxH, { radius: 14, fill: '#fffae5', stroke: '#000000', strokeWidth: 2.5, depth: 4 });

  canvas.text(`🏷️ ${categoryLabel.toUpperCase()}:`, {
    x: rightX + 32,
    y: catBoxY + 20,
    font: 'Poppins',
    size: 11,
    weight: 'bold',
    color: '#854d0e',
    align: 'left'
  });

  let safeCat = String(categoryValue || '-').trim();
  if (safeCat.length > 36) safeCat = safeCat.slice(0, 34) + '..';
  canvas.text(safeCat, {
    x: rightX + 32,
    y: catBoxY + 44,
    font: 'Poppins',
    size: 18,
    weight: 'bold',
    color: '#000000',
    align: 'left'
  });

  // 2. Score Meter Box
  const barBoxY = catBoxY + catBoxH + 14;
  const barBoxH = 76;
  drawNeoBox(canvas, rightX + 18, barBoxY, rightW - 36, barBoxH, { radius: 14, fill: '#ffffff', stroke: '#000000', strokeWidth: 2.5, depth: 4 });

  const clampedRate = Math.min(100, Math.max(0, parseInt(rate) || 0));
  drawNeoBox(canvas, rightX + 32, barBoxY + 10, 140, 22, { radius: 6, fill: '#a3e635', stroke: '#000000', strokeWidth: 2, depth: 0 });
  canvas.text('📊 SCORE METER', {
    x: rightX + 32 + 70,
    y: barBoxY + 22,
    font: 'Poppins',
    size: 11,
    weight: 'bold',
    color: '#000000',
    align: 'center'
  });

  canvas.text(`${clampedRate}%`, {
    x: rightX + rightW - 36,
    y: barBoxY + 22,
    font: 'Poppins',
    size: 22,
    weight: 'bold',
    color: '#000000',
    align: 'right'
  });

  const trkX = rightX + 32;
  const trkY = barBoxY + 42;
  const trkW = rightW - 70;
  const trkH = 20;
  drawNeoBox(canvas, trkX, trkY, trkW, trkH, { radius: 10, fill: '#f1f5f9', stroke: '#000000', strokeWidth: 2, depth: 0 });

  const fillW = Math.max(trkH, (trkW * clampedRate) / 100);
  if (clampedRate > 0) {
    drawNeoBox(canvas, trkX, trkY, fillW, trkH, { radius: 10, fill: barColor || '#ff4794', stroke: '#000000', strokeWidth: 2, depth: 0 });
  }

  // 3. Description Box
  const descBoxY = barBoxY + barBoxH + 14;
  const descBoxH = 88;
  drawNeoBox(canvas, rightX + 18, descBoxY, rightW - 36, descBoxH, { radius: 14, fill: '#fff9db', stroke: '#000000', strokeWidth: 2.5, depth: 4 });

  drawNeoBox(canvas, rightX + 32, descBoxY + 10, 160, 22, { radius: 6, fill: '#ffd000', stroke: '#000000', strokeWidth: 2, depth: 0 });
  canvas.text(`💬 ${descLabel.toUpperCase()}`, {
    x: rightX + 32 + 80,
    y: descBoxY + 22,
    font: 'Poppins',
    size: 11,
    weight: 'bold',
    color: '#000000',
    align: 'center'
  });

  const wrappedLines = wrapTextSimple(`"${descValue}"`, 44);
  const displayLines = wrappedLines.slice(0, 2);
  displayLines.forEach((line, idx) => {
    canvas.text(line, {
      x: rightX + 32,
      y: descBoxY + 46 + idx * 20,
      font: 'Poppins',
      size: 14,
      weight: 'bold',
      color: '#1e293b',
      align: 'left'
    });
  });

  // Footer Bar
  const footY = mainY + sectionH + 14;
  const footW = W - p * 2 - 36;
  const footH = 44;
  drawNeoBox(canvas, p + 18, footY, footW, footH, { radius: 14, fill: '#00e5ff', stroke: '#000000', strokeWidth: 2.5, depth: 4 });

  canvas.text(`🚀 ${footerText}`, {
    x: p + 36,
    y: footY + 24,
    font: 'Poppins',
    size: 13,
    weight: 'bold',
    color: '#000000',
    align: 'left'
  });

  canvas.text('xorizn-bot • Fun Interactive Games ✨', {
    x: p + 18 + footW - 20,
    y: footY + 24,
    font: 'Poppins',
    size: 13,
    weight: 'bold',
    color: '#000000',
    align: 'right'
  });

  return await canvas.render('jpeg');
}

/**
 * Adapter for existing renderCekCanvas calls
 */
export async function renderCekCanvas({
  title = 'FUN CHECK',
  name = '@user',
  score = 50,
  ratingText = 'Biasa aja sih~',
  avatarBuffer = null,
  badge = 'SCORE',
  emoji = '✨'
}) {
  const numericScore = parseInt(score) || 0;

  let titleBg = '#ff4794';
  let barColor = '#ff4794';
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes('ganteng')) {
    titleBg = '#0284c7';
    barColor = '#38bdf8';
  } else if (lowerTitle.includes('cantik')) {
    titleBg = '#f43f5e';
    barColor = '#fb7185';
  } else if (lowerTitle.includes('iq') || lowerTitle.includes('pintar')) {
    titleBg = '#8b5cf6';
    barColor = '#a78bfa';
  } else if (lowerTitle.includes('bego') || lowerTitle.includes('tolol')) {
    titleBg = '#f59e0b';
    barColor = '#fbbf24';
  } else if (lowerTitle.includes('alim')) {
    titleBg = '#10b981';
    barColor = '#34d399';
  } else if (lowerTitle.includes('haram') || lowerTitle.includes('dosa')) {
    titleBg = '#dc2626';
    barColor = '#ef4444';
  } else if (lowerTitle.includes('jodoh')) {
    titleBg = '#ec4899';
    barColor = '#f472b6';
  } else if (lowerTitle.includes('stres') || lowerTitle.includes('stress')) {
    titleBg = '#64748b';
    barColor = '#94a3b8';
  } else if (lowerTitle.includes('wibu')) {
    titleBg = '#6366f1';
    barColor = '#818cf8';
  } else if (lowerTitle.includes('gay') || lowerTitle.includes('lesbi')) {
    titleBg = '#d946ef';
    barColor = '#e879f9';
  } else if (lowerTitle.includes('sadboy')) {
    titleBg = '#0284c7';
    barColor = '#38bdf8';
  }

  return await generateFunCard({
    title,
    badgeText: `${emoji || '✨'} ${numericScore}% ${badge}`,
    titleBg,
    badgeBg: '#ffd000',
    name,
    rate: numericScore,
    categoryLabel: 'Hasil Penilaian',
    categoryValue: ratingText,
    descLabel: 'Catatan Analisis',
    descValue: ratingText,
    footerText: 'xorizn-bot • Fun Interactive Games ✨',
    barColor,
    ppUrl: avatarBuffer
  });
}

/**
 * Adapter for existing renderTotalPesanCanvas calls
 */
export async function renderTotalPesanCanvas({
  groupName = 'WhatsApp Group',
  groupAvatarBuffer = null,
  totalMessages = 0,
  totalMembers = 0,
  topList = []
}) {
  return await createTotalChatCard({
    groupName,
    groupPpUrl: groupAvatarBuffer,
    totalChats: totalMessages,
    topUsers: topList.map((u) => ({
      push_name: u.name,
      sender_number: u.number?.replace(/\D/g, ''),
      count: u.total,
      avatarBuffer: u.avatarBuffer
    }))
  });
}

export default {
  generateFunCard,
  createTotalChatCard,
  renderCekCanvas,
  renderTotalPesanCanvas,
  getAvatarBuffer
};
