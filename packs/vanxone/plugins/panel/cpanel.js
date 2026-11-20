// Fitur panel/cpanel — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("panel/cpanel", {
  "name": "cpanel",
  "command": [
    "cpanel",
    "panelmenu",
    "menupanel"
  ],
  "category": "panel",
  "desc": "Menu panel pterodactyl (v1-v5)",
  "usage": ".cpanel",
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
