// Fitur owner/custompayment — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/custompayment", {
  "name": "custompayment",
  "command": [
    "custompayment",
    "setpayment",
    "setpaytext"
  ],
  "category": "owner",
  "desc": "Atur teks custom untuk .payment dengan placeholder",
  "usage": ".custompayment <teks> / .custompayment reset",
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
