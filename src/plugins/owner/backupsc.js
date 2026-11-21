// Fitur owner/backupsc — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/backupsc", {
  "name": "backupsc",
  "command": [
    "backupscript",
    "backupsource"
  ],
  "category": "owner",
  "desc": "Backup script bot dalam bentuk zip",
  "usage": ".backupsc",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 60,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
