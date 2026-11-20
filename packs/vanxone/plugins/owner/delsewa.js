// Fitur owner/delsewa — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/delsewa", {
  "name": "delsewa",
  "command": [
    "sewadel",
    "hapussewa",
    "removesewa"
  ],
  "category": "owner",
  "desc": "Hapus grup dari whitelist sewa",
  "usage": ".delsewa <link/id grup>",
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
