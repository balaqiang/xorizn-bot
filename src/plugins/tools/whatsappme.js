// Fitur tools/whatsappme — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("tools/whatsappme", {
  "name": "whatsappme",
  "command": [
    "whatsappme",
    "wame",
    "pesanme",
    "messageme",
    "chatme",
    "wme"
  ],
  "category": "tools",
  "desc": "Buat link WhatsApp wa.me dengan nomor dan pesan otomatis",
  "usage": ".wame <nomor/tag> <pesan>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
