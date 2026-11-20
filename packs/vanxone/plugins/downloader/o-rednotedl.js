// Fitur download/o-rednotedl — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("download/rednotedl", {
  "name": "rednotedl",
  "command": [
    "rednotedl",
    "rednote",
    "xhsdl",
    "xiaohongshu"
  ],
  "category": "downloader",
  "desc": "Download video/foto dari RedNote (XiaoHongShu)",
  "usage": ".rednotedl <url>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
