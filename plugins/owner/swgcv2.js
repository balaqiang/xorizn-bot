// Fitur owner/swgcv2 — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/swgcv2", {
  "name": "swgcv2",
  "command": [
    "swgcv2",
    "statusgrupv2"
  ],
  "category": "owner",
  "desc": "Post Group Status V2 ke grup pilihan",
  "usage": ".swgcv2 <teks> atau reply media",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
