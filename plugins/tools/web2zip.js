// Fitur tools/web2zip — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/web2zip", {
  "name": "web2zip",
  "command": [
    "web2zip",
    "saveweb2zip"
  ],
  "category": "tools",
  "desc": "Salin website menjadi file ZIP",
  "usage": ".web2zip <url>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 30,
  "energi": 3,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
