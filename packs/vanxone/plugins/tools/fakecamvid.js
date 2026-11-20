// Fitur tools/fakecamvid — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/fakecamvid", {
  "name": "fakecamvid",
  "command": [
    "fakecamvid",
    "paplivevid",
    "vcam"
  ],
  "category": "tools",
  "desc": "Menimpa UI Kamera iOS iPhone di atas Video (Size Presisi + Ultra HD)",
  "usage": ".fakecamvid [reply/kirim video/dokumen]",
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
