// Fitur group/autoforward — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/autoforward", {
  "name": "autoforward",
  "command": [
    "autoforward",
    "autofw",
    "autofwd"
  ],
  "category": "group",
  "desc": "Auto forward pesan yang masuk ke grup ke grup ini",
  "usage": ".autoforward <on/off>",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
