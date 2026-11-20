// Fitur tools/upch2 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/upch2", {
  "name": "upch2",
  "command": [
    "upch2",
    "setchid2",
    "addchid2",
    "getchid2"
  ],
  "category": "tools",
  "desc": "Varian broadcast ke channel dari Tensura.",
  "usage": ".upch2 <teks>",
  "owner": true,
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
