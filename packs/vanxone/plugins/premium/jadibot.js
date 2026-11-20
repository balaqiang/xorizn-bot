// Fitur premium/jadibot — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("premium/jadibot", {
  "name": "jadibot",
  "command": [
    "jadibot",
    "jbot",
    "rentbot"
  ],
  "category": "premium",
  "desc": "Jadikan nomor kamu sebagai bot sementara",
  "usage": ".jadibot",
  "owner": false,
  "group": false,
  "private": false,
  "premium": true,
  "cooldown": 30,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
