// Fitur canvas/o-tiktokchat — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/tiktokchat", {
  "name": "tiktokchat",
  "command": [
    "tiktokchat",
    "tiktok-chat",
    "ttchat"
  ],
  "category": "image",
  "desc": "Membuat fake chat TikTok dari avatar kamu",
  "usage": ".tiktokchat username | pesan (reply gambar)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
