// Fitur owner/hapusdata — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/hapusdata", {
  "name": "hapusdata",
  "command": [
    "hapusdata",
    "resetdata",
    "cleardata",
    "wipedata"
  ],
  "category": "owner",
  "desc": "Reset semua data database ke default",
  "usage": ".hapusdata",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 30,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
