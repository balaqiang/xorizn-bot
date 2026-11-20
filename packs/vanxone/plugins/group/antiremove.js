// Fitur group/antiremove — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/antiremove", {
  "name": "antiremove",
  "command": [
    "antiremove",
    "antihapus",
    "ar"
  ],
  "category": "group",
  "desc": "Mengaktifkan/menonaktifkan anti hapus pesan di grup",
  "usage": ".antiremove <on/off>",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
