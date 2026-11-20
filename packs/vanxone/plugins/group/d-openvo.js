// Fitur group/d-openvo — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/openvo", {
  "name": "openvo",
  "command": [
    "openvo"
  ],
  "category": "group",
  "desc": "Membuka pesan 1x lihat yang di-reply",
  "usage": ".rvo (reply pesan 1x lihat)",
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
