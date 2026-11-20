import { getAssetBuffer } from "../../src/lib/vemzo-asset-manager.js";
import { runMenuLoading } from "../../src/lib/menu-loading.js";
import config from "../../config.js";
import { prepareWAMessageMedia, generateWAMessageFromContent, jidNormalizedUser } from "@whiskeysockets/baileys";
const pluginConfig = {
  name: "menusticker",
  alias: ["stikermenu", "listmenustiker", "liststiker"],
  category: "sticker",
  description: "Menu sticker Vemzo",
  usage: ".menusticker",
  example: ".menusticker",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 1,
  isEnabled: true,
};

const BRAT_VARIANTS = [
  { title: "🔥Gojo", description: "Sticker Gojo dengan teks", command: "gojo", sample: "vemzo gamink" },
  { title: "🐙Squid", description: "Sticker papan Squid dengan teks", command: "squid", sample: "vemzo gamink" },
  { title: "🧒Upin", description: "Sticker papan Upin dengan teks", command: "upin", sample: "vemzo gamink" },
  { title: "🌸Vermeil", description: "Sticker Vermeil dengan teks", command: "vermeil", sample: "vemzo gamink" },
  { title: "🌸Cewek", description: "Sticker cewek dengan teks", command: "cewek", sample: "vemzo gamink" },
  { title: "📝Teks Brat", description: "Sticker Brat dari teks", command: "tekss", sample: "vemzo gamink" },
  { title: "📽️Teks Video", description: "Sticker video teks animated", command: "teksvid", sample: "vemzo gamink" },
  { title: "📽️Teks Video 2", description: "Sticker video teks versi 2", command: "teksvid2", sample: "vemzo gamink" },
  { title: "📽️Gojo Video", description: "Sticker video Gojo", command: "gojovid", sample: "vemzo gamink" },
  { title: "📽️Vermeil Video", description: "Sticker video Vermeil", command: "vermeilvid", sample: "vemzo gamink" },
];

function buildVariantRows(prefix) {
  return BRAT_VARIANTS.map((item) => {
    const sample = item.sample || "vemzo gamink";
    const commandText = `${prefix}${item.command} ${sample}`;
    return {
      title: item.title,
      description: `${item.description} • ${commandText}`,
      id: commandText,
    };
  });
}

async function sendBratList(m, sock, prefix) {
  const caption =
    "✦ *LIST MENU STIKER VEMZO*\n\nPilih jenis stiker atau gunakan command sesuai format yang tersedia.";
  const buttons = [
    {
      name: "single_select",
      buttonParamsJson: JSON.stringify({
        title: "MENU STIKER",
        sections: [
          {
            title: "STIKER VEMZO",
            rows: buildVariantRows(prefix),
          },
        ],
      }),
    },
  ];

  await sock.sendButton(m.chat, getAssetBuffer("vemzo"), caption, m, {
    buttons,
    footer: "Vemzo • Sticker Menu",
  });
}

async function sendBratMenu(m, sock, prefix) {
  const caption =
    "✦ *MENU STIKER VEMZO* ✦\n\nGunakan tombol *LIST MENU STIKER* untuk melihat semua fitur stiker.";
  const buttons = [
    {
      name: "single_select",
      buttonParamsJson: JSON.stringify({
        title: "LIST MENU STIKER",
        sections: [
          {
            title: "STIKER VEMZO",
            rows: buildVariantRows(prefix),
          },
        ],
      }),
    },
  ];

  await sock.sendButton(m.chat, getAssetBuffer("vemzo"), caption, m, {
    buttons,
    footer: "Vemzo • Sticker",
  });
}

async function handler(m, { sock }) {
  await runMenuLoading(sock, m.chat, "menu stiker");
  const prefix = m.prefix || config.command?.prefix || ".";
  const args = (m.args || []).join(" ").trim().toLowerCase();
  if (args === "list" || args === "menu") {
    return sendBratList(m, sock, prefix);
  }
  await sendBratMenu(m, sock, prefix);
}

export { pluginConfig as config, handler };
