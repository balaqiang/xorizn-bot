// Fitur group/groupadmin — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("group/groupadmin", {
  "name": "groupadmin",
  "command": [
    "groupadmin",
    "gadmin",
    "adminlock",
    "onlygroupadmin"
  ],
  "category": "group",
  "desc": "Batasi akses bot hanya untuk admin (per grup)",
  "usage": ".groupadmin on/off",
  "owner": false,
  "group": true,
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
