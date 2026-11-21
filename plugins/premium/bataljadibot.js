// Fitur premium/bataljadibot — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("premium/bataljadibot", {
  "name": "bataljadibot",
  "command": [
    "bataljadibot",
    "canceljadibot",
    "stopjadibotstart"
  ],
  "category": "Premium",
  "desc": "Batalkan proses jadibot yang sedang dimulai",
  "usage": ".bataljadibot",
  "owner": false,
  "group": false,
  "private": false,
  "premium": true,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
