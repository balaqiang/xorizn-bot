// Fitur group/setantilinkkick — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("group/setantilinkkick", {
  "name": "setantilinkkick",
  "command": [
    "setantilinkkick",
    "setalkick",
    "setlinkkick",
    "setantlinkkick"
  ],
  "category": "group",
  "desc": "Mengubah batas peringatan AntiLinkKick",
  "usage": ".setantilinkkick <1-20>",
  "owner": false,
  "group": true,
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
