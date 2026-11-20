// Fitur search/pixiv — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("search/pixiv", {
  "name": "pixiv",
  "command": [
    "pixiv",
    "pixivsearch",
    "caripixiv"
  ],
  "category": "search",
  "desc": "Cari artwork di Pixiv",
  "usage": ".pixiv <query>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 2,
  "needs": {
    "apikeys": [
      "neoxr"
    ],
    "scrapers": [],
    "assets": []
  }
})
