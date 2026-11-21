// Fitur tools/cekidch — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/cekidch", {
  "name": "cekidch",
  "command": [
    "channelid",
    "channelinfo"
  ],
  "category": "tools",
  "desc": "Cek ID dan info lengkap channel dari link",
  "usage": ".cekidch <link channel>",
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
