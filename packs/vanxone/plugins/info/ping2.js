// Fitur main/ping2 — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("main/ping2", {
  "name": "ping2",
  "command": [
    "ping2",
    "speed2",
    "p2",
    "latency2",
    "sys2",
    "status2"
  ],
  "category": "info",
  "desc": "Cek performa dan status sistem bot secara real-time",
  "usage": ".ping2",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
