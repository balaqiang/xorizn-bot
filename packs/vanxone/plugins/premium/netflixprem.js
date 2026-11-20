// Fitur premium/netflixprem — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("premium/netflixprem", {
  "name": "netflixprem",
  "command": [
    "netflixprem",
    "nfprem",
    "netflixpremium"
  ],
  "category": "premium",
  "desc": "Netflix premium token generator",
  "usage": ".netflixprem <jumlah>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": true,
  "cooldown": 5,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
