// Fitur tools/suppbypass — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/suppbypass", {
  "name": "suppbypass",
  "command": [
    "suppbypass",
    "supportbypass",
    "bypasslist",
    "listbypass"
  ],
  "category": "tools",
  "desc": "List shortlink yang bisa di-bypass",
  "usage": ".suppbypass",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
