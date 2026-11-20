// Fitur owner/setcontext — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/setcontext", {
  "name": "setcontext",
  "command": [
    "setcontext",
    "contextvariant",
    "contextstyle"
  ],
  "category": "owner",
  "desc": "Mengatur variant context tampilan pesan game/rpg bot",
  "usage": ".setcontext <v1/v2/v3>",
  "owner": true,
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
