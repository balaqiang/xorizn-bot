// Fitur owner/dellalluser — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/dellalluser", {
  "name": "deluserall",
  "command": [
    "deluserall",
    "deletealluser",
    "hapussemua",
    "delalluser",
    "resetuser",
    "clearuser"
  ],
  "category": "owner",
  "desc": "Hapus SEMUA user dari database (LANGSUNG HAPUS)",
  "usage": ".deluserall",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
