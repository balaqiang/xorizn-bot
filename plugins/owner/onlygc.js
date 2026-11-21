// Fitur owner/onlygc — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/onlygc", {
  "name": "onlygc",
  "command": [
    "onlygc",
    "onlygroup",
    "grouponly"
  ],
  "category": "owner",
  "desc": "Toggle mode bot hanya di grup",
  "usage": ".onlygc on/off",
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
