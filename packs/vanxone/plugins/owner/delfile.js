// Fitur owner/delfile — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/delfile", {
  "name": "delfile",
  "command": [
    "delfile",
    "deletefile",
    "hapusfile",
    "removefile"
  ],
  "category": "owner",
  "desc": "Hapus file dari server via path (backup otomatis sebelum dihapus)",
  "usage": ".delfile <path>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
