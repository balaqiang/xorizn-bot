// Fitur tools/ffguest — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("tools/ffguest", {
  "name": "ffguest",
  "command": [
    "ffguest",
    "ffakun",
    "freefireguest"
  ],
  "category": "tools",
  "desc": "Buat akun guest Free Fire otomatis",
  "usage": ".ffguest <jumlah>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 30,
  "energi": 3,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
