// Fitur owner/welcomeall — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/welcomeall", {
  "name": "welcomeall",
  "command": [
    "welcomeall",
    "wcall",
    "globalwelcome"
  ],
  "category": "owner",
  "desc": "Aktifkan/nonaktifkan welcome di semua grup",
  "usage": ".welcomeall <on/off>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
