// Fitur tools/tourl — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/tourl", {
  "name": "tourl",
  "command": [
    "catbox"
  ],
  "category": "tools",
  "desc": "Upload media ke multiple host dan dapatkan URL",
  "usage": ".tourl (reply/kirim media)",
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
