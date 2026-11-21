// Fitur group/delppgc — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/delppgc", {
  "name": "delppgc",
  "command": [
    "delppgc",
    "delprofilegc",
    "delppgroup",
    "hapusppgc"
  ],
  "category": "group",
  "desc": "Menghapus foto profil grup",
  "usage": ".delppgc",
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
