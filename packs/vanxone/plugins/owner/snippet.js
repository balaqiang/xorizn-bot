// Fitur owner/snippet — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/snippet", {
  "name": "snippet",
  "command": [
    "snippet",
    "addcode",
    "showcode",
    "listcode",
    "delcode",
    "codelist",
    "savecode",
    "delsnippet"
  ],
  "category": "owner",
  "desc": "Menyimpan dan mengambil kode/catatan penting, bisa sama gambar (owner only)",
  "usage": ".snippet add <nama> | <kode>  (bisa sambil reply gambar)\\n.snippet get <nomor|nama>\\n.snippet list\\n.snippet del <nomor|nama>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
