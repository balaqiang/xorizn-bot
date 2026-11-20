import { getDatabase } from "../../src/lib/vemzo-database.js";
import config from "../../config.js";
import { enableUnlimitedDailyFeature } from "../../src/lib/vemzo-daily-limit.js";
import { resolveAnyLidToJid } from "../../src/lib/vemzo-lid.js";

const pluginConfig = {
  name: "done",
  alias: ["selesai", "kirim", "confirm"],
  category: "store",
  description:
    "✅ Konfirmasi transaksi toko atau beri limit harian unlimited permanen ke user",
  usage: ".done <nomor_trx> atau reply pesan user lalu .done",
  example: ".done TRX-001",
  isOwner: true,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  energi: 0,
  isEnabled: true,
};

function formatPrice(n) {
  return "Rp " + n.toLocaleString("id-ID");
}

async function handler(m, { sock }) {
  const db = getDatabase();
  const trxId = m.text?.trim();

  // .done tanpa nomor transaksi, saat me-reply pesan pengguna, memberi akses limit harian permanen.
  if (!trxId && m.quoted) {
    if (!m.isOwner) {
      return m.reply("❌ Fitur pemberian limit unlimited hanya bisa digunakan owner bot.");
    }

    const targetJid =
      m.quoted.sender ||
      m.quoted.key?.participant ||
      m.quoted.participant;
    if (!targetJid || targetJid === m.sender) {
      return m.reply("❌ Reply pesan pengguna lain untuk memberi limit unlimited permanen.");
    }

    const participants = m.groupMetadata?.participants || [];
    const resolvedTargetJid = resolveAnyLidToJid(targetJid, participants) || targetJid;
    enableUnlimitedDailyFeature(db, resolvedTargetJid, participants);
    // Tanda energi -1 juga dipakai sistem energi lama sebagai nilai unlimited.
    if (db.getUser(resolvedTargetJid) || db.setUser(resolvedTargetJid)) {
      db.setUser(resolvedTargetJid, { energi: -1 });
    }
    await db.save();

    const targetNumber = String(resolvedTargetJid).split("@")[0].replace(/[^0-9]/g, "");
    const targetMention = targetNumber ? `@${targetNumber}` : "pengguna tersebut";
    await m.reply(
      `✅ *LIMIT UNLIMITED AKTIF PERMANEN*\n\n` +
        `Pengguna ${targetMention} sekarang bisa menggunakan fitur bot tanpa batas harian.\n` +
        `Status tersimpan di database dan tidak reset besok.\n\n` +
        `> Limit harian: *UNLIMITED*`,
      targetNumber ? { mentions: [resolvedTargetJid] } : {},
    );
    return;
  }

  if (!trxId) {
    return m.reply(
      `✅ *KONFIRMASI TRANSAKSI*\n\n` +
        `📋 Format: \`${m.prefix}done <nomor_trx>\`\n\n` +
        `📌 *Cara penggunaan:*\n` +
        `1️⃣ Reply pesan dari pembeli (yang sudah membayar 💰)\n` +
        `2️⃣ Ketik \`${m.prefix}done TRX-001\`\n\n` +
        `🤖 Bot akan otomatis:\n` +
        `• Mengirim data produk ke nomor pembeli 📤\n` +
        `• Menandai transaksi sebagai selesai ✅\n` +
        `• Mengirim notifikasi ke pembeli 🔔\n\n` +
        `🧾 *Nomor transaksi* didapat ketika pembeli melakukan \`${m.prefix}beli <nomor_produk>\`\n\n` +
        `⚠️ _Pastikan Anda sudah menerima bukti pembayaran sebelum konfirmasi_ 📸\n\n` +
        `🔓 *Beri unlimited permanen:* reply pesan user lalu ketik \`${m.prefix}done\` tanpa nomor transaksi.`,
    );
  }

  const transactions = db.setting("storeTransactions") || {};
  const trx = transactions[trxId];

  if (!trx) {
    const allTrx = Object.values(transactions);
    const pending = allTrx.filter((t) => t.status === "pending");

    if (pending.length > 0) {
      let txt = `❌ *Transaksi \`${trxId}\` tidak ditemukan.*\n\n`;
      txt += `⏳ *Transaksi pending saat ini:*\n\n`;
      for (const t of pending) {
        const typeIcon = t.productType === "fisik" ? "📦" : "🔑";
        const time = new Date(t.createdAt).toLocaleString("id-ID", {
          timeZone: "Asia/Jakarta",
        });
        txt += `• 🧾 \`${t.trxId}\` — ${typeIcon} ${t.productName} (${formatPrice(t.price)}) oleh ${t.buyerName}\n`;
        txt += `  🕐 _${time}_\n\n`;
      }
      txt += `📌 Reply pesan pembeli lalu ketik: \`${m.prefix}done <nomor_trx>\``;
      return m.reply(txt);
    }

    return m.reply(
      `❌ *Transaksi \`${trxId}\` tidak ditemukan.*\n\n` +
        `📭 Tidak ada transaksi pending saat ini.\n\n` +
        `_Pembeli dapat membuat pesanan dengan \`${m.prefix}beli <nomor_produk>\`_ 🛒`,
    );
  }

  if (trx.status === "completed") {
    return m.reply(
      `⚠️ *Transaksi sudah selesai.*\n\n` +
        `🧾 TRX: \`${trxId}\`\n` +
        `${trx.productType === "fisik" ? "📦" : "🔑"} Produk: *${trx.productName}*\n` +
        `👤 Pembeli: ${trx.buyerName}\n` +
        `✅ Selesai pada: ${new Date(trx.completedAt).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}\n\n` +
        `_Transaksi ini sudah dikonfirmasi sebelumnya_ 🔒`,
    );
  }

  let buyerJid = trx.buyerJid;

  if (m.quoted && m.isGroup) {
    const quotedSender = m.quoted.sender || m.quotedSender;
    if (quotedSender && quotedSender !== m.sender) {
      buyerJid = quotedSender;
    }
  }

  if (!buyerJid) {
    return m.reply(
      `❌ *Tidak dapat menemukan nomor pembeli.*\n\nTransaksi ini tidak memiliki data pembeli yang valid 📱`,
    );
  }

  const buyerNum = buyerJid.split("@")[0];
  const products = db.setting("storeProducts") || [];
  const productIdx = products.findIndex((p) => p.id === trx.productId);
  const product = productIdx !== -1 ? products[productIdx] : null;

  let stockItemDetail = null;

  if (product && trx.productType !== "fisik") {
    if (product.stockItems?.length > 0) {
      const item = product.stockItems.shift();
      stockItemDetail = item.detail;
      product.stock = product.stockItems.length;
      db.setting("storeProducts", products);
    } else if (product?.detail) {
      stockItemDetail = product.detail;
    }
  }

  if (product && trx.productType === "fisik") {
    if (product.stock !== -1 && product.stock > 0) {
      product.stock -= 1;
      db.setting("storeProducts", products);
    }
  }

  trx.status = "completed";
  trx.completedAt = new Date().toISOString();
  trx.buyerJid = buyerJid;
  trx.stockItemDetail = stockItemDetail;
  transactions[trxId] = trx;
  db.setting("storeTransactions", transactions);

  const now = new Date();
  const timeStr = now.toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const saluranId = config.saluran?.id || "120363408770415209@newsletter";
  const saluranName = config.saluran?.name || config.bot?.name || "vanXone";

  const typeIcon = trx.productType === "fisik" ? "📦" : "🔑";
  const typeLabel = trx.productType === "fisik" ? "Fisik" : "Digital";

  let invoiceTxt = `🎉 *TRANSAKSI BERHASIL*\n\n`;
  invoiceTxt += `🕐 Waktu: \`${timeStr}\`\n`;
  invoiceTxt += `✅ Status: *Berhasil*\n\n`;
  invoiceTxt += `📦 *Detail Pesanan:*\n`;
  invoiceTxt += `${typeIcon} Produk: *${trx.productName}*\n`;
  invoiceTxt += `🏷️ Tipe: *${typeLabel}*\n`;
  invoiceTxt += `💰 Harga: *${formatPrice(trx.price)}*\n\n`;

  if (stockItemDetail) {
    invoiceTxt += `🔑 *Data Produk:*\n\`\`\`\n${stockItemDetail}\n\`\`\`\n\n`;
    invoiceTxt += `⚠️ _Simpan data di atas dengan baik. Jangan bagikan ke siapapun_ 🔒\n\n`;
  } else if (trx.productType === "fisik") {
    invoiceTxt += `📦 _Produk fisik akan dikirim oleh admin. Silakan konfirmasi alamat pengiriman._\n\n`;
  }

  invoiceTxt += `🙏 Terima kasih telah berbelanja! _Next order ya_ ✨`;

  try {
    await sock.sendMessage(buyerJid, {
      text: invoiceTxt,
      contextInfo: {
        forwardingScore: 9999,
        isForwarded: true
      },
    });
  } catch (e) {
    console.error("[Done] Failed to send to buyer:", buyerJid, e.message);
    await m.reply(
      `❌ *Gagal mengirim ke pembeli.*\n\n📱 Nomor: \`${buyerNum}\`\n\n_Kemungkinan pembeli belum menyimpan nomor bot. Kirim manual data berikut:_\n\n${invoiceTxt}`,
    );
  }

  if (trx.purchaseIsGroup && trx.purchaseChat) {
    try {
      const buyerMention = `@${buyerNum}`;
      await sock.sendMessage(trx.purchaseChat, {
        text:
          `🎉 *Pesanan Selesai!*\n\n` +
          `${buyerMention} pembelian kamu untuk *${trx.productName}* sudah dikonfirmasi ✅\n` +
          `💰 Harga: *${formatPrice(trx.price)}*\n\n` +
          `📦 Data produk sudah dikirim ke private chat kamu. Cek pesan dari bot ya! 📱\n\n` +
          `🙏 Terima kasih telah berbelanja!`,
        mentions: [buyerJid],
      });
    } catch (e) {
      console.error(
        "[Done] Failed to notify group:",
        trx.purchaseChat,
        e.message,
      );
    }
  }

  await m.react("✅");

  let confirmTxt = `✅ *TRANSAKSI DIKONFIRMASI*\n\n`;
  confirmTxt += `🧾 TRX: \`${trxId}\`\n`;
  confirmTxt += `${typeIcon} Produk: *${trx.productName}*\n`;
  confirmTxt += `👤 Pembeli: *${trx.buyerName}*\n`;
  confirmTxt += `📱 Nomor: \`${buyerNum}\`\n`;
  confirmTxt += `💰 Harga: *${formatPrice(trx.price)}*\n`;
  if (product) {
    const stockDisplay =
      product.type === "fisik"
        ? `${product.stock === -1 ? "♾️ Unlimited" : product.stock + " pcs"}`
        : `${product.stockItems?.length || 0} akun`;
    confirmTxt += `📊 Sisa stok: *${stockDisplay}*\n`;
  }
  confirmTxt += `\n📤 _Data telah dikirim ke nomor pembeli_ ✅`;

  return m.reply(confirmTxt);
}

export { pluginConfig as config, handler };
