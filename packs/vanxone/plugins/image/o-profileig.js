// Fitur canvas/o-profileig — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/profileig", {
  "name": "profileig",
  "command": [
    "profileig"
  ],
  "category": "image",
  "desc": "Membuat canvas profile instagram",
  "usage": ".profileig <pengikut>|<mengikuti>|<postingan>|<username>|<bio>|<verif(true/false)>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
