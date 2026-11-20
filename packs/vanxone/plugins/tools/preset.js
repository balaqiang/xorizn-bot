// Fitur tools/preset — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/preset", {
  "name": "preset",
  "command": [
    "preset",
    "prst"
  ],
  "category": "tools",
  "desc": "Generate teks preset auto copy 😈",
  "usage": ".preset linkVT|link916|link11|linkXML",
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
