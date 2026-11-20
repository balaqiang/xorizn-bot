// Fitur group/selfthisgc — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/selfthisgc", {
  "name": "selfthisgc",
  "command": [
    "selfthisgc",
    "selfgc",
    "selfgroup",
    "selfthisgroup"
  ],
  "category": "group",
  "desc": "Aktifkan mode self hanya di grup ini",
  "usage": ".selfthisgc",
  "owner": true,
  "group": true,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
