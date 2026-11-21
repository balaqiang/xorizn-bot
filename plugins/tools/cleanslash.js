// Fitur tools/cleanslash — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("tools/cleanslash", {
  "name": "cleanslash",
  "command": [
    "cleanslash",
    "cleanjs",
    "nocmt",
    "rmcomment"
  ],
  "category": "tools",
  "desc": "Hapus komentar dari kode (Premium Only)",
  "usage": ".nocmt <nama optional> (reply text / file)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": true,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
