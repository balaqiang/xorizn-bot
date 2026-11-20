// Fitur owner/stop — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/stop", {
  "name": "stop",
  "command": [
    "stop",
    "shutdown",
    "kill"
  ],
  "category": "owner",
  "desc": "Stop bot process",
  "usage": ".stop",
  "owner": true,
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
