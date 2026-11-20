// Fitur sticker/o-stickerly — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("sticker/stickerly", {
  "name": "stickerly",
  "command": [
    "stickerly",
    "stikerly",
    "stickerlysearch"
  ],
  "category": "sticker",
  "desc": "Cari dan download sticker pack dari Sticker.ly",
  "usage": ".stickerly <query / url>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
