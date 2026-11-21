// Fitur owner/autogreet — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/autogreet", {
  "name": "autopagi",
  "command": [
    "autopagi",
    "automalam",
    "greet",
    "automsg",
    "pagemalam"
  ],
  "category": "owner",
  "desc": "Auto kirim ucapan selamat pagi & malam ke Channel",
  "usage": ".autogreet on/off/status/test",
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
