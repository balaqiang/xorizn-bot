// Fitur sticker/attp — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("sticker/attp", {
  "name": "attp",
  "command": [
    "attp",
    "attp3",
    "attp2"
  ],
  "category": "sticker",
  "desc": "Membuat sticker animated text",
  "usage": ".attp <teks>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
