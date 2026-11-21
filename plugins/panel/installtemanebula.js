// Fitur panel/installtemanebula — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("panel/installtemanebula", {
  "name": "installtemanebula",
  "command": [
    "installtemanebula",
    "installthemanebula",
    "temanebula",
    "nebulatheme"
  ],
  "category": "panel",
  "desc": "Install tema Nebula (AtasBawahCantik) untuk panel Pterodactyl via SSH",
  "usage": ".installtemanebula <ip>|<password>",
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
