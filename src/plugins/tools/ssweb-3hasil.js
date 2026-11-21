// Fitur tools/ssweb-3hasil — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("tools/ssweb-3hasil", {
  "name": "ssweb-3hasil",
  "command": [
    "ssweb-3hasil",
    "ssweb3",
    "ss3",
    "screenshot3",
    "screenshotweb3"
  ],
  "category": "tools",
  "desc": "Screenshot website dalam 3 versi (desktop, mobile, tablet)",
  "usage": ".ssweb-3hasil <url>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 15,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
