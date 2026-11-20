// Fitur tools/htmltoeksekusi — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("tools/htmltoeksekusi", {
  "name": "htmltoeksekusi",
  "command": [
    "htmltoeksekusi",
    "runhtml",
    "exechtml",
    "htmlrun"
  ],
  "category": "tools",
  "desc": "Reply ke kode HTML (teks atau file .html) buat dieksekusi jadi Rich HTML card yang bisa langsung dijalankan di WhatsApp.",
  "usage": ".htmltoeksekusi [lebarxtinggi] (reply ke kode/file HTML)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
