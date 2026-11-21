// Fitur panel/installtemabilling — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("panel/installtemabilling", {
  "name": "installtemabilling",
  "command": [
    "installtemabilling",
    "installthemabilling",
    "temabilling"
  ],
  "category": "panel",
  "desc": "Install tema Billing untuk panel Pterodactyl via SSH",
  "usage": ".installtemabilling <ip>|<password>",
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
