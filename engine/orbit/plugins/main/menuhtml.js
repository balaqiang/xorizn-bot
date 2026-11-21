import { getAssetBuffer } from "../../src/lib/vemzo-asset-manager.js";
import { runMenuLoading } from "../../src/lib/menu-loading.js";
import config from "../../config.js";
const pluginConfig = {
  name: "menuhtml",
  alias: ["htmlmenu", "menugamehtml"],
  category: "main",
  description: "Menu tombol untuk menjalankan semua game HTML VEMZO",
  usage: ".menuhtml",
  example: ".menuhtml",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 0,
  isEnabled: true,
};

const HTML_GAMES = [
  { title: "Flappy Bird", description: "Game terbang melewati pipa", command: "flappy" },
  { title: "Catur", description: "Permainan catur interaktif", command: "catur" },
  { title: "XOZO", description: "Tic Tac Toe melawan robot", command: "xozo" },
  { title: "Dino Run", description: "Endless runner versi Dino Run", command: "dinorun" },
  { title: "PINZO", description: "Piano dengan 7 tuts", command: "pinzo" },
  { title: "KJZO", description: "Chase Runner", command: "kjzo" },
  { title: "PIXZO", description: "Pixel Maze", command: "pixzo" },
  { title: "ZONIC", description: "Speed Adventure endless runner", command: "zonic" },
  { title: "ZONIC V2", description: "Sonic Speed Adventure dengan laser dan boss", command: "zonicv2" },
];

async function handler(m, { sock }) {
  const prefix = m.prefix || config.command?.prefix || ".";
  await runMenuLoading(sock, m.chat, "menu game HTML");

  const rows = HTML_GAMES.map((game) => ({
    title: game.title,
    description: `${game.description} • ${prefix}${game.command}`,
    id: `${prefix}${game.command}`,
  }));

  const buttons = [
    {
      name: "single_select",
      buttonParamsJson: JSON.stringify({
        title: "PILIH GAME HTML",
        sections: [{ title: "GAME VEMZO", rows }],
      }),
    },
  ];

  const caption = [
    "▪ MENU GAME HTML VEMZO",
    "",
    "Pilih tombol untuk menjalankan game yang diinginkan.",
    "Semua pilihan menggunakan command resmi bot.",
  ].join("\n");

  return sock.sendButton(m.chat, getAssetBuffer("vemzo"), caption, m, {
    buttons,
    footer: `${config.bot?.name || "VEMZO"} | Menu HTML`,
  });
}

export { pluginConfig as config, handler };
