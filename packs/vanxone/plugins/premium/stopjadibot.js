// Fitur premium/stopjadibot — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("premium/stopjadibot", {
  "name": "stopjadibot",
  "command": [
    "stopjadibot",
    "stopjbot",
    "endjadibot"
  ],
  "category": "premium",
  "desc": "Hentikan jadibot kamu",
  "usage": ".stopjadibot",
  "owner": false,
  "group": false,
  "private": false,
  "premium": true,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
