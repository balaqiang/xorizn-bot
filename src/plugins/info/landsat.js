// Fitur info/landsat — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("info/landsat", {
  "name": "nasaname",
  "command": [
    "nasaname",
    "bumiku",
    "namasatelit"
  ],
  "category": "info",
  "desc": "Buat banner nama dengan gaya NASA Landsat",
  "usage": ".landsat <nama>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
