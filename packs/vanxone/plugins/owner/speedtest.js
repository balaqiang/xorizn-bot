// Fitur owner/speedtest — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/speedtest", {
  "name": "speedtest",
  "command": [
    "speedtest",
    "spt",
    "testspeed"
  ],
  "category": "owner",
  "desc": "Test kecepatan upload egress server (tanpa lewat WA)",
  "usage": ".speedtest",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
