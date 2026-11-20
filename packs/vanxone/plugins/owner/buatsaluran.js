// Fitur owner/buatsaluran — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/buatsaluran", {
  "name": "buatsaluran",
  "command": [
    "buatsaluran",
    "createsaluran",
    "createnewsletter"
  ],
  "category": "owner",
  "desc": "Buat saluran/newsletter baru",
  "usage": ".buatsaluran <nama>|<deskripsi>",
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
