// Fitur canvas/fakewa — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/fakewa", {
  "name": "fakewa",
  "command": [
    "fakewa"
  ],
  "category": "image",
  "desc": "Bikin profil WA palsu",
  "usage": ".fakewa <nama>|<nomor>|[status] (reply/kirim foto)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
