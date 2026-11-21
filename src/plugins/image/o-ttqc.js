// Fitur canvas/o-ttqc — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/ttqc", {
  "name": "ttqc",
  "command": [
    "ttqc",
    "tiktokquote",
    "ttq"
  ],
  "category": "image",
  "desc": "Buat fake quote chat ala TikTok",
  "usage": ".ttqc <teks> (atau reply teks)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
