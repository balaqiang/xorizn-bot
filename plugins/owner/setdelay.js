// Fitur owner/setdelay — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/setdelay", {
  "name": "setdelay",
  "command": [
    "setdelay",
    "delay",
    "setdelaybot",
    "botdelay"
  ],
  "category": "owner",
  "desc": "Mengatur delay respon bot (cooldown global)",
  "usage": ".setdelay <detik>",
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
