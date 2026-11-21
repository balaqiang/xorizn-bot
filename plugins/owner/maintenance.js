// Fitur owner/maintenance — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/maintenance", {
  "name": "maintenance",
  "command": [
    "maintenance",
    "matiin",
    "nyalain",
    "setmaintenance",
    "cekstatus"
  ],
  "category": "owner",
  "desc": "Mode maintenance — bot hanya respon owner, user lain dapat pesan custom",
  "usage": ".maintenance on/off [pesan] | .cekstatus",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
