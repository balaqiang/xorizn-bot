// Fitur tools/amsend — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/amsend", {
  "name": "amsend",
  "command": [
    "amsend",
    "sendam",
    "amremlink"
  ],
  "category": "tools",
  "desc": "Alias: kirim link AM (pakai .amprem)",
  "usage": ".amsend <email>  (redirect ke alur .amprem)",
  "owner": false,
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
