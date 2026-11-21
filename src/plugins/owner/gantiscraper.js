// Fitur owner/gantiscraper — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/gantiscraper", {
  "name": "gantiscraper",
  "command": [
    "gantiscraper",
    "replacescraper",
    "updatescraper",
    "gantiscrape"
  ],
  "category": "owner",
  "desc": "Ganti code scraper yang sudah ada di src/scraper",
  "usage": ".gantiscraper [namafile]",
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
