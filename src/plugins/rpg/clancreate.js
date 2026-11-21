// Fitur clan/clancreate — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("clan/clancreate", {
  "name": "clancreate",
  "command": [
    "clancreate",
    "createclan",
    "guildcreate"
  ],
  "category": "rpg",
  "desc": "Buat clan baru",
  "usage": ".clancreate <nama>",
  "owner": false,
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
