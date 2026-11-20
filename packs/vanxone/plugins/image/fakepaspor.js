// Fitur canvas/fakepaspor — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("canvas/fakepaspor", {
  "name": "fakepaspor",
  "command": [
    "fakepaspor",
    "pasporfake",
    "fakepassport"
  ],
  "category": "image",
  "desc": "Bikin fake paspor (buat konten/gaguan doang)",
  "usage": ".fakepaspor <nama> | <umur> | <negara>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 8,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
