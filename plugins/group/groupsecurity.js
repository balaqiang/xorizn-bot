// Fitur group/groupsecurity — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("group/groupsecurity", {
  "name": "groupsecurity",
  "command": [
    "groupsecurity",
    "grupsecurity",
    "groupsec",
    "grupsec",
    "securitygrup"
  ],
  "category": "group",
  "desc": "Preset keamanan grup ketat untuk berbagai proteksi Rimuru",
  "usage": ".groupsecurity <on/off/status>",
  "owner": false,
  "group": true,
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
