// Fitur search/bingimage — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("search/bingimage", {
  "name": "bingimage",
  "command": [
    "bingimage",
    "imagesearch",
    "carigambar",
    "bingimg"
  ],
  "category": "search",
  "desc": "Cari artwork di Pixiv",
  "usage": ".carigambar <query>",
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
