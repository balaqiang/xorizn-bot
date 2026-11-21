// Fitur owner/hapususer — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/hapususer", {
  "name": "hapususer",
  "command": [
    "hapususer",
    "deluser",
    "deleteuser"
  ],
  "category": "owner",
  "desc": "Hapus user dari database",
  "usage": ".hapususer",
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
