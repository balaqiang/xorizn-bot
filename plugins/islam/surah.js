// Fitur religi/surah — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("religi/surah", {
  "name": "surah2",
  "command": [
    "surah2"
  ],
  "category": "islam",
  "desc": "Pencarian surah lengkap dengan Arab, bacaan, dan arti.",
  "usage": ".surah2 <nama/nomor>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
