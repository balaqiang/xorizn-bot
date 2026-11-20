// Fitur tools/ssweb — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/ssweb", {
  "name": "ssweb",
  "command": [
    "webss"
  ],
  "category": "tools",
  "desc": "Screenshot website",
  "usage": ".ssweb <url>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 15,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
