// Fitur owner/gantiidsaluran — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/gantiidsaluran", {
  "name": "gantiidsaluran",
  "command": [
    "gantiidsaluran",
    "setidsaluran"
  ],
  "category": "owner",
  "desc": "Mengganti semua ID saluran di SC",
  "usage": ".gantiidsaluran|id",
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
