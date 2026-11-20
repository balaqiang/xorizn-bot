// Fitur panel/installtemaenigma — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("panel/installtemaenigma", {
  "name": "installtemaenigma",
  "command": [
    "installtemaenigma",
    "installthemaenigma",
    "temaenigma"
  ],
  "category": "panel",
  "desc": "Install tema Enigma untuk panel Pterodactyl via SSH",
  "usage": ".installtemaenigma <ip>|<password>|<link_wa>|<link_group>|<link_channel>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 60,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
