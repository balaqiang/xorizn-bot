// Fitur owner/hapussaluran — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/hapussaluran", {
  "name": "hapussaluran",
  "command": [
    "hapussaluran",
    "deletesaluran",
    "deletenewsletter"
  ],
  "category": "owner",
  "desc": "Hapus saluran/newsletter",
  "usage": ".hapussaluran <id_saluran>",
  "owner": true,
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
