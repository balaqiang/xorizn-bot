// Fitur tools/fakepolling — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("tools/fakepolling", {
  "name": "fakepoll",
  "command": [
    "fakepoll",
    "fakepolling"
  ],
  "category": "tools",
  "desc": "✨ Buat Poll WA palsu ala xorizn-bot Idol (Maks 10 opsi)",
  "usage": ".fakepoll <pertanyaan>\\n<opsi1>|<jumlah1>\\n<opsi2>|<jumlah2>\\n...\\n<opsi10>|<jumlah10>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
