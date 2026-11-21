// Fitur search/gdleaderboard — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("search/gdleaderboard", {
  "name": "gdleaderboard",
  "command": [
    "gdleaderboard",
    "gdlb",
    "gdtop",
    "gdstars",
    "gddemons",
    "gdmoons",
    "gddiamonds",
    "gdcreators",
    "gdcoins"
  ],
  "category": "search",
  "desc": "💖 Leaderboard Geometry Dash style xorizn-bot (ID Version)",
  "usage": ".gdleaderboard [kategori] [jumlah]",
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
