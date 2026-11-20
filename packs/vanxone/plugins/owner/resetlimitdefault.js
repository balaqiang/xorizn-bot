// Fitur owner/resetlimitdefault — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/resetlimitdefault", {
  "name": "resetlimitdefault",
  "command": [
    "resetlimitdefault",
    "defaultlimitreset"
  ],
  "category": "owner",
  "desc": "Reset default limit ke config asli",
  "usage": ".resetlimitdefault",
  "owner": true,
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
