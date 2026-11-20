// Fitur tools/fakecam — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/fakecam", {
  "name": "fakecam",
  "command": [
    "fakecam",
    "paplive",
    "fakekamera",
    "iphonecam"
  ],
  "category": "tools",
  "desc": "Menimpa UI Kamera iOS iPhone Klasik Presisi",
  "usage": ".fakecam (reply/kirim foto)",
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
