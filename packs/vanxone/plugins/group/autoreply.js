// Fitur group/autoreply — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/autoreply", {
  "name": "autoreply",
  "command": [
    "autoreply",
    "smarttrigger",
    "smarttriggers"
  ],
  "category": "group",
  "desc": "Mengatur autoreply/smart triggers per grup",
  "usage": ".autoreply on/off/add/del/list/private",
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
