// Fitur canvas/faketiket — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("canvas/faketiket", {
  "name": "faketiket",
  "command": [
    "faketiket",
    "tiketfake",
    "faketicket",
    "fakepesawat"
  ],
  "category": "image",
  "desc": "Bikin fake tiket pesawat (buat konten/gaguan doang)",
  "usage": ".faketiket <dari> | <tujuan> | <nama>",
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
