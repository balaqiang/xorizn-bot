// Fitur main/test — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("main/test", {
  "name": "test",
  "command": [
    "test"
  ],
  "category": "owner",
  "desc": "Test Poll Menu Interaktif",
  "usage": ".poll",
  "owner": false,
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
