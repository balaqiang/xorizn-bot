// Fitur tools/lonjong — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("tools/lonjong", {
  "name": "lonjong",
  "command": [
    "lonjong",
    "stretch",
    "melar"
  ],
  "category": "tools",
  "desc": "✨ Ai akan mengubah gambarmu jadi tinggi elegan~",
  "usage": ".lonjong (reply gambar)",
  "owner": false,
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
