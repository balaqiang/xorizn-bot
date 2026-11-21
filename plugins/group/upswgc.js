// Fitur group/upswgc — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("group/upswgc", {
  "name": "upswgc",
  "command": [
    "swgcadmin",
    "grupstory"
  ],
  "category": "group",
  "desc": "Post Story Group (border hijau) khusus untuk Admin di grup ini",
  "usage": ".upswgc <teks> atau reply media",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
