// Fitur owner/autoreadsw — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/autoreadsw", {
  "name": "autoreadsw",
  "command": [
    "autoreadsw",
    "autoreadstory",
    "readstory",
    "bacasw"
  ],
  "category": "owner",
  "desc": "Auto read semua status/story WA",
  "usage": ".autoreadsw on/off",
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
