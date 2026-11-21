// Fitur download/alightmotion — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("download/alightmotion", {
  "name": "alightmotiondl",
  "command": [
    "alightmotiondl",
    "alightmotion",
    "amdl"
  ],
  "category": "downloader",
  "desc": "Download project/preset Alight Motion",
  "usage": ".amdl <link>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
