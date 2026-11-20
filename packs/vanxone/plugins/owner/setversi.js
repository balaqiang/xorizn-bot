// Fitur owner/setversi — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/setversi", {
  "name": "setversi",
  "command": [
    "setversi",
    "setversion",
    "gantiversi",
    "updateversion"
  ],
  "category": "owner",
  "desc": "Update versi bot di config.js",
  "usage": ".setversi <versi_baru>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
