// Fitur owner/get — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/get", {
  "name": "get",
  "command": [
    "fetch",
    "http",
    "request",
    "curl"
  ],
  "category": "owner",
  "desc": "Advanced HTTP request tool (Owner Only)",
  "usage": ".get <url> [options]",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
