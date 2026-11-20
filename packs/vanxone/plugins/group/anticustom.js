// Fitur group/anticustom — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/anticustom", {
  "name": "anticustom",
  "command": [
    "anticustom",
    "antiaddcustom",
    "customanti"
  ],
  "category": "group",
  "desc": "Bikin AntiCustom lewat sesi tanya jawab per langkah",
  "usage": ".anticustom <on/off/list/add/del/metode/cancel>",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": true,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
