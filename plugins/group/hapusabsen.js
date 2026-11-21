// Fitur group/hapusabsen — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/hapusabsen", {
  "name": "hapusabsen",
  "command": [
    "hapusabsen",
    "deleteabsen",
    "tutupabsen",
    "closeabsen",
    "resetabsen"
  ],
  "category": "group",
  "desc": "Hapus/tutup sesi absen (admin only)",
  "usage": ".hapusabsen",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
