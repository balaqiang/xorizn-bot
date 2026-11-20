// Fitur tools/converter — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/converter", {
  "name": "converter",
  "command": [
    "converter"
  ],
  "category": "tools",
  "desc": "Convert file ke format lain",
  "usage": ".converter <format> (reply file)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": true,
  "admin": false,
  "botAdmin": false,
  "cooldown": 30,
  "energi": 3,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
