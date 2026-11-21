import { resolveAnyLidToJid } from "../../src/lib/xorizn-lid.js";

const pluginConfig = {
  name: "antiunadmin",
  alias: ["antidemote", "antikick", "autoinfogc", "antiadmin"],
  category: "group",
  description: "Pengaturan perlindungan admin, AntiKick, info grup, dan sambutan anggota",
  usage: ".antiunadmin on/off | .antikick on/off | .autoinfogc on/off | .autosambut on/off | .antiadmin on/off | .antiadmin izin @taguser",
  example: ".antikick on",
  isOwner: false,
  isPremium: false,
  isGroup: true,
  isPrivate: false,
  isAdmin: false,
  isBotAdmin: false,
  cooldown: 3,
  energi: 0,
  isEnabled: true,
};

const FEATURE_MAP = {
  antiunadmin: { field: "antiunadmin", label: "Anti Unadmin / Anti Demote", detail: "Memulihkan admin yang diturunkan tanpa izin, lalu mencoba menurunkan pelaku." },
  antidemote: { field: "antiunadmin", label: "Anti Unadmin / Anti Demote", detail: "Memulihkan admin yang diturunkan tanpa izin, lalu mencoba menurunkan pelaku." },
  antikick: { field: "antikick", label: "AntiKick", detail: "Mencoba menambahkan kembali anggota yang dikeluarkan dan mengirim laporan pribadi kepada owner." },
  autoinfogc: { field: "autoinfogc", label: "AutoInfoGC", detail: "Mengumumkan perubahan admin, anggota keluar, dan perubahan informasi/pengaturan grup di grup." },
  antiadmin: { field: "antiadmin", label: "AntiAdmin", detail: "Membatalkan promosi admin yang tidak diizinkan, lalu mencoba menurunkan target dan pelakunya." },
};

function statusText(value) {
  return value === true ? "🟢 AKTIF" : "🔴 NONAKTIF";
}

function normalizeJid(value, participants = []) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  return resolveAnyLidToJid(raw, participants) || raw;
}

function getTargets(m) {
  const targets = [];
  if (Array.isArray(m.mentionedJid)) targets.push(...m.mentionedJid);
  if (m.quoted?.sender) targets.push(m.quoted.sender);
  return [...new Set(targets.filter(Boolean))];
}

async function handler(m, { db, config }) {
  const command = String(m.command || "antiunadmin").toLowerCase();
  const feature = FEATURE_MAP[command] || FEATURE_MAP.antiunadmin;
  const args = Array.isArray(m.args) ? m.args.map((arg) => String(arg).toLowerCase()) : [];
  const group = db.getGroup(m.chat) || {};

  if (command === "antiadmin" && args[0] === "izin") {
    const normalizedSender = normalizeJid(m.sender, m.groupMetadata?.participants || []);
    let isBotOwner = m.isOwner === true;
    try { isBotOwner = isBotOwner || Boolean(config?.isOwner?.(normalizedSender)); } catch {}
    if (!isBotOwner) {
      return m.reply("⛔ Perintah `.antiadmin izin` hanya dapat digunakan oleh owner bot.");
    }
    const rawTarget = getTargets(m)[0];
    if (!rawTarget) {
      return m.reply(`Cara penggunaan: \`${m.prefix}antiadmin izin @taguser\`\nMention admin yang kamu izinkan untuk menambahkan administrator grup.`);
    }
    const target = normalizeJid(rawTarget, m.groupMetadata?.participants || []);
    const participants = Array.isArray(m.groupMetadata?.participants) ? m.groupMetadata.participants : [];
    const isMember = participants.some((participant) => {
      const raw = participant?.id || participant?.jid || participant?.phoneNumber || "";
      return normalizeJid(raw, participants) === target;
    });
    if (!isMember) {
      return m.reply("❌ Target harus menjadi anggota grup ini terlebih dahulu.");
    }

    const allowed = Array.isArray(group.antiadminAllowed) ? group.antiadminAllowed : [];
    const alreadyAllowed = allowed.some((jid) => normalizeJid(jid, participants) === target);
    if (!alreadyAllowed) {
      db.setGroup(m.chat, { antiadminAllowed: [...allowed, target] });
      if (typeof db.save === "function") await db.save();
    }
    return m.reply(
      `${alreadyAllowed ? "ℹ️" : "✅"} ${alreadyAllowed ? "Izin sudah terdaftar untuk" : "Izin AntiAdmin diberikan kepada"} @${target.split("@")[0].split(":")[0]}.\n\nSaat AntiAdmin aktif, promosi yang dilakukan target ini tidak akan dibatalkan oleh AntiAdmin.`,
      { mentions: [target] },
    );
  }

  if (!m.isAdmin && !m.isOwner) {
    return m.reply("⛔ Hanya admin grup atau owner bot yang dapat mengubah pengaturan perlindungan grup.");
  }

  const requested = args[0];
  if (!["on", "off"].includes(requested)) {
    const current = group[feature.field] === true;
    const extra = command === "antiadmin"
      ? `\n\nIzin khusus: ${Array.isArray(group.antiadminAllowed) ? group.antiadminAllowed.length : 0} akun.`
      : "";
    return m.reply(
      `🛡️ *${feature.label.toUpperCase()}*\n\nStatus: ${statusText(current)}\n${feature.detail}${extra}\n\nPenggunaan: \`${m.prefix}${command} on\` atau \`${m.prefix}${command} off\``,
    );
  }

  const enabled = requested === "on";
  db.setGroup(m.chat, { [feature.field]: enabled });
  if (typeof db.save === "function") await db.save();

  const note = enabled
    ? "\n\nPastikan bot menjadi admin grup dan memiliki kewenangan yang memadai agar tindakan otomatis dapat dijalankan."
    : "";
  return m.reply(
    `${enabled ? "✅" : "🔕"} *${feature.label.toUpperCase()} ${enabled ? "DIAKTIFKAN" : "DINONAKTIFKAN"}*\n\n${enabled ? feature.detail : "Fitur dinonaktifkan dan tidak akan melakukan tindakan otomatis."}${note}`,
  );
}

export { pluginConfig as config, handler };
