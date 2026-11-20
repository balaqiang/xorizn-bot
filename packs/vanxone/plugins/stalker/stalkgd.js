// Fitur stalker/stalkgd — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("stalker/stalkgd", {
  "name": "stalkgd",
  "command": [
    "stalkgd",
    "gdstalk",
    "gdprofile"
  ],
  "category": "stalker",
  "desc": "Stalk profil player Geometry Dash",
  "usage": ".stalkgd <username>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
