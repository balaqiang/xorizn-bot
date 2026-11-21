// Fitur tools/o-readmore — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/readmore", {
  "name": "readmore",
  "command": [
    "readmore",
    "selengkapnya",
    "spoiler"
  ],
  "category": "tools",
  "desc": "Membuat teks baca selengkapnya (spoiler)",
  "usage": ".readmore <text_awal>|<text_akhir>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
