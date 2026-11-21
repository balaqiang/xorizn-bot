// Fitur owner/renewsewa — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/renewsewa", {
  "name": "renewsewa",
  "command": [
    "renewsewa"
  ],
  "category": "owner",
  "desc": "Perpanjang durasi sewa grup",
  "usage": ".renewsewa <link/id grup> <durasi>",
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
