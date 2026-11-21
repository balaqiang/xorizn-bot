// Fitur canvas/fakeatm — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("canvas/fakeatm", {
  "name": "fakeatm",
  "command": [
    "fakeatm",
    "atmfake",
    "kartuatm",
    "fakecardatm"
  ],
  "category": "image",
  "desc": "Bikin fake kartu ATM (buat konten/gaguan doang)",
  "usage": ".fakeatm <nama> | <bank>",
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
