import { getAssetBuffer } from "../../src/lib/orbit-asset-manager.js";
import { runMenuLoading } from "../../src/lib/menu-loading.js";
import configOwner from "../../config.js";

const pluginConfig = {
  name: "menumedia",
  alias: ["mediamenu", "listmenumedia"],
  category: "canvas",
  description: "Menu fitur media: IQC, VOS, dan VOSV2.",
  usage: ".menumedia",
  example: ".menumedia",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 1,
  isEnabled: true,
};

function makeRows(prefix) {
  return [
    {
      title: "IQC",
      description: "Fake Quote iOS • .iqc orbit gamink",
      id: `${prefix}iqc orbit gamink`,
    },
    {
      title: "VOS",
      description: "Buat gambar quote dengan nama • .vos Jack,xorizn-bot Gamink",
      id: `${prefix}vos Jack,xorizn-bot Gamink`,
    },
    {
      title: "VOSV2",
      description: "Buat quote gaya Windows Media Player • .vosv2 XORIZN-BOT GAMINK",
      id: `${prefix}vosv2 XORIZN-BOT GAMINK`,
    },
  ];
}

async function sendMediaList(m, sock, prefix) {
  const rows = makeRows(prefix);
  const text =
    `╭─〔 🖼️ *XORIZN-BOT MEDIA* 〕─╮\n` +
    `│ IQC • VOS • VOSV2\n` +
    `╰────────────────╯\n\n` +
    `Pilih fitur dari tombol *LIST MENU MEDIA* di bawah.`;

  const buttons = [
    {
      name: "single_select",
      buttonParamsJson: JSON.stringify({
        title: "☰ LIST MENU MEDIA",
        sections: [{ title: "MEDIA XORIZN-BOT", rows }],
      }),
    },
  ];

  await sock.sendButton(m.chat, getAssetBuffer("orbit"), text, m, {
    buttons,
    footer: "xorizn-bot • Media",
  });
}

async function handler(m, { sock }) {
  await runMenuLoading(sock, m.chat, "menu media");
  const prefix = m.prefix || configOwner?.command?.prefix || ".";
  const args = (m.args || []).join(" ").trim().toLowerCase();

  if (args === "list" || args === "menu") {
    return sendMediaList(m, sock, prefix);
  }

  const text =
    `╭─〔 🖼️ *XORIZN-BOT MEDIA* 〕─╮\n` +
    `│ IQC • VOS • VOSV2\n` +
    `╰────────────────╯\n\n` +
    `Gunakan tombol *LIST MENU MEDIA* untuk melihat cara pakai dan memilih fitur.`;

  const buttons = [
    {
      name: "single_select",
      buttonParamsJson: JSON.stringify({
        title: "☰ LIST MENU MEDIA",
        sections: [{ title: "MEDIA XORIZN-BOT", rows: makeRows(prefix) }],
      }),
    },
  ];

  await sock.sendButton(m.chat, getAssetBuffer("orbit"), text, m, {
    buttons,
    footer: "xorizn-bot • Media",
  });

}

export { pluginConfig as config, handler };
