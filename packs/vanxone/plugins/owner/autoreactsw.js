// Fitur owner/autoreactsw — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/autoreactsw", {
  "name": "autoreactsw",
  "command": [
    "autoreactsw",
    "autoreaksi",
    "reactsw",
    "autoreactstory"
  ],
  "category": "owner",
  "desc": "Auto react semua status/story WA",
  "usage": ".autoreactsw on/off [emoji]",
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
