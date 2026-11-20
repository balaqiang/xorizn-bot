// Fitur owner/sistemenergi — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/sistemenergi", {
  "name": "sistemenergi",
  "command": [
    "sistemenergi",
    "sistemlimit",
    "energimode",
    "limitmode"
  ],
  "category": "owner",
  "desc": "Mengecek, menghidupkan, atau mematikan sistem energi secara global",
  "usage": ".sistemenergi [on / off]",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
