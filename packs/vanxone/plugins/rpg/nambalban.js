// Fitur rpg/nambalban — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/nambalban", {
  "name": "nambalban",
  "command": [
    "nambalban",
    "tambal",
    "bengkel"
  ],
  "category": "rpg",
  "desc": "Buka jasa tambal ban, awas ban meledak!",
  "usage": ".nambalban",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 150,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
