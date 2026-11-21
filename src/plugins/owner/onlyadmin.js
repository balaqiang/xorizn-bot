// Fitur owner/onlyadmin — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/onlyadmin", {
  "name": "onlyadmin",
  "command": [
    "onlyadmin",
    "selfadmin",
    "publicadmin"
  ],
  "category": "owner",
  "desc": "Hanya admin grup yang bisa akses command bot",
  "usage": ".onlyadmin on/off",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
