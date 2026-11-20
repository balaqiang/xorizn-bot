// Fitur owner/addscraper — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/addscraper", {
  "name": "addscraper",
  "command": [
    "addscraper",
    "newscraper",
    "createscraper",
    "tambahscraper"
  ],
  "category": "owner",
  "desc": "Menambahkan scraper baru ke src/scraper/ (Owner only)",
  "usage": ".addscraper <nama>",
  "owner": true,
  "group": false,
  "private": true,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
