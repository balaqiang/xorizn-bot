// Fitur maker/fakedownload — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("maker/fakedownload", {
  "name": "fakedownload",
  "command": [
    "fakedownload",
    "fakedl",
    "fdl",
    "belumdownload",
    "undownload"
  ],
  "category": "maker",
  "desc": "Membuat gambar terlihat seperti media yang belum ter-download di WhatsApp",
  "usage": ".fakedownload (reply gambar)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
