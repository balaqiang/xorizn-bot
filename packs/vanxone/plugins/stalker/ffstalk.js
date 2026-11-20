// Fitur stalker/ffstalk — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("stalker/ffstalk", {
  "name": "ffstalk",
  "command": [
    "ffstalk",
    "freefireid",
    "stalkff",
    "ff"
  ],
  "category": "stalker",
  "desc": "Melihat informasi lengkap akun Free Fire berdasarkan ID.",
  "usage": ".ffstalk <id>",
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
