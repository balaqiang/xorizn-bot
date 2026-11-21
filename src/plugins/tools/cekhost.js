// Fitur tools/cekhost — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/cekhost", {
  "name": "checkhost",
  "command": [
    "checkhost",
    "cekhost",
    "check"
  ],
  "category": "tools",
  "desc": "",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
