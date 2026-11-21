// Fitur tools/izen — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/izen", {
  "name": "izen",
  "command": [
    "izen",
    "skiplink"
  ],
  "category": "tools",
  "desc": "Bypass shortlink / skiplink menggunakan izen",
  "usage": ".izen link",
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
