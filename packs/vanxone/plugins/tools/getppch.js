// Fitur tools/getppch — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("tools/getppch", {
  "name": "getppchannel",
  "command": [
    "getppchannel",
    "ppch",
    "ppchannel"
  ],
  "category": "tools",
  "desc": "Get foto profil channel/saluran WhatsApp",
  "usage": ".getppch <link/jid channel>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
