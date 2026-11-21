// Fitur tools/claudeshare — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("tools/claudeshare", {
  "name": "claudeshare",
  "command": [
    "claudeshare",
    "sharecl",
    "claudetxt",
    "cshare"
  ],
  "category": "tools",
  "desc": "Salin isi link share claude.ai jadi file txt",
  "usage": ".claudeshare <link claude.ai/share/...>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 20,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
