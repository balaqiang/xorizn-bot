// Fitur owner/q — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/q", {
  "name": "q",
  "command": [
    "quoted",
    "inspect"
  ],
  "category": "tools",
  "desc": "Ambil JSON message dari pesan yang direply",
  "usage": ".q (reply pesan)",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
