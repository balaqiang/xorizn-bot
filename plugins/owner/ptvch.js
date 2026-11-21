// Fitur owner/ptvch — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/ptvch", {
  "name": "ptvch",
  "command": [
    "ptvch",
    "ptvchanel",
    "ptvstory"
  ],
  "category": "owner",
  "desc": "Kirim video sebagai PTV ke channel",
  "usage": ".ptvch (reply video)",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
