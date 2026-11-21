// Fitur owner/autogreetvid — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/autogreetvid", {
  "name": "autovidpagi",
  "command": [
    "autovidpagi",
    "autovidmalam",
    "greetvid"
  ],
  "category": "owner",
  "desc": "Auto kirim video ucapan selamat pagi & malam ke Channel",
  "usage": ".autogreetvid on/off/status/test/setch <1/2/3>",
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
