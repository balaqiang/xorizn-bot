// Fitur owner/autosambut — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/autosambut", {
  "name": "autosambut",
  "command": [
    "autosambut",
    "sambutowner"
  ],
  "category": "group",
  "desc": "Mengatur fitur sambutan otomatis saat owner muncul setelah lama idle",
  "usage": ".autosambut on/off/delay/add/del/list",
  "owner": true,
  "group": true,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
