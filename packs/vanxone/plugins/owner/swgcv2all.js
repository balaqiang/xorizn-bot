// Fitur owner/swgcv2all — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/swgcv2all", {
  "name": "swgcv2all",
  "command": [
    "swgcv2all",
    "statusgrupv2all"
  ],
  "category": "owner",
  "desc": "Post Group Status V2 ke SEMUA grup",
  "usage": ".swgcv2all <teks> atau reply media",
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
