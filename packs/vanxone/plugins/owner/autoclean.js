// Fitur owner/autoclean — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/autoclean", {
  "name": "autoclean",
  "command": [
    "autoclean",
    "autoclear",
    "cleanstore",
    "hapusstore"
  ],
  "category": "owner",
  "desc": "Auto hapus file baileys_store.json jika ukuran > 50MB (bisa on/off)",
  "usage": ".autoclean [on/off/status]",
  "owner": true,
  "group": false,
  "private": true,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
