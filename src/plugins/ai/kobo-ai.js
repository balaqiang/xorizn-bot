// Fitur ai/kobo-ai — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/kobo-ai", {
  "name": "kobo-ai",
  "command": [
    "kobo-ai",
    "koboai",
    "kobo"
  ],
  "category": "ai",
  "desc": "Chat dengan Kobo Kanaeru — VTuber Hololive ID",
  "usage": ".kobo-ai <pertanyaan>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [
      "unlimitedai"
    ],
    "assets": []
  }
})
