// Fitur group/kick-all-member — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("group/kick-all-member", {
  "name": "kickall",
  "command": [
    "kickall",
    "kicksemua",
    "cleargrup"
  ],
  "category": "group",
  "desc": "Kick semua member (non-admin)",
  "usage": ".kickall member",
  "owner": false,
  "group": true,
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
