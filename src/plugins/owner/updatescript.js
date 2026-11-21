// Fitur owner/updatescript — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/updatescript", {
  "name": "updatescript",
  "command": [
    "updatescript",
    "updatebot",
    "updatesc"
  ],
  "category": "owner",
  "desc": "Update script otomatis dari GitHub dengan backup data penting",
  "usage": ".updatescript",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 60,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
