// Fitur owner/settiktokdl2 — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/settiktokdl2", {
  "name": "settiktokdl2",
  "command": [
    "settiktokdl2",
    "settt2",
    "tt2variant"
  ],
  "category": "owner",
  "desc": "Mengatur variant tampilan hasil download tiktok2",
  "usage": ".settiktokdl2 <v1-v2>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
