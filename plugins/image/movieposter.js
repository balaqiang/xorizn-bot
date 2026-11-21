// Fitur canvas/movieposter — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("canvas/movieposter", {
  "name": "movieposter",
  "command": [
    "movieposter",
    "posterfilm",
    "movieposterelaina"
  ],
  "category": "image",
  "desc": "Buat poster film bergaya sinematik dari nama, genre, dan judul",
  "usage": ".movieposter nama|genre|judul|tagline",
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
