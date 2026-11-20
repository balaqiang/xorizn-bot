// Fitur religi/taubat — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("religi/taubat", {
  "name": "taubat",
  "command": [
    "taubat",
    "taubatnasuha",
    "taubat-nasuha",
    "doataubat"
  ],
  "category": "islam",
  "desc": "Panduan taubat nasuha lengkap dengan doa, latin, arti, dan tata caranya",
  "usage": ".taubat",
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
