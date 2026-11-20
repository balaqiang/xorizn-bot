// Fitur owner/botafk — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/botafk", {
  "name": "botafk",
  "command": [
    "botafk",
    "afkbot",
    "afkmode"
  ],
  "category": "owner",
  "desc": "Mode AFK untuk bot - bot tidak merespon command, hanya reply pesan AFK",
  "usage": ".botafk <alasan>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
