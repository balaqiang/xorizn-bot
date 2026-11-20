// Fitur panel/jedacreate — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("panel/jedacreate", {
  "name": "jedacreate",
  "command": [
    "jedacreate",
    "setjeda",
    "paneljeda",
    "jedapanel"
  ],
  "category": "panel",
  "desc": "Set jeda waktu untuk semua panel create command",
  "usage": ".jedacreate <waktu>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
