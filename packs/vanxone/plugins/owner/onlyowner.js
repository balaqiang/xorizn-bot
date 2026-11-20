// Fitur owner/onlyowner — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/onlyowner", {
  "name": "onlyowner",
  "command": [
    "onlyowner",
    "onlyownerbot",
    "modeowner",
    "owneronly"
  ],
  "category": "owner",
  "desc": "Atur mode hanya owner yang bisa pakai bot (owner utama + owner tambahan + creator)",
  "usage": ".onlyowner on/off",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
