// Fitur tools/emojitoimage — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/emojitoimage", {
  "name": "emojitoimage",
  "command": [
    "emojitoimage",
    "emoji2img",
    "emojiimg",
    "e2i"
  ],
  "category": "tools",
  "desc": "Konversi emoji ke gambar HD (style Apple)",
  "usage": ".emojitoimage <emoji> [style]",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
