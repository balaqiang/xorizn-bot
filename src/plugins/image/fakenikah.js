// Fitur canvas/fakenikah — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("canvas/fakenikah", {
  "name": "fakenikah",
  "command": [
    "fakenikah",
    "nikahfake",
    "fakemarriage"
  ],
  "category": "image",
  "desc": "Bikin fake sertifikat nikah (buat konten/gaguan doang)",
  "usage": ".fakenikah <nama1> | <nama2>",
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
