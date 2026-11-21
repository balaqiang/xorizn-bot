// Fitur maker/fakenote — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("maker/fakenote", {
  "name": "fakenote",
  "command": [
    "fakenote"
  ],
  "category": "maker",
  "desc": "Generate gambar Note speech bubble meme",
  "usage": ".fakenote name|pesan|avatar_url",
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
