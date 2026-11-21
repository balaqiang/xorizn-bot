// Fitur canvas/fakengl — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("canvas/fakengl", {
  "name": "fakengl",
  "command": [
    "fakengl",
    "fngl",
    "nglfake"
  ],
  "category": "image",
  "desc": "Membuat screenshot pesan NGL palsu (have fun only)",
  "usage": ".fakengl <teks>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
