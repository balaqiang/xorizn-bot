// Fitur nsfw/randomhentai — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("nsfw/randomhentai", {
  "name": "randomhentai",
  "command": [
    "randomhentai",
    "rhentai",
    "hentairandom"
  ],
  "category": "nsfw",
  "desc": "Random Hentai Video/Image from Vreden API",
  "usage": ".randomhentai",
  "owner": false,
  "group": false,
  "private": false,
  "premium": true,
  "cooldown": 10,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
