// Fitur download/o-threaddl — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("download/threaddl", {
  "name": "threaddl",
  "command": [
    "threaddl",
    "tdl",
    "threads",
    "threadsdl"
  ],
  "category": "downloader",
  "desc": "Download foto dan video dari postingan Threads tanpa repot!",
  "usage": ".tdl <url>",
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
