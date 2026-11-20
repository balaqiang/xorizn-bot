// Fitur ephoto/ephoto — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("ephoto/ephoto", {
  "name": "ephoto",
  "command": [
    "ephoto"
  ],
  "category": "maker",
  "desc": "Buat efek text keren dengan berbagai style",
  "usage": ".<effect> <text>",
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
