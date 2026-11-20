// Fitur maker/carbonlocal — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("maker/carbonlocal", {
  "name": "carbonlocal",
  "command": [
    "carbonlocal",
    "carbonlv",
    "carboncanvas",
    "carbonsnap"
  ],
  "category": "maker",
  "desc": "Bikin screenshot kode aesthetic seperti Carbon.now.sh (via Canvas lokal)",
  "usage": ".carbonlocal <kode> (atau reply pesan)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 8,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
