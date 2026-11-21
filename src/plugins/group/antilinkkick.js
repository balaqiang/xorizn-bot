// Fitur group/antilinkkick — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("group/antilinkkick", {
  "name": "antilinkkick",
  "command": [
    "antilinkkick",
    "alkick",
    "antilinkwarn",
    "linkkick"
  ],
  "category": "group",
  "desc": "Hapus link, beri peringatan, lalu kick saat batas tercapai",
  "usage": ".antilinkkick <on/off/status/reset>",
  "owner": false,
  "group": true,
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
