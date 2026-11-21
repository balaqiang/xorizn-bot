// Fitur maker/fakegroup — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("maker/fakegroup", {
  "name": "fakegroup",
  "command": [
    "fakegroup",
    "fgc"
  ],
  "category": "maker",
  "desc": "Membuat fake tampilan grup WhatsApp",
  "usage": ".fakegroup <url|title|member|time>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 3,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
