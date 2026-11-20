// Fitur tools/emojitoanimasi — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/emojitoanimasi", {
  "name": "emojitoanimasi",
  "command": [
    "emojitoanimasi",
    "emoji2sticker",
    "emojisticker",
    "e2s"
  ],
  "category": "tools",
  "desc": "Konversi emoji ke sticker animasi",
  "usage": ".emojitoanimasi <emoji>",
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
