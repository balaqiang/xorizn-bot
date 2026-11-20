// Fitur rpg/parkir — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/parkir", {
  "name": "parkir",
  "command": [
    "parkir",
    "kangparkir",
    "markir"
  ],
  "category": "rpg",
  "desc": "Jadi tukang parkir minimarket, waspada satpol PP!",
  "usage": ".parkir",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 120,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
