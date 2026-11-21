// Fitur panel/installtemastellar — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("panel/installtemastellar", {
  "name": "installtemastellar",
  "command": [
    "installtemastellar",
    "installthemastellar",
    "temastellar"
  ],
  "category": "panel",
  "desc": "Install tema Stellar untuk panel Pterodactyl via SSH",
  "usage": ".installtemastellar <ip>|<password>",
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
