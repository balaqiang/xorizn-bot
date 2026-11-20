// Fitur group/antivirtex — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("group/antivirtex", {
  "name": "antivirtex",
  "command": [
    "antivirtexgc",
    "antivtxt",
    "antitxtv"
  ],
  "category": "group",
  "desc": "Hapus otomatis pesan yang mengandung karakter aneh/virtex di grup",
  "usage": ".antivirtex on/off",
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
