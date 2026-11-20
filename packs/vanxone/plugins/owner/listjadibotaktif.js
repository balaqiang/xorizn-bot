// Fitur owner/listjadibotaktif — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/listjadibotaktif", {
  "name": "listjadibotaktif",
  "command": [
    "listjadibotaktif",
    "jadibotaktif",
    "activejadibots"
  ],
  "category": "owner",
  "desc": "Lihat jadibot yang sedang aktif dengan detail",
  "usage": ".listjadibotaktif",
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
