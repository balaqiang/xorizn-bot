// Fitur canvas/boardingpass — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("canvas/boardingpass", {
  "name": "boardingpass",
  "command": [
    "boardingpass",
    "nasapass",
    "boarding"
  ],
  "category": "image",
  "desc": "Membuat tiket NASA Boarding Pass kustom",
  "usage": ".boardingpass <nama>",
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
