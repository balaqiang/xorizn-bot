// Fitur stalker/o-wastalk — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("stalker/wastalk", {
  "name": "wastalk",
  "command": [
    "wastalk",
    "whatsappstalk",
    "stalkwa"
  ],
  "category": "stalker",
  "desc": "Stalk profile WhatsApp",
  "usage": ".wastalk <nomor/tag>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
