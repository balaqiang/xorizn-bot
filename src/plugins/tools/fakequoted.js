// Fitur tools/fakequoted — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("tools/fakequoted", {
  "name": "fakeall",
  "command": [
    "fakeall",
    "fakequoted",
    "fakes"
  ],
  "category": "tools",
  "desc": "Demo fakequoted lengkap (working)",
  "usage": ".fakeall",
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
