// Fitur group/checksewa — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/checksewa", {
  "name": "checksewa",
  "command": [
    "checksewa",
    "sisasewa"
  ],
  "category": "group",
  "desc": "Cek sisa waktu sewa bot di grup ini",
  "usage": ".checksewa",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
