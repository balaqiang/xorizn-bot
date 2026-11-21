// Fitur search/searchgd — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("search/searchgd", {
  "name": "searchgd",
  "command": [
    "searchgd",
    "carigd",
    "gdsearch",
    "searchlevel"
  ],
  "category": "search",
  "desc": "Cari level Geometry Dash berdasarkan nama",
  "usage": ".searchgd <nama level>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
