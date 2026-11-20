// Fitur canvas/fakesp — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("canvas/fakesp", {
  "name": "fakesp",
  "command": [
    "fakesp",
    "spfake",
    "suratpanggilan",
    "fakesuratpanggil"
  ],
  "category": "image",
  "desc": "Bikin fake surat panggilan (buat konten/gaguan doang)",
  "usage": ".fakesp <nama> | <instansi>",
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
