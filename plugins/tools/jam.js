// Fitur tools/jam — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/jam", {
  "name": "timeis",
  "command": [
    "timeis",
    "waktujakarta"
  ],
  "category": "tools",
  "desc": "Cek waktu Jakarta dari time.is",
  "usage": ".timeis",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
