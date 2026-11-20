// Fitur fun/artinama2 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("fun/artinama2", {
  "name": "artinama2",
  "command": [
    "artinama2"
  ],
  "category": "fun",
  "desc": "Mencari arti sebuah nama (implementasi Tensura).",
  "usage": ".artinama2 <nama>",
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
