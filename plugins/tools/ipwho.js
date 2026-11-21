// Fitur tools/ipwho — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/ipwho", {
  "name": "ipwho",
  "command": [
    "ipwho",
    "ip",
    "iplookup",
    "ipinfo"
  ],
  "category": "tools",
  "desc": "Lookup informasi IP address",
  "usage": ".ipwho <ip>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
