// Fitur owner/antipm — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/antipm", {
  "name": "antipm",
  "command": [
    "antipm",
    "apm",
    "nopm"
  ],
  "category": "owner",
  "desc": "Anti PM - cuma nomor tertentu yang bisa chat ke bot (BLOKIR ASLI)",
  "usage": ".antipm <on/off/status>",
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
