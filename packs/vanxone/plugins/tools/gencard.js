// Fitur tools/gencard — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/gencard", {
  "name": "gencard",
  "command": [
    "gencard",
    "ccgen",
    "cardgen",
    "fakecc"
  ],
  "category": "tools",
  "desc": "Membuat data dummy nomor kartu kredit (Visa, MasterCard, JCB, Amex)",
  "usage": ".gencard Tipe | Jumlah",
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
