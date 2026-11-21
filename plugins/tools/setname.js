// Fitur tools/setname — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/setname", {
  "name": "setnamebot",
  "command": [
    "setbotnama"
  ],
  "category": "tools",
  "desc": "Mengubah nama profil bot",
  "usage": ".setname <nama baru>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
