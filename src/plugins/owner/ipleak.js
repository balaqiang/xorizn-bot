// Fitur owner/ipleak — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ipleak", {
  "name": "ipleak",
  "command": [
    "ipleak",
    "myleak"
  ],
  "category": "owner",
  "desc": "Tampilkan informasi IP via Nixel",
  "usage": ".ipleak | .ipleak ip <IP>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
