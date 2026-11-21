// Fitur owner/addpremall — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/addpremall", {
  "name": "addpremall",
  "command": [
    "addpremall",
    "addpremiumall",
    "setpremall"
  ],
  "category": "owner",
  "desc": "Menambahkan semua member grup ke premium",
  "usage": ".addprem all",
  "owner": true,
  "group": true,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
