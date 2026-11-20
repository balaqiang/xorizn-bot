// Fitur tools/delpp — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/delpp", {
  "name": "delpp",
  "command": [
    "delpp",
    "delprofilebot",
    "delppbot",
    "hapusppbot"
  ],
  "category": "tools",
  "desc": "Menghapus foto profil bot",
  "usage": ".delpp",
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
