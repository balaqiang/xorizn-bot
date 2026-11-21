// Fitur group/acc — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/acc", {
  "name": "acc",
  "command": [
    "acc",
    "accall",
    "joinrequest"
  ],
  "category": "group",
  "desc": "Kelola permintaan masuk grup (accept/reject)",
  "usage": ".acc <list|approve|reject> [all|nomor]",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": true,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
