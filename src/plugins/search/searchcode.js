// Fitur search/searchcode — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("search/searchcode", {
  "name": "searchcode",
  "command": [
    "searchcode"
  ],
  "category": "search",
  "desc": "",
  "usage": "",
  "owner": false,
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
