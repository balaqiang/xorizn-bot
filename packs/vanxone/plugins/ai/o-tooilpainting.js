// Fitur ai/o-tooilpainting — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/tooilpainting", {
  "name": "tooilpainting",
  "command": [
    "tooilpainting",
    "oilpainting",
    "tooil",
    "oil"
  ],
  "category": "ai",
  "desc": "Ubah foto menjadi gaya lukisan minyak (oil painting)",
  "usage": ".tooilpainting (reply/kirim gambar)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": true,
  "admin": false,
  "botAdmin": false,
  "cooldown": 60,
  "energi": 3,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
