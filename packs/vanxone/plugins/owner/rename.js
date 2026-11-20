// Fitur owner/rename — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/rename", {
  "name": "rename",
  "command": [
    "renamesc",
    "gantinama"
  ],
  "category": "owner",
  "desc": "Ganti nama/teks tertentu di seluruh SC termasuk nama file",
  "usage": ".rename <teks lama>|<teks baru>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
