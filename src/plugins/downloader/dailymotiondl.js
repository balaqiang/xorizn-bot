// Fitur download/dailymotiondl — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("download/dailymotiondl", {
  "name": "dailymotiondl",
  "command": [
    "dailymotiondl",
    "dailymotion",
    "dmdl"
  ],
  "category": "downloader",
  "desc": "Download video dari Dailymotion",
  "usage": ".dailymotiondl <url>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 15,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [
      "dailymotion"
    ],
    "assets": []
  }
})
