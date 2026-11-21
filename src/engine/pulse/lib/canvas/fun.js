import { createCanvas } from '@napi-rs/canvas';
import { ensureCanvasFonts, FONT_FAMILY, loadAvatarImage } from './font.js';

function drawNeo3D(ctx, x, y, w, h, r, bg, depth = 5, borderColor = '#000000', borderWidth = 3) {
  function path(px, py) {
    ctx.beginPath();
    ctx.moveTo(px + r, py);
    ctx.lineTo(px + w - r, py);
    ctx.quadraticCurveTo(px + w, py, px + w, py + r);
    ctx.lineTo(px + w, py + h - r);
    ctx.quadraticCurveTo(px + w, py + h, px + w - r, py + h);
    ctx.lineTo(px + r, py + h);
    ctx.quadraticCurveTo(px, py + h, px, py + h - r);
    ctx.lineTo(px, py + r);
    ctx.quadraticCurveTo(px, py, px + r, py);
    ctx.closePath();
  }

  if (depth > 0) {
    path(x + depth, y + depth);
    ctx.fillStyle = '#000000';
    ctx.fill();
  }

  path(x, y);
  ctx.fillStyle = bg;
  ctx.fill();

  if (borderWidth > 0) {
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.stroke();
  }

  ctx.save();
  path(x, y);
  ctx.clip();
  const gloss = ctx.createLinearGradient(x, y, x, y + Math.min(h * 0.45, 28));
  gloss.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
  gloss.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = gloss;
  ctx.fillRect(x, y, w, Math.min(h * 0.45, 28));
  ctx.restore();
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

function truncateText(ctx, text, maxWidth) {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let len = text.length;
  while (len > 0 && ctx.measureText(text.substring(0, len) + '..').width > maxWidth) {
    len--;
  }
  return text.substring(0, len) + '..';
}

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
  await ensureCanvasFonts();
  const W = 900, H = 540;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#fffae5';
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  for (let gx = 16; gx < W; gx += 26) {
    for (let gy = 16; gy < H; gy += 26) {
      ctx.beginPath();
      ctx.arc(gx, gy, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const p = 16;
  
  drawNeo3D(ctx, p, p, W - p * 2, H - p * 2, 24, '#ffffff', 8, '#000000', 4);

  const headerY = p + 18;
  const tBg = titleBg || '#ff4794';
  drawNeo3D(ctx, p + 18, headerY, 500, 50, 16, tBg, 5, '#000000', 3.5);
  ctx.font = `bold 22px ${FONT_FAMILY}`;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  const rawTitle = title.startsWith('🌐') || title.startsWith('⚡') || title.startsWith('🌸') || title.startsWith('✨') || title.startsWith('🌈') ? title : `✨ ${title.toUpperCase()}`;
  const safeTitle = truncateText(ctx, rawTitle, 460);
  ctx.fillText(safeTitle, p + 36, headerY + 25);

  const bBg = badgeBg || '#ffd000';
  ctx.font = `bold 16px ${FONT_FAMILY}`;
  const bTextW = ctx.measureText(badgeText).width;
  const badgeW = Math.max(160, bTextW + 40);
  const badgeX = W - p - 18 - badgeW;
  drawNeo3D(ctx, badgeX, headerY, badgeW, 50, 16, bBg, 5, '#000000', 3.5);
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(badgeText, badgeX + badgeW / 2, headerY + 25);

  const mainY = headerY + 68;
  const leftW = 260;
  const leftX = p + 18;
  const rightX = leftX + leftW + 18;
  const rightW = W - p * 2 - leftW - 54;
  const sectionH = H - p * 2 - 150;

  drawNeo3D(ctx, leftX, mainY, leftW, sectionH, 20, '#f8f9fc', 6, '#000000', 3.5);

  const avSize = 120;
  const avX = leftX + (leftW - avSize) / 2;
  const avY = mainY + 20;
  drawNeo3D(ctx, avX, avY, avSize, avSize, 22, '#ffffff', 5, '#000000', 3);

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(avX + 22, avY);
  ctx.lineTo(avX + avSize - 22, avY);
  ctx.quadraticCurveTo(avX + avSize, avY, avX + avSize, avY + 22);
  ctx.lineTo(avX + avSize, avY + avSize - 22);
  ctx.quadraticCurveTo(avX + avSize, avY + avSize, avX + avSize - 22, avY + avSize);
  ctx.lineTo(avX + 22, avY + avSize);
  ctx.quadraticCurveTo(avX, avY + avSize, avX, avY + avSize - 22);
  ctx.lineTo(avX, avY + 22);
  ctx.quadraticCurveTo(avX, avY, avX + 22, avY);
  ctx.closePath();
  ctx.clip();

  const avatarImg = await loadAvatarImage(ppUrl);
  if (avatarImg) {
    ctx.drawImage(avatarImg, avX, avY, avSize, avSize);
  } else {
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(avX, avY, avSize, avSize);
    ctx.font = `bold 44px ${FONT_FAMILY}`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText((name[0] || 'U').toUpperCase(), avX + avSize / 2, avY + avSize / 2);
  }
  ctx.restore();

  drawNeo3D(ctx, leftX + 16, mainY + 158, leftW - 32, 42, 12, '#ffffff', 4, '#000000', 2.5);
  ctx.font = `bold 16px ${FONT_FAMILY}`;
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const safeName = truncateText(ctx, name, leftW - 60);
  ctx.fillText(`👤 ${safeName}`, leftX + leftW / 2, mainY + 179);

  drawNeo3D(ctx, leftX + 16, mainY + 212, leftW - 32, 44, 12, '#00e5ff', 4, '#000000', 2.5);
  ctx.font = `bold 13px ${FONT_FAMILY}`;
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✨ FUN CHECK RESULT', leftX + leftW / 2, mainY + 234);

  drawNeo3D(ctx, rightX, mainY, rightW, sectionH, 20, '#ffffff', 6, '#000000', 3.5);

  const catBoxY = mainY + 18;
  const catBoxH = 60;
  drawNeo3D(ctx, rightX + 18, catBoxY, rightW - 36, catBoxH, 14, '#fffae5', 4, '#000000', 2.5);

  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.font = `bold 11px ${FONT_FAMILY}`;
  ctx.fillStyle = '#854d0e';
  ctx.fillText(`🏷️ ${categoryLabel.toUpperCase()}:`, rightX + 32, catBoxY + 12);

  ctx.font = `bold 18px ${FONT_FAMILY}`;
  ctx.fillStyle = '#000000';
  const safeCat = truncateText(ctx, categoryValue, rightW - 70);
  ctx.fillText(safeCat, rightX + 32, catBoxY + 30);

  const barBoxY = catBoxY + catBoxH + 14;
  const barBoxH = 76;
  drawNeo3D(ctx, rightX + 18, barBoxY, rightW - 36, barBoxH, 14, '#ffffff', 4, '#000000', 2.5);

  const clampedRate = Math.min(100, Math.max(0, rate));
  drawNeo3D(ctx, rightX + 32, barBoxY + 10, 140, 22, 6, '#a3e635', 0, '#000000', 2);
  ctx.font = `bold 11px ${FONT_FAMILY}`;
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('📊 SCORE METER', rightX + 32 + 70, barBoxY + 21);

  ctx.textAlign = 'right';
  ctx.font = `bold 22px ${FONT_FAMILY}`;
  ctx.fillStyle = '#000000';
  ctx.fillText(`${clampedRate}%`, rightX + rightW - 36, barBoxY + 21);

  const trkX = rightX + 32;
  const trkY = barBoxY + 42;
  const trkW = rightW - 70;
  const trkH = 20;
  drawNeo3D(ctx, trkX, trkY, trkW, trkH, 10, '#f1f5f9', 0, '#000000', 2);

  const fillW = Math.max(trkH, (trkW * clampedRate) / 100);
  if (clampedRate > 0) {
    drawNeo3D(ctx, trkX, trkY, fillW, trkH, 10, barColor || '#ff4794', 0, '#000000', 2);
  }

  const descBoxY = barBoxY + barBoxH + 14;
  const descBoxH = 88;
  drawNeo3D(ctx, rightX + 18, descBoxY, rightW - 36, descBoxH, 14, '#fff9db', 4, '#000000', 2.5);

  drawNeo3D(ctx, rightX + 32, descBoxY + 10, 160, 22, 6, '#ffd000', 0, '#000000', 2);
  ctx.font = `bold 11px ${FONT_FAMILY}`;
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`💬 ${descLabel.toUpperCase()}`, rightX + 32 + 80, descBoxY + 21);

  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.font = `bold 14px ${FONT_FAMILY}`;
  ctx.fillStyle = '#1e293b';
  const wrappedLines = wrapText(ctx, `"${descValue}"`, rightW - 74);
  const displayLines = wrappedLines.slice(0, 2);
  displayLines.forEach((line, idx) => {
    ctx.fillText(line, rightX + 32, descBoxY + 40 + idx * 20);
  });

  const footY = mainY + sectionH + 14;
  const footW = W - p * 2 - 36;
  const footH = 44;
  drawNeo3D(ctx, p + 18, footY, footW, footH, 14, '#00e5ff', 4, '#000000', 2.5);

  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.font = `bold 13px ${FONT_FAMILY}`;
  ctx.fillStyle = '#000000';
  ctx.fillText(`🚀 ${footerText}`, p + 36, footY + 22);

  ctx.textAlign = 'right';
  ctx.font = `bold 13px ${FONT_FAMILY}`;
  ctx.fillStyle = '#000000';
  ctx.fillText('Elysia AI • Fun Interactive Games ✨', p + 18 + footW - 20, footY + 22);

  return canvas.toBuffer('image/jpeg');
}