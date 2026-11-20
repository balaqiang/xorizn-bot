// Fitur ai/o-toemotebatu — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/toemotebatu", {
  "name": "toemotebatu",
  "command": [
    "toemotebatu",
    "emotebatu",
    "moai",
    "tomoai"
  ],
  "category": "ai",
  "desc": "Ubah gambar ke emote batu 🗿",
  "usage": ".toemotebatu (reply gambar)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 30,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
