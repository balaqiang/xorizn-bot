// Fitur tools/mcstalk — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/mcstalk", {
  "name": "mcstalk",
  "command": [
    "mcstalk",
    "minecraftstalk",
    "stalkmc",
    "mcprofile"
  ],
  "category": "tools",
  "desc": "Stalk data profil / skin player Minecraft berdasarkan username",
  "usage": ".mcstalk <username>",
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
