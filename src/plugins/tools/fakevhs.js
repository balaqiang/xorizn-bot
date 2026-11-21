// Fitur tools/fakevhs — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/fakevhs", {
  "name": "fakevhs",
  "command": [
    "fakevhs",
    "vhscam",
    "retrovhs",
    "handycam"
  ],
  "category": "tools",
  "desc": "Mengubah Foto menjadi Efek Kamera Retro VHS 90-an (Ultra Real)",
  "usage": ".fakevhs [reply/kirim foto/dokumen foto/view once]",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
