// Fitur fun/lifefact — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("fun/lifefact", {
  "name": "lifefact",
  "command": [
    "lifefact",
    "funfacthidup",
    "livefunfact"
  ],
  "category": "fun",
  "desc": "Fakta statistik kehidupan berdasarkan tanggal lahir",
  "usage": ".lifefact YYYY-MM-DD",
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
