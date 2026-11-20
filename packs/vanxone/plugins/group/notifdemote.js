// Fitur group/notifdemote — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/notifdemote", {
  "name": "notifdemote",
  "command": [
    "notifdemote"
  ],
  "category": "group",
  "desc": "Toggle notifikasi saat ada yang dicopot dari admin",
  "usage": ".notifdemote on/off",
  "owner": false,
  "group": true,
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
