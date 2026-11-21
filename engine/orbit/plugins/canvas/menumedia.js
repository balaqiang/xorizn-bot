import { getAssetBuffer } from "../../src/lib/vemzo-asset-manager.js";
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
      description: "Fake Quote iOS • .iqc vemzo gamink",
      id: `${prefix}iqc vemzo gamink`,
    },
    {
      title: "VOS",
      description: "Buat gambar quote dengan nama • .vos Jack,Vemzo Gamink",
      id: `${prefix}vos Jack,Vemzo Gamink`,
    },
    {
      title: "VOSV2",
      description: "Buat quote gaya Windows Media Player • .vosv2 VEMZO GAMINK",
      id: `${prefix}vosv2 VEMZO GAMINK`,
    },
  ];
}

async function sendMediaList(m, sock, prefix) {
  const rows = makeRows(prefix);
  const text =
    `╭─〔 🖼️ *VEMZO MEDIA* 〕─╮\n` +
    `│ IQC • VOS • VOSV2\n` +
    `╰────────────────╯\n\n` +
    `Pilih fitur dari tombol *LIST MENU MEDIA* di bawah.`;

  const buttons = [
    {
      name: "single_select",
      buttonParamsJson: JSON.stringify({
        title: "☰ LIST MENU MEDIA",
        sections: [{ title: "MEDIA VEMZO", rows }],
      }),
    },
  ];

  await sock.sendButton(m.chat, getAssetBuffer("vemzo"), text, m, {
    buttons,
    footer: "Vemzo • Media",
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
    `╭─〔 🖼️ *VEMZO MEDIA* 〕─╮\n` +
    `│ IQC • VOS • VOSV2\n` +
    `╰────────────────╯\n\n` +
    `Gunakan tombol *LIST MENU MEDIA* untuk melihat cara pakai dan memilih fitur.`;

  const buttons = [
    {
      name: "single_select",
      buttonParamsJson: JSON.stringify({
        title: "☰ LIST MENU MEDIA",
        sections: [{ title: "MEDIA VEMZO", rows: makeRows(prefix) }],
      }),
    },
  ];

  await sock.sendButton(m.chat, getAssetBuffer("vemzo"), text, m, {
    buttons,
    footer: "Vemzo • Media",
  });

}

export { pluginConfig as config, handler };
