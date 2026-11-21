// Fitur group/cekononlyadmin — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("group/cekononlyadmin", {
  "name": "cekonlyadmin",
  "command": [
    "cekonlyadmin",
    "onlyadminstatus",
    "statusadminonly"
  ],
  "category": "group",
  "desc": "Cek status mode onlyadmin di grup",
  "usage": ".cekonlyadmin",
  "owner": false,
  "group": true,
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
