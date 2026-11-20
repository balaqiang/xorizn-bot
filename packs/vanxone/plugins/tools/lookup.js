// Fitur tools/lookup — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/lookup", {
  "name": "lookup",
  "command": [
    "lookup",
    "dnslookup",
    "whois"
  ],
  "category": "tools",
  "desc": "DNS Lookup untuk domain",
  "usage": ".lookup <domain>",
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
