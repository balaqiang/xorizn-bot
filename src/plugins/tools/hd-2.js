// Fitur tools/hd — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/hd", {
  "name": "remini",
  "command": [
    "remini"
  ],
  "category": "tools",
  "desc": "Enhance gambar jadi HD",
  "usage": ".remini (reply gambar)",
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
