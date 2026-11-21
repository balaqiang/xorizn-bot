// Fitur group/setdeskgc — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/setdeskgc", {
  "name": "setdeskgc",
  "command": [
    "setdeskgc",
    "setdescgc",
    "setdesk"
  ],
  "category": "group",
  "desc": "Mengubah deskripsi grup",
  "usage": ".setdeskgc <deskripsi baru>",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": true,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
