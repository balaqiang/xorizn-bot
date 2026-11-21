// Fitur owner/savedb — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/savedb", {
  "name": "savedb",
  "command": [
    "savedb",
    "backupdb",
    "downloaddb"
  ],
  "category": "owner",
  "desc": "Download file database",
  "usage": ".savedb",
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
