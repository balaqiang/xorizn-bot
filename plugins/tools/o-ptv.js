// Fitur tools/o-ptv — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/ptv", {
  "name": "ptv",
  "command": [
    "ptv",
    "pvideo",
    "circlevideo"
  ],
  "category": "tools",
  "desc": "Kirim video sebagai PTV (circle video)",
  "usage": ".ptv (reply video)",
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
