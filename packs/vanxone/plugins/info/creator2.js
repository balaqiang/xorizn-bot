// Fitur main/creator2 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("main/creator2", {
  "name": "creator2",
  "command": [
    "creator2",
    "owner2"
  ],
  "category": "info",
  "desc": "Varian kontak owner dari Tensura.",
  "usage": ".creator2",
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
