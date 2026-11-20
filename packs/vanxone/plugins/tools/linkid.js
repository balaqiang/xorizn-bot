// Fitur tools/linkid — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/linkid", {
  "name": "linkid",
  "command": [
    "linkid",
    "idlink",
    "getidlink"
  ],
  "category": "tools",
  "desc": "Ambil ID WhatsApp dari link channel atau grup",
  "usage": ".linkid <link channel/grup>",
  "owner": false,
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
