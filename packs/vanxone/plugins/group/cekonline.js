// Fitur group/cekonline — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/cekonline", {
  "name": "cekonline",
  "command": [
    "cekonline",
    "checkonline",
    "online",
    "siapayangonline",
    "whosonline"
  ],
  "category": "group",
  "desc": "Cek member yang online di grup",
  "usage": ".cekonline",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 60,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
