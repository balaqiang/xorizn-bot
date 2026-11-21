// Fitur canvas/fakekatubelajat — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("canvas/fakekatubelajat", {
  "name": "fakekartupelajar",
  "command": [
    "fakekartupelajar",
    "kartupelajarfake",
    "fakestudentid",
    "fakekps"
  ],
  "category": "image",
  "desc": "Bikin fake kartu pelajar (buat konten/gaguan doang)",
  "usage": ".fakekartupelajar <nama> | <sekolah>",
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
