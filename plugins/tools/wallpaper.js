// Fitur internet/wallpaper — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("internet/wallpaper", {
  "name": "wallcraft",
  "command": [
    "wallcraft",
    "wallcraftsearch",
    "walcraft",
    "wallpaperscraft"
  ],
  "category": "tools",
  "desc": "Mencari dan mengunduh wallpaper HD dari Wallcraft",
  "usage": ".wallcraft <query>",
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
