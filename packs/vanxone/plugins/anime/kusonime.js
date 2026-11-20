// Fitur anime/kusonime — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("anime/kusonime", {
  "name": "kusonime",
  "command": [
    "kusonime",
    "animeku",
    "nimeku",
    "animebatch"
  ],
  "category": "anime",
  "desc": "Cari anime dari kusonime.com (batch download)",
  "usage": ".kusonime <search|latest|genre>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 8,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
