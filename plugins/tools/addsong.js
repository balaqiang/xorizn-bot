// Fitur tools/addsong — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("tools/addsong", {
  "name": "addsong",
  "command": [
    "addsong",
    "imgtosong",
    "songtovideo",
    "photosong"
  ],
  "category": "tools",
  "desc": "Gabungkan gambar + audio menjadi video (gambar diam + lagu)",
  "usage": ".addsong (kirim gambar sambil reply audio)",
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
