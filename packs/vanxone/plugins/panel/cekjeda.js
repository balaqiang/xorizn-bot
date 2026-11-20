// Fitur panel/cekjeda — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("panel/cekjeda", {
  "name": "cekjeda",
  "command": [
    "cekjeda",
    "jedastatus",
    "statusjeda"
  ],
  "category": "panel",
  "desc": "Cek status jeda panel create",
  "usage": ".cekjeda",
  "owner": false,
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
