// Fitur owner/autogreet2 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/autogreet2", {
  "name": "autosiang",
  "command": [
    "autosiang",
    "autosore",
    "greetsiang",
    "greetsore"
  ],
  "category": "owner",
  "desc": "Auto kirim ucapan selamat siang & sore ke Channel",
  "usage": ".autogreet2 on/off/status/test/setch <1/2/3>",
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
