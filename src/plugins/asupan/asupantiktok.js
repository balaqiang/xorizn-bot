// Fitur asupan/asupantiktok — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("asupan/asupantiktok", {
  "name": "asupantiktok",
  "command": [
    "asupantiktok",
    "tiktokasupan",
    "ttasupan"
  ],
  "category": "asupan",
  "desc": "Video TikTok dari username random atau spesifik",
  "usage": ".asupantiktok [username]",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 15,
  "energi": 2,
  "needs": {
    "apikeys": [
      "neoxr"
    ],
    "scrapers": [],
    "assets": []
  }
})
