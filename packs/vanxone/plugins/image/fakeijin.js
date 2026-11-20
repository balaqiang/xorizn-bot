// Fitur canvas/fakeijin — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("canvas/fakeijin", {
  "name": "fakeijin",
  "command": [
    "fakeijin",
    "ijinfake",
    "suratijin",
    "fakeizin"
  ],
  "category": "image",
  "desc": "Bikin fake surat ijin (buat konten/gaguan doang)",
  "usage": ".fakeijin <nama> | <alasan>",
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
